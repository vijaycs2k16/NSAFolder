/**
 * Created by senthil on 25/01/18.
 */
var mongoose = require('mongoose');
var centerSchema = mongoose.Schemas.center;
var async = require('async');
var centerCourseSchema = mongoose.Schemas.CenterCourse;
var studentSchema = mongoose.Schemas.Student;
var userConverter = require('../converters/userConverter')
var EmployeeHandler = require('./employee');
var pageHelper = require('../helpers/pageHelper');
var objectId = mongoose.Types.ObjectId;

var Module = function (models, event) {
    var empHandler = new EmployeeHandler(event, models);

    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Center', centerSchema);
        var body = req.body;
        var centerModel = new Model(body);

        centerModel.save(function (err, center) {
            if (err) {
                return next(err);
            }
            body.center = center._id
            async.waterfall([
                userConverter.createEmpObj.bind(null, req, {}),
                empHandler.createEmployee.bind(),
                userConverter.createEmpTransferObj.bind(),
                empHandler.createEmployeeTransfer.bind()
            ], function (err, data) {
                getById(req, {id: center._id}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(201).send(result);
                });
            })
        });
    };

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Center', centerSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var matchObj = req.session.profileId === 1522230115000 ? { _id: req.session.cId, centerStatus: true } : {centerStatus: true};
        if(data.render) {
            matchObj = req.session.profileId === 1522230115000 ? { _id: req.session.cId, centerStatus: true } :{}
        }

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
               // .find(matchObj)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                //.populate('store')
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

    this.getForCenter = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'CenterCourse', centerCourseSchema);
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var getTotal;
        var getData;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var centerObj = data.center ? { center: objectId(data.center) } : {};
        var matchObj = req.session.profileId === 1522230115000 ? { center: objectId(req.session.cId) } : {};

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
            Model.aggregate([
                {
                  $match: matchObj
                },
                {
                    $match: centerObj
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
                { $unwind: '$center' },
                { $unwind: '$course'},
                {
                    $group: {
                        _id: {"center": '$center._id', "centerName":"$center.centerName"},
                        root: {$push: '$$ROOT'}
                    }
                },
                {
                    $project: {
                        _id: '$_id.center',
                        centerName: '$_id.centerName',
                        course : '$root'
                    }
                }
                ], function (err, result) {
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

            res.status(200).send({total: result[0], data: result[1]});
        });
    };

    this.getForDd = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Center', centerSchema);
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
        var Model = models.get(req.session.lastDb, 'Center', centerSchema);

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
        var Model = models.get(req.session.lastDb, 'Center', centerSchema);
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
        var Model = models.get(req.session.lastDb, 'Center', centerSchema);

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
        var Journal = models.get(req.session.lastDb, 'Center', centerSchema);
        var StudentModel = models.get(req.session.lastDb, 'Student', studentSchema);
        var query = {};

        query.center = objectId( req.params.id)
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
                res.status(401).send("Center is already Associated");
            }

        });

    };

    this.bulkRemove = function (req, res, next) {
        var Journal = models.get(req.session.lastDb, 'Center', centerSchema);
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
        var centerModel = models.get(req.session.lastDb, 'Center', centerSchema);
        var body = req.body;
        var _id = req.params.id;
        centerModel.findByIdAndUpdate(_id, body, {new: true}, function (err, list) {
            if (err) {
                return next(err);
            }

            getById(req, {id: list._id}, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(201).send(result);
            });

        });
    };

    function getById(req, options, callback) {
        var Model;
        var id = options.id;

        var Model = models.get(req.session.lastDb, 'Center', centerSchema);

        Model.findById(id).populate({path : 'store'}).exec(function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
    }

    function getDb(req) {
        return req.session.lastDb || 'CRM'
    }

    this.getNewCenterCode = function (req, res, next) {
        var centerModel = models.get(getDb(req), 'Center', centerSchema);
        centerModel.count({}).exec(function (err, result) {
            var data = {}
            if(!err)
                data.centerCode = 'VAC' + result || 0
            res.status(200).send({data: data});
        });
    };

    this.getCenterById = function (req, res, next) {
        var centerModel = models.get(getDb(req), 'Center', centerSchema);
        centerModel.findOne({_id: req.query.id})
            .exec(function (err, response) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: response});
            });
    };
};

module.exports = Module;
