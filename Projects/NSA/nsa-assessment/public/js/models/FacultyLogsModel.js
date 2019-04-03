/**
 * Created by Manivannan on 28/08/18.
 */
define([
    'Backbone',
    'vconstants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var JournalModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return CONSTANTS.URLS.FACULTYLOGS;
        }
    });
    return JournalModel;
});
