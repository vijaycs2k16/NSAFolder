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

    var testConfigurationSchema = mongoose.Schema({
        classDetail  : {type: ObjectId, ref: 'ClassDetails'},
        subject      : [{type: ObjectId, ref: 'Subject'}],
        topic        : [{type: ObjectId, ref: 'SubjectTopics'}],
        subTopic     : [{type: ObjectId, ref: 'SubTopics'}],
        name         : {type: String, required: true},
        code         : {type: String, required: true, index:{unique:true}},
        lastModified : {type: Date},
        num          : {type: Number},
        remark       : {type: String},
        questions    : [{type: ObjectId, ref: 'Question', required: true}],
        questionMode : {type: String},  // whether it is random or manual or weightage base
        selectMode   : {type: String},
        title        : {type: ObjectId, ref: 'title'},
        examMode     : {type: Boolean, default: true},
        canReview    : {type: Boolean, default: false},
        autoCorrect  : {type: Boolean, default: false},
        isFull       : {type: Boolean, default: false},
        isGenerated  : {type: Boolean, default: false},
        isPublic     : {type: Boolean, default: false},
        timeBegin    : {type: String},
        timeEnd      : {type: String},
        ipPattern    : {type: String},
        questionMark : {type: Number, default: 0},
        negativeMark : {type: Number, default: 0},
        duration     : {type: Number, default: null},
        isSchedule   : {type: Boolean, default: false},
        weekNo       : {type: Number, default: 0},
        monthNo      : {type: Number, default: 0},
        year         : {type: Number, default: 0},
        dateBeginAhead: {type: Date}
    }, {collection: 'test_configuration'});

    mongoose.model('TestConfiguration', testConfigurationSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.TestConfigurationSchema = testConfigurationSchema;
})();
