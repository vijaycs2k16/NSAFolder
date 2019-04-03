/**
 * Created by Deepa on 7/28/2018.
 */


var express = require('express'),
    models = require('../../models/index'),
    groupsConverter = require('../../converters/groups.converter'),
    _ = require('lodash'),
     dateService = require('../../utils/date.service')
    ,baseService = require('../common/base.service');


var groups = function f(options) {
    var self = this;
};


groups.deleteUserGroups = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var id = models.uuidFromString(req.params.id);
    var academicYear = headers.academic_year;
    var findObject =  {
        id : id,
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year : academicYear
    };
    models.instance.UserGroups.delete(findObject, {allow_filtering: true},function(err, result){
        callback(err, result);
    });
};


groups.saveUserGroup = function(req, callback){
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var updatedDate = new Date();
        var arr = [];
        var groupUser = body.groupUser ? baseService.getMapFromArrayByKey(body.groupUser,'userName','userType') : {};
        var schoolGroups = new models.instance.UserGroups({
            id: models.uuid(),
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year :headers.academic_year,
            group_name : body.groupName,
            group_user : groupUser,
            members :body.members,
            created_date: dateService.getFormattedDate(currentDate),
            created_by : headers.user_id,
            created_firstname: headers.user_name,
            updated_by : headers.user_id,
            updated_firstname: headers.user_name,
            updated_date: dateService.getFormattedDate(updatedDate)
        });
        var saveObj = schoolGroups.save({return_query: true});
        arr.push(saveObj);
        var data = { batchObj: arr};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};


groups.updateUserGroup = function(req, callback){
    try {
        var data = {};
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var updatedDate = new Date();
        var id = models.uuidFromString(req.params.id);
        var arr = [];
        var groupUser = body.groupUser ? baseService.getMapFromArrayByKey(body.groupUser,'userName','userType') : {};
        var queryObject = {
            id: id,
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year :headers.academic_year
        }

        var updateValues = {
            group_name : body.groupName,
            group_user : groupUser,
            members :body.members,
            updated_by : headers.user_id,
            updated_firstname: headers.user_name,
            updated_date: dateService.getFormattedDate(updatedDate)
        }
        var updateQueries = models.instance.UserGroups.update(queryObject, updateValues, {return_query: true});
        data.batchObj = [updateQueries];
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

groups.getGroupsByClass = function(req, callback){
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var id = req.params.id ? models.uuidFromString(req.params.id) : '';
    var academicYear = headers.academic_year;
    var findObject =  {
        id : id,
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year : academicYear
    };
    models.instance.UserGroups.find(findObject, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

groups.getGroupsDetails = function(req, callback){
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var findObject =  {
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year : academicYear
    };
    models.instance.UserGroups.find(findObject, {allow_filtering: true}, function(err, result){
        callback(err,  groupsConverter.groupsObjs(req, result));
    });
};


groups.getUserGroupsDetails = function(req, data, callback){
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var groupId = Object.keys(data.esNotificationObj.group);
    var grpId = [];
    _.map((groupId), function(val){
        val = models.uuidFromString(val);
        grpId.push(val);
    })
    var findObject =  {
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year : academicYear,
        id : { $in : grpId}
    };
    models.instance.UserGroups.find(findObject, {allow_filtering: true}, function(err, result){
        var groupObj = JSON.parse(JSON.stringify(result));
        data.groupObj = groupObj;
        callback(err ,data);
    });
};

    groups.getGroupsName = function(req, callback){
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var findObject =  {
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year : academicYear,
        group_name : req.body.groupName
    };
    models.instance.UserGroups.find(findObject, {allow_filtering: true}, function(err, result){
        callback(err,  groupsConverter.groupsObjs(req, result));
    });
};

module.exports = groups;
