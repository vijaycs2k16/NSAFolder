/**
 * Created by intellishine on 8/24/2018.
 */



var dateService = require('@nsa/nsa-commons').dateUtils,
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    baseService = require('../../../nsa-cassandra/src/services/common/base.service'),
    constant = require('@nsa/nsa-commons').constants,
    AttendanceDomain = require('../domain/Attendance');


exports.attendanceObjs = function(req, data) {
    var convertAttendanceObjs = [];
    if(_.isEmpty(data.hits.hits)) {
        var returnData = {};
        returnData.draw = req.query.draw;
        returnData.recordsTotal = data.hits.total;
        returnData.recordsFiltered = data.hits.total;
        returnData.data = convertAttendanceObjs;
        return returnData;
    } else {
        try {
            var myarr = data.hits.hits;
            if(myarr.length > 0) {
                _.forEach(myarr, function (obj, key) {
                    var value = obj._source
                    var attendanceObj = Object.assign({}, AttendanceDomain);
                    var updatedDate = dateService.getFormattedDate(value['updated_date']);
                    var createdDate = dateService.getFormattedDate(value['created_date']);
                    var attendanceDate = dateService.getFormattedDate(value['attendance_date']);

                    attendanceObj.id = value['attendance_id'],
                        attendanceObj.tenantId = value['tenant_id'],
                        attendanceObj.schoolId = value['school_id'],
                        attendanceObj.academicYear = value['academic_year'],
                        attendanceObj.mediaName= value['media_name'],
                        attendanceObj.classId = value['class_id'],
                        attendanceObj.className = value['class_name'],
                        attendanceObj.sectionId = value['section_id'],
                        attendanceObj.sectionName = value['section_name'],
                        attendanceObj.totalStrength = value['total_strength'],
                        attendanceObj.noOfPresent = value['no_of_present'],
                        attendanceObj.noOfAbsent = value['no_of_absent'],
                        attendanceObj.presentPercent = value['present_percent'],
                        attendanceObj.attendanceDate = attendanceDate,
                        attendanceObj.recordedDate = value['recorded_date'],
                        attendanceObj.recordedBy = value['recorded_by'],
                        attendanceObj.recordedUsername = value['recorded_username'],
                        attendanceObj.updatedBy = value['updated_by'],
                        attendanceObj.updatedDate = updatedDate,
                        attendanceObj.updatedUserName = value['updated_username'],
                        attendanceObj.createdBy = value['created_by'],
                        attendanceObj.createdFirstName = value['created_firstname'],
                        attendanceObj.createdDate = createdDate,
                        attendanceObj.editPermissions = baseService.havePermissionsToEdit(req, constant.ATTENDANCE_INFO_PERMISSIONS, value['created_by']);
                    convertAttendanceObjs.push(attendanceObj);
                });
            }
            var returnData = {};
            returnData.draw = req.query.draw;
            returnData.recordsTotal = data.hits.total;
            returnData.recordsFiltered = data.hits.total;
            returnData.data = convertAttendanceObjs;
            return returnData;
        }
        catch (err) {
            return responseBuilder.buildResponse(constant.ATTENDANCE_NAME, constant.APP_TYPE, message.nsa1208, err.message, constant.HTTP_BAD_REQUEST);
        }
    }

};


exports.attendanceDetailsObjs = function(req, data) {
    var convertAttendancedetailsObjs = [];
    if(_.isEmpty(data.hits.hits)) {
        var returnData = {};
        returnData.draw = req.query.draw;
        returnData.recordsTotal = data.hits.total;
        returnData.recordsFiltered = data.hits.total;
        returnData.data = convertAttendancedetailsObjs;
        return returnData;
    } else {
        try {
            var myarr = data.hits.hits;
            if(myarr.length > 0) {
                _.forEach(myarr, function (obj, key) {
                    var value = obj._source
                    var attendancedetailsObj = Object.assign({}, AttendanceDomain);
                    var updatedDate = dateService.getFormattedDate(value['updated_date']);
                    var createdDate = dateService.getFormattedDate(value['created_date']);


                    attendancedetailsObj.id = value['attendance_id'],
                        attendancedetailsObj.tenantId = value['tenant_id'],
                        attendancedetailsObj.schoolId = value['school_id'],
                        attendancedetailsObj.academicYear = value['academic_year'],
                        attendancedetailsObj.class_id = value['class_id'],
                        attendancedetailsObj.class_name = value['class_name'],
                        attendancedetailsObj.section_id = value['section_id'],
                        attendancedetailsObj.section_name = value['section_name'],
                        attendancedetailsObj.total_strength = value['total_strength'],
                        attendancedetailsObj.no_of_present = value['no_of_present'],
                        attendancedetailsObj.no_of_absent = value['no_of_absent'],
                        attendancedetailsObj.present_percent = value['present_percent'],
                        attendancedetailsObj.attendance_date = value['attendance_date'],
                        attendancedetailsObj.recorded_date = value['recorded_date'],
                        attendancedetailsObj.recorded_by = value['recorded_by'],
                        attendancedetailsObj.recorded_username = value['recorded_username'],
                        attendancedetailsObj.updatedBy = value['updated_by'],
                        attendancedetailsObj.updatedDate = updatedDate,
                        attendancedetailsObj.updatedUserName = value['updated_username'],
                        attendancedetailsObj.createdBy = value['created_by'],
                        attendancedetailsObj.createdFirstName = value['created_firstname'],
                        attendancedetailsObj.createdDate = createdDate,
                        attendancedetailsObj.editPermissions = baseService.havePermissionsToEdit(req, constant.ATTENDANCE_INFO_PERMISSIONS, value['created_by']);
                    convertAttendancedetailsObjs.push(attendancedetailsObj);
                });
            }
            var returnData = {};
            returnData.draw = req.query.draw;
            returnData.recordsTotal = data.hits.total;
            returnData.recordsFiltered = data.hits.total;
            returnData.data = convertAttendancedetailsObjs;
            return returnData;
        }
        catch (err) {
            return responseBuilder.buildResponse(constant.ATTENDANCE_NAME, constant.APP_TYPE, message.nsa1208, err.message, constant.HTTP_BAD_REQUEST);
        }
    }

};
