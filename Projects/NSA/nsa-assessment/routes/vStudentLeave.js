var express = require('express');
var router = express.Router();
var JournalHandler = require('../handlers/vStudentLeave');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _batchHandler = new JournalHandler(models, event);
    var moduleId = MODULES.VSTUDENTLEAVE;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'journal', event);
    }

    router.use(authStackMiddleware);

    router.post('/', accessStackMiddleware, _batchHandler.create);

    router.get('/', authStackMiddleware, accessStackMiddleware, _batchHandler.getForView);
    router.get('/std', authStackMiddleware, _batchHandler.getStudentAttendance);
    router.get('/year', authStackMiddleware, _batchHandler.getYearForView);
    router.get('/getYears', authStackMiddleware, accessStackMiddleware, _batchHandler.getYears);
    router.get('/getStatistic', authStackMiddleware, accessStackMiddleware, _batchHandler.getStatistic);

    router.patch('/', authStackMiddleware, accessStackMiddleware, _batchHandler.putchBulk);

    router.delete('/:id', authStackMiddleware, accessStackMiddleware, _batchHandler.remove);

    return router;
};
