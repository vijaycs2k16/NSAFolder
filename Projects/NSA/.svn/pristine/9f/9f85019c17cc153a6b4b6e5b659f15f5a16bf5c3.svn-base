/**
 * Created by senthil on 30/01/18.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var transactionReqDetailsSchema = new mongoose.Schema({
        orderId        : {type: String, required: true},
        transAmount    : {type: Number, required: true},
        transCurrency  : {type: String, required: true},
        transReqType   : {type: String, required: true},
        cardNumber     : Number,
        cardName       : String,
        paymentType    : String,
        secretKey      : {type: String, required: true},
    }, {collection: 'TransactionReqDetails'});

    transactionReqDetailsSchema.set('toJSON', {virtuals: true});

    mongoose.model('TransactionReqDetails', transactionReqDetailsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.TransactionReqDetails = transactionReqDetailsSchema;
})();
