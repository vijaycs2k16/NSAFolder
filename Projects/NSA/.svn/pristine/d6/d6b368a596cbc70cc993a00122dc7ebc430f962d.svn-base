define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
], function (Backbone, $, _, ParentView) {
    'use strict';

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'EnrollMent',
        responseObj: {},

        initialize: function (options) {
            this.render();
        },
        events: {
            'click a.RegistrationBtn'     : 'registration',
        },

        registration : function() {
            var url = 'erp/' + 'registrationForm';
            Backbone.history.navigate(url, {trigger: true});
            this.delegateEvents(this.events);

        },

        render: function () {
        }

    });

    return CreateView;
});
