define([
    'Backbone',
    'vconstants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var SchoolOnboardModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return CONSTANTS.URLS.SCHOOLONBOARD;
        }
    });
    return SchoolOnboardModel;
});
