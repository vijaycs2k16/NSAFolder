define([
    'Backbone',
    'vconstants'
], function (Backbone, CONSTANTS) {
    'use strict';

    var studentDetailsModel = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return CONSTANTS.URLS.VSTUDENTDETAILS;
        },

        parse: function (model) {
            return model;
        }
    });

    return studentDetailsModel;
});
