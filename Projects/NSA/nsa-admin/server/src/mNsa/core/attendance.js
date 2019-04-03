/**
 * Created by senthil on 08/02/19.
 */


var baseService = require("@nsa/nsa-cassandra").BaseService,
    mongoose = require('mongoose'),
    constant = require('@nsa/nsa-commons').constants;

var schoolAttendanceDetailsSchema = mongoose.Schemas.SchoolAttendanceDetails;
var schoolAttendanceSchema =  mongoose.Schemas.schoolAttendance;

var attendance = function (options) {
    var self = this;
    self.options = options;
};

attendance.getAttendanceDetail = function (req, query, models, callback) {
    var viewPermission = /*baseService.checkPermissionsToQuery(req, constant.ATTENDANCE_INFO_PERMISSIONS)*/ false;
    var findParentQuery = { is_present: false };

    if(viewPermission) {
        findParentQuery.created_by = req.headers.userInfo.user_name;
    }

    this.getChildModel(req, models).findOne(query)
        .populate({path: 'details.attendance_id'})
        .exec(function (err, result) {
        callback(err, result);
    });
};


attendance.getAttendanceHistory = function (req, query, models, callback){
    var viewPermission = /*baseService.checkPermissionsToQuery(req, constant.ATTENDANCE_INFO_PERMISSIONS)*/ false;
    var findParentQuery = { class_id: req.query.classId, section_id : req.query.sectionId };

    if(viewPermission) {
        findParentQuery.created_by = req.headers.userInfo.user_name;
    }
    this.getChildModel(req, models).findOne(query)
        .populate({
            path: 'details.attendance_id',
            //match : findParentQuery
        })
        .exec(function (err, result) {
            callback(err, result);
        });
};


attendance.getAttendance = function (req, query, models, callback) {
    var viewPermission = /*baseService.checkPermissionsToQuery(req, constant.ASSIGNMENT_PERMISSIONS)*/false;
    var findParentQuery = {};

    if(viewPermission) {
        findParentQuery.created_by = req.headers.userInfo.user_name;
    }

    this.getParentModel(req, models).find(query)
        .exec(function (err, result) {
            callback(err, result);
        });
};


attendance.getChildModel = function (req, models) {
    return  models.get(req.session.lastDb, 'SchoolAttendanceDetails', schoolAttendanceDetailsSchema)
};

attendance.getParentModel = function (req, models) {
    return models.get(req.session.lastDb, 'SchoolAttendance', schoolAttendanceSchema);
}

module.exports = attendance;
