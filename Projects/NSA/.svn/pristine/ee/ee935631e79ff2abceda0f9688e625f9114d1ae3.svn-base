/**
 * Created by kiranmai on 16/02/18.
 */

var mongoose = require('mongoose');
var studentFBSchema = mongoose.Schemas.StudentFeedback;
var employeeFBSchema = mongoose.Schemas.EmployeeFeedback;
var batchScheduleSchema = mongoose.Schemas.BatchSchedule;
var studentSchema = mongoose.Schemas.Student;
var async = require('async');
var batchSchedulerHandler = require('./vBatchScheduler');
var _ = require('lodash');

var Module = function (models) {
    var objectId = mongoose.Types.ObjectId;
    var batchScheduler = new batchSchedulerHandler(models);

    this.getStudentFeedback = function (req, res, next) {
        async.waterfall([
            batchScheduler.getScheduleForEmp.bind(null, req),
            getStudentFB.bind()
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true, data: result});
        });
    };

    function getStudentFB(req, data, callback) {
        var Model = models.get(req.session.lastDb, 'Student', studentSchema);
        var orQuery = [];
        if (!_.isEmpty(data)) {
            _.forEach(JSON.parse(JSON.stringify(data)), function (value, key) {
                orQuery.push({
                    $and: [{center: objectId(value.center._id)}, {course: objectId(value.course._id)},
                        {batch: objectId(value.batch._id)}]
                });
            });

            Model.aggregate([
                {
                    "$match": {$and: [{$or: orQuery}, {studentStatus: true}, {isDeleteStudent: false}]}
                },
                {
                    "$lookup": {
                        "from": "StudentFeedback",
                        "localField": "student",
                        "foreignField": "_id",
                        "as": "studentFeedback"
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
                }, {
                    "$lookup": {
                        "from": "Batch",
                        "localField": "batch",
                        "foreignField": "_id",
                        "as": "batch"
                    }
                },
                {$unwind: "$center"},
                {$unwind: "$course"},
                {$unwind: "$batch"}
            ]).exec(function (err, result) {
                callback(err, result);
            });
        } else {
            callback(null, []);
        }
        this.getStudentFB = getStudentFB;

    }

    this.createStudentFeedback = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentFeedback', studentFBSchema);
        var body = req.body;
        var studentFB = new Model(body);
        studentFB.save(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(201).send({success: true, data: result});
        });
    };

    this.updateStudentFeedback = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentFeedback', studentFBSchema);
        var body = req.body;
        var _id = req.params._id;

        Model.findByIdAndUpdate(_id, body, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true, data: result});
        });
    };

    this.deleteStudentFeedback = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentFeedback', studentFBSchema);

        Model.remove({_id: req.params._id}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true, data: result});
        });

    };

    // Employee

    this.getEmployeeFeedback = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'BatchSchedule', batchScheduleSchema);
        var session = req.session;
        if(session.userType === 'Student') {

            Model.aggregate([
                {
                    "$match": {
                        $and: [{
                            center: objectId(session.center),
                            course: objectId(session.course),
                            batch: objectId(session.batch)
                        }]
                    }
                },
                {
                    "$lookup": {
                        "from": "Topic",
                        "localField": "topics",
                        "foreignField": "topics._id",
                        "as": "topics"
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
                {
                    "$lookup": {
                        "from": "EmployeeFeedback",
                        "localField": "faculty",
                        "foreignField": "employee",
                        "as": "facultyFeedback"
                    }
                },
                {$unwind: {path: "$faculty"}},
                {
                    $group: {
                        _id: {faculty: "$faculty", topics: "$topics"},
                        facultyFeedback: {$addToSet: "$facultyFeedback"}
                    }
                },
                {$unwind: {path: "$facultyFeedback"}}
            ], function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({success: true, data: result});
            });
        } else {
            res.status(200).send({success: true, data: []});
        }
    };

    this.createEmployeeFeedback = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'EmployeeFeedback', employeeFBSchema);

        var body = req.body;
        var employeeFB = new Model(body);
        employeeFB.save(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(201).send({success: true, data: result});
        });
    };

    this.updateEmployeeFeedback = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'EmployeeFeedback', employeeFBSchema);
        var body = req.body;
        var _id = req.params._id;

        Model.findByIdAndUpdate(_id, body, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true, data: result});
        });
    };

    this.deleteEmployeeFeedback = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'EmployeeFeedback', employeeFBSchema);

        Model.remove({id: req.params._id}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true, data: result});
        });

    };

}

module.exports = Module;
