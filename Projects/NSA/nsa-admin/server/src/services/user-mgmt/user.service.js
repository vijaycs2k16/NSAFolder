/**
 * Created by bharatkumarr on 20/03/17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    moment = require('moment')
    message = require('@nsa/nsa-commons').messages,
    domains = require('@nsa/nsa-commons').domains;
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    nsaElasticSearch = require('@nsa/nsa-elasticsearch'),
    nsabb = require('@nsa/nsa-bodybuilder').builderutil,
    constant = require('@nsa/nsa-commons').constants,
    es = require('../search/elasticsearch/elasticsearch.service'),
    userConverter = require('../../converters/user.converter'),
    logger = require('../../../config/logger'),
     _= require('lodash'),
    taxanomyService = require('../taxanomy/taxanomy.service'),
    userService = require('../user/user.service'),
    notificationService = require('../sms/notifications/notification.service'),
    models = require('@nsa/nsa-cassandra').Models,
    multer = require('multer'),
    baseService = require('../../../node_modules/@nsa/nsa-cassandra/src/services/common/base.service');
   var xlstojson = require("xls-to-json-lc");
   var xlsxtojson = require("xlsx-to-json-lc");

exports.getEmployee = function(req, res) {
    async.waterfall(
        [
            getDeptTaxanomy.bind(null, req),
            constructUserObj.bind(),
            constructEmpClassifyObj.bind(),
            getUser.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5003));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        }
    );
};

exports.getStudent = function(req, res) {
    var data = [];
    async.waterfall(
        [
            constructUserObj.bind(null, req, data),
            constructStudentClassifyObj.bind(),
            constructStudentContactObj.bind(),
            getUser.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5004));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        }
    );
};

exports.getEmployeesWithPermissions = function (req, res) {
    var havePermission = nsaCassandra.BaseService.haveAnyPermissions(req, constant.EMPLOYEE_PERMISSIONS);
    if(havePermission) {
        var param = domains.getParamObject(req);
        param.size = constant.DEFAULT_PARAM_SIZE;
        param.userType = 'Employee';
        var data = getElasticSearchQuery(req, constant.EMPLOYEE_PERMISSIONS, param);
        nsaElasticSearch.search.getPermissionsUsersByQuery(req, data, function (err, results, status) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5003));
            } else {
                events.emit('JsonResponse', req, res, results.data);
            }
        })
    }else {
        events.emit('JsonResponse', req, res, []);
    }

};

function getEmpTimetableDetails(req, res, searchParams){
    async.parallel({
            Employees : nsaElasticSearch.search.getUsersByQuery.bind(null, searchParams),
            SchoolTimetable: getEmpHours.bind(null, req)
        },
        function (err, result){
            if(err){
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, {message: message.nsa601});
            }else {
                getEmployeeTotalPeriods(req, res, result);
            }
        });
}

function getEmpHours(req, callback){
    nsaCassandra.Timetable.getEmpPeriods(req, function(err, result){
        callback(err, result);
    })

}
exports.getEmpHours = getEmpHours;

function getEmployeeTotalPeriods(req,  res, data){
    var empData = [];
    _.forEach(data.Employees[0], function(value){
        var emp =[];
        _.forEach(data.SchoolTimetable, function(value1){
            var formatedValue = baseService.getFormattedMap(value1.sub_emp_association);
            var findEmp =  _.map(formatedValue, function (e) {
                if(e.name == value.userName){return e;}else {return [];}
            });
            emp.push(_.flatten(findEmp));
        });
        var result = JSON.parse(JSON.stringify(value)), emp1 = _.flatten(emp);
        if(emp1.length){
            result.noOfPeriods = emp1.length;
        }else {
            result.noOfPeriods = 0;
        }
        empData.push(result);
    });
    events.emit("JsonResponse", req, res, empData);
}


exports.getAllEmployees = function (req, res) {
    var param = domains.getParamObject(req);
    param.size = constant.DEFAULT_PARAM_SIZE;
    param.userType = 'Employee';
    var searchParams = nsabb.getEmpSearchQuery(req, param);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5003));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.getActiveEmployees =function(req, res){
    var param = domains.getParamObject(req);
    param.size = constant.DEFAULT_PARAM_SIZE;
    param.userType = 'Employee';
    var searchParams = nsabb.getActiveEmployees(req, param);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5003));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};


exports.getAllStudents = function (req, res) {
    var searchParams = nsabb.getStudentSearchQueryParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5004));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.getAllStudentsWithPermissions = function (req, res) {
    var havePermission = nsaCassandra.BaseService.haveAnyPermissions(req, constant.ADD_STUDENT_PERMISSIONS);
    if(havePermission) {
        var data = getElasticSearchQuery(req, constant.ADD_STUDENT_PERMISSIONS, null);
        nsaElasticSearch.search.getPermissionsUsersByQuery(req, data, function (err, data, status) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5004));
            } else {
                events.emit('SearchResponse', req, res, data);
            }
        })
    } else {
        events.emit('JsonResponse', req, res, []);
    }
};

function getElasticSearchQuery (req, permissions, params) {
    var data = {};
    var typeParams = {};
    var checkPermission = nsaCassandra.BaseService.checkPermissionsToQuery(req, permissions);
    if(params != null && params.userType == constant.EMPLOYEE) {
        typeParams['userType'] = 'employee';
        data['searchParams'] = nsabb.getEmpSearchQuery(req, params);
    } else {
        typeParams['userType'] = 'student';
        data['searchParams'] = nsabb.getStudentSearchQueryParam(req);
    }

    data['permissions'] = permissions;
    if(checkPermission) {
        data.searchParams = nsabb.getUserByUserType(req, typeParams);
    }

    return data;
}

exports.getEmployeesByDept = function (req, res) {
    var param = domains.getParamObject(req);
    param.size = constant.DEFAULT_PARAM_SIZE;
    param.deptId = req.params.id;
    var searchParams = nsabb.getEmpByDeptQuery(req, param);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4006));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.getEmployeesBySubject = function (req, res) {
    var param = domains.getParamObject(req);
    param.size = constant.DEFAULT_PARAM_SIZE;
    param.subId = req.params.id;
    var searchParams = nsabb.getEmpBySubjectQuery(req, param);
    if(req.query.timetable){
        getEmpTimetableDetails(req, res, searchParams);
    } else {
        nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4006));
            } else {
                events.emit('JsonResponse', req, res, data);
            }
        })
    }
};

exports.addEmployeeInTaxonomy = function(req, res){
    var data = {};
    async.waterfall(
        [
        getAllEmployeeInUsers.bind(null, req, data),
        addEmployeeInTaxonomyObj.bind(),
        executeBatch.bind()
    ],function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5002));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa5017});
        }
    })
};

function getAllEmployeeInUsers(req, data, callback) {
    var headers = baseService.getHeaders(req);
     data.userType = constant.EMPLOYEE;
    data.school_id = headers.school_id;
    data.tenant_id = headers.tenant_id;
     userService.getAllSchoolEmp(req, data, function (err, result) {
        data.users = result;
        callback(err, req, data);
    })
};
exports.getAllEmployeeInUsers = getAllEmployeeInUsers;

function addEmployeeInTaxonomyObj(req, data, callback){
    nsaCassandra.Base.baseService.getAllEmployeesInTaxonomy(req, data, function(err, result){
        callback(err, req, result);
    })
};
exports.addEmployeeInTaxonomyObj = addEmployeeInTaxonomyObj;


exports.addTaxonomySchool = function(req, res) {

    setTimeout(function () {
        var data = [{message: message.nsa607}];
        events.emit('JsonResponse', req, res, data);
    }, 100)
    getAllSchoolData(req, function (err, schools) {
        _.forEach(schools, function (val, index) {
            /*async.parallel({
                academics: getAcademicYears.bind(null, req, val),
            }, function (err, result) {
                console.log("resultresultresult....",result)
                if (err) {
                    logger.debug(err);
                } else {
            */        async.waterfall([
                        getAllEmployeeInUsers.bind(null, req, val),
                        addEmployeeInTaxonomyObj.bind(),
                        executeBatch.bind()
                    ], function (err, result) {
                        if (err) {
                            console.info('err', err)
                            logger.debug(err);
                        }
                        else {
                            console.log("schools Data " + (index + 1) + "." + val.school_name + " Done")
                            if (index == (schools.length - 1)) {
                                console.log("All schools Done")
                            }

                        }
                    })
              /*  }
            })*/;

        })
    })
}

