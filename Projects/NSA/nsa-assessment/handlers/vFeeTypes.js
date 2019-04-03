/**
 * Created by senthil on 31/01/18.
 */
var mongoose = require('mongoose');
var feeTypesSchema = mongoose.Schemas.FeeTypes;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');

var Module = function (models) {
    this.getFeeTypes = function (req, next) {
        var Model = models.get('CRM', 'FeeTypes', feeTypesSchema);
        Model.find({feeTypeStatus: true}, function(err, data) {
            next(err, data)
        });
    };
};

module.exports = Module;