/**
 * Created by Deepak on 1/8/2019.
 */
var mongoose = require('mongoose');

module.exports = (function () {
        var detailsSchema = {
            notification_id :  {type: String, ref: "SchoolNotifications"},
            created_date: {type: Date, default: Date.now()},
            published_by: String,
            push_template_title: String,
            push_template_message: String,
            status: {type: Boolean, default:false},
            attachments: [],
            deactivated: {type: Boolean, default:false},
            is_read: {type: Boolean, default:false}
        }

        var SchoolMediaLogSchema = mongoose.Schema({
            username: String,
            school_id: String,
            tenant_id: String,
            academic_year: String,
            details: [detailsSchema]
        }, {collection: 'school_media_log'});

    mongoose.model('SchoolMediaLog', SchoolMediaLogSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.SchoolMediaLogSchema = SchoolMediaLogSchema;
})();