/**
 * Created by senthil on 31/01/18.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var feesSchema = new mongoose.Schema({
        studentId           : {type: Number, required: true},
        studentRegNo        : {type: String, required: true},
        paymentMode         : {type: String, required: true},
        billAmount          : {type: Number, required: true},
        billNumber          : {type: String, required: true},
        billDate            : {type: Date, required: true},
        comments            : {type: String, required: true},
        createdBy           : {type: Number, required: true},
        createdIp           : {type: String, required: true},
        createdOn           : {type: Date,  default: Date.now},
    }, {collection: 'Fees'});

    feesSchema.set('toJSON', {virtuals: true});

    mongoose.model('Fees', feesSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Fees = feesSchema;
})();