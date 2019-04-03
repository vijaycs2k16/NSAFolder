/**
 * Created by Sathya on 2/7/2019.
 */

module.exports = (function () {
    var mongoose = require('mongoose');

    var schoolAssignmentSchema = mongoose.Schema({
        _id                  : {type: String},
        tenant_id            : {type: String},
        school_id            : {type: String},
        academic_year        : {type: String},
        media_name           : [],
        assignment_name      : {type: String},
        assignment_type_id   : {type: String},
        assignment_type_name : {type: String},
        assignment_desc      : {type: String},
        notified_categories  : {type: String},
       /* subject_id           : {type: String},
        subject_name         : {type: String},*/
        subjects             : [],
        due_date             : {type: Date},
       /* repeat_option_id     : {type: String},
        repeat_option        : {type: String},*/
        priority             : {type: Number},
        notify_to            : {type: String},
        attachments          : [],
        updated_by           : {type: String},
        updated_date         : {type: Date},
        updated_username     : {type: String},
        created_by           : {type: String},
        created_date         : {type: Date},
        created_firstname    : {type: String},
        status               : {type: Boolean}
    }, {collection: 'school_assignment'});

    mongoose.model('schoolAssignment', schoolAssignmentSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.schoolAssignment = schoolAssignmentSchema;
})();

