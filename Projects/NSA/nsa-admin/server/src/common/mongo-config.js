'use strict';

exports.init = function(app) {
    var mongoose = require('mongoose');
    var async = require('async');
    var dbsObject = {};
//var models = require('./helpers/models')(dbsObject);
    var dbsNames = {};
    var connectOptions;
    var mainDb;

    var java = require("java");
    java.classpath.push("./helpers/java-lib/awl-me-toolkit-1.4.jar");

    mainDb = mongoose.createConnection(global.config.mongo.url, global.config.mongo.mainDB, global.config.mongo.port, global.config.mongo.connectOptions);
    mainDb.on('error', function (err) {
        err = err || 'connection error';
        console.error(err);

        process.exit(1, err);
    });
    mainDb.once('open', function callback() {
        var mainDBSchema;
        var port = parseInt(process.env.PORT, 10) || 9089;
        var instance = parseInt(process.env.NODE_APP_INSTANCE, 10) || 0;
        var main;

        port += instance;
        mainDb.dbsObject = dbsObject;

        dbsObject.mainDB = mainDb;

        console.log('Connection to mainDB is success');
        //require('./../mongo/models/index.js');
        //require('@nsa/nsa-assessment');
        require('./../mNsa/db/index.js');

        mainDBSchema = mongoose.Schema({
            _id: Number,
            url: {type: String, default: 'localhost'},
            DBname: {type: String, default: ''},
            pass: {type: String, default: ''},
            user: {type: String, default: ''},
            port: Number
        }, {collection: 'easyErpDBS'});

        main = mainDb.model('easyErpDBS', mainDBSchema);
        main.find().exec(function (err, result) {
            if (err) {
                process.exit(1, err);
            }

            async.each(result, function (_db, eachCb) {
                var dbInfo = {
                    DBname: '',
                    url: ''
                };
                var opts = {
                    db: {native_parser: true},
                    server: {poolSize: 5},
                    w: 1,
                    j: true
                };
                if (_db.DBname == 'Assessment') {
                    var dbObject = mongoose.createConnection(global.config.mongo.url, _db.DBname, _db.port, opts);

                    dbObject.on('error', function (err) {
                        console.error(err);
                        eachCb(err);
                    });
                    dbObject.once('open', function () {
                        console.log('Connection to ' + _db.DBname + ' is success');

                        dbInfo.url = _db.url;
                        dbInfo.DBname = _db.DBname;
                        dbsObject[_db.DBname] = dbObject;
                        dbsNames[_db.DBname] = dbInfo;

                        eachCb();
                    });
                } else {
                    eachCb();
                }


            }, function (err) {
                if (err) {
                    return console.error(err);
                }
                require('./../api/mongo-index')(app, mainDb);
                require('./../mNsa/routes/index')(app, mainDb);

            });
        });

        mainDb.mongoose = mongoose;
    });
}


