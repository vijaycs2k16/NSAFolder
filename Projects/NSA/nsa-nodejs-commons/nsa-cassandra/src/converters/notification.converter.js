/**
 * Created by senthil on 3/17/2017.
 */
var _ = require('lodash'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    notificationDomain = require('../common/domains/Notification'),
    dataService = require('../utils/date.service'),
    baseService = require('../services/common/base.service');

exports.buildNotificationObj = function(req, users, callback) {
    try {
        var body = req.body;
        var mediaName = baseService.getMedia(req);
        var notificationObj = {
            phoneNo: body.phoneNo || null,
            notifyTo: body.notifyTo || null,
            createdDate: body.createdDate || null,
            notificationId: body.notificationId || null,
            notify: body.notify || null,
            mediaName: mediaName || null,
            smsTemplate: templateConvertion(body.smsTemplate) || null,
            emailTemplate: templateConvertion(body.pushTemplate) || null,
            pushTemplate: templateConvertion(body.emailTemplate) || null,
            classes: body.classes || null,
            users: users.users || null,
            notifiedCategories: users.taxanomy || null,
            notifiedStudents: users.students || null,
            attachments: body.attachments || null,
            media_status: "Progress"
        }
        callback(null, notificationObj);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

function templateConvertion(str) {
    var st = str.templateName
    if(_.isString(st) && !_.isEmpty(st)) {
        var content = st.toString();
        content = content.replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/"/g, "'").replace(/\s+/g,' ').trim().split('\r\n').toString();
        var notiObj = {
            templateId: str.templateId,
            templateName: content,
            templateTitle: str.templateTitle,
            title: str.title
        };
        return notiObj;
    }
    return str;
}

exports.notificationObjs = function(req, data) {
    var notificationObjs = [];
    try {
        _.forEach(data, function (value, key) {
            var updateDate = dataService.getFormattedDate(value['updated_date'])
            var notificationObj = Object.assign({}, notificationDomain);
                    notificationObj.tenant_id= value['tenant_id'],
                    notificationObj.school_id= value['school_id'],
                    notificationObj.feature_id= value['feature_id'],
                    notificationObj.object_id= value['object_id'],
                    notificationObj.academic_year= value['academic_year'],
                    notificationObj.notification_id = value['notification_id'],
                    notificationObj.count= value['count'],
                    notificationObj.sender_id= value['sender_id'],
                    notificationObj.media_name= value['media_name'],
                    notificationObj.notified_list= value['notified_list'],
                    notificationObj.notified_mobile_numbers= value['notified_mobile_numbers'],
                    notificationObj.notified_categories= value['notified_categories'],
                    notificationObj.template_id = value['template_id'],
                    notificationObj.sms_raw_response = value['sms_raw_response'],
                    notificationObj.template_title= value['template_title'],
                    notificationObj.title= value['title'],
                    notificationObj.message= value['message'],
                    notificationObj.email_template_title= value['email_template_title'],
                    notificationObj.email_template_message= value['email_template_message'],
                    notificationObj.push_template_title= value['push_template_title'],
                    notificationObj.push_template_message= value['push_template_message'],
                    notificationObj.notification_type= value['notification_type'],
                    notificationObj.priority= value['priority'],
                    notificationObj.status= value['status'],
                    notificationObj.updated_date=updateDate,
                    notificationObj.updated_username= value['updated_username'],
                    notificationObj.updated_by= value['updated_by'],
                    notificationObj.updateddateAndName =value['updated_username']+' - '+updateDate;
                    notificationObj.created_by= value['created_by'],
                    notificationObj.created_date= dataService.getFormattedDate(value['created_date']),
                    notificationObj.created_by= value['created_firstname'],
                    notificationObj.notified_students= value['notified_students'],
                    notificationObj.user_types= value['user_types'],
                    notificationObj.attachments = baseService.getFormattedMap(value['attachments']);
                    notificationObj.media_status = notificationObj.media_status == "" ? 'Sent': notificationObj.media_status;
                    notificationObj.editPermissions = baseService.havePermissionsToEdit(req, constant.NOTIFICATION_PERMISSIONS, value['created_by']);
                    notificationObj.type= value['type'];
                    notificationObj.group= baseService.getFormattedMap(value['group']);
                    notificationObjs.push(notificationObj);
        });
    } catch (err) {
        return responseBuilder.buildResponse(constant.NOTIFY_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
    }
    return notificationObjs;
};


exports.voiceObjs = function(req, data) {
    var notificationObjs = [];
    try {
        _.forEach(data, function (value, key) {
            var updateDate = dataService.getFormattedDate(value['updated_date'])
            var notificationObj = Object.assign({}, notificationDomain);
            notificationObj.tenant_id= value['tenant_id'],
                notificationObj.school_id= value['school_id'],
                notificationObj.academic_year= value['academic_year'],
                notificationObj.notification_id = value['notification_id'],
                notificationObj.count= value['count'],
                notificationObj.sender_id= value['sender_id'],
                notificationObj.media_name= value['media_name'],
                notificationObj.notified_mobile_numbers= value['notified_mobile_numbers'],
                notificationObj.notified_categories= value['notified_categories'],
                notificationObj.title= value['campaign_name'],
                notificationObj.schedule_date= dataService.getFormattedDate(value['schedule_date']),
                notificationObj.notification_type= value['notification_type'],
                notificationObj.priority= value['priority'],
                notificationObj.status= value['status'],
                notificationObj.updated_date=updateDate,
                notificationObj.updated_username= value['updated_username'],
                notificationObj.updated_by= value['updated_by'],
                notificationObj.updateddateAndName =value['updated_username']+' - '+updateDate;
            notificationObj.editPermissions = baseService.havePermissionsToEdit(req, constant.NOTIFICATION_PERMISSIONS, value['created_by']);
            notificationObjs.push(notificationObj);
        });
    } catch (err) {
        return responseBuilder.buildResponse(constant.NOTIFY_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
    }
    return notificationObjs;
};

exports.buildFeatureNotificationObj = function(req, users, templateObj, callback) {
    try {
        var body = req.body;
        var mediaName = baseService.getMedia(req);
        var notificationObj = {
            phoneNo: body.phoneNo || null,
            notifyTo: body.notifyTo || null,
            createdDate: body.createdDate || null,
            notificationId: body.notificationId || null,
            notify: body.notify || null,
            mediaName: mediaName || null,
            smsTemplate: templateObj.smsTemplate || null,
            emailTemplate: templateObj.emailTemplate || null,
            pushTemplate: templateObj.pushTemplate || null,
            classes: body.classes || null,
            users: users.users || null,
            notifiedCategories: users.taxanomy || null,
            notifiedStudents: users.students || null
        };
        notificationObj.smsMsg = templateObj.smsMsg || null;
        callback(null, notificationObj)
    } catch (err) {
        logger.debug(err);
        callback(err, null)
    }
};