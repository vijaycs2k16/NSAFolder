var express = require('express');
var router = express.Router();
var FranchiseHandler = require('../handlers/vFranchise');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _franchiseHandler = new FranchiseHandler(models, event);
    var moduleId = MODULES.FRANCHISE;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'journal', event);
    }

    router.use(authStackMiddleware);

    router.get('/', _franchiseHandler.getForView);
    router.get('/', _franchiseHandler.getForView);
    router.get('/getForDd', _franchiseHandler.getForDd);
    router.get('/writeOff', _franchiseHandler.getWriteOff);
    router.get('/getByAccount', _franchiseHandler.getByAccount);
    router.get('/getForCenter', _franchiseHandler.getForCenter);

    router.post('/', accessStackMiddleware, _franchiseHandler.create);
    router.patch('/', accessStackMiddleware, _franchiseHandler.putchBulk);
    router.post('/', _franchiseHandler.create);
    router.patch('/', _franchiseHandler.putchBulk);

    router.delete('/:id', accessStackMiddleware, _franchiseHandler.remove);
    router.delete('/', accessStackMiddleware, accessDeleteStackMiddlewareFunction, _franchiseHandler.bulkRemove);
    router.delete('/:id', _franchiseHandler.remove);
    router.delete('/', accessDeleteStackMiddlewareFunction, _franchiseHandler.bulkRemove);
    router.put('/:id', accessStackMiddleware, _franchiseHandler.update);
    router.get('/center/code', _franchiseHandler.getNewCenterCode);
    router.get('/center', _franchiseHandler.getCenterById);

    return router;
};
