var express = require('express');
var router = express.Router();
var BatchHandler = require('../handlers/vBatchScheduler');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var batchHandler = new BatchHandler(models, event);
    var moduleId = MODULES.VBATCHES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'journal', event);
    }

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleware, batchHandler.getForView);
    router.get('/date', batchHandler.getByCenterAndDate);
    router.delete('/date', batchHandler.deleteByCenterAndDate);
    router.get('/mobile', accessStackMiddleware, batchHandler.getViewForMobile);
    router.get('/batch', batchHandler.getTopicsByBatch);
    router.get('/faculty', batchHandler.getFacultyTopics);
    router.get('/getForDd', batchHandler.getForDd);
    router.get('/writeOff', batchHandler.getWriteOff);
    router.get('/getByAccount', batchHandler.getByAccount);
    router.get('/day', batchHandler.getDayViewForMobile);

    router.get('/topics', batchHandler.getTopicsByCCS);
    router.get('/topics/class', batchHandler.getTopicsByClassS);

    router.post('/', accessStackMiddleware, batchHandler.create);
   /* router.post('/update/:id', batchHandler.updateClassSchedule);*/
    router.patch('/', accessStackMiddleware, batchHandler.putchBulk);
    router.patch('/', batchHandler.putchBulk);

    router.delete('/:id', batchHandler.remove);
    router.delete('/', accessStackMiddleware, accessDeleteStackMiddlewareFunction, batchHandler.bulkRemove);
    router.delete('/:id', batchHandler.remove);
    router.delete('/', accessDeleteStackMiddlewareFunction, batchHandler.bulkRemove);

    router.put('/:id', accessStackMiddleware, batchHandler.update);

    return router;
};
