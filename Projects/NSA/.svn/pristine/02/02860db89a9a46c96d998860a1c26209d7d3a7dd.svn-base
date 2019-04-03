/**
 * Created by Satya on 10/24/2018.
 */
var express = require('express');
var router = express.Router();
var ClassHandler = require('../handlers/nsaclass');

module.exports = function (models, event) {
    var _classHandler = new ClassHandler(models, event);

    router.get('/',  _classHandler.getForClass);

    return router;
};
