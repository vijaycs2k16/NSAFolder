/**
 * Created by kiranmai on 16/02/18.
 */

/*
 *
 * Table structure examconfigs {
 name name of the exam
 * sheet test ID
 * canReview whether to rewind, see the reference answer
 * autoCorrect whether the automatic judgments, if not automatically judge, manual or batch judgments
 * isFull whether it is a test, every test pattern will have a problem
 * isGenerated whether a test paper has been generated, the test definition, you also need a
 * longer test paper generation process, and any number of test papers and
 * Changes in the papers lead to the need to re-generate the paper, here is only used to mark
 * whether the paper has been generated
 dateGenerated The time stamp of the test paper
 * isPublic decides whether a student is visible, open or not
 * dateBegin exam officially announced the test start time
 * minAhead allows you to get the time of the test paper in advance, the start time of
 * the test announcement - the number of minutes in advance is the time for the
 * candidate to obtain the test paper, and also the decision of "not started"
 * It is also the condition of "examination" status. The lead time is allowed in the [0,20] range.
 * dateBeginAhead above the sum of the two variables, that is, really began to enter the exam time
 * DateEnd exam officially announced the end of the examination is to determine whether the
 * examination can submit the answer conditions.
 *
 * Students need to take the exam depends on the following three conditions:

 * isPublic, isGenerated, the status of the test is in the exam (ie, the time of the
 * requested test is between [dateBegin-minAhead, dateEnd])
 *
 * pattern reference student's student ID matching string
 * remark remark
 * numTemplate template sets
 *}
 * @type {Schema}
 * */

module.exports = (function () {
    var mongoose = require('mongoose');
    var examConfigSchema = mongoose.Schema({
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
        code: {type: String, required: true, index:{unique:true}},
        lastModified: {type: Date},
        ipPattern: {type: String},
        questionMark: {type: Number, default: 0},
        negativeMark: {type: Number, default: 0}
    }, {collection: 'ExamConfig'});

    mongoose.model('ExamConfig', examConfigSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.ExamConfig = examConfigSchema;
})();