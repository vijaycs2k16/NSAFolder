var mongoose = require('mongoose');
var studentSchema = mongoose.Schemas.Student;
var userSchema = mongoose.Schemas.User;
var studentLeaveSchema = mongoose.Schemas.StudentLeave;
var studentDetailsSchema = mongoose.Schema.StudentDetails;
var studentFeeDetailsSchema = mongoose.Schema.StudentFeeDetails;
var NotificationSchema = mongoose.Schemas.StudentNotifications;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');
var ObjectId = mongoose.Schema.Types.ObjectId;
var _ = require('lodash');
var FilterMapper = require('../helpers/filterMapper');
var filterMapper = new FilterMapper();
var studentConverter = require('../converters/vStudent.converter');
var WorkflowHandler = require('./workflow');
var moment = require('../public/js/libs/moment/moment');
var baseService = require('../handlers/baseHandler');


var Module = function (models) {
    var purchaseOrdersSchema = mongoose.Schemas.purchaseOrders;
    var JobsSchema = mongoose.Schemas.jobs;
    var objectId = mongoose.Types.ObjectId;

    var exporter = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').Student;
    var CONSTANTS = require('../constants/mainConstants.js');
    var lookupForStudentArray = CONSTANTS.LOOKUP_FOR_STUDENT_ARRAY;

    var rewriteAccess = require('../helpers/rewriteAccess');
    var ratesService = require('../services/rates')(models);
    var OrderSchema = mongoose.Schemas.Order;
    var OrderRowsSchema = mongoose.Schemas.OrderRow;
    var HistoryService = require('../services/history.js')(models);
    var path = require('path');
    var ratesRetriever = require('../helpers/ratesRetriever')();

    var InvoiceSchema = mongoose.Schemas.Invoices;
    var purchaseInvoicesSchema = mongoose.Schemas.purchaseInvoices;
    var OrderSchema = mongoose.Schemas.Order;
    var CustomerSchema = mongoose.Schemas.Customer;
    var OrderRowsSchema = mongoose.Schemas.OrderRow;
    var PrepaymentSchema = mongoose.Schemas.Prepayment;

    var access = require('../helpers/access.js')(models);
    var rewriteAccess = require('../helpers/rewriteAccess');
    var workflowHandler = new WorkflowHandler(models);
    var JobsService = require('../services/jobs.js')(models);
    var ratesRetriever = require('../helpers/ratesRetriever')();



    this.create = function (req, res, next) {
       saveStudent(req, function (err, result) {
           if (err) {
               return next(err);
           }
           res.status(201).send(result);
       })
    };

    function saveStudent(req, next) {
        var Model = models.get('CRM', 'Student', studentSchema);
        var body = req.body;
        var Student = new Model(body);
        Student.save(function (err, result) {
            next(err, result);
        });
    }
    exports.saveStudent = saveStudent

     this.newStudentRegister = function(req, data, next) {
         var body = req.body;
         if(body.existingStudentId){
             studentUpdate(req, function (err, result) {
                 if (result)
                     data.studentId = body.existingStudentId;
                 next(err, req, data)
             })
         }else {
             saveStudent(req, function (err, result) {
                 if(result)
                     data.studentId = result._id
                 next(err, req, data)
             })
         }
    }

    function studentUpdate(req, next) {
        var body = req.body;
        body.createDate = Date.now();
        var StudentModel = models.get(getDb(req), 'Student', studentSchema);
        StudentModel.update({_id: body.existingStudentId}, body , function(err, result, rawResponse) {
            if (err) {
                return next(err);
            }
            next(err, result)
        })
    };

    //details Model

    this.createStudentDetails = function (req, res, next) {
        saveStudentDetails(req, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(201).send(result);
        })
    };

    function saveStudentDetails(req, next) {
        var StudentDetailsModel = models.get('CRM', 'StudentDetails', studentDetailsSchema);
        var body = req.body;
        var StudentDetailsModel = new StudentDetailsModel(body);
        StudentDetailsModel.save(function (err, result) {
            next(err, result)
        });
    }

    this.addStudentDetails = function(req, data, next) {
        var body = req.body;
        if(body.existingStudentId && body.exitsingStudentDetailsId){
            studentDetailsUpdate(req, function (err, result) {
                if (result)
                    req.body.studentDetails = body.exitsingStudentDetailsId;
                next(err, req, data)
            })
        }else {
            saveStudentDetails(req, function (err, result) {
                if (result)
                    req.body.studentDetails = result._id
                next(err, req, data)
            })
        }
    }

    function studentDetailsUpdate (req, next){
        var StudentDetails = models.get(getDb(req), 'StudentDetails', studentDetailsSchema);
        var body = req.body;
        StudentDetails.update({_id: body.exitsingStudentDetailsId}, body , function(err, result) {
            if (err) {
                return next(err);
            }
            next(err, result)
        });
    }

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Student', studentSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var filter = data.filter || {};
        var optionsObject = {};
        var queryObject = {};
        queryObject.$and = [];
        var contentType = data.contentType;

        if(req.session.profileId === 1522230115000){
            var matchQuery = { center: req.session.cId };
        }

        if (filter && typeof filter === 'object') {
            optionsObject = filterMapper.mapFilter(filter, {
                contentType: contentType
            });
        }
        if(optionsObject) {
            queryObject.$and.push(optionsObject);
        }
        getTotal = function (cb) {
            Model
                .find(matchQuery ? matchQuery : {})
                .count(function (err, result) {
                    if (err) {
                        return cb(err);
                    }
                    cb(null, result || 0);
                });
        };

        getData = function (cb) {
            Model
                .find(matchQuery ? matchQuery : {})
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate([{path : 'studentDetails'},{path : 'batch'}, {path: 'course'},{path: 'center'}])
                .exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }
                    cb(null, result);
                });
        };
        if(!_.isEmpty(optionsObject)) {
            Model.aggregate([ {
                    "$lookup": {
                        "from": "StudentDetails",
                        "localField": "studentDetails",
                        "foreignField": "_id",
                        "as": "studentDetails"
                    }
                },
                {
                    "$lookup": {
                        "from": "Center",
                        "localField": "center",
                        "foreignField": "_id",
                        "as": "center"
                    }
                },
                {
                    "$lookup": {
                        "from": "Course",
                        "localField": "course",
                        "foreignField": "_id",
                        "as": "course"
                    }
                },{
                    "$lookup": {
                        "from": "Batch",
                        "localField": "batch",
                        "foreignField": "_id",
                        "as": "batch"
                    }
                },

                {$unwind: "$course"},
                {$unwind: "$center"},
                {
                    $match: queryObject
                }], function (err, result) {
                if (err) {
                    return next(err);
                }
                if(!_.isEmpty(result)) {
                    var data = [result.length, result];
                    studentsFormatedResult(res, data);
                } else {
                    res.status(200).send({data: []});
                }


            });
        } else {
            async.parallel([getTotal, getData], function (err, result) {
                if (err) {
                    return next(err);
                }
                studentsFormatedResult(res, result)
            });
        }
    };

    function studentsFormatedResult(res, result){
        if(_.isEmpty(result[1])){
            res.status(200).send({total: result[0], data: result[1]});
        }else {
            studentConverter.studentObjs(result[1], function (err, formatedResult) {
                res.status(200).send({total: result[0], data: formatedResult});
            })
        }


    };


    this.getStudentForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Student', studentSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var filter = data.filter || {};
        var optionsObject = {};
        var queryObject = {};
        queryObject.$and = [];
        var contentType = data.contentType;
        if (filter && typeof filter === 'object') {
            optionsObject = filterMapper.mapFilter(filter, {
                contentType: contentType
            });
        }
        if(optionsObject) {
            queryObject.$and.push(optionsObject);
        }

        var isRegistration = data.isRegistration ? {isRegistration: false} : {};

        getTotal = function (cb) {
            Model
                .find(isRegistration)
                .count(function (err, result) {
                    if (err) {
                        return cb(err);
                    }
                    cb(null, result || 0);
                });
        };

        getData = function (cb) {
            Model
                .find(isRegistration)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate([{path : 'studentDetails'},{path : 'batch'}, {path: 'course'},{path: 'center'}])
                .exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
        };

        async.parallel([getTotal, getData], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({total: result[0], data: result[1]});
        });
    };


    //getStudentById
    this.getStudentById = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var studentDetails = models.get(db, 'Student', studentDetailsSchema);
        var id = req.query.id;
        var query = {};
        var err;

        if (!id) {
            err = new Error();
            err.message = 'Id not found';

            return next(err);
        }

        query._id = id;

        studentDetails
            .findOne(query)
            .populate([{path : 'studentDetails'}, {path : 'batch'}, {path: 'course'},{path: 'center'}])
            .exec(function (err, response) {
            if (err) {
                return next(err);
            }
                studentFormatedResult(res, response);
        });
    };

    this.getStudDataById = function(req, callback) {
        var db = req.session.lastDb || 'CRM';
        var studentDetails = models.get(db, 'Student', studentDetailsSchema);
        var id = req.query.id;
        var query = {};
        var err;

        if (!id) {
            err = new Error();
            err.message = 'Id not found';

            return next(err);
        }

        query._id = id;

        studentDetails
            .findOne(query)
            .populate([{path : 'studentDetails'}, {path : 'batch'}, {path: 'course'},{path: 'center'}])
            .exec(function (err, response) {
                callback(err, response)
            });
    }

    function studentFormatedResult(res, result){
        if(_.isEmpty(result)){
            res.status(200).send(result);
        }else {
            studentConverter.studentObj(result, function (err, formatedResult) {
                res.status(200).send(formatedResult);
            })
        }
    }


    this.getStudentDataById = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var studentDetails = models.get(db, 'Student', studentSchema);
        var id = req.params.id;
        var query = {};
        var err;

        if (!id) {
            err = new Error();
            err.message = 'Id not found';

            return next(err);
        }

        query._id = id;

        studentDetails
            .findOne(query)
            .populate([{path : 'studentDetails'}, {path : 'batch'}, {path: 'course'},{path: 'center'}])
            .exec(function (err, response) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(response);
            });
    };

    this.getCourseProductById = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var studentDetails = models.get(db, 'Student', studentSchema);
        var id = req.params.id;
        var query = {};
        var err;

        if (!id) {
            err = new Error();
            err.message = 'Id not found';

            return next(err);
        }

        query.course = objectId(id);
        query.isRegistration = true;



        studentDetails
            .findOne(query)
            .populate([{path : 'studentDetails'}, {path : 'batch'}, {path: 'course'},{path: 'center'}, {path : 'product'}])
            .exec(function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(response);
            });
    };


    this.getStudentsImages = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Student', studentSchema);
        var data = req.params;
        var idsArray = data.ids || [];
        var query;

        if (!idsArray.length) {
            idsArray = req.query.ids || [];
        }

        query = Model.find({_id: {$in: idsArray}}, {studentImageName: 1, studentName: 1, lastName: 1});

        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: response});

        });
    };


    this.remove = function (req, res, next) {
        var body = req.body;
        var id = body.studentDetails ? body.studentDetails._id : null;
        var StudentDetailsModel = models.get(req.session.lastDb, 'StudentDetails', studentDetailsSchema);
        var StudentModel = models.get(req.session.lastDb, 'Student', studentSchema);
        var studentId = req.params.id;
        StudentModel.findByIdAndRemove(studentId, function (err, student) {
            if (err) {
                return next(err);
            }
            if(id) {
                StudentDetailsModel.findByIdAndRemove(id, function (err, studentDetails) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: student});
                })
            } else {
                res.status(200).send({success: student});
            }

        });
    };

    this.bulkRemove = function (req, res, next) {
        var id = req.body.ids;
        async.parallel({
            deleteInStuDetails : deleteInStudentDetails.bind(null, req, id),
            deleteInStudent: deleteInStudentModel.bind(null, req, id)
        }, function (err, result) {
            if(err) {
                    return next(err);
                } else {
                    res.status(200).send({msg: 'Student Deleted Successfully'});
                }
        });
    };

    function deleteInStudentDetails(req, data, callback) {
        var StudentDetailsModel = models.get(req.session.lastDb, 'StudentDetails', studentDetailsSchema);
        StudentDetailsModel.remove({_id: {$in: data}}, function (err, result) {
            if(err) {
                return callback(err, result);
            }
        });
        return callback(null, {msg: 'Student Details Deleted Success!!'});
    }

    function deleteInStudentModel(req, data, callback) {
        var StudentModel = models.get(req.session.lastDb, 'Student', studentSchema);
        StudentModel.remove({_id: {$in: data}}, function (err, result) {
            if(err) {
                return callback(err, result);
            }
        });
        return callback(null, {msg: 'Student Deleted Success!!'});
    }

    this.getStudentsByCBC = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Student', studentSchema);
        var data = req.query;
        var query;

        query = Model.find({center: data.centerId, course: data.courseId, batch: data.batchId});
        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: response});

        });
    };

    this.getStudentsByCCB = function (req, next) {
        var Model = models.get(req.session.lastDb, 'Student', studentSchema);
        var body = req.body;
        var queryObj = {};

       /* var arr = body.batches.map(i => objectId(i));
        var center = body.center.map(i => objectId(i));
        if(body.course != "" && body.course != null){
            var course = _.isArray(body.course) ?  {'$in': body.course.map(i => objectId(i))} : objectId(body.course)
            queryObj = {center: {'$in': center}, course: course }
        } else {
            queryObj = {center: {'$in': center}}
        }

        if(!_.isEmpty(arr)) {
            queryObj.batch = {'$in': arr}
        }*/

        var classId = body.classDetail ? body.classDetail : '';
        var sectionId = body.section ? body.section : '';

        if(classId != "" && sectionId != ""){
            queryObj = {classDetail: objectId(classId), section: objectId(sectionId) }
        } else {
            queryObj = {classDetail: objectId(classId) }
        }

        var query = Model.find(queryObj).exec(function(err, data) {
            next(err, data);
        });
    };


    this.update = function (req, res, next) {
        var StudentDetails = models.get(req.session.lastDb, 'StudentDetails', studentDetailsSchema);StudentModel
        var StudentModel = models.get(req.session.lastDb, 'Student', studentSchema);
        var UserModel = models.get(req.session.lastDb, 'Users', userSchema);
        var body = req.body;
        var _id = body.studentDetails._id;
        var _sid = req.params.id;
        if(_id) {
            StudentDetails.findByIdAndUpdate(_id, body.studentDetails, {new: true}, function (err, list) {
                if (err) {
                    return next(err);
                }

                StudentModel.findByIdAndUpdate(_sid, body.student, {new: true}, function (err, list) {
                    if (err) {
                        return next(err);
                    }
                    UserModel.findOneAndUpdate({'student': _sid}, {$set:{imageSrc:body.student.studentImageName}}, function (err, list) {
                        if (err) {
                            return next(err);
                        }                    });
                    res.status(200).send({success: 'student updated success'});
                });
            });
        } else {
            delete  body.studentDetails._id;
            var StudentDetailsModel = new StudentDetails(body.studentDetails);
            StudentDetailsModel.save(function (err, result) {
                if (err) {
                    return next(err);
                }
                body.student.studentDetails = result._id;

                StudentModel.findByIdAndUpdate(_sid, body.student, {new: true}, function (err, list) {
                    if (err) {
                        return next(err);
                    }
                    UserModel.findOneAndUpdate({'student': ObjectId(body.student)}, {$set:{imageSrc:body.studentDetails.studentImageName}} , function (err, list) {
                        if (err) {
                            return next(err);
                        }
                    });

                        res.status(200).send({success: 'student updated success'});
                });
            });

        }

    };

    this.updateStudent = function(req, data, next){
        var body = req.body
        var StudentModel = models.get(getDb(req), 'Student', studentSchema);
        StudentModel.update({_id: req.body.studentId}, body , function(err, result, rawResponse) {
            if (err) {
                return next(err);
            }
            data.updateStudent = result;
            data.studentId = req.body.studentId;
            next(err, req, data)
        })
    }

    function getDb(req) {
        return req.session.lastDb || 'CRM'
    }

    this.updateStudentDetails = function(req, data, next){
        var StudentDetails = models.get(getDb(req), 'StudentDetails', studentDetailsSchema);
        var body = req.body;
        StudentDetails.update({_id: body.studentDetailsId}, body , function(err, result) {
            if (err) {
                return next(err);
            }
            data.updateStudentDetails = result
            next(err, req, data)
        });
    }

    this.getStudentAlphabet = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Student', studentSchema);
        var response = {};
        var query = Model
            .aggregate([{
                $project: {
                    later: {$substr: ['$studentName', 0, 1]}
                }
            }, {
                $group: {
                    _id: '$later'
                }
            }]);

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            response.data = result;
            res.status(200).send(response);
        });
    };

    this.getRegisterationsByCenter = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Student', studentSchema);
        var response = {};
        var data = req.query;
        var filter = data.filter || {};
        var headers = baseService.getHeaders(req);
        var firstmatch = {};
        if(headers.cid) {
            firstmatch = {"center": mongoose.Types.ObjectId(headers.cid)}
        }
        var match = filterMapper.mapDateFilter(filter, {contentType: 'Transactions'});
        var matchObj = {"$and":[{"$or":[{"createDate":{"$gte":new Date(match[0]),"$lte": new Date(match[1])}}]}]};
        var secondMatch = {"isRegistration": true};
        var query = Model
            .aggregate([
                {
                    $match: firstmatch

                },
                {
                    $match: secondMatch
                    //$match: match
            },{
                $lookup: {
                    from        : 'Center',
                    localField  : 'center',
                    foreignField: '_id',
                    as          : 'center'
                }
            }, {
                $unwind: "$center"

            }, {
                $match: {"$and":[{"$or":[{"createDate":{"$gte":new Date(match[0]),"$lte": new Date(match[1])}}]}]}
                //$match: match

            },{
                $group: {
                    _id: {"center": '$center._id', "centerName":"$center.centerName", "centerCode":"$center.centerCode"},
                    sum: {$sum: 1},
                }
            }, {
                $match: {
                    sum: {$gt: 0},
                    _id: {$ne: null}
                }
            },{
                $project: {
                    _id    : "$_id.centerName",
                    count  : "$sum",
                    code   : "$_id.centerCode",
                    center : "$_id.center"
                }
            }]);

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getRevenueByCenter = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentFeeDetails', studentFeeDetailsSchema);
        var headers = baseService.getHeaders(req)
        var response = {};
        var data = req.query;
        var filter = data.filter || {};
        var secondMatch = {};
        var sumQuery = "$sum";
        var firstmatch = {};
        if(headers.cid) {
            firstmatch = {"center": mongoose.Types.ObjectId(headers.cid)}
        }
        var match = filterMapper.mapDateFilter(filter, {contentType: 'Transactions'});
        var matchObj = {"$and":[{"$or":[{"createDate":{"$gte":new Date(match[0]),"$lte": new Date(match[1])}}]}]};
        data.isPendingFee = data.isPendingFee == "true" ? true: false;
        if(data.isPendingFee) {
            secondMatch = {"isCompleted": false}
            sumQuery ={};
            sumQuery = {$subtract: [  "$sum", "$paidAmount" ] }
        }

        var query = Model
            .aggregate([ {
                $match: firstmatch
                //$match: match
            },
                {
                    $match: secondMatch
                    //$match: match
                },{
                    $lookup: {
                        from        : 'Center',
                        localField  : 'center',
                        foreignField: '_id',
                        as          : 'center'
                    }
                },{
                    $lookup: {
                        from        : 'Student',
                        localField  : 'student',
                        foreignField: '_id',
                        as          : 'student'
                    }
                }, {
                    $unwind: "$center"

                }, {
                    $unwind: "$student"

                },{
                    $project: {
                        student    : "$student",
                        center     :  "$center",
                        courseAmount: 1,
                        gstAmount: 1,
                        paidAmount : 1,
                        createDate : "$student.createDate"
                    }
                },{
                    $match: {"$and":[{"$or":[{"createDate":{"$gte":new Date(match[0]),"$lte": new Date(match[1])}}]}]}
                    //$match: match

                }, {
                    $group: {
                        _id: {"center": '$center._id', "centerCode":"$center.centerCode", "centerName": "$center.centerName"},
                        sum: {$sum:  { $add: [ "$courseAmount", "$gstAmount" ] } },
                        paidAmount : {$sum: "$paidAmount"}
                    }
                }, {
                    $match: {
                        sum: {$gt: 0},
                        _id: {$ne: null}
                    }
                },{
                    $project: {
                        _id    : "$_id.centerCode",
                        name   : "$_id.centerName",
                        sum    : sumQuery,
                        center : "$_id.center"
                    }
                }]);

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getPeRevenueByCenter = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentFeeDetails', studentFeeDetailsSchema);
        var response = {};
        var data = req.query;
        var filter = data.filter || {};
        var secondMatch = {};
        var match = filterMapper.mapDateFilter(filter, {contentType: 'Transactions'});
        var matchObj = {"$and":[{"$or":[{"createDate":{"$gte":new Date(match[0]),"$lte": new Date(match[1])}}]}]};
        if(body.isPendingFee) {
            var secondMatch = {"isCompleted": false}
        }

        var query = Model
            .aggregate([
                {
                    $match: secondMatch
                    //$match: match
                },{
                    $lookup: {
                        from        : 'Center',
                        localField  : 'center',
                        foreignField: '_id',
                        as          : 'center'
                    }
                },{
                    $lookup: {
                        from        : 'Student',
                        localField  : 'student',
                        foreignField: '_id',
                        as          : 'student'
                    }
                }, {
                    $unwind: "$center"

                }, {
                    $unwind: "$student"

                },{
                    $project: {
                        student    : "$student",
                        createDate : "$student.createDate"
                    }
                },{
                    $match: {"$and":[{"$or":[{"createDate":{"$gte":new Date(match[0]),"$lte": new Date(match[1])}}]}]}
                    //$match: match

                }, {
                    $group: {
                        _id: {"center": '$center._id', "centerName":"$center.centerName"},
                        sum: {$subtract: [ { $add: [ "$courseAmount", "$gstAmount" ] }, "$paidAmount" ] },
                    }
                }, {
                    $match: {
                        sum: {$gt: 0},
                        _id: {$ne: null}
                    }
                },{
                    $project: {
                        _id    : "$_id.centerName",
                        sum  : "$sum",
                    }
                }]);

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getStudentLeaveDetails = function (req, res, next) {
        var userId = req.session ? req.session.uId : null;

        getStudentLeave(req, userId, function (err, data) {
            if (err) {
                return next(err);
            }
            res.status(200).send(data);
        });
    };


    this.getStudentLeaveReport = function (req, res, next) {

        async.parallel({
            months : getStudentAttendanceByMonth.bind(null, req),
            student: getStudentAttendance.bind(null, req)
        }, function (err, result) {
           result.student = convertData(result);
            res.status(200).send(result);
        })
    };

    function convertMonth(data) {
        _.forEach(data, function (val, index) {
            val.month = moment.monthsShort(+val.monthNo -1)
        })

        return data;
    }

    function convertData(data) {
        if(data.student.length > 0) {
            _.forEach(data.student, function (val, index) {
                val.total = 0;
                _.forEach(data.months, function (value, index) {
                    var leavObj = _.filter(val.leave, {month: value.monthNo});
                    if(leavObj.length > 0) {
                        leavObj[0].count = 0;
                        _.forEach(leavObj[0].vacArray, function (leav, index) {
                            if(leav != null) {
                                val.total = val.total + 1;
                                leavObj[0].count = leavObj[0].count + 1;
                            }
                        });
                    }
                })
            })
        }


        return data.student;
    }

    function getStudentAttendance(req, callback) {
        var queryParams = req.query;
        if(queryParams.centerId && queryParams.courseId && queryParams.batchId) {
            var Model = models.get(req.session.lastDb, 'Student', studentSchema);
            Model.aggregate([
                    {
                        "$match": {
                            "center": mongoose.Types.ObjectId(queryParams.centerId),
                            "course": mongoose.Types.ObjectId(queryParams.courseId),
                            "batch": mongoose.Types.ObjectId(queryParams.batchId),
                            "studentStatus": true,
                            "isDeleteStudent": false
                        }
                    },
                    {
                        "$lookup": {
                            "from": "StudentLeave",
                            "localField": "_id",
                            "foreignField": "student",
                            "as": "leave"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            studentName         : 1,
                            userName            : 1,
                            lastName            : 1,
                            registartionNo      : 1,
                            course              : 1,
                            center              : 1,
                            batch               : 1,
                            studentStatus       : 1,
                            isDeleteStudent     : 1,
                            leave: {
                                $filter: {
                                    input: "$leave",
                                    as: "leav",
                                    cond: { $and: [
                                        { $eq: [ "$$leav.year", parseInt(queryParams.year) ] },
                                        { $eq: [ "$$leav.course",  mongoose.Types.ObjectId(queryParams.courseId)] },
                                        { $eq: [ "$$leav.center", mongoose.Types.ObjectId(queryParams.centerId) ] },
                                        { $eq: [ "$$leav.batch", mongoose.Types.ObjectId(queryParams.batchId) ] }
                                    ] }
                                }
                            }
                        }
                    }

                ], callback
            );
        } else {
            callback(null, []);
        }
    }

    function getStudentAttendanceByMonth(req, callback) {
       var months = [{"month": 'Jan', "monthNo": 1}, {"month": 'Feb', "monthNo": 2},{"month": 'Mar', "monthNo": 3},{"month": 'Apr', "monthNo": 4},{"month": 'May', "monthNo": 5}, {"month": 'Jun', "monthNo": 6}, {"month": 'Jul', "monthNo": 7}, {"month": 'Aug', "monthNo": 8}, {"month": 'Sep', "monthNo": 9}, {"month": 'Oct', "monthNo": 10}, {"month": 'Nov', "monthNo": 11}, {"month": 'Dec', "monthNo": 12}]
        callback(null, months);
    }


    function getStudentLeave(req, userId, callback) {
        var queryParams = req.query;
        if(queryParams.centerId && queryParams.courseId && queryParams.batchId) {
            var Model = models.get(req.session.lastDb, 'Student', studentSchema);
            Model.aggregate([
                    {
                        "$match": {
                            "center": mongoose.Types.ObjectId(queryParams.centerId),
                            "course": mongoose.Types.ObjectId(queryParams.courseId),
                            "batch": mongoose.Types.ObjectId(queryParams.batchId),
                            "studentStatus": true,
                            "isDeleteStudent": false
                        }
                    },
                    {
                        "$lookup": {
                            "from": "StudentLeave",
                            "localField": "_id",
                            "foreignField": "student",
                            "as": "leave"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            studentName         : 1,
                            userName            : 1,
                            lastName            : 1,
                            registartionNo      : 1,
                            course              : 1,
                            center              : 1,
                            batch               : 1,
                            studentStatus       : 1,
                            isDeleteStudent     : 1,
                            studentPhone        : 1,
                            leave: {
                                $filter: {
                                    input: "$leave",
                                    as: "leav",
                                    cond: { $and: [
                                        { $eq: [ "$$leav.month", parseInt(queryParams.month) ] },
                                        { $eq: [ "$$leav.year", parseInt(queryParams.year) ] },
                                        { $eq: [ "$$leav.course",  mongoose.Types.ObjectId(queryParams.courseId)] },
                                        { $eq: [ "$$leav.center", mongoose.Types.ObjectId(queryParams.centerId) ] },
                                        { $eq: [ "$$leav.batch", mongoose.Types.ObjectId(queryParams.batchId) ] }
                                    ] }
                                }
                            }
                        }
                    }

                ], callback
            );
        } else {
            callback(null, []);
        }
    }

    this.getStudentFBDetails = function (req, res, next) {
        var userId = req.session ? req.session.uId : null;

        getStudentFB(req, function (err, data) {
            if (err) {
                return next(err);
            }
            res.status(200).send(data);
        });
    };


    function getStudentFB(req, userId, callback) {
        var queryParams = req.query;
        if(queryParams.centerId && queryParams.courseId && queryParams.batchId) {
            var Model = models.get(req.session.lastDb, 'Student', studentSchema);
            Model.aggregate([
                    {
                        "$match": {
                            "center": mongoose.Types.ObjectId(queryParams.centerId),
                            "course": mongoose.Types.ObjectId(queryParams.courseId),
                            "batch": mongoose.Types.ObjectId(queryParams.batchId),
                            "studentStatus": true,
                            "isDeleteStudent": false
                        }
                    },
                    {
                        "$lookup": {
                            "from": "StudentLeave",
                            "localField": "_id",
                            "foreignField": "student",
                            "as": "leave"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            studentName         : 1,
                            userName            : 1,
                            lastName            : 1,
                            registartionNo      : 1,
                            course              : 1,
                            center              : 1,
                            batch               : 1,
                            studentStatus       : 1,
                            isDeleteStudent     : 1,
                            leave: {
                                $filter: {
                                    input: "$leave",
                                    as: "leav",
                                    cond: { $and: [
                                        { $eq: [ "$$leav.month", parseInt(queryParams.month) ] },
                                        { $eq: [ "$$leav.year", parseInt(queryParams.year) ] },
                                        { $eq: [ "$$leav.course",  mongoose.Types.ObjectId(queryParams.courseId)] },
                                        { $eq: [ "$$leav.center", mongoose.Types.ObjectId(queryParams.centerId) ] },
                                        { $eq: [ "$$leav.batch", mongoose.Types.ObjectId(queryParams.batchId) ] }
                                    ] }
                                }
                            }
                        }
                    }

                ], callback
            );
        } else {
            callback(null, []);
        }
    }

    this.getStudentCount = function (req, data, next) {
        var Model = models.get("CRM", 'Student', studentSchema);
        var findObj = {center: req.body.center, course: req.body.course, registrationNo: {$ne:null}};
        Model.find(findObj).sort({'createDate': -1}).exec(function (err, result) {
            var course = data.course;
            if(!_.isEmpty(result)) {
                var regNo = result[0].registrationNo;
                regNo =  regNo.split(course.courseCode || 'DAF');
                data.studentCount = isNaN(regNo[1]) ? result.length + 1 :(+regNo[1]) + 1;
            }
            var count =  !_.isUndefined(data.studentCount) ? data.studentCount : 0;
            req.body.registrationNo = req.body.centerCode + 'C' + (course.courseCode || 'DAF') + count;
            next(err, req, data)
        });
    }

    this.getStudentAllTaxanomyDetails = function (req, res, next) {
        var userId = req.session ? req.session.uId : null;

        getStudentTaxLeave(req, userId, function (err, data) {
            if (err) {
                return next(err);
            }
            var datobj = {"id": "1", "label": "All","collapsed": false, "selected": false, "subselector": true, "children": data[0].data}
            res.status(200).send([datobj]);
        });
    };


    function getStudentTaxLeave(req, userId, callback) {
        var queryParams = req.query;
            var Model = models.get(req.session.lastDb, 'Student', studentSchema);
            Model.aggregate([
                    {
                        "$lookup": {
                            "from": "Center",
                            "localField": "center",
                            "foreignField": "_id",
                            "as": "center"
                        }
                    },
                    {
                        "$lookup": {
                            "from": "Course",
                            "localField": "course",
                            "foreignField": "_id",
                            "as": "course"
                        }
                    },
                    {
                        "$lookup": {
                            "from": "Batch",
                            "localField": "batch",
                            "foreignField": "_id",
                            "as": "batch"
                        }
                    },
                    {
                        "$lookup": {
                            "from": "Student",
                            "localField": "_id",
                            "foreignField": "_id",
                            "as": "students"
                        }
                    },
                    {$unwind: {path: "$center"}},
                    {$unwind: {path: "$course"}},
                    {$unwind: {path: "$batch"}},
                    {$unwind: {path: "$students"}},
                    {$group: {_id: {course: "$course", center:"$center", batch: "$batch"}, "item": { $addToSet:  {"id": "$students._id", "collapsed": false, "selected": false, "subselector": true, "value": "$students.studentPhone", "label": "$students.studentName", "course": "$students.course", "center": "$students.center", "batch": "$students.batch", "phoneNo":"$students.studentPhoneNo"}}}},
                    {$group: {_id: {course: "$_id.course", center:"$_id.center"}, "item": { $addToSet:  {"id": "$_id.batch._id", "label": "$_id.batch.batchName", "collapsed": false, "selected": false, "subselector": true, "children": "$item"}}}},
                    {$group: {_id: "$_id.center", item: {$addToSet:{"id": "$_id.course._id", "label":"$_id.course.courseName", "collapsed": false, "selected": false, "subselector": true,  "children": "$item"}}}},
                    {$group: {_id: "", data: {$addToSet:  {"id": "$_id._id", "label":"$_id.centerName","collapsed": false, "selected": false, "subselector": true,  "children":"$item" }}}}

            ], callback
        );
    }


    this.getUpdateStudentTaxanomyDetails = function (req, res, next) {
        var userId = req.session ? req.session.uId : null;
        
        async.waterfall([
            getStudentTaxLeave.bind(null, req, ""),
            async.apply(getStudNotificationByNId, req),
            constructJson.bind()
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            var datobj = {"id": "1", "label": "All","collapsed": false, "selected": false, "subselector": true, "children": result}
            res.status(200).send([datobj]);
        })

    };
    
    function getStudNotificationByNId(req, data, callback) {
        var dataObj = {};
        dataObj.students = data;
        var id = req.params.id;
        var Model = models.get("CRM", 'StudentNotifications', NotificationSchema);
        Model.find({notificationId: mongoose.Types.ObjectId(id)}, function (err, notifications) {
            dataObj.notification = notifications;
            callback(err, dataObj)
        })
    }
    
    function constructJson(data, callback) {
        var taxJson = data.students[0].data;
        if(taxJson.length > 0 ){
            _.forEach(taxJson, function (child1, index) {
                if(child1.children.length > 0) {
                    _.forEach(child1.children, function (child2) {
                        if(child2.children.length > 0) {
                            _.forEach(child2.children, function (child3) {
                                if(child3.children.length > 0) {
                                    _.forEach(child3.children, function (child4) {
                                        var datafound = _.filter(data.notification, {"student": child4.id})
                                        if(datafound.length > 0) {
                                            child4.selected = true;
                                            child3.selected = true;
                                            child2.selected = true;
                                            child1.selected = true;
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
                if(index == (taxJson.length - 1)) {
                    callback(null, taxJson);
                }
            })
        } else {
            callback(null, []);
        }
    }

    this.receiveInvoice = function (req, data, next) {
        if(data.orderObj) {
            var id = data.order._id;
            var forSales = true;
            var journal = "565ef6ba270f53d02ee71d65";
            //var dbIndex = req.session.lastDb;
            var dbIndex = 'CRM';
            var Invoice = models.get(dbIndex, 'Invoices', InvoiceSchema);
            var Payments = models.get(dbIndex, 'prepayment', PrepaymentSchema);
            var Order = models.get(dbIndex, 'order', OrderSchema);
            var Company = models.get(dbIndex, 'Customer', CustomerSchema);
            var request;
            var parallelTasks;
            var waterFallTasks;
            var createdInvoiceId;
            var fx = {};

            var editedBy = {
                user: req.session.uId,
                date: new Date()
            };

            /*if (id.length < 24) {
             return res.status(400).send();
             }*/

            if (!forSales) {
                Invoice = models.get(dbIndex, purchaseInvoiceCT, purchaseInvoicesSchema);
            }

            function fetchFirstWorkflow(callback) {
                if (forSales) {
                    request = {
                        query: {
                            wId         : 'Sales Invoice',
                            source      : 'purchase',
                            targetSource: 'invoice'
                        },

                        session: req.session
                    };
                } else {
                    request = {
                        query: {
                            wId         : 'Purchase Invoice',
                            source      : 'purchase',
                            targetSource: 'invoice'
                        },

                        session: req.session
                    };
                }

                workflowHandler.getFirstForConvert(request, callback);
            }

            function findOrder(callback) {
                var query = Order.findById(id).lean();

                query
                    .populate('products.info')
                    .populate('products.jobs')
                    .populate('project', '_id name salesmanager');

                query.exec(callback);
            }

            function renameFolder(orderId, invoiceId) {
                var os = require('os');
                var osType = (os.type().split('_')[0]);
                var dir;
                var oldDir;
                var newDir;

                switch (osType) {
                    case 'Windows':
                        dir = pathMod.join(__dirname, '..\\routes\\uploads\\');
                        break;
                    case 'Linux':
                        dir = pathMod.join(__dirname, '..\/routes\/uploads\/');
                        break;
                    // skip default;
                }

                oldDir = dir + orderId;
                newDir = dir + invoiceId;

                fs.rename(oldDir, newDir);
            }

            function findPrepayments(callback) {
                Payments.aggregate([{
                    $match: {
                        order: objectId(id)
                    }
                }, {
                    $project: {
                        paidAmount: {$divide: ['$paidAmount', '$currency.rate']},
                        date      : 1,
                        refund    : 1
                    }
                }, {
                    $project: {
                        paidAmount: {$cond: [{$eq: ['$refund', true]}, {$multiply: ['$paidAmount', -1]}, '$paidAmount']},
                        date      : 1,
                        refund    : 1
                    }
                }, {
                    $group: {
                        _id : null,
                        date: {$max: '$date'},
                        sum : {$sum: '$paidAmount'}
                    }
                }], callback);
            }

            function parallel(callback) {
                async.parallel(parallelTasks, callback);
            }

            function getRates(parallelResponse, callback) {
                var order = parallelResponse[0];
                var date = moment(order.orderDate).format('YYYY-MM-DD');

                ratesService.getById({id: date, dbName: dbIndex}, function (err, result) {

                    fx.rates = result && result.rates ? result.rates : {};
                    fx.base = result && result.base ? result.base : 'USD';

                    callback(null, parallelResponse);
                });
            }

            function createInvoice(parallelResponse, callback) {
                var order;
                var workflow;
                var err;
                var invoice;
                var invoiceCurrency;
                var query;
                var paidAmount = 0;
                var prepayments;

                if (parallelResponse && parallelResponse.length) {
                    prepayments = parallelResponse[2][0];
                    order = parallelResponse[0];
                    workflow = parallelResponse[1];

                } else {
                    err = new Error(RESPONSES.BAD_REQUEST);
                    err.status = 400;

                    return callback(err);
                }

                invoiceCurrency = order.currency._id;
                order.currency._id = order.currency._id;

                delete order._id;
                delete order._type;

                invoice = new Invoice(order);

                invoice.invoiceDate = order.orderDate;
                invoice.dueDate = order.expectedDate;

                if (prepayments && prepayments.sum) {
                    /* prepayments.paymentInfo.forEach(function (payment) {
                     var paid = payment.paidAmount;
                     var paidInUSD = paid / payment.currency.rate;

                     // paidAmount += fx(paidInUSD).from('USD').to(invoiceCurrency);
                     paidAmount += paid;
                     });*/

                    paidAmount = prepayments.sum;

                    invoice.paymentDate = prepayments.date;
                }

                if (req.session.uId) {
                    invoice.createdBy.user = req.session.uId;
                    invoice.editedBy.user = req.session.uId;
                }

                invoice.currency.rate = ratesRetriever.getRate(fx.rates, fx.base, invoiceCurrency);

                // invoice.sourceDocument = order.name;

                invoice.sourceDocument = id;
                invoice.paymentReference = order.name;
                invoice.paymentInfo.bookingAmount = +req.body.bookingAmount;
                invoice.paymentInfo.balance = order.paymentInfo.total - (paidAmount + (+req.body.bookingAmount * 100));
                invoice.paymentInfo.taxes = order.paymentInfo.taxes;

                if (paidAmount >= order.paymentInfo.total) {
                    invoice.workflow = objectId(CONSTANTS.INVOICE_PAID);
                } else if (paidAmount) {
                    invoice.workflow = objectId(CONSTANTS.INVOICE_PARTIALY_PAID);
                } else {
                    invoice.workflow = workflow._id;
                }

                if (forSales || forSales === 'true') {
                    if (!invoice.project) {
                        invoice.project = order.project ? order.project._id : null;
                    }
                }

                invoice.supplier = order.supplier;

                invoice.journal = journal;

                if (forSales || forSales === 'true') {
                    invoice.salesPerson = order.project ? order.project.salesmanager : order.salesPerson;

                    invoice.save(function (err, result) {
                        var historyOptions;

                        if (err) {
                            return next(err);
                        }

                        createdInvoiceId = result._id;
                        data.invoiceId = createdInvoiceId;
                        data.invoiceDate = result.invoiceDate;

                        historyOptions = {
                            contentType: 'invoice',
                            data       : result.toJSON(),
                            dbName     : dbIndex,
                            contentId  : createdInvoiceId
                        };

                        HistoryService.addEntry(historyOptions, function () {
                            callback(null, result);
                        });
                    });

                } else {
                    query = Company.findById(invoice.supplier, {salesPurchases: 1}).lean();

                    query.populate('salesPurchases.salesPerson', 'name');

                    query.exec(function (err, result) {
                        if (err) {
                            return callback(err);
                        }

                        if (result && result.salesPurchases.salesPerson) {
                            invoice.salesPerson = result.salesPurchases.salesPerson._id;
                        }

                        invoice.save(function (err, result) {
                            var historyOptions;

                            if (err) {
                                return next(err);
                            }

                            createdInvoiceId = result._id;

                            historyOptions = {
                                contentType: 'invoice',
                                data       : result.toJSON(),
                                dbName     : dbIndex,
                                contentId  : createdInvoiceId
                            };

                            HistoryService.addEntry(historyOptions, function () {
                                callback(null, result);
                            });

                        });
                    });

                }

            }

            parallelTasks = [findOrder, fetchFirstWorkflow, findPrepayments];
            waterFallTasks = [parallel, getRates, createInvoice];

            async.waterfall(waterFallTasks, function (err, result) {

                if (err) {
                    return next(err);
                }

                if (forSales) {
                    request = {
                        query: {
                            wId   : 'Sales Order',
                            status: 'Done'
                        },

                        session: req.session
                    };
                } else {
                    request = {
                        query: {
                            wId   : 'Purchase Order',
                            status: 'Done'
                        },

                        session: req.session
                    };
                }

                workflowHandler.getFirstForConvert(request, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    Order.findByIdAndUpdate(id, {
                        $set: {
                            workflow: result._id,
                            editedBy: editedBy
                        }
                    }, {new: true}, function (err) {
                        if (err) {
                            return next(err);
                        }

                        JobsService.setInvoiceToJobs({invoice: createdInvoiceId, order: id, dbName: dbIndex});
                    });
                });

                next(err, req, data);

            });
        } else {
            next(null, req, data);
        }

    };

    /*this.placeOrder = function (req, data, next) {
        var db = 'CRM';
        var Order = models.get(db, 'Order', OrderSchema);
        var OrderRows = models.get(db, 'orderRows', OrderRowsSchema);
        var JobsModel = models.get(db, 'jobs', JobsSchema);
        var orderBody = {
            "supplier": data.createStudentCustomer._id,
            "project": null,
            "workflow": "580db83bc2acba093649073c",
            "supplierReference": "",
            "orderDate": "2018-02-11T09:57:22.000Z",
            "expectedDate": "11 Feb, 2018",
            "name": "PO",
            "invoiceControl": null,
            "invoiceRecived": false,
            "paymentTerm": null,
            "fiscalPosition": null,
            "destination": null,
            "incoterm": null,
            "products": [{
                "product": "5a806875f148527d2536f1ae",
                "unitPrice": 600,
                "costPrice": null,
                "warehouse": "57dfc6ea6066337b771e99e2",
                "quantity": "1",
                "taxes": [{
                    "taxCode": "589894b749cd23e02ca7c323",
                    "tax": 90
                }],
                "description": "Neet Books",
                "subTotal": 600,
                "creditAccount": "5788b4be52adaf4c49e4b51c",
                "totalTaxes": 90
            }],
            "conflictTypes": [],
            "currency": {
                "_id": "USD",
                "name": "USD"
            },
            "paymentMethod": "565f2e05ab70d49024242e10",
            "forSales": true,
            "deliverTo": "",
            "priceList": "58109ae869b3249417f74baf",
            "salesPerson": null,
            "warehouse": "57dfc6ea6066337b771e99e2",
            "shippingExpenses": {
                "amount": 0
            },
            "populate": true,
            "paymentInfo": {
                "total": 690,
                "unTaxed": 600,
                "discount": 0,
                "taxes": 90
            },
            "status": {
                "allocateStatus": "NOT",
                "fulfillStatus": "NOT",
                "shippingStatus": "NOT"
            },
            "groups": {
                "owner": null,
                "users": [],
                "group": []
            }
        };
        var order;
        var mid = parseInt(req.headers.mid, 10) || 129;
        var arrayRows = orderBody.products;
        var rates;
        var currency = orderBody.currency;
        var base;

        if (mid === 129) {
            //  Order = models.get(db, 'purchaseOrders', purchaseOrdersSchema);
        }

        // currencyHalper(orderBody.orderDate, function (err, oxr) {

        ratesService.getById({dbName: db, id: orderBody.orderDate}, function (err, ratesObject) {
            rates = ratesObject ? ratesObject.rates : {};
            base = ratesObject ? ratesObject.base : 'USD';

            orderBody.currency = orderBody.currency || {};
            orderBody.currency.rate = ratesRetriever.getRate(rates, base, currency.name);

            order = new Order(orderBody);

            if (req.session.uId) {
                order.createdBy.user = req.session.uId;
                order.editedBy.user = req.session.uId;
            }

            order.save(function (err, _order) {
                var historyOptions;
                var arr;
                if (err) {
                    return next(err);
                }
                data.order = _order;
                historyOptions = {
                    contentType: 'order',
                    data       : _order.toJSON(),
                    dbName     : db,
                    contentId  : _order._id
                };

                HistoryService.addEntry(historyOptions, function () {
                });

                arr = arrayRows.map(function (elem) {
                    elem._id = objectId();
                    elem.product = objectId(elem.product);
                    elem.warehouse = objectId(elem.warehouse);
                    elem.debitAccount = elem.debitAccount ? objectId(elem.debitAccount) : null;
                    elem.creditAccount = elem.creditAccount ? objectId(elem.creditAccount) : null;
                    elem.order = _order._id;
                    elem.quantity = parseInt(elem.quantity, 10);

                    return elem;
                });

                OrderRows.collection.insertMany(arr, function (err, docs) {
                    var insertedIds;

                    if (err) {
                        return next(err);
                    }

                    insertedIds = docs.insertedIds;

                    OrderRows.aggregate([{
                        $match: {_id: {$in: insertedIds}}
                    }, {
                        $lookup: {
                            from        : 'Products',
                            localField  : 'product',
                            foreignField: '_id',
                            as          : 'product'
                        }
                    }, {
                        $project: {
                            product: {$arrayElemAt: ['$product', 0]}
                        }
                    }, {
                        $group: {
                            _id : null,
                            jobs: {$addToSet: '$product.job'}
                        }
                    }], function (err, result) {
                        var jobIds;
                        var orderBody;

                        if (err) {
                            return next(err);
                        }

                        orderBody = {
                            order: _order._id,
                            type : 'Ordered'
                        };

                        jobIds = result && result.length ? result[0].jobs : [];

                        JobsModel.update({_id: {$in: jobIds}}, {$set: orderBody}, {multi: true}, function (rer, result) {
                            if (err) {
                                return next(err);
                            }

                            next(err, req, data)
                        });
                    });

                });

            });
        });
    }*/


    this.exportToXlsx = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'Student', studentSchema);

        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var type = req.query.type;
        var filterObj = {};
        var options;

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, {
                contentType: 'VStudent'
            });
        }

        options = {
            res         : res,
            next        : next,
            Model       : Model,
            map         : exportMap,
            returnResult: true,
            fileName    : type
        };

        function lookupForStudent(cb) {
            var query = [];
            var i;

//            query.push({$match: {isEmployee: type === 'Employees'}});

            for (i = 0; i < lookupForStudentArray.length; i++) {
                query.push(lookupForStudentArray[i]);
            }

            query.push({$match: filterObj});
            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        async.parallel([lookupForStudent], function (err, result) {
            var resultArray = result[0];

            exporter.exportToXlsx({
                res        : res,
                next       : next,
                Model      : Model,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : type
            });
        });

    };

    this.exportToCsv = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'Student', studentSchema);

        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var type = req.query.type;
        var filterObj = {};
        var options;

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, {
                contentType: 'VStudent'
            });
        }

        options = {
            res         : res,
            next        : next,
            Model       : Model,
            map         : exportMap,
            returnResult: true,
            fileName    : type
        };

        function lookupForStudent(cb) {
            var query = [];
            var i;

            //query.push({$match: {isEmployee: type === 'Employees'}});

            for (i = 0; i < lookupForStudentArray.length; i++) {
                query.push(lookupForStudentArray[i]);
            }

            query.push({$match: filterObj});

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        async.parallel([lookupForStudent], function (err, result) {
            var resultArray = result[0];

            exporter.exportToCsv({
                res        : res,
                next       : next,
                Model      : Model,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : type
            });
        });

    };


};

module.exports = Module;
