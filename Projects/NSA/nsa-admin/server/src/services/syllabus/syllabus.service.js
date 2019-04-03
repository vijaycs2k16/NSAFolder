/**
 * Created by Deepa on 7/28/2018.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    es = require('../../services/search/elasticsearch/elasticsearch.service'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    async = require('async'),
    _ = require('lodash'),
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger'),
    gallary = require('../../services/gallery/gallery.service'),
    notificationService = require('../sms/notifications/notification.service'),
    baseService = require('../common/base.service');


exports.getSyllabusByClass = function (req, res) {
    //For both Get All Syllabus and single syllabus
    console.log('getSyllabusByClass...',req.body)
    nsaCassandra.Syllabus.getSyllabusByClass(req, function (err, result) {
        console.log('result',result)
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, message.nsa22001);
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveSchoolSyllabus = function(req, res){
    nsaCassandra.Syllabus.getSyllabusByClass(req, function (err, response) {
        var result = _.intersectionBy(req.body.classes, JSON.parse(JSON.stringify(response)), 'id');
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa22001));
        } else if(result.length > 0 ){
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa22005});
        } else {
            async.waterfall([
                saveSyllabus.bind(null,req),
                executeBatch.bind()
            ], function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa22001));
                } else {
                    var notify = (req.body.notify.sms || req.body.notify.push) ? true : false;
                    if(notify) {
                        sendNotification(req, function(err1, result1){
                            if(err1) {
                                logger.debug(err1);
                                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa2803));
                            } else {
                                var output = {};
                                output['message'] = message.nsa22000;
                                output['data'] = result1;
                                events.emit('JsonResponse', req, res, output);
                            }
                        })
                    } else {
                        var result = {}
                        result['message'] = message.nsa22000;
                        events.emit('JsonResponse', req, res, result);
                    }
                }
            });
        }
    })
};

exports.deleteSchoolSyllabus = function(req, res) {
    nsaCassandra.Syllabus.deleteSyllabusByClass(req, function(err, result) {
        console.log('result....',result)
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, message.nsa22001);
        } else {
            events.emit('JsonResponse', req, res, {message:  message.nsa22004});
        }
    })
};


function sendNotification(req, callback) {
    var data = {};
    async.waterfall([
            getUsers.bind(null, req, data),
            getSyllabusTemplate.bind(),
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
};
exports.sendNotification = sendNotification;

function getTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.attendancebase.getTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getTemplateObj = getTemplateObj;


function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

function getSyllabusTemplate(req, users, callback) {
        var data = { featureId: constant.ACADEMICS, subFeatureId: constant.SYLLABUS, action: constant.CREATE_ACTION, userType: constant.STUDENT };
        nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
            callback(err, req, users, result);
        })
};
exports.getSyllabusTemplate = getSyllabusTemplate;

function getUsers(req, data, callback) {
    var classes = req.body.classes;
    if(Array.isArray(classes) && classes.length > 0) {
        es.getUsersByClass(req, function(err, result){
            data['users'] = result;
            data['students'] = result || null;
            callback(err, req, data);
        });
    } else {
        callback(null, req, []);
    }
}

    exports.updateSchoolSyllabus = function(req,res){
        async.waterfall([
            updateSyllabus.bind(null, req),
            executeBatch.bind()
        ], function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa22001));
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa22000});
            }
        });
    };


    exports.updateSchoolSyllabusByClassId = function(req,res){
        async.waterfall([
            updateSyllabusById.bind(null, req),
            executeBatch.bind()
        ], function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa22001));
            } else {
                var notify = (req.body.notify && (req.body.notify.sms || req.body.notify.push)) ? true : false;
                if(notify) {
                    sendNotification(req, function(err1, result1){
                        if(err1) {
                            logger.debug(err1);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa2803));
                        } else {
                            var output = {Id: req.params.id};
                            output['message'] = message.nsa22003;
                            output['data'] = result1;                      
                            events.emit('JsonResponse', req, res, output);
                        }
                    })
                } else {
                    var result = {Id: req.params.id}                 
                    result['message'] = message.nsa22003;
                    events.emit('JsonResponse', req, res, result);
                }
            }
        });
    };


    function saveSyllabus(req, callback) {
        nsaCassandra.Syllabus.saveSchoolSyllabus(req, function (err, result) {
            callback(err, req, result);
        })
    };
    exports.saveSyllabus = saveSyllabus;


    function updateSyllabus(req, callback) {
        nsaCassandra.Syllabus.updateSchoolSyllabus(req, function (err, result) {
            callback(err, req, result);
        })
    };
    exports.updateSyllabus = updateSyllabus;

    function updateSyllabusById(req, callback) {
        nsaCassandra.Syllabus.updateSchoolSyllabusById(req, function (err, result) {
            callback(err, req, result);
        })
    };
    exports.updateSyllabusById = updateSyllabusById;

    function executeBatch(req, data, callback) {
        nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
            callback(err, data);
        })
    };
    exports.executeBatch = executeBatch;


    function buildErrResponse(err, message) {
        return responseBuilder.buildResponse(constant.SYLLABUS_DETAILS, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
    };
    exports.buildErrResponse = buildErrResponse;


    exports.deleteAttachments = function (req, res) {
        nsaCassandra.Syllabus.deleteAttachment(req, function(err, result){
            if(err){
                logger.debugLog(req, 'deleteAttachments In Syllabus ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4704));
            }else {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4704));
                } else {
                    req.body.seletedImageIds = [req.body.curentFile];

                    getAttachmentsByKey(req, result, function (err, data) {
                        if(_.isEmpty(data)) {
                            gallary.deleteS3Src(req, function(err, result1){
                                if(err){
                                    logger.debug(err);
                                }else {
                                    var output = { message: message.nsa4703, data: req.body};
                                    events.emit('JsonResponse', req, res, output);
                                }
                            });
                        } else {
                            var output = { message: message.nsa4703, data: req.body};
                            events.emit('JsonResponse', req, res, output);
                        }
                    })
                }
            }

        })
    };


    function getAttachmentsByKey(req, data, callback) {
        nsaCassandra.Base.syllabusbase.deleteAttachmentByKey(req, data, function(err, result) {
            callback(err, req, result);
        })
    };
    exports.getAttachmentsByKey = getAttachmentsByKey;
