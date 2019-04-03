/**
 * Created by Manivannan on 10/24/2018.
 */

var mongoose = require('mongoose');
var SectionSchema = mongoose.Schemas.section;
var examSchema = mongoose.Schemas.ExamSchedule;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');

var Module = function (models) {
    this.getForSections = function (req, res, next) {
        var Report = models.get(req.session.lastDb, 'section', SectionSchema);
        var query;

        query = Report.find({});

        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data:response});

        });
    };

    this.getForLimitSectionView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'section', SectionSchema);
        var sectionModel = models.get(req.session.lastDb, 'ExamSchedule', examSchema);
        var getSection;
        var getExamSection;
        var data = req.query;
        var sort = data.sort || {_id: 1};
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;

        getSection = function (cb) {
            Model
                .find({})
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
        };

        getExamSection = function (cb) {
            sectionModel.aggregate([
                {
                    $project: {
                        _id: '$section'
                    }
                },
            ],function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result || 0);
            });
        };

        async.parallel([getSection, getExamSection], function (err, result) {
            //var Section =_.differenceBy(JSON.parse(JSON.stringify(result[0])), JSON.parse(JSON.stringify(result[1])), '_id');
            if (err) {
                return next(err);
            }

            res.status(200).send(result[0]);
        });
    };

};

module.exports = Module;