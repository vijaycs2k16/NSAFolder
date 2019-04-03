/**
 * Created by Sai Deepak on 09/02/19.
 */
var _ = require('lodash')

exports.schoolAssignmentObjs = function(data) {
    try {
        var finalObjs = []
        if (data != null && !_.isEmpty(data)) {
            var detailObjs = _.filter(JSON.parse(JSON.stringify(data)).details, function (o) { return o.deactivated != true && o.assign_id !=null});
            detailObjs.forEach(function (obj) {
                obj.username = data.username;
                obj.first_name = data.first_name;
                obj.class_id = data.class_id;
                obj.class_name = data.class_name;
                obj.section_id = data.section_id;
                obj.section_name = data.section_name;
                _.merge(obj, obj.assign_id);
                obj.assignment_detail_id = obj.username;
                obj.assignment_id = obj._id;
                delete obj.assign_id;
            });
            finalObjs = detailObjs;
        }  else {
            finalObjs = []
        }
    }
    catch (err) {
        console.log('****************', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return finalObjs;
};


