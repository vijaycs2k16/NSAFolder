define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/testConfiguration/EditTemplate.html',
    'views/selectView/selectView',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'moment'
], function (Backbone, $, _, Parent, EditTemplate, SelectView, populate, CONSTANTS, keyValidator, helpers, moment) {
    'use strict';

    var configEditView = Parent.extend({
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


        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var data = {};

            this.currentModel.set(data);
            this.currentModel.save(this.currentModel.changed, {
                put  : true,
                wait   : true,
                success: function (model) {
                    self.hideDialog();

                    self.collection.set(model, {remove: false});
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
            var subjects =  [];
            var topics = [];
            var subTopics = [];

             _.forEach(this.currentModel.toJSON().subject, function (val) {
                subjects.push(val.subjectName)
            });
            _.forEach(this.currentModel.toJSON().topicData, function (val) {
                topics.push(val.name)
            });
            _.forEach(this.currentModel.toJSON().stData, function (val) {
                subTopics.push(val.name)
            });
            var formString = this.template({
                model           : this.currentModel.toJSON(),
                subjects        : subjects.toString(),
                topics          : topics.toString(),
                subTopics       : subTopics.toString(),
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Bank Account',
                width      : '800px',
                buttons    : [ {
                    text : 'Close',
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
                showSeconds    : true,
                secondsInterval: 1,
                minutesInterval: 1
            });

            var $container = self.$el.find('#generatedQues');
            var questions = (this.currentModel.toJSON()).questions;
            var quesUsage = (this.currentModel.toJSON()).qCount;
            $container.html('');
            self.generateQuesIds = [];

            _.each(questions, function (item) {
                var dataObjs = _.filter(quesUsage, {question: item._id})
                var repeat = dataObjs.length > 0 && dataObjs[0].count > 1 ? '*' : '';
                self.generateQuesIds.push(item._id);
                $container.append('<li class="itemForBundle">' + item.form[0].desc + '<span class="text-danger">' + '&nbsp;' + repeat +'</li>');
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return configEditView;
});