/**
 * Created by kiranmai on 7/12/17.
 */


var models = require('../../models/index'),
    baseService = require('./base.service'),
    dateService = require('../../utils/date.service.js'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    _ = require('lodash'),
    templateConverter = require('../../converters/template.converter'),
    logger = require('../../../config/logger');

var MarksBase = function f(options) {
    var self = this;
};

MarksBase.constructMarklistObj = function(req, data, callback) {
    try {
        var examSchedule = data.examSchedule;
        var body = req.body;
        var params = req.params;
        var headers = baseService.getHeaders(req);
        var currentDate = new Date();
        var marklistId = models.uuid();

        var secName = '';
        var schedule = examSchedule.schedule;
        var sections = examSchedule.sections;

        var totalMaxMarks = 0;
        if (schedule.length > 0) {
            var subjectObjs = {};
            schedule.forEach(function (item){
                totalMaxMarks += item.mark;
                subjectObjs[item.subject_id] = item.subject_name;
            });
        }

        for(var key in sections){
            if(key == params.sectionId) {
                secName = sections[key];
            }
        };

        var marklistObj = new models.instance.SchoolMarkList({
            mark_list_id: marklistId,
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),
            academic_year: headers.academic_year,
            exam_schedule_id:  models.uuidFromString(examSchedule.exam_schedule_id),
            written_exam_id:  models.uuidFromString(examSchedule.written_exam_id),
            written_exam_name: examSchedule.written_exam_name,
            class_id: models.uuidFromString(examSchedule.class_id),
            class_name: examSchedule.class_name,
            section_id: models.uuidFromString(params.sectionId),
            section_name: secName,
            subjects: subjectObjs,
            total_max_marks: parseFloat(totalMaxMarks.toString()),
            updated_by: headers.user_id,
            updated_date: currentDate,
            updated_firstname: headers.user_name,
            created_by: headers.user_id,
            created_date: currentDate,
            created_firstname: headers.user_name,
            uploaded_marklist: data.uploadUrl,
            status: false,
            term_id: examSchedule.term_id ? models.uuidFromString(examSchedule.term_id) : null,
            term_name: examSchedule.term_name ? examSchedule.term_name : null
        });

        var marklistObject = marklistObj.save({return_query: true});
        var array = [marklistObject];
        data.mark_list_id = marklistId;
        data.batchObj = array;
        callback(null, data)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

MarksBase.savePdfMarklistObj = function(req, data, callback) {
    try {

        var dataObj = {};
        var batchObj = data.batchObj;
        var headers = baseService.getHeaders(req);

        _.forEach(data.data, function (val, index) {
            var value = JSON.parse(JSON.stringify(val.data));
            var marklistObj = new models.instance.SchoolTermConsolidate({
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id),
                academic_year: headers.academic_year,
                class_id:  models.uuidFromString(value.classId),
                class_name: value.className,
                section_id:  models.uuidFromString(value.sectionId),
                section_name: value.sectionName,
                image_url: val.uploadUrl,
                user_name : value.userName,
                term_id: models.uuidFromString(value.termId),
                term_name: req.body.name,
                ispublish : false
            });
            batchObj.push(marklistObj.save({return_query: true}))
        })
        dataObj.batchObj = batchObj;
        callback(null, dataObj)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};


MarksBase.getData = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        term_id : models.uuidFromString(req.body.termId),
        academic_year: headers.academic_year,
        class_id:  models.uuidFromString(req.body.classId),
        section_id:  models.uuidFromString(req.body.sectionId)
    };
    var updateValue = { ispublish : true };
    models.instance.SchoolTermConsolidate.find(queryObject, updateValue, function(err, result){
        callback(err, result);
    });
};

