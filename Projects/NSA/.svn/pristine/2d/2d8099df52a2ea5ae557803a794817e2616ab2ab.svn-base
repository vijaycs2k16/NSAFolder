define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/VCenter/franchise/CreateTemplate.html',
    'models/VFranchiseModel',
    'vconstants',
    'populate',
    'dataService'
], function ($, _, Backbone, ParentView, CreateTemplate, Model, CONSTANTS, populate, dataService) {

    var CreateView = ParentView.extend({
        contentType: CONSTANTS.VFRANCHISE,
        responseObj: {},

        events: {
          'change #main': 'toggleMessage'
        },

        initialize: function (options) {
            var self = this;

            this.model = options.model || Model;
            this.title = options.title || 'Franchise';
            this.dialogWidth = options.width || '800px';
            this.template = options.template || CreateTemplate;
            this.action = options.action;
            this.id = options.id;
            this.event = options.event;
            this.eventChannel = options.eventChannel;
            this.collection = options.collection;

            this.render();
        },

        toggleMessage: function () {
            this.$el.find('.checkText').toggleClass('hidden');
        },

        keyDownHandler: function (e) {
            switch (e.which) {
                case 13:
                    this.saveItem();
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var text = $target.text();
            var $ul = $target.closest('ul');
            var $element = $ul.closest('a');
            this.store = $target.attr('id');
            $element.attr('data-id', id);
            $element.text(text);

            $ul.remove();

            return false;
        },

        saveItem: function () {
            var self = this;
            var $el = this.$el;
            var model;
            var data = {};
            var centerName = $.trim($el.find('#fname').val());
            var centerAddress = $.trim($el.find('#faddress').val());
            var centerEmail = $.trim($el.find('#femail').val());
            var centerInchargeEmail = $.trim($el.find('#personalEmail').val());
            var originalPassword = $.trim($el.find('#password').val());
            var confirmPassword = $.trim($el.find('#cpassword').val());
            var centerPhoneNo = $.trim($el.find('#fphone').val());
            var centerIncharge = $.trim($el.find('#inchargeName').val());
            var centerInchargeMobileno = $.trim($el.find('#inchargePhone').val());
            var centerCode = $.trim($el.find('#fcode').text());
            var status = $el.find('#yes').prop('checked') || false;

            if (!centerName) {
                return App.render({
                    type   : 'error',
                    message: '"Franchise Name" is required field'
                });
            }
            if (!centerPhoneNo.match(/^\d{10}$/)) {
                return App.render({
                    type: 'error',
                    message: "Please enter 10 digits number."
                });
            }
            if (!centerEmail) {
                return App.render({
                    type   : 'error',
                    message: 'Email is required field'
                });
            }
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(centerEmail)) {
                return App.render({
                    type: 'error',
                    message: "Please provide valid email."
                });
            }
            if (!originalPassword) {
                return App.render({
                    type   : 'error',
                    message: 'Password is required field'
                });
            }
            if(confirmPassword !== originalPassword) {
                return App.render({
                    type   : 'error',
                    message: 'Password does not match'
                });
            }
            if (!this.store) {
                return App.render({
                    type   : 'error',
                    message: 'Select Store '
                });
            }

            if (!centerIncharge) {
                return App.render({
                    type   : 'error',
                    message: 'Incharge name is required field'
                });
            }
            if (!centerInchargeEmail) {
                return App.render({
                    type   : 'error',
                    message: 'Incharge Email is required field'
                });
            }
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(centerInchargeEmail)) {
                return App.render({
                    type: 'error',
                    message: "Please provide valid Incharge-email."
                });
            }
            if (!centerInchargeMobileno.match(/^\d{10}$/)) {
                return App.render({
                    type   : 'error',
                    message: 'Please enter 10 digits number.'
                });
            }
            if (!centerAddress) {
                return App.render({
                    type   : 'error',
                    message: 'Address is required field'
                });
            }

            data = {
                centerName              : centerName,
                centerAddress           : centerAddress,
                centerEmail             : centerEmail,
                centerIncharge          : centerIncharge,
                centerInchargeMobileno  : centerInchargeMobileno,
                centerPhoneNo           : centerPhoneNo,
                originalPassword        : originalPassword,
                centerStatus            : status,
                isDeleteCenter          : false,
                centerCode              : centerCode,
                centerInchargeEmail     : centerInchargeEmail,
                store                   : this.store
            };

            model = new this.model();

            model.save(data, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    var obj = {};
                    self.hideDialog();

                    if (self.event) {
                        obj[modelName] = model;

                        return self.eventChannel.trigger(self.event, obj);
                    }

                    if (model.get('main')) {
                        self.collection.each(function (model) {
                            if (model.get('main')) {
                                model.set('main', false);
                            }
                        });
                    }

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});

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

        hideDialog: function () {
            if (this.action) {
                return $('.' + this.action).remove();
            }

            $('.create-dialog').remove();
        },

        render: function () {
            var template = _.template(this.template);
            var formString = template({title: this.title});
            var self = this;
            dataService.getData('/franchise/center/code', {}, function (batches) {
                $('#fcode').text(batches.data.centerCode)
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: this.action || 'create-dialog',
                title      : 'Create Warehouse',
                width      : this.dialogWidth,
                position   : {within: $('#wrapper')},
                buttons    : [{
                    id   : 'create-dialog',
                    class: 'btn blue',
                    text : 'Create',
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

            this.input = this.$el.find('input');

            if (this.action === 'createLocation') {
                this.input.focusout(function (e) {
                    var $target = $(e.target);
                    var div = $target.closest('div');
                    var text = $target.val();

                    if (text) {
                        div.next().find('input').attr('disabled', false);
                    } else {
                        div.nextAll().find('input').val('');
                        div.nextAll().find('input').attr('disabled', true);
                    }

                });
            }

            dataService.getData(CONSTANTS.URLS.ZONES_FOR_DD, {warehouse: this.id}, function (resp) {
                self.responseObj['#zones'] = resp.data;
            });

            populate.get('#country', CONSTANTS.URLS.COUNTRIES, {}, 'name', this, true);
            populate.get('#account', '/chartOfAccount/getForDd', {category: 'ACCOUNTS_INVENTORY'}, 'name', this, true);
            populate.get('#store', '/warehouse/', {}, 'name', this, this, true);

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
