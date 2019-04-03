/**
 * Created by kiranmai on 25/01/18.
 */

module.exports = (function () {
    var mongoose = require("mongoose");
    var assignBatchSchema = mongoose.Schema({
        faculty      : {type: Number, ref: "Faculty"},
        batch        : {type: Number, ref: "Batch"}
    },{collection: "AssignBatch"});

    mongoose.model('AssignBatch', assignBatchSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.AssignBatch = assignBatchSchema;
})();
