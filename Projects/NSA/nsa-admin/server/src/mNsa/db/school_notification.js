/**
 * Created by Deepak on 1/8/2019.
 */
var mongoose = require('mongoose');

module.exports = (function () {
    var schoolNotificationSchema = mongoose.Schema({
        _id: {type: String, default: ""},
        username: String,
        school_id: String,
        tenant_id: String,
        academic_year: String,
        feature_id: String,
        sender_id: String,
        template_id: String,
        created_date: {type: Date, default: Date.now()},
        updated_date: {type: Date, default: Date.now()},
        created_by: String,
        created_firstname: String,
        media_status: String,
        message: String,
        notification_type: String,
        notified_categories : String,
        notified_students: String,
        push_template_message: String,
        push_template_title: String,
        sms_raw_response: String,
        status: String,
        template_title: String,
        title: String,
        type: String,
        updated_by: String,
        updated_username: String,
        attachments: [],
        group: [],
        media_name: String,
        notified_list: [],
        notified_numbers: [],
        user_types: [],
        count: Number,
        priority: Number,
    }, {collection: 'school_notifications'});

    mongoose.model('SchoolNotifications', schoolNotificationSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.schoolNotificationSchema = schoolNotificationSchema;
})();