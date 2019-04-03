define([
    'Backbone',
    'Validation',
    'vconstants'
], function (Backbone, Validation, CONSTANTS) {
    'use strict';
    var UserModel = Backbone.Model.extend({
        idAttribute: '_id',
        defaults   : {
            studentImageName: '',
            createDate: new Date(),
        },
        urlRoot    : function () {
            return CONSTANTS.URLS.VSTUDENT;
        }
    });
    return UserModel;
});
