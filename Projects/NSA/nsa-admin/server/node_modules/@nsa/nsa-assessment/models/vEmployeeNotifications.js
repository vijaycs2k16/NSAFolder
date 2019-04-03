/**
 * Created by kiranmai on 06/02/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var notificationsSchema = new mongoose.Schema({
        notificationId      : {type: ObjectId},
        tenantId            : {type: ObjectId},
        center              : {type: ObjectId, ref: "Center"},
        employee            : {type: ObjectId, ref: "Employee"},
        smsTemplateTitle    : {type: String, default: null},
        smsTemplateMsg      : {type: String, default: null},
        pushTemplateTitle   : {type: String, default: null},
        pushTemplateMsg     : {type: String, default: null},
        emailTemplateTitle  : {type: String, default: null},
        emailTemplateMsg    : {type: String, default: null},
        sender              : {type: ObjectId, ref: "Sender", default: null},
        count               : {type: Number, default: null},
        createdBy           : {type: String, default: null},
        createdDate         : {type: Date, default: null},
        updatedBy           : {type: String, default: null},
        updatedDate         : {type: String, default: null},
        status              : {type: Boolean, default: false},  //For Draft or Send
        deactivated         : {type: Boolean, default: false},  //For Delete a notification while student login
        isRead              : {type: Boolean, default: false},
        createdId           : {type: ObjectId, ref: "Users"},
        updatedId           : {type: ObjectId, ref: "Users"}
    }, {collection: 'EmployeeNotifications'});

    mongoose.model('EmployeeNotifications', notificationsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.EmployeeNotifications = notificationsSchema;
}) ();