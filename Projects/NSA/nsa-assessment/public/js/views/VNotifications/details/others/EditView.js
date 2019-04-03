define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VNotifications/details/others/EditTemplate.html',
    'views/selectView/selectView',
    'populate',
    'constants',
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

        events: {
            'keypress #price': 'keypressHandler'
        },

        saveItem: function (status) {
            var thisEl = this.$el;
            var self = this;
            var title = $.trim(thisEl.find('#title').val());
            var phoneNo = ($.trim(thisEl.find('#phoneNo').val())).split(',');
            var message = $.trim(thisEl.find('#internalNotes').val());
            var sms = thisEl.find('#sms').prop('checked') || false;
            var push = thisEl.find('#push').prop('checked') || false;
            var notify = {};
            notify.sms = sms;
            notify.push = push;
            if (!title.length) {
                return App.render({
                    type   : 'error',
                    message: "Topic Name field can't be empty."
                });
            }

            if (!phoneNo.length) {
                return App.render({
                    type   : 'error',
                    message: "Message To field can't be empty."
                });
            }

            if (!message.length) {
                return App.render({
                    type   : 'error',
                    message: "Message field can't be empty."
                });
            }
            var count = _.ceil(((message.length)/160));

            this.currentModel.save({
                smsTemplateTitle   : title,
                phoneNo :  phoneNo,
                smsTemplateMsg : message,
                notify: notify,
                count: count,
                updatedBy: App.currentUser.login,
                updatedDate: new Date(),
                status: status,
                updatedId: App.currentUser._id,
            }, {
                put    : true,
                wait   : true,
                success: function (model) {
                    self.hideDialog();
                    self.collection.add(model);
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog1').remove();
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

        },

        render: function () {
            var self = this, btn;
            var formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });

            if(this.currentModel.attributes.status == false) {
                btn =  [{
                    text : 'Send',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem(true);
                    }
                }, {
                    text : 'Draft',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem(false);
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }];
            } else {
                btn = [{
                    text : 'Close',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }}];
            }

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog1',
                title      : 'Edit Bank Account',
                width      : '800px',
                buttons    : btn
            });

            populate.get('#subject', '/vsubject/', {category: 'SUBJECTS'}, 'subjectName', this, true);
            populate.get('#course', '/vcourse/', {category: 'COURSES'}, 'courseName', this, true);


            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
