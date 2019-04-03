/**
 * Created by Sathya on 11/27/2018.
 */

module.exports= (function () {
    var mongoose =require('mongoose');
    var ObjectId = mongoose.Schema.ObjectId;

    var subjectTitleSchema = mongoose.Schema({
        school_id           : {type: String, default: null},
        tenant_id           : {type: String, default: null},
        academicYear        : {type: String, default: null},
        subject             : {type: ObjectId, ref: "Subject", default: null},
        title               : {type: ObjectId, ref: "title", default: null},
        classDetail         : {type: ObjectId, ref: "ClassDetails", default: null},
        class_id            : {type: String, default: null},
        class_name          : {type: String, default: null},
        subject_id          : {type: String, default: null},
        subject_name        : {type: String, default: null},
    }, {collection: 'subjectTitle'});

    mongoose.model('subjectTitle', subjectTitleSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.subjectTitle = subjectTitleSchema;
})();
