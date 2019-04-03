var mongoose = require('mongoose');
var studyContentSchema = mongoose.Schemas.StudyContent;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');
var objectId = mongoose.Types.ObjectId;
var serviceUtils = require('../utils/serviceUtils')

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
        var Model = models.get(req.session.lastDb, 'StudyContent', studyContentSchema);
        var queryParams = req.query;
        var filterObj = req.query.filter;
        var  filter = queryParams.filter || {};
        var contentType = queryParams.contentType || 'VExamSchedule';
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var queryObject = {};
        var findQuery = {$and: [{"student": objectId(req.session.lid)}]};
        if(req.session.classId) {
            queryObject = {$and: [{"classDetail": objectId(req.query.classId)}]};
        }


       /* if (filter && typeof filter === 'object') {
            optionsObject = filterMapper.mapFilter(filter, {
                contentType: contentType
            });
        }

        if(optionsObject) {
            queryObject.$and.push(optionsObject);
        }*/

        Model.aggregate([
            {
                "$match": queryObject
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
            /*{
                "$lookup": {
                    "from": "PracticeSchedule",
                    let: { order_item: "$topic", order_qty: "$subject._id" , course: objectId(req.session.courseId)},
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { $eq: [ "$topic",  "$$order_item" ] },
                                        { $eq: [ "$subject", "$$order_qty" ] },
                                        { $eq: [ "$course", "$$course" ] }
                                    ]
                                }
                            }
                        },
                    ],
                    "as": "schedule"
                }
            },
            {$unwind: {path: "$schedule",
                preserveNullAndEmptyArrays: true}},
            {
                "$lookup": {
                    "from": "StudentPractice",
                    let: { order_item: "$schedule._id", student: objectId(req.session.lid)},
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { $eq: [ "$pexamId",  "$$order_item" ] },
                                        { $eq: [ "$student", "$$student" ] },
                                    ]
                                }
                            }
                        },
                    ],
                    "as": "practice"
                }
            },
            {$unwind: {path: "$practice",
                preserveNullAndEmptyArrays: true}},*/
            {
                $group: {
                    _id: {subjectId: "$subject._id", subject: "$subject", topic : '$topic'},
                    //name: {$first: "$schedule.name"},
                   // dateBeginAhead: {$first: "$schedule.dateBeginAhead"},
                 //   examMode: {$first: "$schedule.examMode"},
                    videos: {$first: '$videos'},
                    notes: {$first: '$pdf'},
                    //scheduleData: {$push: { practice: '$practice', isSubmit: '$practice.isSubmit', schedule: '$schedule'}},
                  //  content: {$push: { practice: '$practice', videos: '$videos', notes: '$notes'}},
                   // questions: { $sum: { $size: "$schedule.questions" }},
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
                    name: 1,
                    dateBeginAhead: 1,
                    examMode: 1,
                    topic: 1,
                    topicData: 1,
                    count: 1,
                }
            },



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
