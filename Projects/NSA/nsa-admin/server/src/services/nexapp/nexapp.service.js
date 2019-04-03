/**
 * Created by kiranmai on 9/5/17.
 */



var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    async = require('async'),
    _ = require('lodash'),
    taxonomyUtils = require('@nsa/nsa-commons').taxanomyUtils,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger'),
    baseService = require('../common/base.service');


exports.generateDelQuery = function (req, res) {
    getSubjectsByClassAndSecs(req, function (err, result) {
        
    })
}

exports.getSubjectsbyClassSections = function(req, res) {
    async.parallel({
        classSubjects: getSubjectsByClassAndSecs.bind(null, req),
        subjects: getAllNexappSubTopics.bind(null, req),
        titles: getAllNexappTitles.bind(null, req)
    }, function (err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,
                err.message.toString().indexOf(message.nsa1819) > -1 ? err.message : message.nsa1812));
        } else {
            data.subjects = JSON.parse(JSON.stringify(data.subjects));
            data.titles = JSON.parse(JSON.stringify(data.titles));
            data.subjects = _.filter(data.subjects, function(o) { return o.url != null; });
            getClassTitles(req, res, data, function(err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            });

        }
    })
};

exports.getSubjectsbyClass = function(req, res) {
    req.body.classId = req.params.id;
    async.parallel({
        classSubjects: getSubjectByClassId.bind(null, req),
        subjects: getAllNexappSubTopics.bind(null, req),
        titles: getAllNexappTitles.bind(null, req)
    }, function (err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,
                err.message.toString().indexOf(message.nsa1819) > -1 ? err.message : message.nsa1812));
        } else {
            data.subjects = JSON.parse(JSON.stringify(data.subjects));
            data.subjects = _.filter(data.subjects, function(o) { return o.url != null; });
            getClassTitles(req, res, data, function(err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            });

        }
    })
};

exports.getContentByTopic = function(req, res) {
    nsaCassandra.Nexapp.getContentBySubTopic(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
        } else {
            getTopicData(result, function (err, response) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
                } else {
                    events.emit('JsonResponse', req, res, response);
                }

            })

        }
    })
};

exports.getClassSubjects = function(req, res) {
    console.log("Sucxs")
    nsaCassandra.Nexapp.getSchoolClassSubjects(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
        } else {
            console.log("ssunsq..........", result)
            getClassData(result, function (err, response) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
                } else {
                    events.emit('JsonResponse', req, res, response);
                }

            })

        }
    })
};

exports.getContentBySubject = function(req, res) {
    nsaCassandra.Nexapp.getContentBySubject(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
        } else {
            getData(result, function (err, response) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
                } else {
                    var data = {};
                    data.subjectId = req.params.id;
                    data.topics = response;
                    events.emit('JsonResponse', req, res, data);
                }

            })

        }
    })
};


exports.getContentBySubTitTerm = function(req, res) {
    nsaCassandra.Nexapp.getContentBySubTitTerm(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
        } else {
            getData(result, function (err, response) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
                } else {
                    var data = {};
                    data.subjectId = req.body.id;
                    data.topics = response;
                    events.emit('JsonResponse', req, res, data);
                }

            })

        }
    })
};


function getData(result, cb) {
    var topicArray = []
    try {
        var results = JSON.parse(JSON.stringify(result));
        var topicData = _.groupBy(results, 'topic_name');
        _.map(topicData, function(value, key){
            var topic = {}
            topic.topicName = key;
            topic.content = _.groupBy(value, 'content_type');
            topicArray.push(topic)
        });
        cb(null, topicArray)
    } catch (err) {
        cb(err, null)
    }

}

function getTopicData(result, cb) {
    try {
        var topic = {}
        if(result) {
            var results = JSON.parse(JSON.stringify(result));
            topic.topicName = results[0].topic_name;
            topic.content = _.groupBy(results, 'content_type');
        }
        cb(null, topic)

    } catch (err) {
        cb(err, null)
    }

}

