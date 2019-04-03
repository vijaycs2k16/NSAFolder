/**
 * Created by kiranmai on 05/02/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var feeDetailsSchema = new mongoose.Schema({
        student                 : {type: ObjectId, ref: 'Student', required: true},
        course                  : {type: ObjectId, ref: 'Course', required: true},
        center                  : {type: ObjectId, ref: 'Center', required: true},
        batch                   : {type: ObjectId, ref: 'Batch', required: true},
        courseAmount            : {type: Number, required: true},
        gstAmount               : Number,
        isBooking               : Boolean,
        isBookingAdjusted       : Boolean,
        isBookingSplitted       : {type: Boolean, default: false},
        isCompleted             : {type: Boolean, default: false},
        paidAmount              : {type: Number, default: 0},
        bookingAmount           : Number,
        isDiscountApplicable    : Boolean,
        discountAmount          : Number,
        discountDetails         : {type: Object},
        actualFeeAmount         : Number,
        installmentDetails      : {type: Object},
        bookingDetails          : {type: Object},//{amount:'', details:{}, date: '', billNo: '', createdBy:' ', paymentMode: '', comments: ''}
        feeTypeDetails          : {type: Object},
        totalAdjustment         : Number,
        approveStatus           : {type: Boolean, default: false},
    }, {collection: 'StudentFeeDetails'});

    mongoose.model('StudentFeeDetails', feeDetailsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.StudentFeeDetails = feeDetailsSchema;
})();