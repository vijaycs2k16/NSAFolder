/**
 * Created by Sathya on 12/17/2018.
 */

var mongoose = require('mongoose');
var subjectTermTopicsSchema = mongoose.Schemas.SubjectTermTopics;
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
        var termTopics = models.get(req.session.lastDb, 'SubjectTermTopics', subjectTermTopicsSchema);
        var bulk = termTopics.collection.initializeOrderedBulkOp();
        var body = req.body;

        async.forEach(body.subjectTopic, function(obj, cb){
            bulk.insert({
                subjectTopic            : ObjectId(obj),
                subjectTitleTerm        : ObjectId(body.subjectTitleTerm)
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
    };

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var Model = models.get(db, 'subjectTitleTerm', subjectTitleTermSchema);
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
                {
                    "$lookup": {
                        "from": "subjectTitle",
                        "localField": "subjectTitle",
                        "foreignField": "_id",
                        "as": "subjectTitle"
                    }
                },{
                    $unwind: '$subjectTitle'
                },
                {
                    "$lookup": {
                        "from": "title",
                        "localField": "subjectTitle.title",
                        "foreignField": "_id",
                        "as": "title"
                    }
                },{
                    $unwind: '$title'
                },
                {
                    "$lookup": {
                        "from": "ClassDetails",
                        "localField": "subjectTitle.classDetail",
                        "foreignField": "_id",
                        "as": "classDetail"
                    }
                },{
                    $unwind: '$classDetail'
                },
                {
                    "$lookup": {
                        "from": "Subject",
                        "localField": "subjectTitle.subject",
                        "foreignField": "_id",
                        "as": "subject"
                    }
                },{
                    $unwind: '$subject'
                },
                {
                    "$lookup": {
                        "from": "SubjectTermTopics",
                        "localField": "_id",
                        "foreignField": "subjectTitleTerm",
                        "as": "titleTerm"
                    }
                },
                {
                    $project: {
                        titleTerm: '$titleTerm',
                        term_id : '$term_id',
                        term_name : '$term_name',
                        subject : '$subject',
                        classDetail : '$classDetail',
                        title : '$title',
                        titleTermTopics: {$gt: [ {$size: "$titleTerm" }, 0 ]}
                    }
                },
                {
                    $match: {'titleTermTopics': true}
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

    this.remove = function (req, res, next) {
        var terms = models.get(req.session.lastDb, 'subjectTermTopics', subjectTermTopicsSchema);
        var id = req.params.id;

        terms.remove({subjectTitleTerm: ObjectId(id)}, function (err, term) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: term});
        })
    };

    this.update = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'subjectTermTopics', subjectTermTopicsSchema);
        var bulk = Model.collection.initializeOrderedBulkOp();
        var body = req.body;
        var id = req.params.id;

        Model.remove({subjectTitleTerm: ObjectId(id)}, function (err, term) {
            if (err) {
                return next(err);
            }
            async.forEach(body.subjectTopic, function(obj, cb){
                bulk.insert({
                    subjectTopic            : ObjectId(obj),
                    subjectTitleTerm        : ObjectId(body.subjectTitleTerm)
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
        });
    };

};

module.exports = Module;