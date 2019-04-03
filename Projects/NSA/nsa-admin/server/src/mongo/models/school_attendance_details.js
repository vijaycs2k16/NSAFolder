var mongoose = require('mongoose');

module.exports = (function() {
    var ObjectId = mongoose.Schema.types.ObjectId;
    var detailsSchema = {
        _id : {type : String, ref : 'SchoolAttendance'},
        is_present : {type : Boolean, default : false},
        remarks : String,
    }
    var schoolAttendanceDetailsSchema = mongoose.schema({
        user_name : String,
        is_hostel  : {type : Boolean, default : false},
        first_name : String,
        details : [detailsSchema]
    },{collection: 'school_attendance_details'});

    mongoose.model('SchoolAttendanceDetails',schoolAttendanceDetailsSchema)

    if(!mongoose.Schema){
        mongoose.Schema = {};
    }

    mongoose.Schemas.schoolAttendanceDetailsSchema = schoolAttendanceDetailsSchema;
})