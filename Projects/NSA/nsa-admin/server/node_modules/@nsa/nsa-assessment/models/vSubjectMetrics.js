/**
 * Created by kiranmai on 25/01/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var SubjectMetricsSchema = mongoose.Schema({
        mexam                 : {type: ObjectId, ref: "ExamScheduleLog", default:null},
        student              : {type: ObjectId, ref: "Student", default:null},
        subject              : {type: ObjectId, ref: "Subject", default:null},
        total_marks          : Number,
        total_marks_scored   : Number,
        aggregate_percentage : Number,
        total_skipped        : Number,
        total_correct        : Number,
        total_wrong          : Number,
        total_ques           : Number,
        total_time           : {type:'String', default:'0'},
        created_date       : {type: Date, default: Date.now()},
    }, {collection: 'subject_metrics'});

    mongoose.model('SubjectMetrics', SubjectMetricsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.SubjectMetrics = SubjectMetricsSchema;
})();

