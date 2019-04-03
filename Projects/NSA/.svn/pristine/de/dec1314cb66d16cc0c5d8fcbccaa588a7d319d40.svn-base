define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VCSTManagement/cvmDetails/topics/EditTemplate.html',
    'text!templates/VCSTManagement/cvmDetails/topics/MultiTopics.html',
    'text!templates/VCSTManagement/cvmDetails/topics/MultiTopic.html',
    'views/selectView/selectView',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers'
], function (Backbone, $, _, Parent, EditTemplate, MultiTopics, MultiTopic, SelectView, populate, CONSTANTS, keyValidator, helpers) {
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
            'keypress #price': 'keypressHandler',
            'click .addProductItem span': 'getProducts',
            'click .removeJob'       : 'deleteRow'
        },

        getProducts: function (e) {
            this.$el.find('#productList').append(_.template(MultiTopic, {elem: {}}));
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('div.productItem');
            e.stopPropagation();
            e.preventDefault();

            tr.remove();

        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var price = $.trim(thisEl.find('#price').val());
            var course = thisEl.find('#course').attr('data-id');
            var subject = thisEl.find('#subject').attr('data-id');
            var products = [];
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productId;
            var productAvailable;
            var i;

            if (!selectedProducts.length) {
                return App.render({
                    type: 'error',
                    message: "Add One or more Topic Name. Topic Name should't be empty."
                });
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                productId = $.trim(targetEl.find('.name').val());
                if (productId == '') {
                    return App.render({
                        type: 'error',
                        message: "Topic Name Should should't be empty."
                    });
                }
                productAvailable = targetEl.attr('id');
                products.push({
                    name: productId
                });
            }

            var product =[];
            products.forEach( function(item){
                if(item.name){
                    product.push(item);
                }
            })
            var data = {};

            data.course = course;
            data.topics = product;
            data.subject = subject;

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

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

        },

        render: function () {
            var self = this;
            var formString = this.template({
                collection      : this.collection.toJSON(),
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter,
                _               : _
            });
            /*$('#eidtTopic').addClass('hide');*/
            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Bank Account',
                width      : '600px',
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

            populate.get('#subject', '/vsubject/', {category: 'SUBJECTS'}, 'subjectName', this, true);
            populate.get('#course', '/vcourse/', {category: 'COURSES'}, 'courseName', this, true);


            this.delegateEvents(this.events);
            this.$el.find('#productItemsHolder').html(_.template(MultiTopics));
            this.$el.find('.eidtTopic').addClass('hide');

            return this;
        }
    });

    return EditView;
});
