var mongoose = require('mongoose');
var subjectTopicSchema = mongoose.Schemas.SubjectTopics;
var ClassDetailSchema = mongoose.Schemas.ClassDetails;
var questionSchema = mongoose.Schemas.Question;
var subTopicSchema = mongoose.Schemas.SubTopics;
var objectId = mongoose.Types.ObjectId;
var scheduleConverter = require('../converters/vBatchscheduler.converter');
var async = require('async');
var pageHelper = require('../helpers/pageHelper');
var baseHandler = require('./baseHandler')
var _ = require("lodash");

var Module = function (models) {

    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'SubjectTopics', subjectTopicSchema);
        var body = req.body;
        var topic = body.topics;
        var subject = body.subject;
        var classDetail = body.classDetail;
        var title = body.title;
        var topicObj = topic;

        topicObj = _.forEach(topicObj, function (o) { o._id = objectId() });
        _.forEach(topic, function (obj) {
            obj.topics = topicObj;
        });
        var data = {}

        data.topics = topicObj;
        data.subject = subject;
        data.classDetail = classDetail;
        data.title = title;

        Model.insertMany(data, function (err, result) {

            if (err) {
                return next(err);
            }
            var query =  _.map(result, '_id');
            getById(req,{_id: {$in: query}}, function (err, result) {
                if (err) {
                    return next(err);
                }

                var data = JSON.parse(JSON.stringify(result));
                _.forEach(data, function (val) {
                    val.topicNames = _.map(val.topics, 'name');
                });
                res.status(201).send(data);
            });
        });
    };

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'SubjectTopics', subjectTopicSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;

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
                .find({})
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate({path : 'classDetail'})
                .populate({path : 'subject'})
                .populate({path : 'title'})
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
            var data = JSON.parse(JSON.stringify(result));
            _.forEach(data[1], function (value, key) {
                value['topicNames'] = _.map(value.topics, 'name');
            })

            res.status(200).send({total: data[0], data: data[1]});
        });
    };


    this.getSubTopics = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'SubTopics', subTopicSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;

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
                {
                    "$lookup": {
                        "from": "SubjectTopics",
                        "localField": "topic",
                        "foreignField": "topics._id",
                        "as": "topics"
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
                {$unwind: {path: "$topics"}},
                {$unwind: {path: "$subject"}},
                {$unwind: {path: "$classDetail"}},
            ], cb);
        };

        async.parallel([getData, getTotal], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: _.flatten(scheduleConverter.scheduleTopicObjs(result[0]))});
        });
    }

    this.getTopicsByBatch = function (req, res, next) {
        var batch = baseHandler.getBatch(req)
        var Subject = models.get(req.session.lastDb, 'SubjectTopics', subjectTopicSchema);
        var data = req.query;
        var query;
        query = Subject.find({subject: data.subject}).populate({path : 'course'});
        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: response});

        });
    };

    this.getBySubjectId = function (req, res, next) {
        var Subject = models.get(req.session.lastDb, 'SubjectTopics', subjectTopicSchema);
        var data = req.query;
        var query;
        query = Subject.find({subject: data.subject}).populate({path : 'course'});
        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: response});

        });
    };

    this.getBySubjectCourseId = function (req, res, next) {
        var Subject = models.get(req.session.lastDb, 'SubjectTopics', subjectTopicSchema);
        var data = req.query;
        var query, findQuery;
        if(data.multi) {
            findQuery = {subject: data.subject, course: {$in :data.course.map(i => mongoose.Types.ObjectId(i))}};
        } else {
            findQuery = {subject: data.subject, course: data.course};
        }
        query = Subject.find(findQuery).populate({path : 'subject'}).populate({path : 'course'});
        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: response});

        });
    };


    this.remove = function (req, res, next) {
        var id = req.params.id;
        var Journal = models.get(req.session.lastDb, 'SubjectTopics', subjectTopicSchema);
        var questionModel = models.get(req.session.lastDb, 'Question', questionSchema);
        var topics = req.body.topic;
        var query = {topic: {"$in": topics.map(function(el) { return objectId(el._id)})}};

        questionModel.find(query, function (err, question){
            if (err) {

                return next(err);
            }

            if (id && question.length == 0) {
                Journal.findByIdAndRemove(id, function (err, journal) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: journal});
                })
            }
            else {
                res.status(401).send("topic is already Associated");
            }
        })

    }


    this.update = function (req, res, next) {
        var topicListModel = models.get(req.session.lastDb, 'SubjectTopics', subjectTopicSchema);
        var body = req.body;
        var _id = req.params.id;
        topicListModel.findByIdAndUpdate(_id, body, {new: true}, function (err, list) {
            if (err) {
                return next(err);
            }
            getById(req,{id: _id}, function (err, result) {
                if (err) {
                    return next(err);
                }

                var data = JSON.parse(JSON.stringify(result));
                data['topicNames'] = _.map(data.topics, 'name');

                res.status(200).send(data);
            });
            //res.status(200).send({success: 'SubjectTopics updated success'});
        });
    };

    function getById(req, options, callback) {
        var isId = options && !_.isUndefined(options.id) ? true : false;
        var Model = models.get(req.session.lastDb, 'SubjectTopics', subjectTopicSchema);
        if(isId) {
            var id = options.id;
            Model.findById(id)
                .populate({path : 'course'})
                .populate({path : 'subject'})
                .populate({path : 'classDetail'})
                .populate({path : 'title'})
                .exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        } else {
            var query = options;
            Model.find(query)
                .populate({path : 'course'})
                .populate({path : 'subject'})
                .populate({path : 'classDetail'})
                .populate({path : 'title'})
                .exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        }
    }
};

module.exports = Module;