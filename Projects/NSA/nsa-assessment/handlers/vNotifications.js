/**
 * Created by kiranmai on 05/02/18.
 */

var mongoose = require('mongoose');
var NotificationSchema = mongoose.Schemas.StudentNotifications;
var EmpNotificationSchema = mongoose.Schemas.EmployeeNotifications;
var OtherNotificationSchema = mongoose.Schemas.OtherNotifications;
var async = require('async');
var request = require('request');
var ObjectId = mongoose.Types.ObjectId;
var moment = require('moment')
var _ = require('lodash');
var serviceUtils = require('../utils/serviceUtils');
var baseService = require('../handlers/baseHandler')

var Module = function (models) {

    this.getForView = function (req, res, next) {
        var Model = models.get(getDb(req), 'StudentNotifications', NotificationSchema);
        var headers = baseService.getHeaders(req);
        var matchObj = {};
        if(!headers.isAcess) {
            matchObj = {$and:[{"student": ObjectId(headers.lid)},{"status": true} ]}
        }
        Model.aggregate([
            {$match: matchObj},
            {
                $group: {
                    _id: {id: "$notificationId"}, count: {"$sum": 1},
                    title: {$first: "$smsTemplateTitle"},
                    message: {$first: "$smsTemplateMsg"},
                    status: {$first: "$status"},
                    updatedBy: {$first: "$updatedBy"},
                    data: {$push: "$$ROOT"}
                }
            },
            {
                $group: {
                    _id: "", data: {
                        $addToSet: {
                                "_id": "$_id.id",
                                "title": "$title",
                                "message": "$message",
                                "status": "$status",
                                "updatedBy": "$updatedBy",
                                "count": "$count",
                                "data": "$data"
                        }
                    }
                }
            }
            ], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: _.isEmpty(result) ? result : result[0].data});
        });
    };

    this.getStudentNotifications = function (req, res, next) {
        var Model = models.get(getDb(req), 'StudentNotifications', NotificationSchema);
        var findQuery = {
            student: req.query.id ? req.query.id : req.session.lid
        };
        var filter = serviceUtils.getDateFilter(req)
        if(filter) {
            findQuery.status = true;
            findQuery.createdDate = filter
        }
        Model.find(findQuery).exec(function (err, response) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: response});
        });
    }

    this.getEmployeeNotifications = function (req, res, next) {
        var Model = models.get(getDb(req), 'EmployeeNotifications', EmpNotificationSchema);
        var findQuery = {
            employee: req.session.lid
        };
        var filter = serviceUtils.getDateFilter(req)
        if(filter) {
            findQuery.createdDate = filter
        }
        Model.find(findQuery).exec(function (err, response) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: response});
        });
    }

    function getDb(req) {
        return req.session.lastDb || 'CRM'
    }

    this.getEmpNotifications = function (req, res, next) {
        var Model = models.get(getDb(req), 'EmployeeNotifications', EmpNotificationSchema);
        var headers = baseService.getHeaders(req);
        var matchObj = {};
        if(!headers.isAcess) {
            matchObj = { $or: [ {$and:[{"employee": ObjectId(headers.lid)},{"status": true} ]},{"createdId": ObjectId(req.session.uId)}] }
        }
        Model.aggregate([
            {$match: matchObj},
            {
                $group: {
                    _id: {id: "$notificationId"}, count: {"$sum": 1},
                    title: {$first: "$smsTemplateTitle"},
                    message: {$first: "$smsTemplateMsg"},
                    status: {$first: "$status"},
                    updatedBy: {$first: "$updatedBy"},
                    data: {$push: "$$ROOT"}
                }
            },
            {
                $group: {
                    _id: "", data: {
                        $addToSet: {
                            "_id": "$_id.id",
                            "title": "$title",
                            "message": "$message",
                            "status": "$status",
                            "updatedBy": "$updatedBy",
                            "count": "$count",
                            "data": "$data"
                        }
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: _.isEmpty(result) ? result : result[0].data});
        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var Model = models.get(getDb(req), 'StudentNotifications', NotificationSchema);

        Model.remove({notificationId: ObjectId(id)}, function (err, notification) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: notification, message: 'Deleted Successfully'});
        });
    }

    this.removeEmpNotifications = function (req, res, next) {
        var id = req.params.id;
        var Model = models.get(getDb(req), 'EmployeeNotifications', EmpNotificationSchema);

        Model.remove({notificationId: ObjectId(id)}, function (err, notification) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: notification, message: 'Deleted Successfully'});
        });
    }

    this.getNotificationById = function (req, res, next) {
        /*var userId = req.session ? req.session.uId : null;*/

        getStudentTaxanomy(function (err, data) {
            if (err) {
                return next(err);
            }
            var datobj = {"id": "1", "text": "All", "children": data[0].data}
            res.status(200).send([datobj]);
        });
    };


    function getStudentTaxanomy(callback) {
        var Model = models.get("CRM", 'StudentNotifications', NotificationSchema);
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
                    "localField": "student",
                    "foreignField": "_id",
                    "as": "students"
                }
            },
            {$unwind: {path: "$center"}},
            {$unwind: {path: "$course"}},
            {$unwind: {path: "$batch"}},
            {$unwind: {path: "$students"}},
            {$group: {_id: {course: "$course", center:"$center", batch: "$batch"}, "item": { $addToSet:  {"id": "$students._id", "text": "$students.studentName", checked: true}}}},
            {$group: {_id: {course: "$_id.course", center:"$_id.center"}, "item": { $addToSet:  {"id": "$_id.batch._id", "text": "$_id.batch.batchName", checked: true, "children": "$item"}}}},
            {$group: {_id: "$_id.center", item: {$addToSet:{"id": "$_id.course._id", "text":"$_id.course.courseName", checked: true, "children": "$item"}}}},
            {$group: {_id: "", data: {$addToSet:  {"id": "$_id._id", "text":"$_id.centerName", checked: true, "children":"$item" }}}}

            ], callback
        );
    }

   /* function sendSMS(req, data, callback) {
        var body = req.body;
        if(body.notify.sms) {
            var configObj = {statusUrl:global.config.sms.valueLeaf.statusUrl, groupStatusUrl:global.config.sms.valueLeaf.groupStatusUrl, smsUrl: global.config.sms.valueLeaf.url, method: 'POST', contentType: 'Application/json'};
            request({
                url: configObj.smsUrl, //URL to hit
                method: configObj.method,
                json: smsObj,
                headers: {
                    'Content-Type': configObj.contentType
                }
            }, function (error, response, body) {
                if (error) {
                    callback(error, response, body);
                } else {
                    callback(null, response, body);
                }
            });
            /!*callback(null, null, body);*!/
        } else {
            callback(null, null, body);
        }
    }*/

    function getMediaHeaders(configObj) {
        var headers = {
            username: global.config.sms.valueLeaf.username,
            password: global.config.sms.valueLeaf.password,
            subdatatype: configObj.stype ? configObj.stype : 'M',
            Response: 'Y',
            mtype: 'TXT',
            'Content-Type': configObj.contentType,
            'senderid': "VENPER"
        }

        return headers;
    };

    function sendSMS(req, data, callback) {
        var body = req.body;

        //var configObj = notificationObj.configObj;
        request({
            url: global.config.sms.valueLeaf.url, //URL to hit
            method: 'POST',
            json: data.smsObj,
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            data.smsResponse = body
            if (error) {
                callback(error, response, data)
            } else {
                callback(null, response, data)
            }
        });

        /*if(body.notify.sms) {
            var configObj = {statusUrl:global.config.sms.valueLeaf.url, groupStatusUrl:global.config.sms.valueLeaf.groupStatusUrl, smsUrl: global.config.sms.valueLeaf.url, method: 'POST', contentType: 'Application/json', stype: req.body.stype};
            var headers = getMediaHeaders(configObj);
            var formData = {};
            formData.msgdata = JSON.stringify(data.users);
            request.post({url: configObj.smsUrl, formData: formData, headers: headers}, function optionalCallback(error, response, body) {
                if (error) {
                    callback(error, response, body);
                } else {
                    callback(null, response, body);
                }
            });
            /!*callback(null, null, body);*!/
        } else {
            callback(null, null, body);
        }*/
    }

    function constructUsers(req, data, callback) {
        var arr = [];
        var msgdata = {}
        var body = req.body;
        async.each(body.users, function (data, cb) {
            var obj = {};
            obj.mobile = data.phoneNo;
            obj.message = body.smsTemplateMsg;
            arr.push(obj);
            cb(null, arr);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
        });
        msgdata.data = arr;
        data.users = msgdata;
        callback(null, req, data);
    }

    this.constructUsers = constructUsers;

    function constructRegisterUsers(req, data, callback) {
        var arr = [];
        var msgdata = {}
        var body = req.body;
        _.forEach(body.smsTemplateMsg, function (val) {
            async.each(body.users, function (data, cb) {
                var obj = {};
                obj.mobile = data.phoneNo;
                obj.message = val;
                arr.push(obj);
                cb(null, arr);
            }, function (err) {
                if (err) {
                    callback(err, null);
                }
            });
        } )
        msgdata.data = arr;
        data.users = msgdata;
        callback(null, req, data);
    }

    this.constructRegisterUsers = constructRegisterUsers;

    function sendNotification(req, data, callback) {
        var hostname = req.headers.host.split(':');
        if(hostname[0] == global.config.hostName) {
            console.log("sdbhusbvfjsvfjhvadfghva")
            if(req.body.status) {
                async.parallel({
                    sms: sendSMS.bind(null, req, data)
                }, function (err, response, body) {
                    if(err){
                        callback(err, req, data);
                    } else {
                        data.smsObj = response.sms;
                        callback(null, req, data);
                    }
                });
            } else {
                callback(null, req, data);
            }
        } else {
            callback(null, req, data);
        }


    }
    this.sendNotification = sendNotification;


    function saveNotificationInfo(req, data, callback) {
        var Model = models.get(getDb(req), 'StudentNotifications', NotificationSchema);
        var body = req.body;
        var bulk = Model.collection.initializeOrderedBulkOp();
        var ObjectId = mongoose.Types.ObjectId;
        var id = ObjectId();
        data.notificationId = id;
        async.each(body.users, function (data, cb) {
            bulk.insert({
                "notificationId" : id,
                "smsTemplateTitle": body.smsTemplateTitle,
                "smsTemplateMsg": body.smsTemplateMsg,
                "pushTemplateTitle": body.pushTemplateTitle,
                "pushTemplateMsg": body.pushTemplateMsg,
                "emailTemplateTitle": body.emailTemplateTitle,
                "emailTemplateMsg": body.emailTemplateMsg,
                "count": body.count,
                "createdBy": body.createdBy,
                "createdDate": new Date(body.createdDate),
                "updatedBy": body.updatedBy,
                "updatedDate": new Date(body.updatedDate),
                "status": body.status,
                "student": ObjectId(data._id),
                "createdId":ObjectId(body.createdId),
                "updatedId": ObjectId(body.updatedId)
            })
            cb(null, bulk);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
            bulk.execute(function (err, result) {
                if (err) {
                    callback(err, null);
                }
                callback(null, result, data);
            });
        });
    }
    this.saveNotificationInfo = saveNotificationInfo;


    function saveAttNotificationInfo(req, datas, callback) {
        var Model = models.get(getDb(req), 'StudentNotifications', NotificationSchema);
        var body = datas;
        var bulk = Model.collection.initializeOrderedBulkOp();
        var ObjectId = mongoose.Types.ObjectId;
        var id = ObjectId();
        async.each(body.userData, function (data, cb) {
            bulk.insert({
                "notificationId" : id,
                "smsTemplateTitle": body.template.smsTitle ? body.template.smsTitle : 'Attendance',
                "smsTemplateMsg": body.template.smsTemp,
                /*"pushTemplateTitle": body.pushTemplateTitle,
                "pushTemplateMsg": body.pushTemplateMsg,
                "emailTemplateTitle": body.emailTemplateTitle,
                "emailTemplateMsg": body.emailTemplateMsg,*/
                "count": body.count ? body.count: '1',
                "createdBy": body.createdBy ? body.createdBy : req.session.lid,
                "createdDate": body.createdDate ? new Date(body.createdDate): new Date(),
                "updatedBy": body.updatedBy ? body.updatedBy : req.session.lid,
                "updatedDate": body.updatedDate ? new Date(body.updatedDate): new Date(),
                "status": body.status,
                "student": ObjectId(data.student),
                "course": ObjectId(data.course),
                "center": data.center,
                "batch": ObjectId(data.batch),
            })
            cb(null, bulk);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
            bulk.execute(function (err, result) {
                if (err) {
                    callback(err, null);
                }
                callback(null, result, body);
            });
        });
    }
    this.saveAttNotificationInfo = saveAttNotificationInfo;

    this.create = function (req, res, next) {
        var data = {};
        var body = req.body;
        async.waterfall([
            constructUsers.bind(null, req, data),
            sendNotification.bind(),
            saveNotificationInfo.bind()
        ], function (err, result, data) {
            if (err) {
                return next(err);
            }
            var obj = {
                "_id": data.notificationId,
                "title": body.smsTemplateTitle,
                "message": body.smsTemplateMsg,
                "status": body.status,
                "updatedBy": body.updatedBy,
                "count": ((body.count) * (data.users.length))
            };
            res.status(200).send(obj);
        });
    };

    this.update = function (req, res, next) {
        var data = {};
        var body = req.body;
        async.waterfall([
            constructUsers.bind(null, req, data),
            sendNotification.bind(),
            updateNotificationInfo.bind()
        ], function (err, result, data) {
            if (err) {
                return next(err);
            }
            var obj = {
                "_id": data.notificationId,
                "title": body.smsTemplateTitle,
                "message": body.smsTemplateMsg,
                "status": body.status,
                "updatedBy": body.updatedBy,
                "count": ((body.count) * (data.users.length))
            };
            res.status(200).send(obj);
        });
    };

    this.updateEmpNotification = function (req, res, next) {
        var data = {};
        var body = req.body;
        async.waterfall([
            constructUsers.bind(null, req, data),
            sendNotification.bind(),
            updateEmpNotificationInfo.bind()
        ], function (err, result, data) {
            if (err) {
                return next(err);
            }
            var obj = {
                "_id": data.notificationId,
                "title": body.smsTemplateTitle,
                "message": body.smsTemplateMsg,
                "status": body.status,
                "updatedBy": body.updatedBy,
                "count": ((body.count) * (data.users.length))
            };
            res.status(200).send(obj);
        });
    };

    function updateEmpNotificationInfo(req, data, callback) {
        async.waterfall([
            deleteEmpNotificationById.bind(null, req, data),
            saveEmpNotificationById.bind()
        ], function (err, result) {
            if (err) {
                callback(err, null, data);
            }
            callback(null, result, data);
        });
    };

    function saveEmpNotificationById(req, data, callback) {
        var Model = models.get(getDb(req), 'EmployeeNotifications', EmpNotificationSchema);
        var body = req.body;
        var bulk = Model.collection.initializeOrderedBulkOp();
        var ObjectId = mongoose.Types.ObjectId;
        var id = ObjectId(req.params.id);
        data.notificationId = id;
        async.each(body.users, function (data, cb) {
            bulk.insert({
                "notificationId" : id,
                "smsTemplateTitle": body.smsTemplateTitle,
                "smsTemplateMsg": body.smsTemplateMsg,
                "pushTemplateTitle": body.pushTemplateTitle,
                "pushTemplateMsg": body.pushTemplateMsg,
                "emailTemplateTitle": body.emailTemplateTitle,
                "emailTemplateMsg": body.emailTemplateMsg,
                "count": body.count,
                "createdBy": body.createdBy,
                "createdDate": body.createdDate,
                "updatedBy": body.updatedBy,
                "updatedDate": body.updatedDate,
                "status": body.status,
                "employee": ObjectId(data._id),
                "batch": ObjectId(data.batch),
                "createdId":ObjectId(body.createdId),
                "updatedId": ObjectId(body.updatedId)
            })
            cb(null, bulk);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
            bulk.execute(function (err, result) {
                if (err) {
                    callback(err, null);
                }
                callback(null, result, data);
            });
        });
    }

    function deleteEmpNotificationById(req, data, callback) {
        var id = req.params.id;
        var Model = models.get(getDb(req), 'EmployeeNotifications', EmpNotificationSchema);

        Model.remove({notificationId: ObjectId(id)}, function (err, notification) {
            if (err) {
                callback(err, null);
            }

            callback(null, req, data);
        });
    };

    function deleteNotificationById(req, data, callback) {
        var id = req.params.id;
        var Model = models.get(getDb(req), 'StudentNotifications', NotificationSchema);

        Model.remove({notificationId: ObjectId(id)}, function (err, notification) {
            if (err) {
                callback(err, null);
            }

            callback(null, req, data);
        });
    };

    function saveNotificationById(req, data, callback) {
        var Model = models.get(getDb(req), 'StudentNotifications', NotificationSchema);
        var body = req.body;
        var bulk = Model.collection.initializeOrderedBulkOp();
        var ObjectId = mongoose.Types.ObjectId;
        var id = ObjectId(req.params.id);
        data.notificationId = id;
        async.each(body.users, function (data, cb) {
            bulk.insert({
                "notificationId" : id,
                "smsTemplateTitle": body.smsTemplateTitle,
                "smsTemplateMsg": body.smsTemplateMsg,
                "pushTemplateTitle": body.pushTemplateTitle,
                "pushTemplateMsg": body.pushTemplateMsg,
                "emailTemplateTitle": body.emailTemplateTitle,
                "emailTemplateMsg": body.emailTemplateMsg,
                "count": body.count,
                "createdBy": body.createdBy,
                "createdDate": body.createdDate,
                "updatedBy": body.updatedBy,
                "updatedDate": body.updatedDate,
                "status": body.status,
                "student": ObjectId(data._id),
                "course": ObjectId(data.course),
                "center": ObjectId(data.center),
                "batch": ObjectId(data.batch),
                "createdId":ObjectId(body.createdId),
                "updatedId": ObjectId(body.updatedId)
            })
            cb(null, bulk);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
            bulk.execute(function (err, result) {
                if (err) {
                    callback(err, null);
                }
                callback(null, result, data);
            });
        });
    };

    function updateNotificationInfo(req, data, callback) {
        async.waterfall([
            deleteNotificationById.bind(null, req, data),
            saveNotificationById.bind()
        ], function (err, result) {
            if (err) {
                callback(err, null, data);
            }
            callback(null, result, data);
        });
    }

    function saveEmpNotificationInfo(req, data, callback) {
        var Model = models.get(getDb(req), 'EmployeeNotifications', EmpNotificationSchema);
        var body = req.body;
        var bulk = Model.collection.initializeOrderedBulkOp();
        var ObjectId = mongoose.Types.ObjectId;
        var id = ObjectId();
        data.notificationId = id;
        async.each(body.users, function (data, cb) {
            bulk.insert({
                "notificationId" : id,
                "smsTemplateTitle": body.smsTemplateTitle,
                "smsTemplateMsg": body.smsTemplateMsg,
                "pushTemplateTitle": body.pushTemplateTitle,
                "pushTemplateMsg": body.pushTemplateMsg,
                "emailTemplateTitle": body.emailTemplateTitle,
                "emailTemplateMsg": body.emailTemplateMsg,
                "count": body.count,
                "createdBy": body.createdBy,
                "createdDate": body.createdDate,
                "updatedBy": body.updatedBy,
                "updatedDate": body.updatedDate,
                "status": body.status,
                "employee": ObjectId(data._id),
                "batch": ObjectId(data.batch),
                "createdId":ObjectId(body.createdId),
                "updatedId": ObjectId(body.updatedId)
            })
            cb(null, bulk);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
            bulk.execute(function (err, result) {
                if (err) {
                    callback(err, null);
                }
                callback(null, result, data);
            });
        });
    }

    this.createEmpNotification = function (req, res, next) {
        var data = {};
        var body = req.body;
        async.waterfall([
            constructUsers.bind(null, req, data),
            sendNotification.bind(),
            saveEmpNotificationInfo.bind()
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            var obj = {
                "_id": data.notificationId,
                "title": body.smsTemplateTitle,
                "message": body.smsTemplateMsg,
                "status": body.status,
                "updatedBy": body.updatedBy,
                "count": ((body.count) * (data.users.length))
            };
            res.status(200).send(obj);
        });
    };

    function constructPhoneNos(req, data, callback) {
        var arr = [];
        var body = req.body;
        var msgdata = {};
        async.each(body.phoneNo, function (value, cb) {
            var obj = {};
            obj.mobile = value;
            obj.message = body.smsTemplateMsg;
            arr.push(obj);
            cb(null, arr);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
        });
        msgdata.data = arr;
        data.users = msgdata;
        callback(null, req, data);
    }

    function saveOtherNotificationInfo(req, data, callback) {
        var Model = models.get(getDb(req), 'OtherNotifications', OtherNotificationSchema);
        var body = req.body;
        var ObjectId = mongoose.Types.ObjectId;
        var id = ObjectId();
        data.notificationId = id;
        var obj = new Model({
            "notificationId" : id,
            "smsTemplateTitle": body.smsTemplateTitle,
            "smsTemplateMsg": body.smsTemplateMsg,
            "pushTemplateTitle": body.pushTemplateTitle,
            "pushTemplateMsg": body.pushTemplateMsg,
            "emailTemplateTitle": body.emailTemplateTitle,
            "emailTemplateMsg": body.emailTemplateMsg,
            "count": body.count,
            "createdBy": body.createdBy,
            "createdDate": body.createdDate,
            "updatedBy": body.updatedBy,
            "updatedDate": body.updatedDate,
            "status": body.status,
            "phoneNo": body.phoneNo,
            "createdId":ObjectId(body.createdId),
            "updatedId": ObjectId(body.updatedId)
        });

        obj.save(function (err, result) {
            if (err) {
                callback(err, null);
            }
            callback(null, result, data);

        });
    }

    this.createOtherNotification = function (req, res, next) {
        var data = {};
        var body = req.body;
        req.body.stype = 'S';
        async.waterfall([
            constructPhoneNos.bind(null, req, data),
            sendNotification.bind(),
            saveOtherNotificationInfo.bind()
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            var obj = {
                "_id": data.notificationId,
                "title": body.smsTemplateTitle,
                "message": body.smsTemplateMsg,
                "status": body.status,
                "updatedBy": body.updatedBy,
                "count": ((body.count) * (data.users.length))
            };
            res.status(200).send(obj);
        });
    };

    this.getOtherNotifications = function (req, res, next) {
        var Model = models.get(getDb(req), 'OtherNotifications', OtherNotificationSchema);
        Model.find({}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    }

    function updateOtherNotificationInfo(req, data, callback) {
        var Model = models.get(getDb(req), 'OtherNotifications', OtherNotificationSchema);
        var body = req.body;
        var ObjectId = mongoose.Types.ObjectId;
        var id = ObjectId(req.params.id);
        data.notificationId = id;
        var obj = {
            "notificationId" : id,
            "smsTemplateTitle": body.smsTemplateTitle,
            "smsTemplateMsg": body.smsTemplateMsg,
            "pushTemplateTitle": body.pushTemplateTitle,
            "pushTemplateMsg": body.pushTemplateMsg,
            "emailTemplateTitle": body.emailTemplateTitle,
            "emailTemplateMsg": body.emailTemplateMsg,
            "count": body.count,
            "createdBy": body.createdBy,
            "createdDate": body.createdDate,
            "updatedBy": body.updatedBy,
            "updatedDate": body.updatedDate,
            "status": body.status,
            "phoneNo": body.phoneNo,
            "createdId":ObjectId(body.createdId),
            "updatedId": ObjectId(body.updatedId)
        };
        Model.update({ notificationId: id }, obj, {new: true}, function (err, result) {
            if (err) {
                callback(err, null);
            }

            callback(err, result, data);
        });
    }

    this.removeOtherNotifications = function (req, res, next) {
        var id = req.params.id;
        var Model = models.get(getDb(req), 'OtherNotifications', OtherNotificationSchema);

        Model.remove({_id: ObjectId(id)}, function (err, notification) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: notification, message: 'Deleted Successfully'});
        });
    }

    this.updateOtherNotification = function (req, res, next) {
        var data = {};
        var body = req.body;
        async.waterfall([
            constructPhoneNos.bind(null, req, data),
            sendNotification.bind(),
            updateOtherNotificationInfo.bind()
        ], function (err, result, data) {
            if (err) {
                return next(err);
            }
            var obj = {
                "_id": data.notificationId,
                "title": body.smsTemplateTitle,
                "message": body.smsTemplateMsg,
                "status": body.status,
                "updatedBy": body.updatedBy,
                "count": ((body.count) * (data.users.length))
            };
            res.status(200).send(obj);
        });
    };

};

module.exports = Module;