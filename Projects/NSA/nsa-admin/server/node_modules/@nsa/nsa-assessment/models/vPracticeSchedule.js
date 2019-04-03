/**
 * Created by kiranmai on 16/02/18.
 */

/**
 * Table structure sheet {
 * name test paper name
 * num the total amount of the current statistics is the total number of topics
 * remark remark
 detail detail of test questions
 * category from which chapter
 * type question type
 * num number of questions
 *}
 * @type {Schema}
 */


module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var practiceScheduleSchema = mongoose.Schema({
        name: {type: String, required: true},
        remark: {type: String},
        canReview: {type: Boolean, default: false},
        autoCorrect: {type: Boolean, default: false},
        isFull: {type: Boolean, default: false},
        isGenerated: {type: Boolean, default: false},
        isPublic: {type: Boolean, default: false},
        timeBegin: {type: String},
        timeEnd: {type: String},
        dateGenerated: {type: Date},
        datePublic: {type: Date},
        duration: {type: Number, default: null},
        minAhead: {type: Number, default: 0},
        lastModified: {type: Date},
        ipPattern: {type: String},
        questionMark: {type: Number, default: 0},
        negativeMark: {type: Number, default: 0},
        course: {type: ObjectId, ref: 'Course'},
        subject: {type: ObjectId, ref: 'Subject'},
        topic: {type: ObjectId, ref: 'Topic'},
        remark: {type: String},
        questions: [{type: ObjectId, ref: 'Question', required: true}],
        center: [{type: ObjectId, ref: 'Center'}],
        batch: [{type: ObjectId, ref: 'Batch'}],
        dateBeginAhead: {type: Date},
        examMode: {type: Boolean, default: true},
        questionMode: {type: String}  // whether it is random or manual or weightage base
    }, {collection: 'PracticeSchedule'});

    mongoose.model('PracticeSchedule', practiceScheduleSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.PracticeSchedule = practiceScheduleSchema;
})();
