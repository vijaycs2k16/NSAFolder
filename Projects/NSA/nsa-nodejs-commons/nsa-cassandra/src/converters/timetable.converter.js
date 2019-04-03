/**
 * Created by senthil on 3/30/2017.
 */
var BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    timetableDomain = require('../common/domains/SchoolTimetableConfig'),
    calendarDataDomain = require('../common/domains/CalendarData'),
    _ = require('lodash'),
    baseService = require('../services/common/base.service'),
    logger = require('../../../../../config/logger');

exports.timetableConfigObjs = function (req, data) {
    var timetableConfigObjs = [];
    try {
        data.forEach(function (timetable) {
            timetableConfigObjs.push(timetableConfigObj(req, timetable));
        });
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4607);
    }
    return timetableConfigObjs;
};

exports.teacherAllocationObj = function(data){
    var dataObj = JSON.parse(JSON.stringify(data));
    var finalArr = [];
    try {
        _.forEach(dataObj, function (value) {
            var teacherObj = {};
            teacherObj.classId = value.class_id;
            teacherObj.sectionId = value.section_id;
            teacherObj.className = value.class_name;
            teacherObj.sectionName = value.section_name;
            teacherObj.teachers = value.teacher_allocation || [];
            teacherObj.classTeacherUserName = value.class_teacher_username || null;
            teacherObj.notifyTo = { status : value.status };
            teacherObj.notify = getNotifyObj(value.notify);
            teacherObj.isGenerated = value.is_generated;
            finalArr.push(teacherObj);
        });
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4707);
    }
    return finalArr;
}

function getNotifyObj(data) {
   var obj;
   if(data == null)
       obj = { sms: false, push: false };
   else if(data.length == 2)
       obj = { sms: true, push: true};
   else if(data[0] == 'sms')
       obj = { sms: true, push: false};
   else
       obj = { sms: false, push: true };
   return obj;
}

function timetableConfigObj(req, timetable) {
    var obj;
    try {
            obj = Object.assign({}, timetableDomain);
            obj.timetable_config_id = timetable.timetable_config_id || null;
            obj.tenant_id = timetable.tenant_id || null;
            obj.school_id = timetable.school_id || null;
            obj.applicable_class = timetable.applicable_class || null;
            obj.working_days = timetable.working_days || [];
            obj.school_hours = timetable.school_hours || {};
            obj.school_periods = timetable.school_periods || [];
            obj.school_breaks = timetable.school_breaks || [];
            obj.updated_date = timetable.updated_date || null;
            obj.updated_by = timetable.updated_by || null;
            obj.updated_username = timetable.updated_username || null;
            obj.editPermissions = baseService.havePermissionsToEdit(req, constant.TIMETABLE_CONF_PERMISSIONS, timetable['created_by']);
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4601);
    }
    return obj;
};
exports.timetableConfigObj = timetableConfigObj;

function classSectionData(req, timetable) {
    var classSection = [];
    
    try {
        if(!_.isEmpty(timetable)) {
            _.forEach(timetable, function(val) {
                var isSectionFound = (_.filter(req.body.sections, {'id': val.section_id})).length > 0 ? true : false;
                if(isSectionFound) {
                    classSection.push(val);
                }

            })
        }
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4607);
    }
    return classSection;
};
exports.classSectionData = classSectionData;

exports.notesObj = function (req, notes) {
    var headers = baseService.getHeaders(req);
    var notesObjs;
    if (notes != null && notes != undefined) {
        try {
            var obj = Object.assign({}, calendarDataDomain);
            var attachmentsObj = notes.attachments;
            var notesObj = baseService.getFormattedMap(attachmentsObj.attachment);
            if(!_.isEmpty(notesObj)) {
                _.forEach(notesObj, function(val){
                    var fileName = val.id.split('/');
                    val['fileName'] = fileName[4];
                })
            }
            obj.id = notes.id || null;
            obj.tenantId = notes.tenant_id || null;
            obj.schoolId = notes.school_id || null;
            obj.academicYear = notes.academic_year || null;
            obj.classId = notes.class_id || null;
            obj.sectionId = notes.section_id || null;
            obj.dayId = notes.day_id || null;
            obj.dayDate = notes.day_date || null;
            obj.weekNo = notes.week_no || null;
            obj.monthNo = notes.month_no || null;
            obj.yearNo = notes.year_no || null;
            obj.periodId = notes.period_id || null;
            obj.notesUrl = notesObj || null;
            obj.description = attachmentsObj.description || null;
            obj.updatedDate = notes.updated_date || null;
            obj.updatedBy = notes.updated_by || null;
            obj.createdDate = notes.created_date || null;
            obj.updatedUsername = notes.updated_username || null;
            notesObjs = obj;
        }
        catch (err) {
            logger.debug(err);
            return buildErrResponse(err, message.nsa4607);
        }
    }

    return notesObjs;
};

exports.notesObjArray = function (req, result) {
    var headers = baseService.getHeaders(req);
    var notesObjs = [];
    try {
        if(!_.isEmpty(result)) {
            _.forEach(result, function(notes) {
                var obj = Object.assign({}, calendarDataDomain);
                var attachmentsObj = notes.attachments;
                var notesObj = baseService.getFormattedMap(attachmentsObj.attachment);
                /*_.forEach(notesObj, function(value, key){
                 var notes = {};
                 notes.id = global.config.aws.s3BaseUrl + headers.school_id + '/' + value.id;
                 notes.name = value.name;
                 notesObj.push(notes)
                 });*/

                obj.id = notes.id || null;
                obj.tenantId = notes.tenant_id || null;
                obj.schoolId = notes.school_id || null;
                obj.academicYear = notes.academic_year || null;
                obj.classId = notes.class_id || null;
                obj.sectionId = notes.section_id || null;
                obj.dayId = notes.day_id || null;
                obj.dayDate = notes.day_date || null;
                obj.weekNo = notes.week_no || null;
                obj.monthNo = notes.month_no || null;
                obj.yearNo = notes.year_no || null;
                obj.periodId = notes.period_id || null;
                obj.notesUrl = notesObj || null;
                obj.description = attachmentsObj.description || null;
                obj.updatedDate = notes.updated_date || null;
                obj.updatedBy = notes.updated_by || null;
                obj.createdDate = notes.created_date || null;
                obj.updatedUsername = notes.updated_username || null;
                notesObjs.push(obj);
            })
        }
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4607);
    }
    return notesObjs;
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.TIME_TABLE, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;