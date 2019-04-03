/**
 * Created by Sathya on 11/28/2018.
 */

var express = require('express');
var router = express.Router();
var subjectTitleHandler = require('../handlers/subjectTitle');

module.exports = function (models, event) {
    var handler = new subjectTitleHandler(models, event);


    router.get('/',  handler.getForView);
    router.post('/', handler.create);
    router.patch('/', handler.putchBulk);
    router.put('/:id',  handler.update);
    router.delete('/:id',  handler.remove);
    router.delete('/', handler.bulkRemove);

    return router;
};