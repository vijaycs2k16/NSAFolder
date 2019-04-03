/**
 * Created by kiranmai on 06/02/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var notificationsSchema = new mongoose.Schema({
        notificationId      : {type: ObjectId},
        tenantId            : {type: ObjectId},
        phoneNo             : [String],
        smsTemplateTitle    : String,
        smsTemplateMsg      : String,
        pushTemplateTitle   : String,
        pushTemplateMsg     : String,
        emailTemplateTitle  : String,
        emailTemplateMsg    : String,
        sender              : {type: ObjectId, ref: "Sender"},
        count               : Number,
        createdBy           : String,
        createdDate         : Date,
        updatedBy           : String,
        updatedDate         : String,
        status              : {type: Boolean, default: false},  //For Draft or Send
        deactivated         : {type: Boolean, default: false},  //For Delete a notification while student login
        isRead              : {type: Boolean, default: false},
        createdId           : {type: ObjectId, ref: "Users"},
        updatedId           : {type: ObjectId, ref: "Users"}
    }, {collection: 'OtherNotifications'});

    mongoose.model('OtherNotifications', notificationsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.OtherNotifications = notificationsSchema;
}) ();