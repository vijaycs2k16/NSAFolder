/**
 * Created by Sathya on 12/17/2018.
 */

var express = require('express');
var router = express.Router();
var termTopicsHandler = require('../handlers/subjectTermTopics');

module.exports = function (models, event) {
    var termHandler = new termTopicsHandler(models, event);

    router.get('/',  termHandler.getForView);
    router.post('/', termHandler.create);
    router.put('/:id',  termHandler.update);
    router.delete('/:id',  termHandler.remove);

    return router;
};
