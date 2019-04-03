
var express = require('express');
var router = express.Router();
var attendancesHandler = require('../../mongo/handlers/new');

module.exports = function (models) {
    var _attendancesHandler = new attendancesHandler(models)

    router.get('/mongo', _attendancesHandler.getAttendanceAll);

    return router;
};