MarksBase.saveSchoolConsolidate = function(req, data, callback) {
    try {

        var dataObj = {};
        dataObj.data = data;
        var batchObj = []
        var headers = baseService.getHeaders(req);
        var userName = headers.user_id;
        var currentDate = new Date();
        if(!_.isEmpty(data)) {
            var value = JSON.parse(JSON.stringify(data[0].data));
            var marklistObj = new models.instance.SchoolConsolidate({
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id),
                academic_year: headers.academic_year,
                class_id:  models.uuidFromString(value.classId),
                class_name: value.className,
                section_id:  models.uuidFromString(value.sectionId),
                section_name: value.sectionName,
                term_id: models.uuidFromString(value.termId),
                term_name: req.body.name,
                created_by: userName,
                created_date: currentDate,
                created_firstname: headers.user_name,
                status: true,
                ispublish: false
            });
            batchObj.push(marklistObj.save({return_query: true}))
        }
        dataObj.batchObj = batchObj;
        callback(null, dataObj)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};


MarksBase.updateSchoolConsolidate = function(req, cb) {
    try {
        var headers = baseService.getHeaders(req);
        var dataObj = {};
        var batchObj = []
        var queryObject = {
            tenant_id : models.timeuuidFromString(headers.tenant_id),
            school_id : models.uuidFromString(headers.school_id),
            term_id : models.uuidFromString(req.body.termId),
            academic_year: headers.academic_year,
            class_id:  models.uuidFromString(req.body.classId),
            section_id:  models.uuidFromString(req.body.sectionId)
        };
        var updateValue = { ispublish : true };
        var updateQueries = models.instance.SchoolConsolidate.update(queryObject, updateValue, {return_query: true});
        dataObj.batchObj = [updateQueries];
        cb(null, dataObj);
    } catch (err) {
        logger.debug(err);
        cb(err, null);
    }
};


MarksBase.updatePdfMarklistObj = function(req, data, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var queryObject = {
            tenant_id : models.timeuuidFromString(headers.tenant_id),
            school_id : models.uuidFromString(headers.school_id),
            term_id : models.uuidFromString(req.body.termId),
            academic_year: headers.academic_year,
        };
        _.forEach(data.termData, function (val, index) {
            queryObject.user_name = val.user_name;
            var updateValue = { ispublish : true}
            var updateQueries = models.instance.SchoolTermConsolidate.update(queryObject, updateValue, {return_query: true});
            data.batchObj.push(updateQueries);
        })
        callback(null, data)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};


