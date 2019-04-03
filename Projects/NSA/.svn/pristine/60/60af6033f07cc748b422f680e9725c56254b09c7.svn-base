module.exports = (function () {
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var SubjectTopicSchema = mongoose.Schema({
        subject         : {type: Schema.ObjectId, ref: 'Subject'},
        topics          : [{name: {type: String}}],
        classDetail     : {type: Schema.ObjectId, ref: 'ClassDetails'},
        title           : {type: Schema.ObjectId, ref: 'title'}
    }, {collection: 'SubjectTopics'});

    mongoose.model('SubjectTopics', SubjectTopicSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.SubjectTopics = SubjectTopicSchema;
})();