/**
 * Created by kiranmai on 16/02/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var qSchema = mongoose.Schema({
        qid: {type: ObjectId, ref: 'Question'},
        userAns: ObjectId
    });
    var examSchema = mongoose.Schema({
        examId: {type: ObjectId},
        name: String,
        center: [{type: ObjectId, ref: 'Center'}],
        course: {type: ObjectId, ref: 'Course'},
        batch: [{type: ObjectId, ref: 'Batch'}],
        config: {type: ObjectId, ref: 'ExamConfig', required: true},
        paperConfig: {type: ObjectId, ref: 'Sheet', required: true},
        student: {type: ObjectId, ref: 'Student'},
        dateBeginAhead: {type: Date},
        isCorrected: {type: Boolean, default: false},
        dateCorrect: {type: Date, default: null},
        score: {type: Number, default: 0},
        point: {type: Number, default: 0},
        isSubmit: {type: Boolean, default: false},
        submitIP: {type: String, default: null},
        isRead: {type: Boolean, default: false},
        readIP: {type: String, default: null},
        dateRead: {type: Date, default: null},
        dateSubmit: {type: Date, default: null},
        dateGenerated: {type: Date, default: null},
        questions: [qSchema],
        examMode: {type: Boolean, default: true} //default true for online and false for offline
    }, {collection: 'Exam'});

    mongoose.model('Exam', examSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Exam = examSchema;


    examSchema.methods.getScore = function () {
        var exam = this;
        if(!exam.ansSubmit||exam.ansSubmit.length<1) { return 0; }
        if(!exam.ansExpect||exam.ansExpect.length<1) { return 0; }

        // reorganize submit answer and reference answer
        var submit = {};
        for(var i=0; i<exam.ansSubmit.length; i++){
            submit[exam.ansSubmit[i].qid] = exam.ansSubmit[i].ans;
        }
        var expected = {};
        for(var i=0; i<exam.ansExpect.length; i++){
            expected[exam.ansExpect[i].qid] = exam.ansExpect[i].ans;
        }

        // Traverses each exam question
        var score = 0;
        var question;
        var type;
        // for each type
        for(var t=0; t<exam.questions.length; t++){
            type = exam.questions[t].type;
            // traverse all the questions of this type
            for(var i=0; i<exam.questions[t].questions.length; i++) {
                question = exam.questions[t].questions[i];

                // Get two answers to the array
                var anse = expected[question.qid];
                var anss = submit[question.qid];
                if (!anss || !anse) { continue; }
                if (type === 'Radio') {
                    // single-question directly compare the first two elements of the two elements are equal
                    if (anss.length > 0 && anse.length > 0) {
                        if (anss[0] === anse[0]) { score += question.point; }
                    }
                } else if (type === 'Multiple choice') {
                    // traverse each submitted answer, statistics, the number of multiple-choice answers
                    var invalidAnsSubmit = 0;
                    for (var j = 0; j < anss.length; j++) {
                        if (anse.indexOf(anss[j]) < 0) { invalidAnsSubmit++; }
                    }
                    /**
                     * The number of missing correct answers = the number of correct answers - the number of correct answers submitted
                     * = The number of correct answers - (the total number of submitted answers - the number of wrong answers submitted)
                     * = The number of correct answers - the total number of submitted answers + the number of incorrect answers submitted
                     * = The number of correct answers + the number of multiple choice answers - the total number of answers submitted
                     * @type {number}
                     */
                    var validAnsMissing = anse.length + invalidAnsSubmit - anss.length;

                    //Score multiple choice formula = total score - (multiple choice answer + less choice answer) / 4
                    score += question.point * (4 - validAnsMissing - invalidAnsSubmit) / 4;
                }
            }
        }

        return score;
    };

})();