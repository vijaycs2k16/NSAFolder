module.exports = (function () {
    var mongoose = require('mongoose');
    var oId = mongoose.Schema.ObjectId;
    var courseSchema = mongoose.Schema({
        courseCode          : {type: String, unique : true , dropDups: true},
        courseName          : String,
        installmentDetails  : {type: Object, default: []},
        courseStatus        : {type: Boolean, default: true},
        isDeleteCourse      : {type: Boolean, default: false},
        defaultCourse       : {type: Boolean, default: false},
        orderBy             : Number,
        classDetail         : [{type: oId, ref: "ClassDetails", default: null}],
        subject             : [{type: oId, ref: "Subject", default: null}],
        product             : [{type: oId, ref: "Product", default: null}]
    }, {collection: 'Course'});

    mongoose.model('Course', courseSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Course = courseSchema;
})();
