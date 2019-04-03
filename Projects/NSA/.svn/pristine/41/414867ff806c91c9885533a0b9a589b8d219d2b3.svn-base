/**
 * Created by kiranmai on 05/02/18.
 */


modules.exports = (function () {
    var mongoose = require('mongoose');

    var mediaTypesSchema = new mongoose.Schema({
        mediaName           : Number
    }, {collection: 'MediaTypes'});

    mongoose.model('MediaTypes', mediaTypesSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.MediaTypes = mediaTypesSchema;
}) ();
