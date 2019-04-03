/**
 * Created by senthil on 01/02/18.
 */
var mongoose = require('mongoose');
var feeTypesSchema = mongoose.Schemas.FeeCard;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');

var Module = function (models) {
    this.addFeeCard = function (req, data, next) {
        next(null, data)
    };
};

module.exports = Module;