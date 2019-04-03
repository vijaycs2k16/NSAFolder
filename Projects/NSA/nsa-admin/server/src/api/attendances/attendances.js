
var express = require('express');
var router = express.Router();
var attendancesHandler = require('../../mongo/handlers/attendance');

module.exports = function (models) {
    var _attendancesHandler = new attendancesHandler(models)

    router.get('/mongo', _attendancesHandler.getAttendanceAll);
    //router.get('/mongo', _attendancesHandler.getSubject);
    router.post('/save',_attendancesHandler.saveAttendance)

    return router;
};
