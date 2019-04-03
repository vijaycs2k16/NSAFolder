/**
 * Created by Manivanan on 28/12/18.
 */

var mongoose = require('mongoose');
var testConfigSchema = mongoose.Schemas.TestConfigurationSchema;
var questionUsageSchema = mongoose.Schemas.QuestionUsage;
var questionSchema = mongoose.Schemas.Question;
var FilterMapper = require('../helpers/filterMapper');
var filterMapper = new FilterMapper();
var codeTypeSchema = mongoose.Schemas.CodeType;
var async = require('async');
var utils = require('../utils/serviceUtils');
var _ = require('lodash');
var moment = require('moment');

var Module = function (models) {
    var ObjectId = mongoose.Types.ObjectId;

    /// Test Configuration

    this.create = function (req, res, next) {
        async.waterfall([
            getCodeTypes.bind(null, req),
            createTestSchedule.bind(),
            saveQuesUsage.bind()
        ], function (err, req, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true, data: result});
        });
    };

    function getCodeTypes(req, callback) {
        var System = models.get(req.session.lastDb, 'CodeType', codeTypeSchema);
        var codeType = 'testConfig';

        System.findOneAndUpdate({codeType: codeType},{$inc:{'maxNo':1}}).exec(function (err, result) {
            callback(null, req, result);
        });
    };

    function createTestSchedule (req, data, callback){
        var Model = models.get(req.session.lastDb, 'TestConfiguration', testConfigSchema);
        var codeType = 'testConfig';
        var body = req.body;

        if(!data || !data.maxNo) {
            return callback('The maximum number of inquiry questions failed');
        }

        var dataObj = {
            classDetail  : ObjectId(body.classDetail),
            title        : ObjectId(body.title),
            subject      : body.subject,
            topic        : body.topic,
            subTopic     : body.subTopic != "" ? body.subTopic : [],
            name         : body.schedule,
            dateBeginAhead: new Date(body.dateBeginAhead),
            code         : utils.generateCode(codeType, data.maxNo),
            lastModified : new Date(),
            num          : body.num,
            remark       : body.remark,
            questions    : body.questions,
            questionMode : body.questionMode,
            selectMode   : body.selectMode,
            examMode     : body.examMode,
            canReview    : body.canReview,
            autoCorrect  : body.autoCorrect,
            isFull       : body.isFull,
            isGenerated  : body.isGenerated,
            isPublic     : body.isPublic,
            timeBegin    : new Date(body.timeBegin),
            timeEnd      : new Date(body.timeEnd),
            ipPattern    : body.ipPattern,
            questionMark : body.questionMark,
            negativeMark : body.negativeMark,
            duration     : body.duration,
            isSchedule   : body.isSchedule,
            weekNo       : body.weekNo,
            monthNo      : body.monthNo,
            year         : body.year
        };
        var user = new Model(dataObj);
        user.save(function (err, data) {
            callback(err, req, data);
        });
    }


    function saveQuesUsage(req, data, callback) {
        var quesUsage = models.get(req.session.lastDb, 'QuestionUsage', questionUsageSchema);
        var bulk = quesUsage.collection.initializeOrderedBulkOp();

        async.each(data.questions, function (value, cb) {
            bulk.find({question  : ObjectId(value), isUsed : true}).upsert().update( {$inc: {'count': 1} } );
            cb(null, bulk);
        }, function (err) {
            if (err) {
                return callback(err);
            }
            bulk.execute(function (err, result) {
                callback(err, req, result);
            });
        });
    }

    /*this.createTestSche = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'TestConfiguration', testConfigSchema);
        var System = models.get(req.session.lastDb, 'CodeType', codeTypeSchema);

        var codeType = 'sheet';
        var _id;
        var body = req.body;
        Promise.resolve()
            .then(function(){
                return System.findOne({codeType:codeType},{maxNo:1});
            })
            .then(function(data){

                if(!data || !data.maxNo) { return Promise.reject('The maximum number of inquiry questions failed'); }
                var user      = new Model();

                try {
                    user.classDetail = ObjectId(body.classDetail);
                    user.title = ObjectId(body.title);
                    user.subject = body.subject;
                    user.topic = body.topic;
                    user.subTopic = body.subTopic != "" ? body.subTopic : [];
                    user.name = body.schedule;
                    user.code = utils.generateCode(codeType, data.maxNo);
                    user.lastModified = new Date();
                    user.num = body.num;
                    user.remark = body.remark;
                    user.questions = body.questions;
                    user.questionMode = body.questionMode;
                    user.examMode = body.examMode;
                    user.canReview = body.canReview;
                    user.autoCorrect = body.autoCorrect;
                    user.isFull = body.isFull;
                    user.isGenerated = body.isGenerated;
                    user.isPublic = body.isPublic;
                    user.timeBegin = body.timeBegin;
                    user.timeEnd = body.timeEnd;
                    user.ipPattern = body.ipPattern;
                    user.questionMark = body.questionMark;
                    user.negativeMark = body.negativeMark;
                    user.duration = body.duration;
                    user.isSchedule = body.isSchedule;
                    user.weekNo = body.weekNo;
                    user.monthNo = body.monthNo;
                    user.year = body.year;
                    //user.dateBeginAhead = body.schedule;
                } catch (err) {
                    console.log("err", err)
                }

                return user.save();
            })
            .then(function(data){
                if (!data) {
                    return Promise.reject('Failed to save the new test');
                }
                _id = data._id;
                return System.update({codeType:codeType},{$inc:{'maxNo':1}});

            })
            .then(function(data){
                if (!data || !data.ok) {
                    return Promise.reject('Failed to update the maximum number');
                }
                //res.status(201).send({sucess: true, data: []});
                getById(req, {id: _id}, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                 res.status(201).send(result);
                });
            })
            .catch(function(error){
                res.send(error);
            });
    };*/

    function getById(req, options, next) {
        var id = options.id;
        var Model = models.get(req.session.lastDb, 'TestConfiguration', testConfigSchema);

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
    }

    this.getTestConfig = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'TestConfiguration', testConfigSchema);
        var getTotal;
        var getData;

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
            Model.aggregate([
                /*{
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
                },*/

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
                        "from": "Question",
                        "localField": "questions",
                        "foreignField": "_id",
                        "as": "questions"
                    }
                },
                {
                    "$lookup": {
                        "from": "question_usage",
                        "localField": "questions._id",
                        "foreignField": "question",
                        "as": "qCount"
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
                {$unwind: {path: "$classDetail"}},
                {
                    $project: {
                        topic        : 1,
                        name         : 1,
                        num          : 1,
                        remark       : 1,
                        questions    : 1,
                        questionMode : 1,
                        selectMode   : 1,
                        examMode     : 1,
                        canReview    : 1,
                        autoCorrect  : 1,
                        isFull       : 1,
                        isGenerated  : 1,
                        isPublic     : 1,
                        timeBegin    : 1,
                        timeEnd      : 1,
                        ipPattern    : 1,
                        questionMark : 1,
                        negativeMark : 1,
                        duration     : 1,
                        isSchedule   : 1,
                        weekNo       : 1,
                        monthNo      : 1,
                        year         : 1,
                        dateBeginAhead:1,
                        topicObjs    : 1,
                        classDetail  : 1,
                        qCount        :1,
                        //qCount       :{ $size: '$qCount'}
                    }
                },
                {
                    $sort: {'dateBeginAhead': -1}
                },
            ]).exec(function (err, result) {
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
            res.status(200).send({total: result[0], data: getTopicNames(result[1])});
        });
    };

    function getSubTopicNames(data) {
        var dtObj = [];
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
    }

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
    }

    this.updateScheduleStatus = function(req, res, next) {
        var config = models.get(req.session.lastDb, 'TestConfiguration', testConfigSchema);
        var body = req.body;

        config.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $set: body } , function (err, result) {
            if(err){
                next(err);
            } else {
                res.status(200).send({success: true, message: 'Updated Successfully'});
            }
        });
    };

    this.remove = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'TestConfiguration', testConfigSchema);
        var id = req.params.id;

        Model.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: result});
        })
    };

    this.getRandomWithOutSelected = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        var noOfQuestions = req.params.limit;
        var body = req.body;
        var orQuery = [];
        var findQuery = {};
        var checkQuery = {};

        async.each(body.subjects, function (value, key) {
            if(value.subtopic && value.subtopic.length > 0){
                var arr =  value.subtopic.map(i => ObjectId(i));
                orQuery.push({$and: [{subject: ObjectId(value.subjectId)}, {subTopic: {$in: arr}}]});
            } else {
                var arr =  value.topics.map(i => ObjectId(i));
                orQuery.push({$and: [{subject: ObjectId(value.subjectId)}, {topic: {$in: arr}}]});
            }
        });

        if(Array.isArray(body.classDetail)){
            var course = _.map(body.classDetail, function(course){ return mongoose.Types.ObjectId(classDetail)});
            findQuery = {classDetail: {$in: course}, $or: orQuery}
        } else {
            findQuery = {classDetail: ObjectId(body.classDetail), $or: orQuery};
        }

        if(req.body.selectMode == "true"){
            checkQuery = {sizeQuestion: {$eq : 0}}
        } /*else  {
            checkQuery = {sizeQuestion: {$eq : 1}}
        }*/

        Model.aggregate([
            {$match: findQuery},
            {$match: {$or: orQuery}},
            {$sample: {size: parseInt(noOfQuestions)}},
            {
                "$lookup": {
                    "from": "question_usage",
                    "localField": "_id",
                    "foreignField": "question",
                    "as": "question"
                }
            },
            {
                $project: {
                    _id          : 1,
                    form         : 1,
                    question     : 1,
                    sizeQuestion : {$size: '$question'}
                }
            },
            {$match: checkQuery}
        ]).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.getManualSelected = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Question', questionSchema);
        var body = req.body;
        var orQuery = [];
        var findQuery = {};
        var checkQuery = {};

        async.each(body.subjects, function (value, key) {
            if(value.subtopic && value.subtopic.length > 0){
                var arr =  value.subtopic.map(i => ObjectId(i));
                orQuery.push({$and: [{subject: ObjectId(value.subjectId)}, {subTopic: {$in: arr}}]});
            } else {
                var arr =  value.topics.map(i => ObjectId(i));
                orQuery.push({$and: [{subject: ObjectId(value.subjectId)}, {topic: {$in: arr}}]});
            }
        });

        if(Array.isArray(body.classDetail)){
            var classDetail = _.map(body.classDetail, function(classs){ return mongoose.Types.ObjectId(classs)});
            findQuery = {classDetail: {$in: classDetail}}
        } else {
            findQuery = {classDetail: ObjectId(body.classDetail)};
        }

        if(req.body.selectMode == "true"){
            checkQuery = {sizeQuestion: {$eq : 0}}
        } /*else  {
            checkQuery = {sizeQuestion: {$eq : 1}}
        }*/

        Model.aggregate([
            {$match: findQuery},
            {$match: {$or: orQuery}},
            {
                "$lookup": {
                    "from": "question_usage",
                    "localField": "_id",
                    "foreignField": "question",
                    "as": "question"
                }
            },
            {
              $project: {
                  _id          : 1,
                  question     : 1,
                  form         : 1,
                  sizeQuestion : {$size: '$question'}
              }
            },
            {$match: checkQuery}
        ]).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

};

module.exports = Module;
