define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VCSTManagement/cvmDetails/title/EditTemplate.html',
    'text!templates/VCSTManagement/cvmDetails/title/CenterCourseItems.html',
    'text!templates/VCSTManagement/cvmDetails/title/CenterCourseItem.html',
    'views/selectView/selectView',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'dataService',
    'Lodash'
], function (Backbone, $, _, Parent, EditTemplate, MultiTopics, MultiTopic, SelectView, populate, CONSTANTS, keyValidator, helpers, dataService, lodash) {
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

            this . data = options.data;

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
            var title = thisEl.find('#title').attr('data-id');
            var subject = thisEl.find('#subject').attr('data-id');
            var classDetail = thisEl.find('#Class_st').attr('data-id');
            var products = [];
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productName;
            var productAvailable;
            var i;
            var productId;

            if (!selectedProducts.length) {
                return App.render({
                    type: 'error',
                    message: "Add One or more Topic Name. Topic Name should't be empty."
                });
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                productName = $.trim(targetEl.find('.name').val());
                productId = $.trim(targetEl.find('#name').attr('data-id'));
                if (productName == '') {
                    return App.render({
                        type: 'error',
                        message: "Topic Name Should should't be empty."
                    });
                }
                productAvailable = targetEl.attr('id');
                var topicObject = {};
                topicObject.name = productName;
                if(productId)
                    topicObject._id = productId;

                products.push(topicObject);
            }

            var product =[];
            products.forEach( function(item){
                if(item.name){
                    product.push(item);
                }
            })
            var data = {};

            data.topics = product;
            data.title = title;
            data.subject = subject;
            data.classDetail   = classDetail ;

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
            var target = $(e.target);
            var $target = $(e.target);
            var $thisEl = this.$el;
            var id = target.attr('id');
            e.preventDefault();
            $('.newSelectList').hide();
            target.closest('.current-selected').text(target.text()).attr('data-id', target.attr('id'));
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            var titleID = $thisEl.find('#title').attr('data-id')

            return false;
        },

        render: function () {
            var self = this;
            var formString = this.template({
                model           : this.currentModel.toJSON(),
            });

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

            dataService.getData('/title/schoolTitle', {}, function (titles) {
                titles = _.map(titles.data, function (title) {
                    title.name = title.titleName;
                    return title;
                });
                self.responseObj['#title'] = titles;
            });


            this.delegateEvents(this.events);
            this.$el.find('#productItemsHolder').html(_.template(MultiTopics, {model: this.currentModel.toJSON()}));
            this.$el.find('.eidtTopic').addClass('hide');

            return this;
        }
    });

    return EditView;
});
