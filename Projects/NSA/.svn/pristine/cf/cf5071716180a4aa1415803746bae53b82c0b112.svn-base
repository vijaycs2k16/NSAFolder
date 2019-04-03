/**
 * Created by bharatkumarr on 31/01/18.
 */

var request = require('ajax-request');
var Client = require('node-rest-client').Client;

var client = new Client();

var Utils = function f(options) {
    var self = this;
};

Utils.testPressUserCreate = function(req, batch, callback) {

    var reqHeaders = {};
    reqHeaders["content-type"] = "application/json";
    reqHeaders["cache-control"] = 'no-cache';

    authentication(reqHeaders, function (err, resBody) {
        if (err) {
            callback(err, null);
        } else {
            reqHeaders.authorization = 'JWT ' + resBody.token;
            var formData = {};
            formData["username"] = req.body.studentEmail;
            formData["password"] = req.body.originalPassword;
            formData["first_name"] = req.body.studentName;
            formData['gender_code'] = req.body.studentGender.toLowerCase();
            formData["state_code"] = "IN-TN";
            formData["batches"] = [batch.batchName];
            console.log("formData",batch.batchName,  formData)
            call3rdLoginParty(global.config.testpress.createUser, formData, reqHeaders, callback)
        }
    });
};

function authentication(reqHeaders, callback) {
    var formData = { username : global.config.testpress.username, password:  global.config.testpress.password } ;
    call3rdParty(global.config.testpress.auth, formData, reqHeaders, callback);
};

function call3rdParty(url, formData, reqHeaders, callback) {
    if(global.config.testpress.app) {
        request.post({ url: url, headers: reqHeaders, data: formData},
            function(err, resp, body) {

                if (err) {
                    callback(err, null);
                } else {
                    try {
                        body = JSON.parse(body);
                        callback(null, body)
                    } catch (e) {
                        callback ({message: 'user creation failed ' + e.message}, null);
                    }

                }
            });

    } else {
        callback(null, formData)
    }

}

function call3rdLoginParty(url, formData, reqHeaders, callback) {
    if(global.config.testpress.app) {
        getAllBatches(reqHeaders, formData, function (err, response) {
            request.post({ url: url, headers: reqHeaders, data: formData},
                function(err, resp, body) {

                    if (err) {
                        callback(err, null);
                    } else {
                        try {
                            body = JSON.parse(body);
                            callback(null, body)
                        } catch (e) {
                            callback ({message: 'user creation failed ' + e.message}, null);
                        }

                    }
                });
        })


    } else {
        callback(null, formData)
    }

}

function getAllBatches(reqHeaders, formData, callback) {
    var args = {
        headers: reqHeaders // request headers
    };

    client.get(global.config.testpress.batch + '?q=' +formData['batches'][0], args, function (data, response) {
        if(data.results.length <= 0) {
            request.post({ url: global.config.testpress.batch, headers: reqHeaders, data: {"name": formData['batches'][0]}},
                function(err, resp, body) {

                    if (err) {
                        callback(err, null);
                    } else {
                        try {
                            body = JSON.parse(body);
                            callback(null, body)
                        } catch (e) {
                            callback ({message: 'Batch creation failed ' + e.message}, null);
                        }

                    }
                });
        } else {
            callback(null, formData)
        }
    });

}

module.exports = Utils;