function getAllSchoolData(req, callback) {
    nsaCassandra.User.getAllSchools(req, function(err, result){
        callback(err, result);
    })
}


function getAcademicYears(req, val, callback){
    nsaCassandra.Academics.getAllSchoolAcademicYears(req, val, function(err, result){
        callback(err, result);
    })
}
exports.getAcademicYears = getAcademicYears;



exports.saveEmployee = function(req, res) {
    async.waterfall([
            fetchRole.bind(null, req, { userType: 'Employee' }),
            fetchAcademicYear.bind(),
            fetchSchoolCode.bind(),
            constructSaveEmp.bind(),
            constructSaveEmpClassify.bind(),
            buildEmpESObj.bind(),
            updateEmpESDoc.bind(),
            fetchEmpTaxonomy.bind(),
            addUserToTaxonomy.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5002));
            } else {
                var output = {id: result.user_name, message: message.nsa5001};
                events.emit('JsonResponse', req, res, output);
            }
        }
    )
};

function buildEmpESObj(req, data, callback) {
    async.parallel({
        dept : getDepartment.bind(null, req),
        desg : getDesignation.bind(null, req),
        subject : getSubjects.bind(null, req),
    }, function(err, response){
        if(err) {
            callback(err, req, null);
        } else {
            data['dept'] = response.dept || [];
            data['desg'] = response.desg || [];
            data['subject'] = response.subject || [];
            nsaCassandra.UserJson.buildEmpESObj(req, data, function(err, result) {
                callback(err, req, result);
            });
        }
    });
};
exports.buildEmpESObj = buildEmpESObj;

function getDepartment(req, callback) {
    nsaCassandra.Department.getAllDepartments(req, function (err, result) {
        callback(err, result);
    });
};
exports.getDepartment = getDepartment;

function getDesignation(req, callback) {
    nsaCassandra.Designation.getAllDesignations(req, function (err, result) {
        callback(err, result);
    });
};
exports.getDesignation = getDesignation;

function getSubjects(req, callback) {
    nsaCassandra.Subject.getSchoolSubjects(req, function (err, result) {
        callback(err, result);
    });
};
exports.getSubjects = getSubjects;

function updateEmpESDoc(req, data, callback) {
    es.updateEmpObj(req, data, function(err, result){
        callback(err, req, result);
    });
};
exports.updateEmpESDoc = updateEmpESDoc;

exports.saveStudent = function(req, res) {
    try {
        async.waterfall(
            [
                fetchRole.bind(null, req, {userType: 'Student'}),
                fetchSchoolCode.bind(),
                constructSaveStudent.bind(),
                fetchAcademicYear.bind(),
                constructSaveStudentClassify.bind(),
                constructSaveStudentContact.bind(),
                getParentLoginByNumber.bind(),
                createParentLoginForStudent.bind(),
                buildStudentESObj.bind(),
                updateStudentESDoc.bind(),
                addUserToTaxonomy.bind(),
                executeBatch.bind()
            ],
            function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5005));
                } else {
                    var output = {id: result.user_name, message: message.nsa5006};
                    events.emit('JsonResponse', req, res, output);
                }
            }
        )
    } catch (err) {
        logger.debug(err);
    }

};


exports.saveUserStudent = function(req, res) {
    try {
        async.waterfall(
            [
                fetchRole.bind(null, req, {userType: 'Student'}),
                fetchSchoolCode.bind(),
                constructSaveStudent.bind(),
                fetchAcademicYear.bind(),
                constructSaveStudentClassify.bind(),
                constructSaveStudentContact.bind(),
                getParentLoginByNumber.bind(),
                createParentLoginForStudent.bind(),
                buildStudentESObj.bind(),
                updateStudentESDoc.bind(),
                addUserToTaxonomy.bind(),
                executeBatch.bind()
            ],
            function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5005));
                } else {
                    var output = {id: result.user_name, message: message.nsa5006};
                    events.emit('JsonResponse', req, res, output);
                }
            }
        )
    } catch (err) {
        logger.debug(err);
    }

};

exports.updateStudentClassDetails = function(req, res){
    var oldYear = '2017-2018', newYear = '2018-2019';
    async.parallel({
        oldStudentDetails: getOldActiveStudents.bind(null, req, oldYear),
        newStudentDetails: getNewActiveStudents.bind(null, req, newYear)
    }, function(err, data){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5009));
        } else {
            async.waterfall([
                buildStudentObj.bind(null, req, data),
                saveESstudent.bind()
            ], function(err, result){
                if(err){
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5009));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa5010});
                }
            })
        }
    })
};

function buildStudentObj(req, data, callback) {
    var body = [];
    try{
        if(!_.isEmpty(data)) {
            _.forEach(data.newStudentDetails, function(value, index){
                var filterVal = _.filter(data.oldStudentDetails, { 'user_name': value.user_name });
                if(!_.isEmpty(filterVal)){
                    body.push( { "update": { "_index":  global.config.elasticSearch.index.userIndex, "_type": global.config.elasticSearch.index.studentType, "_id": value._id} });
                    body.push({"doc": {"preclasses": filterVal[0].classes}});
                }
                if(index == (data.newStudentDetails.length -1)) {
                    callback(null, req, body);
                }
            });

        } else {
            callback(null, req, []);
        }
    } catch (err) {
        callback(err, req, data);
    }
}

function saveESstudent(req, data, callback){
    var doc = _.chunk(data, constant.ES_100_CHUNK_SIZE);
    var results = {};
    for(var i = 0; i < doc.length; i++) {
        console.info('result = ', doc[i]);
        nsaElasticSearch.index.bulkDoc({
            body: doc[i]
        }, function (err,result) {
            console.info('result = ', result.items[0]);
            console.info('err = ', err);
            results = result;
        });
        if(i == (doc.length -1)) {
            callback(null, results);
        }
    }
}

function getOldActiveStudents(req, year, callback) {
    req.headers.academicyear = year;
    var searchParams = nsabb.getActiveStudentsParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data)
    })
}

function getNewActiveStudents(req, year, callback) {
    req.headers.academicyear = year;
    var searchParams = nsabb.getActiveStudentsParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data)
    })
}

function updateStudentESDoc(req, data, callback) {
    es.updateStudentObj(req, data, function(err, result){
        callback(err, req, result);
    });
};
exports.updateStudentESDoc = updateStudentESDoc;

function getDeptTaxanomy(req, callback) {
    var data = [];
    taxanomyService.deptCategories(req, function (err, result) {
        data['taxanomy'] = result;
        callback(err, req, data)
    })
};
exports.getDeptTaxanomy = getDeptTaxanomy;

function buildStudentESObj(req, data, callback) {
    console.log('buildStudentESObj........')
    async.parallel({
        languages : getLanguages.bind(null, req),
    }, function(err, response){
        if(err) {
            callback(err, req, null);
        } else {
            data['lang'] = response.languages;
            if(req.body._id) {
                data['_id'] =  req.body._id;
            } else {
                data['_id'] =  (models.uuid()).toString();
            }
            nsaCassandra.UserJson.buildStudentESObj(req, data, function(err, result) {
                callback(err, req, result);
            });
        }
    })
};
exports.buildStudentESObj = buildStudentESObj;

