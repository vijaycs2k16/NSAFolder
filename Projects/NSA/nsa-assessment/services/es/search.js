/**
 * Created by Deepak on 01/11/18.
 */

'use strict';

var client = require('./es.config');

var search = function f(options) {
    var self = this;
};

search.searchUsers = function(searchParams, callback) {
    client.getMaster.search(searchParams, function (error, response, status) {
        callback(error, response, status);
    });
};

module.exports = search;
