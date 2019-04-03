/**
 * Created by kiranmai on 25/01/18.
 */

module.exports = (function () {
    var mongoose = require("mongoose");
    var facultySchema = mongoose.Schema({
        facultyName                     : String,
        facultyEmail                    : String,
        originalPassword                : String,
        facultyPassword                 : String,
        facultyType                     : String,
        facultyQualification            : String,
        facultyExpYears                 : Number,
        facultyExpMonths                : Number,
        facultyGender                   : String,
        facultySubject                  : {type: Number, ref: "Subject"},
        facultyAddress                  : String,
        facultyHometown                 : String,
        facultyPhone                    : String,
        facultyEmpType                  : String,
        facultySalaryPerMonth           : Number,
        facultySalaryPerHour            : Number,
        facultyReadyToTravel            : Boolean,
        facultyReferredBy               : String,
        facultyReferredPersonPhone      : String,
        createdBy                       : String,
        createdOn                       : Date,
        createdIp                       : String,
        lastLoginTime                   : Date,
        circularViewDatetime            : Date,
        facultyStatus                   : {type: Boolean, default: true},
        isDeleteFaculty                 : {type: Boolean, default: false}
    },{collection: "Faculty"});

    mongoose.model('Faculty', facultySchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Faculty = facultySchema;
})();
