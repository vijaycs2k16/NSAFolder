'use strict';
var mongoose = require('mongoose');
var StockReturnsSchema = mongoose.Schemas.stockReturns;
var OrderRowsSchema = mongoose.Schemas.OrderRow;
var FilterMapper = require('../helpers/filterMapper');
var filterMapper = new FilterMapper();
var OrderSchema = mongoose.Schemas.Order;
var populateWrapper = require('../helpers/callbackWrapper').populate;
var objectId = mongoose.Types.ObjectId;
var validator = require('validator');
var _ = require('lodash');

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var StockReturn;
            var stockReturn;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            StockReturn = models.get(dbName, 'stockReturns', StockReturnsSchema);

            stockReturn = new StockReturn(options);

            stockReturn.save(function (err, model) {
                if (err) {
                    return callback(err);
                }

                return callback(null, model);
            });
        };

        this.findForOrder = function (options, callback){
            var StockReturnsModel;
            var dbName;
            var query;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            query = options.query;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            StockReturnsModel = models.get(dbName, 'stockReturns', StockReturnsSchema);

            StockReturnsModel.aggregate([{
                $match: query
            }, {
                $unwind: {
                    path: '$journalEntrySources',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $group: {
                    _id: null,
                    date: {$max: '$releaseDate'},
                    names: {$addToSet: '$name'},
                    journalEntrySources: {$addToSet: '$journalEntrySources'}
                }
            }], function (err, result){
                if (err) {
                    return callback(err);
                }
                callback(null, result && result.length ? result[0] : {});

            });
        };

        this.findById = function (_id, options, callback) {
            var StockReturnsModel;
            var dbName;
            var query;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }
            dbName = options.dbName;

            if (!dbName || !validator.isMongoId(_id)) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            StockReturnsModel = models.get(dbName, 'stockReturns', StockReturnsSchema);
            var OrderRows = models.get(dbName, 'orderRows', OrderRowsSchema);
            var Order = models.get(dbName, 'Order', OrderSchema);

            query = StockReturnsModel.findById(_id);

            if (typeof callback === 'function') {
                query
                    .populate('status.receivedById', 'login')
                    .populate('orderRows.product', 'name info')
                    .populate('orderRows.warehouse', 'name')
                    .populate('orderRows.goodsOutNote', 'name')
                    .populate('orderRows.goodsInNote', 'name')
                    .exec(function (err, result) {

                        if (err) {
                            return callback(err);
                        }
                        result = result.toJSON();

                        callback(null, result);
                    });
            } else {
                return query;
            }
        };

        this.find = function (query, options, callback) {
            var StockReturnsModel;
            var dbName;
            var err;
            var resultFunction;
            var limit = options.limit;
            var queryParams = options.data
            var  filter = queryParams.filter || {};
            var contentType = queryParams.contentType;
            var keySort;
            var  optionsObject;
            var matchQuery = {}

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }
            var queryObject = {};
            queryObject.$and = [];
            var optionsObject = {};

            if (filter && typeof filter === 'object') {
                optionsObject = filterMapper.mapFilter(filter, {
                    contentType: contentType
                });
            }
            if(optionsObject) {
                queryObject.$and.push(optionsObject);
            }
            StockReturnsModel = models.get(dbName, 'stockReturns', StockReturnsSchema);
            resultFunction = StockReturnsModel.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from        : 'Order',
                    localField  : 'order',
                    foreignField: '_id',
                    as         : 'order'
                }
            },
                {
                    $lookup: {
                        from:'Products',
                        localField: 'orderRows.product',
                        foreignField: '_id',
                        as:'product'
                    }
                },

                {
                $lookup: {
                    from        : 'Users',
                    localField  : 'status.receivedById',
                    foreignField: '_id',
                    as          : 'status.receivedById'
                }
            },{
                "$match": queryObject
            },
                {
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
                        _id : '$root._id',
                        order                : {$arrayElemAt: ['$root.order', 0]},
                        'status.receivedById': {$arrayElemAt: ['$root.status.receivedById', 0]},
                        name                 : '$root.name',
                        'status.receivedOn'  : '$root.status.receivedOn',
                    }
                },
                {
                    $limit: limit
                }]);

            if (typeof callback !== 'function') {
                return query;
            }

            resultFunction.exec(function (err, result) {
                if (err) {
                    return callback(err);
                }
                var response = {}
                var firstElement = result[0];
                var count = firstElement && firstElement.total ? firstElement.total : 0;
                response.total = count;
                response.count = result.length;
                response.data = result;
                callback(null, response);
            });
        };
    };
};
