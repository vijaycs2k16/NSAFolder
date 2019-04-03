var mongoose = require('mongoose');
var sheetSchema = mongoose.Schemas.Sheet;
var examSchema = mongoose.Schemas.Exam;
var events = require('@nsa/nsa-commons').events;
var baseService = require('@nsa/nsa-cassandra').BaseService;
var examScheduleSchema = mongoose.Schemas.ExamSchedule;
var examScheduleLogSchema = mongoose.Schemas.ExamScheduleLog;
var examStudentSchema = mongoose.Schemas.StudentExam;
var questionMetrics = mongoose.Schemas.QuestionMetrics;
/*var practiceStudentSchema = mongoose.Schemas.StudentPractice;*/
var subjectMetricsSchema = mongoose.Schemas.SubjectMetrics;
var dateUtils = require('../helpers/dateService');
var FilterMapper = require('../helpers/filterMapper');
var filterMapper = new FilterMapper();
var notificationHandler = require('./notifications');
var async = require('async');
var pageHelper = require('../helpers/pageHelper');
var utils = require('../helpers/serviceUtils');
var serviceUtils = require('../helpers/serviceUtils')
var _ = require('lodash');
var moment = require('moment');
var generateColor = require('generate-color')
var nsaElasticSearch = require('@nsa/nsa-elasticsearch')
var logger = require('../../common/logging');
var message = require('@nsa/nsa-commons').messages;
var studyContentSchema = mongoose.Schemas.StudyContent;
var subjectTitleSchema = mongoose.Schemas.subjectTitle;
var schoolSubjectTitleSchema = mongoose.Schemas.schoolSubjectTitle;
var subjectTitleTermSchema = mongoose.Schemas.subjectTitleTerm;
var objectId = mongoose.Types.ObjectId;
var subjectTermTopicsSchema = mongoose.Schemas.SubjectTermTopics;
var subjectTopics = mongoose.Schemas.SubjectTopics;

