/**
 * Created by senthil on 05/02/18.
 */
var mongoose = require('mongoose');
var studentFeeDetails = mongoose.Schemas.StudentFeeDetails;
var async = require('async');
var _ = require('lodash');
var pageHelper = require('../helpers/pageHelper');
var serviceUtils = require('../utils/serviceUtils');
var baseService = require('../handlers/baseHandler');

var Module = function (models) {

    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();

    this.addStudentsFeeDetails = function (req, data, next) {
        var Model = models.get(getDb(req), 'StudentFeeDetails', studentFeeDetails);
        var studentsFeeDetailsObj = new Model(data.studentFeeDetails);
        studentsFeeDetailsObj.save(function (err, result) {
            data.result = result;
            data.studentFeeDetails = result;
            next(err, data)
        });
    };

    this.addFeeInstallment = function (req, data, next) {
        var Model = models.get(getDb(req), 'StudentFeeDetails', studentFeeDetails);
        var studentsFeeDetailsObj = data.studentFeeDetails
        var obj = studentsFeeDetailsObj.installmentDetails[0]
        obj = serviceUtils.removeUndefinedAndNull(obj);
        if(req.body.totalInstallmentAmount > 0) {
            Model.update({ student: req.body.studentId },{ $push: { installmentDetails: obj} }, function (err, result) {
                data.addFeeInstallment = result
                next(err, req, data)
            })
        } else {
            next(null, req, data)
        }

    }

    this.updateStudentsFee = function (req, data, next) {
       try {
           var Model = models.get(getDb(req), 'StudentFeeDetails', studentFeeDetails);
           var obj = data.studentFeeDetails
           delete obj.installmentDetails;
           obj = serviceUtils.removeUndefinedAndNull(obj);
           Model.update({student: req.body.studentId}, obj , function(err, result, rawResponse) {
               if (err) {
                   return next(err);
               }
               data.updateStudentsFee = result
               next(err, data)
           })
       } catch (err) {
           next(err, data)
       }
    };

    function getDb(req) {
        return req.session.lastDb || 'CRM'
    }

    this.getStudentsFeeDetailsById = function (req, next) {
        var Model = models.get(getDb(req), 'StudentFeeDetails', studentFeeDetails);
        Model.find({student: req.query.id})
            .populate([{path : 'student', populate: {path: 'studentDetails'}},{path: 'course'},{path: 'center'}, {path: 'batch'}])
            .exec(function (err, response) {
                if (err) {
                    return next(err);
                }
                next(err, req, response)
            });
    };

    this.getStudentsFeeDetails = function (req, next) {
        var Model = models.get(getDb(req), 'StudentFeeDetails', studentFeeDetails);
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var contentType = data.contentType || 'Register';
        var optionsObject = {};
        var filter = data.filter || {};
        var waterfallTasks;
        var accessRollSearcher;
        var contentSearcher;
        var keySort;
        var sort;
        var quickSearch = data.quickSearch;
        var regExp = new RegExp(quickSearch, 'ig');
        var matchObject = {};
        var centerObj = {};
        var singleObj = {};
        var headers = baseService.getHeaders(req);

        if(!headers.isAcess && req.session.cId) {
            centerObj = {"center": mongoose.Types.ObjectId(req.session.cId)}
        }

        if(data.id) {
            singleObj = {"_id": mongoose.Types.ObjectId(data.id)}
        }

        if (quickSearch) {
            matchObject.fullName = {$regex: regExp};
        }

        if (filter && typeof filter === 'object') {
            optionsObject = filterMapper.mapFilter(filter, {
                contentType: 'Register'
            });
        }

        if (data.sort) {
            keySort = Object.keys(data.sort)[0];
            data.sort[keySort] = parseInt(data.sort[keySort], 10);
            sort = data.sort;
        } else {
            sort = {'student.createDate': -1};
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Model, cb);
        };

        contentSearcher = function (idsArray, cb) {
            var queryObject = {};

            queryObject.$and = [];

            if (optionsObject) {
                queryObject.$and.push(optionsObject);
            }

            Model.aggregate([{
                $match: singleObj
            } ,{
                $match: centerObj
            },{
                $lookup: {
                    from        : 'Student',
                    localField  : 'student',
                    foreignField: '_id',
                    as          : 'student'
                }
            }, {
                $unwind: {
                    path: '$student',
                    preserveNullAndEmptyArrays: true
                }
            },{
                $lookup: {
                    from        : 'StudentDetails',
                    localField  : 'student.studentDetails',
                    foreignField: '_id',
                    as          : 'studentDetails'
                }
            }, {
                $lookup: {
                    from        : 'Center',
                    localField  : 'center',
                    foreignField: '_id',
                    as          : 'center'
                }
            }, {
                $lookup: {
                    from        : 'Course',
                    localField  : 'course',
                    foreignField: '_id',
                    as          : 'course'
                }
            }, {
                $lookup: {
                    from        : 'Batch',
                    localField  : 'batch',
                    foreignField: '_id',
                    as          : 'batch'
                }
            },
            {
                $lookup: {
                    from        : 'Order',
                    localField  : 'student._id',
                    foreignField: 'student',
                    as          : 'order'
                }
            },
                {
                    $lookup: {
                        from        : 'Employees',
                        localField  : 'student.followedBy',
                        foreignField: '_id',
                        as          : 'followedBy'
                    }
                },
              {
                $match: queryObject
            },{
                $unwind: {
                    path: '$center',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $unwind: {
                    path: '$course',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                    $unwind: {
                        path: '$followedBy',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                $lookup: {
                    from        : 'Products',
                    localField  : 'course.product',
                    foreignField: '_id',
                    as          : 'productInfo'
                }
            },{
                $unwind: {
                    path:'$productInfo',
                    preserveNullAndEmptyArrays: true
                }
            },{
                $unwind: {
                    path:'$studentDetails',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $unwind: {
                    path: '$batch',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $unwind: {
                    path: '$order',
                    preserveNullAndEmptyArrays: true
                }
            },{
                $lookup: {
                    from        : 'orderRows',
                    localField  : 'order._id',
                    foreignField: 'order',
                    as          : 'orderRows'
                }
            }, {
                $lookup: {
                    from        : 'GoodsNote',
                    localField  : 'order._id',
                    foreignField: 'order',
                    as          : 'goodsNote'
                }
            }, {
                $lookup: {
                    from        : 'productsAvailability',
                    localField  : 'course.product',
                    foreignField: 'product',
                    as          : 'product'
                }
            }, {
                $lookup: {
                    from        : 'warehouse',
                    localField  : 'product.warehouse',
                    foreignField: '_id',
                    as          : 'warehouse'
                }
            },{
                $unwind: {
                    path: '$warehouse',
                    preserveNullAndEmptyArrays: true
                }
            },{
                $group: {
                    _id: null,
                    total: {$sum: 1},
                    root: {$push: '$$ROOT'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: {
                    total: 1,
                    _id: '$root._id',
                    student: '$root.student',
                    course: '$root.course',
                    batch: '$root.batch',
                    productInfo: '$root.productInfo',
                    center: '$root.center',
                    courseAmount: '$root.courseAmount',
                    gstAmount: '$root.gstAmount',
                    isBooking: '$root.isBooking',
                    bookingAmount: '$root.bookingAmount',
                    isDiscountApplicable: '$root.isDiscountApplicable',
                    discountAmount: '$root.discountAmount',
                    actualFeeAmount: '$root.actualFeeAmount',
                    installmentDetails: '$root.installmentDetails',
                    bookingDetails: '$root.bookingDetails',
                    feeTypeDetails: '$root.feeTypeDetails',
                    paidAmount: '$root.paidAmount',
                    isCompleted: '$root.isCompleted',
                    isBookingSplitted: '$root.isBookingSplitted',
                    studentDetails: '$root.studentDetails',
                    order : '$root.order',
                    orderRows : '$root.orderRows',
                    warehouse : '$root.warehouse',
                    goodsNote: '$root.goodsNote',
                    followedBy :'$root.followedBy',
                    approveStatus: '$root.approveStatus'

                }
            },{
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            }


            ], function (err, result) {
                var firstElement;
                var response = {};

                if (err) {
                    return next(err);
                }

                firstElement = result[0];
                var count = firstElement && firstElement.total ? firstElement.total : 0;
                response.total = count;
                response.count = result.length;
                response.data = result;

                cb(null, response);
            });
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }
            next(err, req, result)
        });
    };

    this.updateStudentsFeeDetails = function (req, data, next) {
        var Model = models.get(getDb(req), 'StudentFeeDetails', studentFeeDetails);
        Model.update({'installmentDetails.billNo': data.orderId}, {'$set': {
            'installmentDetails.$.isPaid': true,
            'installmentDetails.$.transactionResId': data.transactionResId,
        }}, function (err, result) {
            data.result = result
            next(err, data)
        });
    };


    this.revertStudentsFeeDetails = function (req, data, next) {
        var Model = models.get(getDb(req), 'StudentFeeDetails', studentFeeDetails);
        Model.findOne({'installmentDetails.billNo': data.orderId}, function (err, result) {
            data.result = result;

            if(result) {
                var installmentDetail = _.filter(result.installmentDetails, {billNo: data.orderId});
                if(!_.isEmpty(installmentDetail)) {
                    _.forEach(installmentDetail[0].details, function (val, index) {
                        var value = _.filter(result.feeTypeDetails, {id: val.id});
                        if(!_.isEmpty(value)) {
                            value[0].paidAmount = +value[0].paidAmount - +val.paidAmount;
                            value[0].currentInstallmentAmount = +value[0].currentInstallmentAmount - +val.currentInstallmentAmount;
                        }
                        if(index == (installmentDetail[0].details.length - 1)) {
                            Model.update({'_id': result._id}, {'$set': {
                                'feeTypeDetails': result.feeTypeDetails,
                            }}, function (err, result) {
                                data.result = result
                                next(err, data)
                            });
                        }
                    })
                }
            } else {
                next(err, data)
            }

        });
    };
};

module.exports = Module;