module.exports = (function () {
    var mongoose = require('mongoose');

    var SubjectSchema = mongoose.Schema({
        subjectName       : String,
        subject_id        : String,
        subjectCode       : String,
        subjectColor      : {type: String, default: '#4CAF50df'},
        subjectStatus     : {type: Boolean, default: true},
        isDeleteSubject   : {type: Boolean, default: false}
    }, {collection: 'Subject'});

    mongoose.model('Subject', SubjectSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Subject = SubjectSchema;
})();