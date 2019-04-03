var mongoose = require('mongoose');
var batchSchema = mongoose.Schemas.Batch;
var studentSchema = mongoose.Schemas.Student;
var centerCourseSchema = mongoose.Schemas.CenterCourse;
var async = require('async');
var dateUtils = require('../utils/dateService')
var serviceUtils = require('../utils/serviceUtils')
var pageHelper = require('../helpers/pageHelper');
var baseService = require('../handlers/baseHandler');
var ObjectId = mongoose.Types.ObjectId;
var _ = require('lodash')

var Module = function (models) {
    this.create = function (req, res, next) {
        var objectId = mongoose.Types.ObjectId;
        var Model = models.get(req.session.lastDb, 'Batch', batchSchema);
        var body = req.body;
        var batch = new Model(body);
        var query = {};

        query.batchName = req.body.batchName;
        query.center = objectId(req.body.center)
        query.course = objectId(req.body.course)

        Model.find(query, function(err, test) {
                if (err) {
                    return next(err);
                }
                if (test.length == 0) {
                    batch.save(function (err, _batch) {
                        if (err) {
                            return next(errorMessage(err));
                        }
                        getById(req, {id: _batch._id}, function (err, result) {
                            if (err) {
                                return next(err);
                            }
                            dateUtils.formatObjectDates(serviceUtils.parseDbObjectAsJSON(result), ['startDate', 'endDate'], 'type1', function (err, data) {
                                res.status(200).send(data);
                            })
                        });

                    })
                } else {
                    res.status(500).send("batchName already existed in same center & course")
                }
        });
    };

    function errorMessage(err) {
        if(err.errors['startDate']) {
            err.stack = err.errors['startDate'].value;
            err.message = "Start Date";
        } else if(err.errors['endDate']) {
            err.stack = err.errors['endDate'].value;
            err.message = "End Date"
        }

        return err;
    }

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Batch', batchSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var headers = baseService.getHeaders(req);
        var matchObj = {};


        if(!headers.isAcess) {
            if(headers.student)
            matchObj = {$and:[{"_id": ObjectId(headers.bId)},{"center": ObjectId(headers.cid)}, {"course": ObjectId(headers.coId)} ]}
        }

        if(req.session.profileId === 1522230115000){
            matchObj = { center: req.session.cId };
        }

        if(data.center){
            matchObj = { center: ObjectId(data.center)};
        }

        if(!data.render){
            matchObj.batchStatus = true;
        }


        getTotal = function (cb) {
            Model
                .find(matchObj ? matchObj : {})
                .count(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result || 0);
                });
        };

        getData = function (cb) {
            Model
                .find(matchObj ? matchObj : {})
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate({path : 'center'})
                .populate({path : 'course'})
                .exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }
                    if(!data.render && !_.isEmpty(result)){
                        result =  _.filter(result, function(o) { return o.course.courseStatus });
                    }


                    cb(null, result);
                });
        };

        async.parallel([getTotal, getData], function (err, result) {
            if (err) {
                return next(err);
            } else if(result.length) {
                dateUtils.formatObjectsDates(serviceUtils.parseDbObjectAsJSON(result[1]), ['startDate', 'endDate'], 'type1', function (err, data) {
                    res.status(200).send({total: result[0], data: data});
                })
            } else {
                res.status(200).send({data: result});
            }

        });
    };

    this.getForDd = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Batch', batchSchema);
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

    this.getCB = function (req, res, next) {
        var queryParams = req.query;
        var headers = baseService.getHeaders(req);
        var firstmatch = {};
        if(headers.cid != null) {
            firstmatch = {"center": mongoose.Types.ObjectId(headers.cid)}
        }
        var Model = models.get(req.session.lastDb, 'Batch', batchSchema);
        Model.aggregate([
                {$match: firstmatch},
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
                        "from": "CenterCourse",
                        "localField": "center",
                        "foreignField": "center",
                        "as": "CenterCourse"
                    }
                },
                {$unwind: {path: "$center"}},
                {$unwind: {path: "$course"}},
                {
                    $group: {
                        _id: {"center": '$center._id', "centerName":"$center.centerName"},
                        item: {$addToSet: {"id": "$course._id"}},
                        data: {$sum: 1},
                    }
                },
                {
                    $project: {
                        _id    : "$_id.centerName",
                        batchCount  : "$data",
                        courseCount: {$size: "$item"}
                    }
                },

            ], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});

            }
        );
    };

    this.getWriteOff = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Batch', batchSchema);

        Model
            .find({transaction: 'WriteOff'}, {_id: 1, name: 1})
            .sort({name: 1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
    };

    this.getByAccount = function (req, res, next) {
        var body = req.query;
        var Model = models.get(req.session.lastDb, 'Batch', batchSchema);
        var transaction = body.transaction;
        var debitAccount = body.debitAccount;
        var creditAccount = body.creditAccount;
        var query = {};

        if (transaction) {
            query.transaction = transaction;
        }

        if (debitAccount) {
            query.debitAccount = debitAccount;
        }

        if (creditAccount) {
            query.creditAccount = creditAccount;
        }

        Model.find(query, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result || []});
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var Model = models.get(req.session.lastDb, 'Batch', batchSchema);

        async.each(body, function (data, cb) {
            var id = data._id;

            data.editedBy = {
                user: uId,
                date: new Date().toISOString()
            };
            delete data._id;

            Model.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, model) {
                if (err) {
                    return cb(err);
                }

                cb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'updated'});
        });

    };

    this.remove = function (req, res, next) {
        var objectId = mongoose.Types.ObjectId;
        var id = req.params.id;
        var batch = models.get(req.session.lastDb, 'Batch', batchSchema);
        var StudentModel = models.get(req.session.lastDb, 'Student', studentSchema);
        var query = {};

        query.batch = objectId( req.params.id)
        query.isRegistration = true;


        StudentModel.find(query, function (err, student) {
            if (err) {
                return next(err);
            }
            if(id && student.length == 0) {
                batch.findByIdAndRemove(id, function (err, batch) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: batch});
                })
            } else {
                res.status(401).send("Batch is already Associated");
            }

        });

    };

    this.bulkRemove = function (req, res, next) {
        var batch = models.get(req.session.lastDb, 'Batch', batchSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        batch.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send(removed);
        });
    };

    this.update = function (req, res, next) {
        var batchModel = models.get(req.session.lastDb, 'Batch', batchSchema);
        var body = req.body;
        var _id = req.params.id;
        batchModel.findByIdAndUpdate(_id, body, {new: true}, function (err, list) {
            if (err) {
                return next(err);
            }

            getById(req,{id: _id}, function (err, result) {
                if (err) {
                    return next(err);
                }
                dateUtils.formatObjectDates(serviceUtils.parseDbObjectAsJSON(result), ['startDate', 'endDate'], 'type1', function (err, data) {
                    res.status(200).send(data);
                })

            });
            //res.status(200).send({success: 'Topic updated success'});
        });
    };

    function getById(req, options, callback) {
        var id = options.id;
        var Model = models.get(req.session.lastDb, 'Batch', batchSchema);

        Model.findById(id).populate({path : 'course'}).populate({path : 'center'}).exec(function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
    };

    this.getBatch = function (req, next) {
        var Model = models.get('CRM', 'Batch', batchSchema);
        Model
            .findOne({_id: req.body.batch})
            .exec(function (err, result) {
                next(err, result)
            });
    }

    this.getBatchesByCenterCourseId = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Batch', batchSchema);

        Model.find({center: req.query.centerId, course: req.query.courseId})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    };

    this.getBatchesByCC = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Batch', batchSchema);
        var body = req.body;
        var queryObject = {center: {$in: body.center}}
        if(body.course)
            queryObject.course = body.course
        if(_.isArray(body.course)) {
            queryObject.course = {$in: body.course}
        }
        Model
            .find(queryObject).populate({path: 'center'})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    };
};

module.exports = Module;
