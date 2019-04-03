/**
 * Created by Sathya on 11/28/2018.
 */

var mongoose = require('mongoose');
var titleSchema = mongoose.Schemas.title;
var subjectTitleSchema = mongoose.Schemas.subjectTitle;
var FilterMapper = require('../helpers/filterMapper');
var filterMapper = new FilterMapper();
var async = require('async');
var _ = require('lodash');
var pageHelper = require('../helpers/pageHelper');

var Module = function (models) {
    var ObjectId = mongoose.Types.ObjectId;
    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'subjectTitle', subjectTitleSchema);
        var bulk = Model.collection.initializeOrderedBulkOp();
        var body = req.body;

       async.forEach(body.data, function(obj, cb){
           _.map(obj.subject, function(unWin) {
               bulk.insert({
                   school_id           : obj.school_id,
                   tenant_id           : obj.tenant_id,
                   academicYear        : obj.academicYear,
                   subject             : ObjectId(unWin),
                   title               : ObjectId(obj.title),
                   classDetail         : ObjectId(obj.classDetail),
                   class_id            : obj.class_id,
                   class_name          : obj.class_name,
                   subject_id          : obj.subject_id,
                   subject_name        : obj.subject_name
               })
           });
           cb(null, bulk);
       }, function (err) {
           if (err) {
               return next(err);
           }
           bulk.execute(function (err, result) {
               res.status(200).send({data: result});
           });
       });

        /*async.each(body, function (data, cb) {
                console.log("data..................", data)
           var school = new Model(data);
            var Query = {title: ObjectId(data.title), classDetail: ObjectId(data.classDetail)};
            Model.remove(Query, function (err, result) {
                if(err) {
                    return  next(err)
                }
                school.save(function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    cb(null, result);
                });
            });
        }, function (err, res) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: res});
        });*/

    };

    function getTitleById(req, options, callback) {
        var id = options.id;
        var Model = models.get(req.session.lastDb, 'subjectTitle', subjectTitleSchema);

        Model.findById(id)
            .populate({path : 'subject'})
            .populate({path : 'title'})
            .populate({path : 'classDetail'})
            .exec(function (err, result) {
                if (err) {
                    return callback(err);
                }
                callback(null, result);
            });
    }

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var Model = models.get(req.session.lastDb, 'subjectTitle', subjectTitleSchema);

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

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var Model = models.get(db, 'subjectTitle', subjectTitleSchema);
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
                .populate({path: 'subject'})
                .populate({path: 'title'})
                .populate({path: 'classDetail'})
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


    this.remove = function (req, res, next) {
        var id = req.params.id;
        var subjectTitle = models.get(req.session.lastDb, 'subjectTitle', subjectTitleSchema);

        subjectTitle.remove({title: id}, function (err, title) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: title});
        });
    };

    this.bulkRemove = function (req, res, next) {
        var subjectTitle = models.get(req.session.lastDb, 'subjectTitle', subjectTitleSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        subjectTitle.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }
            res.status(200).send(removed);
        });
    };

    this.update = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'subjectTitle', subjectTitleSchema);
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