function getLanguages(req, callback) {
    nsaCassandra.Languages.getSchoolLanguages(req, function (err, result) {
        callback(err, result);
    });
};
exports.getLanguages = getLanguages;

exports.updateEmployee = function(req, res) {
    async.waterfall(
        [
            fetchRole.bind(null, req, { userType: 'Employee' }),
            fetchAcademicYear.bind(),
            fetchSchoolCode.bind(),
            constructUpdateEmp.bind(),
            constructUpdateEmpClassify.bind(),
            updateEmpNameInTaxonomy.bind(),
            buildEmpESObj.bind(),
            updateEmpESDoc.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5007));
            } else {
                var output = {id: result.user_name, message: message.nsa5008};
                events.emit('JsonResponse', req, res, output);
            }
        }
    );
};

exports.updateStudent = function(req, res) {
    var body = req.body;
    console.log('body..................',body)
    getNewPhoneNumberInMemberXref(req, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5009));
        }else if(body.old_primary_phone != body.primary_phone && !_.isEmpty(result)){
            events.emit('JsonResponse', req, res, message.nsa5018);
        }else {
            async.waterfall(
                [
                    fetchRole.bind(null, req, { userType: 'Student' }),
                    fetchSchoolCode.bind(),
                    constructUpdateStudent.bind(),
                    fetchAcademicYear.bind(),
                    constructDeleteStudentClassify.bind(),
                    constructSaveStudentClassify.bind(),
                    constructUpdateStudentContact.bind(),
                    updateContactInParentLogin.bind(),
                    buildStudentESObj.bind(),
                    updateStudentESDoc.bind(),
                    executeBatch.bind()
                ],
                function (err, result) {
                    if (err) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5009));
                    } else {
                        var output = {id: result.user_name, message: message.nsa5010};
                        events.emit('JsonResponse', req, res, output);
                    }
                }
            );
        }
    })
};

exports.findStudentInSchoolMembers = function(req, res){
    async.parallel({
        newPhoneNumber: getNewPhoneNumberInMemberXref.bind(null, req),
        oldPhoneNumber: getOldPhoneNumberInMemberXref.bind(null, req)
    }, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5009));
        }else if(!_.isEmpty(result.newPhoneNumber)) {
            result.message =  message.nsa5018;
            events.emit('JsonResponse', req, res, result);
        }else {
            result.message = null;
            events.emit('JsonResponse', req, res, result);
        }
    })
};

function getNewPhoneNumberInMemberXref(req, callback){
    var body = req.body;
    var findQuery = nsaCassandra.BaseService.getFindQuery(req);
        findQuery.member_user_name = body.primary_phone;
    nsaCassandra.User.studentInSchoolMemberXref(findQuery, function(err, result){
       callback(err, result);
    })
};
exports.getNewPhoneNumberInMemberXref =getNewPhoneNumberInMemberXref;

function getOldPhoneNumberInMemberXref(req, callback){
    var body = req.body;
    var findQuery = nsaCassandra.BaseService.getFindQuery(req);
    findQuery.member_user_name = body.old_primary_phone;
    nsaCassandra.User.studentInSchoolMemberXref(findQuery, function(err, result){
        callback(err, result);
    })
}

function findEmpInSchoolTimetable(req, data){
    var emp =[];
    _.forEach(data, function(value){
        var formatedValue = baseService.getFormattedMap(value.sub_emp_association);
        var findEmp =  _.map(formatedValue, function (e) {
            if(e.name == req.params.id){return e;}else {return [];}
        });
        emp.push(_.flatten(findEmp));
    });
    var emp1 = _.flatten(emp);
    if(emp1.length){
        return emp1.length;
    }else {
        return  0;
    }
}

exports.deleteEmployee = function(req, res) {
    async.parallel({
        empTimetable :  nsaCassandra.Timetable.getEmpPeriods.bind(null, req),
        classTimetable: nsaCassandra.Timetable.findEmpInClassTimetable.bind(null, req)
    }, function(err, data){
        var empPeriods = findEmpInSchoolTimetable(req, data.empTimetable);
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5013));
        }else if(empPeriods !== 0 && req.body.active == false || !_.isEmpty( data.classTimetable)){
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa19007});
        }else {
            async.waterfall([
                deactivateUser.bind(null, req),
                updateEmpTaxonomy.bind(),
                updateEmpESDoc.bind(),
                executeBatch.bind()
            ], function(err, result){
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5013));
                } else {
                    result['message'] = message.nsa5014;
                    events.emit('JsonResponse', req, res, result);
                }
            });
        }
    })
};

exports.passwordReset = function(req, res) {
    async.waterfall([
        resetPassword.bind(null, req),
        sendNotification.bind()
    ], function(err, result){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5011));
        } else {
            result['message'] = message.nsa012;
            events.emit('JsonResponse', req, res, result);
        }
    });

};

function resetPassword(req, callback) {
    nsaCassandra.UserMgmt.resetPassword(req, function (err, data) {
        callback(err, req, data)
    })
}
exports.resetPassword = resetPassword;

function sendNotification(req, data, callback) {
    async.waterfall([
            getTemplateForSMS.bind(null, req, data),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ],
        function (err, data) {
            callback(err, data)
    });
};
exports.sendNotification = sendNotification;

function getTemplateForSMS(req, data, callback) {
    nsaCassandra.UserMgmt.getTemplateForSMS(req, data, function(err, result){
        callback(err, req, result);
    })
};
exports.getTemplateForSMS = getTemplateForSMS;

function buildFeatureNotificationObj(req, templateObj, callback) {
    var body = req.body;
    var users = {users: [body]};
    body['notify'] = {sms: true, email: false, push: false};
    body['notifyTo'] = {status: 'Sent'};
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

exports.deleteStudent = function(req, res) {
    async.waterfall([
        deactivateUser.bind(null, req),
        updateStudentESDoc.bind(),
        getParentLoginDetials.bind(),
        getParentLoginsEsDetials.bind(),
        updateEsParentLoignDoc.bind(),
        executeBatch.bind()
    ], function(err, result){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5011));
        } else {
            result['message'] = message.nsa5012;
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.getUsersByClassSection = function (req, res) {
    es.getUsersByClassSection(req, function(err, data){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5004));
        } else {

            // events.emit('JsonResponse', req, res, data.hits.hits);
            events.emit('JsonResponse', req, res, userConverter.convertEsUsers(data));
        }
    })
};

function deactivateUser(req, callback){
    nsaCassandra.UserMgmt.deactivateUser(req, function(err, data) {
      callback(err, req, data);
    })
};
exports.deactivateUser = deactivateUser;

function getParentLoginDetials(req, data, callback){
    nsaCassandra.Member.getParentLoginDetials(req, data, function (err, result){
       callback(err, req, result);
    })
}
exports.getParentLoginDetials = getParentLoginDetials;

function updateEsParentLoignDoc(req, data, callback){
    nsaCassandra.Member.updateEsParentLoignDoc(req, data, function (err, result){
        callback(err, req, data);
    })
}
exports.updateEsParentLoignDoc = updateEsParentLoignDoc;

function getParentLoginsEsDetials(req, data, callback){
    nsaCassandra.Member.getParentLoginsEsDetials(req, data, function (err, result){
        callback(err, req, result);
    })
}
exports.getParentLoginsEsDetials = getParentLoginsEsDetials;

