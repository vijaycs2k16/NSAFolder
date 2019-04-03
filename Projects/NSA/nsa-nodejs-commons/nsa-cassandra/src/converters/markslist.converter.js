/**
 * Created by kiranmai on 7/12/17.
 */


var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../config/logger');

exports.marklistObjs = function (req, data) {
    var marklistObjs = [];
    try {
        _.forEach(data, function (value, key) {

            marklistObjs.push(marklistObj(req, value));
        });
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return marklistObjs;
};


buildUserMarkObj

function buildUserMarkObj(data, req, callback) {
    if(!_.isEmpty(data)) {
        var subMarkObjs = data.subjectMarkDetails;
        var subjectTotal = 0;
        var total = 0;
        var ranges = [];
        var values = [];
        for(var i=0; i<subMarkObjs.length; i++) {
            if(req.query.mobile){
                subMarkObjs[i].marks_obtained = +subMarkObjs[i].marks_obtained >=0 ? subMarkObjs[i].marks_obtained : '0'
            }
            var marksObtained = nsaCassandra.Base.baseService.convertToTwoDecimal(subMarkObjs[i].marks_obtained);
            subjectTotal += marksObtained;
            total += subMarkObjs[i].max_marks;
            ranges.push(subMarkObjs[i].subject_name);
            values.push(marksObtained);
        }
        data.ranges = ranges;
        data.values = values;
        data.subjectTotal = nsaCassandra.Base.baseService.convertToTwoDecimal(subjectTotal);
        data.totalMarks = total;
    }
    callback(null, data);
};
exports.buildUserMarkObj = buildUserMarkObj;



exports.examreportsDetailsObjs = function (req, data) {
    var examreportsDetailsObjs = {};
    var ranges = [];
    var values = [];
    try {
        _.forEach(data, function (value, key) {
            ranges.push(value.written_exam_name)
            values.push((value.total_cgpa_value).toFixed(2))
        });
        examreportsDetailsObjs.ranges = ranges
        examreportsDetailsObjs.values = values
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return examreportsDetailsObjs;
};


function marklistObj(req, value) {

    var obj;
    try {
        if(!_.isEmpty(value)) {
            var updatedDate = dateService.getFormattedDate(value['updated_date']);

            obj = {}; //Object.assign({}, Domain)
            obj.marklistId = value.mark_list_id || null;
            obj.tenantId = value.tenant_id || null;
            obj.schoolId = value.school_id || null;
            obj.academicYear = value.academic_year || null;
            obj.examScheduleId = value.exam_schedule_id || null;
            obj.writtenExamId = value.written_exam_id || null;
            obj.writtenExamName = value.written_exam_name || null;
            obj.classId = value.class_id || null;
            obj.className = value.class_name || null;
            obj.sectionId = value.section_id || null;
            obj.sectionName = value.section_name || null;
            obj.clssec = value.class_name + ' - ' + value.section_name;
            obj.subjects = value.subjects || null;
            obj.updatedBy = value.updated_by || null;
            obj.updatedDate = updatedDate || null;
            obj.updatedDateAndName = value['updated_firstname']+' - '+updatedDate;
            obj.createdBy = value.created_by || null;
            obj.createdDate = value.created_date || null;
            obj.status = value.status || false;
            obj.termId = value.term_id || null;
            obj.termName = value.term_name || null;
            obj.generated_marklist = value.generated_marklist || null;
            obj.uploaded_marklist = value.uploaded_marklist || null;
            obj.editPermissions = baseService.havePermissionsToEdit(req, constant.MARKS_UPLOAD_PERMISSIONS, value['created_by']);
            obj.btnPermissions = baseService.havePermissionsToPublish(req, constant.MARKS_UPLOAD_PERMISSIONS);
        }
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return obj;
};
exports.marklistObj = marklistObj;

exports.marklistDetailsObjs = function (req, data) {
    var marklistDetailObjs = [];
    try {
        _.forEach(data, function (value, key) {
            marklistDetailObjs.push(marklistDetailObj(req, value));
        });
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return marklistDetailObjs;
};


exports.marklistDetailssubObjs = function (req, data) {
    var marklistDetailObjs1 = {};
    var ranges = [];
    var values = [];
    var subject = [];
    var subData = [];
    var obj = [];

    try {

        _.forEach(data, function (val, i) {
            _.forEach(JSON.parse(JSON.stringify(val.subject_mark_details)), function (value, i) {
                var markObjs = {};
                var subjs = _.filter(subData, {"subject_id": value.subject_id});
                if(!_.isEmpty(subjs)) {
                    var data = [val.written_exam_name, +value.marks_obtained]
                    subjs[0].ranges.push(data);
                } else {
                    markObjs = value;
                    markObjs.ranges = [];
                    var data = [val.written_exam_name, +value.marks_obtained]
                    markObjs.ranges.push(data);
                    subData.push(markObjs)
                }

            })
        });
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return subData;
};

exports.consolidateObjs = function(req, data) {
    var convertAcdemicObjs = [];
    if(_.isEmpty(data)) {
        convertAcdemicObjs = baseService.emptyResponse();
    } else {
        try {
            var data =  _.orderBy(data, ['created_date'], ['desc']);
            _.forEach(data, function(value, key) {
                var consObj = {};
                var endDate = dateService.getFormattedDate(value['end_date']);
                consObj.tenantId= value['tenant_id'],
                consObj.schoolId= value['school_id'],
                consObj.createdDate = dateService.getFormattedDate(value['created_date']);
                consObj.createdBy = value['created_by'];
                consObj.createdFirstName = value['created_firstname'];
                consObj.academicYear = value['academic_year'];
                consObj.status = value['status'];
                consObj.termId = value['term_id'];
                consObj.termName = value['term_name'];
                consObj.className = value['class_name'];
                consObj.sectionName = value['section_name'];
                consObj.sectionId = value['section_id'];
                consObj.classId = value['class_id'];
                consObj.ispublish = value['ispublish'];
                convertAcdemicObjs.push(consObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.ACADEMIC_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return convertAcdemicObjs;
};

function marklistDetailObj(req,value) {
    var obj;
    try {
        if(!_.isEmpty(value)) {
            var updatedDate = dateService.getFormattedDate(value['updated_date']);
            obj = {}; //Object.assign({}, Domain)
            obj.marklistDetailId = value.mark_list_detail_id || null;
            obj.marklistId = value.mark_list_id || null;
            obj.tenantId = value.tenant_id || null;
            obj.schoolId = value.school_id || null;
            obj.academicYear = value.academic_year || null;
            obj.examScheduleId = value.exam_schedule_id || null;
            obj.writtenExamId = value.written_exam_id || null;
            obj.writtenExamName = value.written_exam_name || null;
            obj.classId = value.class_id || null;
            obj.className = value.class_name || null;
            obj.sectionId = value.section_id || null;
            obj.sectionName = value.section_name || null;
            obj.clssec = value.class_name + ' - ' + value.section_name;
            obj.userName = value.user_name || null;
            obj.userCode = value.user_code || null;
            obj.rollNo =  value.roll_no || null;
            obj.firstName = value.first_name || null;
            obj.primaryPhone = value.primary_phone || null;
            obj.subjectMarkDetails = value.subject_mark_details || null;
            obj.totalMarks = value.total_marks || null;
            obj.examDate = value.examination_date || null;
            obj.mediaName = value.media_name || null;
            obj.updatedBy = value.updated_by || null;
            obj.updatedDate = updatedDate || null;
            obj.updatedDateAndName = value['updated_firstname']+' - '+updatedDate;
            obj.createdBy = value.created_by || null;
            obj.createdDate = value.created_date || null;
            obj.status = value.status || false;
            obj.remarks = value.remarks || null;
            obj.termId = value.term_id || req.body.termId;
            obj.termName = value.term_name || req.body.termName;
            obj.nonAcademicMarkDetails = value.non_academic_marks_details || null;
        }
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return obj;
};
exports.marklistDetailObj = marklistDetailObj;

