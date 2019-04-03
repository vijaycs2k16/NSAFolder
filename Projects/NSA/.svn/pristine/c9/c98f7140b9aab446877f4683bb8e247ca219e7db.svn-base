/**
 * Created by kiranmai on 05/02/18.
 */


modules.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var mediaLimitSchema = new mongoose.Schema({
        center              : {type: ObjectId, ref: "Center"},
        media               : {type: ObjectId, ref: "Media"},
        availableLimit      : Number,
        usedCount           : Number
    }, {collection: 'MediaUsageLimit'});

    mongoose.model('MediaUsageLimit', mediaLimitSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.MediaUsageLimit = mediaLimitSchema;
}) ();
