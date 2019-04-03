/**
 * Created by Manivannan on 29/11/18.
 */

var express = require('express');
var router = express.Router();
var StudyContentHandler = require('../../mongo/handlers/studyContent');

module.exports = function (models) {
    var _studyHandler = new StudyContentHandler(models);

    //Examination

    router.get('/',  _studyHandler.getExam);
    router.get('/title',  _studyHandler.getTitle);
    router.post('/title/topics',  _studyHandler.getTopicVideos);
    router.get('/student/:classId',  _studyHandler.getSubject);
    router.get('/details/:id', _studyHandler.getSubjectsByClassDetail);

    return router;
};
