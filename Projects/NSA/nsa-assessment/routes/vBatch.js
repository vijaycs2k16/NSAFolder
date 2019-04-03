var express = require('express');
var router = express.Router();
var JournalHandler = require('../handlers/vBatch');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _batchHandler = new JournalHandler(models, event);
    var moduleId = MODULES.VBATCHES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'journal', event);
    }

    router.use(authStackMiddleware);

    router.get('/', _batchHandler.getForView);
    router.get('/', _batchHandler.getForView);
    router.get('/getForDd', _batchHandler.getForDd);
    router.get('/getCB', _batchHandler.getCB);
    router.get('/writeOff', _batchHandler.getWriteOff);
    router.get('/getByAccount', _batchHandler.getByAccount);

    router.post('/', accessStackMiddleware, _batchHandler.create);
    router.patch('/', accessStackMiddleware, _batchHandler.putchBulk);
    router.post('/', _batchHandler.create);
    router.patch('/', _batchHandler.putchBulk);

    router.delete('/:id', accessStackMiddleware, _batchHandler.remove);
    router.delete('/', accessStackMiddleware, accessDeleteStackMiddlewareFunction, _batchHandler.bulkRemove);
    router.delete('/:id', _batchHandler.remove);
    router.delete('/', accessDeleteStackMiddlewareFunction, _batchHandler.bulkRemove);

    router.put('/:id', accessStackMiddleware, _batchHandler.update);

    router.get('/center/course', _batchHandler.getBatchesByCenterCourseId);
    router.post('/center/course', _batchHandler.getBatchesByCC);

    return router;
};