var Module = function (models) {
    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudyContent', studyContentSchema);
        var body = req.body;
        var journal = new Model(body);

        journal.save(function (err, _journal) {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000)
                    err.message = "Course code already exists";
                return next(err);
            }

            getCourseById(req, {id: _journal._id}, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(201).send(result);
            });
        });

    };

    function getCourseById(req, options, callback) {
        var Model;
        var id = options.id;

        var Model = models.get(req.session.lastDb, 'Course', courseSchema);

        Model.findById(id).populate({path : 'product'}).exec(function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
    }

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudyContent', studyContentSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var findQuery = {courseStatus: true};

        if(data.render) {
            findQuery = {}
        }

        getTotal = function (cb) {
            Model
                .find({})
                .count(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result || 0);
                });
        };

        getData = function (cb) {
            Model
                .find(findQuery)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate({path: 'product'})
                .exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
        };

        async.parallel([getTotal, getData], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({total: result[0], data: result[1]});
        });
    };

    this.getExam = function (req, res, next) {
        var queryParams = req.query;
        var filterObj = req.query.filter;
        var  filter = queryParams.filter || {};
        var contentType = queryParams.contentType || 'VExamSchedule';
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var queryObject = {};
        var headers = baseService.getHeaders(req);
        //var findQuery = {userName: headers.user_id};
        var Model = models.get(req.session.lastDb, 'schoolSubjectTitle', schoolSubjectTitleSchema);
        var matchQuery = {$and :[{'subjectTitle.class_id': req.query.classId}]};
        Model.aggregate([
            {$match: {$and :[{tenant_id: headers.tenant_id},{school_id: headers.school_id}]}},
            {
                "$lookup": {
                    "from": "subjectTitleTerm",
                    "localField": "subjectTerm",
                    "foreignField": "_id",
                    "as": "subjectTitleTerm"
                }
            },
            {$unwind: {path: '$subjectTitleTerm'}},
            {
                "$lookup": {
                    "from": "subjectTitle",
                    "localField": "subjectTitleTerm.subjectTitle",
                    "foreignField": "_id",
                    "as": "subjectTitle"
                }
            },
            {$unwind: {path: '$subjectTitle'}},
            {
                "$lookup": {
                    "from": "Subject",
                    "localField": "subjectTitle.subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {
                "$lookup": {
                    "from": "title",
                    "localField": "subjectTitle.title",
                    "foreignField": "_id",
                    "as": "title"
                }
            },
            {
                "$lookup": {
                    "from": "SubjectTermTopics",
                    "localField": "subjectTitleTerm._id",
                    "foreignField": "subjectTitleTerm",
                    "as": "SubjectTermTopics"
                }
            },
            {$unwind: {path: '$subject'}},
            {$unwind: {path: '$title'}},
            {$unwind: {path: '$SubjectTermTopics'}},
            {$match: matchQuery},
            {
                "$lookup": {
                    "from": "study_content",
                    "localField": "SubjectTermTopics.subjectTopic",
                    "foreignField": "topic",
                    "as": "study_content"
                }
            },
            {$unwind: {path: '$study_content'}},
            {
                $group: {
                    _id: {subjectId: "$subject._id", subject: "$subject", topic : '$study_content.topic'},
                    videos: {$first: '$study_content.videos'},
                    notes: {$first: '$study_content.pdf'},
                    count: { $sum: 1 },
                }
            },
            {
                "$lookup": {
                    "from": "SubjectTopics",
                    "localField": "_id.topic",
                    "foreignField": "topics._id",
                    "as": "topicData"
                }
            },

            {$unwind: {path: "$topicData",preserveNullAndEmptyArrays: true}},

            {
                $group: {
                    _id: "$_id.subjectId",
                    subjectName: {$first: '$_id.subject.subjectName'},
                    subjectColor: {$first: '$_id.subject.subjectColor'},
                    subjectIcon: {$first: '$_id.subject.subjectIcon'},
                    topic: {$addToSet: '$_id.topic'},
                    topicData : {$addToSet: {topic:'$_id.topic', topicObjs: '$topicData', content: {"videos":'$videos', notes: '$notes'}}},
                    count: { $sum: 1 },
                }
            },
            {
                $project : {
                    subject : 1,
                    _id: 1,
                    subjectName: 1,
                    subjectColor: 1,
                    subjectIcon: 1,
                    name: 1,
                    dateBeginAhead: 1,
                    examMode: 1,
                    topic: 1,
                    topicData: 1,
                    count: 1,
                }
            },

        ]).exec(function (err, result) {
            if (err) {
                logger.debugLog(req,'Unable to get school details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
            } else {
                result = serviceUtils.parseDbObjectAsJSON(result)
                events.emit('JsonResponse', req, res, getTopicObjs(result));
            }

            /*if (err) {
                return next(err);
            }
            result = serviceUtils.parseDbObjectAsJSON(result)
            res.status(200).send({sucess: true, data: getTopicObjs(result)});*/
        });
    };

    this.getTitle = function (req, res, next) {
        var headers = baseService.getHeaders(req)
        var name = req.query.name;
        var matchQuery = {}
        if(name != 'Nexapp') {
            matchQuery = {'subjectTitle.isAssessment': true}
        } else {
            matchQuery = {'subjectTitle.isVideos': true}
        }
        var Model = models.get(req.session.lastDb, 'schoolSubjectTitle', schoolSubjectTitleSchema);
        Model.aggregate([
            {$match: {$and :[{tenant_id:headers.tenant_id},{school_id:headers.school_id}]}},
            {
                "$lookup": {
                    "from": "subjectTitleTerm",
                    "localField": "subjectTerm",
                    "foreignField": "_id",
                    "as": "subjectTitleTerm"
                }
            },
            {$unwind: {path: '$subjectTitleTerm'}},
            {
                "$lookup": {
                    "from": "subjectTitle",
                    "localField": "subjectTitleTerm.subjectTitle",
                    "foreignField": "_id",
                    "as": "subjectTitle"
                }
            },
            {$unwind: {path: '$subjectTitle'}},
            {$match: matchQuery},
            {
                "$lookup": {
                    "from": "Subject",
                    "localField": "subjectTitle.subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {
                "$lookup": {
                    "from": "title",
                    "localField": "subjectTitle.title",
                    "foreignField": "_id",
                    "as": "title"
                }
            },
            {
                "$lookup": {
                    "from": "ClassDetails",
                    "localField": "subjectTitle.classDetail",
                    "foreignField": "_id",
                    "as": "classDetail"
                }
            },
            {$unwind: {path: '$subject'}},
            {$unwind: {path: '$title'}},
            {$unwind: {path: '$classDetail'}},
            {
                $group:
                    {
                        _id: {classDetail: '$classDetail', title : '$title', termName : '$subjectTitleTerm.term_name', termId: "$subjectTitleTerm.term_id"},
                        item : {$addToSet: {termName: '$subjectTitleTerm.term_name', "termId": "$subjectTitleTerm.term_id",_id: '$subject._id', "subjectName": '$subject.subjectName', "subject_id": '$subject.subject_id',"subjectIcon": '$subject.subjectIcon', "subjectColor": '$subject.subjectColor'}}
                    }
            },
            {
                $group:
                    {
                        _id: {title: '$_id.title',classDetail: '$_id.classDetail' },
                        item : {$addToSet: {termName: '$_id.termName', "_id": "$_id.termId", "subject": '$item'}}
                    }
            },
            {
                $group:
                    {
                        _id: {title: '$_id.title'},
                        item : {$addToSet: {_id: '$_id.classDetail._id', order_by: '$_id.classDetail.order_by', "className": "$_id.classDetail.className","class_id": "$_id.classDetail.class_id", "terms": '$item'}}
                    }
            },
            {$unwind: {path: '$item'}},
            {"$sort": { "item.order_by": 1} },
            {
                $group:
                    {
                        _id: {title: '$_id.title'},
                        item : {$push: '$item'},
                    }
            },
            {
                $project:
                    {
                        _id: '$_id.title._id',
                        titleName: '$_id.title.titleName',
                        titleUrl: '$_id.title.titleUrl',
                        classes: '$item'
                    }
            }
        ]).exec(function (err, result) {
            if (err) {
                logger.debugLog(req,'Unable to get school details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
            } else {
                result = serviceUtils.parseDbObjectAsJSON(result)
                events.emit('JsonResponse', req, res, result);
            }
        });
    };

    this.getSubject = function (req, res, next) {
        var headers = baseService.getHeaders(req)
        var Model = models.get(req.session.lastDb, 'schoolSubjectTitle', schoolSubjectTitleSchema);
        var matchQuery = {$and :[{'subjectTitle.class_id': req.params.classId}, {'subjectTitle.isVideos': true}]};
        Model.aggregate([
            {$match: {$and :[{tenant_id:headers.tenant_id},{school_id:headers.school_id}]}},
            {
                "$lookup": {
                    "from": "subjectTitleTerm",
                    "localField": "subjectTerm",
                    "foreignField": "_id",
                    "as": "subjectTitleTerm"
                }
            },
            {$unwind: {path: '$subjectTitleTerm'}},
            {
                "$lookup": {
                    "from": "subjectTitle",
                    "localField": "subjectTitleTerm.subjectTitle",
                    "foreignField": "_id",
                    "as": "subjectTitle"
                }
            },
            {$unwind: {path: '$subjectTitle'}},
            {
                "$lookup": {
                    "from": "Subject",
                    "localField": "subjectTitle.subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {
                "$lookup": {
                    "from": "title",
                    "localField": "subjectTitle.title",
                    "foreignField": "_id",
                    "as": "title"
                }
            },
            {$unwind: {path: '$subject'}},
            {$unwind: {path: '$title'}},
            {$match: matchQuery},
            {
                $group:
                    {
                        _id: {title : '$title', termName : '$subjectTitleTerm.term_name', termId: "$subjectTitleTerm.term_id"},
                        item : {$addToSet: {termId: "$subjectTitleTerm.term_id", _id: '$subject._id', "subjectName": '$subject.subjectName', "subject_id": '$subject.subject_id', "subjectIcon": '$subject.subjectIcon', "subjectColor": '$subject.subjectColor'}},
                        classId: {$first:'$subjectTitle.class_id'},classDetail: {$first:'$subjectTitle.classDetail'}
                    }
            },
            {
                $group:
                    {
                        _id: {title: '$_id.title'},
                        item : {$addToSet: {termName: '$_id.termName', "_id": "$_id.termId", "subject": '$item'}},
                        classId: {$first:'$classId'},classDetail: {$first:'$classDetail'}
                    }
            },
            {
                $project:
                    {
                        _id: '$_id.title._id',
                        titleName: '$_id.title.titleName',
                        titleUrl: '$_id.title.titleUrl',
                        classId: '$classId',classDetail: '$classDetail',
                        terms: '$item'
                    }
            }
        ]).exec(function (err, result) {
            if (err) {
                logger.debugLog(req,'Unable to get school details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
            } else {
                result = serviceUtils.parseDbObjectAsJSON(result)
                events.emit('JsonResponse', req, res, result);
            }
        });
    };

    this.getSubjectsByClassDetail = function (req, res, next) {
        if(req.query.mobile) {
            var subTop = models.get(req.session.lastDb, 'SubjectTopics', subjectTopics)
            var data = req.query;
            var findQuery = {}
            var objectId = mongoose.Types.ObjectId;
            var classId = req.params.id;
            var headers = baseService.getHeaders(req);
            var student = headers.user_id;
            subTop.aggregate([
                {
                    "$lookup": {
                        "from": "ClassDetails",
                        "localField": "classDetail",
                        "foreignField": "_id",
                        "as": "classDetail"
                    }
                },
                {$unwind: "$classDetail"},
                {'$match': {'classDetail.class_id': classId}},
                {
                    "$lookup": {
                        "from": "subject_metrics",
                        "localField": "subject",
                        "foreignField": "subject",
                        "as": "SubjectMetrics"
                    }
                },
                {$unwind: "$SubjectMetrics"},
                {
                    "$lookup": {
                        "from": "Subject",
                        "localField": "SubjectMetrics.subject",
                        "foreignField": "_id",
                        "as": "subject"
                    }
                },
                {$unwind: "$subject"},
                {'$match': {'SubjectMetrics.userName': student}},
                {
                    $group:
                        {
                            _id: {subjectId: '$SubjectMetrics.subject', subject: '$subject'},
                            totalScore : { $sum: "$SubjectMetrics.aggregate_percentage" },
                            topics: {$first: '$topics'},
                            countData: { $sum: 1 }
                        }
                },
                {
                    $group:
                        {
                            _id: {subject: '$_id.subjectId'},
                            subject : {$first:'$_id.subject'},
                            topics: {$first:'$topics'},
                            totalScore: {$first:'$totalScore'},
                            countData: {$first:'$countData'},
                        }
                }
            ]).exec(function (err, result) {
                if(err) {
                    next(err, null);
                } else {

                    res.status(200).send({data: _.isEmpty(result) ? [] : result});
                }

            })

        } else {
            var subTop = models.get(req.session.lastDb, 'SubjectTopics', subjectTopics)
            var data = req.query;
            var findQuery = {}
            var objectId = mongoose.Types.ObjectId;
            var classId = req.params.id;
            subTop.find({"classDetail": objectId(classId)})
                .populate({path : 'classDetail'})
                .populate({path : 'subject'})
                .exec(function (err, result) {
                    if(err) {
                        next(err, null);
                    } else {
                        res.status(200).send({data: _.isEmpty(result) ? [] : result});
                    }
                });
        }


    };



    this.getTopicVideos = function (req, res, next) {
        var paperConfigQuery = {}
        var model = models.get(req.session.lastDb, "SubjectTermTopics", subjectTermTopicsSchema);
        var matchQuery = {$and: [{"subjectTitle.subject": objectId(req.body.subject)},{"subjectTitle.classDetail": objectId(req.body.classDetail)},{"subjectTitle.title": objectId(req.body.title)}]}

        if(req.body.test) {
            model.aggregate([
                {
                    "$lookup": {
                        "from": "subjectTitleTerm",
                        "localField": "subjectTitleTerm",
                        "foreignField": "_id",
                        "as": "subjectTitleTerm"
                    }
                },
                {$unwind: {path: "$subjectTitleTerm"}},
                {
                    '$match': {"subjectTitleTerm.term_id": req.body.termId}
                },
                {
                    "$lookup": {
                        "from": "subjectTitle",
                        "localField": "subjectTitleTerm.subjectTitle",
                        "foreignField": "_id",
                        "as": "subjectTitle"
                    }
                },
                {
                    "$lookup": {
                        "from": "SubjectTopics",
                        "localField": "subjectTopic",
                        "foreignField": "topics._id",
                        "as": "subjectTopics"
                    }
                },
                {$unwind: {path: "$subjectTitle"}},
                {
                    '$match': matchQuery
                },
                {
                    "$lookup": {
                        "from": "Sheet",
                        "localField": "subjectTopic",
                        "foreignField": "topic",
                        "as": "sheet"
                    }
                },
                {$unwind: {path: "$sheet"}},
                {
                    "$lookup": {
                        "from": "ExamSchedule",
                        "localField": "sheet._id",
                        "foreignField": "paperConfig",
                        "as": "examSchedule"
                    }
                },
                {$unwind: {path: "$examSchedule"}},
                {
                    "$lookup": {
                        "from": "study_content",
                        "localField": "subjectTopic",
                        "foreignField": "topic",
                        "as": "studyContent"
                    }
                },
                {$unwind: {path: "$studyContent",
                    preserveNullAndEmptyArrays: true}},
                {
                    $project:
                        {
                            subjectTopics: '$subjectTopics',
                            topicId: '$subjectTopic',
                            studyContent : '$studyContent',
                        }
                },
                /*{
                 $project:
                 {
                 subjectTopics: '$subjectTitle',
                 }
                 }*/
            ]).exec(function (err, result) {

                if (err) {
                    events.emit('ErrorJsonResponse', req, res, {message: buildErrResponse(err, message.nsa22009)});
                } else {
                    events.emit('JsonResponse', req, res, getTopicNames(result));
                }
            });
        } else {

            model.aggregate([
                {
                    "$lookup": {
                        "from": "subjectTitleTerm",
                        "localField": "subjectTitleTerm",
                        "foreignField": "_id",
                        "as": "subjectTitleTerm"
                    }
                },
                {$unwind: {path: "$subjectTitleTerm"}},
                {
                    '$match': {"subjectTitleTerm.term_id": req.body.termId}
                },
                {
                    "$lookup": {
                        "from": "subjectTitle",
                        "localField": "subjectTitleTerm.subjectTitle",
                        "foreignField": "_id",
                        "as": "subjectTitle"
                    }
                },
                {
                    "$lookup": {
                        "from": "SubjectTopics",
                        "localField": "subjectTopic",
                        "foreignField": "topics._id",
                        "as": "subjectTopics"
                    }
                },
                {$unwind: {path: "$subjectTitle"}},
                {
                    '$match': matchQuery
                },
                {
                    "$lookup": {
                        "from": "study_content",
                        "localField": "subjectTopic",
                        "foreignField": "topic",
                        "as": "studyContent"
                    }
                },
                {
                    $unwind: {
                        path: "$studyContent",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        subjectTopics: '$subjectTopics',
                        topicId: '$subjectTopic',
                        studyContent: '$studyContent',
                    }
                },
                /*{
                 $project:
                 {
                 subjectTopics: '$subjectTitle',
                 }
                 }*/
            ]).exec(function (err, result) {

                if (err) {
                    events.emit('ErrorJsonResponse', req, res, {message: buildErrResponse(err, message.nsa22009)});
                } else {
                    events.emit('JsonResponse', req, res, getTopicNames(result));
                }
            });
        }

        /* function getSubjectList(req, callback) {
         var query = { $and : [{
         student: req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid)}]
         };
         model.aggregate([
         {
         '$match': query
         },
         {
         "$lookup": {
         "from": "Subject",
         "localField": "subject",
         "foreignField": "_id",
         "as": "subject"
         }
         },
         {$unwind: {path: "$subject"}},
         {
         $group:
         {
         _id: '$subject._id',
         subjectName : {$first: '$subject.subjectName'},
         subjectColor: {$first: '$subject.subjectColor'},
         totalSkipped: { $sum: "$total_skipped" },
         totalCorrect: { $sum: "$total_correct" },
         totalWrong: { $sum: "$total_wrong" },
         totalMarks: { $sum: "$total_marks" },
         totalScore : { $sum: "$total_marks_scored" },
         totalQues: { $sum: "$total_ques" },
         avgPercentage: { $avg: "$aggregate_percentage" }
         }
         }
         ]).exec(function (err, result) {
         callback(err, result)
         });
         }


         async.parallel ( {
         subjectList : getSubjectList.bind(null, req),
         //course : getCourseDuration.bind(null,req)
         //aggregateList :getAggregateData.bind(null, req)
         }, function (err, result) {
         if (err) {
         logger.debugLog(req,'Unable to get school details ', err);
         events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
         } else {
         events.emit('JsonResponse', req, res, result);
         }
         })*/

    }



    function getTopicObjs(data) {
        var dataObj = []
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                _.forEach(data, function (value, key) {
                    var topicDatas=[];
                    if(!_.isEmpty(value.topic)){
                        _.forEach(value.topic, function (topicId, key) {
                            var topicData = _.filter(value.topicData, {'topic': topicId});
                            _.forEach(topicData, function (topicObjs, index) {
                                if(topicObjs.topicObjs) {
                                    var topics = _.filter(topicObjs.topicObjs.topics, {'_id': topicId});
                                    if (topics.length > 0) {
                                       // topicObjs.content.practice = topicObjs.content.practice.filter(value => Object.keys(value).length !== 0);
                                       // var practicObj = _.filter(topicObjs.content.practice, {'isSubmit': true});
                                        topics[0].questions = topicObjs.questions;
                                        topics[0].content = topicObjs.content;
                                        //getAvgTime(topicObjs.content.practice);
                                        //topics[0].avgData = !_.isEmpty(practicObj) ? ((practicObj.length / topicObjs.content.practice.length) * 100) : 0;
                                        topicDatas.push(topics[0]);
                                    }
                                }

                            });
                        });
                        value.topicData = topicDatas;
                    }
                });
                return data;
            }
            catch (err) {
                console.log("err", err);
            }
        } else {
            return dataObj;
        }

    };



    function getTopicNames(data) {
        var dataObj = []
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                data = _.uniqBy(data, '_id');
                _.forEach(data, function (value, key) {
                    var topicDatas=[];
                    if(!_.isEmpty(value.topicId)){
                        _.forEach(value.subjectTopics, function (topicObj, key) {
                            var topics = _.filter(topicObj.topics, {'_id': value.topicId})
                            if(topics.length > 0) {
                                value.topicName = topics[0].name;
                                value.videos = value.studyContent != null ? value.studyContent.videos : [];
                                value.pdf = value.studyContent != null ? value.studyContent.pdf : [];
                            }
                        });
                        delete value.subjectTopics;
                    }
                });
                return data;
            }
            catch (err) {
                console.log("err", err);
            }
        } else {
            return dataObj;
        }

    };

    function getAvgTime(data) {
        data = JSON.stringify(data.filter(function(el) {return typeof el != "object" || Array.isArray(el) || Object.keys(el).length > 0;}));
        if(!_.isEmpty(data)) {
            _.forEach(data, function (val) {
                if((!_.isEmpty(val) && val.practice && !_.isEmpty(val.practice.questions))) {
                    val.avgTime = _.meanBy(val.practice.questions, function (o) {
                        return +o.attempted_time;
                    })
                }
            })
        }
        return data;
    }

    this.getForDd = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Course', courseSchema);
        var query = req.query;

        Model
            .find(query, {})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
    };

    this.getCourseById = function (req, data, next) {
        var courseModel = models.get(req.session.lastDb, 'Course', courseSchema);
        courseModel.findOne({_id: req.body.course})
            .exec(function (err, response) {
                if(response)
                data.course = response
                next(err, req, data)
            });
    };

    this.getCourse = function (req, res, next) {
        var courseModel = models.get(req.session.lastDb, 'Course', courseSchema);
        courseModel.findOne({_id: req.query.course})
            .exec(function (err, response) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: response});
            });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var Journal = models.get(req.session.lastDb, 'Course', courseSchema);

        Journal.findByIdAndRemove(id, function (err, journal) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: journal});

        });
    };

    function getById(req, res, next) {
        var PriceListModel = models.get(req.session.lastDb, 'PriceList', priceListSchema);
        var priceListId = req.params.id;

        PriceListModel.aggregate([{
            $match: {
                _id: ObjectId(priceListId)
            }
        }, {
            $lookup: {
                from        : 'currency',
                localField  : 'currency',
                foreignField: '_id',
                as          : 'currencies'
            }
        }, {
            $unwind: '$currencies'
        }, {
            $project: {
                total         : 1,
                name          : 1,
                priceListCode : 1,
                cost          : 1,
                currencyId    : '$currencies._id',
                currencyName  : '$currencies.name',
                currencySymbol: '$currencies.symbol'
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result[0]);
        });
    }

    this.getById = getById;

    this.update = function (req, res, next) {
        var courseListModel = models.get(req.session.lastDb, 'Course', courseSchema);
        var body = req.body;
        var _id = req.params.id;
        courseListModel.findByIdAndUpdate(_id, body, {new: true}, function (err, list) {
            if (err) {
                return next(err);
            }

            getCourseById(req, {id: _id}, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(201).send(result);
            });
        });
    };
};

module.exports = Module;
