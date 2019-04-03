/**
 * Created by senthil on 30/01/18.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var registrationSchema = new mongoose.Schema({
        name            : {type: String, required: true},
        class           : {type: String, required: true},
        school          : String,
        address1        : String,
        pincode         : String,
        mobile          : {type: String, required: true},
        email           : String,
        board_of_edu    : String,
        father_name     : String,
        occupation      : String,
        income          : String,
        exam_centre     : {type: String, required: true},
        fee_type        : {type: String, required: true},
        order_id        : Number,
        cheque_dd_no    : String,
        cheque_dd_date  : Date,
        submitted_date  : Date,
        bank_name       : String,
        fee_amount      : {type: Number, required: true},
        address2        : String,
        state           : String,
        city            : String,
        date_of_birth   : String,
        roll_num        : {type: String, required: true},
        time            : {type: String, required: true},
    }, {collection: 'Registration'});

    registrationSchema.set('toJSON', {virtuals: true});

    mongoose.model('Registration', registrationSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Registration = registrationSchema;
})();
