/**
 * Created by Sathya on 11/30/2018.
 */

module.exports= (function () {
    var mongoose =require('mongoose');
    var ObjectId = mongoose.Schema.ObjectId;

    var subjectTermTopicsSchema = mongoose.Schema({
        subjectTopic            : {type: ObjectId, ref: "SubjectTopics"},
        subjectTitleTerm        : {type: ObjectId, ref: "subjectTitleTerm"}
    }, {collection: 'SubjectTermTopics'});

    mongoose.model('SubjectTermTopics', subjectTermTopicsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.SubjectTermTopics = subjectTermTopicsSchema;
})();
