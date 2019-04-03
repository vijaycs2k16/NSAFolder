var mongoose = require('mongoose');
//var ObjectId = mongoose.Schema.types.ObjectId;

module.exports = (function () {
    var schoolAttendanceSchema = mongoose.Schema({
        //_id:  ObjectId,   //{type: String, default: ""},
        school_id: String,
        tenant_id: String,
        academic_year: String,
        media_name: [],
        class_id : String,
        class_name : String,
        section_id : String,
        section_name : String,
        total_strength :Number,
        admission_no : String,
        no_of_present : Number,
        no_of_absent : Number,
        present_percent : Number,
        attendance_date : String,
        recorded_date: {type: Date, default: Date.now()},
        recorded_by: String,
        recorded_username : String,
        updated_by : String,
        updated_username : String,
        updated_date: {type: Date, default: Date.now()},
        created_by : String,
        created_date: {type: Date, default: Date.now()},
        created_firstname: String,
    }, {collection: 'school_attendance'});

    mongoose.model('SchoolAttendance', schoolAttendanceSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.schoolAttendanceSchema = schoolAttendanceSchema;
})();