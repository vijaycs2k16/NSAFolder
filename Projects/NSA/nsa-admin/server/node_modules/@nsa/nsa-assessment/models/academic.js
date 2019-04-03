module.exports= (function () {
    var mongoose =require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var academicSchema = mongoose.Schema({
        year           : {type: String, default: ''},
    }, {collection: 'academic'});

    mongoose.model('academic', academicSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.academic = academicSchema;
})();
