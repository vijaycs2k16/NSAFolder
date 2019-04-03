/**
 * Created by Sai Deepak on 01-Feb-17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    BaseError = require('@nsa/nsa-commons').BaseError,
    logger = require('../../../config/logger');

exports.getAllCategories = function(req, res) {
    nsaCassandra.Taxanomy.getAllCategories(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa8001)));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getDeptCategories = function(req, res) {
    deptCategories(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa8001)));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

function deptCategories(req, callback) {
    nsaCassandra.Taxanomy.getDeptCategories(req, function(err, response) {
        callback(err, response)
    })
}
exports.deptCategories = deptCategories;

exports.getTwoLevelCategories = function(req, res) {
    nsaCassandra.Taxanomy.getTwoLevelCategories(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa8001)));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getLevelCategories = function(req, res) {
    nsaCassandra.Taxanomy.getLevelCategories(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa8001)));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getEmpLevelCategories = function(req, res) {
    var userPerm = nsaCassandra.BaseService.haveUserLevelPerm(req);
    if (req.headers.userInfo.user_type === constant.EMPLOYEE && userPerm) {
        async.parallel({
            empClss: getEmpClasses.bind(null, req),
            taxanomy: nsaCassandra.Taxanomy.getLevelCategories.bind(null, req)
        }, function (err, result) {
            filterClassTaxanomy(result, function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa8001)));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            })

        })
    } else {
        nsaCassandra.Taxanomy.getLevelCategories(req, function(err, response) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa8001)));
            } else {
                events.emit('JsonResponse', req, res, response);
            }
        })
    }
};

function filterClassTaxanomy(result, cb) {
    var taxanomy = result.taxanomy;
    var empClssSec = _.groupBy(JSON.parse(JSON.stringify(result.empClss)), 'class_id');
    var empClss = _.uniqBy(JSON.parse(JSON.stringify(result.empClss)), 'class_id');
    if(!_.isEmpty(taxanomy)) {
        taxanomy = JSON.parse(JSON.stringify(taxanomy))
        _.forEach(taxanomy, function (value, index) {
            if(value.id == constant.ALL_CLASSES_ID) {
                var children1 = [];
                _.forEach(value.children, function (val1, index1) {
                    if(!_.isEmpty(_.filter(empClss, {'class_id': val1.id}))) {
                        children1.push(val1);
                        var child2 = [];
                        _.forEach(val1.children, function (val2, index2) {
                            if(!_.isEmpty(_.filter(empClssSec[val1.id], {'section_id': val2.id}))) {
                                child2.push(val2)
                            }
                            if(index2 === val1.children.length -1) {
                                val1.children = child2;
                            }
                        });
                    }
                    if(index1 === value.children.length -1) {
                        value.children = children1;
                    }
                })
            }
            if(index === taxanomy.length -1) {
                cb(null, taxanomy)
            }

        })
    } else {
        cb(null, [])
    }


}

function getEmpClasses(req, callback) {
    nsaCassandra.Timetable.getTimetableByEmpId(req, req.headers.userInfo.user_name, function (err, result) {
        var data = JSON.parse(JSON.stringify(result));
        callback(err, data)
    })
}

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.TAXANOMY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
}
exports.buildErrResponse = buildErrResponse;

function throwNotificationErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.TAXANOMY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwNotificationErr = throwNotificationErr;
