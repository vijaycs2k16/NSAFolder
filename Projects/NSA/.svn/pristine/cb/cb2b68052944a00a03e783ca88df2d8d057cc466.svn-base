/**
 * Created by icomputers on 23/01/18.
 */
define([
    'Backbone',
    'vconstants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var TransModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return CONSTANTS.URLS.VTRANSACTIONS;
        }
    });
    return TransModel;
});
