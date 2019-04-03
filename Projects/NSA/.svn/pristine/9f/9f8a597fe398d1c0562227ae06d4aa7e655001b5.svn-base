/**
 * Created by kiranmai on 27/01/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var studentLeaveSchema = new mongoose.Schema({
        student    : {type: ObjectId, ref: 'Student', default: null},
        course     : {type: ObjectId, ref: 'course', default: null},
        center     : {type: ObjectId, ref: 'center', default: null},
        batch      : {type: ObjectId, ref: 'batch', default: null},
        vacations  : Object,
        month      : Number,
        year       : Number,
        vacArray   : Array,
        monthTotal : Number,
        dateByMonth: Number
    }, {collection: 'StudentLeave'});

    mongoose.model('StudentLeave', studentLeaveSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.StudentLeave = studentLeaveSchema;
})();