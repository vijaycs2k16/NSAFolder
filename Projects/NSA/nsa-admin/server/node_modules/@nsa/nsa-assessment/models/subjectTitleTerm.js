/**
 * Created by Sathya on 11/27/2018.
 */

module.exports= (function () {
    var mongoose =require('mongoose');
    var ObjectId = mongoose.Schema.ObjectId;

    var subjectTitleTermSchema = mongoose.Schema({
        term_id             : {type: String },
        term_name           : {type: String},
        subjectTitle        : {type: ObjectId, ref: "subjectTitle"},
        academic            : {type: String}
    }, {collection: 'subjectTitleTerm'});

    mongoose.model('subjectTitleTerm', subjectTitleTermSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.subjectTitleTerm = subjectTitleTermSchema;
})();