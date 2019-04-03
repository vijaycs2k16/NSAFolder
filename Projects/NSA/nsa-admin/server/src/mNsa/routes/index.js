var express = require('express')
module.exports = function (app, mainDb) {
    var dbsObject = mainDb.dbsObject
    , initFilter = require('../../common/filters/InitFilter')
    , models = require('../core/models.js')(dbsObject)
    , assignmentRouter = require('./assignment/assignments')(models)
    , attendanceRouter = require('./attendance/attendance')(models);




    var apiVersionOne = '/rest/api/v1/nsa/';

    app.all(apiVersionOne + '*', initFilter.initValidation);

    app.use(apiVersionOne + 'assignment', assignmentRouter);
    app.use(apiVersionOne + 'attendanc', attendanceRouter);

}


/*
var mongoose = require('mongoose')
var objectId = mongoose.Types.ObjectId;


for (var i =0 ; i < 10000; i++ ){
    console.log(objectId())
}
*/