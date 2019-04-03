define([
    'Backbone',
    'Validation',
    'moment',
    'constants'
], function (Backbone, Validation, moment, CONSTANTS) {
    'use strict';

    var LeadModel = Backbone.Model.extend({
        idAttribute: '_id',
        initialize : function () {
            this.on('invalid', function (model, errors) {
                var msg;

                if (errors.length > 0) {
                    msg = errors.join('\n');

                    App.render({
                        type   : 'error',
                        message: msg
                    });
                }
            });
        },


        urlRoot: function () {
            return CONSTANTS.URLS.OPPORTUNITIES;
        }
    });

    return LeadModel;
});
