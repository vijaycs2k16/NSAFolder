/**
 * Created by manivannan on 23/01/18.
 */
define([
    'Backbone',
    'vconstants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var subTopicModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return CONSTANTS.URLS.VSUBTOPICS;
        }
    });
    return subTopicModel;
});
