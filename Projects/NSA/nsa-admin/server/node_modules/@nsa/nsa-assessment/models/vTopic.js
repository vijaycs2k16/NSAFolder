module.exports = (function () {
    var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    var TopicSchema = mongoose.Schema({
        course            : {type: Schema.ObjectId, ref: 'Course'},
        subject           : {type: Schema.ObjectId, ref: 'Subject'},
        classDetail       : {type: Schema.ObjectId, ref: 'ClassDetails'},
        topics            : [{
                                name: {type: String},
                                subtopics: [{name: {type: String}}]
                            }],
        topicDetails      : [{
            topics           : {type: Schema.ObjectId, ref: 'SubjectTopics'},
            subtopics        : [{name: {type: String}}], /*{name: {type: Schema.ObjectId, ref:'SubjectTopics'}}*/
        }]
    }, {collection: 'Topic'});

    mongoose.model('Topic', TopicSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Topic = TopicSchema;
})();