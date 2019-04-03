/**
 * Created by kiranmai on 07/03/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var employeeFBSchema = new mongoose.Schema({
        employee        : {type: ObjectId, ref: 'Employee', default: null},
        topic           : {type: ObjectId, ref: 'Topic', default: null},
        comment         : {type: String, default: null},
        commentedBy     : {type: ObjectId, ref: 'Student', default: null},
        updated_date    : {type: Date, default: Date.now},
        rating          : Number
    }, {collection: 'EmployeeFeedback'});

    mongoose.model('EmployeeFeedback', employeeFBSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.EmployeeFeedback = employeeFBSchema;
})();