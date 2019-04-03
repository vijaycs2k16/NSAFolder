/**
 * Created by kiranmai on 24/01/18.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var oId = mongoose.Schema.ObjectId;
    var centerSchema = mongoose.Schema({
        centerCode                 : String,
        centerName                 : String,
        centerAddress              : String,
        centerEmail                : String,
        originalPassword           : String,
        centerPassword             : String,
        centerPhoneNo              : String,
        centerIncharge             : String,
        centerInchargeMobileno     : String,
        centerInchargeEmail        : String,
        circularViewDatetime       : Date,
        lastLoginTime              : Date,
        centerStatus               : {type: Boolean, default: true},
        isDeleteCenter             : {type: Boolean, default: false},
        defaultCenter              : {type: Boolean, default: false},
        store                      : {type: oId, ref: "warehouse", default: null}
    }, {collection: 'Center'});

    mongoose.model('Center', centerSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Center = centerSchema;
})();

