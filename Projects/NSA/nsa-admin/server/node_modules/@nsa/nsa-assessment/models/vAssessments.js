/**
 * Created by kiranmai on 25/01/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var assessmentSchema = mongoose.Schema({
        assessmentName  : String,
        assessmentDate  : Date,
        assessmentTime  : String
    }, {collection: 'Assessments'});

    mongoose.model('Assessments', assessmentSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Assessments = assessmentSchema;
})();