/**
 * Created by Deepa on 7/28/2018.
 */


var express = require('express'),
    models = require('../../models/index'),
    syllabusConverter = require('../../converters/syllabus.converter'),
    _ = require('lodash'),
    baseService = require('../common/base.service');


var Syllabus = function f(options) {
    var self = this;
};

Syllabus.getSyllabusByClass = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var classId = req.params.id ? models.uuidFromString(req.params.id) : '';
    var academicYear = headers.academic_year;
    var findObject =  {
        class_id : classId,
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year : academicYear
    };
    if(!classId) {
        delete findObject.class_id;
    }
    models.instance.SchoolSyllabus.find(findObject, {allow_filtering: true}, function(err, result){
        callback(err, syllabusConverter.syllabusObjs(req, result));
    });
};


Syllabus.deleteSyllabusByClass = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var classId = models.uuidFromString(req.params.id);
    var academicYear = headers.academic_year;
    var findObject =  {
        class_id : classId,
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year : academicYear
    };
    models.instance.SchoolSyllabus.delete(findObject, {allow_filtering: true},function(err, result){
        callback(err, result);
    });
};

Syllabus.saveSchoolSyllabus = function(req, callback){
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var updatedDate = new Date();
        var arr = [];
        var attachments = body.attachments ? baseService.getMapFromFormattedMap(body.attachments) : {};
        _.forEach(body.classes, function(val, index) {
            var schoolSyllabus = new models.instance.SchoolSyllabus({
                tenant_id: tenantId,
                school_id: schoolId,
                academic_year :headers.academic_year,
                class_id: models.uuidFromString(val.id),
                class_name: val.name,
                attachments : attachments,
                name: body.name,
                description: body.description,
                created_date: currentDate,
                updated_date: updatedDate,
            });
            var saveObj = schoolSyllabus.save({return_query: true});
            arr.push(saveObj);
            if(index == body.classes.length -1) {
                var data = { batchObj: arr};
                callback(null, data);
            }
        })
    } catch (err) {
        callback(err, null);
    }
};


Syllabus.updateSchoolSyllabus = function(req, callback){
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var academicYear = headers.academic_year;
        var arr = [];

        var attachmentsObj = baseService.getMapFromFormattedMap(body.attachments);
        _.forEach(body.classes, function(val, index) {
            var queryObject = { class_id: models.uuidFromString(val.id), tenant_id: tenantId, school_id:  schoolId, academic_year: academicYear };
            body.attachments = {'$add' : attachmentsObj};
            var updateQuery = models.instance.SchoolSyllabus.update(queryObject, body, {return_query: true});
            arr.push(updateQuery);
            if(index == body.classes.length -1) {
                var data = { batchObj: arr};
                callback(null, data);
            }
        })

    } catch (err) {
        callback(err, null);
    }
};



Syllabus.updateSchoolSyllabusById = function(req, callback){

    var data = {};
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var class_id = models.uuidFromString(req.params.id);
    var attachmentsObj = body.attachments ? baseService.getMapFromFormattedMap(body.attachments) : [];

        if(body.attachments) {
            body.attachments = attachmentsObj;
        }

    try {
        var queryObject = {
            class_id: class_id,
            tenant_id: tenantId,
            school_id:  schoolId,
            academic_year: headers.academic_year
        };

        var updateValues = body;
        updateValues.updated_date = new Date();

        var updateQueries = models.instance.SchoolSyllabus.update(queryObject, updateValues, {return_query: true});
        data.batchObj = [updateQueries];
    } catch (err) {
        logger.debug(err)
        callback(err, data)
    }
    callback(null, data)

};

Syllabus.deleteAttachment = function(req, callback) {
    var body = req.body;
    var findQuery = baseService.getFindAllQuery(req, true, []), syllabusAttach = {};
    findQuery.class_id = models.uuidFromString(req.params.id);
    var files = req.body.attachments;
    if (files && files.length > 0) {
        var existingFiles = baseService.getExistingFiles(body);
        _.forEach(existingFiles, function (value, key) {
            syllabusAttach[value.id] = value.name;
        });
    }
    req.body.attachments = existingFiles;
    var updateValues = {attachments: !_.isEmpty(syllabusAttach) ? syllabusAttach : null};
    models.instance.SchoolSyllabus.update(findQuery, updateValues, function(err, result){
        if(err){
            callback(err, null)
        }else {
            callback(null, result)
        }
    });
};


module.exports = Syllabus;
