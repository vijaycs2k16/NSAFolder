/**
 * Created by Ramkumar on 8/21/2018.
 */


'use strict';

var bodybuilder = require('bodybuilder');
var commons = require('@nsa/nsa-commons');
var _ = require('lodash');
var commonUtil = require('./commonutil');
var options;

// Constructor builderutil
var attendanceUtil = function f(options) {
    var self = this;
    self.options = options;
};

attendanceUtil.constructAttendanceIndex = function(req) {

    var constructIndex = { index: global.config.elasticSearch.index.attendanceIndex };
    return constructIndex;
};

attendanceUtil.createAttendanceIndexWithMappings = function(req) {
    var body =
    {
        settings: {
            analysis: {
                analyzer: {
                    keyword_whitespace: {
                        type: "custom",
                        tokenizer: "whitespace",
                        filter: [
                            "lowercase"
                        ]
                    },
                    keyword_lowercase: {
                        type: "custom",
                        tokenizer: "keyword",
                        filter: [
                            "lowercase"
                        ]
                    }
                }
            }
        },
        mappings:{
            attendance_master: {
                properties: {
                    attendance_id: {type: "string", index:"not_analyzed"},
                    tenant_id: {type: "string", index:"not_analyzed"},
                    school_id: {type: "string", index:"not_analyzed"},
                    academic_year : {type: "string", index:"not_analyzed"},
                    media_name: {type: "string"},
                    total_strength: {type: "string", index:"not_analyzed"},
                    no_of_present: {type: "string", index:"not_analyzed"},
                    no_of_absent: {type: "string", index:"not_analyzed"},
                    present_percent: {type: "string", index:"not_analyzed"},
                    class_id: {type: "string", index:"not_analyzed"},
                    class_name: {type: "string", index:"not_analyzed"},
                    section_id: {type: "string", index:"not_analyzed"},
                    section_name: {type: "string", index:"not_analyzed"},
                    attendance_date:{type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                    recorded_date: {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                    recorded_by: {type: "string", index:"not_analyzed"},
                    recorded_username: {type: "string", index:"not_analyzed"},
                    updated_by: {type: "string", index:"not_analyzed"},
                    updated_date : {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                    updated_username: {type: "string", index:"not_analyzed"},
                    created_by: {type: "string", index:"not_analyzed"},
                    created_date : {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                    created_firstname: {type: "string", index:"not_analyzed"},
                }
            }
        }
    };
    return {
        index: global.config.elasticSearch.index.attendanceIndex,
        body: JSON.stringify(body)
    };
};


attendanceUtil.getAttendanceQuery = function(req, headers, viewPermission, sortParam) {
   req.query.dateParam = commons.constants.ES_ATTENDANCE_DATE;
    var body = commonUtil.getBodybuilder(req, sortParam);

    if (viewPermission) {
        body.query(commons.constants.ES_MATCH_PHRASE, 'created_by', headers.user_id);
    }

    var classes = req.body.classes;
    var userPerm = haveUserLevelPerm(req);


    if(userPerm) {
        for (var i = 0; i < classes.length; i++) {
            body.orFilter(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_CLASS_ID, classes[i].class_id);
        };
    }


    if (body.message) { //error
        return body;
    } else {
        return {
            index: global.config.elasticSearch.index.attendanceIndex,
            type: global.config.elasticSearch.index.attendancesMasterType,
            body: JSON.stringify(body.build())
        };
    }
};

attendanceUtil.getQuery = function(req, params) {
    var searchParams = {
        index: global.config.elasticSearch.index.attendanceIndex,
        type: global.config.elasticSearch.index.attendancesMasterType,
        body: {
            size: commons.constants.DEFAULT_PARAM_SIZE,
            "query": {
                "bool": {
                    "should": params
                }
            }
        }
    };

    return searchParams;
};


attendanceUtil.statusUpdateQuery = function (req, data) {
    try {
        var array = [];
        var bulkDoc = {
            update: {
                _index: global.config.elasticSearch.index.attendanceIndex,
                _type: global.config.elasticSearch.index.attendancesMasterType,
                _id: data.attendance_id.toString(),
            }
        };
        var doc = { doc: {created_by: 'user_name'} };
        array.push(bulkDoc);
        array.push(doc);
        return array;
    } catch (err) {
        return err;
    }
};


function haveUserLevelPerm(req) {
    var userPermissions = req.headers.userInfo.permissions;
    var manage = _.includes(userPermissions, commons.constants.USER_LEVEL);
    var check = false;

    if(manage) {
        check = true
    }

    return check;
};


module.exports = attendanceUtil;
