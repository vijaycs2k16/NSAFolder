/**
 * Created by kiranmai on 16/02/18.
 */

var express = require('express');
var router = express.Router();
var feedbackHandler = require('../handlers/vFeedback');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _feedbackHandler = new feedbackHandler(models, event);
    var moduleId = MODULES.VFEEDBACK;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'feedback', event);
    }

    router.use(authStackMiddleware);

    router.get('/student', accessStackMiddleware, _feedbackHandler.getStudentFeedback);
    router.post('/student', accessStackMiddleware, _feedbackHandler.createStudentFeedback);
    router.put('/student/:_id', accessStackMiddleware, _feedbackHandler.updateStudentFeedback);
    router.delete('/student/:_id', accessStackMiddleware, _feedbackHandler.deleteStudentFeedback);

    router.get('/employee', accessStackMiddleware, _feedbackHandler.getEmployeeFeedback);
    router.post('/employee', accessStackMiddleware, _feedbackHandler.createEmployeeFeedback);
    router.put('/employee/:_id', accessStackMiddleware, _feedbackHandler.updateEmployeeFeedback);
    router.delete('/employee/:_id', accessStackMiddleware, _feedbackHandler.deleteEmployeeFeedback);

    return router;
};
