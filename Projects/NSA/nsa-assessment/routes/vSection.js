/**
 * Created by Manivannan on 10/24/2018.
 */
var express = require('express');
var router = express.Router();
var SectionHandler = require('../handlers/vSection');

module.exports = function (models, event) {
    var _sectionHandler = new SectionHandler(models, event);

    router.get('/',  _sectionHandler.getForSections);
    router.get('/limitSection',  _sectionHandler.getForLimitSectionView);

    return router;
};
