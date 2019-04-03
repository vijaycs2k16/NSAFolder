/**
 * Created by kiranmai on 16/02/18.
 */

var mongoose = require('mongoose');
var questionSchema = mongoose.Schemas.Question;
var sheetSchema = mongoose.Schemas.Sheet;
var examConfigSchema = mongoose.Schemas.ExamConfig;
var examSchema = mongoose.Schemas.Exam;
var examScheduleSchema = mongoose.Schemas.PracticeSchedule;
var examStudentSchema = mongoose.Schemas.StudentPractice;
var examSchedulechema = mongoose.Schemas.ExamScheduleLog;
var practiceMetricsSchema = mongoose.Schemas.PracticeMetrics;
var dateUtils = require('../utils/dateService');
var FilterMapper = require('../helpers/filterMapper');
var filterMapper = new FilterMapper();
var codeTypeSchema = mongoose.Schemas.CodeType;
var studentHandler = require('./vStudent');
var notificationHandler = require('./vNotifications');
var async = require('async');
var pageHelper = require('../helpers/pageHelper');
var utils = require('../utils/serviceUtils');
var serviceUtils = require('../utils/serviceUtils')
var _ = require('lodash');

var Module = function (models) {
    var student = new studentHandler(models);
    var notification = new notificationHandler(models);
    var objectId = mongoose.Types.ObjectId;

    this.getQuestions = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        var queryParams = req.query;
        var matchQuery = {}
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var  optionsObject;
        var sort;
        var  filter = queryParams.filter || {};
        var contentType = queryParams.contentType;
        var keySort;

        if(queryParams.subject) {
            matchQuery.subject= objectId(queryParams.subject);
        }
        if(queryParams.topic) {
            matchQuery.topic= objectId(queryParams.topic);
        }
        if(queryParams.weightage) {
            matchQuery.weightage= parseInt(queryParams.weightage);
        }
        var queryObject = {};
        queryObject.$and = [];
        var optionsObject = {};

        if (filter && typeof filter === 'object') {
            optionsObject = filterMapper.mapFilter(filter, {
                contentType: contentType
            });
        }
        if (data.sort) {
            keySort = Object.keys(data.sort)[0];
            data.sort[keySort] = parseInt(data.sort[keySort], 10);
            sort = data.sort;
        } else {
            sort = {'question.createDate': -1};
        }

        if(optionsObject) {
            queryObject.$and.push(optionsObject);
        }
        Model.aggregate([
            {
                "$match": matchQuery
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
                    "from": "Subject",
                    "localField": "subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {
                "$lookup": {
                    "from": "Topic",
                    "localField": "topic",
                    "foreignField": "topics._id",
                    "as": "topicObjs"
                }
            }, {
                $unwind: {path: "$course"}
            }, {
                $unwind: {path: "$subject"}
            }, {
                $unwind: {path: "$topicObjs"}
            }, {
                "$match": queryObject
            }, {
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: {
                    total        : 1,
                    _id          : '$root._id',
                    desc         : '$root.desc',
                    code         : '$root.code',
                    type         : '$root.type',
                    course       : '$root.course',
                    subject      : '$root.subject',
                    topic        : '$root.topic',
                    point        : '$root.point',
                    weightage    : '$root.weightage',
                    form         : '$root.form',
                    numForm      : '$root.numForm',
                    lastModified : '$root.lastModified',
                    topicObjs    : '$root.topicObjs'
                }
            },
            {
                $sort  : sort
            },{
                $skip  : skip
            }, {
                $limit : limit
            }
        ]). exec(function (err, result) {
            var firstElement;
            var response = {};

            if (err) {
                return next(err);
            }

            firstElement = result[0];
            var count = firstElement && firstElement.total ? firstElement.total : 0;
            response.total = count;
            response.count = result.length;
            response.data = topicObjs(result);

            res.status(200).send(response)

        });
    };

    this.getQuestion = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        Model.aggregate([
            {$match: {"_id" : objectId(req.params._id)}},
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
                    "from": "Subject",
                    "localField": "subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {
                "$lookup": {
                    "from": "Topic",
                    "localField": "topic",
                    "foreignField": "topics._id",
                    "as": "topicObjs"
                }
            },
            {$unwind: {path: "$course"}},
            {$unwind: {path: "$subject"}},
            {$unwind: {path: "$topicObjs"}}
        ]).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(topicObjs(result));
        });
    };

    function topicObjs(data) {
        var datObj = []
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                _.forEach(data, function (value, key) {
                    if(!_.isEmpty(value.topic)){
                        var topicData={};
                        var topics = _.filter(value.topicObjs.topics, {'_id': value.topic})

                        if(topics.length > 0) {
                            value.topicData = topics[0];
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

    this.getQuestionsByTopic = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        var body = req.body;
        var orQuery = [];

        async.each(body.subjects, function (value, key) {
            orQuery.push({$and: [{subject: value.subjectId}, {topic: {$in: value.topics}}]});
        });

        Model.find({course: objectId(body.course), $or: orQuery}).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.getRandomQuestions = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        var noOfQuestions = req.params.limit;
        var body = req.body;
        var orQuery = [];

        async.each(body.subjects, function (value, key) {
            var arr =  value.topics.map(i => objectId(i));
            orQuery.push({$and: [{subject: objectId(value.subjectId)}, {topic: {$in: arr}}]});
        });

        Model.aggregate([
            {$match: {course: objectId(body.course)}},
            {$match: {$or: orQuery}},
            {$sample: {size: parseInt(noOfQuestions)}}]).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.getQuestionsCountByWeightage = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        var body = req.body;
        var orQuery = [];

        async.each(body.subjects, function (value, key) {
            var arr =  value.topics.map(i => objectId(i));
            orQuery.push({$and: [{subject: objectId(value.subjectId)}, {topic: {$in: arr}}]});
        });

        Model.aggregate([
            {$match: {course: objectId(body.course)}},
            {$match: {$or: orQuery}},
            {$group: {_id: {topic: "$topic", weightage: "$weightage"}, total: {$sum: 1}}},
            {$group: {_id: "$_id.topic", details: {$addToSet: {weightage: "$_id.weightage", questions: "$total", noOfQuestions: 0}}}},
            {
                "$lookup": {
                    "from": "Topic",
                    "localField": "_id",
                    "foreignField": "topics._id",
                    "as": "topic"
                }
            },
        ]).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: scheduleObjs(result)});
        });
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

    this.getQuestionsByWeightage = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        var body = req.body;
        var orQuery = [];
        var topicQuery = [];

        async.each(body.subjects, function (value, key) {
            var topicOrQuery = [];
            async.each(value.topics, function (topicObjs, key1) {
                var topicAndQuery = [];
                async.each(topicObjs.details, function (detail, key2) {
                    topicAndQuery.push(
                        {topic: objectId(topicObjs._id)},
                        {weightage: parseInt(detail.weightage)}
                    );
                    topicQuery.push({subject: value.subjectId, topic: topicObjs._id, weightage: +detail.weightage, nOfQ: +detail.noOfQuestions})
                });
                topicOrQuery.push({$or: topicAndQuery});
            })
            orQuery.push({
                $and: [
                    {subject: objectId(value.subjectId)},
                    {$or: topicOrQuery}]
            });
        });

        Model.aggregate([
            {$match: {course: objectId(body.course)}},
            {$match: {$or: orQuery}},
            ]).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            var dataObj = [];
            var data = _.groupBy(result, function(value){
                return value.subject + '#' + value.weightage + '#' + value.topic;
            });
            _.map(data, function (val, key) {
                var nKey = key.split('#', 3);;
                var qObj = _.filter(topicQuery, {subject: nKey[0], weightage: +nKey[1], topic: nKey[2]});
                if(qObj.length > 0) {
                    dataObj.push(_.sample(val, qObj[0].nOfQ));
                } else  {
                    dataObj.push(_.sample(val, 1));
                }
            });

            res.status(200).send({data: _.flatten(dataObj)});

        });
    };

    this.createQuestion = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        var System = models.get(req.session.lastDb, 'CodeType', codeTypeSchema);

        var codeType = 'question';
        var _id;
        // save the new test questions is divided into three steps,
        // first to obtain the maximum test question number, save, and finally update the maximum number
        Promise.resolve()
            .then(function () {
                // 1. Query the maximum number
                return System.findOne({codeType: codeType}, {maxNo: 1});
            })
            .then(function (data) {
                if (!data || !data.maxNo) {
                    return Promise.reject('query the maximum number of questions failed');
                }
                // 2. Use this number to set the code field of the data
                var user = new Model();
                user.code = utils.generateCode(codeType, data.maxNo);
                user.desc = req.body.desc;
                user.lastModified = new Date();
                // user.category = req.body.category;
                user.type = req.body.type;
                user.point = req.body.point;
                user.form = req.body.form;
                user.course = objectId(req.body.course);
                user.subject = objectId(req.body.subject);
                user.topic = objectId(req.body.topic);
                user.weightage = req.body.weightage;
                return user.save();
            }).then(function (data) {
            if (!data) {
                return Promise.reject('Save new test failed');
            }
            _id = data._id;
            // update number
            return System.update({codeType: codeType}, {$inc: {'maxNo': 1}});

        }).then(function (data) {
            if (!data || !data.ok) {
                return Promise.reject('update max number failed');
            }
                res.status(200).send({success: true, data: data});
                return Promise.resolve();
            })
            .catch(function (error) {
                res.send(error);
            });
    };


    this.updateQuestion = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);

        Model.findById(req.params._id, function (err, user) {
            if (err) {
                return next(err);
            }
            user.name     = req.body.name;
            user.desc = req.body.desc;
            // user.category = req.body.category;
            user.type = req.body.type;
            user.point = req.body.point;
            user.form = req.body.form;
            user.lastModified = new Date();
            user.course = objectId(req.body.course);
            user.subject = objectId(req.body.subject);
            user.topic = objectId(req.body.topic);
            user.weightage = req.body.weightage;
            user.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({success:true});
            });

        });
    };

    this.deleteQuestion = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        async.each(ids, function (id, cb) {
            Model.findByIdAndRemove(id, function (err, result) {
                if (err) {
                    return err(err);
                }
                cb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
        });

    };


    /// Sheet

    this.getSheet = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Sheet', sheetSchema);

        Model.aggregate([
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
                    "from": "Subject",
                    "localField": "subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {
                "$lookup": {
                    "from": "Question",
                    "localField": "questions",
                    "foreignField": "_id",
                    "as": "questions"
                }
            },
            {
                "$lookup": {
                    "from": "Topic",
                    "localField": "topic",
                    "foreignField": "topics._id",
                    "as": "topicObjs"
                }
            },
            {$unwind: {path: "$course"}}
        ]).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(getTopicNames(result));
        });
    };



    function getTopicObjs(data) {
        var dataObj = []
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                _.forEach(data, function (value, key) {
                    var topicDatas=[];
                    if(!_.isEmpty(value.topic)){
                        _.forEach(value.topic, function (topicId, key) {
                            _.forEach(value.topicData, function (topicObjs, index) {
                                    var topics = _.filter(topicObjs.topicObjs.topics, {'_id': topicId})
                                    if (topics.length > 0 && topicObjs.topic == topicId) {
                                        var practicObj = _.filter(JSON.parse(JSON.stringify(topicObjs.practices)), {'isSubmit': true, 'topic': topicId});
                                        topics[0].questions = topicObjs.questions;
                                        topics[0].avgData = !_.isEmpty(practicObj) ? ((practicObj.length / topicObjs.practices.length) * 100) : 0;
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
                                    var practicObj = _.filter(topics, {'isSubmit': true});
                                    topics[0].avg = !_.isEmpty(practicObj) ? ((practicObj.length / topics.length) * 100) : 0;
                                    topicDatas.push(topics[0]);
                                }
                            });
                        });
                        value.topicData = _.uniqBy(topicDatas, '_id');;
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

    this.createSheet = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Sheet', sheetSchema);
        var System = models.get(req.session.lastDb, 'CodeType', codeTypeSchema);

        var codeType = 'sheet';
        var _id;
        var body = req.body;
        //Save a new test is divided into three steps, first of all to obtain the maximum test ID,
        // save, and finally update the maximum number
        Promise.resolve()
            .then(function(){
                // 1. Query the maximum number
                return System.findOne({codeType:codeType},{maxNo:1});
            })
            .then(function(data){
                if(!data || !data.maxNo) { return Promise.reject('The maximum number of inquiry questions failed'); }
                //2.Use this number to set the code field for the data
                var user      = new Model();
                user.code = utils.generateCode(codeType, data.maxNo);
                user.course = body.course;
                user.subject = body.subject;
                user.topic = body.topic;
                user.name = body.name;
                user.detail = body.detail;
                user.lastModified = new Date();
                user.remark = body.remark;
                user.questions = body.questions;
                user.num = body.num;
                user.questionMode = body.questionMode;

                return user.save();
            })
            .then(function(data){
                if (!data) {
                    return Promise.reject('Failed to save the new test');
                }
                _id = data._id;
                // update number
                return System.update({codeType:codeType},{$inc:{'maxNo':1}});

            })
            .then(function(data){
                if (!data || !data.ok) {
                    return Promise.reject('Failed to update the maximum number');
                }

                getById(req, {id: _id}, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.status(201).send(result);
                });
            })
            .catch(function(error){
                res.send(error);
            })
        ;
    };

    function getById(req, options, next) {
        var id = options.id;
        var Model = models.get(req.session.lastDb, 'Sheet', sheetSchema);

        Model.findById(id)
            .populate({path : 'course'}).populate({path: 'subject'}).populate({path: 'questions'})
            .exec(function (err, result) {
            if (err) {
                return next(err);
            }
            next(null, result);
        });
    };


    this.updateSheet = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Sheet', sheetSchema);
        var body = req.body;

        Model.findById(req.params._id, function (err, user) {
            if (err) {
                return next(err);
            }
            user.course = body.course;
            user.subject = body.subject;
            user.topic = body.topic;
            user.name = body.name;
            user.detail = body.detail;
            user.lastModified = new Date();
            user.remark = body.remark;
            user.num = body.num;
            user.questions = body.questions;
            user.questionMode = body.questionMode;

            user.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({success:true});
            });

        });
    };

    this.deleteSheet = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Sheet', sheetSchema);

        Model.remove({
            _id: req.params._id
        }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true, data: result});
        });

    };

    /// Exam Configuration

    this.getExamConfig = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'ExamConfig', examConfigSchema);

        Model.find({}).sort({name:1}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });

    };

    this.createExamConfig = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'ExamConfig', examConfigSchema);
        var System = models.get(req.session.lastDb, 'CodeType', codeTypeSchema);

        var codeType = 'examconfig';
        var _id;
        // save the new test questions is divided into three steps, first to obtain the maximum test question number, save, and finally update the maximum number
        Promise.resolve()
            .then(function(){
                // 1. Query the maximum number
                return System.findOne({codeType:codeType},{maxNo:1});
            })
            .then(function(data){
                 if (! data ||! data.maxNo) { return Promise.reject ('query the maximum number of questions failed'); }
                // 2. Use this number to set the code field of the data
                var user      = new Model();
                user.code = utils.generateCode(codeType, data.maxNo);
                user.name     = req.body.name;
                user.timeBegin = req.body.timeBegin ;
                user.timeEnd = req.body.timeEnd;
                user.duration = req.body.duration;
                user.questionMark = req.body.questionMark;
                user.negativeMark = req.body.negativeMark;
                user.ipPattern = req.body.ipPattern;
                user.minAhead = req.body.minAhead;
                user.canReview = req.body.canReview;
                user.isFull = req.body.isFull;
                user.autoCorrect = req.body.autoCorrect;
                user.lastModified = new Date();
                user.remark = req.body.remark;
                return user.save();
            })
            .then(function(data){
                if (!data) {
                    return Promise.reject('Save new test failed');
                }
                _id = data._id;
                // update number
                return System.update({codeType:codeType},{$inc:{'maxNo':1}});

            })
            .then(function(data){
                if (!data || !data.ok) {
                    return Promise.reject('update max number failed');
                }
                res.json({success:true, data: data, _id: _id});
                return Promise.resolve();
            })
            .catch(function(error){
                res.send(error);
            })
        ;
    };


    this.updateExamConfig = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'ExamConfig', examConfigSchema);

        Model.findById(req.params._id, function (err, user) {
            if (err) {
                return next(err);
            }
            user.name = req.body.name;
            user.timeBegin = req.body.timeBegin;
            user.timeEnd = req.body.timeEnd;
            user.duration = req.body.duration;
            user.minAhead = req.body.minAhead;
            user.lastModified = new Date();
            user.canReview = req.body.canReview;
            user.isFull = req.body.isFull;
            user.remark = req.body.remark;
            user.ipPattern = req.body.ipPattern;
            user.autoCorrect = req.body.autoCorrect;

            user.save(function (err, data) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({success:true, data:data});
            });

        });
    };

    this.deleteExamConfig = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'ExamConfig', examConfigSchema);

        Model.remove({
            _id: req.params._id
        }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true, data: result});
        });

    };

    this.getCenterExams = function(req, res, next) {
        if(req.session.userType != 'Student') {
            var Model = models.get(req.session.lastDb, 'Exam', examSchema);

            var filter = serviceUtils.getDateFilter(req);
            var matchObj = {"center": objectId('5a801943b7f69e0caf6dc0e5')};
            if (filter) {
                matchObj = {
                    "dateBeginAhead": {
                        "$gte": new Date(filter.date.value[0]),
                        "$lte": new Date(filter.date.value[1])
                    }
                }
            };

            Model.aggregate([
                {
                    $match: matchObj
                },
                {
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
                },
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
                        "from": "Sheet",
                        "localField": "paperConfig",
                        "foreignField": "_id",
                        "as": "paperConfig"
                    }
                },
                {$unwind: {path: "$config"}},
                {$unwind: {path: "$paperConfig"}},
                {
                    $group: {
                        _id: "$examId",
                        name: {$first: "$name"},
                        dateBeginAhead: {$first: "$dateBeginAhead"},
                        examMode: {$first: "$examMode"},
                        config: {$first: "$config"},
                        paperConfig: {$first: "$paperConfig"},
                        timeBegin: {$addToSet: "$config.timeBegin"},
                        timeEnd: {$addToSet: "$config.timeEnd"}
                    }
                },
                {$unwind: {path: "$timeBegin"}},
                {$unwind: {path: "$timeEnd"}}
            ]).exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                result = serviceUtils.parseDbObjectAsJSON(result)
                dateUtils.formatObjectsDates(result, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                    res.status(200).send({data: result});
                })
            });
        }

    }

    /// Examination
    this.getExamByExamId = function (req, res, next) {
        console.log("innnn")
        async.waterfall([ getExamById.bind(null, req), saveQuestions.bind()], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        })


    }


    this.getPExamById = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentPractice', examStudentSchema);

        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var findQuery = {pexamId : objectId(req.params.id)}
        if(req.session.user.student != null) {
            findQuery = {"student": objectId(req.session.lid), _id : objectId(req.params.id)};
        }
        if (filter) {
            findQuery.dateBeginAhead = {
                "$gte": new Date(filter.date.value[0]),
                "$lte": new Date(filter.date.value[1])
            }
        }


        Model.findOne(findQuery)
            .populate({path: 'pexamId', populate: [{path: 'course'} , {path: 'batch'}, {path: 'questions'}]})
            .populate({path: 'questions.qid'})
            .exec(function (err, result) {
                if (err) {
                    callback(err, req, {})
                }
                var obj1 = JSON.parse(JSON.stringify(result));
                var obj2 = JSON.parse(JSON.stringify(result.pexamId));
                var mergedObj = _.merge(obj1, obj2);
                dateUtils.formatObjectsDates(mergedObj, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                    mergedObj.id = result.id;
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({data: mergedObj});
                });
            });

    }

    function getExamById(req, callback) {
        var Model = models.get(req.session.lastDb, 'StudentPractice', examStudentSchema);

        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var findQuery = {pexamId : objectId(req.params.id)}
        if(req.session.user.student != null) {
            findQuery = {"student": objectId(req.session.lid), _id : objectId(req.params.id)};
        }
        if (filter) {
            findQuery.dateBeginAhead = {
                "$gte": new Date(filter.date.value[0]),
                "$lte": new Date(filter.date.value[1])
            }
        }


        Model.findOne(findQuery)
            .populate({path: 'pexamId', populate: [{path: 'course'} , {path: 'batch'}, {path: 'questions'}]})
            .populate({path: 'questions.qid'})
            .exec(function (err, result) {
                if (err) {
                    callback(err, req, {})
                }
                var obj1 = JSON.parse(JSON.stringify(result));
                var obj2 = JSON.parse(JSON.stringify(result.pexamId));
                var mergedObj = _.merge(obj1, obj2);
                dateUtils.formatObjectsDates(mergedObj, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                    mergedObj.id = result.id;
                    callback(err, req, mergedObj)
                });
            });
    }

    function saveQuestions(req, mergedObj, callback) {
        var Model = models.get(req.session.lastDb, 'StudentPractice', examStudentSchema);
        var quesObjs = mergedObj.questions;
        var questions = [];
        _.forEach(quesObjs, function (val, index) {
            var ques = {};
            ques.qid = objectId(val._id);
            ques.sid = objectId(val.subject);
            ques.tid = objectId(val.topic);
            questions.push(ques)
            if(index == quesObjs.length -1) {
                Model.update({_id: objectId(req.params.id)}, {$set: {questions: questions}}, function (err, result) {
                    callback(err, mergedObj)

                });

            }

        })
    }



    this.getExamSchedule = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Exam', examSchema);

        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var findQuery = {}
        if(req.session.user.student != null) {
                findQuery = {"student": objectId(req.session.lid)};
        }
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
                    return next(err);
                }
                result = serviceUtils.parseDbObjectAsJSON(result)
                dateUtils.formatObjectsDates(result, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                    res.status(200).send({data: result});
                })

            });
    }

    function getSubjectData(req, callback) {
        var model = models.get(req.session.lastDb, "PracticeMetrics", practiceMetricsSchema);
        var query = { $and : [{
            student: req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid)},
            {pexam: objectId(req.params.id)}]
        };

        model.find(query).populate({path: 'student'}).populate({path: 'pexam'}).populate({path: 'subject'}).exec(function (err, response) {
            callback(err, response)
        })
    }


    function getAggregateData(req, callback) {
        var model = models.get(req.session.lastDb, "PracticeMetrics", practiceMetricsSchema);
        var query = { $and : [{
            student: req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid)},
            {pexam: objectId(req.params.id)}]
        };
        model.aggregate([
            {
                '$match': query
            },
            {
                $group:
                    {
                        _id: '$pexam',
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
            aggregateList :getAggregateData.bind(null, req)
        }, function (err, result) {
            if (err)
                next(err, null)
            else
                res.send({success: true, data: result})
        })

    };

    this.getPracticeList = function (req, res, next) {
        var PracticeSchedule = models.get(req.session.lastDb, 'PracticeSchedule', examScheduleSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var queryParams = req.query;
        var matchQuery = {}
        var  filter = queryParams.filter || {};
        var contentType = queryParams.contentType || {};
        var optionsObject = {};
        var matchObj = {};
        var queryObject = {};
        queryObject.$and = [];
        getTotal = function (cb) {
            PracticeSchedule
                .find({})
                .count(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result || 0);
                });
        };
        if (filter && typeof filter === 'object') {
            optionsObject = filterMapper.mapFilter(filter, {
                contentType: contentType
            });
        }

        if(optionsObject) {
            queryObject.$and.push(optionsObject);
        }

        getData = function (cb) {
            PracticeSchedule.aggregate([
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
                        "from": "Subject",
                        "localField": "subject",
                        "foreignField": "_id",
                        "as": "subject"
                    }
                },
                {
                    "$lookup": {
                        "from": "Question",
                        "localField": "questions",
                        "foreignField": "_id",
                        "as": "questions"
                    }
                },
                {
                    "$lookup": {
                        "from": "Topic",
                        "localField": "topic",
                        "foreignField": "topics._id",
                        "as": "topicObjs"
                    }
                },
                {
                    $match : queryObject
                },
                {$unwind: {path: "$course"}},
                {$unwind: {path: "$subject"}},
                {$unwind: {path: "$topicObjs"}}
            ]).exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                cb(null, result);
            });
        };

        async.parallel([getTotal, getData], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({total: result[0], data: topicObjs(result[1])});
        });
    };

    this.getExam = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentPractice', examStudentSchema);
        var queryParams = req.query;
        var filterObj = req.query.filter;
        var  filter = queryParams.filter || {};
        var contentType = queryParams.contentType || 'VExamSchedule';
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var findQuery = {$and: [{"student": objectId(req.session.lid)}]};
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
                "$match": findQuery
            },
            {
                "$lookup": {
                    "from": "PracticeSchedule",
                    "localField": "pexamId",
                    "foreignField": "_id",
                    "as": "schedule"
                }
            },
            {$unwind: {path: "$schedule"}},
            {
                "$lookup": {
                    "from": "Course",
                    "localField": "schedule.course",
                    "foreignField": "_id",
                    "as": "course"
                }
            },
            {
                "$lookup": {
                    "from": "Subject",
                    "localField": "schedule.subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },

            {
                "$lookup": {
                    "from": "Batch",
                    "localField": "schedule.batch",
                    "foreignField": "_id",
                    "as": "batch"
                }
            },


            {$unwind: {path: "$course"}},
            {$unwind: {path: "$subject"}},
            {
                "$match": queryObject
            },

            {
                $group: {
                    _id: {subjectId: "$subject._id", subject: "$subject", topic : '$schedule.topic'},
                    name: {$first: "$schedule.name"},
                    dateBeginAhead: {$first: "$schedule.dateBeginAhead"},
                    examMode: {$first: "$schedule.examMode"},
                    practices: {$push: { _id: '$_id', isSubmit: '$isSubmit', topic: '$schedule.topic'}},
                    questions: { $sum: { $size: "$schedule.questions" }},
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
            {$unwind: {path: "$topicData"}},

            {
                $group: {
                    _id: "$_id.subjectId",
                    subjectName: {$first: '$_id.subject.subjectName'},
                    topic: {$addToSet: '$_id.topic'},
                    topicData : {$addToSet: {topicObjs: '$topicData', topic: '$_id.topic', practices: '$practices', questions: '$questions'}},
                    count: { $sum: 1 },
                }
            },
            {
                $project : {
                    subject : 1,
                    _id: 1,
                    subjectName: 1,
                    name: 1,
                    dateBeginAhead: 1,
                    examMode: 1,
                    topic: 1,
                    topicData: 1,
                    count: 1,
                }
            }
           /* {
                $group: {
                    _id: "$subject._id",
                    subjectName: "$subject.subjectName",
                    name: {$first: "$name"},
                    dateBeginAhead: {$first: "$dateBeginAhead"},
                    examMode: {$first: "$examMode"},
                    center: {$first: "$center"},
                    course: {$first: "$course"},
                    batch: {$first: "$batch"},
                    batchNames: {$addToSet: "$batch.batchName"},
                    topic: {$addToSet:  { '$topics.topics': { $elemMatch: { product: "xyz", score: { $gte: 8 } } } }},
                    //student: {$addToSet: { "_id":"$student", "studentCenter": "$studentCenter" ,"score": "$score", "isSubmit": "$isSubmit", "examMode": "$examMode", "isCorrected": "$isCorrected"}}
                }
            },
            {$unwind: {path: "$batchNames"}},*/
        ]).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            result = serviceUtils.parseDbObjectAsJSON(result)
            res.status(200).send({sucess: true, data: getTopicObjs(result)});
        });
    };

    this.getExamBySub = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'ExamScheduleLog', examSchedulechema);
        var queryParams = req.query;
        var filterObj = req.query.filter;
        var  filter = queryParams.filter || {};
        var contentType = queryParams.contentType || 'VExamSchedule';
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var findQuery = {$and: [{"practice.student": objectId(req.session.lid)}, {"practice.isSubmit": false}]};
        var matchQuery  = {$and: [{"paperConfig.topic": objectId(req.params.tid)}, {"paperConfig.subject": objectId(req.params.sid)}]};
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
                "$lookup": {
                    "from": "ExamConfig",
                    "localField": "config",
                    "foreignField": "_id",
                    "as": "config"
                }
            },
            {
                "$lookup": {
                    "from": "Sheet",
                    "localField": "paperConfig",
                    "foreignField": "_id",
                    "as": "paperConfig"
                }
            },
            {$unwind: {path: "$paperConfig"}},
            {$unwind: {path: "$config"}},
            {
                "$match": matchQuery
            },
            {
                "$lookup": {
                    "from": "StudentExam",
                    "localField": "_id",
                    "foreignField": "examId",
                    "as": "practice"
                }
            },
            {$unwind: {path: "$practice"}},
            {
                "$match": findQuery
            },
            //{$unwind: {path: "$course"}},
            //{$unwind: {path: "$subject"}},
            /* {
             $group: {
             _id: "$subject._id",
             subjectName: "$subject.subjectName",
             name: {$first: "$name"},
             dateBeginAhead: {$first: "$dateBeginAhead"},
             examMode: {$first: "$examMode"},
             center: {$first: "$center"},
             course: {$first: "$course"},
             batch: {$first: "$batch"},
             batchNames: {$addToSet: "$batch.batchName"},
             topic: {$addToSet:  { '$topics.topics': { $elemMatch: { product: "xyz", score: { $gte: 8 } } } }},
             //student: {$addToSet: { "_id":"$student", "studentCenter": "$studentCenter" ,"score": "$score", "isSubmit": "$isSubmit", "examMode": "$examMode", "isCorrected": "$isCorrected"}}
             }
             },
             {$unwind: {path: "$batchNames"}},*/

            {
                $project : {
                    subject : 1,
                    _id: 1,
                    name: 1,
                    dateBeginAhead: 1,
                    dateEnd: 1,
                    examMode: 1,
                    topic: 1,
                    topicObjs: 1,
                    practice: 1,
                    config: 1,
                    paperConfig: 1
                }
            }
        ]).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            result = serviceUtils.parseDbObjectAsJSON(result);

            dateUtils.formatObjectsDates(result, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                if(!_.isEmpty(result)) {
                    result[0].avgTime = !_.isEmpty(result) && !_.isEmpty(result[0].practice.questions) ? _.meanBy(result[0].practice.questions, function(o) { return +o.attempted_time; })  : 0
                }
                res.status(200).send({sucess: true,data: getAvgTime(result)});
            })
        });
    };


    function getAvgTime(data) {
        if(!_.isEmpty(data)) {
            _.forEach(data, function (val) {
                val.practice = JSON.parse(JSON.stringify(val.practice));
                if(val.practice.questions) {
                } else {
                    val.practice['questions'] = val.paperConfig.questions;
                }
                val.avgTime = !_.isEmpty(val.practice.questions) ? _.meanBy(val.practice.questions, function (o) {
                    return +o.attempted_time;
                }) : 0
            })
        }
        return data;
    }

    function getTopicNames(data) {
        var dataObj = []
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                _.forEach(data, function (value, key) {
                    var topicDatas=[];
                    if(!_.isEmpty(value.topic)){
                        _.forEach(value.topic, function (topicId, key) {
                            _.forEach(value.topicObjs.topicObjs, function (topicObj, key) {
                                var topics = _.filter(topicObj.topics, {'_id': topicId})
                                if(topics.length > 0) {
                                    topicDatas.push(topics[0]);
                                }
                            });
                        });
                        value.topicObjs = _.uniqBy(topicDatas, '_id');
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

    this.getDetailsByExamId = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Exam', examSchema);

        var findQuery = {};

        var matchObj = {};
        var filterObj = req.query.filter;
        if(req.query.id){
            findQuery = {"examId": objectId(req.query.id)};
        }

        if(filterObj) {

            matchObj.$and = [];

            if(filterObj.student) {
                var studentIds = filterObj.student.value;
                var arr = studentIds.map(i => objectId(i));
                matchObj.$and.push({"student._id": { $in: arr}});
                findQuery = {"examId": objectId(filterObj.student.id)};
            }

            if(filterObj.center) {
                var centerIds = filterObj.center.value;
                var centerArr = centerIds.map(i => objectId(i));
                matchObj.$and.push({"student.center": { $in: centerArr}});
                findQuery = {"examId": objectId(filterObj.center.id)};
            }

        }

        Model.aggregate([
            {
                $match: findQuery
            },
            {
                "$lookup": {
                    "from": "Student",
                    "localField": "student",
                    "foreignField": "_id",
                    "as": "student"
                }
            },
            {$unwind: {path: "$student"}},
            {
                $match: matchObj
            },
            {
                "$lookup": {
                    "from": "Center",
                    "localField": "student.center",
                    "foreignField": "_id",
                    "as": "studentCenter"
                }
            },
            {$unwind: {path: "$studentCenter"}},
            {$sort: {score: -1}}
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };


    this.getStudentResultView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Exam', examSchema);

        var findQuery = {"_id": objectId(req.params._id)};

        Model.find(findQuery).populate({path: 'config'})
            .populate({path: 'paperConfig', populate: {path: 'questions'}})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                convertQuestionObj(result, function (err, data) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({data: data});
                });

            });
    };

    this.getTopStudents = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Exam', examSchema);

        Model.aggregate([
            {$match: {dateBeginAhead: {"$lte": new Date()}, isSubmit: true}},
            {$sort: {dateBeginAhead: -1, score: -1}},
            {
                $lookup: {
                    "from": "Student",
                    "localField": "student",
                    "foreignField": "_id",
                    "as": "student"
                }
            },
            {$unwind: {path: "$student"}},
            {
                $lookup: {
                    "from": "Center",
                    "localField": "student.center",
                    "foreignField": "_id",
                    "as": "studentCenter"
                }
            },
            {$unwind: {path: "$studentCenter"}},
            {
                $group: {
                    _id: "$examId",
                    name: {$first: "$name"},
                    dateBeginAhead: {$first: "$dateBeginAhead"},
                    students: {$addToSet: { "_id":"$student", "studentCenter": "$studentCenter" ,"score": "$score", "isSubmit": "$isSubmit", "examMode": "$examMode", "isCorrected": "$isCorrected"}}
                }
            },
            { "$project": {
                students: { "$slice": [ "$students", 10 ] },
                dateBeginAhead: "$dateBeginAhead",
                name: "$name"
            }},
            {$limit: 5}
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });

        /*var findQuery = {examId: objectId(req.params._id), isSubmit: true};

        Model.find(findQuery).sort( { score: -1 } ).limit(10)
            .populate({path: 'student'})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });*/
    };

    function convertQuestionObj(result, next) {
        result = JSON.parse(JSON.stringify(result))
        if(!_.isEmpty(result)) {
            _.forEach(result, function (value, index) {
                var paperQuestions = value.paperConfig.questions;
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

    function getScheduledExamForStudents(req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);

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
            .populate({path: 'examId', populate: [{path: 'course'} , {path: 'batch'}, {path: 'paperConfig', populate: {path: 'questions'}}, {path: 'config'}]})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
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
                            res.status(200).send({data: resObj});
                        }

                    })
                } else {
                    res.status(200).send({data: resObj});
                }




        });

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
        createExamSchedule(req, {}, function (err, req, result) {
            if(err) {
                return next(err);
            } else {
                if(false) {
                    var data = {};
                    async.waterfall([
                        constructUsers.bind(null, req, data),
                        notification.sendNotification.bind(),
                        notification.saveNotificationInfo.bind()
                    ], function (err, result, data) {
                        if (err) {
                            return next(err);
                        }
                        return res.status(200).send({success:true});
                    });
                } else {
                    return res.status(200).send({success:true});
                }
            }
        });
    };

    function constructUsers(req, data, callback) {
        var arr = [];
        var body = req.body;
        async.each(body.users, function (data, cb) {
            var obj = {};
            obj.to = data.phoneNo;
            obj.message = 'test';
            arr.push(obj);
            cb(null, arr);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
        });
        data.users = arr;
        callback(null, req, data);
    }

    /*function createExamSchedule(req, resp, next){
        var Model = models.get(req.session.lastDb, 'Exam', examSchema);
        var bulk = Model.collection.initializeOrderedBulkOp();
        var body = req.body;
        var ObjectId = mongoose.Types.ObjectId;
        var id = ObjectId();

        student.getStudentsByCCB(req, function (err, data) {
            if(err) {
                return next(err);
            } else {
                if(!_.isEmpty(data)) {
                    req.body.users = data;
                    var arr =  body.batches.map(i => objectId(i));
                    var center =  body.center.map(i => objectId(i));
                    async.each(data, function (value, cb) {
                        bulk.insert({
                            examId: id,
                            name: body.name,
                            dateGenerated: Date.now(),
                            dateBeginAhead: new Date(body.dateBeginAhead),
                            center: center,
                            course: objectId(body.course),
                            batch: arr,
                            config: objectId(body.config),
                            paperConfig: objectId(body.paperConfig),
                            student: objectId(value._id),
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
                            next(err, req, result);
                        });
                    });
                } else {
                    return next({message: 'no students found', stack: ''});
                }
            }
        });
    };*/
    function createExamSchedule(req, resp, next){
        async.waterfall([
            createExamSche.bind(null, req),
            saveExamStudent.bind()
        ], function (err, req, result) {
            if(_.isEmpty(result)) {
                return next({message: 'no students found', stack: ''});
            } else {
                next(err, req, result);
            }
        })
    }

    function saveExamStudent(req, schedule, callback){
        var Model = models.get(req.session.lastDb, 'StudentPractice', examStudentSchema);
        var bulk = Model.collection.initializeOrderedBulkOp();
        var body = req.body;

        student.getStudentsByCCB(req, function (err, data) {
            if(err) {
                callback(err, req, null);
            } else {
                if(!_.isEmpty(data)) {
                    req.body.users = data;
                    async.each(data, function (value, cb) {
                        bulk.insert({
                            pexamId: schedule._id,
                            dateBeginAhead: new Date(body.dateBeginAhead),
                            student: objectId(value._id),
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

    function createExamSche(req, callback) {
        var PracticeScheduleModel = models.get(req.session.lastDb, 'PracticeSchedule', examScheduleSchema);
        var body = req.body;
        var arr =  body.batches.map(i => objectId(i));
        var center =  body.center.map(i => objectId(i));
        var dataObj = {
            questionMark : body.questionMark,
            negativeMark : body.negativeMark,
            duration : body.duration,
            name : body.name,
            canReview : body.canReview,
            autoCorrect : body.autoCorrect,
            timeBegin : body.timeBegin,
            timeEnd : body.timeEnd,
            num : body.num,
            subject : objectId(body.subject),
            topic : objectId(body.topic),
            questionMode : body.questionMode,
            questions : body.questions,
            center : body.center,
            course : objectId(body.course),
            batch : body.batches,
            dateBeginAhead : body.dateBeginAhead,
            examMode : body.examMode

        };
        var PracticeSchedule = new PracticeScheduleModel(dataObj);

        PracticeSchedule.save(function (err, schedule) {
            callback(err, req, schedule)
        });

    }

    this.updateExamSchedule = function (req, res, next) {
        async.waterfall([
            deleteExamByExamID.bind(null, req),
            deleteSExamByExamID.bind(),
            createExamSchedule.bind()
        ], function(err, req, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success:true});
        });
    };

    this.updateStudentExamPaper = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentPractice', examStudentSchema);

        var body = req.body;

        if(body.qid != "") {
            var oqid = objectId(body.qid);
            var oaid = body.userAns != '' ? objectId(body.userAns) : null;
            var obj =  {qid: oqid, userAns: oaid, correct: false, wrong: false, skipped: false, sid: objectId(body.sid), tid: objectId(body.tid)};
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
            savePracticeMertrics.bind()
        ], function (err, req, result) {
            if(err) {
                return next(err);
            } else {
                res.status(200).send({success: true, data: result.finalScore});
            }
        })

    };


    function updateExamById(req, callback) {
        var Model = models.get(req.session.lastDb, 'StudentPractice', examStudentSchema);
        Model.find({"_id": objectId(req.params._id)}).populate({path: 'pexamId'}).populate({path: 'questions.qid'}).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            var data = result[0];
            var updateOptions = {};
            updateOptions.isSubmit = true;
            updateOptions.dateSubmit = new Date();
            updateOptions.submitIP = utils.getClientIP(req);
            if (data.pexamId.autoCorrect) {
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

    function savePracticeMertrics(req, data, callback) {

        var Model = models.get(req.session.lastDb, 'PracticeMetrics', practiceMetricsSchema);
        var bulk = Model.collection.initializeOrderedBulkOp();
        var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
        Model.remove({"pexam": objectId(data.pexamId._id), student: student}, function (err, result) {
            if(err) {
                callback(err, req, []);
            } else {
                getPracMeObj(req, data, function (err, result) {
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
                                    callback(err, req, result);
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
                        score += (data.pexamId.questionMark) ? data.pexamId.questionMark : qid.point;
                    } else {
                        score -= (data.pexamId.negativeMark) ? data.pexamId.negativeMark : 0;
                    }
                }
            }
        })
        return score;
    };

    function getPracMeObj(req, data, callback) {
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
                _.forEach(val, function(value, index){
                    var qid = value.qid;
                    total_skipped = value.skipped ? (total_skipped + 1) : total_skipped;
                    total_wrong = value.wrong ? (total_wrong + 1) : total_wrong;
                    total_correct = value.correct ? (total_correct + 1) : total_correct;
                    total_ques = val.length;

                    if(qid !== '' && !_.isEmpty(qid)) {
                        var ans = qid.form[0].ans;
                        var findAns = _.filter(ans, 'isValid');
                        var correctAns = _.isEmpty(findAns) ? null : findAns[0];
                        total_marks += (data.pexamId.questionMark) ? data.pexamId.questionMark : qid.point;
                        if(!_.isEmpty(correctAns)) {
                            if(value.userAns == correctAns._id) {
                                total_marks_scored += (data.pexamId.questionMark) ? data.pexamId.questionMark : qid.point;
                            } else {
                                total_marks_scored -= (data.pexamId.negativeMark) ? data.pexamId.negativeMark : 0;
                            }
                        }
                    }

                    if(index == val.length -1) {
                        subObj.total_skipped = total_skipped;
                        subObj.total_wrong  = total_wrong;
                        subObj.total_correct = total_correct;
                        subObj.total_ques = total_ques;
                        subObj.total_marks = total_marks;
                        subObj.total_marks_scored = total_marks_scored;
                        subObj.aggregate_percentage = ((total_marks_scored/total_marks) * 100);
                        subObj.pexam = data.pexamId._id ? data.pexamId._id : null;
                        subObj.student = data.student ? (data.student) : null;
                        subObj.topic = objectId(value.tid);
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

    this.deleteExam = function (req, res, next) {
        async.parallel({
            delExamSchedule : deleteExamByExamID.bind(null, req),
            delExam : deleteSExamByExamID.bind(null, req, {}),
        }, function (err, req, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true, data: result});
        })
    };

    this.deletePracticeExam = function (req, res, next) {
        async.parallel({
            delExamSchedule : deleteExamByExamID.bind(null, req),
            delExam : deleteSExamByExamID.bind(null, req, {}),
        }, function (err, req, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true, data: result});
        })
    };

    function deleteExamByExamID(req, next) {
        var Model = models.get(req.session.lastDb, 'PracticeSchedule', examScheduleSchema);

        Model.remove({
            _id: objectId(req.params.examId)
        }, function (err, result) {
            next(err, req, result);
        });
    }

    function deleteSExamByExamID(req, result, next) {
        var Model = models.get(req.session.lastDb, 'StudentPractice', examStudentSchema);

        Model.remove({
            pexamId: objectId(req.params.examId)
        }, function (err, result) {
            next(err, req, result);
        });
    }
};

module.exports = Module;
