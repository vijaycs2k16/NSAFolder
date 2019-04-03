define([
    'Backbone',
    'jQuery',
    'Underscore',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/BundleMove/CreateTemplate.html',
    'text!templates/BundleMove/ProductItems.html',
    'text!templates/BundleMove/ProductItem.html',
    'models/bundleMoveModel',
    'populate',
    'moment',
    'constants',
    'helpers/keyValidator',
    'dataService',
    'helpers'
], function (Backbone, $, _, lodash, Parent, template, ProductItems, ProductItem, Model, populate, moment, CONSTANTS, keyValidator, dataService, helpers, BatchesScheduleCollection) {
    'use strict';

    var CreateView = Parent.extend({
        template: _.template(template),
        contentType: 'Bundle Move',

        initialize: function (options) {
            options = options || {};

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
            this.changedQuantity = _.debounce(this.changedQuantity, 250);
        },

        events: {
            'keypress #price'        : 'keypressHandler',
            'click .removeJob'       : 'deleteRow',
            'change #classDate'      : 'loadData',
            'keyup  input.quantity'  : 'changedQuantity'
        },

        loadData: function(e) {
            var self = this;
            var $thisEl = this.$el;
            var bundle = $thisEl.find('#productsBundle').text()
            var classDate = $('#classDate').val();
            var products = _.filter(self.productList, function(o) { return o.id == e; });
            this.selectedProduct = products ? products[0] : {};
            $('#bundleQuantity').text(this.selectedProduct.onHand);

            if(lodash.isEmpty(bundle)){
                $('#classDate').val('');
                return App.render({
                    type: 'error',
                    message: 'Please Choose Bundle'
                });
            }


            self.$el.find('#productItemsHolder').html(_.template(ProductItems, { model: {}, data: products[0], _: _, moment: moment }));

        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');
            var jobId = tr.find('#productsDd').attr('data-id');
            var product = _.findWhere(this.responseObj['#productsDd'], {_id: jobId});
            if (product) {
                product.selectedElement = false;
            }

            e.stopPropagation();
            e.preventDefault();

            tr.remove();
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var $thisEl = this.$el;
            var id = target.attr('id');
            e.preventDefault();
            $('.newSelectList').hide();
            target.closest('.current-selected').text(target.text()).attr('data-id', target.attr('id'));

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            var bundleId = $(e.target).attr('id');
            this.loadData(bundleId)
            return false;
        },

        changedQuantity: function (e) {
            var $targetEl = $(e.target);
            var $parent = $targetEl.closest('tr');
            var inputEl = $targetEl.closest('input');
            var type = inputEl.attr('id');
            var val;

            var targetEl;
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var i;
            var adjusted;

            if (!inputEl.length) {
                inputEl = $parent.find('textarea');
            }
            val = parseInt(inputEl.val());

            if (!val) {
                val = 0;
            }

            e.preventDefault();

            if (type === 'adjustQuantity') {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    adjusted = parseFloat(targetEl.find('#adjustQuantity').val(val));
                }
            }

        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var productsBundleId = thisEl.find('#productsBundle').attr('data-id');
            var selectedProducts = this.$el.find('.productItem');
            var pId = this.selectedProduct && this.selectedProduct.productAvail ? this.selectedProduct.productAvail._id :'';
            var pOnHand = this.selectedProduct ? this.selectedProduct.onHand :'';
            var selectedLength = selectedProducts.length;
            var targetEl;
            var i;
            var bundles = [];
            var bundleObj = {};
            var bundlesObjs = [];
            var ProductAvailability = [];
            var ids = [];
            var reason = $.trim(thisEl.find('#reason').val());
            var adjusted;
            var body = {};
            var totQuatity = thisEl.find('#totalQuatity').attr('value');
            var adjust = parseFloat(thisEl.find('#adjustQuantity').val());
            var bundleQuantity = thisEl.find('#bundleQuantity').text();

            if(!productsBundleId){
                return App.render({
                    type: 'error',
                    message: 'Please Select Bundle'
                })
            }

            if(selectedLength === 0){
                return App.render({
                    type: 'error',
                    message: 'Please add one batch at least'
                })
            }

            if(adjust === 0){
                return App.render({
                    type: 'error',
                    message: 'adjust Quantity can not be empty'
                })
            }

            if(totQuatity < adjust){
                return App.render({
                    type: 'error',
                    message: 'Total Quatity & Adjusted Quatity is  Not Equal'
                })
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                var _id = targetEl.attr('id');
                if(_id) {
                    ids.push(_id)
                }

                var productsId = targetEl.find('#productName').attr('data-id');
                var proId = targetEl.find('#productName').attr('data-pid');
                var totalQuatity = targetEl.find('#totalQuatity').attr('data-value');
                adjusted = parseFloat(targetEl.find('#adjustQuantity').val());
                var availableQuantity = parseFloat(targetEl.find('#availableQuantity').val());

                bundles.push({
                    _id:productsId,
                    quantity: adjusted

                });

                bundlesObjs.push({
                    _id:productsId,
                    quantity: availableQuantity + adjusted

                });

                ProductAvailability.push({
                    _id:proId,
                    product: productsId,
                    onHand: totalQuatity - adjusted
                })
            }

            bundles.push({
                _id:productsBundleId,
                quantity: adjusted

            });

            ProductAvailability.push({
                _id: pId,
                product: productsBundleId,
                onHand: pOnHand + adjusted

            });

            bundleObj.productId = productsBundleId;
            bundleObj.bundles = bundlesObjs;
            body.bundleObj = bundleObj;
            body.productAvailability = ProductAvailability;
            body.bundles = bundles;
            body.isReturn = false;
            body.reason = reason;

            dataService.postData('/products/bundleTypes', body, function (err, result) {
                if(err) {
                    return App.render({
                        type: 'error',
                        message: 'Error'
                    })
                } else {
                    dataService.getData('/products/bundleView', {}, function (employees) {
                        self.productList = employees;
                        employees = _.map(employees, function (employee) {
                            var employeeData = {};
                            employeeData._id = employee.id;
                            employeeData.name = employee.name;
                            employeeData.onHand= employee.onHand;
                            return employeeData;
                        });
                        self.responseObj['#productsBundle'] = employees;
                        self.loadData(productsBundleId)
                    });
                    return App.render({
                        type: 'notify',
                        message: 'created successfully'
                    })
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var formString;

            formString = this.template({
                model: this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });

            this.$el = $(formString).dialog({
                autoOpen: true,
                dialogClass: 'edit-dialog',
                title: 'Create Shipping Method',
                width: '800px',

                buttons: [{
                    text: 'Update',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text: 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                    }
                }]

            });

            dataService.getData('/products/bundleView', {}, function (employees) {
                self.productList = employees;
                employees = _.map(employees, function (employee) {
                    var employeeData = {};
                    employeeData._id = employee.id;
                    employeeData.name = employee.name;
                    employeeData.onHand= employee.onHand;
                    return employeeData;
                });
                self.responseObj['#productsBundle'] = employees;
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return CreateView;
});
