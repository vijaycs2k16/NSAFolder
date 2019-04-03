/**
 * Created by kiranmai on 16/02/18.
 */

var express = require('express');
var router = express.Router();
var practiceHandler = require('../../mongo/handlers/practice');

module.exports = function (models, event) {
    var _practiceHandler = new practiceHandler(models, event);

    //Examination
    /*router.get('/exam/mock/:id',  _practiceHandler.getMockReport);
    router.post('/exams/student/:_id', _practiceHandler.updateStudentExamPaper);
    router.get('/exam',  _practiceHandler.getExam);
    router.get('/exam/practice/list',  _practiceHandler.getPracticeList);*/
    router.get('/exam/:sid/:tid',  _practiceHandler.getExamBySub);
    /*router.get('/exam/schedule',  _practiceHandler.getExamSchedule);
    router.get('/exam/details',  _practiceHandler.getDetailsByExamId);
    router.get('/exam/:id',  _practiceHandler.getExamByExamId);
    router.get('/pexam/:id',  _practiceHandler.getPExamById);
    router.get('/center',  _practiceHandler.getCenterExams);
    router.post('/exam',  _practiceHandler.createExam);
    router.put('/exam/schedule/:examId',  _practiceHandler.updateExamSchedule);
    //router.put('/exam/:_id',  _assessmentHandler.getExamInfoById);
    //router.put('/exam/:_id',  _assessmentHandler.updateExam);
    router.delete('/exam/:examId',  _practiceHandler.deleteExam);
    router.delete('/exam/practice/list/:examId',  _practiceHandler.deletePracticeExam);

    router.put('/exam/student/:_id',  _practiceHandler.updateStudentExamPaper); // For Student Single question save
    router.put('/exam/student/result/:_id',  _practiceHandler.getStudentResult);
    router.get('/exam/student/view/:_id', _practiceHandler.getStudentResultView); //FOr Student Exam Paper review after result
    router.get('/exam/result',  _practiceHandler.getTopStudents);*/ //get top students for latest five exams

    return router;
};
