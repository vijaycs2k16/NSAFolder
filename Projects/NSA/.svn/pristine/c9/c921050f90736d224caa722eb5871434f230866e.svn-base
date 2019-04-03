/**
 * Created by Sathya on 1/8/2019.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var questionMetricsSchema = mongoose.Schema({
        qid                 : {type: ObjectId, ref: "Question", default:null},
        total_skipped        : Number,
        total_correct        : Number,
        total_wrong          : Number,
        created_date       : {type: Date, default: Date.now()},
    }, {collection: '7_question_metrics'});

    mongoose.model('sQuestionMetrics', questionMetricsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.sQuestionMetrics = questionMetricsSchema;
})();