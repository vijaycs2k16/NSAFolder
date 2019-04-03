var express = require('express')
var router = express.Router()
module.exports = function (app, mainDb) {
    var dbsObject = mainDb.dbsObject
    , initFilter = require('../common/filters/InitFilter')
    var models = require('../mongo/helpers/models.js')(dbsObject);
    var assessmentRouter = require('./assessment/assessment')(models);
    var studyContentRouter = require('./studymaterials/studyContent')(models);
    var practiceRouter = require('./practice/practice')(models);
    var sAssesmentRouter = require('./7pm/7pm')(models);
    var attendance = require('./attendances/attendances')(models);
    var newRouter = require('./new/new')(models);
    var apiVersionOne = '/rest/api/v1/nsa/';

    app.all(apiVersionOne + '*', initFilter.initValidation);

    app.use(apiVersionOne + 'assessment', assessmentRouter);
    app.use(apiVersionOne + 'studymaterials', studyContentRouter);
    app.use(apiVersionOne + 'practice', practiceRouter);
    app.use(apiVersionOne + '7pm', sAssesmentRouter);
    app.use(apiVersionOne + 'new', newRouter);
    app.use(apiVersionOne + 'attendances', attendance);

    return router;
}


/*
var mongoose = require('mongoose')
var objectId = mongoose.Types.ObjectId;


for (var i =0 ; i < 10000; i++ ){
    console.log(objectId())
}
*/
