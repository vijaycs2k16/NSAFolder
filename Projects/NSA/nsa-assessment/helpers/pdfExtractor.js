'use strict';

var fs = require('fs');
var htmltopdf = require('html-pdf');

function post(req, res, next) {
    var body = req.body;
    var name = body.name;

    var htmlTemplate = '<!DOCTYPE html><html><head>' +
        "<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700' rel='stylesheet' type='text/css'>" +
        '<link rel=""stylesheet" href="' + process.env.HOST + 'css/jquery.Jcrop.css" type="text/css"/>' +
        '<link rel="stylesheet" href="' + process.env.HOST + 'css/main.css" type="text/css"/>' +
        '<link rel="stylesheet" href="' + process.env.HOST + 'css/style.css" type="text/css"/></head>' +
        '<link rel="stylesheet" href="' + process.env.HOST + 'css/vstyle.css" type="text/css"/><style> .forms {margin: 0 auto; padding: 2em; } .wrap {width: 100%; overflow:auto; } .fleft {float:left; width: 50%; } .fright {float: right; width: 50%; } .vr {width:1px; background-color:#000; position:absolute; top:45px; bottom:0; left:50%; right:50%; } .bix-td-option {vertical-align: middle; padding: 3px; } .bix-td-qno {line-height: 1.5; width: 16px; } .bix-div-container {padding: 7px; line-height: 1.7; } .bix-div-container p { font-family: sans-serif; } td {font-size: 10px !important; font-family: sans-serif;} img.Wirisformula { width:25px !important; height:19px !important;}  </style></head><body >'
        + body.file +
        '</body></html>';
    var options = {
        format     : 'A4',
        orientation: 'portrait'
    };


    htmltopdf.create(htmlTemplate, options).toFile(name + '.pdf', function (err, file) {

        if (err) {
            return next(err);
        }

        res.send(200, {name: name, path: file ? file.filename : ''});
    });
};

function get(req, res, next) {
    var name = req.query.name;

    res.download(name + '.pdf', name + '.pdf', function (err) {
        if (err) {
            return next(err);
        }

        fs.unlink(name + '.pdf', function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('done');
            }
        });
    });

};

module.exports = {
    post: post,
    get : get
};