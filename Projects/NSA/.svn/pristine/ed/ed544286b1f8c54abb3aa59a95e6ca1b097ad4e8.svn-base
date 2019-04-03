/**
 * Created by senthil on 08/02/19.
 */


var baseService = require("@nsa/nsa-cassandra").BaseService,
    mongoose = require('mongoose'),
    constant = require('@nsa/nsa-commons').constants;

var schoolAssLogSchema = mongoose.Schemas.schoolAssignmentDetails;
var schoolAssignmentSchema =  mongoose.Schemas.schoolAssignment

var assignment = function (options) {
    var self = this;
    self.options = options;
};

assignment.getAssessmentDetail = function (req, query, models, callback) {
        var viewPermission = baseService.checkPermissionsToQuery(req, constant.ASSIGNMENT_PERMISSIONS);
        var findParentQuery = { status: true };

        if(viewPermission) {
            findParentQuery.created_by = req.headers.userInfo.user_name;
        }

        this.getChildModel(req, models).findOne(query)
            .populate(
                {
                path: 'details.assign_id',
                match: findParentQuery
                }
            ).exec(function (err, result) {
                callback(err, result);
            });
};

assignment.getAssessment = function (req, query, models, callback) {
    var viewPermission = baseService.checkPermissionsToQuery(req, constant.ASSIGNMENT_PERMISSIONS);
    var findParentQuery = {};

    if(viewPermission) {
        findParentQuery.created_by = req.headers.userInfo.user_name;
    }

    this.getParentModel(req, models).find(query)
        .exec(function (err, result) {
        callback(err, result);
    });
};

assignment.getChildModel = function (req, models) {
        return  models.get(req.session.lastDb, 'schoolAssLogSchema', schoolAssLogSchema);
};

assignment.getParentModel = function (req, models) {
    return models.get(req.session.lastDb, 'schoolAssignment', schoolAssignmentSchema);
}

module.exports = assignment;
