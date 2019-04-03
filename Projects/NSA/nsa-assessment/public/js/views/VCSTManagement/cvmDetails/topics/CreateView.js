define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VCSTManagement/cvmDetails/topics/CreateTemplate.html',
    'text!templates/VCSTManagement/cvmDetails/topics/MultiTopics.html',
    'text!templates/VCSTManagement/cvmDetails/topics/MultiTopic.html',
    'models/vTopicModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'dataService',
    'services/examSchedule',
], function (Backbone, $, _, Parent, template, MultiTopics, MultiTopic, Model, populate, CONSTANTS, keyValidator, helpers, dataService, examScheduleService) {
    'use strict';

    var EditView = Parent.extend({
        template   : _.template(template),
        contentType: 'shippingMethods',

        initialize : function (options) {
            options = options || {};

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
        },

        events: {
            'click .addNewTopic span': 'addNewTopic',
            'click .addProductItem span': 'getProducts',
            'click .removeJob'       : 'deleteRow',
            'keypress #price': 'keypressHandler',

            'change .productCenterCategory' : 'changeCenter',
            'click #showCenterBtn'      : examScheduleService.showCenters,
            'click ._varientCenter'     : examScheduleService.showCenters,
            'click .deleteCenter'       : 'deleteCenters',
            'click ._enlargedItemMargin' : 'closeMultiselect'
        },

        addNewTopic: function (e) {
            this.$el.find('#addvalue').prepend("<input type='text'>");
        },

        getProducts: function (e) {
            this.$el.find('#productList').append(_.template(MultiTopic, {elem: {}}));
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            //var name = $.trim(thisEl.find('#name').val());
            var price = $.trim(thisEl.find('#price').val());
            var course = thisEl.find('#course').attr('data-id');
            var subject = thisEl.find('#subject').attr('data-id');
            var products = [];
            var selectedProducts = this.$el.find('.productItem');
            var saveObject;
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productId;
            var adjusted;
            var cost;
            var onHand;
            var productAvailable;
            var i;

            if(!subject) {
                return App.render({
                    type: 'error',
                    message: 'Select Subject'
                })
            }

            if(_.isEmpty(this.selectCenters)) {
                return App.render({
                    type: 'error',
                    message: 'Select Course'
                })
            }

            if (!selectedProducts.length) {
                return App.render({
                    type: 'error',
                    message: "Add One or more Topic Name. Topic Name should't be empty."
                });
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                productId = $.trim(targetEl.find('#name').val());
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

            var courses = this.selectCenters;

            var arr = [];

            for( var j=0; j < courses.length; j++ ) {
                var obj = {};
                obj.course = courses[j];
                obj.subject = subject;
                obj.topics = products;
                arr.push(obj);
            }

            dataService.postData('/vtopic/', {topics: arr}, function (err, result) {
                if(err) {
                    self.errorNotification(err);
                } else {
                    self.hideDialog();
                    self.collection.add(result);
                }
            })
            return App.render({
                type: 'notify',
                message:CONSTANTS.RESPONSES.CREATE_SUCCESS
            });
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('div.productItem');
            e.stopPropagation();
            e.preventDefault();

            tr.remove();
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        hideSelect: function(e) {
            $('.newSelectList').hide();
        },


        closeMultiselect : function(e) {
            var $thisEl = this.$el;
            var $categoriesBlock = $thisEl.find('._variantsBlock');
            e.stopPropagation();
            if (!$categoriesBlock.length) {
                $categoriesBlock = $thisEl.find('._variantsBlock');
            }
            if ($categoriesBlock.hasClass('open')) {
                $categoriesBlock.removeClass('open');
                $categoriesBlock.children('ul').hide();
            }
        },

        render: function () {
            var self = this;
            var formString;

            formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });
            this.$el.find('#test').prepend("test value");

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Topic',
                width      : '600px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
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
            dataService.getData('/vsubject/', {category: 'SUBJECTS'}, function (subjects) {
                subjects = _.map(subjects.data, function (subject) {
                    subject.name = subject.subjectName;
                    return subject;
                });
                self.responseObj['#subject'] = subjects;
            });
            // populate.get('#course', '/vcourse/', {category: 'COURSES'}, 'courseName', this, true);
            dataService.getData('/vcourse/', {category: 'COURSES'}, function (courses) {
                courses = _.map(courses.data, function (course) {
                    course.name = course.courseName;
                    return course;
                });
                self.renderCenters(courses);
                self.responseObj['#center'] = courses;
            });

            this.delegateEvents(this.events);

            //this.$el.find('#addvalue').prepend("<input type='text'>");
            this.$el.find('#productItemsHolder').html(_.template(MultiTopics));

            return this;
        },

        renderCenters : function(objs){
            var $thisEl = this.$el;
            var $checkedCategoryContainer = $thisEl.find('#checkedProductCenter');
            var $categoriesBlock = $thisEl.find('#variantsCenterBlock');
            var $categoryContainer = $thisEl.find('#productCenterCategories');
            var checkedSelectedId;
            var checkedName;
            $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCenterCategory" id="1" data-value="ALL" data-id="1"> <span></span></label><label class="_checkboxLabel" for="1">ALL</label></li>');
            _.each(objs, function (category) {
                checkedName = '';
                checkedSelectedId = '';

                if (objs.indexOf(category._id) >= 0) {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox productCenterCategory" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                    checkedSelectedId = category._id;
                    checkedName = category.name;
                } else {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCenterCategory" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                }

                if (checkedName) {
                    $checkedCategoryContainer.append('<li><span class="checkedProductCenter"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag icon-close3"></span></li>');
                }
            });
        },

        deleteCenters: function(e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var id = $thisEl.find($target.closest('li')
                .find('.checkedProductCenter')[0])
                .data('id');

            e.stopPropagation();
            //$thisEl.find('.productCenterCategory').prop('checked', false)
            $('#checkedProductCategories').empty();

            $thisEl.find('.productCenterCategory[data-id="' + id + '"]')
                .prop('checked', false);
            $target.closest('li').remove();
            this.selectBatches = [];
            $thisEl.find('#productCategories').empty();
            $thisEl.find('.productCategory').prop('checked', false);
            this.changeCenter(e);
            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },


        changeCenter : function(e){
            var $thisEl = this.$el;
            var self = this;
            var $categoryContainer = $thisEl.find('#checkedProductCenter');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var idsArray = [];
            var checkedProductCategory = $thisEl.find('.checkedProductCenter');
            var checkedValues = $thisEl.find('.productCenterCategory')
            e.stopPropagation();

            if(categoryId == '1') {
                if($target.is(':checked')) {
                    $thisEl.find('.productCenterCategory').prop('checked', true)
                    $thisEl.find('#checkedProductCenter').empty();
                    checkedValues.each(function (key, item) {
                        if($(item).data('id') != 1) {
                            $categoryContainer.append('<li><span class="checkedProductCenter"  data-value="' + $(item).data('value') + '" data-id="' + $(item).data('id') + '">' + $(item).data('value') + '</span><span class="deleteCenter icon-close3"></span></li>');
                        }

                    });
                } else {
                    $thisEl.find('#checkedProductCenter').empty();
                    $thisEl.find('.productCenterCategory').prop('checked', false)
                }

            }

            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

            if(categoryId && categoryId != '1') {
                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedProductCenter"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteCenter icon-close3"></span></li>');
                }
            }



            this.selectCenters = [];
            var checkedProductCategory = $thisEl.find('.checkedProductCenter');
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectCenters.push($(item).data('id'));
                });
            }

            /*var paperId = $thisEl.find('#paperConfig').attr('data-id');
            var courseObj = _.filter(this.config, {_id: paperId} );
            this.courseId = courseObj.length > 0 ? courseObj[0].course._id : '';

            this.selectBatch(self.selectCenters, this.courseId);*/

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },
    });

    return EditView;
});