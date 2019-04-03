
'use strict';

var bodybuilder = require('bodybuilder');
var _ = require('lodash');
var commons = require('./commons/constants')
var options;

// Constructor builderutil
var builderutil = function f(options) {
    var self = this;
    self.options = options;
};

builderutil.getUserSearchQueryParam = function(req) {
    var param = {
        size : 0,
        userType : []
    }
    param.size = '10000';
    param.userName = req.body.login;

    return builderutil.getUserByUserType(req, param);
};

builderutil.getUserByUserType = function(req, data) {
    var param = req.body;
    param.size = '10000';
    param.userName = req.body.login;
    param.userType = req.body.userType;

    return builderutil.getUserByUserNameAndUserType(req, param);
};

builderutil.getUserByUserNameAndUserType = function(req, param) {
    var body = bodybuilder()
        .size(param.size)
        .query(commons.ES_MATCH_PHRASE, commons.ES_ACTIVE, true)
        .query(commons.ES_MATCH_PHRASE, commons.ES_USER_NAME, param.userName)
        .query(commons.ES_MATCH_PHRASE, commons.TENANT_ID, param.tenant_id)
        .query(commons.ES_MATCH_PHRASE, commons.SCHOOL_ID, param.school_id)
        .query(commons.ES_MATCH_PHRASE, commons.ES_ACADEMIC_YEAR, param.academic_year)
        .build();
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: param.userType,
        body: JSON.stringify(body)
    };
};


builderutil.getSchools = function(req, param) {
    var param = req.query;
    var body = bodybuilder()
        .size(param.size)
        .build();
    return {
        index: global.config.elasticSearch.index.schoolIndex,
        type:  global.config.elasticSearch.index.schoolType,
        body: JSON.stringify(body)
    };
};

module.exports = builderutil;
