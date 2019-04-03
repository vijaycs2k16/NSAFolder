/**
 * Created by kiranmai on 24/01/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var oId = mongoose.Schema.ObjectId;
    var centerCourseSchema = mongoose.Schema({
        center                      : {type: oId, ref: "Center"},
        course                      : {type: oId, ref: "Course"},
        centerCourseFees            : Number,
        centerCourseStatus          : {type: Boolean, default: true},
        isDeleteCenterCourse        : {type: Boolean, default: false},
        isDiscountApplicable        : {type: Boolean, default: false},
        actualFees                  : {type: Number, default: 0},
        discountType                : {type: String, default: null},
        discountValue               : {type: Number, default: 0}
    }, {collection: 'CenterCourse'});

    mongoose.model('CenterCourse', centerCourseSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.CenterCourse = centerCourseSchema;
})();
