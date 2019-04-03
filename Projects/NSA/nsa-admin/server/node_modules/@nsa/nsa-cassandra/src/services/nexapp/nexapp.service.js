/**
 * Created by Kiranmai A on 3/4/2017.
 */
var express = require('express'),
    models = require('../../models/index'),
    baseService = require('../common/base.service'),
    nsaCassandra = require('@nsa/nsa-cassandra'),
    sectionConverter = require('../../converters/section.converter')
subjectConverter = require('../../converters/subject.converter');

var Nexapp = function f(options) {
    var self = this;
};

function getSchSubjContent(req, callback) {
    try {
        var findQuery = baseService.getFindAllQuery(req, true, []);
        findQuery.active = true;
        if(req.body.classId)
            findQuery.class_id = models.uuidFromString(req.body.classId);

        models.instance.SchoolSubjectContent.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } catch(err) {
        callback(err, null);
    }
};

Nexapp.getSchSubjContent = getSchSubjContent;

Nexapp.getContentBySubTopic = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.topic_name = req.body.topicName;
    findQuery.subject_id = models.uuidFromString(req.body.subjectId);
    findQuery.active = true;
    models.instance.SchoolSubjectContent.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Nexapp.getContentBySubject = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.subject_id = models.uuidFromString(req.params.id);
    findQuery.active = true;
    models.instance.SchoolSubjectContent.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};


Nexapp.getContentBySubTitTerm = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.class_id = models.uuidFromString(req.body.classId);
    if(req.body.id && req.body.termId) {
        findQuery.subject_id = models.uuidFromString(req.body.id);
        findQuery.term_id = models.uuidFromString(req.body.termId);
    }

    findQuery.title = req.body.title;
    findQuery.active = true;
    models.instance.SchoolSubjectContent.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Nexapp.getSchoolClassSubjects = function(req, cb) {
    async.parallel({
        classSubjects: getSchoolClassAllSubject.bind(null, req),
        subjects: getSchSubjContent.bind(null, req),
        classes : getClasses.bind(null, req),
        sections : getSections.bind(null, req)
    }, function (err, data) {
        if(err) {
            logger.debug(err);
            cb(err, null)
        } else {
            getSchoolClassSub(req, data, function (err, result) {
                cb(err, result)
            });

        }
    })
};

function getClasses(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year
    };
    models.instance.SchoolClassDetails.find(findQuery, {allow_filtering: true},
        function(err, result){
            callback(err, result);
        });
};

function getSections(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    models.instance.SchoolSections.find(findQuery, {allow_filtering: true},
        function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, sectionConverter.SchoolSectionsDetail(req, formattedResult));
        });
};

function getSchoolClassAllSubject(req, callback) {
    var findQuery = baseService.getFindAllQuery(req, true, []);

    models.instance.SchoolClassSubjects.find(findQuery, {allow_filtering: true}, function (err, result) {
        callback(err, subjectConverter.subjectAllocationObjs(req, result));
    });
}

function getSchoolClassSub(req, data, cb) {
    var subjects = [];
    try {
        if(!_.isEmpty(data.classSubjects) && !_.isEmpty(data.subjects)) {
            _.forEach(JSON.parse(JSON.stringify(data.classSubjects)), function(val){
                var sub = _.filter(JSON.parse(JSON.stringify(data.subjects)), {'subject_id' : val.subjectId, 'class_id': val.classId});
                var className = _.filter(JSON.parse(JSON.stringify(data.classes)), { 'class_id': val.classId});
                var section = _.filter(JSON.parse(JSON.stringify(data.sections)), {'sectionId': val.sectionId});
                if(!_.isEmpty(sub)) {
                    val['subjectName'] = sub[0].subject_name;
                    val['subjectId'] = sub[0].subject_id;
                    val['classId'] = className[0].class_id;
                    val['className'] = !_.isEmpty(className) ? className[0].class_name : null;
                    val['sectionName'] = !_.isEmpty(section) ? section[0].sectionName : null;
                    val['sectionId'] = !_.isEmpty(section) ? section[0].sectionId : null;
                    subjects.push(val);
                }


            })
        }
        cb(null, subjects)

    } catch (err) {
        logger.debug(err);
        cb(err, null)
    }


}



Nexapp.getSchoolSubjectsById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var subjectId = models.uuidFromString(req.params.id);
    var academicYear = headers.academic_year;
    var findObject =  {
        subject_id : subjectId,
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year : academicYear
    };
    models.instance.SchoolSubject.findOne(findObject, function(err, result){
        callback(err, subjectConverter.schoolSubjectObj(req, result));
    });
};


Nexapp.getNexappTitles = function (req, callback) {
    models.instance.Titles.find({}, function(err, result){
        callback(err, result);
    });
};


module.exports = Nexapp;