/**
 * Created by Sathya on 12/12/2018.
 */

var mongoose = require('mongoose');
var schoolSubjectTitleSchema = mongoose.Schemas.schoolSubjectTitle;
var subjectTitleSchema = mongoose.Schemas.subjectTitle;
var subjectTitleTermSchema = mongoose.Schemas.subjectTitleTerm;
var FilterMapper = require('../helpers/filterMapper');
var filterMapper = new FilterMapper();
var async = require('async');
var _ = require('lodash');
var pageHelper = require('../helpers/pageHelper');

var Module = function (models) {
    var ObjectId = mongoose.Types.ObjectId;
    this.create = function (req, res, next) {
        async.waterfall([
            getTitlesByClassIds.bind(null, req),
            getSubjectTermByIds.bind(),
            saveSchoolSubject.bind()
        ], function(err, req, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true, data: result});
        })
    };

    function getTitlesByClassIds(req, callback) {
        var school = models.get(req.session.lastDb, 'subjectTitle', subjectTitleSchema);
        var body = req.body;
        var bulkStart = [];

        async.each(body.titles, function (val , cb) {
            var detail = _.map(val.classDetail, function (detail) {
                return mongoose.Types.ObjectId(detail)
            });
            school.find({title: ObjectId(val.title), classDetail: {$in: detail}}).exec(function (err, result) {
                if(result.length > 0) {
                    bulkStart.push({"result":_.map(result, '_id'), "term": val.academic});
                }
                cb(null, bulkStart);
            });
        }, function (err) {
            if (err) {
                return callback(err, req, []);
            }
            callback(null, req, bulkStart)
        });
    }

    function getSubjectTermByIds(req, data, callback) {
        var school = models.get(req.session.lastDb, 'subjectTitleTerm', subjectTitleTermSchema);
        var bulkStart = [];
        async.each(data, function (val , cb) {
            var detail = _.map(val.result, function (detail) {
                return mongoose.Types.ObjectId(detail)
            });
            school.find({academic: val.term, subjectTitle: {$in: detail}}).exec(function (err, result) {
                if(result.length > 0) {
                    bulkStart.push(_.map(result, '_id'));
                }
                cb(null, bulkStart);
            });
        }, function (err) {
            if (err) {
                return callback(err, req, []);
            }
            callback(null, req, _.flatten(bulkStart))
        });
    }

    function saveSchoolSubject(req, data, callback) {
        var Model = models.get(req.session.lastDb, 'schoolSubjectTitle', schoolSubjectTitleSchema);
        var bulk = Model.collection.initializeOrderedBulkOp();
        var body = req.body;
        async.each(data, function (value, cb) {
            bulk.insert({
                school_id    : body.school_id,
                school_name  : body.school_name,
                tenant_id    : body.tenant_id,
                academic_year: body.academic_year,
                subjectTerm  : ObjectId(value.id)
            });
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


    function getTitleById(req, options, callback) {
        var id = options.id;
        var Model = models.get(req.session.lastDb, 'schoolSubjectTitle', schoolSubjectTitleSchema);

        Model.findById(id)
            .populate({path : 'subjectTerm'})
            .exec(function (err, result) {
                if (err) {
                    return callback(err);
                }
                callback(null, result);
            });
    }

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var Model = models.get(db, 'schoolSubjectTitle', schoolSubjectTitleSchema);
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
                    {$group: {_id: {tenant_id: "$tenant_id", school_id: "$school_id", school_name: '$school_name'},  subjectTerm: {$addToSet: '$subjectTerm'}}},
                    {
                        $project: {
                            total       : 1,
                            _id         : '$_id._id',
                            tenant_id   : '$_id.tenant_id',
                            school_id   : '$_id.school_id',
                            school_name : '$_id.school_name',
                            subjectTerm : '$subjectTerm'
                        }
                    }
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
            res.status(200).send({total: result[0], data: result[1]});
        });
    };

    this.getTermByIds = function (req, res, next) {
        var term = models.get(req.session.lastDb, 'subjectTitleTerm', subjectTitleTermSchema);
        var data = req.query;
        var query;
        query = term.find({subjectTitle: data.subjectTitle});
        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: response});

        });
    };


    this.remove = function (req, res, next) {
        var obj = {
            school_id: req.body.school_id,
            tenant_id: req.body.tenant_id
        };
        var school = models.get(req.session.lastDb, 'schoolSubjectTitle', schoolSubjectTitleSchema);

        school.remove(obj, function (err, title) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: title});
        });
    };

    this.update = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'schoolSubjectTitle', schoolSubjectTitleSchema);
        var body = req.body;
        var _id = req.params.id;
        Model.findByIdAndUpdate(_id, body, {new: true}, function (err, list) {
            if (err) {
                return next(err);
            }

            getTitleById(req, {id: _id}, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(201).send(result);
            });
        });
    };

};

module.exports = Module;