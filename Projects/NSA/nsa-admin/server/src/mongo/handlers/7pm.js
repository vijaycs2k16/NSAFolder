/**
 * Created by Sathya on 1/8/2019.
 */

var mongoose = require('mongoose');
var events = require('@nsa/nsa-commons').events;
var baseService = require('@nsa/nsa-cassandra').BaseService;
var examScheduleSchema = mongoose.Schemas.ExamSchedule;
var testConfigSchema = mongoose.Schemas.TestConfigurationSchema;
var examScheduleLogSchema = mongoose.Schemas.ExamScheduleLog;
var examStudentSchema = mongoose.Schemas.sStudentExam;
var questionMetrics = mongoose.Schemas.sQuestionMetrics;
var subjectMetricsSchema = mongoose.Schemas.sSubjectMetrics;
var subjectsMetricsSchema = mongoose.Schemas.SubjectMetrics;
var dateUtils = require('../helpers/dateService');
var FilterMapper = require('../helpers/filterMapper');
var filterMapper = new FilterMapper();
var notificationHandler = require('./notifications');
var async = require('async');
var pageHelper = require('../helpers/pageHelper');
var utils = require('../helpers/serviceUtils');
var serviceUtils = require('../helpers/serviceUtils');
var _ = require('lodash');
var moment = require('moment');
var generateColor = require('generate-color');
var nsaElasticSearch = require('@nsa/nsa-elasticsearch');
var logger = require('../../common/logging');
var message = require('@nsa/nsa-commons').messages;

