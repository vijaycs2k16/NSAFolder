/**
 * Created by senthil on 30/01/18.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var transactionResDetailsSchema = new mongoose.Schema({
        orderId            : {type: String, required: true},
        transactionId      : {type: Number, required: true},
        amount             : {type: Number, required: true},
        statusCode         : {type: String, required: true},
        RRN                : {type: String, required: true},
        authzCode          : {type: String, required: true},
        responseCode       : {type: String, required: true},
        transactionDate    : {type: Date, required: true},
        rawResponse        : {type: String, required: true},
    }, {collection: 'TransactionResDetails'});

    transactionResDetailsSchema.set('toJSON', {virtuals: true});

    mongoose.model('TransactionResDetails', transactionResDetailsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.TransactionResDetails = transactionResDetailsSchema;
})();
