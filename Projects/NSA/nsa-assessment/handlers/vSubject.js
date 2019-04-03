var mongoose = require('mongoose');
var subjectSchema = mongoose.Schemas.Subject;
var batchSchedule = mongoose.Schemas.BatchSchedule;
var subjectTopics = mongoose.Schemas.SubjectTopics;
var topicSchema = mongoose.Schemas.Topic;
var courseModel = mongoose.Schemas.Course;
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');
var scheduleConverter = require('../converters/vBatchscheduler.converter');
var _ = require('lodash');

var Module = function (models) {

    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Subject', subjectSchema);
        var body = req.body;
        var subject = new Model(body);
        subject.save(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(201).send(result);
        });
    };

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Subject', subjectSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var findQuery = req.query.active ? { subjectStatus: true } : {};

        getTotal = function (cb) {
            Model
                .find(findQuery)
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

    this.getForSubjectView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Subject', subjectSchema);
        var subjectTopicModel = models.get(req.session.lastDb, 'SubjectTopics', subjectTopics);
        var getSubject;
        var getSubjectTopic;
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var findQuery = { subjectStatus: true }

        getSubject = function (cb) {
            Model
                .find(findQuery)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
        };

        getSubjectTopic = function (cb) {
            subjectTopicModel.aggregate([
                {
                    $project: {
                        _id: '$subject'
                    }
                },
            ],function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result || 0);
            });
        };

        async.parallel([getSubject, getSubjectTopic], function (err, result) {
            var Subject =_.differenceBy(JSON.parse(JSON.stringify(result[0])), JSON.parse(JSON.stringify(result[1])), '_id');
            if (err) {
                return next(err);
            }
            res.status(200).send(result[0]);
        });
    };

    this.getTopics = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'SubjectTopics', subjectTopics);
        var courseModel = models.get(req.session.lastDb, 'Course', courseModel);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var getCourseData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var findQuery = req.query.active ? { subjectStatus: true } : {};

        getTotal = function (cb) {
            Model
                .find()
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
                        "from": "Subject",
                        "localField": "subject",
                        "foreignField": "_id",
                        "as": "subject"
                    }
                },
                {$unwind: {path: "$subject"}},
                {$unwind: {path: "$topics"}},
                {
                    "$lookup": {
                        "from": "Topic",
                        "localField": "topics._id",
                        "foreignField": "topics._id",
                        "as": "topic"
                    }
                },
                {$group: {_id: "$subject", topics: {$addToSet: { topic: '$topics', course: "$topic"}}}},
                {$group: {_id: "", data: {$addToSet: {"topics": "$topics", "subject":"$_id","_id": "$_id._id"}}}},

                {
                    $project: {
                        subject: "$data"
                    }
                },
                ],function (err, response) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, response);
                });
        };

        getCourseData = function (cb) {
            courseModel
                .find()
                .exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result || 0);
                });
        };

        async.parallel([getTotal, getData, getCourseData], function (err, result) {
            if (err) {
                return next(err);
            }
            if(!_.isEmpty(result[1])){
                result[1] = result[1][0].subject;
                result[1][0].course = result[2];
            }
            res.status(200).send({total: result[0], data: result[1]});
        });
    };

    this.getSubTopicAsso = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'SubjectTopics', subjectTopics);
        var courseModel = models.get(req.session.lastDb, 'Course', courseModel);
        var objectId = mongoose.Types.ObjectId;
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var getCourseData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var findQuery = req.query.active ? { subjectStatus: true } : {};

        getTotal = function (cb) {
            Model
                .find()
                .count(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result || 0);
                });
        };

        getData = function (cb) {
            Model.aggregate([{
                 $match: {
                 "classDetail": objectId(data.classDetail)
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
                {$unwind: {path: "$subject"}},
                {$unwind: {path: "$topics"}},
                {
                    "$lookup": {
                        "from": "Topic",
                        "localField": "topics._id",
                        "foreignField": "topics._id",
                        "as": "topic"
                    }
                },
                {
                    "$lookup": {
                        "from": "SubTopics",
                        "localField": "topics._id",
                        "foreignField": "topic",
                        "as": "subtopic"
                    }

                },
                {$group: {_id: "$subject", topics: {$addToSet: { topic: '$topics', course: "$topic", subtopic: '$subtopic'}}}},
                // {$group: {_id: "$subject", topics: {$addToSet: { topic: '$topics', course: "$topic"}}}},
                {$group: {_id: "", data: {$addToSet: {"topics": "$topics", "subject":"$_id","_id": "$_id._id"}}}},

                {
                    $project: {
                        subject: "$data"
                    }
                },
            ],function (err, response) {
                if (err) {
                    return cb(err);
                }

                cb(null, response);
            });
        };

        getCourseData = function (cb) {
            courseModel
                .find({"classDetail": objectId(data.classDetail)})
                .exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result || 0);
                });
        };

        async.parallel([getTotal, getData, getCourseData], function (err, result) {
            if (err) {
                return next(err);
            }
            if(!_.isEmpty(result[1])){
                result[1] = result[1][0].subject;
                result[1][0].course = result[2];
            }
            res.status(200).send({total: result[0], data: result[1]});
        });
    };

    this.getBySubjectScheduleAndMonth = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'BatchSchedule', batchSchedule);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var queryParams = req.query;
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var matchObj = {};


        if(data){
            matchObj = {$and:[{'subject': ObjectId(data.subject)}, {'center': ObjectId(data.center)}]};
        }


        getTotal = function (cb) {
            Model
                .find((matchObj) ? matchObj : {})
                .count(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result || 0);
                });
        };

        getData = function (cb) {
            Model.aggregate([
                {$match: matchObj},
                {$match: {
                    classDate: {
                        "$gte": new Date(+queryParams.year, +queryParams.month - 1, 1),
                        "$lte": new Date(+queryParams.year, +queryParams.month, 1)
                    }   }
                },
                {
                    "$lookup": {
                        "from": "Topic",
                        "localField": "topics",
                        "foreignField": "topics._id",
                        "as": "topic"
                    }
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
                        "from": "Subject",
                        "localField": "subject",
                        "foreignField": "_id",
                        "as": "subject"
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
                        "from": "Employees",
                        "localField": "faculty",
                        "foreignField": "_id",
                        "as": "faculty"
                    }
                },
                {$unwind: {path: "$center"}},
                {$unwind: {path: "$course"}},
                {$unwind: {path: "$batch"}},
                {$unwind: {path: "$subject"}},
                {$unwind: {path: "$faculty"}},
                {
                    $project: {
                        center         : 1,
                        faculty        : 1,
                        batch          : 1,
                        course         : 1,
                        subject        : 1,
                        classStartTime : 1,
                        classEndTime   : 1,
                        duration       : 1,
                        classDate      : 1,
                        topic          : 1,
                        topics         : 1,
                        RoundedDate    : {
                            year   : {$year:"$classDate"},
                            month  : {$month:"$classDate"},
                            day    : {$dayOfMonth:"$classDate"}

                        },
                    }
                }, {
                    $project: {
                        center                 : 1,
                        faculty                : 1,
                        batch                  : 1,
                        course                 : 1,
                        subject                : 1,
                        classStartTime         : 1,
                        classEndTime           : 1,
                        topic                  : 1,
                        duration               : 1,
                        classDate              : 1,
                        RoundedDate            : 1,
                        topics                 : 1,
                    }
                },

            ], cb);
        };

        async.parallel([getTotal, getData], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({total: result[0], data: scheduleConverter.scheduleObjs(result[1])});
        });
    };


    this.getBySubjectSchedule = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'BatchSchedule', batchSchedule);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var queryParams = req.query;
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var matchObj = {};

        if(data){
            matchObj = {$and:[{'course': ObjectId(data.course)}, {'center': ObjectId(data.center)}, {'batch': ObjectId(data.batch)}]};
        }

        if(data.classId) {
            matchObj = {$and:[{'course': ObjectId(data.course)}, {'center': ObjectId(data.center)}, {'batch': ObjectId(data.batch)}, {'classDetail': ObjectId(data.classId)}]};
        }

        getTotal = function (cb) {
            Model
                .find((matchObj) ? matchObj : {})
                .count(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result || 0);
                });
        };

        getData = function (cb) {
            Model.aggregate([
                {$match: matchObj},
                /*{
                    "$lookup": {
                        "from": "Topic",
                        "localField": "topics",
                        "foreignField": "topics._id",
                        "as": "topic"
                    }
                },*/
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
                        "from": "Subject",
                        "localField": "subject",
                        "foreignField": "_id",
                        "as": "subject"
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
                        "from": "Employees",
                        "localField": "faculty",
                        "foreignField": "_id",
                        "as": "faculty"
                    }
                },
                {$unwind: {path: "$center"}},
                {$unwind: {path: "$course"}},
                {$unwind: {path: "$batch"}},
                {$unwind: {path: "$subject"}},
                {$unwind: {path: "$faculty", preserveNullAndEmptyArrays: true}},
                {
                    $project: {
                        center         : 1,
                        faculty        : 1,
                        batch          : 1,
                        course         : 1,
                        subject        : 1,
                        classStartTime : 1,
                        classEndTime   : 1,
                        duration       : 1,
                        classDate      : 1,
                        topic          : 1,
                        topics         : 1,
                        topicDetails   : 1,
                        subtopics      : 1,
                        feedback       : 1,
                        type           : 1,
                        RoundedDate    : {
                            year   : {$year:"$classDate"},
                            month  : {$month:"$classDate"},
                            day    : {$dayOfMonth:"$classDate"}

                        },
                    }
                }, {
                    $project: {
                        center                 : 1,
                        faculty                : 1,
                        batch                  : 1,
                        course                 : 1,
                        subject                : 1,
                        classStartTime         : 1,
                        classEndTime           : 1,
                        topic                  : 1,
                        duration               : 1,
                        classDate              : 1,
                        RoundedDate            : 1,
                        topics                 : 1,
                        topicDetails           : 1,
                        subtopics              : 1,
                        feedback               : 1,
                        type                   : 1,
                    }
                },

            ], cb);
        };

        async.parallel([getTotal, getData], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({total: result[0], data: result[1]});
        });
    };


    this.getSubjectsByCC = function (req, res, next) {
        var Subject = models.get(req.session.lastDb, 'BatchSchedule', batchSchedule);
        var data = req.query;
        var query;

        Subject.aggregate([
            {$match: {$and: [{"course": mongoose.Types.ObjectId(data.courseId)}, {"center": mongoose.Types.ObjectId(data.centerId)}]}},
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
                    "from": "Subject",
                    "localField": "subject",
                    "foreignField": "_id",
                    "as": "subject"
                }
            },
            {$unwind: {path: "$center"}},
            {$unwind: {path: "$course"}},
            {$unwind: {path: "$subject"}},
            {$group: {_id: "", data: {$addToSet: {"subject" :"$subject"}}}},
            {
                $project: {
                    subject: "$data"
                }
            }
            ],function (err, response) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: _.isEmpty(response) ? [] : response[0].subject});

        });
    };

    this.getSubjectsByCourse = function (req, res, next) {
        var batch = models.get(req.session.lastDb, 'BatchSchedule', batchSchedule);
        var topic = models.get(req.session.lastDb, 'Topic', topicSchema);
        var data = req.query;
        var findQuery = {}
        var courseId = data.multi ? {$in: data.courseId.map(i => mongoose.Types.ObjectId(i)) } : mongoose.Types.ObjectId(data.courseId);

        if(data.subjectStatus != undefined) {
            findQuery ={ 'subject.subjectStatus': data.subjectStatus == 'true' ? true : false }
        }

        var coll = data.paper ? topic : batch;
        coll.aggregate([
                {$match: {course: courseId}},
            {
                "$lookup": {
                    "from": "Course",
                    "localField": "course",
                    "foreignField": "_id",
                    "as": "course"
                }
            }, {
                    "$lookup": {
                        "from": "Subject",
                        "localField": "subject",
                        "foreignField": "_id",
                        "as": "subject"
                    }
            },{
                $match: findQuery
            },
                {$unwind: "$course"},
                {$unwind: "$subject"},
                {$group: {_id: "", data: {$addToSet: {"subject" :"$subject"}}}},
                {
                    $project: {
                        subject: "$data"
                    }
                }
            ], function (err, data) {
                if(err) {
                    next(err, null);
                } else {
                    res.status(200).send({data: _.isEmpty(data) ? [] : data[0].subject});
                }
            })
    };

    this.getSubjectsByClassDetail = function (req, res, next) {
        if(req.query.mobile) {
            var subTop = models.get(req.session.lastDb, 'SubjectTopics', subjectTopics)
            var data = req.query;
            var findQuery = {}
            var objectId = mongoose.Types.ObjectId;
            var classId = req.params.id;
            var student = req.session.student ? objectId(req.session.student._id) : objectId(req.session.lid);
            subTop.aggregate([
                {'$match': {'classDetail': objectId(classId)}},
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
                {'$match': {'SubjectMetrics.student': student}},
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

    this.getSubjectDataByClassDetail = function (req, res, next) {

        /*subTop.find({"classDetail": objectId(classId)})
            .populate({path : 'classDetail'})
            .populate({path : 'subject'})
            .exec(function (err, result) {
                if(err) {
                    next(err, null);
                } else {
                    res.status(200).send({data: _.isEmpty(result) ? [] : result});
                }
            });
*/
    };

    this.remove = function (req, res, next) {
        var objectId = mongoose.Types.ObjectId;
        var id = req.params.id;
        var Journal = models.get(req.session.lastDb, 'Subject', subjectSchema);
        var subjectTopicModel = models.get(req.session.lastDb, 'SubjectTopics', subjectTopics);
        var query = {};

        query.subject = objectId( req.params.id)

        subjectTopicModel.find(query, function (err, subject) {
            if (err) {
                return next(err);
            }
            if(id && subject.length == 0) {
                Journal.findByIdAndRemove(id, function (err, journal) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: journal});
                })
            } else {
                res.status(401).send("Subject associated with SubjectTopics");
            }

        });

    };


    this.update = function (req, res, next) {
        var courseListModel = models.get(req.session.lastDb, 'Subject', subjectSchema);
        var body = req.body;
        var _id = req.params.id;
        courseListModel.findByIdAndUpdate(_id, body, {new: true}, function (err, list) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Price list is updated success'});
        });
    };
};

module.exports = Module;
