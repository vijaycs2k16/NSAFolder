/**
 * Created by senthil on 31/01/18.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var feeCardSchema = new mongoose.Schema({
        student                 : {type: ObjectId, ref: 'Student', required: true},
        course                  : {type: ObjectId, ref: 'course', default: null},
        center                  : {type: ObjectId, ref: 'center', default: null},
        feeCardAmount           : {type: Number, default: 0},
        feeCardGstAmount        : {type: Number, default: 0},
        feeInstlNum             : Number,
        feePaymentOption        : String,
        firstInstl              : Number,
        firstInstlDetails       : String,
        secondInstl             : Number,
        secondInstlDetails      : String,
        thirdInstl              : Number,
        thirdInstlDetails       : String,
        isBooking               : {type: Boolean, default: 0},
        bookingAmount           : Number,
        bookingDate             : Date,
        bookingDetails          : String,
        actualFees              : String,
        isDiscountApplicable    : {type: Boolean, default: 0},
        discountValue           : Number,
    }, {collection: 'FeeCard'});

    feeCardSchema.set('toJSON', {virtuals: true});

    mongoose.model('FeeCard', feeCardSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.FeeCard = feeCardSchema;
})();