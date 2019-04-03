/**
 * Created by Sai Deepak on 16/02/18.
 */

var express = require('express');
var router = express.Router();
var assessmentHandler = require('../../mongo/handlers/7pm');

module.exports = function (models) {
    var _assessmentHandler = new assessmentHandler(models)

    //Examinations
     router.post('/exams/student/:_id', _assessmentHandler.updateStudentExamPaper);
     router.put('/exam/student/:_id', _assessmentHandler.updateStudentExamPaper); // For Student Single question save

     router.get('/student/exam', _assessmentHandler.getStudentExam);
     router.get('/exam/mock/:id', _assessmentHandler.getMockReport);
     router.put('/exam/student/result/:_id', _assessmentHandler.getStudentResult);
     router.get('/exam', _assessmentHandler.getExam);
     router.get('/exam/:id', _assessmentHandler.getExamByExamId);
     router.get('/toppers/overall', _assessmentHandler.getOverallToppers);
    router.get('/badge/winners', _assessmentHandler.getBadgeWinners);

    return router;
};
