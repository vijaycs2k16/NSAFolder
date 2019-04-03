/**
 * Created by Sathya on 10/24/2018.
 */


module.exports= (function () {
    var mongoose =require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var scheduleSchema = mongoose.Schema({
        examid         : String,
        date           : String,
        time           : String,
        section        : String,
        school_id      : String,
    }, {collection: 'schedule'});

    mongoose.model('schedule', scheduleSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.schedule = scheduleSchema;
})();
