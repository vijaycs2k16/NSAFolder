/**
 * Created by kiranmai on 25/01/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var batchScheduleSchema = mongoose.Schema({
        center           : {type: ObjectId, ref: "Center"},
        course           : {type: ObjectId, ref: "Course"},
        batch           : {type: ObjectId, ref: "Batch"},
        subject         : {type: ObjectId, ref: "Subject"},
        faculty         : {type: ObjectId, ref: "Employees"},
        classDetail       : {type: ObjectId, ref: 'ClassDetails'},
        topics         : {type: ObjectId, ref: "Topic"},
        topicDetails : [{
            name: String
        }],
        subtopics: [{
           name: String
        }],
        feedback: String,
        classhrs        : String,
        type            : String,
        assessmenthrs   : Number,
        classDate       : {type: Date, default: Date.now},
        classStartTime  : String,
        classEndTime    : String
    }, {collection: 'BatchSchedule'});

    mongoose.model('BatchSchedule', batchScheduleSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.BatchSchedule = batchScheduleSchema;
})();