/**
 * Created by Satya on 10/3/2018.
 */


var mongoose = require('mongoose');
var async = require('async');
var pageHelper = require('../helpers/pageHelper');
var baseHandler = require('./baseHandler');
var dateUtils = require('../utils/dateService');
var _ = require('lodash');
var baseService = require('../handlers/baseHandler');
var moment = require('moment');
var ObjectId = mongoose.Types.ObjectId;
var subTopicSchema = mongoose.Schemas.SubTopics;
var SubjectTopicSchema = mongoose.Schemas.SubjectTopics;
var SubTopic = function (event, models) {
    'use strict';

    /*this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'SubTopics', subTopicSchema);
        var body = req.body;
        var id = req.params.id;
        var ids = [];
        if(!_.isEmpty(body.ids)) {
            _.forEach(body.ids, function(val) {
                ids.push(ObjectId(val))
            })
        }
        Model.remove({"_id": { $in: body.ids }}, function (err, sub) {
            if (err) {
                return next(err);
            }
            Model.insertMany(body.data, function(err, sub){
                if (err) {
                    return next(err);
                }
                res.status(200).send({success: sub});
            })
        });
    };
*/
    this.getForView = function (req, res, next) {
        var subTop = models.get(req.session.lastDb, 'SubTopics', subTopicSchema);
        var data = req.query;
        var getTotal;
        var getData;
        var headers = baseService.getHeaders(req);
        var matchObj = {};


        getTotal = function (cb) {
            subTop
                .find({})
                .count(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result || 0);
                });
        };


        getData = function (cb) {
            subTop
                .find({})
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

    this.updateData = function (req, res, next) {
        var SupTop = models.get(req.session.lastDb, 'SubTopics', subTopicSchema);
        var body = req.body;
        var uId;

        async.each(body, function (data, cb) {
            var id = data._id;

            data.editedBy = {
                user: uId,
                date: new Date().toISOString()
            };
            delete data._id;

            SupTop.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, model) {
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

    this.createAndUpdate = function (req, res, next) {
        var subtopic = models.get(req.session.lastDb, 'SubTopics', subTopicSchema)
        var body = req.body;
        var name = body.name;
        var data = {};
        data.topic = body.topic;
        data.subject = body.subject;
        data.classDetail = body.classDetail;
        var filterQuery;
        var delQuery;
        if (body.modifier === 'add') {
            filterQuery ={$addToSet:{"subtopic":{ name: name}}};
        }
        else {
            filterQuery = {$pull: {subtopic:{name: name}}};
        }
        if(body._id) {
            if(body.id){
                delQuery = {$pull: {subtopic: {_id: body.id}}};
                subtopic.findOneAndUpdate({"_id": body._id}, delQuery, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    subtopic.findOneAndUpdate({"_id": body._id}, filterQuery, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });
                });
            } else {
                subtopic.findOneAndUpdate({"_id": body._id}, filterQuery, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(result);
                });
            }

        } else {
            data.subtopic = [{name: name}]
            subtopic.findOne({"classDetail": ObjectId(body.classDetail), subject: ObjectId(body.subject), topic: ObjectId(body.topic)}).exec(function (err, result) {
                if(!_.isEmpty(result)) {
                    subtopic.findOneAndUpdate({"_id": result._id}, filterQuery, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });
                } else {
                    subtopic.create(data,function(err, result){
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);

                    })
                }
            })

        }
    };

    this.getTopicOnly =  function(req, res, next){
        var topic = models.get(req.session.lastDb, 'SubjectTopics', SubjectTopicSchema)
        var data = req.query
        var matchObj = {$and:[{'classDetail': ObjectId(data.classDetail)},{'title': ObjectId(data.title)},{'subject': ObjectId(data.subject)}]}
        topic.aggregate([
            {
                $match:matchObj
            },
            {$unwind: '$topics'},
            {
                $lookup: {
                    from: 'SubTopics',
                    localField: 'topics._id',
                    foreignField: 'topic',
                    as: 'subtopic'
                }
            },
            {$unwind:  { path: '$subtopic',
            preserveNullAndEmptyArrays: true}},
            {
                $project: {
                    classDetail : 1,
                    subject : 1,
                    subtopics : '$subtopic',
                    topics : 1,
                    _id : 1,
                    topicName : '$topics.name',
                    topicId : '$topics._id',
                    title   : 1,
                }
            }


        ], function(err, result){
            if(err){
                next(err);
            }
            res.status(200).send({data:result});

        })
    };


    this.remove = function (req, res, next) {
        var id = req.params.id;
        var SubTop = models.get(req.session.lastDb, 'SubTopics', subTopicSchema);

        SubTop.findByIdAndRemove(id, function (err, sub) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: sub});

        });
    };


};

module.exports = SubTopic;

