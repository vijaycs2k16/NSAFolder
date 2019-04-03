/**
 * Created by kiranmai on 25/01/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var batchScheduleSchema = mongoose.Schema({
        batch                   : {type: Number, ref: "Batch"},
        subject                 : {type: Number, ref: "Subject"},
        faculty                 : {type: Number, ref: "Faculty"},
        topic                   : {type: Number, ref: "Topic"},
        assessmentDate          : Date,
        assessmentStartTime     : String,
        assessmentEndTime       : String
    }, {collection: 'BatchAssessmentSchedule'});

    mongoose.model('BatchAssessmentSchedule', batchScheduleSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.BatchAssessmentSchedule = batchScheduleSchema;
})();
