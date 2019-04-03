/**
 * Created by senthil on 06/02/18.
 */
var mongoose = require('mongoose');
var transactionReqSchema = mongoose.Schemas.TransactionReqDetails;
var transactionResSchema = mongoose.Schemas.TransactionResDetails;
var studentFeeDetails = mongoose.Schemas.studentFeeDetails;
var transactionSchema = mongoose.Schemas.Transactions;
var transConv = require('../converters/transactionConverter')
var async = require('async');
var pageHelper = require('../helpers/pageHelper');

var Module = function (models) {
    var exporter = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').transEntry;

    this.saveTransReqDetails = function (req, data, next) {
        var Model = models.get('CRM', 'TransactionReqDetails', transactionReqSchema);
        var transactionReqDetails = new Model(data);
        transactionReqDetails.save(function (err, result) {
            next(err, result)
        });
    }

    this.saveTransResDetails = function (req, data, next) {
        var Model = models.get('CRM', 'TransactionResDetails', transactionResSchema);
        var transactionResDetails = new Model(data.transResObj);
        transactionResDetails.save(function (err, result) {
            data.transactionResId = result._id
            next(err, req, data)
        });
    }

    this.getTransactions =  function (req, res, next) {
        var Model = models.get('CRM', 'Transactions', transactionSchema);
        Model.find({})
            .populate({path : 'student', populate: { path: 'studentDetails', path: 'batch', path: 'course', path: 'center'  }})
            .populate({path : 'studentFeeDetails'})
            .populate({path : 'order'})
            .populate({path : 'payment'})
            .populate({path : 'invoice'}).exec(function (err, result) {

                res.status(201).send(result);
        });
    }

    this.getCCRReports =  function (req, res, next) {
        var queryParams = req.query.id;
        var Model = models.get('CRM', 'StudentFeeDetails', studentFeeDetails);
        Model.aggregate([
            {
                $lookup: {
                    from: 'Center',
                    localField: 'center',
                    foreignField: '_id',
                    as: 'center'
                }
            }, {
                $lookup: {
                    from: 'Course',
                    localField: 'course',
                    foreignField: '_id',
                    as: 'course'
                }
            }, {
                $lookup: {
                    from: 'Batch',
                    localField: 'batch',
                    foreignField: '_id',
                    as: 'batch'
                }
            }, {
                $lookup: {
                    from: 'Student',
                    localField: 'student',
                    foreignField: '_id',
                    as: 'student'
                }
            }, {
                $unwind: '$center'
            }, {
                $unwind: '$course'
            }, {
                $unwind: '$batch'
            }, {
                $unwind:'$student'
            },
            {
                $match : {'student.academicYear' : queryParams}
            },{
                $group: {
                    _id: {
                        'center': '$center._id',
                        'centerName': '$center.centerName',
                        'course': '$course._id',
                        'courseName': '$course.courseName'
                    },
                    total: {$sum: 1},
                    root: {$push: '$$ROOT'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: {
                    "center": "$_id.center",
                    "centerName": "$_id.centerName",
                    'course': '$_id.course',
                    'courseName': '$_id.courseName',
                    total: 1
                }
            }

        ], function (err, result) {
            var firstElement;
            var response = {};

            if (err) {
                return next(err);
            }

            result = JSON.parse(JSON.stringify(result));
            var data = {};
            data.course = _.groupBy(result, 'course')
            data.center = _.groupBy(result, 'center');

            _.forEach(data.center, function (value, key) {
                var centerObj = [];
                _.forEach(data.course, function (cou, key) {
                    var obj = _.filter(value, {'course': key})
                    if (obj && obj.length > 0) {
                        centerObj.push({center: obj[0].center, centerName: obj[0].centerName, total: obj[0].total})
                    } else {
                        centerObj.push({center: value[0].center, centerName: value[0].centerName, total: 0})
                    }
                })
                data.center[key] = centerObj;
            });
            //cb(null, response);
            res.status(201).send(data)

        });

    }


    this.getTransactionsBySid =  function (req, data, next) {
        var Model = models.get('CRM', 'Transactions', transactionSchema);
        Model.find({student: data.studentId, isRegisterFee: data.isRegisterFee})
            .populate({path : 'student', populate: { path: 'studentDetails', path: 'batch', path: 'course', path: 'center'  }})
            .populate({path : 'studentFeeDetails'})
            .populate({path : 'order'})
            .populate({path : 'payment'})
            .populate({path : 'invoice'}).exec(function (err, result) {
            data.trans = result;
            next(err, req, data)
        });
    }

    this.exportToXlsx = function (req, res, next) {
        var Model = models.get('CRM', 'Transactions', transactionSchema);
        Model.find({})
            .populate({path : 'student', populate: { path: 'studentDetails', path: 'batch', path: 'course', path: 'center'  }})
            .populate({path : 'studentFeeDetails'})
            .populate({path : 'order'})
            .populate({path : 'payment'})
            .populate({path : 'invoice'}).exec(function (err, result) {


            exporter.exportToXlsx({
                res        : res,
                next       : next,
                Model      : Model,
                resultArray: transConv.exportObj(result),
                map        : exportMap,
                fileName   : 'Transactions'
            });
        });
    };

    this.exportToCsv = function (req, res, next) {
        var Model = models.get('CRM', 'Transactions', transactionSchema);
        Model.find({})
            .populate({path : 'student', populate: { path: 'studentDetails', path: 'batch', path: 'course', path: 'center'  }})
            .populate({path : 'studentFeeDetails'})
            .populate({path : 'order'})
            .populate({path : 'payment'})
            .populate({path : 'invoice'}).exec(function (err, result) {


            exporter.exportToCsv({
                res        : res,
                next       : next,
                Model      : Model,
                resultArray: transConv.exportObj(result),
                map        : exportMap,
                fileName   : 'Transactions'
            });
        });
    };

};

module.exports = Module;