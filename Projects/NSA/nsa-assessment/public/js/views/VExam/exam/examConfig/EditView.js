define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VExam/exam/examConfig/EditTemplate.html',
    'views/selectView/selectView',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'moment',
    'Validation',
], function (Backbone, $, _, Parent, EditTemplate, SelectView, populate, CONSTANTS, keyValidator, helpers, moment, Validation) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(EditTemplate),
        contentType: 'ExamConfiguration',

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
            'keypress #questionMarks': 'checkLoginInputKey',
            'keypress #nagetiveMarks': 'checkLoginInputKey'
        },

        checkLoginInputKey: function (e) {
            var char = String.fromCharCode(e.charCode);
            if (Validation.OnlyNumber(char)) {
                e.preventDefault();
            }
        },


        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var data = {};
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

            if (data.duration > Math.abs(duration)) {
                return App.render({
                    type: 'error',
                    message: "Duration is Incorrect."
                });
            }

            if (_.isEmpty(data.name)) {
                return App.render({
                    type   : 'error',
                    message: 'name field cannot be empty'
                });
            }

            if (_.isEmpty(data.duration)) {
                return App.render({
                    type   : 'error',
                    message: 'Duration field cannot be empty'
                });
            }

            this.currentModel.set(data);
            this.currentModel.save(this.currentModel.changed, {
                put  : true,
                wait   : true,
                success: function (model) {
                    self.hideDialog();
                    return App.render({
                        type: 'notify',
                        message:CONSTANTS.RESPONSES.EDIT_SUCCESS
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

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

        },

        render: function () {
            var self = this;
            var timeBegin = this.currentModel.get('timeBegin');
            var timeEnd = this.currentModel.get('timeEnd');
            var time = moment(timeBegin).format('H:mm:ss');
            var time1 = moment(timeEnd).format('H:mm:ss');

            var formString = this.template({
                model           : this.currentModel.toJSON(),
                moment: moment,
                currencySplitter: helpers.currencySplitter
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Exam Configuration',
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

            this.$el.find('#startTime').wickedpicker({
                now            : time,
                showSeconds: true,
                secondsInterval: 1,
                minutesInterval: 1
            });

            this.$el.find('#endTime').wickedpicker({
                now            : time1,
                showSeconds: true,
                secondsInterval: 1,
                minutesInterval: 1
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});