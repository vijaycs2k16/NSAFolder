/**
 * Created by Manivannan on 25/10/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var examSchema = mongoose.Schema({
        tenant_Id     : {type: String, default: null},
        school_Id     : {type: String, default: null},
        section_Id    : {type: String, default: null},
        sectionName   : String,
        class_Id      : {type: String, default: null},
        className     : String,
        name          : String,
        section       : {type: ObjectId, ref: 'section'},
        config        : {type: ObjectId, ref: 'ExamConfig', required: true},
        paperConfig   : {type: ObjectId, ref: 'Sheet', required: true},
        dateBeginAhead: {type: Date},
        dateEnd       : {type: Date},
        classDetail   : {type: ObjectId, ref: 'classDetails'},
        description   : String,
        scheduleId      : {type: ObjectId, ref: 'ExamSchedule'},

        examMode      : {type: Boolean, default: true} //default true for online and false for offline
    }, {collection: 'ExamScheduleLog'});

    mongoose.model('ExamScheduleLog', examSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.ExamScheduleLog = examSchema;



})();