/**
 * Created by senthil on 01/09/17.
 */
var express = require('express'),
    router = express.Router(),
    Vimeo = require('vimeo').Vimeo,
    https = require("https"),
    formidable = require('formidable'),
    lib = new Vimeo('840d4d7d2c7a708a8476640865e508c35a5550ac',
    '3fZEnK8Wp9saajzam3cn7lMkd+92D+advLywGiV6psq8PDV2Wgc3ABtXqZP8DJNKypEDeMCG39yMNWJpxWJ8kSrhT4wDn4lKWH5A/b+70xpTVsVmkyKo/Xu32+NXxxy0',
    'e377a7f9e9f781622e43c6fedf03ccac');

exports.uploadVideo = function(req, callback) {
    var form = new formidable.IncomingForm();
    form.on('file', function(name, file) {
        lib.streamingUpload(file.path,  function (error, body, status_code, headers) {
            if (error) {
                callback(error, body)
            }
            lib.request(headers.location, function (error, body, status_code, headers) {
                body.originalname = file.name
                callback(null, body)
            });
        }, function (upload_size, file_size) {
        });
    });
    form.parse(req);
};

exports.deleteVideo = function(req, id, callback) {
    var options = {
        host: "api.vimeo.com",
        path: "/videos/"+id,
        method: "DELETE",
        headers: {
            "Authorization": "Bearer e377a7f9e9f781622e43c6fedf03ccac"
        }
    };
    var responseString = "";
    https.request(options, function (res) {
        res.on("data", function (data) {
            responseString += data;
        });
        res.on("end", function () {
            callback(null, responseString)
        });
    }).on('error',  function (error) {
        callback(error, null)
    }).end();
};
