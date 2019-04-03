/**
 * Created by kiranmai on 16/02/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');

    var codeTypeSchema = mongoose.Schema({
        codeType: {type: String, required: true, index: {unique: true}},
        maxNo : {type: Number, default:1}
    }, {collection: 'CodeType'});

    mongoose.model('CodeType', codeTypeSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.CodeType = codeTypeSchema;
})();