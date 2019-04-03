define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VBatchesManagement/batchDetails/batches/EditTemplate.html',
    'views/selectView/selectView',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'moment',
    'dataService',
], function (Backbone, $, _, Parent, EditTemplate, SelectView, populate, constants,keyValidator, helpers, moment, dataService) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(EditTemplate),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.collection = options.collection;

            this.responseObj = {};

            this.render(options);
        },

        events: {
            'keypress #price'         : 'keypressHandler',
            'change #startDate'       : 'calculateEndDate',
            'click .newSelectList li:not(.miniStylePagination)': 'resetDates',
        },

        resetDates: function (e) {
            var thisEl = this.$el;
            moment($.trim(thisEl.find('#startDate').val('')))
            moment($.trim(thisEl.find('#endDate').text('')))
        },

        calculateEndDate: function (e) {
            var thisEl = this.$el;
            var course = this.$el.find('#course').attr('data-id');
            dataService.getData('/vcourse/details/',  {course: course}, function (course) {
                var data = course.data
                if(data) {
                    var duration = 0
                    var installmentDetails = data.installmentDetails
                    for (var key in installmentDetails) {
                        var installment = installmentDetails[key]
                        duration += parseInt(installment.duration) || 0
                    }
                    var date = moment($.trim(thisEl.find('#startDate').val()))
                    var endDate = moment(date).add(duration, 'month')
                    moment($.trim(thisEl.find('#endDate').text(moment(endDate).add(-1, 'days').format("D MMM, YYYY"))))
                }
            });
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var name = $.trim($thisEl.find('#name').val());
            var center = this.$el.find('#center').attr('data-id');
            var course = this.$el.find('#course').attr('data-id');
            var status = this.$el.find('#yes').prop('checked') || false;

            var startDate = moment($.trim(this.$el.find('#startDate').val())).format("D MMM, YYYY")
            var endDate = moment($.trim(this.$el.find('#endDate').text())).format("D MMM, YYYY")

            if (startDate ==="Invalid date" ) {
                return App.render({
                    type   : 'error',
                    message: 'StartDate cannot be empty'
                });
            }

            var data = {
                batchName   : name,
                center: center,
                course: course,
                batchStatus   : status,
                startDate: startDate,
                endDate : endDate,
            };

            this.currentModel.set(data);
            this.currentModel.save(this.currentModel.changed, {
                put  : true,
                wait   : true,
                success: function (model) {
                    self.hideDialog();

                    self.collection.set(model, {remove: false});
                    return App.render({
                        type: 'notify',
                        message:constants.RESPONSES.EDIT_SUCCESS
                    });
                },

                error: function (model, response) {
                    App.render({
                        type   : 'error',
                        message: response.error
                    });
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

        },

        render: function () {
            var self = this;
            var formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Bank Account',
                width      : '500px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                        self.gaTrackingEditConfirm();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });
            this.$el.find('#startDate').datepicker({
                changeMonth: true,
                changeYear: true
            });

            populate.get('#course', '/vcourse/', {category: 'COURSES'}, 'courseName', this, true);
            populate.get('#center', '/franchise/', {category: 'CENTER'}, 'centerName', this, true);

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
