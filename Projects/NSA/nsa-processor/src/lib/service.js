/**
 * Created by bharatkumarr on 14/07/17.
 */

var _ = require('lodash')
    , async = require('async')
    , nsaCassandra = require('@nsa/nsa-cassandra')
    , events = require('@nsa/nsa-commons').events
    , message = require('@nsa/nsa-commons').messages
    , logger = require('../../config/logger')
    , nsabb = require('@nsa/nsa-bodybuilder').builderutil
    , nsaElasticSearch = require('@nsa/nsa-elasticsearch')
    , sendNotification = require('./send.notification')
    , tracking = require('./livetrack');

exports.preparation = function (req, res) {
    async.parallel({
        transportTemplate : getTransportTemplate.bind(null, req),
        transportNotify : getTransportChannel.bind(null, req),
        schoolDetails : getSchools.bind(null, req),
    }, function (err, response) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, err.message));
        } else {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, err.message));
            } else {
                events.emit('JsonResponse', req, res, response);
            }
        }
    });
}

exports.vehicleUsers = function (req, res) {
    // logger.debug('Going to Fetch Vehicle Info from ES for ', req.params.id);
    var searchParams = nsabb.getStopsByVehicle(req.params.id);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, ressponse, status) {
        if (err) {
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, 'Unable to Fetch Students '));
        } else {
            if (ressponse.hits.hits.length > 0) {
                events.emit('JsonResponse', req, res, ressponse.hits.hits[0]._source);
            } else {
                events.emit('ErrorJsonResponse', req, res,  'Vehicle ' + req.params.id + '  is not Found in ES');
            }
        }
    });
}

exports.sendNotification = function (req, res) {
    logger.debug('Going to Send Notification ');
    try {
        sendNotification.sendNotification(req.body.preparationData, req.body.school_id, req.body.users,
            req.body.params,     function(err, result) {
                if (err) {
                    logger.debug('Unable to send notification ', err);
                    events.emit('ErrorJsonResponse', req, res,  buildErrResponse(err, 'Unable to send notification '));
                } else {
                    events.emit('JsonResponse', req, res, 'Send Notification');
                }
            });
    } catch(e) {
        events.emit('ErrorJsonResponse', req, res,  'Unable to send notification ');
    }
}

exports.tracking = function (req, res) {
    try {
        tracking.livetrack(req, res);
    } catch(e) {
        events.emit('ErrorJsonResponse', req, res,  'Unable to tracking ');
    }
}

exports.reset = function (req, res) {
    try {
        tracking.reset(req, res);
    } catch(e) {
        events.emit('ErrorJsonResponse', req, res,  'Unable to reset ');
    }
}

function getTransportTemplate (req, callback) {
    nsaCassandra.Feature.getTransportTemplate(function(err, results) {
        getAsSchoolSpecificObjs(results, false, callback);
    });
};

function getTransportChannel(req, callback) {
    nsaCassandra.Feature.getTransportNotify(function(err, results) {
        getAsSchoolSpecificObjs(results, true, callback);
    });
};

function getSchools(req, callback) {
    nsaCassandra.School.getSchoolDetailsForProcessor(function(err, results) {
        getAsSchoolSpecificObjs(results, false, callback);
    });
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.ACADEMIC_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};


/*function sendResults(err, results, errMessage, isChannelObj) {
    if(err) {
        logger.debug(err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, errMessage));
    } else {
        getAsSchoolSpecificObjs(JSON.parse(JSON.stringify(results)), isChannelObj, function (err, finalResults) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, errMessage));
            } else {
                events.emit('JsonResponse', req, res, finalResults);
            }
        });
    }
}*/

function getAsSchoolSpecificObjs (results, isChannelObj, callback) {
    var finalResult = {};
    async.each(results, function(result, iCallback) {
        if (isChannelObj) {
            finalResult[result.school_id] = {notify: {sms: result.sms, email: result.email, push: result.push }};
        } else {
            finalResult[result.school_id] = result;
        }
        iCallback();
    }, function(err) {
        callback(err, finalResult);
    });
}