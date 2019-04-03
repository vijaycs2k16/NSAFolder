/**
 * Created by kiranmai on 25/01/18.
 */

module.exports = (function () {
    var mongoose = require("mongoose");
    var classSchema = mongoose.Schema({
        classDate               : Date,
        className               : String,
        startTime               : String,
        endTime                 : String,
        center                  : {type: Number, ref: "Center"},
        course                  : {type: Number, ref: "Course"},
        batch                   : {type: Number, ref: "Batch"},
        faculty                 : {type: Number, ref: "Faculty"},
        topic                   : {type: Number, ref: "Topic"},
        classStatus             : {type: Boolean, default: true},
        isDeleteClass           : {type: Boolean, default: false}
    },{collection: "Class"});

    mongoose.model('Class', classSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Class = classSchema;
})();
