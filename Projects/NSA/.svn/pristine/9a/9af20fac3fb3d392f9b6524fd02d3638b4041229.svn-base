/**
 * Created by kiranmai on 05/02/18.
 */
var express = require('express');
var router = express.Router();
var notificationHandler = require('../handlers/vNotifications');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new notificationHandler(models, event);
    var moduleId = MODULES.VNOTIFICATION;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'journal', event);
    }

    router.get('/', handler.getForView);
    router.get('/student', handler.getStudentNotifications);
    router.get('/employee', handler.getEmpNotifications);
    router.get('/emp', handler.getEmployeeNotifications);
    router.get('/other', handler.getOtherNotifications);
    router.post('/', handler.create);
    router.put('/:id', handler.update);
    router.get('/taxanomy', handler.getNotificationById);
    router.delete('/:id', handler.remove);
    router.post('/employee', handler.createEmpNotification);
    router.put('/employee/:id', handler.updateEmpNotification);
    router.delete('/employee/:id', handler.removeEmpNotifications);
    router.post('/other', handler.createOtherNotification);
    router.put('/other/:id', handler.updateOtherNotification);
    router.delete('/other/:id', handler.removeOtherNotifications);
    return router;
};
