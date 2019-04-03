/**
 * Created by bharatkumarr on 14/09/17.
 */

var bodybuilder = require('bodybuilder');
var commons = require('@nsa/nsa-commons');

// Constructor builderutil
var commonUtil = function f(options) {
    var self = this;
    self.options = options;
};

commonUtil.getChildBodybuilder = function(req, childName, headers, viewPermission, sortParam) {
    var body = getBasicBodybuild(req, sortParam), queryRange = {}, esQuery = {}, dateParam;
    body.query(commons.constants.ES_HAS_CHILD, {type: childName}, (q) => {
        q.query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year);

        if (headers) {
            q.addQuery(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, headers.academic_year);
        }

        if (viewPermission) {
            q.addQuery(commons.constants.ES_MATCH_PHRASE, 'created_by', headers.user_id);
        }

        if (req.body.classId) {
            q.addQuery(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_CLASS_ID, req.body.classId);
        }

        if (req.body.sectionId) {
            q.addQuery(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_SECTION_ID, req.body.sectionId);
        }

        if (!req.body.classId) {
            var classes = req.body.classes;
            for (var i = 0; i < classes.length; i++) {
                q.query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_CLASS_ID, classes[i].class_id);
            }
        }

        if (req.query.dateParam) {
            dateParam = req.query.dateParam;
        } else {
            dateParam = commons.constants.ES_UPDATED_DATE;
        }

        if (req.query.startDate && req.query.endDate) {
            queryRange[commons.constants.ES_QUERY_GTE] = req.query.startDate;
            queryRange[commons.constants.ES_QUERY_LT] = req.query.endDate;
            q.query(commons.constants.ES_RANGE, dateParam, queryRange)
        }

        if (req.query.keyword) {
            esQuery[commons.constants.ES_QUERY] = '*' + req.query.keyword + '*';
            q.query(commons.constants.ES_QUERY_STRING, esQuery)
        }

        if (req.body.subjectId) {
            q.query(commons.constants.ES_NESTED, {path: commons.constants.ES_SUBJECTS, score_mode: 'avg'}, (q) => {
                return q.query(commons.constants.ES_MATCH, commons.constants.ES_SUBJECTS_SUBJECT_ID, req.body.subjectId)
            });
        }
        return q;
    });

    return body;
};


commonUtil.getChildbuilder = function(req, childName, headers, viewPermission, sortParam) {
    var body = getBasicBodybuild(req, sortParam), queryRange = {}, esQuery = {}, dateParam;
    body.query(commons.constants.ES_HAS_CHILD, {type: childName}, (q) => {
        q.query('bool', (b) => {
            b.filter(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
                .filter(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
                .filter(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear : req.headers.userInfo.academic_year);

            if (headers) {
                b.filter(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, headers.academic_year);
            }

            if (viewPermission) {
                b.filter(commons.constants.ES_MATCH_PHRASE, 'created_by', headers.user_id);
            }

            if (req.body.classId) {
                b.filter(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_CLASS_ID, req.body.classId);
            }

            if (req.body.sectionId) {
                b.filter(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_SECTION_ID, req.body.sectionId);
            }

            if (req.query.dateParam) {
                dateParam = req.query.dateParam;
            } else {
                dateParam = commons.constants.ES_UPDATED_DATE;
                //dateParam = commons.constants.ES_ATTENDANCE_DATE;

            }

            if (req.query.startDate && req.query.endDate) {
                queryRange[commons.constants.ES_QUERY_GTE] = req.query.startDate;
                queryRange[commons.constants.ES_QUERY_LT] = req.query.endDate;
                b.filter(commons.constants.ES_RANGE, dateParam, queryRange)
            }

            if (req.query.keyword) {
                esQuery[commons.constants.ES_QUERY] = '*' + req.query.keyword + '*';
                b.filter(commons.constants.ES_QUERY_STRING, esQuery)
            }

            if (req.body.subjectId) {
                b.filter(commons.constants.ES_NESTED, {path: commons.constants.ES_SUBJECTS, score_mode: 'avg'}, (q) => {
                    return b.filter(commons.constants.ES_MATCH, commons.constants.ES_SUBJECTS_SUBJECT_ID, req.body.subjectId)
                });
            }

            if (!req.body.classId) {
                var userPerm = haveUserLevelPerm(req);
                if (userPerm) {
                    var classes = req.body.classes;
                    for (var i = 0; i < classes.length; i++) {
                        b.orFilter(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_CLASS_ID, classes[i].class_id);
                    }
                }


            }
            return b;
        });

        return q;
    });

    return body;
};


commonUtil.getParentBodybuilder = function(req, parentName, sortParam) {
    var body = getBasicBodybuild(req, sortParam), queryRange = {}, esQuery = {};
    body.query(commons.constants.ES_HAS_PARENT, {type: parentName}, function(q) {
        q.query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year)

        if (req.body.objectId) {
            q.addQuery(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_OBJECT_ID, req.body.objectId);
        }

        if (req.body.classId) {
            q.query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_CLASS_ID, req.body.classId)
        }

        if (req.body.sectionId) {
            q.addQuery(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_SECTION_ID, req.body.sectionId);
        }

        if (req.query.dateParam) {
            dateParam = req.query.dateParam;
        } else {
            dateParam = commons.constants.ES_ATTENDANCE_DATE;
        }

        if (req.query.search && req.query.search.value) {
            var esQuery = {};
            esQuery['fields'] = ["first_name", "primary_phone" ,"updated_date"];
            esQuery[commons.constants.ES_QUERY] = '*' + updateSpecialCharacter(req.query.search.value) + '*';
            body.query(commons.constants.ES_QUERY_STRING, esQuery);
        }

        if (req.query.startDate && req.query.endDate) {
            queryRange[commons.constants.ES_QUERY_GTE] = req.query.startDate;
            queryRange[commons.constants.ES_QUERY_LT] = req.query.endDate;
            q.query(commons.constants.ES_RANGE, dateParam, queryRange)
        }

        if (req.query.keyword) {
            esQuery[commons.constants.ES_QUERY] = '*' + req.query.keyword + '*';
            q.query(commons.constants.ES_QUERY_STRING, esQuery)
        }

        if (req.body.subjectId) {
            q.query(commons.constants.ES_NESTED, {path: commons.constants.ES_SUBJECTS}, function (q) {
                return q.query(commons.constants.ES_MATCH, commons.constants.ES_SUBJECTS_SUBJECT_ID, req.body.subjectId)
            });
        }
        return q;
    });

    return body;
};

