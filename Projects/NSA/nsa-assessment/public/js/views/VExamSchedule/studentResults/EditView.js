define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VExamSchedule/studentResults/EditTemplate.html',
    'dataService',
    'populate',
    'common',
    'moment',
    'vconstants',
    'views/VExamSchedule/studentResults/TopBarView',
    'views/listViewBase',
], function (Backbone, $, _, Parent, orgTemplate, dataService, populate, common, moment, constants, topBarView, listViewBase) {
    'use strict';

    var ContentView = listViewBase.extend({
        contentType: 'VExamStudentsResult',
        actionType : 'Content',
        template   : _.template(orgTemplate),
        el         : '#content-holder',
        responseObj: {},

        initialize : function (options) {
            var self = this;

            this.topBarView = new topBarView({
                actionType  : 'Content',
                hideNavigate: true
            });

                if (options.collection && options.modelId) {
                    this.currentModel = options.collection;
                    if(this.currentModel){
                        this.render();
                    }
                }

            listViewBase.prototype.initialize.call(this, options);

        },

        events: {
            'click .backBtn'       : 'backEnrollment',
        },

        render: function () {
            if(this.currentModel){
                var formString = this.template({
                    model           : this.currentModel.toJSON(),
                });
            }

            this.$el.html(formString);
            setTimeout(function () {
                common.datatableInitWithColFilter('example')
            }, 100)

            return this;
        },

        backEnrollment: function () {
            var url = 'erp/' + 'VExamSchedule';
            Backbone.history.navigate(url, {trigger: true});
        },

    });

    return ContentView;
});
