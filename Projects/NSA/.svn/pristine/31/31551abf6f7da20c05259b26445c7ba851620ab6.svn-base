/**
 * Created by senthil on 31/01/18.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var feeTypesSchema = new mongoose.Schema({
        transAmount           : String,
        feeTypeDesc           : String,
        feeTypeName           : String,
        feeTypeStatus         : Boolean,
        feeTypeIsInst         : Boolean,
        feeTypeIsGST          : Boolean,
        feeTypeGstPercentage  : Number,
        feeTypePert           : Number,
    }, {collection: 'FeeTypes'});

    feeTypesSchema.set('toJSON', {virtuals: true});

    mongoose.model('FeeTypes', feeTypesSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.FeeTypes = feeTypesSchema;
})();
