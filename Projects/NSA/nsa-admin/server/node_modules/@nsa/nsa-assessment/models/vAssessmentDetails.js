/**
 * Created by kiranmai on 25/01/18.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var assessmentDetailsSchema = mongoose.Schema({
        assessment      : {type: Number, ref: "Assessments"},
        studentRegNo    : String,
        subject         : {type: Number, ref: "Subject"},
        topic           : {type: Number, ref: "Topic"},
        total_marks     : Number
    }, {collection: 'AssessmentDetails'});

    mongoose.model('AssessmentDetails', assessmentDetailsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.AssessmentDetails = assessmentDetailsSchema;
})();