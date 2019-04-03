var express = require('express');
var router = express.Router();
var subjectHandler = require('../handlers/vSubject');
var subjectTopicsHandler = require('../handlers/vSubjectTopics');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _subjectHandler = new subjectHandler(models, event);
    var _subjectTopicsHandler = new subjectTopicsHandler(models, event);
    var moduleId = MODULES.VCOURSES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'journal', event);
    }

    router.use(authStackMiddleware);

    //Subject
    router.get('/', _subjectHandler.getForView);
    router.get('/center/course', _subjectHandler.getSubjectsByCC);
    router.get('/course', _subjectHandler.getSubjectsByCourse);
    router.get('/details/:id', _subjectHandler.getSubjectsByClassDetail);
    router.get('/topics/list', _subjectHandler.getTopics);
    router.get('/topics/sublist', _subjectHandler.getSubTopicAsso);
    router.post('/', accessStackMiddleware, _subjectHandler.create);
    router.put('/:id', accessStackMiddleware, _subjectHandler.update);
    router.delete('/:id', accessStackMiddleware, _subjectHandler.remove);

    //SubjectTopics
    router.get('/subjects', _subjectHandler.getForSubjectView);
    router.get('/topics', _subjectTopicsHandler.getForView);
    router.get('/sub/list', _subjectTopicsHandler.getSubTopics);
    router.get('/subject', _subjectTopicsHandler.getBySubjectId);
    router.get('/subject/course', _subjectTopicsHandler.getBySubjectCourseId);
    router.post('/topics', accessStackMiddleware, _subjectTopicsHandler.create);
    router.put('/topics/:id', accessStackMiddleware, _subjectTopicsHandler.update);
    router.delete('/topics/:id', accessStackMiddleware, _subjectTopicsHandler.remove);

    //SubjectSchedule
    router.get('/month', _subjectHandler.getBySubjectScheduleAndMonth);
    router.get('/batch', _subjectHandler.getBySubjectSchedule);


    return router;
};
