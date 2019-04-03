/**
 * Created by Satya on 10/1/2018.
 */

module.exports= (function () {
    var mongoose =require('mongoose');

    var ClassDetailSchema = mongoose.Schema({
        className           : String,
        class_id            : String,
        order_by             : String,
    }, {collection: 'ClassDetails'});

    mongoose.model('ClassDetails', ClassDetailSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.ClassDetails = ClassDetailSchema;
})();
