/**
 * Created by Satya on 10/24/2018.
 */


module.exports= (function () {
    var mongoose =require('mongoose');

    var sectionSchema = mongoose.Schema({
        sectionName       : String,
        section_id        : String,
    }, {collection: 'section'});

    mongoose.model('section', sectionSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.section = sectionSchema;
})();
