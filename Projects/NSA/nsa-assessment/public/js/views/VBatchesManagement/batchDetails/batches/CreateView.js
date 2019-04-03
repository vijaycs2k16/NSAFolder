define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VBatchesManagement/batchDetails/batches/CreateTemplate.html',
    'models/vBatchModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'moment',
    'dataService',
], function (Backbone, $, _, Parent, template, Model, populate, CONSTANTS, keyValidator, helpers, moment, dataService) {
    'use strict';

    var EditView = Parent.extend({
        template   : _.template(template),
        contentType: 'shippingMethods',

        initialize : function (options) {
            options = options || {};

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
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

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            $('.newSelectList').hide();
            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var name = $.trim(thisEl.find('#name').val());
            var center = thisEl.find('#center').attr('data-id');
            var course = thisEl.find('#course').attr('data-id');
            var status = thisEl.find('#yes').prop('checked') || false;

            var startDate = moment($.trim(this.$el.find('#startDate').val())).format("D MMM, YYYY")
            var endDate = moment($.trim(this.$el.find('#endDate').text())).format("D MMM, YYYY")
            var startDateVal = thisEl.find('#startDate').val();
            var endDateVal = thisEl.find('#startDate').val();

            if (!name) {
                return App.render({
                    type: 'error',
                    message: "Batch Name field can't be empty."
                });
            }


            if (!startDateVal) {
                return App.render({
                    type: 'error',
                    message: "Start Date Name field can't be empty."
                });
            }

            if (!endDateVal) {
                return App.render({
                    type: 'error',
                    message: "End Date Name field can't be empty."
                });
            }


            this.currentModel.save({
                batchName: name,
                center: center,
                course: course,
                batchStatus   : status,
                startDate: startDate,
                endDate : endDate,
            },
                {
                wait   : true,
                success: function (model) {
                    self.hideDialog();
                    self.collection.add(model);

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});

                    return App.render({
                        type: 'notify',
                        message:CONSTANTS.RESPONSES.CREATE_SUCCESS
                    });
                },

                error: function (model, xhr) {
                    if(xhr.status == 500){
                        return App.render({
                            type: 'error',
                            message: 'batchName already existed in same center & course'
                        });

                    } else {
                        return App.render({
                            type: 'error',
                            message: xhr.responseJSON.message
                        });

                        self.errorNotification(xhr);
                    }

                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var formString;

            formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Shipping Method',
                width      : '500px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });
            populate.get('#course', '/vcourse/', {category: 'COURSES'}, 'courseName', this, true, true);
            populate.get('#center', '/franchise/', {category: 'CENTER'}, 'centerName', this, true, true);

            this.$el.find('#startDate').datepicker({
                changeMonth: true,
                changeYear: true
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
