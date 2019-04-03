var express = require('express');
var router = express.Router();
var topicHandler = require('../handlers/vTopic');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _topicHandler = new topicHandler(models, event);
    var moduleId = MODULES.VCOURSES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'Topic', event);
    }

    //router.use(authStackMiddleware);

    router.get('/', _topicHandler.getForView);
    router.get('/subject', _topicHandler.getBySubjectId);
    router.get('/subject/course', _topicHandler.getBySubjectCourseId);
    router.get('/subject/classDetail', _topicHandler.getBySubjectClassDetailId);
    router.post('/', accessStackMiddleware, _topicHandler.create);
    router.put('/:id', accessStackMiddleware, _topicHandler.update);
    router.delete('/:id', accessStackMiddleware, _topicHandler.remove);

    return router;
};
