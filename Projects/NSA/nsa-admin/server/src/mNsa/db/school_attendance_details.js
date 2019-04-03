var mongoose = require('mongoose');

module.exports = (function() {
    //var ObjectId = mongoose.Schema.types.ObjectId;

    var detailsSchema = {
        attendance_id : {type : String, ref :'SchoolAttendance'},
        is_present : {type : Boolean, default : false},
        admission_no : String,
        remarks : String
    };

    var schoolAttendanceDetailsSchema = mongoose.Schema({
        user_name : String,
        is_hostel  : {type : Boolean, default : false},
        first_name : String,
        details : [detailsSchema]
    },{collection: 'school_attendance_details'});

mongoose.model('SchoolAttendanceDetails',schoolAttendanceDetailsSchema)

    if(!mongoose.Schema){
        mongoose.Schema = {};
    }

    mongoose.Schemas.SchoolAttendanceDetails = schoolAttendanceDetailsSchema;
})();