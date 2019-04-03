/**
 * Created by kiranmai on 7/12/17.
 */


var baseService = require('../common/base.service')
    , models = require('../../models')
    , constant = require('@nsa/nsa-commons').constants
    , markslistConverter = require('../../converters/markslist.converter');

var Marks = function f(options) {
    var self = this;
};

Marks.getAllMarkListDetails = function (req, callback) {
    models.instance.SchoolMarkListDetails.find({}, function(err, result){
        callback(err, result);
    });
};

Marks.getDetailsByMarkslistId = function (req, data, callback) {
    var findQuery = baseService.getFindAllQuery(req, true, constant.MARKS_UPLOAD_PERMISSIONS);
    findQuery.mark_list_id = data.mark_list_id;
    models.instance.SchoolMarkListDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Marks.getMarksDetails = function (req, data, callback) {
    models.instance.SchoolMarkListDetails.findOne({mark_list_detail_id: data.mark_list_detail_id}, function(err, result){
        callback(err, req, result);
    });
};

Marks.getMarklist = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);

    if (havePermissions) {
        var queryParams = req.query;
        var findQuery = marklistFindQuery(req, queryParams, true, constant.MARKS_UPLOAD_PERMISSIONS);

        models.instance.SchoolMarkList.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, markslistConverter.marklistObjs(req,  result));
        });
    } else {
        callback(null, []);
    }

};

function marklistFindQuery(req, params, academicYear, permissions) {
    var classId = params.classId || req.params.classId;
    var sectionId = params.sectionId || req.params.sectionId;
    var examScheduleId = params.id || req.params.id;
    //var termId = req.params.tid;
    var termId = req.params.tid ? req.params.tid : req.body.id;
    var findQuery = baseService.getFindAllQuery(req, academicYear, permissions);

    if (typeof classId != 'undefined' && classId != null && !(_.isEmpty(classId))) {
        findQuery.class_id = models.uuidFromString(classId);
    }
    if (typeof sectionId != 'undefined' && sectionId != null && !(_.isEmpty(sectionId))) {
        findQuery.section_id = models.uuidFromString(sectionId);
    }
    if (typeof examScheduleId != 'undefined' && examScheduleId != null && !(_.isEmpty(examScheduleId))) {
        findQuery.exam_schedule_id = models.uuidFromString(examScheduleId);
    }
    if (typeof termId != 'undefined' && termId != null && !(_.isEmpty(termId))) {
        findQuery.term_id = models.uuidFromString(termId);
    }
    //console.log('findQuery.....',findQuery)
    return findQuery;
}
exports.marklistFindQuery = marklistFindQuery;

/*Marks.getMarkDetailsByClassAndSec = function (req, callback) {
 var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);

 if (havePermissions) {
 var params = req.params;
 var findQuery = marklistFindQuery(req, params, true, constant.MARKS_UPLOAD_PERMISSIONS);
 models.instance.SchoolMarkListDetails.find(findQuery, {allow_filtering: true}, function(err, result){
 callback(err, markslistConverter.marklistDetailsObjs(req,  result));
 });
 } else {
 callback(null, []);
 }

 };*/


Marks.getMarkDetailsByClassAndSec = function (req, callback) {
    var params = req.params;
    var findQuery = marklistFindQuery(req, params, true, constant.MARKS_UPLOAD_PERMISSIONS);
    delete findQuery.created_by
    if(req.query.status) {
        findQuery.status = true;
    }
    models.instance.SchoolMarkListDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, markslistConverter.marklistDetailsObjs(req,  result));
    });

};


Marks.getMarkDetailsByCSI = function (req, data, callback) {
    var params = req.params;
    var findQuery = marklistFindQuery(req, params, true, constant.MARKS_UPLOAD_PERMISSIONS);
    delete findQuery.created_by
    if(req.query.status) {
        findQuery.status = true;
    }
    if(!_.isEmpty(data)) {
        findQuery.mark_list_id = data[0].mark_list_id;

        //findQuery.written_exam_id = models.uuidFromString(params.id)
        models.instance.SchoolMarkListDetails.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, markslistConverter.marklistDetailsObjs(req,  result));
        });
    } else {
        callback(null, [])
    }


};


Marks.getExamDetailsByClassAndSec = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);
    if (havePermissions) {
        var params = req.params;
        var findQuery = examlistFindQuery(req, params, true, constant.MARKS_UPLOAD_PERMISSIONS);
        findQuery.status = true;

        models.instance.SchoolMarkList.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, (JSON.parse(JSON.stringify(result))))
        });
    } else {
        callback(null, []);
    }

};


