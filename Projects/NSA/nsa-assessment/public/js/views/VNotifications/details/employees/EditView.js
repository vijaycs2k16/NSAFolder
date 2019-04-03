define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VNotifications/details/employees/EditTemplate.html',
    'views/selectView/selectView',
    'populate',
    'constants',
    'helpers/keyValidator',
    'helpers',
    'dataService'
], function (Backbone, $, _, Parent, EditTemplate, SelectView, populate, CONSTANTS, keyValidator, helpers, dataService) {
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
            var name = $.trim(thisEl.find('#name-emp-edit').val());
            var message = $.trim(thisEl.find('#internalNotes-emp-edit').val());
            var students = this.taxonomy($('#treeview-emp-edit').children().treevueJson())
            var sms = thisEl.find('#sms-emp-edit').prop('checked') || false;
            var push = thisEl.find('#push-emp-edit').prop('checked') || false;
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
                updatedBy: App.currentUser.login,
                updatedId: App.currentUser._id,
                updatedDate: new Date(),
                users: students,
                notify: notify,
                count: count
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
                title      : 'Employee Notifications',
                width      : '800px',
                buttons    : btn
            });

            var data = this.currentModel.toJSON();
            dataService.getData('/employees/taxanomy/' + data._id, {}, function (batches) {
                $.treevue(batches).appendTo('#treeview-emp-edit');
            });
            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
