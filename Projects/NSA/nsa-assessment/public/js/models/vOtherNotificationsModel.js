/**
 * Created by kiranmai on 05/02/18.
 */

define([
    'Backbone',
    'vconstants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var JournalModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return CONSTANTS.URLS.VOTHERNOTIFICATIONS;
        }
    });
    return JournalModel;
});