
define([
    'Backbone',
    'vconstants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var JournalModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return CONSTANTS.URLS.VENROLLMENT;
        }
    });
    return JournalModel;
});
