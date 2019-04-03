var express = require('express');
var router = express.Router();
var studentHandler = require('../handlers/vStudent');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _studentHandler = new studentHandler(models, event);
    var moduleId = MODULES.VSTUDENT;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'journal', event);
    }

    //router.use(authStackMiddleware);

    router.get('/detailsById/', _studentHandler.getStudentById);
    router.get('/details', accessStackMiddleware, _studentHandler.getForView);
    router.get('/taxanomy', _studentHandler.getStudentAllTaxanomyDetails);
    router.get('/leave', accessStackMiddleware, _studentHandler.getStudentLeaveDetails);
    router.get('/leave/report', _studentHandler.getStudentLeaveReport);
    router.get('/getStudentsAlphabet', accessStackMiddleware, _studentHandler.getStudentAlphabet);
    router.get('/getRegisterationsByCenter', accessStackMiddleware, _studentHandler.getRegisterationsByCenter);
    router.get('/revenueByCenter', accessStackMiddleware, _studentHandler.getRevenueByCenter);
    router.get('/', _studentHandler.getStudentForView);
    router.get('/:id', _studentHandler.getStudentDataById);
    router.get('/course/:id', _studentHandler.getCourseProductById);
    router.post('/', accessStackMiddleware, _studentHandler.create);
    router.post('/details', accessStackMiddleware, _studentHandler.createStudentDetails);
    router.put('/:id', _studentHandler.update);
    router.delete('/details/:id', accessStackMiddleware, _studentHandler.remove);
    router.delete('/details', accessStackMiddleware, _studentHandler.bulkRemove);
    router.get('/batch/students', _studentHandler.getStudentsByCBC);
    router.get('/taxonomy/students', accessStackMiddleware, _studentHandler.getStudentAllTaxanomyDetails);
    router.get('/taxonomy/students/:id', accessStackMiddleware, _studentHandler.getUpdateStudentTaxanomyDetails);
    router.get('/details/exportToXlsx', accessStackMiddleware, _studentHandler.exportToXlsx);
    router.get('/details/exportToCsv', accessStackMiddleware, _studentHandler.exportToCsv);


    /*router.get('/getForDD', handler.getForDD);

    router.get('/bySales', accessStackMiddleware, _studentHandler.getBySales);
    router.get('/exportToXlsx', accessStackMiddleware, _studentHandler.exportToXlsx);
    router.get('/exportToCsv', accessStackMiddleware, _studentHandler.exportToCsv);
    // router.get('/exportToCsv', accessStackMiddleware, handler.exportToCsv);
    router.get('/getForDdByRelatedUser', _studentHandler.getForDdByRelatedUser);
    router.get('/getForDd', _studentHandler.getSalesPerson);
    router.get('/getEmployeesAlphabet', accessStackMiddleware, _studentHandler.getEmployeesAlphabet);
    router.get('/getEmployeesImages', _studentHandler.getEmployeesImages);

    router.get('/getEmployeesCount', _studentHandler.getEmployeesCount);
    router.get('/getEmployeesCountForDashboard', _studentHandler.getEmployeesCountForDashboard);
    router.get('/settings', _studentHandler.getSettings);
    router.get('/:userId', profileAccess, _studentHandler.forProfile);*/


    return router;
};
