var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    HolidaysDomain = require('../common/domains/Holidays'),
    SchoolHolidaysDomain = require('../common/domains/SchoolHolidays');




exports.holidaysObjs = function(req, data) {
    var convertholidaysObjs = [];
    if(_.isEmpty(data)) {
        convertholidaysObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function(value, key) {
                var holidaysObj = Object.assign({}, HolidaysDomain);
                var updatedDate = dateService.getFormattedDate(value['updated_date']);
                holidaysObj.holidayTypeId= value['holiday_type_id'],
                    holidaysObj.tenantId= value['tenant_id'],
                    holidaysObj.holidayType =value['holiday_type']
                holidaysObj.schoolId= value['school_id'],
                    holidaysObj.description = value['description'],
                    holidaysObj.academicYear =value['academic_year'],
                    holidaysObj.updatedDate= updatedDate,
                    holidaysObj.updatedBy= value['updated_by'],
                    holidaysObj.updatedUsername= value['updated_username'],
                    holidaysObj.updateddateAndName =value['updated_username']+' - '+ updatedDate,
                    holidaysObj.editPermissions = baseService.havePermissionsToEdit(req, constant.HOLIDAY_TYPE_PERMISSIONS, value['created_by']);
                convertholidaysObjs.push(holidaysObj);
            });
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.HOLIDAY_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return convertholidaysObjs;
};


exports.holidaysObj = function(req, value) {
    var holidaysObj = {};
    if(_.isEmpty(value)) {
        holidaysObj = baseService.emptyResponse();
    } else {
        try {
            var holidaysObj = Object.assign({}, HolidaysDomain);
            var updatedDate = dateService.getFormattedDate(value['updated_date']);
            holidaysObj.holidayTypeId= value['holiday_type_id'],
                holidaysObj.tenantId= value['tenant_id'],
                holidaysObj.holidayType =value['holiday_type']
            holidaysObj.schoolId= value['school_id'],
                holidaysObj.description = value['description'],
                holidaysObj.academicYear =value['academic_year'],
                holidaysObj.updatedDate= updatedDate,
                holidaysObj.updatedBy= value['updated_by'],
                holidaysObj.updatedUsername= value['updated_username'],
                holidaysObj.updateddateAndName =value['updated_username']+' - '+ updatedDate;
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.HOLIDAY_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return holidaysObj;
};


exports.schoolHolidaysObjs = function(req, data) {
    var convertschoolholidaysObjs = [];
    if(_.isEmpty(data)) {
        convertschoolholidaysObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function(value, key) {
                var schoolholidaysObj = Object.assign({}, SchoolHolidaysDomain);
                var updatedDate = dateService.getFormattedDate(value['updated_date']);
                var startDate = dateService.getFormattedDate(value['start_date']);
                var endDate = dateService.getFormattedDate(value['end_date']);
                    schoolholidaysObj.holidayTypeId= value['holiday_type_id'],
                    schoolholidaysObj.holidayId= value['holiday_id'],
                    schoolholidaysObj.tenantId= value['tenant_id'],
                    schoolholidaysObj.holidayName =value['holiday_name']
                    schoolholidaysObj.schoolId= value['school_id'],
                    schoolholidaysObj.academicYear =value['academic_year'],
                    schoolholidaysObj.holidayType =value['holiday_type'],
                    schoolholidaysObj.updatedDate= updatedDate,
                    schoolholidaysObj.startDate = startDate,
                    schoolholidaysObj.endDate = endDate,
                    schoolholidaysObj.updatedBy= value['updated_by'],
                    schoolholidaysObj.updatedUsername= value['updated_username'],
                    schoolholidaysObj.fullDate = startDate +' - '+endDate,
                    schoolholidaysObj.updateddateAndName =value['updated_username']+' - '+ updatedDate,
                    schoolholidaysObj.editPermissions = baseService.havePermissionsToEdit(req, constant.HOLIDAY_PERMISSIONS, value['created_by']);
                convertschoolholidaysObjs.push(schoolholidaysObj);
            });
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.HOLIDAY_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return convertschoolholidaysObjs;
};


exports.schoolholidaysObj = function(req, value) {
    var schoolholidaysObj = {};
    if(_.isEmpty(value)) {
        schoolholidaysObj = baseService.emptyResponse();
    } else {
        try {
            var schoolholidaysObj = Object.assign({}, SchoolHolidaysDomain);
            var updatedDate = dateService.getFormattedDate(value['updated_date']);
            var startDate = dateService.getFormattedDate(value['start_date']);
            var endDate = dateService.getFormattedDate(value['end_date']);
            schoolholidaysObj.holidayTypeId= value['holiday_type_id'],
                schoolholidaysObj.holidayId= value['holiday_id'],
                schoolholidaysObj.tenantId= value['tenant_id'],
                schoolholidaysObj.holidayName =value['holiday_name']
            schoolholidaysObj.schoolId= value['school_id'],
                schoolholidaysObj.academicYear =value['academic_year'],
                schoolholidaysObj.holidayType =value['holiday_type'],
                schoolholidaysObj.updatedDate= updatedDate,
                schoolholidaysObj.updatedBy= value['updated_by'],
                schoolholidaysObj.updatedUsername= value['updated_username'],
                schoolholidaysObj.startDate = startDate,
                schoolholidaysObj.endDate = endDate,
                schoolholidaysObj.fullDate = startDate +' - '+endDate,
                schoolholidaysObj.updateddateAndName =value['updated_username']+' - '+ updatedDate;

        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.HOLIDAY_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return schoolholidaysObj;
};

//For IOS Start
//TODO : this method have to rework using schoolHolidaysObjs method
exports.schoolHolidayObjs = function(req, data) {
    var convertschoolholidaysObjs = [];
    if(_.isEmpty(data)) {
        convertschoolholidaysObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function(value, key) {
                var schoolholidaysObj = Object.assign({}, SchoolHolidaysDomain);
                var updatedDate = dateService.getFormattedDate(value['updated_date']);
                var startDate = dateService.getDateFormatted(value['start_date'], "mmm d yyyy");
                var endDate = dateService.getDateFormatted(value['end_date'], "mmm d yyyy");
                var startMonth = dateService.getDateFormatted(value['start_date'], "mmmm");
                    schoolholidaysObj.holidayTypeId= value['holiday_type_id'],
                    schoolholidaysObj.holidayId= value['holiday_id'],
                    schoolholidaysObj.tenantId= value['tenant_id'],
                    schoolholidaysObj.holidayName =value['holiday_name'],
                    schoolholidaysObj.schoolId= value['school_id'],
                    schoolholidaysObj.academicYear =value['academic_year'],
                    schoolholidaysObj.holidayType =value['holiday_type'],
                    schoolholidaysObj.updatedDate= updatedDate,
                    schoolholidaysObj.month = startMonth,
                    schoolholidaysObj.startDate = startDate,
                    schoolholidaysObj.endDate = endDate,
                    schoolholidaysObj.updatedBy= value['updated_by'],
                    schoolholidaysObj.updatedUsername= value['updated_username'],
                    schoolholidaysObj.fullDate = startDate +' - '+endDate,
                    schoolholidaysObj.updateddateAndName =value['updated_username']+' - '+ updatedDate,
                    schoolholidaysObj.editPermissions = baseService.havePermissionsToEdit(req, constant.HOLIDAY_PERMISSIONS, value['created_by']);
                convertschoolholidaysObjs.push(schoolholidaysObj);
            });
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.HOLIDAY_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return convertschoolholidaysObjs;
};
//For IOS End