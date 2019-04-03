/**
 * Created by Sathya on 11/27/2018.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var oId = mongoose.Schema.ObjectId;
    var titleSchema = mongoose.Schema({
        title_id            : {type: String, default: null},
        titleName           : String,
    }, {collection: 'title'});

    mongoose.model('title', titleSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.title = titleSchema;
})();
