/**
 * Created by kiranmai on 07/03/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var studentFBSchema = new mongoose.Schema({
        student         : {type: ObjectId, ref: 'Student', default: null},
        comment         : {type: String, default: null},
        commentedBy     : {type: ObjectId, ref: 'Employee', default: null},
        updated_date    : {type: Date, default: Date.now},
        rating          : Number
    }, {collection: 'StudentFeedback'});

    mongoose.model('StudentFeedback', studentFBSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.StudentFeedback = studentFBSchema;
})();