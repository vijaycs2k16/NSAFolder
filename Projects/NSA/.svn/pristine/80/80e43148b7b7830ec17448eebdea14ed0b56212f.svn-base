/**
 * Created by kiranmai on 16/02/18.
 */

var express = require('express');
var router = express.Router();
var practiceHandler = require('../handlers/vPractice');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _practiceHandler = new practiceHandler(models, event);
    var moduleId = MODULES.VASSESSMENT;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'assessment', event);
    }

    //router.use(authStackMiddleware);

    //Examination
    router.get('/exam/mock/:id', accessStackMiddleware, _practiceHandler.getMockReport);
    router.post('/exams/student/:_id', _practiceHandler.updateStudentExamPaper);
    router.get('/exam', accessStackMiddleware, _practiceHandler.getExam);
    router.get('/exam/practice/list', accessStackMiddleware, _practiceHandler.getPracticeList);
    router.get('/exam/:sid/:tid', accessStackMiddleware, _practiceHandler.getExamBySub);
    router.get('/exam/schedule', accessStackMiddleware, _practiceHandler.getExamSchedule);
    router.get('/exam/details', accessStackMiddleware, _practiceHandler.getDetailsByExamId);
    router.get('/exam/:id', accessStackMiddleware, _practiceHandler.getExamByExamId);
    router.get('/pexam/:id', accessStackMiddleware, _practiceHandler.getPExamById);
    router.get('/center', accessStackMiddleware, _practiceHandler.getCenterExams);
    router.post('/exam', accessStackMiddleware, _practiceHandler.createExam);
    router.put('/exam/schedule/:examId', accessStackMiddleware, _practiceHandler.updateExamSchedule);
    //router.put('/exam/:_id', accessStackMiddleware, _assessmentHandler.getExamInfoById);
    //router.put('/exam/:_id', accessStackMiddleware, _assessmentHandler.updateExam);
    router.delete('/exam/:examId', accessStackMiddleware, _practiceHandler.deleteExam);
    router.delete('/exam/practice/list/:examId', accessStackMiddleware, _practiceHandler.deletePracticeExam);

    router.put('/exam/student/:_id', accessStackMiddleware, _practiceHandler.updateStudentExamPaper); // For Student Single question save
    router.put('/exam/student/result/:_id', accessStackMiddleware, _practiceHandler.getStudentResult);
    router.get('/exam/student/view/:_id', _practiceHandler.getStudentResultView); //FOr Student Exam Paper review after result
    router.get('/exam/result', accessStackMiddleware, _practiceHandler.getTopStudents); //get top students for latest five exams

    return router;
};
