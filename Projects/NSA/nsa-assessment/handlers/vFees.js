/**
 * Created by senthil on 01/02/18.
 */
var mongoose = require('mongoose');
var feeTypesSchema = mongoose.Schemas.Fees;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');

var Module = function (models) {
    this.addFees = function (req, data, next) {
        next(null, data)
    };

    this.addFeeCardByAdmin = function (req, data, next) {
        next(null, data)
    };
};

module.exports = Module;