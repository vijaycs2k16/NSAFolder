define([
        'Backbone',
        'models/VStudentDetailsModel',
        'vconstants'
    ],
    function (Backbone, studentModel, CONSTANTS) {
        'use strict';

        var studentCollection = Backbone.Collection.extend({
            model: studentModel,
            url  : CONSTANTS.URLS.VSTUDENTDETAILS,

            initialize: function (options) {

                this.fetch({
                    data   : options,
                    reset  : true,
                    success: function () {
                    },
                    error  : function (models, xhr) {
                        if (xhr.status === 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
                    }
                });
            },

            parse     : function (response) {
                return response.data;
            }
        });
        return studentCollection;
    });