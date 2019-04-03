/**
 * Created by kiranmai on 05/02/18.
 */

var mongoose = require('mongoose');
var NotificationSchema = mongoose.Schemas.StudentNotifications;
var async = require('async');
var request = require('request');
var moment = require('moment')
var _ = require('lodash');

var Module = function (models) {

    function getDb(req) {
        return req.session.lastDb || 'CRM'
    }

    function sendSMS(req, data, callback) {
        var body = req.body;

        //var configObj = notificationObj.configObj;
        request({
            url: global.config.sms.valueLeaf.url, //URL to hit
            method: 'POST',
            json: data.smsObj,
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            data.smsResponse = body
            if (error) {
                callback(error, response, data)
            } else {
                callback(null, response, data)
            }
        });
    }

    function sendNotification(req, data, callback) {
        var hostname = req.headers.host.split(':');
        if(hostname[0] == global.config.hostName) {
            console.log("sdbhusbvfjsvfjhvadfghva")
            if(req.body.status) {
                async.parallel({
                    sms: sendSMS.bind(null, req, data)
                }, function (err, response, body) {
                    if(err){
                        callback(err, req, data);
                    } else {
                        data.smsObj = response.sms;
                        callback(null, req, data);
                    }
                });
            } else {
                callback(null, req, data);
            }
        } else {
            callback(null, req, data);
        }


    }

    this.sendNotification = sendNotification;

    function saveNotificationInfo(req, data, callback) {
        var Model = models.get(getDb(req), 'StudentNotifications', NotificationSchema);
        var body = req.body;
        var bulk = Model.collection.initializeOrderedBulkOp();
        var ObjectId = mongoose.Types.ObjectId;
        var id = ObjectId();
        data.notificationId = id;
        async.each(body.users, function (data, cb) {
            bulk.insert({
                "notificationId" : id,
                "smsTemplateTitle": body.smsTemplateTitle,
                "smsTemplateMsg": body.smsTemplateMsg,
                "pushTemplateTitle": body.pushTemplateTitle,
                "pushTemplateMsg": body.pushTemplateMsg,
                "emailTemplateTitle": body.emailTemplateTitle,
                "emailTemplateMsg": body.emailTemplateMsg,
                "count": body.count,
                "createdBy": body.createdBy,
                "createdDate": new Date(body.createdDate),
                "updatedBy": body.updatedBy,
                "updatedDate": new Date(body.updatedDate),
                "status": body.status,
                "student": ObjectId(data._id),
                "createdId":ObjectId(body.createdId),
                "updatedId": ObjectId(body.updatedId)
            })
            cb(null, bulk);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
            bulk.execute(function (err, result) {
                if (err) {
                    callback(err, null);
                }
                callback(null, result, data);
            });
        });
    }

    this.saveNotificationInfo = saveNotificationInfo;

};

module.exports = Module;