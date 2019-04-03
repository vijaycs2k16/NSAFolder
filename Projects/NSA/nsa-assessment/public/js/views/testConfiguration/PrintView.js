/**
 * Created by Sathya on 1/31/2019.
 */

define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/testConfiguration/printInvoice.html',
    'dataService',
    'populate',
    'common',
    'moment',
    'vconstants',
    'views/testConfiguration/TopBarView',
    'helpers/exportToPdf'
], function (Backbone, $, _, Parent, orgTemplate, dataService, populate, common, moment, constants, topBarView, exportToPdf) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'testConfiguration',
        actionType : 'Content',
        template   : _.template(orgTemplate),
        el         : '#content-holder',
        responseObj: {},

        initialize : function (options) {
            var self = this;
            this.startTime = options.startTime;
            this.feeTypeDetails =[];

            this.responseObj['#studentGender'] = [
                {
                    _id : 'Male',
                    name: 'Male'
                }, {
                    _id : 'Female',
                    name: 'Female'
                }
            ];

            if (options.collection && options.modelId) {
                this.studentCollection = options.collection;
                this.currentModel = this.studentCollection.get(options.modelId)
            } else {
                this.currentModel = options.model;
            }
            console.log(options)
            this.topbarView = new topBarView({
                actionType  : 'Content',
                hideNavigate: true
            });

            this.render(options);
        },

        events: {
            'click .updateBtn'    : 'updateItem',
            'click .checkbox'   : 'checked',
            'click #startDate'  : 'changeDate',
            'click .backBtn1'   : 'backEnrollments',
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

            exportToPdf.takeFile({file: printContents, name: 'config'}, function (data) {

            });

        },

        afterPrint: function (e) {
            var url = '/#erp/print/' + (this.currentModel.toJSON()).student._id;

            Backbone.history.navigate(url, {trigger: true});
        },


        render: function (options) {
            var self = this;
            var $thisEl = this.$el;
            var formString = this.template({
                model           : this.currentModel.toJSON()
            });
            this.$el.html(formString);
            return this;
        },

        backEnrollments: function () {
            var url = 'erp/' + this.contentType;

            Backbone.history.navigate(url, {trigger: true});
        },

    });

    return ContentView;
});
