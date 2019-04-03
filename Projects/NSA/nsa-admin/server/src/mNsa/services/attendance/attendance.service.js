
var baseService = require('@nsa/nsa-cassandra').BaseService,
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    nsaau = require('@nsa/nsa-bodybuilder').assignmentUtil,
    common = require('../../core/attendance'),
    attendanceConverter = require('../../converters/attendance'),
    //dateUtils = require('@nsa/nsa-commons').dateUtils,
    //notificationService = require('../sms/notifications/notification.service'),
    logger = require('../../../../config/logger'),
    _ = require('lodash');



var attendance = function(models){

    this.getAttendanceAll = function(req, res){
        console.log('First Get Call in Mongo DB......!!!')
    }

    this.getDetailsByAttendanceId = function(req,res){
        async.waterfall([
             getDetailsByAttendanceID.bind(null, req)
        ], function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1603));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    }

    function getDetailsByAttendanceID(req, callback) {
      //  var headers = baseService.getHeaders(req);
        var findQuery = {
            _id : req.params.id
        };
        common.getAttendanceDetail(req, findQuery, models, function (err, result) {
            callback(err, attendanceConverter.schoolAttendanceObjs(result))
            //callback(err, result)
        })
    };
    exports.getDetailsByAttendanceID = getDetailsByAttendanceID;


    this.getAttendanceHistory = function(req, res){
        console.log('req.......',req.query)
        async.waterfall([
            getDetailsByHistory.bind(null, req)
        ], function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1603));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    }


    this.saveAttendance = function(req, res){
        var data = []
        async.waterfall([
            saveAttendanceData.bind(null, req ,data),
            saveAttendanceDetailsData.bind()
        ], function (err, result) {
            console.log('rfrfeergergre......',result)
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1603));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    }

    function saveAttendanceData(req, data, callback){
        console.log('body.....',req.body)
        data = req.body;

        callback(null, req, data)

    }

    function saveAttendanceDetailsData(req, data, callback){
        console.log('body..details...',data)
        callback(null, data)
    }

    function getDetailsByHistory(req, callback) {
        //  var headers = baseService.getHeaders(req);
        var queryParam = req.query;
        var classId = queryParam.classId;
        var sectionId = queryParam.sectionId;
        var startDate = queryParam.startDate;
        var endDate = queryParam.endDate;
        var currentDate = new Date();

        //var findQuery = {}
        var findQuery = {
            _id : req.params.id
        };
        if(classId != null && !(_.isEmpty(classId))) {
            findQuery.class_id = classId;
        }
        if(sectionId != null && !(_.isEmpty(sectionId))) {
            findQuery.section_id = sectionId;
        }

        if(startDate != null &&  !(_.isEmpty(startDate)) && endDate != null && !(_.isEmpty(endDate))) {
            startDate = baseService.getFormattedDate(startDate);
            endDate = baseService.getFormattedDate(endDate);
            findQuery.attendance_date = {'$gte': startDate, '$lte': endDate};
        }

        if (endDate > currentDate ) {
            endDate =  currentDate;
        } else {
            endDate = endDate;
        }

        common.getAttendanceHistory(req, findQuery, models, function (err, result) {
            callback(err, attendanceConverter.schoolAttendanceHistoryObjs(result))
        })
    };
    exports.getDetailsByAttendanceID = getDetailsByAttendanceID;

}

module.exports = attendance;