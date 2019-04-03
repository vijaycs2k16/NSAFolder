/**
 * Created by senthil on 30/01/18.
 */
var express = require('express');
var router = express.Router();
var registrationHandler = require('../handlers/vRegistration');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new registrationHandler(models, event);
    var moduleId = MODULES.VREGISTRATION;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'journal', event);
    }

    //router.use(authStackMiddleware);

    router.patch('/stage/:id', handler.updateStage);
    router.post('/', handler.register);
    router.post('/mobile', handler.mobileRegister);
    router.put('/:id', handler.update);
    router.delete('/', handler.deleteRegistration);
    router.delete('/single', handler.deleteSinglePaymentDetails);
    router.get('/', handler.getRegistrationDetails);
    router.get('/details', handler.getRegistrationDetailsById);
    router.get('/years', handler.getAcademicYears);
    router.get('/student', handler.getStudentFeeDetailsById);
    router.post('/installment/pay', handler.payInstallmentFee);
    router.post('/transaction/success', handler.transaction);
    router.post('/feeTypeDetails', handler.getStudentFeeTypesDetails);
    router.put('/approve/:id', handler.updateApproveStatus);
    return router;
};
