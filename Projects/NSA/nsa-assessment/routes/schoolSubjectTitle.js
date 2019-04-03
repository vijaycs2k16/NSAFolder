/**
 * Created by Sathya on 12/12/2018.
 */

var express = require('express');
var router = express.Router();
var schoolTitleHandler = require('../handlers/schoolSubjectTitle');

module.exports = function (models, event) {
    var schoolHandler = new schoolTitleHandler(models, event);

    router.get('/',  schoolHandler.getForView);
    router.get('/term',  schoolHandler.getTermByIds);
    router.post('/', schoolHandler.create);
    router.put('/:id',  schoolHandler.update);
    router.delete('/',  schoolHandler.remove);

    return router;
};