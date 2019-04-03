/**
 * Created by kiranmai on 16/02/18.
 */

var express = require('express');
var router = express.Router();
var assessmentHandler = require('../handlers/vAssessment');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _assessmentHandler = new assessmentHandler(models, event);
    var moduleId = MODULES.VASSESSMENT;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'assessment', event);
    }

    //router.use(authStackMiddleware);

    router.get('/subject', accessStackMiddleware, _assessmentHandler.getSubjectWiseReport);
    router.get('/topic', accessStackMiddleware, _assessmentHandler.getTopicWiseReport);
    router.get('/report/exam', accessStackMiddleware, _assessmentHandler.getStudentExamReport);
    router.get('/exam/conduct', accessStackMiddleware, _assessmentHandler.getExamConductReport);


    //// Questions /////

    router.get('/dashboard', accessStackMiddleware, _assessmentHandler.getMockSubjectReport);
    router.get('/questions', accessStackMiddleware, _assessmentHandler.getQuestions);
    router.post('/question', accessStackMiddleware, _assessmentHandler.getQuestions);
    router.get('/questions/:_id', accessStackMiddleware, _assessmentHandler.getQuestion);
    router.post('/questions/topic', _assessmentHandler.getQuestionsByTopic); // If user manual selection option render all the questions based on topic
    router.post('/questions/random/:limit', _assessmentHandler.getRandomQuestions);
    router.post('/questions/count/weightage', _assessmentHandler.getQuestionsCountByWeightage);
    router.post('/questions/weightage/:limit', _assessmentHandler.getQuestionsByWeightage);
    router.post('/questions', accessStackMiddleware, _assessmentHandler.createQuestion);
    router.put('/questions/:_id', accessStackMiddleware, _assessmentHandler.updateQuestion);
    router.delete('/questions', accessStackMiddleware, _assessmentHandler.deleteQuestion);

    /// Paper Configuration //////
    router.get('/sheet', accessStackMiddleware, _assessmentHandler.getSheet);
    router.post('/sheet', accessStackMiddleware, _assessmentHandler.createSheet);
    router.put('/sheet/:_id', accessStackMiddleware, _assessmentHandler.updateSheet);
    router.delete('/sheet/:_id', accessStackMiddleware, _assessmentHandler.deleteSheet);

    //Exam Configuration
    router.get('/examconfig', accessStackMiddleware, _assessmentHandler.getExamConfig);
    router.post('/examconfig', accessStackMiddleware, _assessmentHandler.createExamConfig);
    router.put('/examconfig/:_id', accessStackMiddleware, _assessmentHandler.updateExamConfig);
    router.delete('/examconfig/:_id', accessStackMiddleware, _assessmentHandler.deleteExamConfig);

    //Examination
    router.post('/exams/student/:_id', _assessmentHandler.updateStudentExamPaper);
    router.get('/exam', _assessmentHandler.getExam);
    router.get('/student/exam', accessStackMiddleware, _assessmentHandler.getStudentExam);
    router.get('/exam/mock/aggregate', accessStackMiddleware, _assessmentHandler.getMockAggReport);
    router.get('/exam/mock/:id', accessStackMiddleware, _assessmentHandler.getMockReport);
    router.get('/exam/schedule', accessStackMiddleware, _assessmentHandler.getExamSchedule);
    router.get('/exam/details', accessStackMiddleware, _assessmentHandler.getDetailsByExamId);
    router.get('/exam/:id', accessStackMiddleware, _assessmentHandler.getExamByExamId);
    router.get('/center', accessStackMiddleware, _assessmentHandler.getCenterExams);
    router.post('/exam', accessStackMiddleware, _assessmentHandler.createExam);
    router.put('/exam/schedule/:examId', accessStackMiddleware, _assessmentHandler.updateExamSchedule);
    //router.put('/exam/:_id', accessStackMiddleware, _assessmentHandler.getExamInfoById);
    //router.put('/exam/:_id', accessStackMiddleware, _assessmentHandler.updateExam);
    router.delete('/exam/:examId', accessStackMiddleware, _assessmentHandler.deleteExam);
    router.delete('/exam', accessStackMiddleware, _assessmentHandler.bulkRemove);
    router.put('/exam/student/:_id', accessStackMiddleware, _assessmentHandler.updateStudentExamPaper); // For Student Single question save
    router.put('/exam/student/result/:_id', accessStackMiddleware, _assessmentHandler.getStudentResult);
    router.get('/exam/student/view/:_id', _assessmentHandler.getStudentResultView); //FOr Student Exam Paper review after result
    router.get('/exam/result', accessStackMiddleware, _assessmentHandler.getTopStudents); //get top students for latest five exams

    return router;
};