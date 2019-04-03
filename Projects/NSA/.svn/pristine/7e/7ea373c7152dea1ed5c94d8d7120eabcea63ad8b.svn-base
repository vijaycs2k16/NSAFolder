/**
 * Created by Sathya on 11/27/2018.
 */

var express = require('express');
var router = express.Router();
var CourseHandler = require('../handlers/title');

module.exports = function (models, event) {
    var _titleHandler = new CourseHandler(models, event);


    router.get('/',  _titleHandler.getForView);
    router.get('/getForDd', _titleHandler.getForDd);
    router.get('/details', _titleHandler.getTitle);
    router.get('/subtopics/:id', _titleHandler.getSubTopics);
    router.get('/class/:cid', _titleHandler.getClassesByTitle);
    router.get('/classDetails', _titleHandler.getClassDetail);
    router.get('/schoolTitle', _titleHandler.getSchoolTitle)
    router.get('/:id', _titleHandler.getTitleById)
    router.get('/classcourse/:id', _titleHandler.getCourseByClass);
    router.get('/subTitle/:id', _titleHandler.getSubAndTitleByClass);
    router.post('/', _titleHandler.create);
    router.put('/:id',  _titleHandler.update);
    router.delete('/:id',  _titleHandler.remove);

    return router;
};
