/**
 * Created by Satya on 10/24/2018.
 */

var mongoose = require('mongoose');
var ClassDetailSchema = mongoose.Schemas.ClassDetails;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');

var Module = function (models) {
    this.getForClass = function (req, res, next) {
        var Report = models.get(req.session.lastDb, 'ClassDetails', ClassDetailSchema);
        var query;

        query = Report.find({});

        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data:response});

        });
    };

};

module.exports = Module;