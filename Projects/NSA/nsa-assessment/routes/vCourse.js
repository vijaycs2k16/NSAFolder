var express = require('express');
var router = express.Router();
var CourseHandler = require('../handlers/vCourse');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _courseHandler = new CourseHandler(models, event);
    var moduleId = MODULES.VCOURSES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'Course', event);
    }

    router.use(authStackMiddleware);
    router.get('/',  _courseHandler.getForView);
    router.get('/getForDd', _courseHandler.getForDd);
    router.get('/details', _courseHandler.getCourse);
    router.get('/subtopics/:id', _courseHandler.getSubTopics);
    router.get('/class/:cid', _courseHandler.getClassesByCourse);
    router.get('/classDetails', _courseHandler.getClassDetail);
    router.get('/classcourse/:id', _courseHandler.getCourseByClass);
    router.post('/', accessStackMiddleware, _courseHandler.create);
    router.put('/:id', accessStackMiddleware, _courseHandler.update);
    router.post('/', _courseHandler.create);
    router.delete('/:id', accessStackMiddleware, _courseHandler.remove);

    return router;
};
