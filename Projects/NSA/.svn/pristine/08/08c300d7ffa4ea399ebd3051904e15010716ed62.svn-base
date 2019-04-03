/**
 * Created by Satya on 10/2/2018.
 */

var express = require('express');
var router = express.Router();
var SubHandler = require('../handlers/SubTopics');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var handler = new SubHandler(event, models);
    var moduleId = MODULES.SUBTOPICS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.get('/', handler.getForView);
   // router.post('/', handler.create);
    router.post('/',handler.createAndUpdate);
    router.patch('/', handler.updateData);
    router.get('/class',handler.getTopicOnly);
    router.delete('/:id', handler.remove);


    return router;
};