function getClassData(result, cb) {
    try {
        var classArray = []
        if(result) {
            var results = JSON.parse(JSON.stringify(result));
            var topicData = _.groupBy(results, 'classId');
            _.map(topicData, function(value, key){
                var classData = {}
                classData.classId = key;
                classData.className = value[0].className;
                classData.subjects = _.uniqBy(results, 'subjectId');
                classArray.push(classData)
            });
            cb(null, classArray)
        }

    } catch (err) {
        cb(err, null)
    }

}

function getClassSub(req, res, data, callback) {
    try {
        var subjects = [];
        if(!_.isEmpty(data.classSubjects) && !_.isEmpty(data.subjects)) {
            _.forEach(data.classSubjects, function(val){
                var sub = _.filter(data.subjects, {'subject_id' : val.subjectId});
                if(Array.isArray(sub) && sub.length > 0) {
                    val['subjectName'] = sub[0].subject_name;
                    val['topics'] = sub.length;
                    subjects.push(val);
                }
            })
        }
        callback(null, subjects);
    } catch (err) {
        callback(err, null);
    }
}

function getClassTitles(req, res, data, callback) {
    try {
        var subjects = [];
        var titles = []
        if(!_.isEmpty(data.classSubjects) && !_.isEmpty(data.subjects)) {
            _.forEach(data.classSubjects, function(val, index){
                var sub = _.filter(data.subjects, {'subject_id' : val.subjectId});
                if(Array.isArray(sub) && sub.length > 0) {
                    subjects.push(sub);
                }
                if(index === (data.classSubjects.length - 1)) {
                    var data1 = _.groupBy(_.flatten(subjects), 'title');
                    _.map(data1, function (value, key) {
                        var title = {};
                        var titleData = _.filter(data.titles, {'title_name' : key.toUpperCase()});
                        title.titleName =  titleData.length > 0 ? titleData[0].title_name : key;
                        title.titleUrl =  titleData.length > 0 ? titleData[0].title_url : null;
                        title.terms = [];
                        _.map(_.groupBy(value, 'term_name'), function (value1, key1) {
                            var term = {};
                            if(key1 != "null") {
                                term[key1] = !_.isEmpty(value1) ? _.uniqBy(value1, 'subject_id') : []
                                title.terms.push(term);
                            }

                        })
                        titles.push(title)
                    })

                    callback(null, titles);
                }
            })
        } else {
            callback(null, titles);
        }
    } catch (err) {
        callback(err, null);
    }
}

function getSubjectByClassId(req, callback) {
    nsaCassandra.Subject.getSchoolClassSubjectsById(req, function(err, result) {
        callback(err, JSON.parse(JSON.stringify(result)))
    });

}

function getSubjectsByClassAndSecs(req, callback) {
    var sections = req.body.sectionIds, data1 = {mergedsubjects: [] };
    baseService.waterfallOver(req, sections, iterateQuery, data1, function(err, result) {
        callback(err, data1.mergedsubjects);
    });
}

function iterateQuery(req, sectionId, data1, report) {
    req.body.sectionId = sectionId;
    nsaCassandra.Subject.getSubjectsbyClassSection(req, function(err, result) {
        var results = JSON.parse(JSON.stringify(result));
        if (results.length > 0) {
            _.each(results, function (subject) {
                var alreadyAddedSubject = _.find(data1.mergedsubjects, ['subjectId', subject.subjectId]);
                if (alreadyAddedSubject) {
                    alreadyAddedSubject.sectionIds.push(subject.sectionId);
                } else {
                    subject.sectionIds = [subject.sectionId];
                    delete subject.sectionId;
                    data1.mergedsubjects.push(subject);
                }
            });
        } else {
            err = {};
            err.message = message.nsa1821;
            if(!_.isEmpty(req.body.sections)){
                var sections = _.find(req.body.sections, function (o) {return o.id == sectionId;});
                err.message = message.nsa1819 + sections.name;
            }
        }
        report(err, data1);
    })
}


function getAllNexappSubTopics(req, callback) {
    nsaCassandra.Nexapp.getSchSubjContent(req, function(err, result) {
        callback(err, result)
    })
}

function getAllNexappTitles(req, callback) {
    nsaCassandra.Nexapp.getNexappTitles(req, function(err, result) {
        callback(err, result)
    })
}

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.GRADE_DETAILS, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;