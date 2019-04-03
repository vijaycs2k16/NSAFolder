/**
 * Created by Deepak on 01/11/18.
 */
var nsaElasticSearch = require('./search')
    , nsabb = require('./builderutil');


exports.getStudents = function(req, cb) {
    var searchParams = nsabb.getUserSearchQueryParam(req);
    nsaElasticSearch.searchUsers(searchParams, function (err, data, status) {
        cb(err, data);
    })
};
