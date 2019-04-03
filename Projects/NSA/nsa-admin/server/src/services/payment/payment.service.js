/**
 * Created by senthil-p on 29/05/17.
 */
var nsaCassandra = require('@nsa/nsa-cassandra')
    , _ = require('lodash')
    , randomstring = require("randomstring")
    , async = require('async')
    , events = require('@nsa/nsa-commons').events
    , es = require('../../services/search/elasticsearch/elasticsearch.service')
    , constant = require('@nsa/nsa-commons').constants
    , notificationService = require('../sms/notifications/notification.service')
    , logger = require('../../../config/logger');


//function payFeeByCash(req, res) {
//    console.log('payFeeByCash........',req.body)
//    async.waterfall(
//        [
//            nsaCassandra.FeeTransactionObjConverter.feePayByCashTransactionObj.bind(null, req),
//            nsaCassandra.FeeTransaction.saveCashFeeTransactionDetails.bind(),
//            updateFeeDetailsStatus.bind()
//        ],
//        function (err, result) {
//            if(err) {
//                logger.debug(err);
//                events.emit('ErrorJsonResponse', req, res, err);
//            } else {
//                events.emit('JsonResponse', req, res, {message: 'Successfully Updated'});
//            }
//        }
//    );
//};
//exports.payFeeByCash = payFeeByCash;



function payFeeByCash(req, res) {
    async.waterfall(
        [
            nsaCassandra.FeeTransactionObjConverter.feePayByCashTransactionObj.bind(null, req),
            nsaCassandra.FeeTransaction.saveCashFeeTransactionDetails.bind(),
            updateFeeDetailsStatus.bind()
        ],
        function (err, result) {
            var notify ={sms: req.body.notify,push: false}
            var notifyTo = {status: 'Sent'}
            req.body.notify = notify;
            req.body.notifyTo = notifyTo;
            sendNotification(req,  function (err1, data) {
                if (err1) {
                    logger.debug(err1);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa440));
                } else {
                    events.emit('JsonResponse', req, res, {message: 'Successfully Updated'});
                }
            })
        }
    );
};
exports.payFeeByCash = payFeeByCash;

function sendNotification(req, callback) {
    async.waterfall([
            buildUsers.bind(null, req),
            getTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            sendPaymentNotification.bind(),
        ],
        function (err, data) {
            callback(err, data)
        }
    )
};
exports.sendNotification = sendNotification;

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

function getTemplateObj(req, data, callback) {
        var body = req.body;
        var amount = body.collectedAmount;
        var feeName = body.feeAssignmentName;
        var date = dateService.getFormattedDate(new Date());
        var templateObj = {};
        var smsTemplate = {};
        var emailTemplate = {};
        var pushTemplate = {};
        var title = "Payment"
        smsTemplate.title = title;
        smsTemplate.templateName = "Dear Parent, payment of Rs." + amount + " towards " + feeName + " has been received on " + date + ". Thank you.";
        smsTemplate.templateTitle = title;
        emailTemplate.templateName = "Dear Parent, payment of Rs." + amount + " towards " + feeName + " has been received on " + date + ". Thank you.";
        emailTemplate.templateTitle = title;
        pushTemplate.templateName = "Dear Parent, payment of Rs." + amount + " towards " + feeName + " has been received on " + date + ". Thank you.";
        pushTemplate.templateTitle = title;
        templateObj.notify = body.userName;
        templateObj.userName = body.userName;
        templateObj.smsTemplate = smsTemplate;
        templateObj.emailTemplate = emailTemplate;
        templateObj.pushTemplate = pushTemplate;
        callback(null, req ,data, templateObj);
};


function buildUsers(req, callback) {
    var data = [];
    var body = req.body;
    body.empUserName = body.userName;
    es.getUserObj(req, body, function(err, result){
        if (err) {
            callback(err, req, null);
        } else {
            data['users'] = result
            callback(err, req, data);
        }
    });
};
exports.buildUsers = buildUsers;


function sendPaymentNotification(req, notificationObj, callback) {
    sendNotificationData(req, notificationObj, function (err, req, data) {
        callback(err, data);
    });

};
exports.sendPaymentNotification = sendPaymentNotification;


function sendNotificationData(req, notificationObj, callback) {
    async.waterfall([
            notificationService.sendAllNotification.bind(null, req, notificationObj),
            notificationService.saveNotificationInfo.bind()
        ],
        function (err, req, data) {
            callback(err, req, data)
        }
    )
};
exports.sendNotificationData = sendNotificationData;

function updateFeeDetailsStatus(req, data, callback) {
    nsaCassandra.Base.feebase.updateFeeDetailStatus(req, data, function(err, result) {
        //console.log('data.........',data)
        callback(err, data);
    })
};
exports.updateFeeDetailsStatus = updateFeeDetailsStatus;