/**
 * Created by Sathya on 1/8/2019.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var subjectMetricsSchema = mongoose.Schema({
        mexam                : {type: ObjectId, ref: "TestConfiguration", default:null},
        student              : {type: ObjectId, ref: "Student", default:null},
        userName             : String,
        subject              : {type: ObjectId, ref: "Subject", default:null},
        total_marks          : Number,
        total_marks_scored   : Number,
        aggregate_percentage : Number,
        total_skipped        : Number,
        total_correct        : Number,
        total_wrong          : Number,
        total_ques           : Number,
        total_time           : {type:'String', default:'0'},
        created_date         : {type: Date, default: Date.now()},
    }, {collection: '7_subject_metrics'});

    mongoose.model('sSubjectMetrics', subjectMetricsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.sSubjectMetrics = subjectMetricsSchema;
})();
