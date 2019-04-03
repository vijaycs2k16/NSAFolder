/**
 * Created by kiranmai on 23/01/18.
 */
define([
    'Backbone',
    'vconstants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var JournalModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return CONSTANTS.URLS.BATCHES;
        }
    });
    return JournalModel;
});
