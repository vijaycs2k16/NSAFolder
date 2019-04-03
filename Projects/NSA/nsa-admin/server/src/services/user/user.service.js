/**
 * Created by karthik on 05-01-2017.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    es = require('../../services/search/elasticsearch/elasticsearch.service'),
    _ = require('lodash'),
    async = require('async'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger'),
    student = require('../user-mgmt/user.service'),
    notificationService = require('../sms/notifications/notification.service'),
    gallary = require('../gallery/gallery.service');

exports.getUserDetail = function(req, res) {
    nsaCassandra.User.getUserDetail(req, function(err, request, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa601});
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.saveUser = function(req, res) {
    nsaCassandra.User.saveUser(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa602});
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};


exports.saveSUser = function(req, res) {
    req.query.demo = true;
    if(req.body.user_type == 'Student') {
        async.waterfall([
            student.fetchRole.bind(null, req, {userType: 'Student'}),
            student.fetchSchoolCode.bind(),
            student.constructSaveStudent.bind(),
            fetchAcademicYear.bind(),
            student.constructSaveStudentClassify.bind(),
            student.buildStudentESObj.bind(),
            student.updateStudentESDoc.bind(),
            executeBatch.bind()
        ], function(err, result) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, {message: message.nsa602});
            } else {
                sendNotification(req, function (err, result) {
                    if(err) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, {message: message.nsa22006});
                    } else {
                        events.emit('JsonResponse', req, res, result);
                    }
                })
            }
        })
    } else {
        async.waterfall([
            student.fetchRole.bind(null, req, {userType: 'Employee'}),
            student.fetchSchoolCode.bind(),
            fetchAcademicYear.bind(),
            student.constructSaveEmp.bind(),
            //student.constructSaveEmpClassify.bind(),
            student.buildEmpESObj.bind(),
            student.updateEmpESDoc.bind(),
            //student.fetchEmpTaxonomy.bind(),
            //student.addUserToTaxonomy.bind(),
            executeBatch.bind()
        ], function(err, result) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, {message: message.nsa602});
            } else {
                sendNotification(req, function (err, result) {
                    if(err) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, {message: message.nsa22006});
                    } else {
                        events.emit('JsonResponse', req, res, result);
                    }
                })

            }
        })
    }


};


function fetchAcademicYear(req, data, callback) {
    nsaCassandra.Academics.getCurrentAcademicYear(req, function(err, result) {
        if (result) {
            data.academic_year = JSON.parse(JSON.stringify(result));
        }
        callback(err, req, data);
    })
}


function sendNotification(req, callback){
    req.body.notifyTo = {}
    req.body.notify = {}
    req.body.notifyTo.status = 'Sent';
    req.body.notify.sms = true;
    var data = {};
    async.waterfall([
            buildUsers.bind(null, req, data),
            getUserTemplate.bind(),
            getTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ],
        function (err, data) {
            if(err) {
                callback(err, null)
            } else {
                callback(null, data)
            }
        }
    )
}

function getUserTemplate(req, users, callback) {
    req.headers.id = constant.USERONBOARD_SUB;
    var data = { featureId: constant.USERONBOARD, subFeatureId: constant.USERONBOARD_SUB, action: constant.CREATE_ACTION, userType: constant.STUDENT };
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getUserTemplate = getUserTemplate;

function getTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.attendancebase.getUserTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getTemplateObj = getTemplateObj;

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        notificationObj.isDetailedNotification = true,
            notificationObj.replacementKeys = [constant.FIRST_NAME]
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

function buildUsers(req, data, callback) {
    var user = {};
    user.primaryPhone = req.body.primary_phone;
    user.userName = req.body.user_name;
    user.firstName = req.body.first_name;
    data['users'] = [user];
    data['students'] = [user] || null;
    callback(null, req,  data);
}

exports.updateUser = function(req, res) {
    async.waterfall([
        getUser.bind(null,req),
        updateUserLoginDetails.bind(),
        executeBatch.bind()
    ], function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa604});
        } else {
            async.waterfall([
                getUser.bind(null,req),
                getESUser.bind(),
                updateElasticSearchDoc.bind()
            ], function(err, response){
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa604});
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa605});
                }
            })
        }
    });
};
exports.updateSiblings = function(req, res) {
    async.waterfall([
        getUsersByUserIds.bind(null,req),
        updateSiblingsLoginDetails.bind(),
        executeBatch.bind()
    ], function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa604});
        } else {
            async.waterfall([
                getUsersByUserIds.bind(null,req),
                getESUsers.bind(),
                updateSiblingsElasticSearchDoc.bind()
            ], function(err, response){
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa604});
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa605});
                }
            })
        }
    });
};

function getESUser(req, data, callback) {
    var obj = {};
    obj.empUserName = req.body.username;
    obj.userType = data.user_type;
    es.getLoginUserObj(req, obj, function(err, response){
        if(_.isEmpty(response)) {
            data.esUser = []
            callback(err, req, data)
        } else {
            data.esUser = response
            callback(err, req, data);
        }
    })
};
exports.getESUser = getESUser;

function getESUsers(req, data, callback) {
    var obj = {};
    obj.userNames = req.body.username;
    es.getUsersByLists(req, obj, function(err,response){
        if(_.isEmpty(response)) {
            data.esUser = []
            callback(err, req, data)
        } else {
            data.esUser = response
            callback(err, req, data)
        }
    })
};
exports.getESUsers = getESUsers;

function updateElasticSearchDoc(req, data, callback) {
    var userType = data.user_type;
    if (userType == constant.STUDENT) {
        es.updateStudent(req, data, function(err, response){
            callback(err, req, data);
        })
    } else {
        es.updateEmployee(req, data, function(err, response){
            callback(err, req, data);
        })
    }

};
exports.updateElasticSearchDoc = updateElasticSearchDoc;

function updateSiblingsElasticSearchDoc(req, data, callback) {
    es.updateSiblings(req, data, function(err, response){
        callback(err, data);
    })
};
exports.updateSiblingsElasticSearchDoc = updateSiblingsElasticSearchDoc;

function getUser(req, callback) {
    nsaCassandra.User.getUser(req, function(err, response) {
        callback(err, req, response);
    })
};
exports.getUser = getUser;

function getUsersByUserIds(req, callback) {
    nsaCassandra.User.getUsersByUserIds(req, function(err, response) {
        callback(err, req, response);
    })
};
exports.getUsersByUserIds = getUsersByUserIds;

function updateSiblingsLoginDetails(req, data, callback) {
    nsaCassandra.User.updateSiblingsLoginDetails(req, data, function(err, response) {
        callback(err, req, response);
    })
};
exports.updateUserLoginDetails = updateUserLoginDetails;

function updateUserLoginDetails(req, data, callback) {
    nsaCassandra.User.updateUserLoginDetails(req, data, function(err, response) {
        callback(err, req, response);
    })
};
exports.updateUserLoginDetails = updateUserLoginDetails;

exports.getUserContactDetails = function(req, res) {
    nsaCassandra.User.getUserContactDetails(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa601});
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.updateUserContactDetails = function(req, res) {
    nsaCassandra.User.updateUserContactDetails(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa604});
        } else {
            response['message'] = message.nsa605;
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getAllUsers =function(req, res){
    nsaCassandra.User.getAllUsers(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa601});
        }else {
            events.emit('JsonResponse',req, res, result);
        }
    })
};

exports.getUserClassification =function(req, res){
    nsaCassandra.User.getUserClassification(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
        }else {
            events.emit('JsonResponse',req, res, result);
        }
    })
};

exports.getAllEmployees =function(req, res){
    nsaCassandra.User.getAllEmployees(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa601});
        }else {
            events.emit('JsonResponse',req, res, result);
        }
    })
};

exports.updateUserAttachments = function(req, res) {
    var body = req.body;
    nsaCassandra.User.updateUserAttachments(req, function(err, result){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4702));
        } else {
            if(body.userType == global.config.elasticSearch.index.studentType) {
                var data = {};
                data.userESObj = {"profile_picture" : _.isEmpty(body.profile) ? null : body.profile[0].id, "attachments" : body.attachments, "user_name": req.params.id}
                updateStudentESDoc(req, data, function(err, req, result){
                    if (err) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4702));
                    } else {
                        var output = {message: message.nsa4701};
                        events.emit('JsonResponse', req, res, output);
                    }

                })
            } else {
                var output = {message: message.nsa4701};
                events.emit('JsonResponse', req, res, output);
            }


        }
    })
};

function updateStudentESDoc(req, data, callback) {
    es.updateStudentObj(req, data, function(err, result){
        callback(err, req, result);
    });
};
exports.updateStudentESDoc = updateStudentESDoc;

exports.deleteUserAttachments = function(req, res) {
    nsaCassandra.User.deleteUserAttachment(req, function(err, result){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4704));
        } else {
            req.body.seletedImageIds = [req.body.curentFile];
            gallary.deleteS3Src(req, function(err, result1){
                if(err){
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4704));
                }else {
                    var output = { message: message.nsa4703, data: req.body};
                    events.emit('JsonResponse', req, res, output);
                }
            });
        }
    })
};

/*exports.getAllStudentUsers = function(req, res){
    getAllStudentUsers(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa601});
        }else {
            events.emit('JsonResponse',req, res, result);
        }
    })
};*/

function getAllUsersInUser(req, userType, callback) {
    nsaCassandra.User.getAllUsersInUser(req, userType, function(err, result){
        callback(err, result)
    })
};
exports.getAllUsersInUser = getAllUsersInUser;

function getAllSchoolEmp(req, data, callback) {
    nsaCassandra.User.getSchoolEmp(req, data, function(err, result){
        callback(err, result)
    })
};
exports.getAllSchoolEmp = getAllSchoolEmp;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    responseBuilder.buildResponse(constant.USER_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;