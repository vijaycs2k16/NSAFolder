define([
    'Backbone',
    'vconstants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var paperConfigModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return CONSTANTS.URLS.VPAPERCONFIGURATION;
        }
    });
    return paperConfigModel;
});

