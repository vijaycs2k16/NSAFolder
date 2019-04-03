/**
 * Created by Ramkumar on 8/21/2018.
 */


'use strict';

var bodybuilder = require('bodybuilder');
var commons = require('@nsa/nsa-commons');
var _ = require('lodash');
/*var commonUtil = require('./commonutil');*/
var options;

// Constructor builderutil
var classUtil = function f(options) {
    var self = this;
    self.options = options;
};

classUtil.constructClassIndex = function(req) {

    var constructIndex = { index: global.config.elasticSearch.index.attendanceIndex };
    return constructIndex;
};

classUtil.createClassIndexWithMappings = function(req) {
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
            mappings: {
                classes: {
                    properties: {
                        tenant_id: {type: "string"},
                        school_id: {type: "string"},
                        school_name: {type: "string"},
                        academic_year: {type: "string"},
                        id: {type: "string"},
                        class_id: {type: "string", index: "not_analyzed"},
                        class_name: {type: "string", analyzer: "keyword_lowercase", fielddata: true},
                        class_code: {type: "string", index: "not_analyzed"},
                        sections: {
                            type: "object",
                            properties: {
                                section_id: {type: "string", index: "not_analyzed"},
                                section_name: {type: "string", analyzer: "keyword_lowercase", fielddata: true},
                                subjects: {
                                    type: "object",
                                    properties: {
                                        subject_id: {type: "string", index: "not_analyzed"},
                                        subject_name: {type: "string", analyzer: "keyword_lowercase", fielddata: true},
                                    }
                                }
                            }
                        }
                    }
                }
            }
    };
    return {
        index: global.config.elasticSearch.index.attendanceIndex,
        body: JSON.stringify(body)
    };
};


classUtil.getAttendanceQuery = function(req, headers, viewPermission, sortParam) {
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

classUtil.getQuery = function(req, params) {
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


classUtil.statusUpdateQuery = function (req, data) {
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


module.exports = classUtil;
