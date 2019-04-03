module.exports = (function () {
    var mongoose = require('mongoose');

    var ObjectId = mongoose.Schema.ObjectId;
    var StudentDetailsSchema = mongoose.Schema({
        street1             : {type: String, default:null},
        street2             : {type: String, default:null},
        city                : {type: String, default:null},
        state               : {type: String, default:null},
        pincode             : {type: Number, default:null},
        fatherName           : {type: String, default:null},
        motherName          : {type: String, default:null},
        category            : {type: String, default:null},
        class               : {type: String, default:null},
        occupation          : {type: String, default:null},
        annualIncome        : {type: Number, default:null},
        dateOfJoining       : {type: Date, default:null},
        dateOfBirth         : {type: Date, default:null},
        courseStudied       : {type: String, default:null},
        boardOfEdu          : {type: String, default:null},
        schoolName          : {type: String, default:null},
        marksSecured        : {type: Number, default:null},
        plustwoPassedYear   : {type: String, default:null}
    }, {collection: 'StudentDetails'});

    mongoose.model('StudentDetails', StudentDetailsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.StudentDetails = StudentDetailsSchema;
})();