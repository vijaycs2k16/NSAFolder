var express = require('express');
var router = express.Router();
var PermissionHandler = require('../handlers/permission');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (event, models, mainDb) {
    'use strict';
    var handler = new PermissionHandler(event, models);

    router.get('/', handler.getPermission);
    router.get('/tabs', handler.getPermissionByMod);

    return router;
};