MarksBase.constructMarklistDetailObj = function(req, data, callback) {
    try {
        var users = data.users;
        var examSchedule = data.examSchedule;
        var gradeDetails = data.gradeDetails;
        var secName = '';
        var schedule = examSchedule.academic;
        var non_academic = examSchedule.non_academic;
        var sections = examSchedule.sections;
        var array = data.batchObj;
        var body = req.body;
        var params = req.params;
        var headers = baseService.getHeaders(req);
        var currentDate = new Date();
        var subjectMarks = [];
        var nonAcdMarks = [];
        var totalMaxMarks = 0;

        var gradeObj;
        for(var i =0; i < schedule.length ; i++) {
            gradeObj = baseService.getRangeObj(gradeDetails, 0);
            var subObj = {};
            subObj.subject_id = schedule[i].subject_id;
            subObj.subject_name = schedule[i].subject_name;
            subObj.marks_obtained = '0';
            subObj.max_marks = schedule[i].mark;
            subObj.grade_id = gradeObj.grade_id;
            subObj.grade_name = gradeObj.grade_name;
            subObj.cgpa_value = gradeObj.cgpa_value;
            totalMaxMarks += schedule[i].mark;
            subjectMarks.push(subObj);
        }

        for(var i =0; i < non_academic.length ; i++) {
            gradeObj = baseService.getRangeObj(gradeDetails, 0);
            var nonAcdObj = {};
            nonAcdObj.subject_id = non_academic[i].subject_id;
            nonAcdObj.subject_name = non_academic[i].subject_name;
            nonAcdObj.marks_obtained = '0';
            nonAcdObj.max_marks = non_academic[i].mark;
            nonAcdObj.grade_id = gradeObj.grade_id;
            nonAcdObj.grade_name = gradeObj.grade_name;
            nonAcdObj.cgpa_value = gradeObj.cgpa_value;
            nonAcdMarks.push(nonAcdObj);
        }
        for(var key in sections){
            if(key == params.sectionId) {
                secName = sections[key];
            }
        };
        _.forEach(users, function(value, key){
            var marklistDetails = new models.instance.SchoolMarkListDetails ({
                mark_list_detail_id: models.uuid(),
                mark_list_id: data.mark_list_id,
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id),
                academic_year: headers.academic_year,
                exam_schedule_id: models.uuidFromString(examSchedule.exam_schedule_id),
                written_exam_id:  models.uuidFromString(examSchedule.written_exam_id),
                written_exam_name: examSchedule.written_exam_name,
                class_id: models.uuidFromString(examSchedule.class_id),
                class_name: examSchedule.class_name,
                section_id: models.uuidFromString(params.sectionId),
                section_name: secName,
                user_name: value.userName,
                user_code: value.userCode,
                first_name: value.firstName,
                roll_no: value.roll_no,
                primary_phone: value.primaryPhone,
                subject_mark_details: subjectMarks,
                total_marks: parseFloat('0'),
                total_max_marks: parseFloat(totalMaxMarks.toString()),
                total_grade_id: gradeObj.grade_id,
                total_grade_name: gradeObj.grade_name,
                total_cgpa_value: gradeObj.cgpa_value,
                updated_by: headers.user_id,
                updated_date: currentDate,
                updated_firstname: headers.user_name,
                created_by: headers.user_id,
                created_date: currentDate,
                created_firstname: headers.user_name,
                status: false,
                non_academic_marks_details: nonAcdMarks,
                term_id: examSchedule.term_id ? models.uuidFromString(examSchedule.term_id) : null,
                term_name: examSchedule.term_name ? examSchedule.term_name : null
            });
            var marklistDetailsobj = marklistDetails.save({return_query: true});
            array.push(marklistDetailsobj);
        });
        data.batchObj = array;
        callback(null, data)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

MarksBase.constructMarklistDetailFromXls = function(req, data, callback) {
    try {
        var worksheet = data.worksheet,
            examSchedule = data.examSchedule,
            gradeDetails = data.gradeDetails,
            array = data.batchObj,
            headers = baseService.getHeaders(req),
            currentDate = new Date(),
            index = 7;

        var subjectRow = worksheet.getRow(5), subjCols = {}, lastIndex = worksheet.lastRow._number;
        subjectRow.eachCell(function (cell, colNumber) {
            if (colNumber > 1 && colNumber <= examSchedule.schedule.length + 1) {
                subjCols[cell.value] = colNumber;
            }
        });


        var totalGradeObj;
        var subjectsCount = Array.isArray(examSchedule.schedule) ? examSchedule.schedule.length : 0;
        while (index <= lastIndex) {
            var userRow = worksheet.getRow(index), totalMaxMarks = 0, subjectMarks = [], totalSubCgpa = 0;
            for (var i = 0; i < examSchedule.schedule.length; i++) {
                var marks = userRow.getCell(subjCols[examSchedule.schedule[i].subject_id]).value ? userRow.getCell(subjCols[examSchedule.schedule[i].subject_id]).value+'' : 0;
                marks = isNaN(marks) ? 0 : marks;
                var gradeMarks = Math.round((marks/examSchedule.schedule[i].mark * 100));
                var gradeObj = baseService.getRangeObj(gradeDetails, gradeMarks);
                var subObj = {};
                subObj.subject_id = examSchedule.schedule[i].subject_id;
                subObj.subject_name = examSchedule.schedule[i].subject_name;
                subObj.marks_obtained = marks.toString();
                subObj.max_marks = examSchedule.schedule[i].mark;
                subObj.grade_id = gradeObj.grade_id;
                subObj.grade_name = gradeObj.grade_name;
                subObj.cgpa_value = gradeObj.cgpa_value;
                totalMaxMarks += examSchedule.schedule[i].mark;
                totalSubCgpa += +gradeObj.cgpa_value;
                subjectMarks.push(subObj);
            }
            var totalCgpa = totalSubCgpa/subjectsCount;
            totalGradeObj = baseService.getCgpaObj(gradeDetails, Math.ceil(totalCgpa));
            var totalMarks = userRow.getCell(examSchedule.schedule.length + 2).value ? userRow.getCell(examSchedule.schedule.length + 2).value : 0;
            totalMarks = totalMarks == 0 ? 0 : totalMarks.result.error ? 0 : (isNaN(totalMarks.result) ? 0: totalMarks.result);
            var firstName = userRow.getCell(1).value;
            var userName = userRow.getCell(examSchedule.schedule.length + 3).value;
            var userCode = userRow.getCell(examSchedule.schedule.length + 4).value;
            var primaryPhone = userRow.getCell(examSchedule.schedule.length + 5).value;
            var markDetailsObj = {
                mark_list_detail_id: models.uuid(),
                mark_list_id: data.mark_list_id,
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id),
                academic_year: headers.academic_year,
                exam_schedule_id: models.uuidFromString(examSchedule.exam_schedule_id),
                written_exam_id: models.uuidFromString(examSchedule.written_exam_id),
                written_exam_name: examSchedule.written_exam_name,
                class_id: models.uuidFromString(examSchedule.class_id),
                class_name: examSchedule.class_name,
                section_id: models.uuidFromString(req.params.sectionId),
                section_name: examSchedule.sections[req.params.sectionId],
                user_name: userName,
                user_code: userCode,
                first_name: firstName,
                primary_phone: primaryPhone,
                subject_mark_details: subjectMarks,
                total_marks: parseFloat(totalMarks.toString()),
                total_max_marks: parseFloat(totalMaxMarks.toString()),
                total_grade_id: totalGradeObj.grade_id,
                total_grade_name: totalGradeObj.grade_name,
                total_cgpa_value: isNaN(totalCgpa) ? 0 : totalCgpa,
                updated_by: headers.user_id,
                updated_date: currentDate,
                updated_firstname: headers.user_name,
                created_by: headers.user_id,
                created_date: currentDate,
                created_firstname: headers.user_name,
                status: false
            }
            var marklistDetails = new models.instance.SchoolMarkListDetails(markDetailsObj);
            var marklistDetailsobj = marklistDetails.save({return_query: true});
            array.push(marklistDetailsobj);
            if (index === lastIndex) {
                data.batchObj = array;
                callback(null, data)
            }
            index++
        }
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

MarksBase.updateMarklistDetailObj = function(req, data, callback) {
    //console.log("update Marks............",req.body)
    try {
        var gradeDetails = data.gradeDetails;
        var body = req.body;
        var params = req.params;
        var headers = baseService.getHeaders(req);
        var currentDate = new Date();
        var schedule = body.userSubMarkDetails;
        var nonAcd = body.userNonAcdSubMarkDetails;

        var queryObject = {
            mark_list_detail_id: models.uuidFromString(params.id),
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),
            academic_year: headers.academic_year,
        };

        var subjectMarks = [];
        var nonAcdsubjectMarks = [];
        var totalMaxMarks = 0;
        var totalNonAcdMaxMarks = 0;
        var totalSubCgpa = 0;
        var totalNonSubCgpa = 0;
        var totalGradeObj;
        var totalNonGradeObj;
        var nonSubjectMarks = [];
        var subjectsCount = Array.isArray(schedule) ? schedule.length : 0;
        var nonAcdCount = Array.isArray(nonAcd) ? nonAcd.length : 0;
        if(subjectsCount > 0) {
            for (var key in schedule) {
                var marks = isNaN(Math.round((schedule[key].marksObtained / schedule[key].maxMarks) * 100)) ? 0 : Math.round((schedule[key].marksObtained / schedule[key].maxMarks) * 100);
                var gradeObj = baseService.getRangeObj(JSON.parse(JSON.stringify(gradeDetails)), marks);
                var subObj = {};
                subObj.subject_id = schedule[key].subjectId;
                subObj.subject_name = schedule[key].subjectName;
                subObj.marks_obtained = schedule[key].marksObtained;
                subObj.max_marks = schedule[key].maxMarks;
                //if(subObj.marks_obtained >= 0) {
                subObj.grade_id = gradeObj.grade_id || null;
                subObj.grade_name = gradeObj.grade_name || null;
                subObj.cgpa_value = gradeObj.cgpa_value || null;
                totalMaxMarks += schedule[key].maxMarks;
                if(subObj.marks_obtained >= 0) {
                    totalSubCgpa += gradeObj.cgpa_value
                }
                subjectMarks.push(subObj);
            }

            var totalCgpa = totalSubCgpa / subjectsCount;
            totalGradeObj = baseService.getCgpaObj(gradeDetails, Math.ceil(totalCgpa));
        }

        if(nonAcdCount > 0) {
            for (var key in nonAcd) {
                var marks = isNaN(Math.round((nonAcd[key].marksObtained / nonAcd[key].maxMarks) * 100)) ? 0 : Math.round((nonAcd[key].marksObtained / nonAcd[key].maxMarks) * 100);
                var gradeObj = baseService.getRangeObj(gradeDetails, marks);
                var nonAcdObj = {};
                nonAcdObj.subject_id = nonAcd[key].subjectId;
                nonAcdObj.subject_name = nonAcd[key].subjectName;
                nonAcdObj.marks_obtained = nonAcd[key].marksObtained;
                nonAcdObj.max_marks = nonAcd[key].maxMarks;
                nonAcdObj.grade_id = gradeObj.grade_id || null;
                nonAcdObj.grade_name = gradeObj.grade_name || null;
                nonAcdObj.cgpa_value = gradeObj.cgpa_value || null;
                totalMaxMarks += nonAcd[key].maxMarks;
                if(nonAcdObj.marks_obtained >= 0) {
                    totalSubCgpa += gradeObj.cgpa_value
                }
                nonAcdsubjectMarks.push(nonAcdObj);
            }
            var totalCgpa = totalSubCgpa / nonAcdCount;
            totalGradeObj = baseService.getCgpaObj(gradeDetails, Math.ceil(totalCgpa));
        }
        var updateValues = {
            mark_list_id: models.uuidFromString(body.marklistId),
            //mark_list_detail_id: models.uuidFromString(body.marklistDetailId),
            exam_schedule_id: models.uuidFromString(body.examScheduleId),
            written_exam_id:  models.uuidFromString(body.writtenExamId),
            written_exam_name: body.writtenExamName,
            class_id: models.uuidFromString(body.classId),
            class_name: body.className,
            section_id: models.uuidFromString(body.sectionId),
            section_name: body.sectionName || null,
            user_name: body.userName,
            user_code: body.userCode,
            first_name: body.firstName,
            primary_phone: body.primaryPhone,
            /*total_marks: parseFloat(body.subjects.Total),
             total_max_marks: parseFloat(totalMaxMarks.toString()),
             total_grade_id: totalGradeObj.grade_id,
             total_grade_name: totalGradeObj.grade_name,*/
            updated_by: headers.user_id,
            updated_date: currentDate,
            updated_firstname: headers.user_name,
            created_by: headers.user_id,
            created_date: currentDate,
            created_firstname: headers.user_name,
            status: body.status,
            term_id: body.termId ? models.uuidFromString(body.termId) : null,
            term_name: body.termName ? body.termName : null,
        };
        if(subjectsCount > 0) {
            updateValues.subject_mark_details = subjectMarks
            updateValues.total_marks = parseFloat(body.subjects.Total);
            updateValues.total_max_marks = parseFloat(totalMaxMarks.toString());
            //if(updateValues.total_marks >= 0) {
            updateValues.total_grade_id = totalGradeObj.grade_id || null;
            updateValues.total_grade_name = totalGradeObj.grade_name || null;
            updateValues.total_cgpa_value = totalCgpa
            //}
        }


        if(nonAcdCount > 0) {
            updateValues.non_academic_marks_details = nonAcdsubjectMarks
        }
        models.instance.SchoolMarkListDetails.update(queryObject, updateValues, function (err, result) {
            result['mark_list_detail_id'] = models.uuidFromString(params.id);
            callback(err, result)
        });

    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};


//MarksBase.updateMarklistDetailObj = function(req, data, callback) {
//    try {
//        var gradeDetails = data.gradeDetails;
//        var body = req.body;
//        var params = req.params;
//        var headers = baseService.getHeaders(req);
//        var currentDate = new Date();
//        var schedule = body.userSubMarkDetails;
//
//        var queryObject = {
//            mark_list_detail_id: models.uuidFromString(params.id),
//            tenant_id: models.timeuuidFromString(headers.tenant_id),
//            school_id: models.uuidFromString(headers.school_id),
//            academic_year: headers.academic_year,
//        };
//
//        var subjectMarks = [];
//        var totalMaxMarks = 0;
//        var totalSubCgpa = 0;
//        var totalGradeObj;
//        var nonSubjectMarks = [];
//        var subjectsCount = Array.isArray(schedule) ? schedule.length : 0;
//
//        for(var key in schedule) {
//            var marks = isNaN(Math.round((schedule[key].marksObtained/schedule[key].maxMarks)*100)) ? 0 : Math.round((schedule[key].marksObtained/schedule[key].maxMarks)*100);
//            var gradeObj = baseService.getRangeObj(gradeDetails, marks);
//            var subObj = {};
//            subObj.subject_id = schedule[key].subjectId;
//            subObj.subject_name = schedule[key].subjectName;
//            subObj.marks_obtained = schedule[key].marksObtained;
//            subObj.max_marks = schedule[key].maxMarks;
//            subObj.grade_id = gradeObj.grade_id;
//            subObj.grade_name = gradeObj.grade_name;
//            subObj.cgpa_value = gradeObj.cgpa_value;
//            totalMaxMarks += schedule[key].maxMarks;
//            totalSubCgpa += gradeObj.cgpa_value
//            subjectMarks.push(subObj);
//        }
//        var totalCgpa = totalSubCgpa/subjectsCount;
//        totalGradeObj = baseService.getCgpaObj(gradeDetails, Math.ceil(totalCgpa));
//
//        var updateValues = {
//            mark_list_id: models.uuidFromString(body.marklistId),
//            exam_schedule_id: models.uuidFromString(body.examScheduleId),
//            written_exam_id:  models.uuidFromString(body.writtenExamId),
//            written_exam_name: body.writtenExamName,
//            class_id: models.uuidFromString(body.classId),
//            class_name: body.className,
//            section_id: models.uuidFromString(body.sectionId),
//            section_name: body.sectionName || null,
//            user_name: body.userName,
//            user_code: body.userCode,
//            first_name: body.firstName,
//            primary_phone: body.primaryPhone,
//            subject_mark_details: subjectMarks,
//            total_marks: parseFloat(body.subjects.Total),
//            total_max_marks: parseFloat(totalMaxMarks.toString()),
//            total_grade_id: totalGradeObj.grade_id,
//            total_grade_name: totalGradeObj.grade_name,
//            total_cgpa_value: totalCgpa,
//            updated_by: headers.user_id,
//            updated_date: currentDate,
//            updated_firstname: headers.user_name,
//            created_by: headers.user_id,
//            created_date: currentDate,
//            created_firstname: headers.user_name,
//            status: body.status,
//            term_id: body.term_id,
//            term_name: body.term_name,
//            non_academic_marks_details: nonAcdsubjectMarks
//        };
//        console.log('update.......')
//        models.instance.SchoolMarkListDetails.update(queryObject, updateValues, function (err, result) {
//            result['mark_list_detail_id'] = models.uuidFromString(params.id);
//            callback(err, result)
//        });
//
//    } catch (err) {
//        logger.debug(err);
//        callback(err, null);
//    }
//};

MarksBase.updateMarklistStatus = function (req, callback) {
    var data = [];
    try {
        var headers = baseService.getHeaders(req);
        var marklistId = models.uuidFromString(req.params.id);
        var queryObject = {
            mark_list_id: marklistId,
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id:  models.uuidFromString(headers.school_id),
            academic_year: headers.academic_year
        };
        var updateValues = {
            status: true,
            updated_by: headers.user_id,
            updated_date: new Date(),
            updated_firstname: headers.user_name,
        };
        var updateQueries = models.instance.SchoolMarkList.update(queryObject, updateValues, {return_query: true});
        data.batchObj = [updateQueries];
        data.mark_list_id = marklistId;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

MarksBase.updateMarklistDetailsStatus = function (req, data, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var marklistId = models.uuidFromString(req.params.id);
        var array = data.batchObj || [];
        _.forEach(body, function (value, key) {
            var queryObject = {
                mark_list_detail_id: models.uuidFromString(value.marklistDetailId),
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id:  models.uuidFromString(headers.school_id),
                academic_year: headers.academic_year
            };
            var updateValues = {
                status: value.status,
                updated_by: headers.user_id,
                updated_date: new Date(),
                updated_firstname: headers.user_name,
            };
            var updateQueries = models.instance.SchoolMarkListDetails.update(queryObject, updateValues, {return_query: true});
            array.push(updateQueries);
        });
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

MarksBase.marklistUpdateObj = function (req, callback) {
    var data = [];
    try {
        var headers = baseService.getHeaders(req);
        var marklistId = models.uuidFromString(req.params.id);
        var queryObject = {
            mark_list_id: marklistId,
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id:  models.uuidFromString(headers.school_id),
            academic_year: headers.academic_year
        };
        var updateValues = {
            written_exam_id:  models.uuidFromString(body.writtenExamId),
            written_exam_name: body.writtenExamName,
            class_id: models.uuidFromString(body.classId),
            class_name: body.className,
            section_id: models.uuidFromString(body.sectionId),
            section_name: body.sectionName,
            subjects: body.subjects,
            updated_by: headers.user_id,
            updated_date: currentDate,
            updated_firstname: headers.user_name,
            created_by: headers.user_id,
            created_date: currentDate,
            created_firstname: headers.user_name,
            status: body.status,
            remarks: body.remarks
        };
        var updateQueries = models.instance.SchoolMarkList.update(queryObject, updateValues, {return_query: true});
        data.batchObj = [updateQueries];
        data.mark_list_id = marklistId;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

MarksBase.marklistDeleteObj = function (req, callback) {
    var data = [];
    try {
        var headers = baseService.getHeaders(req);
        var marklistId = models.uuidFromString(req.params.id);
        var marklistDeleteQuery = {
            mark_list_id: marklistId,
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id:  models.uuidFromString(headers.school_id),
            academic_year: headers.academic_year
        };
        var deleteQueries = models.instance.SchoolMarkList.delete(marklistDeleteQuery , {return_query: true});
        data.batchObj = [deleteQueries];
        data.mark_list_id = marklistId;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

MarksBase.MarklistDetailDeleteObj = function (req, data, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var marklistId = models.uuidFromString(req.params.id);
        var array = data.batchObj;
        _.forEach(data.marklistObjs, function (value, key) {
            var marklistDeleteQuery = {
                mark_list_detail_id: value.mark_list_detail_id,
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id:  models.uuidFromString(headers.school_id),
                academic_year: headers.academic_year
            };
            var deleteQueries = models.instance.SchoolMarkListDetails.delete(marklistDeleteQuery , {return_query: true});
            array.push(deleteQueries);
        })
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

MarksBase.getTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var params = {exam_name: body[0].writtenExamName};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

module.exports = MarksBase;