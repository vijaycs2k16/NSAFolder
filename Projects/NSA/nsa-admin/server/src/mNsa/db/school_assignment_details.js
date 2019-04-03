/**
 * Created by Sathya on 2/7/2019.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    //var ObjectId = mongoose.Schema.Types.ObjectId;

    var assignDetails = {
        assign_id             : {type: String, ref: "schoolAssignment"},
        is_read               : {type: Boolean, default: false},
        submitted_date        : {type: Date},
        is_submitted          : {type: Boolean, default: false},
        deactivated           : {type: Boolean, default: false}
    };

    var schoolAssignmentDetailsSchema = mongoose.Schema({
        username              : {type: String},
        class_id              : {type: String},
        class_name            : {type: String},
        section_id            : {type: String},
        section_name          : {type: String},
        academic_year         : {type: String},
        details               : [assignDetails]
    }, {collection: 'school_assignment_details'});

    mongoose.model('schoolAssignmentDetails', schoolAssignmentDetailsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.schoolAssignmentDetails = schoolAssignmentDetailsSchema;
})();

