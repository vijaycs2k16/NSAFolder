/**
 * Created by senthil on 25/01/18.
 */
var mongoose = require('mongoose');
var centerSchema = mongoose.Schemas.CenterCourse;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');
var objectId  = mongoose.Types.ObjectId;

var Module = function (models) {
    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'CenterCourse', centerSchema);
        var body = req.body.data;
        var centerCourse = new Model(body);
        Model.insertMany(body, function(err, centerCourses){
            if (err) {
                return next(err);
            }
            res.status(200).send({success: centerCourse});
        })
       /* centerCourse.save(function (err, _centerCourse) {
            if (err) {
                return next(err);
            }
            getById(req,{id: _centerCourse._id}, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(201).send(result);
            });
        });*/
    };


    this.updateCenterCourse = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'CenterCourse', centerSchema);
        var body = req.body.data;
        var centerCourse = new Model(body);
        var id = req.params.id;

        Model.remove({center: objectId(id)}, function (err, centerCourse) {
            if (err) {
                return next(err);
            }
            Model.insertMany(body, function(err, centerCourses){
                if (err) {
                    return next(err);
                }
                res.status(200).send({success: centerCourse});
            })
        });
    };

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'CenterCourse', centerSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var matchObj = req.session.profileId === 1522230115000 ? { center: req.session.cId } : {};

        getTotal = function (cb) {
            Model
                .find(matchObj)
                .count(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result || 0);
                });
        };

        getData = function (cb) {
            Model
                .find(matchObj)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate([{path : 'course'}, {path: 'product'}])
                .populate({path : 'center'})
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
        var Model = models.get(req.session.lastDb, 'CenterCourse', centerSchema);
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

    this.getWriteOff = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'CenterCourse', centerSchema);

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
        var Model = models.get(req.session.lastDb, 'CenterCourse', centerSchema);
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
        var Model = models.get(req.session.lastDb, 'CenterCourse', centerSchema);

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
        var id = req.params.id;
        var Journal = models.get(req.session.lastDb, 'CenterCourse', centerSchema);

        Journal.remove({center: id}, function (err, centerCourse) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: centerCourse});

        });
    };

    this.bulkRemove = function (req, res, next) {
        var Journal = models.get(req.session.lastDb, 'CenterCourse', centerSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        Journal.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send(removed);
        });
    };

    this.update = function (req, res, next) {
        var centerModel = models.get(req.session.lastDb, 'CenterCourse', centerSchema);
        var body = req.body;
        var _id = req.params.id;
        centerModel.findByIdAndUpdate(_id, body, {new: true}, function (err, list) {
            if (err) {
                return next(err);
            }
            getById(req,{id: _id}, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(result);
            });
            //res.status(200).send({success: 'Topic updated success'});
        });
    };

    function getById(req, options, callback) {
        var id = options.id;

        var Model = models.get(req.session.lastDb, 'CenterCourse', centerSchema);

        Model.findById(id).populate({path : 'course', populate: { path: 'product' }}).populate({path : 'center'}).exec(function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
    }

    this.getCoursesByCenterId = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'CenterCourse', centerSchema);

        Model
            .find({center: req.query.centerId})
            .populate([{path : 'course', populate: { path: 'product' }}])
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    };

    this.getCenterCoursesFees = function (req, next) {
        var Model = models.get("CRM", 'CenterCourse', centerSchema);
        var findObj = {center: req.body.center, course: req.body.course}
        Model.find(findObj).exec(function (err, result) {
            if (result && result.length > 0) {
                result =  result[0]
            }
            next(err, result)
        });

    };

    this.getCenterCourseFees = function (req, res, next) {
        var Model = models.get("CRM", 'CenterCourse', centerSchema);
        var findObj = {center: req.query.center, course: req.query.course}
        Model.findOne(findObj).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });

    };
};

module.exports = Module;