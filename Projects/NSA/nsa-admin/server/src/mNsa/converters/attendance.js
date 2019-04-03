/**
 * Created by Sai Deepak on 09/02/19.
 */
var _ = require('lodash')

exports.schoolAttendanceObjs = function(data) {
    try {
        console.log('data.....',JSON.parse(JSON.stringify(data)))
        var dt = JSON.parse(JSON.stringify(data));
        var finalObjs = []
        var attObj = {}
        if (data != null && !_.isEmpty(data)) {
            var detailObjs = _.filter(JSON.parse(JSON.stringify(data)).details, function (o) { return o.deactivated != true && o.attendance_id !=null});
            detailObjs.forEach(function (obj) {
                var dataObj = obj.attendance_id
                //console.log('dataObj......',dataObj)
                attObj.userName = data.user_name;
                attObj.firstName = dt.firstName;
                attObj.isHostel = dt.isHostel;
                attObj.isPresent = dt.details[0].is_present;
                attObj.admissionNo = dt.details[0].admission_no;
                attObj.classId = dataObj.class_id;
                attObj.className = dataObj.class_name;
                attObj.sectionId = dataObj.section_id;
                attObj.sectionName = dataObj.section_name;
                attObj.attendanceId = dataObj._id;
                attObj.attendanceDate = dataObj.attendance_date;
                attObj.mediaName = dataObj.media_name;
                attObj.academicYear = dataObj.academic_year;
                attObj.updatedBy = dataObj.updated_by;
                attObj.updatedDate = dataObj.updated_date;
                attObj.updatedUserName = dataObj.recorded_username;
                attObj.recordedBy = dataObj.recorded_by;
                attObj.recordedDate = dataObj.recorded_date;
                attObj.recordedUsername = dataObj.recorded_username;
                finalObjs.push(attObj);
            });
            console.log('finalObjs......',finalObjs)
            //finalObjs = detailObjs;
        }  else {
            finalObjs = []
        }
    }
    catch (err) {
        console.log('****************', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    console.log("finalObjs",finalObjs)
    return finalObjs;
};


exports.schoolAttendanceHistoryObjs = function(data) {
    try {
        var dt = JSON.parse(JSON.stringify(data));
        var finalObjs = []
        var attObj = {}
        if (data != null && !_.isEmpty(data)) {
            var detailObjs = _.filter(JSON.parse(JSON.stringify(data)).details, function (o) { return o.deactivated != true && o.attendance_id !=null});
            console.log('detailObjs......',data.details)
            detailObjs.forEach(function (obj) {
                var dataObj = obj.attendance_id
                attObj.userName = data.user_name;
                attObj.firstName = dt.firstName;
                attObj.isHostel = dt.isHostel;
                attObj.isPresent = dt.details[0].is_present;
                attObj.admissionNo = dt.details[0].admission_no;
                attObj.classId = dataObj.class_id;
                attObj.className = dataObj.class_name;
                attObj.sectionId = dataObj.section_id;
                attObj.sectionName = dataObj.section_name;
                attObj.attendanceId = dataObj._id;
                attObj.attendanceDate = dataObj.attendance_date;
                attObj.mediaName = dataObj.media_name;
                attObj.presentPercent = dataObj.present_percent;
                attObj.noOfAbsent = dataObj.no_of_absent;
                attObj.noOfPresent = dataObj.no_of_present;
                attObj.academicYear = dataObj.academic_year;
                attObj.updatedBy = dataObj.updated_by;
                attObj.updatedDate = dataObj.updated_date;
                attObj.updatedUserName = dataObj.recorded_username;
                attObj.recordedBy = dataObj.recorded_by;
                attObj.recordedDate = dataObj.recorded_date;
                attObj.recordedUsername = dataObj.recorded_username;
                finalObjs.push(attObj);
            });
            console.log('finalObjs......',finalObjs)
            //finalObjs = detailObjs;
        }  else {
            finalObjs = []
        }
    }
    catch (err) {
        console.log('****************', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    console.log("finalObjs",finalObjs)
    return finalObjs;
};


