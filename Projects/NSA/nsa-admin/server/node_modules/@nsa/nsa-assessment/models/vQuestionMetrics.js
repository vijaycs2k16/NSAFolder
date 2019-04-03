/**
 * Created by kiranmai on 25/01/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var QuestionMetrics = mongoose.Schema({
        qid                  : {type: ObjectId, ref: "Question", default:null},
        total_skipped        : Number,
        total_correct        : Number,
        total_wrong          : Number,
        created_date       : {type: Date, default: Date.now()},
    }, {collection: 'question_metrics'});

    mongoose.model('QuestionMetrics', QuestionMetrics);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.QuestionMetrics = QuestionMetrics;
})();