function updateSpecialCharacter(str) {
    return str
        .replace(/[\#\@\%\&\*\+\-=~><\"\?\^\${}\(\)\:\!\/[\]\\\s]/g, '\\$&') // replace single character special characters
        .replace(/\|\|/g, '\\||') // replace ||
        .replace(/\&\&/g, '\\&&') ;
}

commonUtil.getBodybuilder = function(req, sortParam) {
    try {
        var queryRange = {}, esQuery = {}, dateParam;
        var body = getBasicBodybuild(req, sortParam);

        body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year);

        if (req.query.search) {
            req.query.keyword = req.query.search.value.toString();
        }

        if (req.query.dateParam) {
            dateParam = req.query.dateParam;
        } else {
            dateParam = commons.constants.ES_UPDATED_DATE;
        }

        if (req.query.startDate && req.query.endDate) {
            queryRange[commons.constants.ES_QUERY_GTE] = req.query.startDate;
            queryRange[commons.constants.ES_QUERY_LT] = req.query.endDate;
            body.query(commons.constants.ES_RANGE, dateParam, queryRange);
        }

        if (req.query.keyword) {
            esQuery[commons.constants.ES_QUERY] = '*' + req.query.keyword + '*';
            body.query(commons.constants.ES_QUERY_STRING, esQuery);
        }

        return body;
    } catch (err) {
        return err;
    }
};

function getBasicBodybuild(req, sortParam) {
    var param = commons.domains.getParamObject(req), body, sortObj = {};
    if (req.query.start) {
        param.from = req.query.start;
    } else {
        param.from = 0;
    }
    if (req.query.length) {
        param.size = req.query.length;
    } else {
        param.size = commons.constants.DEFAULT_PARAM_SIZE;
    }

    // sortObj[commons.constants.ES_UPDATED_DATE] = { "order": 'desc' };
    sortObj[sortParam.key] = { "order": sortParam.order };
    body = bodybuilder()
        .size(param.size)
        .from(param.from)
        .sort([sortObj]);

    return body;
}

function haveUserLevelPerm(req) {
    var userPermissions = req.headers.userInfo.permissions;
    var manage = _.includes(userPermissions, commons.constants.USER_LEVEL);
    var check = false;

    if(manage) {
        check = true
    }

    return check;
};

module.exports = commonUtil;


