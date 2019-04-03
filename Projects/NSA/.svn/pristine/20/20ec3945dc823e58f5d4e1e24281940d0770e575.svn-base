/**
 * Created by Sathya on 12/28/2018.
 */

define([
    'Backbone',
    'vconstants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var configurationModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return CONSTANTS.URLS.TESTCONFIGURATION;
        }
    });
    return configurationModel;
});