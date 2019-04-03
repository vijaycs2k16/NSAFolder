/**
 * Created by Deepak on 08/02/17.
 */


var express = require('express')
    , nsaElasticSearch = require('./../services/es/search')
    , nsaatu = require('../services/es/classutil')
    , nsabb = require('../services/es/builderutil')


/*exports.getClassIndex = function(req, res) {
    async.waterfall(
        [
            attendanceIndexExists.bind(null, req),
            deleteAttendanceIndex.bind(),
            createAttendanceIndexMappings.bind()
        ],
        function (err,  data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, err);
            } else {
                events.emit('JsonResponse', req, res, data);
            }
        }
    );
};*/



exports.getSchoolData = function(req, res, next) {
    var searchParams = nsabb.getSchools(req);
    nsaElasticSearch.searchUsers(searchParams, function (err, data) {
        if (err) {
            return next(err);
        }
        var schoolData = data.hits.hits;
        res.status(200).send({data: schoolData});
    })
};




/*
function attendanceIndexExists(req, callback) {
    var params = nsaatu.constructClassIndex(req);

    nsaElasticSearch.indexExists(params, function(err, result) {
        callback(null, req, result);
    })
};
exports.attendanceIndexExists = attendanceIndexExists;


function deleteAttendanceIndex(req, result, callback) {
    var params = nsaatu.constructClassIndex(req);

    if(result) {
        nsaElasticSearch.delete(params, function(err, data) {
            callback(null, req);
        })
    } else {
        callback(null, req);
    }
};
exports.deleteAttendanceIndex = deleteAttendanceIndex;

function createAttendanceIndexMappings(req, callback) {

    var params = nsaatu.createClassIndexWithMappings(req);
    nsaElasticSearch.createIndex(params, function(err, data) {
        callback(null, data);
    })
};
exports.createAttendanceIndexMappings = createAttendanceIndexMappings;

*/