Marks.getExamDetailByClassAndSec = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);
    if (havePermissions) {
        var params = req.params;
        var findQuery = examlistFindQuery(req, params, true, constant.MARKS_UPLOAD_PERMISSIONS);
        if(req.query.status) {
            findQuery.status = true;
        }
        findQuery.exam_schedule_id = models.uuidFromString(req.params.id);
        models.instance.SchoolMarkList.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, req, result)
        });
    } else {
        callback(null, req, []);
    }

};


function examlistFindQuery(req, params, academicYear, permissions) {
    var classId = params.classId || req.params.classId;
    var sectionId = params.sectionId || req.params.sectionId;
    var termId = params.tid;

    var findQuery = baseService.getFindAllQuery(req, academicYear, permissions);

    if (typeof classId != 'undefined' && classId != null && !(_.isEmpty(classId))) {
        findQuery.class_id = models.uuidFromString(classId);
    }
    if (typeof sectionId != 'undefined' && sectionId != null && !(_.isEmpty(sectionId))) {
        findQuery.section_id = models.uuidFromString(sectionId);
    }

    if (typeof termId != 'undefined' && termId != null && !(_.isEmpty(termId))) {
        findQuery.term_id = models.uuidFromString(termId);
    }


    return findQuery;
}
exports.examlistFindQuery = examlistFindQuery;


Marks.getTermsByExams = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var userName = req.params.name;
    //var termId =  models.uuidFromString(headers.term_id);
    var findObject =  {
        // term_id : termId,
        tenant_id : tenantId,
        school_id : schoolId,
        ispublish: true,
        user_name : userName// headers.user_name
    };

    models.instance.SchoolTermConsolidate.find(findObject, {allow_filtering: true} , function(err, result){
        callback(err,  result);
    });
};

Marks.getTermsByData = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var findObject =  {
        term_id : models.uuidFromString(req.body.termId),
        class_id : models.uuidFromString(req.body.classId),
        section_id : models.uuidFromString(req.body.sectionId),
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year: headers.academic_year
    };

    models.instance.SchoolTermConsolidate.find(findObject, {allow_filtering: true} , function(err, result){
        callback(err,  result);
    });
};


Marks.getReportCard = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var userName = headers.user_name;
    var findObject =  {
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year : headers.academic_year,// headers.user_name
        //user_name : headers.user_name
    };
    models.instance.SchoolConsolidate.find(findObject, {allow_filtering: true} , function(err, result){
        callback(err,  markslistConverter.consolidateObjs(req, JSON.parse(JSON.stringify(result))));
    });
};




Marks.getMarklistById = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);
    if (true) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.MARKS_UPLOAD_PERMISSIONS);
        findQuery.mark_list_id = models.uuidFromString(req.params.id);
        models.instance.SchoolMarkList.findOne(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, {});
    }
};

Marks.getMarklistDetailsById = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);
    if (true) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.MARKS_UPLOAD_PERMISSIONS);
        findQuery.mark_list_id = models.uuidFromString(req.params.id);
        models.instance.SchoolMarkListDetails.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }
};

Marks.getUserMarksDetails = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    var params = req.params;
    findQuery.user_name = params.id;
    findQuery.exam_schedule_id = models.uuidFromString(params.examScheduleId);
    findQuery.status = true;
    models.instance.SchoolMarkListDetails.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, markslistConverter.marklistDetailObj(req, result));
    });
};

Marks.updateMarklistById = function (req, data, callback) {
    var findQuery = baseService.getFindAllQuery(req, true, constant.MARKS_UPLOAD_PERMISSIONS);
    findQuery.mark_list_id = data.mark_list_id;
    models.instance.SchoolMarkList.findOne(findQuery, {allow_filtering: true}, function(err, result) {
        if (result) {
            result.generated_marklist = data.generated_marklist;
            var marks = new models.instance.SchoolMarkList(result);
            marks.save(function (err, result) {
                callback(err, result);
            });
        }
    });

};



Marks.getOverallExamReport = function (req, callback) {
     var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);
     if(havePermissions) {
         var findQuery = baseService.getFindAllQuery(req, true, constant.MARKS_UPLOAD_PERMISSIONS);
         findQuery.user_name = req.params.id;
         findQuery.status = true;

         models.instance.SchoolMarkListDetails.find(findQuery, {allow_filtering: true}, function (err, result) {
             callback(err, markslistConverter.examreportsDetailsObjs(req, result));
         });
     } else {
         callback(null,[])
     }

};



Marks.getOverallSubjectReport = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.MARKS_UPLOAD_PERMISSIONS);
        findQuery.user_name = req.params.id;
        findQuery.status = true;

        models.instance.SchoolMarkListDetails.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, markslistConverter.marklistDetailssubObjs(req, result));
        });
    } else {
        callback(null, [])
    }
};

module.exports = Marks;
