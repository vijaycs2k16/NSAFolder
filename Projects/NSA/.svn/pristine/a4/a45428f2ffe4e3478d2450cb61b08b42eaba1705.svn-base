var express = require('express');
var router = express.Router();
var StudyContentHandler = require('../handlers/vStudyContent');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _studyHandler = new StudyContentHandler(models, event);
    var moduleId = MODULES.VCOURSES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

   /* function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'Course', event);
    }*/

   // router.use(authStackMiddleware);
    router.get('/',  _studyHandler.getExam);


    return router;
};
