define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VExam/exam/examConfig/CreateTemplate.html',
    'models/vExamConfigModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'moment',
    'Validation',
], function (Backbone, $, _, Parent, template, Model, populate, CONSTANTS, keyValidator, helpers, moment, Validation) {
    'use strict';

    var createView = Parent.extend({
        template   : _.template(template),
        contentType: 'ExamConfiguration',

        initialize : function (options) {
            options = options || {};

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
        },

        events: {
            'keypress #price': 'keypressHandler',
            'keypress #questionMarks': 'checkLoginInputKey',
            'keypress #nagetiveMarks': 'checkLoginInputKey'
        },

        checkLoginInputKey: function (e) {
            var char = String.fromCharCode(e.charCode);
            if (Validation.OnlyNumber(char)) {
                e.preventDefault();
            }
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
            var data ={};
            data.questionMark = $.trim(thisEl.find('#questionMarks').val());
            data.negativeMark = $.trim(thisEl.find('#nagetiveMarks').val());
            data.duration  = $.trim(thisEl.find('#examDuration').val());
            data.name = $.trim(thisEl.find('#name').val());
            data.canReview = thisEl.find('#canReview').is(':checked');
            data.autoCorrect = thisEl.find('#autoCorrect').is(':checked');
            var sDate = this.getTimeForDate(moment($.trim(this.$el.find('#startTime').wickedpicker('time')).split(' '), 'hh:mm:ss A'));
            var eDate = this.getTimeForDate(moment($.trim(this.$el.find('#endTime').wickedpicker('time')).split(' '), 'hh:mm:ss A'));
            data.timeBegin = sDate.date;
            data.timeEnd = eDate.date;

            var duration = sDate.min - eDate.min;
            var timeBegin = Date.parse(data.timeBegin);
            var timeEnd = Date.parse(data.timeEnd);

            if (timeBegin >= timeEnd) {
                return App.render({
                    type: 'error',
                    message: "Select Valid Time."
                });
            }

            if (!data.name) {
                return App.render({
                    type   : 'error',
                    message: "Name field can't be empty."
                });
            }

            if (!data.duration) {
                return App.render({
                    type: 'error',
                    message: "duration field can't be empty."
                });

            }
                if (!data.questionMark) {
                    return App.render({
                        type: 'error',
                        message: "question Markfield can't be empty."
                    });

                }
                    if (data.duration > Math.abs(duration)) {
                        return App.render({
                            type: 'error',
                            message: "Duration is Incorrect."
                        });
                    }
                this.currentModel.save(data, {
                wait   : true,
                success: function (model) {
                    self.hideDialog();

                    self.collection.add(model);
                    return App.render({
                        type: 'notify',
                        message:CONSTANTS.RESPONSES.CREATE_SUCCESS
                    });
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        getTimeForDate: function(date){
            var hours = date.get('hours');
            var minutes = date.get('minutes');
            var seconds = date.get('seconds');
            var min = (hours * 60) + minutes + (seconds/60);

            return {"date" : moment(new Date()).hours(hours).minutes(minutes).seconds(seconds).toDate(), "min":min} ;
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var formString;

            formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });
            this.$el.html(formString);
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

            this.$el.find('#startTime').wickedpicker({
                showSeconds: true,
                secondsInterval: 1,
                minutesInterval: 1
            });

            this.$el.find('#endTime').wickedpicker({
                showSeconds: true,
                secondsInterval: 1,
                minutesInterval: 1
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return createView;
});
