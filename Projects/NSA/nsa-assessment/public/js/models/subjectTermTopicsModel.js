/**
 * Created by Sathya on 12/19/2018.
 */

define([
    'Backbone',
    'vconstants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var termTopicsModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return CONSTANTS.URLS.SUBJECTTERMTOPICS;
        }
    });
    return termTopicsModel;
});
