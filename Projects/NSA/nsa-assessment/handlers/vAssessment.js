/**
 * Created by kiranmai on 16/02/18.
 */

var mongoose = require('mongoose');
var questionSchema = mongoose.Schemas.Question;
var sheetSchema = mongoose.Schemas.Sheet;
var examConfigSchema = mongoose.Schemas.ExamConfig;
var examSchema = mongoose.Schemas.Exam;
var examScheduleSchema = mongoose.Schemas.ExamSchedule;
var examScheduleLogSchema = mongoose.Schemas.ExamScheduleLog;
var examStudentSchema = mongoose.Schemas.StudentExam;
var questionMetrics = mongoose.Schemas.QuestionMetrics;
var practiceStudentSchema = mongoose.Schemas.StudentPractice;
var subjectMetricsSchema = mongoose.Schemas.SubjectMetrics;
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
var moment = require('moment');
var generateColor = require('generate-color')

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
        var matchData = {};
        var  filter = queryParams.filter || {};
        var contentType = queryParams.contentType || 'VQuestionBank';
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

        if(req.body.ids) {
            var ids =  req.body.ids.map(i => objectId(i));
            matchData = {
                $and: [
                    {"_id": {$in: ids}},
                ]
            };
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
            sort = {'lastModified': -1};
        }

        if(optionsObject) {
            queryObject.$and.push(optionsObject);
        }

        var findObj = [
            {
                $match: matchData
            },
            {
                "$match": matchQuery
            },
            {
                "$lookup": {
                    "from": "title",
                    "localField": "title",
                    "foreignField": "_id",
                    "as": "title"
                }
            },
            {
                $unwind: {path: "$title", preserveNullAndEmptyArrays: true}
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
                    "from": "ClassDetails",
                    "localField": "classDetail",
                    "foreignField": "_id",
                    "as": "classDetail"
                }
            },
            {
                "$lookup": {
                    "from": "SubTopics",
                    "localField": "subTopic",
                    "foreignField": "subtopic._id",
                    "as": "subTopObjs"
                }
            },
            {
                "$lookup": {
                    "from": "SubjectTopics",
                    "localField": "topic",
                    "foreignField": "topics._id",
                    "as": "topicObjs"
                }
            }, {
                $unwind: {path: "$subject", preserveNullAndEmptyArrays: true}
            },  {
                "$match": queryObject
            }, {
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            },
            {
                $unwind: '$root'
            },
            {
                $project: {
                    total        : 1,
                    _id          : '$root._id',
                    desc         : '$root.desc',
                    code         : '$root.code',
                    type         : '$root.type',
                    title        : '$root.title',
                    classDetail  : {$arrayElemAt: ['$root.classDetail',0]},
                    subTopic     : '$root.subTopic',
                    subject      : '$root.subject',
                    topic        : '$root.topic',
                    point        : '$root.point',
                    weightage    : '$root.weightage',
                    form         : '$root.form',
                    numForm      : '$root.numForm',
                    lastModified : '$root.lastModified',
                    topicObjs    : {$arrayElemAt: ['$root.topicObjs', 0]},
                    subTopObjs   : {$arrayElemAt: ['$root.subTopObjs', 0]}
                }
            },
            {
                $sort  : sort
            },{
                $skip  : skip
            }, {
                $limit : limit
            }
        ]

        Model.aggregate(findObj) .allowDiskUse(true). exec(function (err, result) {
            var firstElement;
            var response = {};

            if (err) {
                return next(err);
            }

            firstElement = result[0];
            var count = firstElement && firstElement.total ? firstElement.total : 0;
            response.total = count;
            response.count = result.length;
            response.data = subTopObjs(topicObjs(result))

            res.status(200).send(response)

        });
    };

    this.getQuestion = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        Model.aggregate([
            {$match: {"_id" : objectId(req.params._id)}},
            {
                "$lookup": {
                    "from": "title",
                    "localField": "title",
                    "foreignField": "_id",
                    "as": "title"
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
                    "from": "ClassDetails",
                    "localField": "classDetail",
                    "foreignField": "_id",
                    "as": "classDetail"
                }
            },
            {
                "$lookup": {
                    "from": "SubTopics",
                    "localField": "subTopic",
                    "foreignField": "subtopic._id",
                    "as": "subTopic"
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
            {$unwind: {path: "$title"}},
            {$unwind: {path: "$classDetail"}},
            {$unwind: {path: "$subject"}},
            {$unwind: {path: "$subTopic"}},
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

    this.getQuestionsByTopic = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        var body = req.body;
        var orQuery = [];
        var findQuery = {};

        async.each(body.subjects, function (value, key) {
            if(value.subtopic && value.subtopic.length > 0){
                var subtopic = _.map(value.subtopic, function(course){ return mongoose.Types.ObjectId(course)});
                orQuery.push({$and: [{subject: value.subjectId}, {subTopic: {$in: subtopic}}]});
            } else {
                orQuery.push({$and: [{subject: value.subjectId}, {topic: {$in: value.topics}}]});
            }
        });

        if(Array.isArray(body.classDetail)){
            var classDetail = _.map(body.classDetail, function(classs){ return mongoose.Types.ObjectId(classs)});
            findQuery = {classDetail: {$in: classDetail}, $or: orQuery}
        } else {
            findQuery = {classDetail: objectId(body.classDetail), $or: orQuery};
        }


        Model.find(findQuery).exec(function (err, result) {
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
        var findQuery = {};

        async.each(body.subjects, function (value, key) {
            if(value.subtopic && value.subtopic.length > 0){
                var arr =  value.subtopic.map(i => objectId(i));
                orQuery.push({$and: [{subject: objectId(value.subjectId)}, {subTopic: {$in: arr}}]});
            } else {
                var arr =  value.topics.map(i => objectId(i));
                orQuery.push({$and: [{subject: objectId(value.subjectId)}, {topic: {$in: arr}}]});
            }
        });

        if(Array.isArray(body.classDetail)){
            var course = _.map(body.classDetail, function(course){ return mongoose.Types.ObjectId(classDetail)});
            findQuery = {classDetail: {$in: course}, $or: orQuery}
        } else {
            findQuery = {classDetail: objectId(body.classDetail), $or: orQuery};
        }

        Model.aggregate([
            {$match: findQuery},
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
        var findQuery = {};

        async.each(body.subjects, function (value, key) {
            var arr =  value.topics.map(i => objectId(i));
            orQuery.push({$and: [{subject: objectId(value.subjectId)}, {topic: {$in: arr}}]});
        });

       /* if(Array.isArray(body.course)){
            var course = _.map(body.course, function(course){ return mongoose.Types.ObjectId(course)});
            findQuery = {course: {$in: course}, $or: orQuery}
        } else {
            findQuery = {course: objectId(body.course), $or: orQuery};
        }*/

        Model.aggregate([
            {$match: findQuery},
            {$match: {$or: orQuery}},
            {$group: {_id: {topic: "$topic", weightage: "$weightage"}, total: {$sum: 1}}},
            {$group: {_id: "$_id.topic", details: {$addToSet: {weightage: "$_id.weightage", questions: "$total", noOfQuestions: 0}}}},
            {
                "$lookup": {
                    "from": "SubjectTopics",
                    "localField": "_id",
                    "foreignField": "topics._id",
                    "as": "topic"
                }
            },
            {$unwind: {path: "$topic"}}
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
        var findQuery = {};

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

        if(Array.isArray(body.course)){
            var course = _.map(body.course, function(course){ return mongoose.Types.ObjectId(course)});
            findQuery = {course: {$in: course}, $or: orQuery}
        } else {
            findQuery = {course: objectId(body.course), $or: orQuery};
        }

        Model.aggregate([
            {$match: findQuery},
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
                    dataObj.push(_.sampleSize(val, qObj[0].nOfQ));
                }/* else  {
                    dataObj.push(_.sample(val, 1));
                }*/
            });

            res.status(200).send({data: _.flatten(dataObj)});

        });
    };

    this.createQuestion = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        var System = models.get(req.session.lastDb, 'CodeType', codeTypeSchema);
        var codeType = 'question';
        //var _id;
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
                var body = req.body.questions;
                /*var course =  body.course.map(i => objectId(i));
                body.course = course;*/
                body.classDetail = objectId(body.classDetail)
                body.subject = objectId(body.subject);
                body.topic = objectId(body.topic);
                body.title = objectId(body.title);
                body.lastModified = new Date();
                body.code = utils.generateCode(codeType, +data.maxNo + 1);
                var user = new Model(body);
                /*if(body.length > 1){
                    for(var k = 0; k < body.length; k++){
                        var code = +data.maxNo + k + 1;
                        body[k].code = utils.generateCode(codeType, code);
                        body[k].course = objectId(body[k].course);
                        body[k].subject = objectId(body[k].subject);
                        body[k].topic = objectId(body[k].topic);
                        body[k].lastModified = new Date();
                    }
                } else {
                    body[0].course = objectId(body[0].course);
                    body[0].subject = objectId(body[0].subject);
                    body[0].topic = objectId(body[0].topic);
                    body[0].lastModified = new Date();
                    body[0].code = utils.generateCode(codeType, +data.maxNo + 1);
                }*/
                return user.save(body);
            }).then(function (data) {
            if (!data) {
                return Promise.reject('Save new test failed');
            }
            //_id = data._id;
            // update number
            var incrementValue = data && !_.isUndefined(data.length) ? data.length : 1;
            return System.update({codeType: codeType}, {$inc: { maxNo: incrementValue }});

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
            user.title = req.body.title;
            // user.category = req.body.category;
            user.type = req.body.type;
            user.point = req.body.point;
            user.form = req.body.form;
            user.lastModified = new Date();
            //user.course = req.body.course.map(i => objectId(i));
            user.subject = objectId(req.body.subject);
            user.topic = objectId(req.body.topic);
            user.classDetail = objectId(req.body.classDetail);
            user.subTopic = objectId(req.body.subTopic);
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
                    "from": "title",
                    "localField": "title",
                    "foreignField": "_id",
                    "as": "title"
                }
            },
            {
                "$lookup": {
                    "from": "ClassDetails",
                    "localField": "classDetail",
                    "foreignField": "_id",
                    "as": "classDetail"
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
                    "from": "SubjectTopics",
                    "localField": "topic",
                    "foreignField": "topics._id",
                    "as": "topicObjs"
                }
            },
            {
                "$lookup": {
                    "from": "SubTopics",
                    "localField": "subTopic",
                    "foreignField": "subtopic._id",
                    "as": "subTopicObj"
                }
            },
            /*{$unwind: {path: "$course"}},*/
            {$unwind: {path: "$classDetail"}},
            {$unwind: {path: "$title"}}
        ]).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(getSubTopicNames(getTopicNames(result)));
        });
    };


    function getSubTopicNames(data) {
        var dtObj = []
        if(!_.isEmpty(data)) {
            try {
                data = JSON.parse(JSON.stringify(data));
                _.forEach(data, function (value, key) {
                    var subTopDatas=[];
                    if(!_.isEmpty(value.subTopic)){
                        _.forEach(value.subTopic, function (subtopId, key) {
                            _.forEach(value.subTopicObj, function (subTopicObjs, key) {
                                var subtopic = _.filter(subTopicObjs.subtopic, {'_id': subtopId})
                                if(subtopic.length > 0) {
                                    subTopDatas.push(subtopic[0]);
                                }
                            });
                        });
                        value.stData = _.uniqBy(subTopDatas, '_id');
                    }
                });
                return data;
            }
            catch (err) {
                console.log("err", err);
            }
        } else {
            return dtObj;
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
                user.classDetail = body.classDetail;
                user.subTopic = body.subTopic;
                user.subject = body.subject;
                user.title = body.title;
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
            .populate({path : 'title'})
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


    this.updateSheet = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Sheet', sheetSchema);
        var body = req.body;

        Model.findById(req.params._id, function (err, user) {
            if (err) {
                return next(err);
            }
            user.title = body.title;
            user.classDetail = body.classDetail;
            user.subTopic = body.subTopic;
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
        var exam = models.get(req.session.lastDb, 'ExamSchedule', examScheduleSchema);
        var id = req.params._id;
        var query = {};

        query.paperConfig = objectId( req.params._id);
        exam.find(query, function (err, paperConfig) {
            if (err) {
                return next(err);
            }
            if (id && paperConfig.length == 0) {
                Model.findByIdAndRemove({_id: req.params._id}, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: true, data: result});
                });
            } else {
                res.status(401).send("Question Config associated with assessment creation");
            }
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
        var exam = models.get(req.session.lastDb, 'ExamSchedule', examScheduleSchema);
        var id = req.params._id;
        var query = {};

        query.config = objectId( req.params._id);

        exam.find(query, function (err, config) {
            if (err) {
                return next(err);
            }
            if(id && config.length == 0) {
                Model.findByIdAndRemove({_id: req.params._id}, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: true, data: result});
                });
            } else {
                res.status(401).send("Assessment Duration associated with assessment creation");
            }
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
        async.waterfall([ getExamById.bind(null, req), saveQuestions.bind()], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        })


    }

    function getExamById(req, callback) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);

        var queryParams = req.query;
        var filter = queryParams.filter || null;
        var findQuery = {examId : objectId(req.params.id)}
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
            .populate({path: 'examId', populate: [{path: 'course'} , {path: 'batch'}, {path: 'paperConfig', populate: {path: 'questions'}}, {path: 'config'}]})
            .exec(function (err, result) {
                if (err) {
                    callback(err, req, {})
                }
                var obj1 = JSON.parse(JSON.stringify(result));
                var obj2 = JSON.parse(JSON.stringify(result.examId));
                var mergedObj = _.merge(obj1, obj2);
                dateUtils.formatObjectsDates(mergedObj, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                    mergedObj.id = result.id;
                    callback(err, req, mergedObj)
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
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query = { $and : [{
            student: req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid)},
            {mexam: objectId(req.params.id)}]
        };

        model.find(query).populate({path: 'student'}).populate({path: 'mexam'}).populate({path: 'subject'}).exec(function (err, response) {
            callback(err, response)
        })
    }

    function getSubAggregateData(req, callback) {
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query = { $and : [{
            student: req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid)},
            {mexam: objectId(req.params.id)}]
        };
        var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
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
                        _id: {subjectId: '$subject._id', subject: '$subject', student : '$student'},
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
                        _id: {subjectId: '$_id.subjectId', subject: '$_id.subject'},
                        item : {$addToSet: {student : '$_id.student', aggregate_percentage: '$aggregate_percentage', totalSkipped: '$totalSkipped', totalCorrect: '$totalCorrect',totalWrong: '$totalWrong',totalMarks: "$totalMarks", totalScore : "$totalScore" , totalQues: "$totalQues" }},
                    }
            },
            {$unwind: {path: '$item'}},
            {"$sort": { "item.aggregate_percentage": 1} },
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
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        /*var query = { $and : [{
            student: req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid)},
            {mexam: objectId(req.params.id)}]
        };*/
        var query = {};
        if(req.query.subjectId) {
            query = {'subject' : objectId(req.query.subjectId)}
        }
        var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
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
                        _id: {examId: '$exam._id', exam: '$exam', student : '$student'},
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
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        /*var query = { $and : [{
         student: req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid)},
         {mexam: objectId(req.params.id)}]
         };*/
        var query = {};
        if(req.query.subjectId) {
            query = {'subject' : objectId(req.query.subjectId)}
        }
        var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
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
                        _id: {examId: '$exam._id', exam: '$exam', student : '$student'},
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
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query = { $and : [{
            student: req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid)}
            ]
        };
        var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
        model.aggregate([
            {$match: query},
            {
                "$lookup": {
                    "from": "ExamSchedule",
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
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query = { $and : [{
            student: req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid)},
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
            if (err)
                next(err, null)
            else
                res.send({success: true, data: result})
        })

    }

    function getClassAverage(req, data, callback) {
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query =  {mexam: objectId(req.params.id)}
        var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
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
                    "localField": "schedule._id",
                    "foreignField": "examId",
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
        var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
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
                    "localField": "schedule._id",
                    "foreignField": "examId",
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
                        _id: {subjectId: '$subject._id', section: '$schedule.section', subject: '$subject'},
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
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        var query =  {mexam: objectId(req.params.id)}
        var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
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
                    aggregate_percentage: 1,
                }
            },
            {$unwind: {path: '$schedule'}},
            {
                $group:
                    {
                        _id: {subjectId: '$subject._id', subject: '$subject', student : '$student'},
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
                        item : {$addToSet: {student : '$_id.student', aggregate_percentage: '$aggregate_percentage', totalSkipped: '$totalSkipped', totalCorrect: '$totalCorrect',totalWrong: '$totalWrong',totalMarks: "$totalMarks", totalScore : "$totalScore" , totalQues: "$totalQues", countData: '$countData', totalTime: '$totalTime',secAvg: { "$multiply" : [100,{"$divide" : [data.secScore, { "$multiply" : ['$totalMarks',(data.scountData)]}] }]}, classAvg: { "$multiply" : [100,{"$divide" : [data.classScore,  { "$multiply" : ['$totalMarks',(data.scountData)]}] }]}}},
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
                        _id: {subjectId: '$_id.subjectId', subject: '$_id.subject', section: '$_id.section'},
                        item : {$push:{"student" :'$item.student', aggregate_percentage : '$item.aggregate_percentage', totalSkipped: '$item.totalSkipped',totalCorrect: '$item.totalCorrect', totalWrong:'$item.totalWrong', totalMarks: '$item.totalMarks', totalScore: '$item.totalScore', totalQues: '$item.totalQues', totalTime: '$totalTime', secAvg: '$item.secAvg', classAvg: '$item.classAvg', rank: { $sum: [ "$rank", 1 ]}}},

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
            if (err)
                next(err, null)
            else
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
            res.send({success: true, data: result})
        })

    }


    this.getMockSubjectReport = function (req, res, next) {
        var model = models.get(req.session.lastDb, "SubjectMetrics", subjectMetricsSchema);
        function getSubjectList(req, callback) {
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

        function getCourseDuration(req, callback) {
            req.query.id = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
            student.getStudDataById(req, function (err ,result) {
                var courseObj = {}
                try {
                   var start = moment(result.batch.startDate, ' MM/DD/YYYY');
                   var end = moment(result.batch.endDate, 'MM/DD/YYYY');
                   var now = moment(new Date(), 'MM/DD/YYYY');
                   var tDays = moment.duration(end.diff(start)).asDays();
                   var cDays = moment.duration(now.diff(start)).asDays();
                   if(cDays > tDays) {
                       courseObj.progress = 100;
                       courseObj.rdays = 0;
                   } else {
                       courseObj.progress = (cDays /tDays) * 100;
                       courseObj.rdays = tDays - cDays;
                   }
                   callback(err, courseObj);
               } catch (err) {
                   callback(err, null);
               }

            })
        }

        async.parallel ( {
            subjectList : getSubjectList.bind(null, req),
            //course : getCourseDuration.bind(null,req)
            //aggregateList :getAggregateData.bind(null, req)
        }, function (err, result) {
            if (err)
                next(err, null)
            else
                res.send({success: true, data: result})
        })

    }

    this.getSubjectWiseReport = function (req, res, next) {
        var model = models.get(req.session.lastDb, "Question", questionSchema);
        var data = req.query;
        var filter = data.filter || {};
        var match = filterMapper.mapDateFilter(filter, {contentType: 'SubjectWise'});
        var matchObj = {"$and":[{"$or":[{"lastModified":{"$gte":new Date(match[0]),"$lte": new Date(match[1])}}]}]};
            model.aggregate([
                {
                    '$match': matchObj
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
                    $group: {
                        _id: {"subject": '$subject._id', "subjectName":"$subject.subjectName"},
                        sum: {$sum: 1},
                    }
                },
                {
                    $project: {
                        _id    : "$_id.subjectName",
                        count  : "$sum",
                    }
                }
            ]).exec(function (err, result) {
            if (err)
                next(err, null)
            else
                res.send(result)
        })

    }

    this.getTopicWiseReport = function (req, res, next) {
        var model = models.get(req.session.lastDb, "Question", questionSchema);
        var data = req.query;
        var filter = data.filter || {};
        var match = filterMapper.mapDateFilter(filter, {contentType: 'SubjectWise'});
        var matchObj = {"$and":[{"$or":[{"lastModified":{"$gte":new Date(match[0]),"$lte": new Date(match[1])}}]}]};
        model.aggregate([
            {
                '$match': matchObj
            },
            {
                $group: {
                    _id: {"topic": '$topic'},
                    sum: {$sum: 1},
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
            {
                $project: {
                    _id    : "$_id.topic",
                    topicObjs: "$topicData",
                    count  : "$sum",
                }
            }
        ]).exec(function (err, result) {
            if (err)
                next(err, null)
            else
                res.send(groupTopicObjs(result))
        })

    }

    this.getExamConductReport = function (req, res, next) {
        var model = models.get(req.session.lastDb, "ExamSchedule", examScheduleSchema);
        var data = req.query;
        var filter = data.filter || {};
        var match = filterMapper.mapDateFilter(filter, {contentType: 'SubjectWise'});
        var matchObj = {"$and":[{"$or":[{"dateBeginAhead":{"$gte":new Date(match[0]),"$lte": new Date(match[1])}}]}]};
        model.aggregate([
            {
                '$match': matchObj
            },
            {
                $group: {
                    _id: {"examMode": '$examMode'},
                    sum: {$sum: 1},
                }
            },
            {
                $project: {
                    _id    : {
                        $cond: { if: { $eq: [ "$_id.examMode", true ] }, then: 'Online', else: 'Offline' }
                    },
                    count  : "$sum",
                }
            }
        ]).exec(function (err, result) {
            if (err)
                next(err, null)
            else
                res.send(result)
        })

    }

    this.getStudentExamReport = function (req, res, next) {
        var model = models.get(req.session.lastDb, "StudentExam", examStudentSchema);
        var data = req.query;
        var filter = data.filter || {};
        var match = filterMapper.mapDateFilter(filter, {contentType: 'SubjectWise'});
        var matchObj = {"$and":[{"$or":[{"dateBeginAhead":{"$gte":new Date(match[0]),"$lte": new Date(match[1])}}]}, {'examMode': req.query.mode == 'true' ? true : false}]};
        model.aggregate([
            {
                '$match': matchObj
            },
            {$group: {_id: {examId: "$examId"}, sum: {$sum: 1}, "item": { $push:  {"isSubmit": "$isSubmit"}}}},
            {
                "$lookup": {
                    "from": "ExamSchedule",
                    "localField": "_id.examId",
                    "foreignField": "_id",
                    "as": "examSchedule"
                }
            },
            {$unwind: {path: "$examSchedule"}},
            {
                $project : {
                    _id: '$examSchedule.name',
                    sum: '$sum',
                    count: {
                        $filter: {
                            input: '$item',
                            as: "num",
                            cond:
                                { $eq: [ "$$num.isSubmit", true ] }
                        }
                    },
                }
            },

            {
                $project : {
                    _id: '$_id',
                    courseCount: '$sum',
                    batchCount: {$size: "$count"}
                }
            }

        ]).exec(function (err, result) {
            if (err)
                next(err, null)
            else
                res.send(result)
        })

    }


    this.getStudentExam = function (req, res, next) {
        async.parallel ( {
            mockExam : getScheduledExamForStudents.bind(null, req),
            practiceExam : getPracticeExam.bind(null,req)
            //aggregateList :getAggregateData.bind(null, req)
        }, function (err, result) {
            if (err)
                next(err, null)
            else
                res.send({success: true, data: result})
        })
    }

    this.getExam = function (req, res, next) {
        if(req.session.user.student != null) {
            getScheduledExamForStudents(req, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
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
            var sort;
            var paginationObject = pageHelper(data);
            var limit = paginationObject.limit;
            var skip = paginationObject.skip;
            var matchObj = {};
            var queryObject = {};
            queryObject.$and = [];
            var optionsObject = {};
            var keySort;

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
                sort = {'lastModified': -1};
            }

            if(optionsObject) {
                queryObject.$and.push(optionsObject);
            }
            Model.aggregate([
                {
                    '$match': matchQuery
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
                {
                    $match: matchObj
                },
                {$unwind: {path: "$config",  preserveNullAndEmptyArrays: true}},
                {$unwind: {path: "$paperConfig",  preserveNullAndEmptyArrays: true}},
                {
                    "$match": queryObject
                },
                {
                    $group: {
                        _id: "$_id",
                        name: {$first: "$name"},
                        examMode: {$first: "$examMode"},
                        section: {$first: "$section"},
                        configPaper: {$addToSet: {paperConfigs:"$paperConfig"} },
                        config: {$first: "$config"},
                        paperConfig: {$first: "$paperConfig"},
                        description :{$first : "$description"},
                        log: {$first: '$log'}
                    }
                },
                {$unwind: {path: "$configPaper",  preserveNullAndEmptyArrays: true}},
                {
                    $sort  : sort
                },{
                    $skip  : skip
                }, {
                    $limit : limit
                }
            ]).exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                result = serviceUtils.parseDbObjectAsJSON(result)
                dateUtils.formatObjectsDates(result, ['dateBeginAhead', 'dateGenerated', 'dateCorrect', 'dateRead', 'dateSubmit'], 'type2', function (err, data) {
                    res.status(200).send({total:result.length,  data: result});
                })
            });
        }
    };

    this.getDetailsByExamId = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);

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
           /* {
                "$lookup": {
                    "from": "Student",
                    "localField": "student",
                    "foreignField": "_id",
                    "as": "student"
                }
            },*/
            {
                "$lookup": {
                    "from": "ExamScheduleLog",
                    "localField": "examId",
                    "foreignField": "_id",
                    "as": "log"
                }
            },
            {$unwind: {path: "$log"}},
            {
                "$lookup": {
                    "from": "ExamConfig",
                    "localField": "log.config",
                    "foreignField": "_id",
                    "as": "config"
                }
            },
            {
                "$lookup": {
                    "from": "Sheet",
                    "localField": "log.paperConfig",
                    "foreignField": "_id",
                    "as": "sheet"
                }
            },
            {$unwind: {path: "$config"}},
            {$unwind: {path: "$sheet"}},
            /*{$unwind: {path: "$student"}},*/
            {
                $match: matchObj
            },
           /* {
                "$lookup": {
                    "from": "Center",
                    "localField": "student.center",
                    "foreignField": "_id",
                    "as": "studentCenter"
                }
            },
            {$unwind: {path: "$studentCenter"}},*/
            {$sort: {score: -1}},
            {
                $project: {
                    'studentName': '$userName',
                    'school_id': '$school_id',
                    'totalScore': { $multiply:[{$size : '$sheet.questions'}, '$config.questionMark']},
                    'score': '$score',
                    'isSubmit' :'$isSubmit'
                }
            }

        ], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };


    this.getStudentResultView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);
        var findQuery = {"examId": objectId(req.params._id), student: objectId(req.session.lid)};
        Model.find(findQuery)
            .populate({path: 'examId', populate: [{path: 'course'} , {path: 'batch'}, {path: 'paperConfig', populate: {path: 'questions'}}, {path: 'config'}]})
            .populate({path: 'student'})
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


    function getPracticeExam(req, callback) {
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
                /*if (err) {
                 return next(err);
                 }*/
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
    }

    function getScheduledExamForStudents(req, callback) {
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
            .populate({path: 'examId', populate: [{path: 'course'} , {path: 'batch'}, {path: 'paperConfig', populate: [{path: 'questions'}, {path: 'subject'}]}, {path: 'config'}]})
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
            //saveExamStudent.bind()
        ], function (err, req, result) {
            next(err, req, result)
        })
    }

    function updateExamSchedule(req, resp, next){
        req.body.status = true;
        async.waterfall([
            createExamSche.bind(null, req),
            createExamScheLog.bind(),
            saveExamStudent.bind()
        ], function (err, req, result) {
            if(true) {
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

        student.getStudentsByCCB(req, function (err, data) {
            if(err) {
                callback(err, req, null);
            } else {
                if(!_.isEmpty(data)) {
                    req.body.users = data;
                    async.each(data, function (value, cb) {
                        bulk.insert({
                            examId: schedule._id,
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
        var ExamScheduleModel = models.get(req.session.lastDb, 'ExamSchedule', examScheduleSchema);
        var body = req.body;
       // var section =  objectId(body.section)

        var dataObj = {
            name: body.name,
            dateBeginAhead: Date.now(),
            config: objectId(body.config),
            paperConfig: objectId(body.paperConfig),
            examMode: body.examMode,
           // section       : section
        };
        var ExamSchedule = new ExamScheduleModel(dataObj);

        ExamSchedule.save(function (err, schedule) {
            callback(err, req, schedule)
        });

    }

    function createExamScheLog(req, data, callback) {
        var ExamScheduleLogModel = models.get(req.session.lastDb, 'ExamScheduleLog', examScheduleLogSchema);
        var body = req.body;
        var section =  objectId(body.section)
        var classId =  objectId(body.classDetail)

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
            scheduleId: data._id
        };
        var ExamScheduleLog = new ExamScheduleLogModel(dataObj);

        ExamScheduleLog.save(function (err, schedule) {
            callback(err, req, schedule)
        });

    }

    this.updateExamSchedule = function (req, res, next) {
        async.waterfall([
            deleteExamByExamID.bind(null, req),
            deleteSExamByExamID.bind(),
            updateExamSchedule.bind()
        ], function(err, req, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success:true});
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
            if(err) {
                return next(err);
            } else {
                res.status(200).send({success: true, data: result.finalScore});
            }
        })

    };


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

        var Model = models.get(req.session.lastDb, 'SubjectMetrics', subjectMetricsSchema);
        var bulk = Model.collection.initializeOrderedBulkOp();
        var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
        Model.remove({"mexam": objectId(data.examId._id), student: student}, function (err, result) {
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

    this.bulkRemove = function (req, res, next) {
        var ExamSchedule = models.get(req.session.lastDb, 'ExamSchedule', examScheduleSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        ExamSchedule.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send(removed);
        });
    };

    function deleteExamByExamID(req, next) {
        var Model = models.get(req.session.lastDb, 'ExamSchedule', examScheduleSchema);

        Model.remove({
            _id: objectId(req.params.examId)
        }, function (err, result) {
            next(err, req, result);
        });
    }

    function deleteSExamByExamID(req, result, next) {
        var Model = models.get(req.session.lastDb, 'ExamScheduleLog', examScheduleLogSchema);

        Model.remove({
            examId: objectId(req.params.examId)
        }, function (err, result) {
            next(err, req, result);
        });
    }
};

module.exports = Module;
