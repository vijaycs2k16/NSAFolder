/**
 * Created by Sathya on 11/28/2018.
 */

module.exports= (function () {
    var mongoose =require('mongoose');
    var ObjectId = mongoose.Schema.ObjectId;

    var schoolSubjectTitleSchema = mongoose.Schema({
        school_id           : String,
        school_name         : String,
        tenant_id           : String,
        academic_year       : String,
        subjectTerm         : {type: ObjectId, ref: "subjectTitleTerm"}
    }, {collection: 'schoolSubjectTitle'});

    mongoose.model('schoolSubjectTitle', schoolSubjectTitleSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.schoolSubjectTitle = schoolSubjectTitleSchema;
})();