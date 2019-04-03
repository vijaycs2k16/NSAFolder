define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VCenter/franchise/EditTemplate.html',
    'views/VCenter/franchise/EditView',
    'collections/VCenter/franchiseCourse/filterCollection',
    'models/VFranchiseModel',
    'vconstants',
    'populate'
], function (Backbone, $, _, ParentView, ItemTemplate, CreateView, WarehouseCollection, Model, CONSTANTS, populate) {
    'use strict';

    var ContentView = ParentView.extend({
        el              : '#content-holder',
        contentType     : CONSTANTS.VFRANCHISE,
        modulesView     : null,
        modelChanged    : {},
        changedLocations: {},
        changedZones    : {},
        responseObj     : {},

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
            'change #main'         : 'toggleMessage'
        },

        toggleMessage: function () {
            this.$el.find('.checkText').toggleClass('hidden');
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
            var originalPassword = $.trim($el.find('#password').val());
            var confirmPassword = $.trim($el.find('#cpassword').val());
            var centerPhoneNo = $.trim($el.find('#fphone').val());
            var centerIncharge = $.trim($el.find('#inchargeName').val());
            var centerInchargeMobileno = $.trim($el.find('#inchargePhone').val());
            var centerInchargeEmail = $.trim($el.find('#personalEmail').val());
            var centerCode = $.trim($el.find('#fcode').text());
            var store = $el.find('#store').data('id');
            var status = $el.find('#yes').prop('checked') || false;

            if (!centerName) {
                return App.render({
                    type   : 'error',
                    message: '"Franchise Name" is required field'
                });
            }
            if (!centerPhoneNo) {
                return App.render({
                    type   : 'error',
                    message: 'Franchise Phone is required field'
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

            if (!centerInchargeMobileno) {
                return App.render({
                    type   : 'error',
                    message: 'Incharge mobile number is required field'
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

            this.currentModel.set(data);
            this.currentModel.save(this.currentModel.changed, {
                put  : true,
                wait   : true,
                success: function (model) {
                    self.hideDialog();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});

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


        render: function () {
            var self = this;
            var formString = _.template(ItemTemplate, {
                model      : this.model.toJSON(),
                contentType: this.contentType
            });
            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : '800px',
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

            this.store =  this.model.toJSON().store ?  this.model.toJSON().store._id : null;
            populate.get('#store', '/warehouse/', {}, 'name', this, this, true);

            this.delegateEvents(this.events);

            return this;
        }
    });

    return ContentView;
});
