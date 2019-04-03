/**
 * Created by kiranmai on 16/02/18.
 */

var express = require('express');
var router = express.Router();
var assessmentHandler = require('../../mongo/handlers/assessment');

module.exports = function (models) {
    var _assessmentHandler = new assessmentHandler(models)

    //Examination
    router.post('/exams/student/:_id', _assessmentHandler.updateStudentExamPaper);
    router.get('/exam/schedule', _assessmentHandler.getExamSchedule);
    router.get('/exam/schedule/log/:id', _assessmentHandler.getExamScheduleLog);
    router.post('/exam', _assessmentHandler.createExam);
    router.put('/exam/schedule/:examId', _assessmentHandler.updateExamSchedule);
    router.put('/exam/student/:_id', _assessmentHandler.updateStudentExamPaper); // For Student Single question save

    router.get('/student/exam', _assessmentHandler.getStudentExam);
    router.post('/exam/list', _assessmentHandler.getExamList);
    router.get('/exam/mock/aggregate', _assessmentHandler.getMockAggReport);
    router.get('/exam/mock/:id', _assessmentHandler.getMockReport);
    router.get('/exam/:id', _assessmentHandler.getExamByExamId);
    router.get('/exam/ques/:id', _assessmentHandler.getQuesByExamId);
    router.put('/exam/student/result/:_id', _assessmentHandler.getStudentResult);
    router.delete('/exam/student/result/:_id/:examId', _assessmentHandler.deleteStudentResult);
    router.get('/exam', _assessmentHandler.getExam);
    router.get('/dashboard', _assessmentHandler.getMockSubjectReport);

    return router;
};