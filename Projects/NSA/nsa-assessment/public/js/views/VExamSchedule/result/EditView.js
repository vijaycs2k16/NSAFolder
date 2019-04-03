define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VExamSchedule/result/EditTemplate.html',
    'dataService',
    'populate',
    'common',
    'moment',
    'vconstants',
    'views/VExamSchedule/TopBarView'
], function (Backbone, $, _, Parent, orgTemplate, dataService, populate, common, moment, constants, topBarView) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'VExamSchedule',
        actionType : 'Content',
        template   : _.template(orgTemplate),
        el         : '#content-holder',
        responseObj: {},

        initialize : function (options) {
            var self = this;
            this.modelId = options.modelId;
            this.topbarView = new topBarView({
                actionType  : 'Content',
                hideNavigate: true
            });

            dataService.getData(constants.URLS.VEXAMSRESULT + this.modelId, {}, function (data) {
                self.currentModel = data.data;
                self.render(options);
            });



        },

        events: {
            'click .closeBtn' : 'backEnrollment'
        },

        render: function (options) {
            var self = this;
            var $thisEl = this.$el;
            $('#dateFilter').addClass('hide')
            var formString = this.template({
                model           : this.currentModel.length > 0 ? this.currentModel[0] : {},
                questions       :  this.currentModel.length > 0 ? this.currentModel[0].examId.paperConfig.questions : {}
            });

            this.$el.html(formString);

            return this;
        },

        backEnrollment: function () {
            var url = 'erp/' + this.contentType;

            Backbone.history.navigate(url, {trigger: true});
        },

    });

    return ContentView;
});