function constructUserObj(req, data, callback) {
    nsaCassandra.UserMgmt.getUser(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructUserObj = constructUserObj;

function constructEmpClassifyObj(req, data, callback) {
    nsaCassandra.UserClassify.getEmployee(req, data, function(err, data) {
        callback(err, data);
    })
}
exports.constructEmpClassifyObj = constructEmpClassifyObj;

function constructStudentClassifyObj(req, data, callback) {
    nsaCassandra.UserClassify.getStudent(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructStudentClassifyObj = constructStudentClassifyObj;

function constructStudentContactObj(req, data, callback) {
    nsaCassandra.UserContact.getStudent(req, data, function(err, data) {
        callback(err, data);
    })
}
exports.constructStudentContactObj = constructStudentContactObj;

function fetchSchoolCode(req, data, callback) {
    nsaCassandra.UserMgmt.getSchoolCode(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.fetchSchoolCode = fetchSchoolCode;


function fetchRole(req, data, callback) {
    nsaCassandra.UserMgmt.getRole(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.fetchRole = fetchRole;

function fetchAcademicYear(req, data, callback) {
    nsaCassandra.Academics.getAcademicYear(req, function(err, result) {
        if (result) {
            data.academic_year = JSON.parse(JSON.stringify(result));
        }
        callback(err, req, data);
    })
}
exports.fetchAcademicYear = fetchAcademicYear;

function constructSaveEmp(req, data, callback) {
    nsaCassandra.UserMgmt.saveEmployee(req, data, function(err, data) {
        console.log('data....',data)
        callback(err, req, data);
    })
}
exports.constructSaveEmp = constructSaveEmp;

function constructSaveStudent(req, data, callback) {
    nsaCassandra.UserMgmt.saveStudent(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructSaveStudent = constructSaveStudent;

function findUsernameInUsers(req, type, code, callback){
    async.waterfall(
        [
            fetchRole.bind(null, req, { userType: type }),
            fetchAcademicYear.bind(),
            fetchSchoolCode.bind(),
        ],function(err, req, data){
            var userCode = _.trim(req.body.user_code);
            var newUserCode = userCode.replace(/\s+/g, '');
            var userObj ={};
            userObj.user_name = newUserCode + data.schoolInfo.school_code + code; //emp_id || admissionNumber + school_code + E || S;
            if(err){
                callback(err, null)
            } else {
                nsaCassandra.User.findUsername(req, userObj, function (err, result) {
                    callback(err, result);
                })
            }
        }
    )
}

function constructSaveEmpClassify(req, data, callback) {
    nsaCassandra.UserClassify.saveEmployee(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.constructSaveEmpClassify = constructSaveEmpClassify;

function addUserToTaxonomy(req, data, callback) {
    nsaCassandra.Base.baseService.addTaxonomy(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.addUserToTaxonomy = addUserToTaxonomy;

function deleteUserFromTaxonomy(req, data, callback) {
    nsaCassandra.Base.baseService.addTaxonomy(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.deleteUserFromTaxonomy = deleteUserFromTaxonomy;

function fetchEmpTaxonomy(req, data, callback) {
    nsaCassandra.Base.baseService.getEmployeeTaxonomy(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.fetchEmpTaxonomy = fetchEmpTaxonomy;

function constructSaveStudentClassify(req, data, callback) {
    console.log('save.....')
    nsaCassandra.UserClassify.saveStudent(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.constructSaveStudentClassify = constructSaveStudentClassify;

function constructSaveStudentContact(req, data, callback) {
    nsaCassandra.UserContact.saveStudent(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructSaveStudentContact = constructSaveStudentContact;

function getParentLoginByNumber(req, data, callback){
    nsaCassandra.Member.findNumberInSchoolMember(req, data, function(err, result){
        callback(err, req, result)
    })
}

function createParentLoginForStudent(req, data, callback) {
    nsaCassandra.UserContact.saveParentLoginForStudent(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.createParentLoginForStudent = createParentLoginForStudent;

function constructUpdateEmp(req, data, callback) {
    nsaCassandra.UserMgmt.updateEmployee(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructUpdateEmp = constructUpdateEmp;

function constructUpdateStudent(req, data, callback) {
    nsaCassandra.UserMgmt.updateStudent(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructUpdateStudent = constructUpdateStudent;

function constructUpdateEmpClassify(req, data, callback) {
    nsaCassandra.UserClassify.updateEmployee(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructUpdateEmpClassify = constructUpdateEmpClassify;

function updateEmpTaxonomy(req, data, callback){
    data.updateValue = {status: JSON.parse(req.body.active)};
    nsaCassandra.Taxanomy.updateEmpStatusInTaxonomy(req, data, function(err, data){
        callback(err, req, data);
    })
}
exports.updateEmpTaxonomy = updateEmpTaxonomy;

function updateEmpNameInTaxonomy(req, data, callback){
    data.updateValue = {name: req.body.first_name};
    nsaCassandra.Taxanomy.updateEmpStatusInTaxonomy(req, data, function(err, data){
        callback(err, req, data);
    })
}
exports.updateEmpNameInTaxonomy = updateEmpNameInTaxonomy;

function constructUpdateStudentClassify(req, data, callback) {
    nsaCassandra.UserClassify.updateStudent(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructUpdateStudentClassify = constructUpdateStudentClassify;

function constructUpdateStudentContact(req, data, callback) {
    console.log('update...')
    nsaCassandra.UserContact.updateStudent(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructUpdateStudentContact = constructUpdateStudentContact;

function updateContactInParentLogin(req, data, callback) {
    console.log('updateContactInParentLogin......')
    nsaCassandra.User.updateContactInParentLogin(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.updateContactInParentLogin = updateContactInParentLogin;


function constructDeleteEmp(req, data, callback) {
    nsaCassandra.UserMgmt.deleteEmployee(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructDeleteEmp = constructDeleteEmp;

function constructDeleteStudent(req, data, callback) {
    nsaCassandra.UserMgmt.deleteStudent(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructDeleteStudent = constructDeleteStudent;

function constructDeleteEmpClassify(req, data, callback) {
    nsaCassandra.UserClassify.deleteEmployee(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructDeleteEmpClassify = constructDeleteEmpClassify;

function constructDeleteStudentClassify(req, data, callback) {
    console.log('delete.....')
    nsaCassandra.UserClassify.deleteStudent(req, data, function(err, data) {
        callback(err, req, data);
    })
}
exports.constructDeleteStudentClassify = constructDeleteStudentClassify;


function getUser(data, callback) {
    callback(null, data.user);
}
exports.getUser = getUser;

function getEsUser(req, callback) {
    var docs = getEsQuery(req.body);
    nsaElasticSearch.search.getUsersByMQuery({body : {"docs" : docs} }, function (err, data, status) {
        callback(err, data);
    })

}
exports.getEsUser = getEsUser;

function getEsQuery(params) {
    var docs = [];
    if(params.users.length > 0) {
        _.forEach(params.users ,function (val) {
            docs.push({
                "_index" : global.config.elasticSearch.index.userIndex,
                "_type" : global.config.elasticSearch.index.studentType,
                "_id" : val
            })
        })
    }

    return docs;
}


exports.getStudentReport = function(req, res) {
    var data = [];
    async.waterfall(
        [
            constructUserObj.bind(null, req, data),
            constructStudentClassifyObj.bind(),
            constructStudentContactObj.bind(),
            getUser.bind(),
            constructJson.bind(),
            async.apply(_generateReports, req)
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5004));
            } else {

                res.set({
                    'Content-type': 'application/pdf',
                    'Content-Length': result.pdf.length
                });
                events.emit('JsonResponse', req, res, result);
            }
        }
    );
};


exports.getStudentsReport = function(req, res) {
    var data = [];
    async.waterfall(
        [
            getEsUser.bind(null, req),
            async.apply(constructMultipleJson, req),
            _generateReports.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5004));
            } else {
                events.emit('JsonResponse', req, res, result);

            }
        }
    );
};


exports.getStudentsTcReport = function (req, res) {
    var data = [];
    async.waterfall(
        [
            getEsUser.bind(null, req),
            async.apply(constructMultipleJson, req),
            _generateTcReports.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5004));
            } else {
                events.emit('JsonResponse', req, res, result);

            }
        }
    );
};


exports.getClassStudentReport = function(req, res) {
    var data = [];
    async.waterfall(
        [
            getEsUser.bind(null, req),
            async.apply(constructMultipleClassJson, req),
            _generateReports.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildStudentErrResponse(err, message.nsa5004));
            } else {
                events.emit('JsonResponse', req, res, result);

            }
        }
    );
};


function  constructJson(result, callback) {
    var finalJson = {};
    var user = {};
    try {
        user.id = result.id != undefined ? result.id : " - ";
        user.tenant_id = result.tenant_id != undefined ? result.tenant_id : " - ";
        user.school_id = result.school_id != undefined ? result.school_id : " - ";
        user.school_name = result.school_name!= undefined ? result.school_name : " - ";
        user.user_name = result.user_name!= undefined ? result.user_name : " - ";
        user.user_code = result.user_code!= undefined ? result.user_code : " - ";
        user.short_name = result.short_name!= undefined ? result.short_name : " - ";
        user.date_of_joining = result.date_of_joining!= undefined ? result.date_of_joining : " - ";
        user.device_token = result.device_token!= undefined ? result.device_token : " - ";
        user.device_id = result.device_id!= undefined ? result.device_id : " - ";
        user.user_type = result.user_type!= undefined ? result.user_type : " - ";
        user.email = result.email!= undefined ?  result.email : " - ";
        user.primary_phone = result.primary_phone!= undefined ? result.primary_phone : " - ";
        user.blood_group = result.blood_group!= undefined ? result.blood_group : " - ";
        user.first_name = result.first_name!= undefined ? result.first_name : " - ";
        user.last_name = result.last_name!= undefined ? result.last_name : " - ";
        user.middle_name = result.middle_name!= undefined ? result.middle_name : " - ";
        user.gender = result.gender != undefined ? result.gender : null;
        user.date_of_birth = result.date_of_birth!= undefined ?  moment(result.date_of_birth).format('DD/MM/YYYY') : null;
        user.place_of_birth = result.place_of_birth!= undefined ? result.place_of_birth : " - ";
        user.nationality = result.nationality!= undefined ? result.nationality : " - ";
        user.community = result.community!= undefined ? result.community : " - ";
        user.mother_tongue = result.mother_tongue!= undefined ? result.mother_tongue  : " - ";
        user.is_hostel = result.is_hostel!= undefined ? result.is_hostel : false;
        user.profile_picture = result.profile_picture!= undefined ? global.config.aws.s3AccessUrl +  result.school_id  + "/" +  (result.profile_picture).replace(/ /g,"+") : null;
        user.title = result.title!= undefined ? result.title : " - ";
        if(result.medical_info!= undefined) {
            user.health = result.medical_info.health != null ? JSON.parse(result.medical_info.health).toString() : " - ";
            user.medical_data = result.medical_info.medical_data != null ? result.medical_info.medical_data : " - ";
        } else {
            user.health = " - ";
            user.medical_data = " - ";
        }


        user.height = result.height!= undefined ? result.height : " - ";
        user.weight = result.weight!= undefined ? result.weight : " - ";
        user.attachments = result.attachments!= undefined ? result.attachments : " - ";
        user.father_name = result.father_name!= undefined ? result.father_name : " - ";
        user.father_qualification = result.father_qualification!= undefined ? result.father_qualification : " - ";
        user.father_occupation = result.father_occupation!= undefined ? result.father_occupation : " - ";
        user.father_email = result.father_email!= undefined ? result.father_email  : " - ";
        user.father_phone = result.father_phone!= undefined ? result.father_phone  : " - ";
        user.father_income = result.father_income!= undefined ? result.father_income : " - ";
        user.mother_name = result.mother_name!= undefined ? result.mother_name : " - ";
        user.mother_qualification = result.mother_qualification!= undefined ? result.mother_qualification : " - ";
        user.mother_occupation = result.mother_occupation!= undefined ? result.mother_occupation : " - ";
        user.mother_email = result.mother_email!= undefined ? result.mother_email : " - ";
        user.mother_phone = result.mother_phone!= undefined ? result.mother_phone : " - ";
        user.mother_income = result.mother_income!= undefined ? result.mother_income : " - ";
        user.street_address1 = result.street_address1!= undefined ? result.street_address1  : " - ";
        user.street_address2 = result.street_address2!= undefined ?  result.street_address2 : " - ";
        user.city = result.city!= undefined ? result.city : " - ";
        user.state = result.state!= undefined ? result.state : " - ";
        user.pincode = result.pincode!= undefined ? result.pincode : " - ";
        user.country = result.country!= undefined ? result.country : " - ";
        user.present_street_address1 = result.present_street_address1!= undefined ? result.present_street_address1 : " - ";
        user.present_street_address2 = result.present_street_address2!= undefined ? result.present_street_address2 : " - ";
        user.present_city = result.present_city!= undefined ? result.present_city : " - ";
        user.present_state = result.present_state!= undefined ? result.present_state : " - ";
        user.present_pincode = result.present_pincode!= undefined ? result.present_pincode : " - ";
        user.additional_contact1_name = result.additional_contact1_name!= undefined ? result.additional_contact1_name : " - ";
        user.additional_contact1_relation = result.additional_contact1_relation!= undefined ?  result.additional_contact1_relation : " - ";
        user.additional_contact1_address = result.additional_contact1_address!= undefined ? result.additional_contact1_address : " - ";
        user.additional_contact1_phone = result.additional_contact1_phone!= undefined ? result.additional_contact1_phone : " - ";
        user.additional_contact2_name = result.additional_contact2_name!= undefined ? result.additional_contact2_name : " - ";
        user.additional_contact2_relation = result.additional_contact2_relation!= undefined ? result.additional_contact2_relation : " - ";
        user.additional_contact2_address = result.additional_contact2_address!= undefined ? result.additional_contact2_address : " - ";
        user.additional_contact2_phone = result.additional_contact2_phone!= undefined ? result.additional_contact2_phone : " - ";
        user.present_address = ((user.present_street_address1 != " - ") ? (user.present_street_address1 + ",") : " - " ) + ((user.present_street_address2 != " - ") ? (user.present_street_address2 + ",\n") : "" ) + ((user.present_city != " - ") ? (user.present_city + ",") : "" ) + ((user.present_state != " - ") ? (user.present_state + ",") : "") + ((user.present_pincode != " - ") ? (user.present_pincode) : "" ) + ((user.country != " - ") ? ("," + user.country + "\n") : "");
        user.address = ((user.street_address1 != " - ") ? (user.street_address1 + ",") : " - " ) + ((user.street_address2 != " - ") ? (user.street_address2 + ",\n") : "") + ((user.city != " - ") ? (user.city + ",") : "") + ((user.state != " - ") ? (user.state + ",") : "") + ((user.pincode != " - ") ? (user.pincode + ",") : "") + ((user.country != " - ") ? ("," + user.country + "\n") : "");
        var now = new Date();
        if(user.date_of_birth != null) {
            var dob = user.date_of_birth;
            var birthdate = dob.split('/');
            var born = new Date(birthdate[2], birthdate[1]-1, birthdate[0]);
            user.age = getAge(born,now);
        } else {
            user.age = " - ";
        }
        user.male = (user.gender != null && user.gender == 'male') ? 'https://d30y9cdsu7xlg0.cloudfront.net/png/3879-200.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Check_empty_font_awesome.svg/200px-Check_empty_font_awesome.svg.png';
        user.female = (user.gender != null && user.gender == 'female') ? 'https://d30y9cdsu7xlg0.cloudfront.net/png/3879-200.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Check_empty_font_awesome.svg/200px-Check_empty_font_awesome.svg.png';
        user.is_hostel1 = (!user.is_hostel) ? 'https://d30y9cdsu7xlg0.cloudfront.net/png/3879-200.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Check_empty_font_awesome.svg/200px-Check_empty_font_awesome.svg.png';
        user.is_hostel = (user.is_hostel) ? 'https://d30y9cdsu7xlg0.cloudfront.net/png/3879-200.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Check_empty_font_awesome.svg/200px-Check_empty_font_awesome.svg.png';
        finalJson.users = [user];
        callback(null, finalJson);
    } catch (err) {
        callback(err, finalJson);
    }

}


function  constructMultipleJson(req, result, callback) {
    try {
        var finalArrJson = [];
        _.forEach(result, function (value, index) {
            try {
                var finalJson = {};
                var user = {};

                user.id = value.id != undefined ? value.id : " - ";
                user.sno = index + 1;
                if (req.body.tcObj) {
                    var tcObj = _.filter(req.body.tcObj, {'id': value._id});
                    if (!_.isEmpty(tcObj)) {
                        user.conduct = JSON.parse(tcObj[0].conduct != null ? tcObj[0].conduct : " - ");
                        user.progress = JSON.parse(tcObj[0].progress != null ? tcObj[0].progress : " - ");
                        user.reasonofleave = JSON.parse(tcObj[0].reasonofleave != null ? tcObj[0].reasonofleave : " - ");
                        user.remarks = JSON.parse(tcObj[0].remarks != null ? tcObj[0].remarks : " - ");
                    }

                }
                user.adharcard_no = value.adharcard_no != undefined ? value.adharcard_no : " - "
                user.roll_no = value.roll_no != undefined ? value.roll_no : " - ";
                user.gr_no = value.gr_no != undefined ? value.gr_no : " - ";
                user.saral_id = value.saral_id != undefined ? value.saral_id : " - ";

                user.tenant_id = value.tenant_id != undefined ? value.tenant_id : " - ";
                user.school_id = value.school_id != undefined ? value.school_id : " - ";
                user.school_name = value.school_name != undefined ? value.school_name : " - ";
                user.user_name = value.user_name != undefined ? value.user_name : " - ";
                user.user_code = value.user_code != undefined ? value.user_code : " - ";
                user.short_name = value.short_name != undefined ? value.short_name : " - ";
                user.date_of_joining = value.date_of_joining != undefined ? value.date_of_joining : " - ";
                user.device_token = value.device_token != undefined ? value.device_token : " - ";
                user.device_id = value.device_id != undefined ? value.device_id : " - ";
                user.user_type = value.user_type != undefined ? value.user_type : " - ";
                user.email = value.email != undefined ? value.email : " - ";
                user.primary_phone = value.primary_phone != undefined ? value.primary_phone : " - ";
                user.blood_group = value.blood_group != undefined ? value.blood_group : " - ";
                user.first_name = value.first_name != undefined ? value.first_name : " - ";
                user.last_name = value.last_name != undefined ? value.last_name : " - ";
                user.middle_name = value.middle_name != undefined ? value.middle_name : " - ";
                user.gender = value.gender != undefined ? value.gender : null;
                user.date_of_birth = value.date_of_birth != undefined ? moment(value.date_of_birth).format('DD/MM/YYYY') : null;
                user.place_of_birth = value.place_of_birth != undefined ? value.place_of_birth : " - ";
                user.nationality = value.nationality != undefined ? value.nationality : " - ";
                user.community = value.community != undefined ? value.community : " - ";
                user.mother_tongue = value.mother_tongue != undefined ? value.mother_tongue : " - ";
                user.is_hostel = value.is_hostel != undefined ? value.is_hostel : false;
                user.profile_picture = value.profile_picture != undefined ? global.config.aws.s3AccessUrl + value.school_id + "/" + (value.profile_picture).replace(/ /g, "+") : null;
                user.title = value.title != undefined ? value.title : " - ";
                if (value.medical_info != undefined) {
                    user.health = value.medical_info.health != null ? JSON.parse(value.medical_info.health).toString() : " - ";
                    user.medical_data = value.medical_info.medical_data != null ? value.medical_info.medical_data : " - ";
                } else {
                    user.health = " - ";
                    user.medical_data = " - ";
                }


                user.height = value.height != undefined ? value.height : " - ";
                user.weight = value.weight != undefined ? value.weight : " - ";
                user.attachments = value.attachments != undefined ? value.attachments : " - ";
                if(value.parent_info != undefined) {
                    user.father_name = (value.parent_info.father_name != undefined &&  value.parent_info.father_name != null) ? value.parent_info.father_name : " - ";
                    user.father_qualification = (value.parent_info.father_qualification != undefined && value.parent_info.father_qualification != null) ? value.parent_info.father_qualification : " - ";
                    user.father_occupation = (value.parent_info.father_occupation != undefined && value.parent_info.father_occupation != null) ? value.parent_info.father_occupation : " - ";
                    user.father_email = (value.parent_info.father_email != undefined && value.parent_info.father_email != null) ? value.parent_info.father_email : " - ";
                    user.father_phone = (value.parent_info.father_phone != undefined && value.parent_info.father_phone != null) ? value.parent_info.father_phone : " - ";
                    user.father_income = (value.parent_info.father_income != undefined && value.parent_info.father_income != null) ? value.parent_info.father_income : " - ";
                    user.mother_name = (value.parent_info.mother_name != undefined && value.parent_info.mother_name != null) ? value.parent_info.mother_name : " - ";
                    user.mother_qualification = (value.parent_info.mother_qualification != undefined && value.parent_info.mother_qualification != null) ? value.parent_info.mother_qualification : " - ";
                    user.mother_occupation = (value.parent_info.mother_occupation != undefined && value.parent_info.mother_occupation != null) ? value.parent_info.mother_occupation : " - ";
                    user.mother_email = (value.parent_info.mother_email != undefined && value.parent_info.mother_email != null) ? value.parent_info.mother_email : " - ";
                    user.mother_phone = (value.parent_info.mother_phone != undefined && value.parent_info.mother_phone != null) ? value.parent_info.mother_phone : " - ";
                    user.mother_income = (value.parent_info.mother_income != undefined && value.parent_info.mother_income != null) ? value.parent_info.mother_income : " - ";
                } else {
                    user.father_name = " - ";
                    user.father_qualification = " - ";
                    user.father_occupation = " - ";
                    user.father_email = " - ";
                    user.father_phone = " - ";
                    user.father_income = " - ";
                    user.mother_name = " - ";
                    user.mother_qualification = " - ";
                    user.mother_occupation = " - ";
                    user.mother_email = " - ";
                    user.mother_phone = " - ";
                    user.mother_income = " - ";
                }

                if(value.address_info != undefined) {
                    user.present_street_address1 = (value.address_info.present_street_address1 != undefined && value.address_info.present_street_address1 != null) ? value.address_info.present_street_address1 : " - ";
                    user.present_street_address2 = (value.address_info.present_street_address2 != undefined && value.address_info.present_street_address2 != null)? value.address_info.present_street_address2 : " - ";
                    user.present_city = (value.address_info.present_city != undefined && value.address_info.present_city != null) ? value.address_info.present_city : " - ";
                    user.present_state = (value.address_info.present_state != undefined && value.address_info.present_state != null) ? value.address_info.present_state : " - ";
                    user.present_pincode = (value.address_info.present_pincode != undefined && value.address_info.present_pincode != null) ? value.address_info.present_pincode : " - ";
                    user.street_address1 = (value.address_info.street_address1 != undefined && value.address_info.street_address1 != null) ? value.address_info.street_address1 : " - ";
                    user.street_address2 = (value.address_info.street_address2 != undefined && value.address_info.street_address2 != null)? value.address_info.street_address2 : " - ";
                    user.city = (value.address_info.city != undefined && value.address_info.city != null) ? value.address_info.city : " - ";
                    user.state = (value.address_info.state != undefined && value.address_info.state != null) ? value.address_info.state : " - ";
                    user.pincode = (value.address_info.pincode != undefined && value.address_info.pincode != null) ? value.address_info.pincode : " - ";
                    user.country = (value.address_info.country != undefined && value.address_info.country != null) ? value.address_info.country : " - ";

                } else {
                    user.present_street_address1 = " - ";
                    user.present_street_address2 = " - ";
                    user.present_city = " - ";
                    user.present_state = " - ";
                    user.present_pincode = " - ";
                    user.street_address1 = " - ";
                    user.street_address2 = " - ";
                    user.city = " - ";
                    user.state = " - ";
                    user.pincode = " - ";
                    user.country = " - ";
                }



                if(value.additonal_contact_info != undefined) {
                    user.additional_contact1_name = (value.additonal_contact_info.additional_contact1_name != undefined && value.additonal_contact_info.additional_contact1_name != null) ? value.additonal_contact_info.additional_contact1_name : " - ";
                    user.additional_contact1_relation = (value.additonal_contact_info.additional_contact1_relation != undefined && value.additonal_contact_info.additional_contact1_relation != null) ? value.additonal_contact_info.additional_contact1_relation : " - ";
                    user.additional_contact1_address = (value.additonal_contact_info.additional_contact1_address != undefined && value.additonal_contact_info.additional_contact1_address != null)? value.additonal_contact_info.additional_contact1_address : " - ";
                    user.additional_contact1_phone = (value.additonal_contact_info.additional_contact1_phone != undefined && value.additonal_contact_info.additional_contact1_address != null) ? value.additonal_contact_info.additional_contact1_phone : " - ";
                    user.additional_contact2_name = (value.additonal_contact_info.additional_contact2_name != undefined && value.additonal_contact_info.additional_contact2_name != null) ? value.additonal_contact_info.additional_contact2_name : " - ";
                    user.additional_contact2_relation = (value.additonal_contact_info.additional_contact2_relation != undefined && value.additonal_contact_info.additional_contact2_relation != null) ? value.additonal_contact_info.additional_contact2_relation : " - ";
                    user.additional_contact2_address = (value.additonal_contact_info.additional_contact2_address != undefined && value.additonal_contact_info.additional_contact2_address != null) ? value.additonal_contact_info.additional_contact2_address : " - ";
                    user.additional_contact2_phone = (value.additonal_contact_info.additional_contact2_phone != undefined && value.additonal_contact_info.additional_contact2_phone != null) ? value.additonal_contact_info.additional_contact2_phone : " - ";
                } else {
                    user.additional_contact1_name = " - ";
                    user.additional_contact1_relation = " - ";
                    user.additional_contact1_address = " - ";
                    user.additional_contact1_phone = " - ";
                    user.additional_contact2_name = " - ";
                    user.additional_contact2_relation = " - ";
                    user.additional_contact2_address = " - ";
                    user.additional_contact2_phone = " - ";
                }
                user.className = value.classes ? value.classes[0].class_name : " - ";
                user.sectionName = value.classes ? value.classes[0].section_name : " - ";
                user.present_address = ((user.present_street_address1 != " - ") ? (user.present_street_address1 + ",") : " - " ) + ((user.present_street_address2 != " - ") ? (user.present_street_address2 + ",\n") : "" ) + ((user.present_city != " - ") ? (user.present_city + ",") : "" ) + ((user.present_state != " - ") ? (user.present_state + ",") : "") + ((user.present_pincode != " - ") ? (user.present_pincode) : "" ) + ((user.country != " - ") ? ("," + user.country + "\n") : "");
                user.address = ((user.street_address1 != " - ") ? (user.street_address1 + ",") : " - " ) + ((user.street_address2 != " - ") ? (user.street_address2 + ",\n") : "") + ((user.city != " - ") ? (user.city + ",") : "") + ((user.state != " - ") ? (user.state + ",") : "") + ((user.pincode != " - ") ? (user.pincode + ",") : "") + ((user.country != " - ") ? ("," + user.country + "\n") : "");
                var now = new Date();
                if (user.date_of_birth != null) {
                    var dob = user.date_of_birth;
                    var birthdate = dob.split('/');
                    var born = new Date(birthdate[2], birthdate[1] - 1, birthdate[0]);
                    user.age = getAge(born, now);
                } else {
                    user.age = " - ";
                }
                user.male = (user.gender != null && (user.gender).toLowerCase() == 'male') ? 'https://d30y9cdsu7xlg0.cloudfront.net/png/3879-200.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Check_empty_font_awesome.svg/200px-Check_empty_font_awesome.svg.png';
                user.female = (user.gender != null && (user.gender).toLowerCase() == 'female') ? 'https://d30y9cdsu7xlg0.cloudfront.net/png/3879-200.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Check_empty_font_awesome.svg/200px-Check_empty_font_awesome.svg.png';
                user.is_hostel1 = (!user.is_hostel) ? 'https://d30y9cdsu7xlg0.cloudfront.net/png/3879-200.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Check_empty_font_awesome.svg/200px-Check_empty_font_awesome.svg.png';
                user.is_hostel = (user.is_hostel) ? 'https://d30y9cdsu7xlg0.cloudfront.net/png/3879-200.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Check_empty_font_awesome.svg/200px-Check_empty_font_awesome.svg.png';

                } catch (err) {
                    console.log("er...........", err)
                }
                finalArrJson.push(user);
            if(index == (result.length -1)) {
                finalJson.users = finalArrJson;
                callback(null, req, finalJson);
            }
        })
    } catch (err) {

    }


}

function  constructMultipleClassJson(req, result, callback) {
    try {
        var finalArrJson = [];
        _.forEach(result, function (value, index) {
            try {
                var finalJson = {};
                var user = {};
                user.sno = index + 1;
                user.id = value.id != undefined ? value.id : " - ";
                user.tenant_id = value.tenant_id != undefined ? value.tenant_id : " - ";
                user.school_id = value.school_id != undefined ? value.school_id : " - ";
                user.school_name = value.school_name != undefined ? value.school_name : " - ";
                user.user_name = value.user_name != undefined ? value.user_name : " - ";
                user.user_code = value.user_code != undefined ? value.user_code : " - ";
                user.short_name = value.short_name != undefined ? value.short_name : " - ";
                user.first_name = value.first_name != undefined ? value.first_name : " - ";
                user.className = value.classes ? value.classes[0].class_name : " - ";
                user.sectionName = value.classes ? value.classes[0].section_name : " - ";

            } catch (err) {
                console.log("er...........", err)
            }
            finalArrJson.push(user);
            if(index == (result.length -1)) {
                finalJson.users = finalArrJson;
                var users = [];
                var finalData = {};
                var data = _.groupBy(finalArrJson, 'sectionName');

                _.map(data, function (value, key) {
                    var classData = {};
                    classData['className'] = value[0].className;
                    classData['sectionName'] = value[0].sectionName;
                    classData['users'] = value;
                    users.push(classData);
                })
                var data = _.orderBy(users, ['sectionName'], ['asc']);
                _.forEach(data, function (val, index) {
                    val.sno = index + 1;
                })
                finalData['classData'] = data;
                callback(null, req, finalData);
            }
        })

    } catch (err) {
        console.log("er...........", err)
    }


}

function getAge(born, now) {
    var birthday = new Date(now.getFullYear(), born.getMonth(), born.getDate());
    if (now >= birthday)
        return now.getFullYear() - born.getFullYear();
    else
        return now.getFullYear() - born.getFullYear() - 1;
}


function _generateTcReports(req, params, callback) {
    try {
        var jasper = require('perfx-node-jasper')({
            path: path.join(__dirname, '/../../../node_modules/perfx-node-jasper/lib/jasperreports-6.4.3/'),
            reports: {
                stock_ofertas: {
                    jasper: path.join(__dirname, '../../common/student-details/multi-student-tc.jasper'),
                    jrxml: path.join(__dirname, '../../common/student-details/multi-student-tc.jrxml'),
                    conn: 'in_memory_json'
                }
            }
        });


        jasper.ready(function () {
            var r = jasper.export(
                {
                    report: 'stock_ofertas',
                    data: {},
                    dataset: params
                },
                'pdf'
            );
            params.pdf = r;
            callback(null, params);
        });
    } catch (err) {
        console.log(err);
        callback(err, null)

    }
}


function _generateReports(req, params, callback) {
    try {
        if(req.body.promotions != undefined) {
            var jasper = require('perfx-node-jasper')({
                path: path.join(__dirname , '/../../../node_modules/perfx-node-jasper/lib/jasperreports-6.4.3/'),
                reports: {
                    stock_ofertas: {
                        jasper: path.join(__dirname , '../../common/student-details/class_report.jasper'),
                        jrxml: path.join(__dirname , '../../common/student-details/class_report.jrxml'),
                        conn: 'in_memory_json'
                    }
                }
            });
        } else {
            var jasper = require('perfx-node-jasper')({
                path: path.join(__dirname , '/../../../node_modules/perfx-node-jasper/lib/jasperreports-6.4.3/'),
                reports: {
                    stock_ofertas: {
                        jasper: path.join(__dirname , '../../common/student-details/multi-student.jasper'),
                        jrxml: path.join(__dirname , '../../common/student-details/multi-student.jrxml'),
                        conn: 'in_memory_json'
                    }
                }
            });
        }

       /* var data = {"hallticket":{"venue":"Chennai - Porur","order":1512993975427,"name":"Vignesh","class":"XII","Scholarship":[{"name":"Solitaire","waiver":"40%","score":"Above 85% in VAT"},{"name":"Emerald","waiver":"30%","score":"Above 75% in VAT"},{"name":"Ruby","waiver":"25%","score":"Above 65% in VAT"},{"name":"Sapphire","waiver":"15%","score":"Above 55% in VAT"},{"name":"Pearl","waiver":"10%","score":"Above 45% in VAT"}]}};
        try {
            if(req.body.promotions != undefined) {
                var jasper = require('perfx-node-jasper')({
                    path: path.join(__dirname , '/../../../node_modules/perfx-node-jasper/lib/jasperreports-6.4.3/'),
                    reports: {
                        stock_ofertas: {
                            jasper: path.join(__dirname , '../../common/student-details/hallticket.jasper'),
                            jrxml: path.join(__dirname , '../../common/student-details/hallticket.jrxml'),
                            conn: 'in_memory_json'
                        }
                    }
                });
            } else {
                var jasper = require('perfx-node-jasper')({
                    path: path.join(__dirname , '/../../../node_modules/perfx-node-jasper/lib/jasperreports-6.4.3/'),
                    reports: {
                        stock_ofertas: {
                            jasper: path.join(__dirname , '../../common/student-details/hallticket.jasper'),
                            jrxml: path.join(__dirname , '../../common/student-details/hallticket.jrxml'),
                            conn: 'in_memory_json'
                        }
                    }
                });
            }*/
        jasper.ready(function() {
            var r = jasper.export(
                {
                    report: 'stock_ofertas',
                    data: {},
                    dataset: params
                },
                'pdf'
            );
            params.pdf = r;
            callback(null, params);
        });


    } catch (err) {
        console.log(err);
        callback(err, null)

    }

}

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
}
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.EMPLOYEE, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

function buildStudentErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.STUDENT, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

function bulkStudent(req, res, result) {
    async.eachSeries(result, function (user, callback) {
        user.primary_phone = (user.primary_phone).toString();
        user.user_code = (user.user_code).toString();
        user.additional_contact1_phone = (user.additional_contact1_phone).toString();
        user.father_phone = (user.father_phone).toString();
        user.mother_phone = (user.mother_phone).toString();
        user.isHostel  = user.isHostel == '0' ? false : true;
        user.transport_required  = user.transport_required == '0' ? false : true;
        user.primary_contact  = user.primary_contact == '0' ? false : true;
        user.primary_contact  = user.primary_contact == '0' ? false : true;
        user.primary_email  = user.primary_email == '0' ? false : true;
        user.sameAsFather  = user.sameAsFather == '0' ? false : true;
        user.sameAsMother  = user.sameAsMother == '0' ? false : true;
        user.sameAs  = user.sameAs == '0' ? false : true;
        req.body = JSON.parse(JSON.stringify(user));
        try {
            async.waterfall(
                [
                    fetchRole.bind(null, req, {userType: 'Student'}),
                    fetchSchoolCode.bind(),
                    constructSaveStudent.bind(),
                    fetchAcademicYear.bind(),
                    constructSaveStudentClassify.bind(),
                    constructSaveStudentContact.bind(),
                    getParentLoginByNumber.bind(),
                    createParentLoginForStudent.bind(),
                    buildStudentESObj.bind(),
                    updateStudentESDoc.bind(),
                    addUserToTaxonomy.bind(),
                    executeBatch.bind()
                ],
                function (err, result) {
                    /* if (err) {
                     logger.debug(err);
                     events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5005));
                     } else {
                     var output = {id: result.user_name, message: message.nsa5006};

                     events.emit('JsonResponse', req, res, output);
                     }*/
                    callback();
                }
            )
        } catch (err) {
            logger.debug(err);
        }

    }, function(err) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5005));
        } else {
            events.emit('JsonResponse', req, res, "sucesss");
        }

    });
}

exports.saveBulkStudent = function(req, res) {
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });

    var upload = multer({ //multer settings
        storage: storage,
        fileFilter : function(req, file, callback) { //file filter
            if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                return callback(new Error('Wrong extension type'));
            }
            callback(null, true);
        }
    }).single('file');

    try {
        upload(req, res,function(err){
            if(err){
                res.json({error_code:1,err_desc:err});
                return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {

                var convertExcel = require('excel-as-json').processFile;
                var options = {
                    sheet: '1',
                }

                convertExcel(req.file.path, null, options, function (err, result) {
                    if (err) {
                        return res.json({error_code: 1, err_desc: err, data: null});
                    }
                    var fs = require('fs');
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (e) {
                        //error deleting the file
                    }
                    bulkStudent(req, res, JSON.parse(JSON.stringify(result)))
                    //bulkLead(req, res, result, next)
                })


                /*exceltojson({
                 input: req.file.path,
                 output: null, //since we don't need output.json
                 lowerCaseHeaders:true
                 }, function(err,result){
                 if(err) {
                 return res.json({error_code:1,err_desc:err, data: null});
                 }
                 res.json({error_code:0,err_desc:null, data: result});
                 });*/
            } catch (e){
                console.log("er", e)
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
    }catch (e){
        console.log("er", e)
        res.json({error_code:1,err_desc:"Corupted excel file"});
    }


};
