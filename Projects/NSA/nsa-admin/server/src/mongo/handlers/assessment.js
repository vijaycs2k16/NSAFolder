/**
 * Created by kiranmai on 16/02/18.
 */

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
var subjectTitleTermSchema = mongoose.Schemas.subjectTitleTerm;
var subjectTermTopicsSchema = mongoose.Schemas.SubjectTermTopics;
var subjectTopicsSchema = mongoose.Schemas.SubjectTopics;


var Module = function (models) {
    var notification = new notificationHandler(models);
    var objectId = mongoose.Types.ObjectId;


    function topicObjs(data) {
        var datObj = []
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                _.forEach(data, function (value, key) {
                    if(!_.isEmpty(value.topic)){
                        var topicData={};
                        value.topicObjs = (!_.isEmpty(value.topicObjs) && _.isArray(value.topicObjs)) ? value.topicObjs[0] : value.topicObjs;
                        if(value.topicObjs) {
                            var topics = _.filter(value.topicObjs.topics, {'_id': value.topic})

                            if(topics.length > 0) {
                                value.topicData = topics[0];
                            }
                        }
                    }

                });

                return data;
            }
            catch (err) {
                console.log("err", err)
            }
        } else {
            return datObj;
        }

    };


    function subTopObjs(data) {
        var dtObj = []
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                _.forEach(data, function (value, key) {
                    if(!_.isEmpty(value.subTopic)){
                        var subtopData={};
                        value.subTopObjs = (!_.isEmpty(value.subTopObjs) && _.isArray(value.subTopObjs)) ? value.subTopObjs[0] : value.subTopObjs;
                        if(value.subTopObjs) {
                            var subtopic = _.filter(value.subTopObjs.subtopic, {'_id': value.subTopic})

                            if(subtopic.length > 0) {
                                value.subtopData = subtopic[0];
                            }
                        }
                    }

                });

                return data;
            }
            catch (err) {
                console.log("err", err)
            }
        } else {
            return dtObj;
        }

    };

    function groupTopicObjs(data) {
        var datObj = []
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                _.forEach(data, function (value, key) {
                    if(!_.isEmpty(value._id)){
                        var topicData={};
                        value.topicObjs = (!_.isEmpty(value.topicObjs) && _.isArray(value.topicObjs)) ? value.topicObjs[0] : value.topicObjs;
                        if(value.topicObjs) {
                            var topics = _.filter(value.topicObjs.topics, {'_id': value._id})

                            if(topics.length > 0) {
                                value._id = topics[0].name;
                            }
                        }
                    }

                });

                return data;
            }
            catch (err) {
                console.log("err", err)
            }
        } else {
            return datObj;

        }

    };

    function scheduleObjs(data) {
        var datObj = []
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                _.forEach(data, function (value, key) {
                    value.topic = (!_.isEmpty(value.topic) && _.isArray(value.topic)) ? value.topic[0] : value.topic;
                    if(!_.isEmpty(value.topic)){
                        var topics = _.filter(value.topic.topics, {'_id': value._id})
                        if(topics.length > 0) {
                            value['name'] = topics[0].name;
                        }
                    }

                });

                return data;
            }
            catch (err) {
                console.log("err", err)
            }
        } else {
            return datObj;
        }

    };

    function getTopicNames(data) {
        var dataObj = []
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                _.forEach(data, function (value, key) {
                    var topicDatas=[];
                    if(!_.isEmpty(value.topic)){
                        _.forEach(value.topic, function (topicId, key) {
                            _.forEach(value.topicObjs, function (topicObj, key) {
                                var topics = _.filter(topicObj.topics, {'_id': topicId})
                                if(topics.length > 0) {
                                    topicDatas.push(topics[0]);
                                }
                            });
                        });
                        value.topicData = _.uniqBy(topicDatas, '_id');
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

    function getById(req, options, next) {
        var id = options.id;
        var Model = models.get(req.session.lastDb, 'Sheet', sheetSchema);

        Model.findById(id)
            .populate({path : 'course'})
            .populate({path: 'subject'})
            .populate({path: 'questions'})
            .populate({path: 'classDetail'})
            .populate({path: 'subTopic._id'})
            .exec(function (err, result) {
            if (err) {
                return next(err);
            }
            next(null, result);
        });
    };


    /// Examination
    this.getExamByExamId = function (req, res, next) {
        async.waterfall([ saveStudentExamById.bind(null, req), getExamById.bind(), saveQuestions.bind()], function (err, result) {
            if (err) {
                logger.debugLog(req,'Unable to get school details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        })


    }

    this.getQuesByExamId = function (req, res, next) {
        async.waterfall([ getQuesById.bind(null, req), getQuestions.bind()], function (err, result) {
            if (err) {
                logger.debugLog(req,'Unable to get school details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        })


    }

    function getExamById(req, callback) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);
        var headers = baseService.getHeaders(req);

        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var findQuery = {examId : objectId(req.params.id)}
        if(headers.user_id != null) {
            findQuery.userName = headers.user_id;
        }
        if (filter) {
            findQuery.dateBeginAhead = {
                "$gte": new Date(filter.date.value[0]),
                "$lte": new Date(filter.date.value[1])
            }
        }

        Model.findOne(findQuery)
            .populate({path: 'examId', populate: [{path: 'paperConfig', populate: {path: 'questions'}}, {path: 'config'}]})
            .exec(function (err, result) {
                if (err) {
                    callback(err, req, {})
                }
                var obj1 = JSON.parse(JSON.stringify(result));
                var obj2 = JSON.parse(JSON.stringify(result.examId));
                var mergedObj = _.merge(obj1, obj2);
                dateUtils.formatObjectsDates(mergedObj, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                    mergedObj.id = result._id;
                    callback(err, req, mergedObj)
                });
            });
    }


    function saveStudentExamById(req, callback) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);
        var headers = baseService.getHeaders(req);

        Model.findOne({examId: req.params.id, userName: headers.user_id}).exec(function (err, result) {
            if(_.isEmpty(result)) {

                var body = {
                    examId: req.params.id,
                    userName: headers.user_id,
                    firstName: headers.user_name,
                    school_id: headers.school_id,
                    tenant_id: headers.tenant_id,
                    examMode: 'Online',
                    score: 0,
                    isCorrected: false,
                    isSubmit: false
                }
                var studentExam = new Model(body);

                studentExam.save(function (err, schedule) {
                        callback(err, req)
                    });
            } else {
                callback(err, req)
            }
        });
    }

    function getQuesById(req, callback) {
        var Model = models.get(req.session.lastDb, 'ExamSchedule', examScheduleSchema);
        var headers = baseService.getHeaders(req);

        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var findQuery = {_id : objectId(req.params.id)}

        if (filter) {
            findQuery.dateBeginAhead = {
                "$gte": new Date(filter.date.value[0]),
                "$lte": new Date(filter.date.value[1])
            }
        }

        Model.findOne(findQuery)
            .populate([{path: 'paperConfig', populate: {path: 'questions'}}, {path: 'config'}])
            .exec(function (err, result) {
                if (err) {
                    callback(err, req, {})
                }
                var obj2 = JSON.parse(JSON.stringify(result));
                dateUtils.formatObjectsDates(obj2, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                    obj2.id = result.id;
                    callback(err, req, obj2)
                });
            });
    }

    function saveQuestions(req, mergedObj, callback) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);
        var quesObjs = mergedObj.paperConfig.questions;
        var questions = [];
        _.forEach(quesObjs, function (val, index) {
            var ques = {};
            ques.qid = objectId(val._id);
            ques.sid = objectId(val.subject);
            questions.push(ques)
            if(index == quesObjs.length -1) {
                Model.update({_id: objectId(mergedObj.id)}, {$set: {questions: questions}}, function (err, result) {
                    callback(err, mergedObj)

                });

            }

        })
    }


    function getQuestions(req, mergedObj, callback) {
        var quesObjs = mergedObj.paperConfig.questions;
        var questions = []
        _.forEach(quesObjs, function (val, index) {
            var ques = {};
            ques.qid = val;
            ques.sid = val.subject;
            questions.push(ques);
            if(index == quesObjs.length -1) {
                mergedObj.questions = questions
                callback(null, mergedObj)

            }
        })
    }



    this.getExamSchedule = function (req, res) {
        var Model = models.get(req.session.lastDb, 'Exam', examSchema);

        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var findQuery = {}
        if (filter) {
            findQuery.dateBeginAhead = {
                "$gte": new Date(filter.date.value[0]),
                "$lte": new Date(filter.date.value[1])
            }
        }

        Model.find(findQuery)
            .populate({path: 'center'}).populate({path: 'course'}).populate({path: 'config'}).populate({path: 'batch'})
            .populate({path: 'paperConfig', populate: {path: 'questions'}})
            .exec(function (err, result) {
                if (err) {
                    events.emit('ErrorJsonResponse', req, res, {message: buildErrResponse(err, message.nsa22006)});
                } else {
                    result = serviceUtils.parseDbObjectAsJSON(result)
                    dateUtils.formatObjectsDates(result, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                        events.emit('JsonResponse', req, res, result);
                    })
                }

            });
    }
    this.getExamScheduleLog = function (req, res) {
        var Model = models.get(req.session.lastDb, 'ExamScheduleLog', examScheduleLogSchema);

        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var findQuery = {scheduleId: objectId(req.params.id)}
        if (filter) {
            findQuery.dateBeginAhead = {
                "$gte": new Date(filter.date.value[0]),
                "$lte": new Date(filter.date.value[1])
            }
        }

        Model.find(findQuery)
            .exec(function (err, result) {
                if (err) {
                    events.emit('ErrorJsonResponse', req, res, {message: buildErrResponse(err, message.nsa22006)});
                } else {
                    result = serviceUtils.parseDbObjectAsJSON(result)
                    dateUtils.formatObjectsDates(result, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                        events.emit('JsonResponse', req, res, result);
                    })
                }

            });
    }

    function getSubjectData(req, callback) {
        var headers = baseService.getHeaders(req);
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query = { $and : [{
            userName: headers.user_id},
            {mexam: objectId(req.params.id)}]
        };

        model.find(query).populate({path: 'mexam'}).populate({path: 'subject'}).exec(function (err, response) {
            callback(err, response)
        })
    }

    function getSubAggregateData(req, callback) {
        var headers = baseService.getHeaders(req);
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query = { $and : [{
            userName : headers.user_id},
            {mexam: objectId(req.params.id)}]
        };
        var student = headers.user_id;
        model.aggregate([
            {
                "$lookup": {
                    "from": "Subject",
                    "localField": "subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {$unwind: {path: '$subject'}},
            {
                $group:
                    {
                        _id: {subjectId: '$subject._id', subject: '$subject', student : '$userName'},
                        totalSkipped: { $sum: "$total_skipped" },
                        totalCorrect: { $sum: "$total_correct" },
                        totalWrong: { $sum: "$total_wrong" },
                        totalMarks: { $sum: "$total_marks" },
                        totalScore : { $sum: "$total_marks_scored" },
                        totalQues: { $sum: "$total_ques" },
                        totalTime: { $sum: parseInt('$total_time')},
                        aggregate_percentage : { $avg: "$aggregate_percentage" }
                    }
            },
            {
                $group:
                    {
                        _id: {subjectId: '$_id.subjectId', subject: '$_id.subject'},
                        item : {$addToSet: {student : '$_id.student', aggregate_percentage: '$aggregate_percentage', totalSkipped: '$totalSkipped', totalCorrect: '$totalCorrect',totalWrong: '$totalWrong',totalMarks: "$totalMarks", totalScore : "$totalScore" , totalQues: "$totalQues", totalTime: '$totalTime' }},
                    }
            },
            {$unwind: {path: '$item'}},
            {"$sort": { "item.aggregate_percentage": -1, "item.totalTime": 1} },
            {
                $group:
                    {
                        _id: {subjectId: '$_id.subjectId', subject: '$_id.subject'},
                        item : {$push: '$item'},
                    }
            },
            {$unwind: {path: '$item', includeArrayIndex: "rank"}},
            {$match: {'item.student' : student}},
            {
                $group:
                    {
                        _id: {subjectId: '$_id.subjectId', subject: '$_id.subject'},
                        item : {$push:{"student" :'$item.student', aggregate_percentage : '$item.aggregate_percentage', totalSkipped: '$item.totalSkipped',totalCorrect: '$item.totalCorrect', totalWrong:'$item.totalWrong', totalMarks: '$item.totalMarks', totalScore: '$item.totalScore', totalQues: '$item.totalQues', rank: { $sum: [ "$rank", 1 ]}}},

                    }
            },
            {$unwind: {path: '$item'}},
            {
                $project: {
                    _id: '$_id.subjectId',
                    subjectName : '$_id.subject.subjectName',
                    subjectColor : '$_id.subject.subjectColor',
                    rank : '$item.rank',
                    percent : '$item.aggregate_percentage',
                    marks : '$item.totalScore'
                }
            }

        ]).exec(function (err, result) {
            callback(err, result)
        });
    }


    function getExamAggregateData(req, callback) {
        var headers = baseService.getHeaders(req);
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        /*var query = { $and : [{
            student: req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid)},
            {mexam: objectId(req.params.id)}]
        };*/
        var query = {};
        if(req.query.subjectId) {
            query = {'subject' : objectId(req.query.subjectId)}
        }
        var student = headers.user_id;
        model.aggregate([
            {$match: query},
            {
                "$lookup": {
                    "from": "ExamScheduleLog",
                    "localField": "mexam",
                    "foreignField": "_id",
                    "as": "exam"
                }
            },
            {$unwind: {path: '$exam'}},
            {
                $group:
                    {
                        _id: {examId: '$exam._id', exam: '$exam', student : '$userName'},
                        totalSkipped: { $sum: "$total_skipped" },
                        totalCorrect: { $sum: "$total_correct" },
                        totalWrong: { $sum: "$total_wrong" },
                        totalMarks: { $sum: "$total_marks" },
                        totalScore : { $sum: "$total_marks_scored" },
                        totalQues: { $sum: "$total_ques" },
                        totalTime: { $sum: parseInt('$total_time')},
                        aggregate_percentage : { $avg: "$aggregate_percentage" }
                    }
            },

            {
                $group:
                    {
                        _id: {examId: '$_id.examId', exam: '$_id.exam'},
                        item : {$addToSet: {student : '$_id.student', aggregate_percentage: '$aggregate_percentage', totalSkipped: '$totalSkipped', totalCorrect: '$totalCorrect',totalWrong: '$totalWrong',totalMarks: "$totalMarks", totalScore : "$totalScore" , totalQues: "$totalQues", totalTime: '$totalTime' }},
                    }
            },
            {$unwind: {path: '$item'}},
            {"$sort": { "item.aggregate_percentage": -1, "item.totalTime": 1} },
            {
                $group:
                    {
                        _id: {examId: '$_id.examId', exam: '$_id.exam'},
                        item : {$push: '$item'},
                    }
            },
            {$unwind: {path: '$item', includeArrayIndex: "rank"}},
            {$match: {'item.student' : student}},
            {
                $group:
                    {
                        _id: {examId: '$_id.examId', exam: '$_id.exam'},
                        item : {$push:{"student" :'$item.student', aggregate_percentage : '$item.aggregate_percentage', totalSkipped: '$item.totalSkipped',totalCorrect: '$item.totalCorrect', totalWrong:'$item.totalWrong', totalMarks: '$item.totalMarks', totalScore: '$item.totalScore', totalQues: '$item.totalQues', rank: { $sum: [ "$rank", 1 ]}}},

                    }
            },
            {$unwind: {path: '$item'}},
            {
                $project: {
                    _id: '$_id.examId',
                    examName : '$_id.exam.name',
                    rank : '$item.rank',
                    percent : '$item.aggregate_percentage',
                    marks : '$item.totalMarks',
                    score : '$item.totalScore'
                }
            }

        ]).exec(function (err, result) {
            callback(err, result)
        });
    }

    function getPerformanceGraph(req, callback) {
        var headers = baseService.getHeaders(req);
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        /*var query = { $and : [{
         student: req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid)},
         {mexam: objectId(req.params.id)}]
         };*/
        var query = {};
        if(req.query.subjectId) {
            query = {'subject' : objectId(req.query.subjectId)}
        }
        var student = headers.user_id;
        model.aggregate([
            {$match: query},
            {
                "$lookup": {
                    "from": "ExamScheduleLog",
                    "localField": "mexam",
                    "foreignField": "_id",
                    "as": "exam"
                }
            },
            {$unwind: {path: '$exam'}},
            {
                $group:
                    {
                        _id: {examId: '$exam._id', exam: '$exam', student : '$userName'},
                        totalSkipped: { $sum: "$total_skipped" },
                        totalCorrect: { $sum: "$total_correct" },
                        totalWrong: { $sum: "$total_wrong" },
                        totalMarks: { $sum: "$total_marks" },
                        totalScore : { $sum: "$total_marks_scored" },
                        totalQues: { $sum: "$total_ques" },
                        aggregate_percentage : { $avg: "$aggregate_percentage" }
                    }
            },

            {
                $group:
                    {
                        _id: {examId: '$_id.examId', exam: '$_id.exam'},
                        item : {$addToSet: {student : '$_id.student', aggregate_percentage: '$aggregate_percentage', totalSkipped: '$totalSkipped', totalCorrect: '$totalCorrect',totalWrong: '$totalWrong',totalMarks: "$totalMarks", totalScore : "$totalScore" , totalQues: "$totalQues" }},
                    }
            },
            {$unwind: {path: '$item'}},
            {"$sort": { "item.aggregate_percentage": 1} },
            {
                $group:
                    {
                        _id: {examId: '$_id.examId', exam: '$_id.exam'},
                        item : {$push: '$item'},
                    }
            },
            {$unwind: {path: '$item', includeArrayIndex: "rank"}},
            {$match: {'item.student' : student}},
            {
                $group:
                    {
                        _id: {examId: '$_id.examId', exam: '$_id.exam'},
                        item : {$push:{"student" :'$item.student', aggregate_percentage : '$item.aggregate_percentage', totalSkipped: '$item.totalSkipped',totalCorrect: '$item.totalCorrect', totalWrong:'$item.totalWrong', totalMarks: '$item.totalMarks', totalScore: '$item.totalScore', totalQues: '$item.totalQues', rank: { $sum: [ "$rank", 1 ]}}},

                    }
            },
            {$unwind: {path: '$item'}},
            {
                $project: {
                    _id: '$_id.examId',
                    examName : '$_id.exam.name',
                    name : '$_id.exam.name',
                    rank : '$item.rank',
                    percent : '$item.aggregate_percentage',
                    marks : '$item.totalMarks',
                    score : '$item.totalScore'
                }
            }

        ]).exec(function (err, result) {
            callback(err, calStrengthAndWeak(result))
        });

    }


    function calStrengthAndWeak(data) {
        var result = {}
        var strength = [];
        var weakness = [];
        var graphData = [];

        const config = {
            num: data.length,
            format: 'object'
        }
        var colors = generateColor.genMaterialColor(config);
        if(!_.isEmpty(data)) {
            _.forEach(JSON.parse(JSON.stringify(data)), function(val, index){
                val.marksObtained = val.score;
                if(val.percent > 75) {
                    strength.push(val);
                } else {
                    weakness.push(val)
                }
                if(val.score > 0) {
                    graphData.push(val)
                }

                if (index == data.length - 1) {
                    result.data = graphData;
                    result.strength = strength;
                    result.weakness = weakness;
                    result.colors = _.flatten([colors]);
                }
            })
        }

        return result;


    }

    function getExamSubData(req, callback) {
        var headers = baseService.getHeaders(req);
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query = {
            userName : headers.user_id };
        var student = headers.user_id;
        model.aggregate([
            {$match: query},
            {
                "$lookup": {
                    "from": "ExamScheduleLog",
                    "localField": "mexam",
                    "foreignField": "_id",
                    "as": "exam"
                }
            },
            {
                "$lookup": {
                    "from": "Subject",
                    "localField": "subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {$unwind: {path: '$exam'}},
            {$unwind: {path: '$subject'}},
            {
                $group:
                    {
                        _id: {subjectId: '$subject._id', subject: '$subject'},
                        item : {$addToSet: {examName : '$exam.name', aggregate_percentage: '$aggregate_percentage', totalSkipped: '$total_skipped', totalCorrect: '$total_correct',totalWrong: '$total_wrong',totalMarks: "$total_marks", totalScore : "$total_marks_scored" , totalQues: "$total_ques" }},
                    }
            },
            {$unwind: {path: '$item'}},
            {
                $group:
                    {
                        _id: {subjectId: '$_id.subject._id', subject: '$_id.subject'},
                        item : {$push: "$item.totalScore"},
                        examName : {$push: "$item.examName"},
                    }
            },
            {
                $project: {
                    _id : '$_id.subjectId',
                    subjectName: '$_id.subject.subjectName',
                    subjectColor: '$_id.subject.subjectColor',
                    values : '$item',
                    examName: '$examName'

                }
            }


        ]).exec(function (err, result) {
            callback(err, result)
        });
    }


    function getAggregateData(req, callback) {
        var headers = baseService.getHeaders(req);
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query = { $and : [{
            userName: headers.user_id},
            {mexam: objectId(req.params.id)}]
        };
        model.aggregate([
            {
                '$match': query
            },
            {
                $group:
                    {
                        _id: '$mexam',
                        totalSkipped: { $sum: "$total_skipped" },
                        totalCorrect: { $sum: "$total_correct" },
                        totalWrong: { $sum: "$total_wrong" },
                        totalMarks: { $sum: "$total_marks" },
                        totalScore : { $sum: "$total_marks_scored" },
                        totalQues: { $sum: "$total_ques" },
                    }
            }
        ]).exec(function (err, result) {
          callback(err, result.length > 0 ? result[0] : {})
        });
    }

    this.getMockReport = function (req, res, next) {

        async.parallel ( {
            subjectList : getSubjectData.bind(null, req),
            aggregateList :getAggregateData.bind(null, req),
            secAvg: getSectionAverage.bind(null, req)
        }, function (err, result) {
            if (err) {
                events.emit('ErrorJsonResponse', req, res, {message: buildErrResponse(err, message.nsa22009)});
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        })

    }

    function getClassAverage(req, data, callback) {
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query =  {mexam: objectId(req.params.id)}
        //var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
        model.aggregate([
            {$match: query},
            {
                "$lookup": {
                    "from": "Subject",
                    "localField": "subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {
                "$lookup": {
                    "from": "ExamScheduleLog",
                    "localField": "mexam",
                    "foreignField": "_id",
                    "as": "schedule"
                }
            },
            {$unwind: {path: '$schedule'}},
            {
                "$lookup": {
                    "from": "StudentExam",
                    let: { topic: '$schedule._id', isSubmit: true},
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { $eq: [ "$examId", "$$topic" ] },
                                        { $eq: [ "$isSubmit", "$$isSubmit" ] }
                                    ]
                                }
                            }
                        }
                    ],
                    "as": "student"
                }
            },
            {$unwind: {path: '$subject'}},
            {
                $project: {
                    schedule : '$schedule',
                    subject : '$subject',
                    student: 1,
                    total_skipped: 1,
                    total_wrong: 1,
                    total_marks: 1,
                    total_correct: 1,
                    total_marks_scored: 1,
                    total_ques: 1,
                    aggregate_percentage: 1,
                    countData: { $size:"$student" },
                    stotalMarks: {$sum: '$total_marks_scored'}
                }
            },
            {$unwind: {path: '$schedule'}},
            {
                $group:
                    {
                        _id: {subjectId: '$subject._id', subject: '$subject'},
                        totalScore : { $sum: "$total_marks_scored" },
                        countData: { $first: '$countData' }
                    }
            }
        ]).exec(function (err, result) {
            data.classScore = JSON.parse(JSON.stringify(result[0])).totalScore;
            data.ccountData = JSON.parse(JSON.stringify(result[0])).countData;
            callback(err, req, data)
        });
    }

    function getASectionAverage(req, callback) {
        var data = {}
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query =  {mexam: objectId(req.params.id)}
        //var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
        model.aggregate([
            {$match: query},
            {
                "$lookup": {
                    "from": "Subject",
                    "localField": "subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {
                "$lookup": {
                    "from": "ExamScheduleLog",
                    "localField": "mexam",
                    "foreignField": "_id",
                    "as": "schedule"
                }
            },
            {$unwind: {path: '$schedule'}},
            {
                "$lookup": {
                    "from": "StudentExam",
                    let: { topic: '$schedule._id', isSubmit: true},
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { $eq: [ "$examId", "$$topic" ] },
                                        { $eq: [ "$isSubmit", "$$isSubmit" ] }
                                    ]
                                }
                            }
                        }
                    ],
                    "as": "student"
                }
            },
            {$unwind: {path: '$subject'}},
            {
                $project: {
                    schedule : '$schedule',
                    subject : '$subject',
                    student: 1,
                    total_skipped: 1,
                    total_wrong: 1,
                    total_marks: 1,
                    total_correct: 1,
                    total_marks_scored: 1,
                    total_ques: 1,
                    aggregate_percentage: 1,
                    countData: { $size:"$student" },
                    stotalMarks: {$sum: '$total_marks_scored'},
                }
            },
            {$unwind: {path: '$schedule'}},
            {
                $group:
                    {
                        _id: {subjectId: '$subject._id', section: '$schedule.section_id', subject: '$subject'},
                        totalScore : { $sum: "$total_marks_scored" },
                        countData: { $first: '$countData' }
                    }
            }
        ]).exec(function (err, result) {
            data.secScore = JSON.parse(JSON.stringify(result[0])).totalScore;
            data.scountData = JSON.parse(JSON.stringify(result[0])).countData;
            callback(err, req, data)
        });
    }

    function getBSectionAverage(req, data, callback) {
        var headers = baseService.getHeaders(req);
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query =  {mexam: objectId(req.params.id)}
        var userName = headers.user_id;
        model.aggregate([
            {$match: query},
            {
                "$lookup": {
                    "from": "Subject",
                    "localField": "subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {
                "$lookup": {
                    "from": "ExamScheduleLog",
                    "localField": "mexam",
                    "foreignField": "_id",
                    "as": "schedule"
                }
            },
            {$unwind: {path: '$subject'}},
            {
                $project: {
                    schedule : '$schedule',
                    subject : '$subject',
                    student: 1,
                    total_skipped: 1,
                    total_wrong: 1,
                    total_marks: 1,
                    total_correct: 1,
                    total_marks_scored: 1,
                    total_ques: 1,
                    total_time: 1,
                    userName: 1,
                    aggregate_percentage: 1,
                }
            },
            {$unwind: {path: '$schedule'}},
            {
                $group:
                    {
                        _id: {subjectId: '$subject._id', subject: '$subject', userName : '$userName'},
                        totalSkipped: { $sum: "$total_skipped" },
                        stotalMarks: {$sum: '$stotalMarks'},
                        totalCorrect: { $sum: "$total_correct" },
                        totalWrong: { $sum: "$total_wrong" },
                        totalMarks: { $sum: "$total_marks" },
                        totalScore : { $sum: "$total_marks_scored" },
                        totalQues: { $sum: "$total_ques" },
                        totalTime: { $sum: parseInt('$total_time')},
                        aggregate_percentage : { $avg: "$aggregate_percentage"},
                    }
            },

            {
                $group:
                    {
                        _id: {subjectId: '$_id.subjectId', subject: '$_id.subject', section: '$_id.section'},
                        item : {$addToSet: {userName : '$_id.userName', aggregate_percentage: '$aggregate_percentage', totalSkipped: '$totalSkipped', totalCorrect: '$totalCorrect',totalWrong: '$totalWrong',totalMarks: "$totalMarks", totalScore : "$totalScore" , totalQues: "$totalQues", countData: '$countData', totalTime: '$totalTime',secAvg: { "$multiply" : [100,{"$divide" : [data.secScore, { "$multiply" : ['$totalMarks',(data.scountData)]}] }]}, classAvg: { "$multiply" : [100,{"$divide" : [data.classScore,  { "$multiply" : ['$totalMarks',(data.scountData)]}] }]}}},
                    }
            },
            {$unwind: {path: '$item'}},
            {"$sort": { "item.aggregate_percentage": -1, "item.totalTime": 1} },
            {
                $group:
                    {
                        _id: {subjectId: '$_id.subjectId', subject: '$_id.subject'},
                        item : {$push: '$item'},
                    }
            },
            {$unwind: {path: '$item', includeArrayIndex: "rank"}},
            {$match: {'item.userName' : userName}},
            {
                $group:
                    {
                        _id: {subjectId: '$_id.subjectId', subject: '$_id.subject', section: '$_id.section'},
                        item : {$push:{"userName" :'$item.userName', aggregate_percentage : '$item.aggregate_percentage', totalSkipped: '$item.totalSkipped',totalCorrect: '$item.totalCorrect', totalWrong:'$item.totalWrong', totalMarks: '$item.totalMarks', totalScore: '$item.totalScore', totalQues: '$item.totalQues', totalTime: '$totalTime', secAvg: '$item.secAvg', classAvg: '$item.classAvg', rank: { $sum: [ "$rank", 1 ]}}},

                    }
            },
            {$unwind: {path: '$item'}},
            {
                $project: {
                    _id: '$_id.subjectId',
                    subjectName : '$_id.subject.subjectName',
                    subjectColor : '$_id.subject.subjectColor',
                    rank : '$item.rank',
                    secAvg: '$item.secAvg',
                    totalTime: '$totalTime',
                    classAvg: '$item.classAvg',
                    percent : '$item.aggregate_percentage',
                    marks : '$item.totalScore'
                }
            }

        ]).exec(function (err, result) {
            callback(err, result)
        });
    }

    function getSectionAverage(req, callback) {
        async.waterfall([
            getASectionAverage.bind(null, req),
            getClassAverage.bind(),
            getBSectionAverage.bind()
        ], function(err, result){
            callback(err, result)
        })

    }

    this.getMockAggReport = function (req, res, next) {

        async.parallel ( {
            perform: getPerformanceGraph.bind(null, req),
            aggregateList :getSubAggregateData.bind(null, req),
            examList : getExamAggregateData.bind(null, req),
            graph: getExamSubData.bind(null, req),

        }, function (err, result) {
            if (err) {
                logger.debugLog(req,'Unable to get school details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
            } else {
                var val = {
                    "subjectName" : 'Overall',
                    "subjectColor" : '#FF5733',
                    "_id" : null,
                }
                result.subjectList = JSON.parse(JSON.stringify(result.aggregateList));
                val.rank = result.examList ? _.meanBy(result.examList, function (o) { return +o.rank; }) : 0;
                val.percent =  result.examList ? _.meanBy(result.examList, function (o) { return +o.percent; }) : 0;
                val.marks =  result.examList ? _.meanBy(result.examList, function (o) { return +o.totalScore; }) : 0;
                result.aggregateList.push(val);
                events.emit('JsonResponse', req, res, result);
            }
        })
    }

    this.getMockSubjectReport = function (req, res, next) {
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        function getSubjectList(req, callback) {
            var headers = baseService.getHeaders(req);
            var query = {userName: headers.user_id};
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
        })

    }


    this.getExamList = function (req, res, next) {
        var model = models.get(req.session.lastDb, "SubjectTopics", subjectTopicsSchema);
        var matchQuery = {$and: [{"subject": objectId(req.body.subject)},{"classDetail": objectId(req.body.classDetail)},{"title": objectId(req.body.title)}]}
        model.aggregate([
            {
                '$match': matchQuery
            },
            {$unwind: {path: "$topics"}},
            {$match: {'topics._id': objectId(req.body.topicId)}},
            {
                "$lookup": {
                    "from": "Sheet",
                    let: { topic: '$topics._id', classDetail: objectId(req.body.classDetail) , subject: objectId(req.body.subject), title: objectId(req.body.title)},
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { "$in": ["$$topic", "$topic"] },
                                        { "$in": ["$$subject", "$subject"] },
                                        { $eq: [ "$classDetail", "$$classDetail" ] },
                                        { $eq: [ "$title", "$$title" ] }
                                    ]
                                }
                            }
                        }
                    ],
                    "as": "sheet"
                }
            },
            {$unwind: {path: "$sheet"}},
            {
                $project: {
                    "sheet": "$sheet",
                    "questions":"$sheet.questions",
                }
            },
            {$unwind: {path: "$questions"}},
            {
                "$lookup": {
                    "from": "Question",
                    "localField": "questions",
                    "foreignField": "_id",
                    "as": "question"
                }
            },
            {$unwind: {path: "$question"}},
            { "$group": {
                "_id": {id: "$_id", "sheet": '$sheet'},
                "questions": { "$push": "$question" }
            }},
            {
                $project: {
                    "sheet": "$_id.sheet",
                    "questions":"$questions",
                }
            },
            {
                "$lookup": {
                    "from": "ExamSchedule",
                    "localField": "sheet._id",
                    "foreignField": "paperConfig",
                    "as": "ExamSchedule"
                }
            },
            {$unwind: {path: "$ExamSchedule"}},

            {
                "$lookup": {
                    "from": "ExamConfig",
                    "localField": "ExamSchedule.config",
                    "foreignField": "_id",
                    "as": "config"
                }
            },
            {$unwind: {path: "$config"}},
            {
                $project: {
                    "examList": "$ExamSchedule",
                    "sheet":"$sheet",
                    "config": '$config',
                    "questions": '$questions'
                }
            }
        ]).exec(function (err, result) {
            if (err) {
                events.emit('ErrorJsonResponse', req, res, {message: buildErrResponse(err, message.nsa22009)});
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });

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

    this.getStudentExam = function (req, res, next) {
        async.parallel ( {
            mockExam : getScheduledExamsForStudents.bind(null, req),
            //practiceExam : getPracticeExam.bind(null,req)
            //aggregateList :getAggregateData.bind(null, req)
        }, function (err, result) {
            if (err) {
                logger.debugLog(req,'Unable to get school details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        })
    }

    this.getExam = function (req, res, next) {
        var headers = baseService.getHeaders(req);
        if(headers.user_id != null) {
            getScheduledExamForStudents(req, function (err, result) {
                if (err) {
                    logger.debugLog(req,'Unable to get school details ', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            });
        } else {
            var Model = models.get(req.session.lastDb, 'ExamSchedule', examScheduleSchema);
            var queryParams = req.query;
            var filterObj = req.query.filter;
            var matchQuery = {}
            if(req.query.mode) {
                matchQuery = {'examMode' : (req.query.mode == true || req.query.mode == "true") ? true : false}
            }
            var filter = queryParams.filter || {};
            var contentType = queryParams.contentType || 'VExamSchedule';
            var data = req.query;
            var paginationObject = pageHelper(data);
            var limit = paginationObject.limit;
            var skip = paginationObject.skip;
            var matchObj = {};
            var queryObject = {};
            queryObject.$and = [];
            var optionsObject = {};

            if (filter && typeof filter === 'object') {
                optionsObject = filterMapper.mapFilter(filter, {
                    contentType: contentType
                });
            }
            if(optionsObject) {
                queryObject.$and.push(optionsObject);
            }

            Model.aggregate([
                {
                    '$match': matchQuery
                },
                /*{
                    "$lookup": {
                        "from": "Center",
                        "localField": "center",
                        "foreignField": "_id",
                        "as": "center"
                    }
                },
                {
                    "$lookup": {
                        "from": "Course",
                        "localField": "course",
                        "foreignField": "_id",
                        "as": "course"
                    }
                },
                {
                    "$lookup": {
                        "from": "Batch",
                        "localField": "batch",
                        "foreignField": "_id",
                        "as": "batch"
                    }
                },*/
                {
                    "$lookup": {
                        "from": "ExamConfig",
                        "localField": "config",
                        "foreignField": "_id",
                        "as": "config"
                    }
                },
                {
                    "$lookup": {
                        "from": "section",
                        "localField": "section",
                        "foreignField": "_id",
                        "as": "section"
                    }
                },
                {
                    "$lookup": {
                        "from": "ExamScheduleLog",
                        "localField": "_id",
                        "foreignField": "scheduleId",
                        "as": "log"
                    }
                },
                {
                    $unwind:  {path: "$section", preserveNullAndEmptyArrays: true}
                },
                {
                    "$lookup": {
                        "from": "Sheet",
                        "localField": "paperConfig",
                        "foreignField": "_id",
                        "as": "paperConfig"
                    }
                },
                /*{
                    "$lookup": {
                        "from": "Student",
                        "localField": "student",
                        "foreignField": "_id",
                        "as": "student"
                    }
                },*/
                {
                    $match: matchObj
                },
                //{$unwind: {path: "$course", preserveNullAndEmptyArrays: true}},
                {$unwind: {path: "$config",  preserveNullAndEmptyArrays: true}},
                {$unwind: {path: "$paperConfig",  preserveNullAndEmptyArrays: true}},
               // {$unwind: {path: "$student"}},
                {
                    "$match": queryObject
                }, /*{
                    "$lookup": {
                        "from": "Center",
                        "localField": "student.center",
                        "foreignField": "_id",
                        "as": "studentCenter"
                    }
                },
                {$unwind: {path: "$studentCenter"}},*/
                {
                    $group: {
                        _id: "$_id",
                        name: {$first: "$name"},
                        dateBeginAhead: {$first: "$dateBeginAhead"},
                        dateEnd: {$first: "$dateEnd"},
                        examMode: {$first: "$examMode"},
                        section: {$first: "$section"},
                        configPaper: {$addToSet: {paperConfigs:"$paperConfig"} },
                        config: {$first: "$config"},
                        paperConfig: {$first: "$paperConfig"},
                        description :{$first : "$description"},
                        log: {$first: '$log'}
                        //student: {$addToSet: { "_id":"$student", "studentCenter": "$studentCenter" ,"score": "$score", "isSubmit": "$isSubmit", "examMode": "$examMode", "isCorrected": "$isCorrected"}}
                    }
                },
                {$unwind: {path: "$configPaper",  preserveNullAndEmptyArrays: true}},
            ]).exec(function (err, result) {
                if (err) {
                    logger.debugLog(req,'Unable to get school details ', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
                } else {
                    result = serviceUtils.parseDbObjectAsJSON(result)
                    dateUtils.formatObjectsDates(result, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                        events.emit('JsonResponse', req, res, result);
                    })
                }
            });
        }
    };

    function convertQuestionObj(result, next) {
        result = JSON.parse(JSON.stringify(result))
        if(!_.isEmpty(result)) {
            _.forEach(result, function (value, index) {
                var paperQuestions = value.examId.paperConfig.questions;
                var answeredQuestions = value.questions;
                _.forEach(paperQuestions, function (p, key) {
                    var ans = p.form[0].ans;
                    var answerQuestions = _.find(answeredQuestions, {qid: p._id});
                    _.forEach(ans, function (val) {
                        if(answerQuestions && val._id === answerQuestions.userAns) {
                            val.userAns = true;
                        } else {
                            val.userAns = false;
                        }
                    });

                });

                if(index == (result.length -1)) {
                    next(null, result);
                }
            });
        }

    }


    /*function getPracticeExam(req, callback) {
        var Model = models.get(req.session.lastDb, 'StudentPractice', practiceStudentSchema);

        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var findQuery = {"student": objectId(req.session.lid)};
        queryParams.submit = queryParams.submit ? (queryParams.submit == 'true' ? true : false ) : false;
        if(queryParams.submit) {
            findQuery.isSubmit = true;
        }
        if (filter) {
            findQuery.dateBeginAhead = {
                "$gte": new Date(filter.date.value[0]),
                "$lte": new Date(filter.date.value[1])
            }
        }

        Model.find(findQuery)
            .populate({path: 'pexamId', populate: [{path: 'course'} , {path: 'batch'}, {path: 'questions'}]})
            .populate({path: 'questions.qid'})
            .exec(function (err, result) {
                /!*if (err) {
                 return next(err);
                 }*!/
                var resObj = []
                if(!_.isEmpty(result)) {
                    _.forEach(result, function (val, index) {
                        var id = val._id;
                        if(val.pexamId) {
                            var obj1 = JSON.parse(JSON.stringify(val));
                            var obj2 = JSON.parse(JSON.stringify(val.pexamId));
                            var mergedObj = _.merge(obj1, obj2);
                            dateUtils.formatObjectsDates(mergedObj, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                                mergedObj.id = id;
                                resObj.push(mergedObj);
                            });
                        }
                        if(index == result.length - 1) {
                            callback(err, resObj)
                            //res.status(200).send({data: resObj});
                        }

                    })
                } else {
                    callback(err, resObj)
                    //res.status(200).send({data: resObj});
                }




            });
    }*/

    function getScheduledExamsForStudents(req, callback) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);
        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var headers = baseService.getHeaders(req);
        var findQuery = {userName: headers.user_id};
        queryParams.submit = queryParams.submit ? (queryParams.submit == 'true' ? true : false ) : false;
        if(queryParams.submit) {
            findQuery.isSubmit = true;
        }
        if (filter) {
            findQuery.dateBeginAhead = {
                "$gte": new Date(filter.date.value[0]),
                "$lte": new Date(filter.date.value[1])
            }
        }

        Model.find(findQuery)
            .populate({path: 'examId', populate: [{path: 'paperConfig', populate: [{path: 'questions'}, {path: 'subject'}]}, {path: 'config'}]})
            .populate({path: 'questions.qid'})
            .exec(function (err, result) {
                /*if (err) {
                    return next(err);
                }*/
                var resObj = []
                if(!_.isEmpty(result)) {
                    _.forEach(result, function (val, index) {
                        var id = val._id;
                        if(val.examId) {
                            var obj1 = JSON.parse(JSON.stringify(val));
                            var obj2 = JSON.parse(JSON.stringify(val.examId));
                            var mergedObj = _.merge(obj1, obj2);
                            dateUtils.formatObjectsDates(mergedObj, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                                mergedObj.id = id;
                                resObj.push(mergedObj);
                            });
                        }
                        if(index == result.length - 1) {
                            callback(err, resObj)
                            //res.status(200).send({data: resObj});
                        }

                    })
                } else {
                    callback(err, resObj)
                    //res.status(200).send({data: resObj});
                }




        });

    };


    function getScheduledExamForStudents(req, callback) {
        var Model = models.get(req.session.lastDb, 'ExamScheduleLog', examScheduleLogSchema);
        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var headers = baseService.getHeaders(req);
        var findQuery = {$and: [{class_id: req.query.class_id}, {section_id: req.query.section_id}, {tenant_id: headers.tenant_id}, {school_id: headers.school_id}]};
        var matchQuery = {userName: headers.user_id};
        /*queryParams.submit = queryParams.submit ? (queryParams.submit == 'true' ? true : false ) : false;
        if(queryParams.submit) {
            findQuery.isSubmit = true;
        }*/
        console.log("findQuery", findQuery)
        if (filter) {
            findQuery.dateBeginAhead = {
                "$gte": new Date(filter.date.value[0]),
                "$lte": new Date(filter.date.value[1])
            }
        }

        Model.aggregate([
            {$match: findQuery},
            {
                "$lookup": {
                    "from": "Sheet",
                    "localField": "paperConfig",
                    "foreignField": "_id",
                    "as": "paperConfig"
                }
            },
            {
                "$lookup": {
                    "from": "ExamConfig",
                    "localField": "config",
                    "foreignField": "_id",
                    "as": "config"
                }
            },
            {$unwind: {path: '$config'}},
            {$unwind: {path: '$paperConfig'}},
            {
                "$lookup": {
                    "from": "StudentExam",
                    "localField": "_id",
                    "foreignField": "examId",
                    "as": "studentExam"
                }
            },
            {
                $project: {
                    paperConfig: '$paperConfig',
                    config: '$config',
                    dateBeginAhead: 1,
                    dateEnd: 1,
                    name: 1,
                    studentExam: '$studentExam',
                    examMode: 1,
                    /*isSubmit: {
                        $filter: {
                            input: "$studentExam",
                            as: "item",
                            cond: { $gte: [ "$$item.price", 100 ] }
                        }
                    },
                    isSubmit: {
                        $cond: {if: {$eq: ["$studentExam", null]}, then: '$studentExam.isSubmit', else: false}
                    },*/
                }
            }

        ]).exec(function (err, result) {
            console.log("result", result)
            if(!_.isEmpty(result)) {
                result = JSON.parse(JSON.stringify(result));
                _.forEach(result, function (val) {
                    if(val.studentExam != null) {
                        var studentObj = _.filter(val.studentExam, {userName: headers.user_id});
                        val.isSubmit = studentObj.length > 0 ? studentObj[0].isSubmit : false;
                    } else {
                        val.isSubmit = false;
                    }

                    delete val.studentExam;
                })

                dateUtils.formatObjectsDates(result, ['dateBeginAhead', 'dateEnd'], 'type2', function (err, data) {
                    callback(err, result)
                });
            } else {
                callback(err, [])
            }
        });

       /* Model.find(findQuery)
            .populate({path: 'examId', populate: [{path: 'paperConfig', populate: [{path: 'questions'}, {path: 'subject'}]}, {path: 'config'}]})
            .populate({path: 'questions.qid'})
            .exec(function (err, result) {
                var resObj = []
                if(!_.isEmpty(result)) {
                    _.forEach(result, function (val, index) {
                        var id = val._id;
                        if(val.examId) {
                            var obj1 = JSON.parse(JSON.stringify(val));
                            var obj2 = JSON.parse(JSON.stringify(val.examId));
                            var mergedObj = _.merge(obj1, obj2);
                            dateUtils.formatObjectsDates(mergedObj, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                                mergedObj.id = id;
                                resObj.push(mergedObj);
                            });
                        }
                        if(index == result.length - 1) {
                            callback(err, resObj)
                            //res.status(200).send({data: resObj});
                        }

                    })
                } else {
                    callback(err, resObj)
                    //res.status(200).send({data: resObj});
                }




            });
*/
    };

    /*this.getExamInfoById = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Exam', examSchema);

        Model.findById(req.params._id)
            .populate('config','name dateEnd dateBegin dateBeginAhead canReview ipPattern')
            .populate('student','name code')
            .exec(function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(200).send('Specified papers do not exist，id=' + req.params._id);
                }

                var ip = utils.getClientIP (req);
                // Calculate the status of the exam
                var now = new Date ();
                // The state of the exam is only three, did not start, the exam, has ended, respectively, according to the current time is before the start time and the end time to decide
                if (user.config.dateEnd < now) {
                    user._doc.config._doc.status = 'ended';
                }
                else {// The starting time needs to consider the number of minutes in advance
                    if (now < user.config.dateBeginAhead) {
                        user._doc.config._doc.status = 'Not started';
                    }
                    else {
                        user._doc.config._doc.status = 'in the exam';
                    }
                }

                /!** to see if you have permission to view the papers, to prevent users from entering the URL to get the contents of the papers
                 * 1. Except that the administrator has the authority to view the test papers, others can only view their papers
                 * 2. When exam papers must be the exam has ended, and the exam is set to rewound state
                 * 3. The examination must still be in progress
                 * 4. In all other cases, an error message is returned.
                 *!/

                if (true) {
                    /!*if (req.decoded._id != user.tester._id)
                     return res.send ({message: 'not allowed to view other papers'});*!/
                    if (req.body.type === 'view') {
                        if (! user.config._doc.canReview) {
                            return res.status(200).send({message: 'The test is not open rewinding feature'});
                        } else if (user._doc.config._doc.status !== 'ended') {
                            return res.status(200).send({message: 'View papers only after exams'});
                        }
                    } else if (req.body.type === 'test') {
                        if (user._doc.config._doc.status !== 'in the exam') {
                            return res.status(200).send({message: 'The current test status is not allowed to take the exam [status =' + user._doc.config._doc.status + ']'});
                        }
                        /!** papers only allowed to open once, more than the second open, an error message is displayed *!/
                        if(user.isRead) {
                            return res.status(200).send({message: 'This set of papers has been answered by others, can not be repeated answer [' + user.readIP + ',' + user.dateRead + ']'});
                        }
                        /!** papers have been submitted can not be the second answer *!/
                        if (user.isSubmit) {
                            return res.status(200).send({message: 'This set of papers has been submitted and can not be answered again [' + user.submitIP + ',' + user.dateSubmit + ']'});
                        }
                        /!** ip check *!/
                        // var pattern = user._doc.config._doc.ipPatternB;
                        /!*if(pattern){

                         if (! utils.parseIP (ip, new RegExp (pattern, 'g')))
                         return res.send ({message: 'Illegal IP:' + ip + '[' + user._doc.config._doc.ipPattern + ']'});
                         }*!/
                    } else {
                        return res.status(200).send({message: 'Unsupported paper access pattern:' + JSON.stringify (req.body)});
                    }
                }

                if (req.body.type === 'test') {
                    /!** If it is an exam, the sign has been obtained the sign of the test paper, multiple answers are forbidden *!/
                    Model.update({_id: req.params._id}, {
                        $set: {
                            isRead: true, readIP: ip, dateRead: new Date()
                        }
                    }).exec(function(err, result){
                        return res.status(200).send({data:user,success:true});
                    });
                } else {
                    return res.status(200).send({data:user,success:true});
                }
            });

    };*/

    this.createExam = function (req, res, next) {
        var notify = {}
        notify.sms = true;
        req.body.notify = notify;
        req.body.status = true;
        createExamSchedule(req, {}, function (err, req, result) {
            if(err) {
                return next(err);
            } else {
                return res.status(200).send({success:true});
            }
        });
    };

    function constructUsers(req, data, callback) {
        var arr = [];
        var body = req.body;
        var msgdata = {}
        async.each(body.users, function (data, cb) {
            var obj = {};
            obj.to = data.studentPhone;
            obj.message = body.name + ' exam has been scheduled on' + body.dateBeginAhead;
            arr.push(obj);
            cb(null, arr);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
        });
        data.smsObj = {sender: 'NXTECH', sms: arr};
        callback(null, req, data);
    }

    function createExamSchedule(req, resp, next){
        async.waterfall([
            createExamSche.bind(null, req),
            //saveExamStudent.bind()
        ], function (err, req, result) {
            next(err, req, result)
        })
    }

    function updateExamSchedule(req, resp, next){
        req.body.status = false;
        async.waterfall([
            //createExamSche.bind(null, req),
            createExamScheLog.bind(null, req),
            saveExamStudent.bind()
        ], function (err, req, result) {
            if(req.body.status) {
                var data = {};
                async.waterfall([
                    constructUsers.bind(null, req, data),
                    notification.sendNotification.bind(),
                    notification.saveNotificationInfo.bind()
                ], function (err, result, data) {
                    next(err, req, result);
                });
            } else {
                next(err, req, result);
            }
        })
    }

    function saveQuestionMetrics(req, data, callback){
        var Model = models.get(req.session.lastDb, 'QuestionMetrics', questionMetrics);
        var bulk = Model.collection.initializeOrderedBulkOp();
        var body = req.body;
        var ids = [];
        _.forEach(data.questions, function(val){
            ids.push(objectId(val.qid._id));
        })

        Model.find({qid: { $in: ids }}).exec(function(err, result) {
            if(err) {
                callback(err, req, null);
            } else {
                if(!_.isEmpty(data.questions)) {
                    async.each(data.questions, function (value, cb) {
                       var dataObj =  _.filter(JSON.parse(JSON.stringify(result)), {qid: (value.qid._id).toString()});
                       if(dataObj.length > 0 ) {
                           bulk.find( { _id: objectId(dataObj[0]._id)} ).update( { $set: {
                               total_skipped: dataObj[0].total_skipped + (value.skipped ? 1: 0),
                               total_correct: dataObj[0].total_correct + (value.correct ? 1: 0),
                               total_wrong: dataObj[0].total_wrong + (value.wrong ? 1: 0)} } )
                       } else {
                           bulk.insert({
                               qid: objectId(value.qid._id),
                               total_skipped: value.skipped ? 1: 0,
                               total_correct: value.correct ? 1 : 0,
                               total_wrong: value.wrong ? 1 : 0,
                           })
                       }

                        cb(null, bulk);
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }
                        bulk.execute(function (err, result) {
                            callback(err, req, result);
                        });
                    });
                } else {
                    callback(err, req, []);
                }
            }
        });
    };

    function saveExamStudent(req, schedule, callback){
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);
        var bulk = Model.collection.initializeOrderedBulkOp();
        var body = req.body;

        getStudentsByCCB(req, function (err, data) {
            if(err) {
                callback(err, req, null);
            } else {
                if(!_.isEmpty(data)) {
                    req.body.users = data;
                    async.each(data, function (value, cb) {
                        bulk.insert({
                            examId: schedule._id,
                            dateBeginAhead: new Date(body.dateBeginAhead),
                            //student: objectId(value._id),
                            userName: value.userName,
                            firstName: value.firstName,
                            school_id: value.schoolId,
                            tenant_id: value.tenantId,
                            examMode: body.examMode,
                            score: 0,
                            isCorrected: false,
                            isSubmit: false
                        })
                        cb(null, bulk);
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }
                        bulk.execute(function (err, result) {
                            callback(err, req, result);
                        });
                    });
                } else {
                    callback(err, req, []);
                }
            }
        });
    };

    function getStudentsByCCB(req, cb) {
        var searchParams = nsabb.getUsersByClassSectionsIdQueryParam(req);
        nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
            cb(err, data)
        })
    }

    function createExamSche(req, callback) {
        var ExamScheduleModel = models.get(req.session.lastDb, 'ExamSchedule', examScheduleSchema);
        var body = req.body;
        /*var arr =  body.batches.map(i => objectId(i));
        var center =  body.center.map(i => objectId(i));
        var course = _.isArray(body.course) ?   body.course.map(i => objectId(i)) : body.course ? objectId(body.course) : null;*/
        var section =  objectId(body.section)
        var dataObj = {
            name: body.name,
            dateGenerated: Date.now(),
            dateBeginAhead: new Date(body.dateBeginAhead),
            dateEnd: new Date(body.dateEnd),
           /* center: center,
            course: course,
            batch: arr,*/
            config: objectId(body.config),
            paperConfig: objectId(body.paperConfig),
            examMode: body.examMode,
            //description: body.description,
            section       : section
        };

        if(req.params.examId) {
            dataObj._id = objectId(req.params.examId)
        }
        var ExamSchedule = new ExamScheduleModel(dataObj);

        ExamSchedule.save(function (err, schedule) {
            callback(err, req, schedule)
        });

    }

    function createExamScheLog(req, callback) {
        var ExamScheduleLogModel = models.get(req.session.lastDb, 'ExamScheduleLog', examScheduleLogSchema);
        var body = req.body;
        var section =  objectId(body.section)
        var classId =  objectId(body.classDetail);
        var headers = baseService.getHeaders(req);

        var dataObj = {
            name: body.name,
            dateGenerated: Date.now(),
            dateBeginAhead: new Date(body.dateBeginAhead),
            dateEnd: new Date(body.dateEnd),
            config: objectId(body.config),
            paperConfig: objectId(body.paperConfig),
            examMode: body.examMode,
            description: body.description,
            section: section,
            classDetail: classId,
            class_id: body.class_id,
            school_id: headers.school_id,
            tenant_id: headers.tenant_id,
            section_id: body.section_id,
            academic_year: headers.academic_year,
            section_name: body.section_name,
            scheduleId: req.params.examId
        };
        var ExamScheduleLog = new ExamScheduleLogModel(dataObj);

        ExamScheduleLog.save(function (err, schedule) {
            callback(err, req, schedule)
        });

    }

    this.updateExamSchedule = function (req, res, next) {
        var headers = baseService.getHeaders(req);
        var Model = models.get(req.session.lastDb, 'ExamScheduleLog', examScheduleLogSchema);

        Model.find({
            scheduleId: objectId(req.params.examId),
            section_id: req.body.section_id,
            class_id  : req.body.class_id,
            school_id : headers.school_id,
            tenant_id : headers.tenant_id
        }, function (err, result) {
            if(_.isEmpty(result)) {
                async.waterfall([
                    // deleteExamByExamID.bind(null, req),
                    deleteSExamByExamID.bind(null, req),
                    updateExamSchedule.bind()
                ], function(err, req, result) {
                    if (err) {
                        events.emit('ErrorJsonResponse', req, res, {message: buildErrResponse(err, message.nsa22007)});
                    } else {
                        events.emit('JsonResponse', req, res, {message: "created Sucessfully"});
                    }
                });
            } else {
                var result = {}
                result.message = 'Already Scheduled For this Section';
                events.emit('ErrorJsonResponse', req, res, {message: buildErrResponse(result, "Already Scheduled For this Section")});
            }

        });

    };

        this.updateStudentExamPaper = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);
        var body = req.body;
        if(body && body.qid != "") {
            var oqid = objectId(body.qid);
            var oaid = body.userAns != '' ? objectId(body.userAns) : null;
            var obj =  {qid: oqid, userAns: oaid, correct: false, wrong: false, skipped: false, sid: objectId(body.sid)};
            if(!oaid) {
                obj.skipped = true;
            } else if(body.aid == body.userAns) {
                obj.correct = true;
            } else {
                obj.wrong = true;
            }
            obj.attempted_time = body.attempted_time ? +body.attempted_time : 2;

            Model.find({"_id": objectId(req.params._id), "questions.qid": oqid}, function (err, result) {
                if(err) {
                    return next(err);
                } else if(_.isEmpty(result)) {
                    Model.update({_id: objectId(req.params._id)}, {$push: {questions: obj}}, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send({success: true, data: result});

                    });
                } else {
                    var updObj = {"questions.$.userAns": oaid, "questions.$.correct": obj.correct, "questions.$.skipped": obj.skipped, "questions.$.wrong": obj.wrong, "questions.$.attempted_time": obj.attempted_time, "questions.$.sid": obj.sid}
                    Model.update({"_id": objectId(req.params._id), "questions.qid": oqid}, {$set: updObj},
                        function (err, result) {
                            if (err) {
                                return next(err);
                            }
                            res.status(200).send({success: true, data: result});

                        });
                }
            });
        } else {
            res.status(200).send({success: true, data: 'no data found'});
        }

    };

    this.getStudentResult = function (req, res, next) {
        async.waterfall([
            updateExamById.bind(null, req),
            saveSubjectMertrics.bind(),
            saveQuestionMetrics.bind()
        ], function (err, req, result) {
            if (err) {
                events.emit('ErrorJsonResponse', req, res, {message: buildErrResponse(err, message.nsa22008)});
            } else {
                events.emit('JsonResponse', req, res, result.finalScore);
            }
        })

    };


    this.deleteStudentResult = function (req, res, next) {
        async.waterfall([
            deleteStudenrExam.bind(null, req),
            deleteSubjectMetrics.bind(),
        ], function (err, req, result) {
            if (err) {
                events.emit('ErrorJsonResponse', req, res, {message: buildErrResponse(err, message.nsa22008)});
            } else {
                events.emit('JsonResponse', req, res, {message: "Exam Aborted"});
            }
        })

    };


    function deleteStudenrExam(req, callback) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);
        Model.remove({_id: objectId(req.params._id)}, function (err, result) {
            callback(err, req, result);
        })
    }

    function deleteSubjectMetrics(req, data, cb) {
        var headers = baseService.getHeaders(req);
        var Model = models.get(req.session.lastDb, 'SubjectMetrics', subjectMetricsSchema);
        Model.remove({"mexam": objectId(req.params.examId), userName: headers.user_id}, function (err, result) {
            cb(err, req, result);
        })
    }


    function updateExamById(req, callback) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);
        Model.find({"_id": objectId(req.params._id)}).populate({path: 'examId', populate: {'path': 'config'}}).populate({path: 'questions.qid'}).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            var data = result[0];
            var updateOptions = {};
            updateOptions.isSubmit = true;
            updateOptions.dateSubmit = new Date();
            updateOptions.submitIP = utils.getClientIP(req);
            if (data.examId.config.autoCorrect) {
                updateOptions.score = getScore(JSON.parse(JSON.stringify(data)));
                updateOptions.isCorrected = true;
                updateOptions.dateCorrect = new Date();
            }
            data.finalScore = updateOptions.score;
            Model.update({"_id": objectId(req.params._id)}, updateOptions, function (err, result) {
                /*if(err) {
                    return next(err);
                } else {
                    res.status(200).send({success: true, data: updateOptions.score});
                }*/
                callback(err, req, data)
            });
        });
    }

    function saveSubjectMertrics(req, data, callback) {
        var headers = baseService.getHeaders(req);
        var Model = models.get(req.session.lastDb, 'SubjectMetrics', subjectMetricsSchema);
        var bulk = Model.collection.initializeOrderedBulkOp();
        Model.remove({"mexam": objectId(data.examId._id), userName: headers.user_id}, function (err, result) {
            if(err) {
                callback(err, req, []);
            } else {
                getSubMeObj(req, data, function (err, result) {
                    if(err) {
                        callback(err, req, null);
                    } else {
                        if(!_.isEmpty(result)) {
                            async.each(result, function (value, cb) {
                                bulk.insert(value)
                                cb(null, bulk);
                            }, function (err) {
                                if (err) {
                                    return next(err);
                                }
                                bulk.execute(function (err, result) {
                                    callback(err, req, data);
                                });
                            });
                        } else {
                            callback(err, req, []);
                        }
                    }
                });
            }
        })


    }

    function getScore(data) {
        var score = 0;
        _.forEach(data.questions, function(value, key){
            var qid = value.qid;
            if(qid !== '' && !_.isEmpty(qid)) {
                var ans = qid.form[0].ans;
                var findAns = _.filter(ans, 'isValid');
                var correctAns = _.isEmpty(findAns) ? null : findAns[0];
                if(!_.isEmpty(correctAns)) {
                    if(value.userAns == correctAns._id) {
                        score += (data.examId.config.questionMark) ? data.examId.config.questionMark : qid.point;
                    } else {
                        score -= (data.examId.config.negativeMark) ? data.examId.config.negativeMark : 0;
                    }
                }
            }
        })
        return score;
    };

    function getSubMeObj(req, data, callback) {
        var headers = baseService.getHeaders(req)
        var dataObj = _.groupBy(data.questions, 'sid');
        var subObjs = [];
        try {
            _.map(dataObj, function (val, key) {
                var subObj = {};
                var total_skipped = 0;
                var total_correct = 0;
                var total_wrong = 0;
                var total_marks_scored = 0;
                var total_marks = 0;
                var total_ques = 0;
                var total_time = 0;
                _.forEach(val, function(value, index){
                    var qid = value.qid;
                    total_skipped = value.skipped ? (total_skipped + 1) : total_skipped;
                    total_wrong = value.wrong ? (total_wrong + 1) : total_wrong;
                    total_correct = value.correct ? (total_correct + 1) : total_correct;
                    total_ques = val.length;
                    total_time += value.attempted_time ? +value.attempted_time : 0;

                    if(qid !== '' && !_.isEmpty(qid)) {
                        var ans = qid.form[0].ans;
                        var findAns = _.filter(ans, 'isValid');
                        var correctAns = _.isEmpty(findAns) ? null : findAns[0];
                        total_marks += (data.examId.config.questionMark) ? data.examId.config.questionMark : qid.point;
                        if(!_.isEmpty(correctAns) && value.userAns) {
                            if((value.userAns).toString() == (correctAns._id).toString()) {
                                total_marks_scored += (data.examId.config.questionMark) ? data.examId.config.questionMark : qid.point;
                            } else if(value.userAns && value.userAns != ''){
                                total_marks_scored -= (data.examId.config.negativeMark) ? data.examId.config.negativeMark : 0;
                            }
                        }
                    }

                    if(index == val.length -1) {
                        subObj.total_skipped = total_skipped;
                        subObj.total_wrong  = total_wrong;
                        subObj.total_correct = total_correct;
                        subObj.total_ques = total_ques;
                        subObj.userName = headers.user_id;
                        subObj.total_marks = total_marks;
                        subObj.total_marks_scored = total_marks_scored;
                        subObj.total_time = (total_time).toString();
                        subObj.aggregate_percentage = ((total_marks_scored/total_marks) * 100);
                        subObj.mexam = data.examId._id ? data.examId._id : null;
                        subObj.student = data.student ? (data.student) : null;
                        subObj.subject = key ? objectId(key) : null;
                        subObjs.push(subObj);
                    }
                })

            })
            callback(null, subObjs)
        } catch (err) {
            callback(err, null)
        }


    }

    /*this.updateExam = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Exam', examSchema);

        var autoCorrect = false;

        // opType operation type, if it is correct, that the manual batch or re-batch action
        var opType = req.body.opType;

        Promise.resolve()
            .then(function(){
                if (opType === 'correct') {
                    return Promise.resolve();
                }
                if (req.body.hasOwnProperty('ansSubmit')) {
                    return Promise.resolve();
                }
                return Promise.reject('No papers can be submitted');
            })
            .then(function(){
                if (opType === 'correct') {
                    return Promise.resolve();
                }

                // The first step is to check whether the test papers need automatic judgment
                return Model.findById(req.params._id)
                    .select('tester config')
                    .populate('config', 'autoCorrect');
            })
            .then(function(data){
                if(opType === 'correct') {
                    autoCorrect = true;
                    return Model.findById(req.params._id)
                        .populate('ansExpect.qid', 'point type');
                }
                // check legality
                if(req.session.userType === 'Student') {
                    autoCorrect = data.config.autoCorrect;
                    // if (autoCorrect)
                    // // According to the need for automatic verdict to complete a different retrieval tasks
                    // return Exam.findById (req.params._id)
                    // .populate ('ansExpect.qid', 'point type');
                    // else
                    // Automatic marking can be conducted directly in the Exam, without association
                    return Model.findById(req.params._id);
                } else {
                    return Promise.reject('Students can only submit their own papers');
                }
            })
            .then(function(exam){
                if(opType !== 'correct') {
                    // Modify the operation
                    exam.ansSubmit = req.body.ansSubmit;
                    exam.isSubmit = true;
                    exam.dateSubmit = new Date();
                    exam.submitIP = utils.getClientIP(req);
                }

                // Need automatic results?
                if(autoCorrect){
                    exam.score = exam.getScore();
                    exam.isCorrected = true;
                    exam.dateCorrect = new Date();
                }

                return exam.save();
            })
            .then(function(){
                //ServerLogger.log(req.decoded._id, req.path, req.method, req.body);
                return res.status(200).send({success: true});
            })
            .catch(function(error){
                return res.send('error：' + JSON.stringify(error));
            });
    };*/


    function deleteExamByExamID(req, next) {
        var Model = models.get(req.session.lastDb, 'ExamSchedule', examScheduleSchema);

        Model.remove({
            _id: objectId(req.params.examId)
        }, function (err, result) {
            next(err, req, result);
        });
    }

    function deleteSExamByExamID(req, next) {
        var headers = baseService.getHeaders(req);
        var Model = models.get(req.session.lastDb, 'ExamScheduleLog', examScheduleLogSchema);

        Model.remove({
            scheduleId: objectId(req.params.examId),
            section_id: req.body.section_id,
            class_id  : req.body.class_id,
            school_id : headers.school_id,
            tenant_id : headers.tenant_id
        }, function (err, result) {
            next(err, req, result);
        });
    }



    function buildErrResponse(err, message) {
        return responseBuilder.buildResponse(constant.SCHOOL, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
    };
    exports.buildErrResponse = buildErrResponse;
};

module.exports = Module;
