var mongoose = require('mongoose');
var courseSchema = mongoose.Schemas.Course;
var ClassDetailSchema = mongoose.Schemas.ClassDetails;
var subTopicSchema = mongoose.Schemas.SubTopics;
var studentSchema = mongoose.Schemas.Student;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');

var Module = function (models) {
    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Course', courseSchema);
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

        Model.findById(id)
            .populate({path : 'product'})
            .populate({path : 'classDetail'})
            .populate({path : 'subject'})
            .exec(function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
    }

    this.getForView = function (req, res, next) {
        var  db = req.session.lastDb;
        if(req.query.mobile) {
            db = 'CRM';
        }
        var Model = models.get(db, 'Course', courseSchema);
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
                .populate({path: 'classDetail'})
                .populate({path: 'subject'})
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

    this.getForDd = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Course', courseSchema);
        var query = req.query;

        Model
            .find(query, {})
            .populate([{path: 'product'}])
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

    this.getSubTopics = function (req, res, next) {
        var subTop = models.get(req.session.lastDb, 'SubTopics', subTopicSchema)
        var data = req.query;
        var findQuery = {}
        var objectId = mongoose.Types.ObjectId;
        var topicId = req.params.id;
        var findQuery = {"topic": objectId(topicId)};
        if(req.query.topics) {
            findQuery = {"topic": {$in: req.query.topics.map(i => objectId(i))}}
        }
        subTop.find(findQuery)
            .exec(function (err, result) {
                if(err) {
                    next(err, null);
                } else {
                    res.status(200).send({data: _.isEmpty(result) ? [] : result});
                }
            });

    };

    this.getClassDetail = function (req, res, next) {
        var Report = models.get(req.session.lastDb, 'ClassDetails', ClassDetailSchema);
        var data = req.query;
        var query;

        query = Report.find({});

        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data:response});

        });
    };

    this.getCourseByClass = function (req, res, next) {
        var Course = models.get(req.session.lastDb, 'Course', courseSchema);
        var objectId = mongoose.Types.ObjectId;
        var classId = req.params.id;

        Course.find({"classDetail": objectId(classId)})
            .exec(function (err, result) {
                  if(err) {
                        next(err, null);
                    } else {
                        res.status(200).send({data: _.isEmpty(result) ? [] : result});
                  }
            });

    };


    this.getClassesByCourse = function (req, res, next) {
        var Course = models.get(req.session.lastDb, 'Course', courseSchema);
        var objectId = mongoose.Types.ObjectId;
        var cid = req.params.cid;

        Course.findOne({"_id": objectId(cid)})
            .populate({path: 'classDetail'})
            .exec(function (err, result) {
                if(err) {
                    next(err, null);
                } else {
                    res.status(200).send({data: _.isEmpty(result) ? {} : result});
                }
            });

    };


    this.remove = function (req, res, next) {
        var objectId = mongoose.Types.ObjectId;
        var id = req.params.id;
        var Journal = models.get(req.session.lastDb, 'Course', courseSchema);
        var StudentModel = models.get(req.session.lastDb, 'Student', studentSchema);
        var query = {};

        query.course = objectId( req.params.id)
        query.isRegistration = true;

        StudentModel.find(query, function (err, student) {
            if (err) {
                return next(err);
            }
            if(id && student.length == 0) {
                Journal.findByIdAndRemove(id, function (err, journal) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: journal});
                })
            } else {
                res.status(401).send("Course is already Associated");
            }

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
