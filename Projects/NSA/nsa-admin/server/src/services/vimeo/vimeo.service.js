/**
 * Created by Kiranmai A on 1/6/2017.
 */
var express = require('express')
    , request = require('request')
    , message = require('@nsa/nsa-commons').messages
    , events = require('@nsa/nsa-commons').events
    , constants = require('../../common/constants/constants');

exports.getVideo = function(req, res, cb) {
    request({
        url: global.config.vimeo.url + req.params.id, //URL to hit
        method: constants.METHOD_GET,
        headers: {
            'Content-Type': constants.CONTENT_TYPE,
            'Authorization': 'Bearer ' + global.config.vimeo.bearer
        }
    }, function (error, response, body) {
        if(error) {
            logger.debug(error);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(error, message.nsa613));
        } else {
            events.emit('JsonResponse', req, res, JSON.parse(body));
        }
    });
};


function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.GRADE_DETAILS, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;