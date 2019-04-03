var dateFormat = require('dateformat');
var dateService = require('../utils/dateService');
var _  = require('lodash')
var moment  = require('moment')

exports.studentObj = function(obj, callback) {
    try {
        obj = JSON.parse(JSON.stringify(obj));
        if(obj.studentDetails){
            obj.studentDetails.dateOfBirth = obj.studentDetails.dateOfBirth  ? dateService.getDateFormatted(obj.studentDetails.dateOfBirth, "mmm d yyyy") : '';
            obj.studentDetails.dateOfJoining = obj.studentDetails.dateOfJoining  ? dateService.getDateFormatted(obj.studentDetails.dateOfJoining, "mmm d yyyy") : '';
        }
        obj.courseStartDate = obj.courseStartDate  ? dateService.getDateFormatted(obj.courseStartDate, "mmm d yyyy") : '';
        obj.courseEndDate = obj.courseEndDate  ? dateService.getDateFormatted(obj.courseEndDate, "mmm d yyyy") : '';
        callback(null, obj)
    }
    catch (err) {
        callback(err, null)
    }
};

exports.studentObjs = function (data, callback) {
        try {
            data = JSON.parse(JSON.stringify(data));
            _.forEach(data, function (value, index) {
                if(value.studentDetails){
                    value.studentDetails.dateOfBirth = value.studentDetails.dateOfBirth  ? dateService.getDateFormatted(value.studentDetails.dateOfBirth, "mmm d yyyy") : '';
                    value.studentDetails.dateOfJoining = value.studentDetails.dateOfJoining  ? dateService.getDateFormatted(value.studentDetails.dateOfJoining, "mmm d yyyy") : '';
                }
                var courseStartDate = value.courseStartDate ? value.courseStartDate.split('/') : null;
                var courseEndDate = value.courseEndDate ? value.courseEndDate.split('/') : null;
                if(courseStartDate && courseStartDate.length > 1) {
                    value.courseStartDate = moment(value.courseStartDate, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
                }
                if(courseEndDate && courseEndDate.length > 1) {
                    value.courseEndDate = moment(value.courseEndDate, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
                }
                value.courseStartDate = value.courseStartDate   ? dateService.getDateFormatted(value.courseStartDate, "mmm d yyyy") : '';
                value.courseEndDate = value.courseEndDate  ? dateService.getDateFormatted(value.courseEndDate, "mmm d yyyy") : '';
            });

            callback(null, data)

        }
        catch (err) {
            console.log("err", err)
            callback(err, null)
        }
};