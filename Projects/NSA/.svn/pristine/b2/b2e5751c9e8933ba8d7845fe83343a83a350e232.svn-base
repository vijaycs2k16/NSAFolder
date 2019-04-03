define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VAssessment/questionBank/printInvoice.html',
    'dataService',
    'populate',
    'common',
    'moment',
    'vconstants',
    'views/VExam/TopBarView',
    'helpers/exportToPdf'
], function (Backbone, $, _, Parent, orgTemplate, dataService, populate, common, moment, constants, topBarView, exportToPdf) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'Exam',
        actionType : 'Content',
        template   : _.template(orgTemplate),
        el         : '#content-holder',
        responseObj: {},

        initialize : function (options) {
            var self = this;
            this.render(options);
        },

        events: {
            'click .updateBtn'    : 'updateItem',
            'click .checkbox'   : 'checked',
            'click #startDate'  : 'changeDate',
            'click .backBtn'   : 'backEnrollment',
            'click ._circleRadioRadiance'   : 'checked',
            "keyup .enterAmount" : "enterAmount",
            'click #printInfo' : 'print',
            'click .cancel' : 'afterPrint'
        },


        print: function (e) {
            var printContents = document.getElementById('example-print').innerHTML;
            /*var originalContents = document.body.innerHTML;

            document.body.innerHTML = printContents;

            window.print();

            document.body.innerHTML = originalContents;
           window.location.reload();*/

            //var template = this.$el.find('#templateDiv').html();

            e.preventDefault();

           // self.hideDialog();

            exportToPdf.takeFile({file: printContents, name: 'question'}, function (data) {

            });

        },

        afterPrint: function (e) {
            var url = '/#erp/print/' + (this.currentModel.toJSON()).student._id;

            Backbone.history.navigate(url, {trigger: true});
        },


        render: function (options) {
            this.currentModel = options.collection.data;
            var self = this;
            var $thisEl = this.$el;
            $('#printPdf').addClass('hide')
            $('#top-bar-deleteBtn').addClass('hide')
            $('#dateFilter').addClass('hide')
            var formString = this.template({
                model           : this.currentModel
            });
            this.$el.html(formString);
            return this;
        },

        backEnrollment: function () {
            var url = 'erp/VQuestionBank/list';

            Backbone.history.navigate(url, {trigger: true});
        },

    });

    return ContentView;
});
