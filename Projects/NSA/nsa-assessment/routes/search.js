var express = require('express');
var router = express.Router();
var MODULES = require('../constants/modules');
var elasticsearch = require('../services/elasticsearch.service')
module.exports = function (models, event) {

    router.get('/schools', elasticsearch.getSchoolData);
    return router;
};
