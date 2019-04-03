/**
 * Created by Kiranmai A on 3/25/2017.
 */

var nsaCommons = require('@nsa/nsa-commons');

exports.buildTemplateObj = function(templates, params, callback) {
    try {
        var templateObj = {};
        var newParams = {fee_name: params.fee_name, due_date: params.due_date};
        var smsTemplateMsg = nsaCommons.serviceUtils.getFormattedString(templates.sms_template_message, params);
        var smsMsg = nsaCommons.serviceUtils.getFormattedString(templates.sms_template_message, newParams);
        var emailTemplateMsg = nsaCommons.serviceUtils.getFormattedString(templates.email_template_message, params);
        var pushTemplateMsg = nsaCommons.serviceUtils.getFormattedString(templates.push_template_message, params);
        var smsTemplate = {};
        var emailTemplate = {};
        var pushTemplate = {};
        smsTemplate.title = templates.sms_template_title;
        smsTemplate.templateName = smsTemplateMsg;
        smsTemplate.templateTitle = templates.sms_template_title;
        emailTemplate.templateName = emailTemplateMsg;
        emailTemplate.templateTitle = templates.email_template_title;
        pushTemplate.templateName = pushTemplateMsg;
        pushTemplate.templateTitle = templates.push_template_title;
        templateObj.smsTemplate = smsTemplate;
        templateObj.emailTemplate = emailTemplate;
        templateObj.pushTemplate = pushTemplate;
        templateObj.smsMsg = smsMsg;
        callback(null, templateObj);
    } catch (err) {
        callback(err, null);
    }
};
