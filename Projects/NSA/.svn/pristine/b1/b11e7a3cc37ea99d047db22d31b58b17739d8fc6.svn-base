define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VNotifications/details/others/CreateTemplate.html',
    'models/vOtherNotificationsModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers'
], function (Backbone, $, _, Parent, template, Model, populate, CONSTANTS, keyValidator, helpers) {
    'use strict';

    var EditView = Parent.extend({
        template   : _.template(template),
        contentType: 'Others',

        initialize : function (options) {
            options = options || {};

            _.bindAll(this, 'render');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
        },

        events: {
            'keypress #price': 'keypressHandler'
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

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
                    message: "Title field can't be empty."
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
                createdBy: App.currentUser.login,
                createdDate: new Date(),
                updatedBy: App.currentUser.login,
                updatedDate: new Date(),
                status: status,
                createdId: App.currentUser._id,
                updatedId: App.currentUser._id
            }, {
                wait   : true,
                success: function (model) {
                    self.hideDialog();
                    self.collection.add(model);
                    return App.render({
                        type: 'notify',
                        message: "Sent successfully"
                    });
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog1').remove();
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
                dialogClass: 'edit-dialog1',
                title      : 'Create Topic',
                width      : '800px',
                buttons    : [{
                    text : 'Send',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem(true);
                    }
                },{
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
                }]

            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
