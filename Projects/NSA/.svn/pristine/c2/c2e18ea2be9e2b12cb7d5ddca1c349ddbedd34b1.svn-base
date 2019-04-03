/**
 * Created by Manivanan on 16/02/18.
 */

var express = require('express');
var router = express.Router();
var testConfigurationHandler = require('../handlers/testConfiguration');

module.exports = function (models, event) {
    var configurationHandler = new testConfigurationHandler(models, event);

    router.get('/', configurationHandler.getTestConfig);
    router.post('/', configurationHandler.create);
    router.delete('/:id',  configurationHandler.remove);
    router.put('/status/:id', configurationHandler.updateScheduleStatus);
    router.post('/manual/select', configurationHandler.getManualSelected);
    router.post('/questions/random/:limit', configurationHandler.getRandomWithOutSelected);

    return router;
};
