define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VCenter/franchiseCourse/CreateTemplate.html',
    'text!templates/VCenter/franchiseCourse/CenterCourseItems.html',
    'text!templates/VCenter/franchiseCourse/CenterCourseItem.html',
    'models/VFranchiseCourseModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'dataService',
    'Lodash',
    'views/VCenter/franchiseCourse/ListView'
], function (Backbone, $, _, Parent, template, CenterCourseItems, CenterCourseItem, Model, populate, CONSTANTS, keyValidator, dataService, Lodash, ListView) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(template),
        contentType: 'priceList',

        initialize: function (options) {
            options = options || {};

            if (options.eventsChannel) {
                this.eventsChannel = options.eventsChannel;
            }

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
        },

        events: {
            'keypress #paymentTermCount': 'keypressHandler',
            'keyup .discountValue': 'discountValue',
            'click .defaultShipAdress': 'shippingShow',
            'click .active': 'active',
            'click .createDiscountOrNot': 'createDiscountOrNot',
            'click input.checkVakue': 'defaultShipAdress',
            'click .addProductItem a': 'getProducts',
            'click .removeJob': 'deleteRow',
            'keypress #priceListName': 'restrictDecimalValues',
            'keyup #priceListName': 'restrictDecimalValues',
            'blur #priceListName': 'restrictDecimalValues',
            'paste #priceListName': 'restrictDecimalValues',
            'keypress #discountValue': 'restrictDecimalValues',
            'keyup #discountValue': 'restrictDecimalValues',
            'blur #discountValue': 'restrictDecimalValues',
            'paste #discountValue': 'restrictDecimalValues'
        },


        defaultShipAdress: function (e) {
            var target = $(e.target);
            var tr = target.closest('input.defaultShipAdress').is(':checked');
            if (tr == true) {
                target.closest('tr').find('.shippingAddress').removeClass('hidden');
                target.closest('tr').find('#discPriceHide').removeClass('hidden');
            } else {
                target.closest('tr').find('.shippingAddress').addClass('hidden');
                target.closest('tr').find('#discPriceHide').addClass('hidden');
            }
        },

        createDiscountOrNot: function (e) {
            var thisEl = this.$el;
            var percentage = $.trim(thisEl.find('.createDiscountOrNot').val());
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

        getProducts: function (e) {
            this.$el.find('#productList').append(_.template(CenterCourseItem, {model: {}}));
        },

        active: function (e) {
            var $target = $(e.target);
            var thisEl = this.$el;
            var sList = "";
            var sThisVal="";
            $('input.active[type=checkbox]').each(function () {
                sThisVal = (this.checked ? "1" : "0");
                if (sThisVal == '1') {
                    $(this).val('1')
                }
                if (sThisVal == '0') {
                    $(this).val('0')
                }
                sList += (sList=="" ? sThisVal : "," + sThisVal);
            });


        },

        discountValue: function (e) {
            var target = $(e.target);
            var $target = $(e.target);
            var thisEl = this.$el;
            var tr = target.closest('tr').find('.createDiscountOrNot').val();
            var priceListName = target.closest('tr').find('.priceListName').val();
            var discountValue = target.closest('tr').find('.discountValue').val();
            if (tr === 'flat') {
                discountValue = priceListName - discountValue;
                target.closest('tr').find('.discountPrice').val(discountValue);
            }

            if (tr === 'percentage') {
                discountValue = (discountValue / 100) * priceListName;
                discountValue = priceListName - discountValue
                target.closest('tr').find('.discountPrice').val(discountValue);
            }
        },

        shippingShow: function (e) {
            var $target = $(e.target);
            var targetEl;
            var thisEl = this.$el;
            var sList = "";
            var sThisVal="";
            var selectedProducts = this.$el.find('.shippingRadio');
            var i;
            var selectedLength = selectedProducts.length;
            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                var defaultShipAdress = targetEl.val();


            }

            $('input.defaultShipAdress[type=checkbox]').each(function () {
                sThisVal = (this.checked ? "1" : "0");
                if (sThisVal == '1') {
                    $(this).val('1')
                }
                if (sThisVal == '0') {
                    $(this).val('0')
                }
            });
        },

        keypressHandler: function (e) {
            return keyValidator(e);
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            $('.newSelectList').hide();
            var idName = $target.closest('.current-selected').attr('id');
            if(idName == 'franchiseCenter') {
                this.renderCourse($target.attr('id'))
            } /*else if(idName == 'courseDd')  {
                var isCourse = this.getSelectedCourse($target.attr('id'))
                if(isCourse) {
                    return App.render({
                        type: 'error',
                        message: "Duplicate Course "
                    });
                }

            }*/
            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
        },

        renderCourse: function(id) {
            var self = this;
            dataService.getData('/franchise/getForCenter', {center: id}, function (data) {
                self.$el.find('#productItemsHolder').html(_.template(CenterCourseItems, {model: data.data}));
            });
        },

        saveItem: function (e) {
            var thisEl = this.$el;
            var $targetE = this.$el;
            var self = this;
            var $parent = $targetE.closest('div');
            var mid = 39;
            var franchise = thisEl.find('#franchiseCenter').data('id');
            var targetEl;
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var i;
            var data = [];

            if (!selectedProducts.length) {
                return App.render({
                    type: 'error',
                    message: "Course Fee details can't be empty. Add Course Fees"
                });
            }
            this.getSelectedCourse();

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                var course = targetEl.find('.courseDd').attr("data-id") ;
                var priceListName = targetEl.find('.priceListName').val();
                var active = targetEl.find('.active').val();
                var isDiscount = targetEl.find('.defaultShipAdress').val();
                var isDiscount11 = targetEl.find('.productList');
                var discountValue =  targetEl.find('.discountValue').val();
                var discountPrice = targetEl.find('.discountPrice').val();
                var isCourse = Lodash.filter(this.selectedCourses, {id: course})
                if(isCourse.length > 1) {
                    return App.render({
                        type: 'error',
                        message: "Duplicate Course " + targetEl.find('.courseDd').text() + " at place " + (i + 1)
                    });
                    break;
                }

                if (active == 1) {
                    var active = true;
                } else {
                    var active = false;
                }

                if (isDiscount == 1) {
                    if (!discountValue.length) {
                        return App.render({
                            type: 'error',
                            message: "Discount Value field can't be empty."
                        });
                    }
                    var isDiscountApplicable = true;
                    var createDiscountOrNot = targetEl.find('#createDiscountOrNot').val();
                } else {
                    var isDiscountApplicable = false;
                }


                if (!course.length) {
                    return App.render({
                        type: 'error',
                        message: "Select the Course from the list."
                    });
                }

                if (!priceListName.length) {
                    return App.render({
                        type: 'error',
                        message: "Course Price field can't be empty."
                    });
                }

                data.push({
                    center: franchise,
                    course: course,
                    centerCourseFees: priceListName,
                    actualFees: discountPrice,
                    discountValue: discountValue,
                    discountType: createDiscountOrNot,
                    isDiscountApplicable: isDiscountApplicable,
                    centerCourseStatus: active
                })

                if(i == 0) {
                    this.currentModel.urlRoot = '/fcourse/update/' + franchise
                    this.currentModel.save({
                        data: data
                    }, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function (model) {
                            if (self.eventsChannel) {
                                return self.eventsChannel.trigger('savePriceList', model);
                            }
                            self.hideDialog();
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
                }


            }
        },

        getSelectedCourse: function() {
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            this.selectedCourses = []
            var targetEl;
            for (var i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                var course = targetEl.find('.courseDd').attr("data-id");
                this.selectedCourses.push({id: course})
            }
        },


        hideDialog: function () {
            if (this.eventsChannel) {
                return this.eventsChannel.trigger('closeCreatePriceList');
            }

            $('.edit-dialog').remove();
        },

        restrictDecimalValues: function(event){
              var $target = $(event.target), thisEl = this.$el;
            var percentage = $.trim(thisEl.find('.createDiscountOrNot').val());
            var id = $target.attr('id');
            var condition = (id == 'priceListName') ? true : (percentage !== 'percentage') ? true : false;
            if(condition){
                if (event.type === "paste") {
                    setTimeout(function() {
                        $target.val($target.val().replace(/[^\d].+/, ""));
                    }, 100);
                } else {
                    if (event.which < 48 || event.which > 57) {
                        event.preventDefault();
                    } else {
                        $target.val($target.val().replace(/[^\d].+/, ""));
                    }
                }
            }
        },
        render: function () {
            var self = this;
            var formString = this.template({
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen: true,
                dialogClass: 'edit-dialog',
                title: 'Create Bank Account',
                width: '950px',
                buttons: [{
                    text: 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text: 'Cancel',
                    class: 'btn',
                    click: function () {
                        if (self.eventsChannel) {
                            return self.eventsChannel.trigger('closeCreatePriceList');
                        }
                        self.hideDialog();
                    }
                }]

            });
            dataService.getData('/franchise/', {category: 'CENTER'}, function (center) {
                center = _.map(center.data, function (center) {
                    center.name = center.centerName;
                    return center;
                });
                    self.responseObj['#franchiseCenter'] = center;
            });
            /*populate.get('#franchiseCenter', '/franchise/', { "centerCourseStatus": true, count : 1000000 }, 'centerName', this, true);*/
            populate.get('#courseDd', '/vcourse/', { "centerCourseStatus": true, count : 1000000 }, 'courseName', this, true);

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