var Module = function (models) {
    var notification = new notificationHandler(models);
    var objectId = mongoose.Types.ObjectId;

    this.getExamByExamId = function (req, res, next) {
        async.waterfall([ saveStudentExamById.bind(null, req), getExamById.bind(), saveQuestions.bind()], function (err, result) {
            if (err) {
                logger.debugLog(req,'Unable to get school details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        })
    };


    this.getOverallToppers = function (req, res, next) {
        var headers = baseService.getHeaders(req);
        var model = models.get(req.session.lastDb, "sSubjectMetrics", subjectMetricsSchema);
        var userName = headers.user_id;
        var queryParams = req.query;
        var matchQuery;
        var matchObj = {'schedule.monthNo': +queryParams.monthNo};

        if(queryParams.overAll){
            matchQuery = {};
        } else {
            matchQuery = {userName: userName};
        }

        model.aggregate([
            {
                $match: matchQuery
            },
            {
                "$lookup": {
                    "from": "test_configuration",
                    "localField": "mexam",
                    "foreignField": "_id",
                    "as": "schedule"
                }
            },
            {
                "$lookup": {
                    "from": "7_studentExam",
                    "localField": "userName",
                    "foreignField": "userName",
                    "as": "student"
                }
            },
            {
                $project: {
                    schedule : '$schedule',
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
                    student: {$arrayElemAt: ['$student', 0]}
                }
            },
            {$unwind: {path: '$schedule'}},
            {
                $match: matchObj
            },
            /*{
                "$lookup": {
                    "from": "StudentExam",
                    let: { topic: '$schedule._id', userName: '$userName'},
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { $eq: [ "$examId", "$$topic" ] },
                                        { $eq: [ "$userName", "$$userName" ] }
                                    ]
                                }
                            }
                        }
                    ],
                    "as": "student"
                }
            },*/
            {
                $group:
                    {
                        _id: {scheduleId: '$schedule._id', name: '$schedule.name', schedule: '$schedule', userName : '$userName'},
                        totalSkipped: { $sum: "$total_skipped" },
                        stotalMarks: {$sum: '$stotalMarks'},
                        totalCorrect: { $sum: "$total_correct" },
                        totalWrong: { $sum: "$total_wrong" },
                        totalMarks: { $sum: "$total_marks" },
                        totalScore : { $sum: "$total_marks_scored" },
                        totalQues: { $sum: "$total_ques" },
                        totalTime: { $sum: parseInt('$total_time')},
                        student:  {  $first: '$student'},
                        aggregate_percentage : { $avg: "$aggregate_percentage"}
                    }
            },

            {
                $group:
                    {
                        _id: {scheduleId: '$_id.scheduleId', schedule: '$_id.schedule', name: '$_id.schedule.name'},
                        item : {$addToSet: {userName : '$_id.userName', schoolName: '$student.school_name', school_id: '$student.school_id', firstName: '$student.firstName',aggregate_percentage: '$aggregate_percentage', totalSkipped: '$totalSkipped', totalCorrect: '$totalCorrect',totalWrong: '$totalWrong',totalMarks: "$totalMarks", totalScore : "$totalScore" , totalQues: "$totalQues", countData: '$countData', totalTime: '$totalTime'}},
                    }
            },
            {$unwind: {path: '$item'}},
            {"$sort": { "item.aggregate_percentage": -1, "item.totalTime": 1} },
            {
                $group:
                    {
                        _id: {scheduleId: '$_id.scheduleId',  name: '$_id.schedule.name', schedule: '$_id.schedule'},
                        item : {$push: '$item'}
                    }
            },
            {$unwind: {path: '$item', includeArrayIndex: "rank"}},
            {$match: {'rank' : {$lte: 2}}},
            {
                $group:
                    {
                        _id: {scheduleId: '$_id.scheduleId',  name: '$_id.schedule.name', schedule: '$_id.schedule'},
                        item : {$push:{"userName" :'$item.userName', schoolName:'$item.schoolName', firstName:'$item.firstName', school_id:'$item.school_id' ,aggregate_percentage : '$item.aggregate_percentage', totalSkipped: '$item.totalSkipped',totalCorrect: '$item.totalCorrect', totalWrong:'$item.totalWrong', totalMarks: '$item.totalMarks', totalScore: '$item.totalScore', totalQues: '$item.totalQues', totalTime: '$totalTime', rank: { $sum: [ "$rank", 1 ]}}},

                    }
            },
            {
                $project: {
                    _id: '$_id',
                    item : '$item'
                }
            }

        ]).exec(function (err, result) {
            if (err) {
                logger.debugLog(req,'Unable to get school details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
            } else {
                events.emit('JsonResponse', req, res, result);
            }

        });
    };

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
            callback(err, result)
        });

    }


    this.getBadgeWinners = function (req, res, next) {
        var headers = baseService.getHeaders(req);
        var model = models.get(req.session.lastDb, "sSubjectMetrics", subjectMetricsSchema);
        var userName = headers.user_id;
        var queryParams = req.query;
        var matchQuery = {$and: [{'student.school_id': headers.school_id}, {'student.tenant_id': headers.tenant_id}]};;
        var matchObj = {'schedule.monthNo': +queryParams.monthNo};
        var userObj = {}

        if(queryParams.graph){
            userObj = {userName: userName};
        }
        model.aggregate([
            {
                $match: userObj
            },
            {
                "$lookup": {
                    "from": "test_configuration",
                    "localField": "mexam",
                    "foreignField": "_id",
                    "as": "schedule"
                }
            },
            {
                "$lookup": {
                    "from": "7_studentExam",
                    "localField": "userName",
                    "foreignField": "userName",
                    "as": "student"
                }
            },
            {
                $project: {
                    schedule : '$schedule',
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
                    student: {$arrayElemAt: ['$student', 0]}
                }
            },
            {
                $match: matchQuery
            },
            {$unwind: {path: '$schedule'}},
            {
                "$lookup": {
                    "from": "ClassDetails",
                    "localField": "schedule.classDetail",
                    "foreignField": "_id",
                    "as": "classDetails"
                }
            },
            {$unwind: {path: '$classDetails'}},
            {
                $match: matchObj
            },
            {
                $group:
                    {
                        _id: {classDetails: '$classDetails', name: '$schedule.name', schedule: '$schedule', userName : '$userName'},
                        totalSkipped: { $sum: "$total_skipped" },
                        stotalMarks: {$sum: '$stotalMarks'},
                        totalCorrect: { $sum: "$total_correct" },
                        totalWrong: { $sum: "$total_wrong" },
                        totalMarks: { $sum: "$total_marks" },
                        totalScore : { $sum: "$total_marks_scored" },
                        totalQues: { $sum: "$total_ques" },
                        totalTime: { $sum: parseInt('$total_time')},
                        student:  {  $first: '$student'},
                        aggregate_percentage : { $avg: "$aggregate_percentage"}
                    }
            },

            {
                $group:
                    {
                        _id: {classDetails: '$_id.classDetails', schedule: '$_id.schedule', name: '$_id.schedule.name'},
                        item : {$addToSet: {userName : '$_id.userName', schoolName: '$student.school_name', school_id: '$student.school_id', firstName: '$student.firstName',aggregate_percentage: '$aggregate_percentage', totalSkipped: '$totalSkipped', totalCorrect: '$totalCorrect',totalWrong: '$totalWrong',totalMarks: "$totalMarks", totalScore : "$totalScore" , totalQues: "$totalQues", countData: '$countData', totalTime: '$totalTime'}},
                    }
            },
            {$unwind: {path: '$item'}},
            {"$sort": { "item.aggregate_percentage": -1, "item.totalTime": 1} },
            {
                $group:
                    {
                        _id: {classDetail: '$_id.classDetails._id', classDetails: '$_id.classDetails', className: '$_id.classDetails.className', name: '$_id.schedule.name'},
                        item : {$push: '$item'}
                    }
            },
            {$unwind: {path: '$item', includeArrayIndex: "rank"}},
            {$match: {'rank' : {$lte: 0}}},

            {
                $group:
                    {
                        _id: {name: '$_id.name'},
                        item : {$push:{"userName" :'$item.userName',className: '$_id.className', orderBy: '$_id.classDetails.order_by', schoolName:'$item.schoolName', firstName:'$item.firstName', school_id:'$item.school_id' ,aggregate_percentage : '$item.aggregate_percentage', totalSkipped: '$item.totalSkipped',totalCorrect: '$item.totalCorrect', totalWrong:'$item.totalWrong', totalMarks: '$item.totalMarks', totalScore: '$item.totalScore', totalQues: '$item.totalQues', totalTime: '$totalTime', rank: { $sum: [ "$rank", 1 ]}}},

                    }
            },

            {
                $project: {
                    _id: '$_id',
                    val : {$arrayElemAt: ['$item', 0]},
                    rank : 'val.rank',
                    item : '$item'
                }
            },
            {
                $project: {
                    _id: '$_id',
                    totalScore : '$val.totalScore',
                    rank : '$val.rank',
                    item : '$item'
                }
            }



        ]).exec(function (err, result) {
            if (err) {
                logger.debugLog(req,'Unable to get school details ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
            } else {
                events.emit('JsonResponse', req, res, result);
            }

        });
    };

    function saveStudentExamById(req, callback) {
        var Model = models.get(req.session.lastDb, 'sStudentExam', examStudentSchema);
        var headers = baseService.getHeaders(req);

        Model.findOne({examId: req.params.id, userName: headers.user_id}).exec(function (err, result) {
            if(_.isEmpty(result)) {

                var body = {
                    examId: req.params.id,
                    userName: headers.user_id,
                    firstName: headers.user_name,
                    school_id: headers.school_id,
                    tenant_id: headers.tenant_id,
                    school_name: headers.school_name,
                    examMode: 'Online',
                    score: 0,
                    isCorrected: false,
                    isSubmit: false
                };
                var studentExam = new Model(body);

                studentExam.save(function (err, schedule) {
                    callback(err, req)
                });
            } else {
                callback(err, req)
            }
        });
    }

    function getExamById(req, callback) {
        var Model = models.get(req.session.lastDb, 'sStudentExam', examStudentSchema);
        var headers = baseService.getHeaders(req);

        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var findQuery = {examId : objectId(req.params.id)};
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
            .populate({path: 'examId', populate: [{path: 'questions'}]})
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

    function saveQuestions(req, mergedObj, callback) {
        var Model = models.get(req.session.lastDb, 'sStudentExam', examStudentSchema);
        var quesObjs = mergedObj.questions;
        var questions = [];
        _.forEach(quesObjs, function (val, index) {
            var ques = {};
            ques.qid = objectId(val._id);
            ques.sid = objectId(val.subject);
            questions.push(ques);
            if(index == quesObjs.length -1) {
                Model.update({_id: objectId(mergedObj.id)}, {$set: {questions: questions}}, function (err, result) {
                    callback(err, mergedObj)

                });

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
            events.emit('JsonResponse', req, res, []);
        }
    };

    function getTopicNames(data) {
        var dataObj = [];
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                _.forEach(data, function (value, key) {
                    var topicDatas=[];
                    if(!_.isEmpty(value.topic)){
                        _.forEach(value.topic, function (topicId, key) {
                            _.forEach(value.topicObjs, function (topicObj, key) {
                                var topics = _.filter(topicObj.topics, {'_id': topicId});
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
    }

    function getScheduledExamForStudents(req, callback) {
        var Model = models.get(req.session.lastDb, 'TestConfigurationSchema', testConfigSchema);
        var queryParams = req.query;
        var weekNo = moment().isoWeek();
        var filter = queryParams.filter || null;
        var headers = baseService.getHeaders(req);
        var matchObj =  {$and: [{isSchedule: true}, {weekNo: weekNo}]};
        var findQuery = {'classDetail.class_id': req.query.class_id};
        var matchQuery = {userName: headers.user_id};
        /*queryParams.submit = queryParams.submit ? (queryParams.submit == 'true' ? true : false ) : false;
         if(queryParams.submit) {
         findQuery.isSubmit = true;
         }*/
        if (queryParams.isPrevious) {
            matchObj =  {$and: [{isSchedule: true}, {dateBeginAhead: {"$lte": new Date()}}]};
        }

        Model.aggregate([
            {$match: matchObj},
            {
                "$lookup": {
                    "from": "ClassDetails",
                    "localField": "classDetail",
                    "foreignField": "_id",
                    "as": "classDetail"
                }
            },
            {$unwind: {path: '$classDetail'}},
            {$match: findQuery},
            {
                "$lookup": {
                    "from": "7_studentExam",
                    "localField": "_id",
                    "foreignField": "examId",
                    "as": "studentExam"
                }
            }
        ]).exec(function (err, result) {
            if(!_.isEmpty(result)) {
                result = JSON.parse(JSON.stringify(result));
                _.forEach(result, function (val) {
                    var studentObj = _.filter(val.studentExam, {userName: headers.user_id});
                    val.isSubmit = studentObj.length > 0 ? studentObj[0].isSubmit : false;

                    delete val.studentExam;
                });

                dateUtils.formatObjectsDates(result, ['dateBeginAhead', 'dateEnd'], 'type2', function (err, data) {
                    callback(err, result)
                });
            } else {
                callback(err, [])
            }
        });
    }

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

    function updateExamById(req, callback) {
        var Model = models.get(req.session.lastDb, 'sStudentExam', examStudentSchema);
        Model.find({"_id": objectId(req.params._id)}).populate({path: 'examId'}).populate({path: 'questions.qid'}).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            var data = result[0];
            var updateOptions = {};
            updateOptions.isSubmit = true;
            updateOptions.dateSubmit = new Date();
            updateOptions.submitIP = utils.getClientIP(req);
            if (data.examId.autoCorrect) {
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
                        score += (data.examId.questionMark) ? data.examId.questionMark : qid.point;
                    } else {
                        score -= (data.examId.negativeMark) ? data.examId.negativeMark : 0;
                    }
                }
            }
        });
        return score;
    }

    function saveSubjectMertrics(req, data, callback) {
        var headers = baseService.getHeaders(req);
        var Model = models.get(req.session.lastDb, 'sSubjectMetrics', subjectMetricsSchema);
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
                                bulk.insert(value);
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

    function getSubMeObj(req, data, callback) {
        var headers = baseService.getHeaders(req);
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
                        total_marks += (data.examId.questionMark) ? data.examId.questionMark : qid.point;
                        if(!_.isEmpty(correctAns) && value.userAns) {
                            if((value.userAns).toString() == (correctAns._id).toString()) {
                                total_marks_scored += (data.examId.questionMark) ? data.examId.questionMark : qid.point;
                            } else if(value.userAns && value.userAns != ''){
                                total_marks_scored -= (data.examId.negativeMark) ? data.examId.negativeMark : 0;
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

            });
            callback(null, subObjs)
        } catch (err) {
            callback(err, null)
        }

    }

    function saveQuestionMetrics(req, data, callback){
        var Model = models.get(req.session.lastDb, 'sQuestionMetrics', questionMetrics);
        var bulk = Model.collection.initializeOrderedBulkOp();
        var body = req.body;
        var ids = [];
        _.forEach(data.questions, function(val){
            ids.push(objectId(val.qid._id));
        });

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
                                total_wrong: value.wrong ? 1 : 0
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

    };

    function getSubjectData(req, callback) {
        var headers = baseService.getHeaders(req);
        var model = models.get(req.session.lastDb, "sSubjectMetrics", subjectMetricsSchema);
        var query = { $and : [{
            userName: headers.user_id},
            {mexam: objectId(req.params.id)}]
        };

        model.find(query).populate({path: 'mexam'}).populate({path: 'subject'}).exec(function (err, response) {
            callback(err, response)
        })
    }

    function getAggregateData(req, callback) {
        var headers = baseService.getHeaders(req);
        var model = models.get(req.session.lastDb, "sSubjectMetrics", subjectMetricsSchema);
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
                    totalQues: { $sum: "$total_ques" }
                }
            }
        ]).exec(function (err, result) {
            callback(err, result.length > 0 ? result[0] : {})
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

    function getClassAverage(req, data, callback) {
        var model = models.get(req.session.lastDb, "sSubjectMetrics", subjectMetricsSchema);
        var query =  {mexam: objectId(req.params.id)};
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
                    "from": "test_configuration",
                    "localField": "mexam",
                    "foreignField": "_id",
                    "as": "schedule"
                }
            },
            {$unwind: {path: '$schedule'}},
            {
                "$lookup": {
                    "from": "7_studentExam",
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
        var data = {};
        var model = models.get(req.session.lastDb, "sSubjectMetrics", subjectMetricsSchema);
        var query =  {mexam: objectId(req.params.id)};
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
                    "from": "test_configuration",
                    "localField": "mexam",
                    "foreignField": "_id",
                    "as": "schedule"
                }
            },
            {$unwind: {path: '$schedule'}},
            {
                "$lookup": {
                    "from": "7_studentExam",
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
        var model = models.get(req.session.lastDb, "sSubjectMetrics", subjectMetricsSchema);
        var query =  {mexam: objectId(req.params.id)};
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
                    "from": "test_configuration",
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
                    aggregate_percentage: 1
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
                    aggregate_percentage : { $avg: "$aggregate_percentage"}
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
                    item : {$push: '$item'}
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
    };

    function getScheduledExamsForStudents(req, callback) {
        var Model = models.get(req.session.lastDb, 'sStudentExam', examStudentSchema);
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
            .populate({path: 'examId', populate: [{path: 'questions'}, {path: 'subject'}]})
            .populate('questions.qid')
            .exec(function (err, result) {
                var resObj = [];
                if(!_.isEmpty(result)) {
                    _.forEach(result, function (val, index) {
                        var id = val._id;
                        if(val.examId) {
                            var obj1 = JSON.parse(JSON.stringify(val));
                            var obj2 = JSON.parse(JSON.stringify(val.examId));
                            var mergedObj = _.merge(obj1, obj2);
                            if(!_.isEmpty(mergedObj.questions)) {
                                mergedObj.attemptedTime = _.sumBy(mergedObj.questions, function(o){ return +o.attempted_time});
                                mergedObj.totalMarks = _.sumBy(mergedObj.questions, function(o){ return !_.isEmpty(o.qid) ? +o.qid.point : 0});
                            }

                            dateUtils.formatObjectsDates(mergedObj, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                                mergedObj.id = id;
                                delete mergedObj.examId;
                                resObj.push(mergedObj);
                            });
                        }
                        if(index == result.length - 1) {
                            callback(err, resObj);
                            //res.status(200).send({data: resObj});
                        }

                    })
                } else {
                    callback(err, resObj);
                    //res.status(200).send({data: resObj});
                }
            });
    }

    this.updateStudentExamPaper = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'sStudentExam', examStudentSchema);
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

    function buildErrResponse(err, message) {
        return responseBuilder.buildResponse(constant.SCHOOL, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
    }
    exports.buildErrResponse = buildErrResponse;
};

module.exports = Module;