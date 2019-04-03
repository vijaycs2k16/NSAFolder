/**
 * Created by senthil on 31/01/18.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var feeCardDetailsSchema = new mongoose.Schema({
        feeType       : {type: ObjectId, ref: 'FeeTypes', required: true},
        feeTypeAmount : {type: Number, default: 0},
        feeTypeGstAmt : {type: Number, default: 0},
    }, {collection: 'FeeCardDetails'});

    feeCardDetailsSchema.set('toJSON', {virtuals: true});

    mongoose.model('FeeCardDetails', feeCardDetailsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Fees = feeCardDetailsSchema;
})();