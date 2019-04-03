var express = require('express'),
    router = express.Router(),
    attendance = require('../../services/attendance/attendance.service.js');

    module.exports = function (models) {
    var attendances = new attendance(models)

        router.get('/mongo', attendances.getAttendanceAll);
        router.get('/details/:id',attendances.getDetailsByAttendanceId);
        router.get('/history/:id', attendances.getAttendanceHistory)
        router.post('/save',attendances.saveAttendance)

        return router;

    }