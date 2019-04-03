module.exports = (function () {
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var TransactionsSchema = mongoose.Schema({
        student            : {type: Schema.ObjectId, ref: 'Student', default: null},
        registrationNo     : String,
        studentFeeDetails  :  {type: Schema.ObjectId, ref: 'StudentFeeDetails', default: null},
        order              :  {type: Schema.ObjectId, ref: 'Order', default: null},
        payment            :  {type: Schema.ObjectId, ref: 'Payment', default: null},
        invoice            :  {type: Schema.ObjectId, ref: 'Invoice', default: null},
        isRegisterFee      : {type: Boolean, default: false},
    }, {collection: 'Transactions'});

    mongoose.model('Transactions', TransactionsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Transactions = TransactionsSchema;
})();