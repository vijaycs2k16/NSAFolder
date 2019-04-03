/**
 * Created by kiranmai on 16/02/18.
 */

var express = require('express');
var router = express.Router();
var TransactionHandler = require('../handlers/vTransaction');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _transactionHandler = new TransactionHandler(models, event);

    router.get('/', _transactionHandler.getTransactions);
    router.get('/reports', _transactionHandler.getCCRReports);
    router.get('/exportToXlsx', _transactionHandler.exportToXlsx);
    router.get('/exportToCsv', _transactionHandler.exportToCsv);


    return router;
};
