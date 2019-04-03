/**
 * Created by Deepa on 8/6/2018.
 */



var express = require('express'),
    models = require('../../models'),
    baseService = require('./base.service'),
    dateService = require('../../utils/date.service'),
    _ = require('lodash'),
    constant = require('@nsa/nsa-commons').constants;

var SyllabusBase = function f(options) {
    var self = this;
};



SyllabusBase.deleteAttachmentByKey = function(req, data, callback) {
    try {
        var body = req.body;
        var findQuery = getFindQuery(req);
        findQuery.attachments = {'$contains_key': req.body.curentFile};
        models.instance.SchoolSyllabus.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, result)
        });

    } catch (err) {
        callback(err, null);
    }
};

function getFindQuery(req){
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;

    return findQuery;
}

module.exports = SyllabusBase;