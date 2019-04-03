/**
 * Created by kiranmai on 05/02/18.
 */

modules.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var notificationDetailsSchema = new mongoose.Schema({
        notification        : {type: ObjectId, ref: "Notifications"},
        student             : {type: ObjectId, ref: "Student"},
        count               : Number,
        deactivated         : {type: Boolean, default: false},
        isRead              : {type: Boolean, default: false}
    }, {collection: 'NotificationDetails'});

    mongoose.model('NotificationDetails', notificationDetailsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.NotificationDetails = notificationDetailsSchema;
}) ();