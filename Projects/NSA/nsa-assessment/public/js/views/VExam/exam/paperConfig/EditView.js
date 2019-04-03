define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VExam/exam/paperConfig/EditTemplate.html',
    'views/selectView/selectView',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers'
], function (Backbone, $, _, Parent, EditTemplate, SelectView, populate, CONSTANTS, keyValidator, helpers) {
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
            var subjects =  [];
            var topics = [];
            var courseDetails = [];
            var subTopics = [];

             _.forEach(this.currentModel.toJSON().subject, function (val) {
                subjects.push(val.subjectName)
            })
            _.forEach(this.currentModel.toJSON().topicData, function (val) {
                topics.push(val.name)
            })
            _.forEach(this.currentModel.toJSON().course, function (val) {
                courseDetails.push(val.courseName)
            })
            _.forEach(this.currentModel.toJSON().stData, function (val) {
                subTopics.push(val.name)
            })
            var formString = this.template({
                model           : this.currentModel.toJSON(),
                subjects        : subjects.toString(),
                topics          : topics.toString(),
                courseDetails   : courseDetails.toString(),
                subTopics       : subTopics.toString(),
                currencySplitter: helpers.currencySplitter
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


            var $container = self.$el.find('#generatedQues');
            var questions = (this.currentModel.toJSON()).questions;
            $container.html('');
            self.generateQuesIds = [];
            _.each(questions, function (item) {
                self.generateQuesIds.push(item._id);
                $container.append('<li class="itemForBundle">' + item.form[0].desc +'</li>');
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
