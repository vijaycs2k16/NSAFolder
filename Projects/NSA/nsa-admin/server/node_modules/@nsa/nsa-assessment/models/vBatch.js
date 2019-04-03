/**
 * Created by kiranmai on 25/01/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var batchSchema = mongoose.Schema({
        center          : {type: ObjectId, ref: "Center", default:null},
        course          : {type: ObjectId, ref: "Course"},
        batchName       : String,
        batchStatus     : {type: Boolean, default: true},
        isDeleteBatch   : {type: Boolean, default: false},
        defaultBatch    : {type: Boolean, default: false},
        startDate       : {type: Date, default: null},
        endDate         : {type: Date, default: null},
    }, {collection: 'Batch'});

    mongoose.model('Batch', batchSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Batch = batchSchema;
})();

