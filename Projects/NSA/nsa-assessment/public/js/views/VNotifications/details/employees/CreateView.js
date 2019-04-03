define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VNotifications/details/employees/CreateTemplate.html',
    'models/vEmpNotificationsModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'dataService',
    'libs/jquery.treevue',
    'libs/jquery.treevue.import',
    'libs/jquery.treevue.export',
], function (Backbone, $, _, Parent, template, Model, populate, CONSTANTS, keyValidator, helpers, dataService) {
    'use strict';

    var EditView = Parent.extend({
        template   : _.template(template),
        contentType: 'subjectMethods',

        initialize : function (options) {
            options = options || {};

            _.bindAll(this, 'render', 'saveItem');

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

        taxonomy: function (taxJson) {
            var students = [];
            if(taxJson.length > 0 ){
                _.forEach(taxJson, function (child1) {
                    if(child1.children.length > 0) {
                        _.forEach(child1.children, function (child2) {
                            if(child2.children.length > 0) {
                                _.forEach(child2.children, function (child3) {
                                    if(child3.selected) {
                                        var student = {};
                                        student._id = child3.id;
                                        student.center = child2.id;
                                        student.phoneNo = child3.value;
                                        students.push(student)
                                    }
                                })
                            }
                        })
                    }
                })
            }

            return students;
        },

        saveItem: function (status) {
            var thisEl = this.$el;
            var self = this;
            var name = $.trim(thisEl.find('#name').val());
            var message = $.trim(thisEl.find('#internalNotes').val());
            var students = this.taxonomy($('#treeview-emp').children().treevueJson())
            var sms = thisEl.find('#sms').prop('checked') || false;
            var push = thisEl.find('#push').prop('checked') || false;
            var notify = {};
            notify.sms = sms;
            notify.push = push;
            if (!name.length) {
                return App.render({
                    type   : 'error',
                    message: "Title field can't be empty."
                });
            }

            if (!message.length) {
                return App.render({
                    type   : 'error',
                    message: "Message field can't be empty."
                });
            }

            if (students.length == 0) {
                return App.render({
                    type   : 'error',
                    message: "Select Students"
                });
            }

            var count = _.ceil(((message.length)/160));

            this.currentModel.save({
                smsTemplateTitle : name,
                smsTemplateMsg   : message,
                status  : status,
                createdBy: App.currentUser.login,
                createdDate: new Date(),
                updatedBy: App.currentUser.login,
                updatedDate: new Date(),
                users: students,
                notify: notify,
                count: count,
                updatedId: App.currentUser._id,
                createdId: App.currentUser._id
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
                title      : 'Employee Notifications',
                width      : '800px',
                buttons    : [{
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
                }]
            });

            dataService.getData('/employees/taxanomy', {}, function (batches) {
                $.treevue(batches).appendTo('#treeview-emp');
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
