define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VCSTManagement/cvmDetails/courses/CreateTemplate.html',
    'text!templates/VCSTManagement/cvmDetails/courses/MultiDuration.html',
    'models/vCourseModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'dataService',
    'services/productCategories',
    'services/examManagment',
], function (Backbone, $, _, Parent, template, MultiDuration, Model, populate, CONSTANTS, keyValidator, helpers, dataService, productCategories, examManagmentService) {
    'use strict';

    var EditView = Parent.extend({
        template   : _.template(template),
        contentType: 'course',

        initialize : function (options) {
            options = options || {};

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
        },

        events: {
            'keypress #price': 'keypressHandler',
            'click .removeJob'          : 'deleteRow',
            'click  #variantsClassBlock':examManagmentService.showClass,
            'click  #showClsBtn '       :examManagmentService.showClass,
            'click .delSubject '        : 'deleteSubject',
            'click .deleteClassess '    : examManagmentService.deleteClasses,
            'change #classCategories'          : 'changeClass',
            'change #productCategories'        : 'changeSubject',
            'click ._variantsSubjects'      : productCategories.showSubject,
            'click   #showBtn'              : productCategories.showSubject,
            'click ._formBlock'             : 'hideSelect',
            'input .multiSelectSearch'   : examManagmentService.multiSelectSearch
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('.deleteRow');
            e.stopPropagation();
            e.preventDefault();
            tr.remove();
            return App.render({
                type: 'notify',
                message: "  deleted successfully"
            });
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
            var name = $.trim(thisEl.find('#name').val());
            var code = $.trim(thisEl.find('#code').val());
            var status = thisEl.find('#yes').prop('checked') || false;
            var classes = this.selectClasses
            var subject = this.selectSubject

            if (!name.length) {
                return App.render({
                    type   : 'error',
                    message: "Course Name field can't be empty."
                });
            }

            if(_.isEmpty(classes)){
                return App.render({
                    type   : 'error',
                    message: "Please Select Classes."
                });
            }

            if(_.isEmpty(subject)){
                return App.render({
                    type   : 'error',
                    message: "Please Select Subject."
                });
            }

            this.currentModel.save({
                titleName           : name,
                titleCode           : code,
                titleStatus         : status,
                classDetail         : classes,
                subject             : subject
            }, {
                wait   : true,
                success: function (model) {
                    self.hideDialog();
                    self.collection.add(model);

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});

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
            $('.edit-dialog').remove();
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
                dialogClass: 'edit-dialog',
                title      : 'Create Shipping Method',
                width      : '500px',
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
            dataService.getData('/title/ClassDetails', {}, function (courses) {
                courses = _.map(courses.data, function (course) {
                    course.name = course.className;
                    return course;
                });
                self.renderClass(courses);
                self.responseObj['#variantsClassBlock'] = courses;
            });

            dataService.getData('/vsubject', {category: 'SUBJECTS'}, function (subjects) {
                subjects = _.map(subjects.data, function (subject) {
                    subject.name = subject.subjectName;
                    return subject;
                });
                self.renderSubject(subjects)
                self.responseObj['#variantsCenterBlock'] = subjects;
            });

            this.delegateEvents(this.events);

            return this;
        },

        renderSubject: function(objs){
            var $thisEl = this.$el;
            var $checkedCategoryContainer = $thisEl.find('#checkedProductCategories');
            var $categoriesBlock = $thisEl.find('#variantsCenterBlock');
            var $categoryContainer = $thisEl.find('#productCategories');
            var checkedSelectedId;
            var checkedName;
            $categoryContainer.append('<input type="text" id="mySubjectInput" class="multiSelectSearch" placeholder="Search for Subjects.." title="Type in a Class">');
            $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCategories" id="3" data-value="ALL" data-id="1"> <span></span></label><label class="_checkboxLabel" for="3">ALL</label></li>');
            _.each(objs, function (category) {
                checkedName = '';
                checkedSelectedId = '';
                if (objs.indexOf(category._id) >= 0) {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox productCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                    checkedSelectedId = category._id;
                    checkedName = category.name;
                } else {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                }
                if (checkedName) {
                    $checkedCategoryContainer.append('<li><span class="checkedProductCategories"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag icon-close3"></span></li>');
                }
            });
        },

        renderClass : function(objs){
            var $thisEl = this.$el;
            var $checkedCategoryContainer = $thisEl.find('#checkedClassCategories');
            var $categoriesBlock = $thisEl.find('#variantsClassBlock');
            var $categoryContainer = $thisEl.find('#classCategories');
            var checkedSelectedId;
            var checkedName;
            $categoryContainer.append('<input type="text" id="ClassCate" class="multiSelectSearch" placeholder="Search for Classes.." title="Type in a Class">');
            $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox classCategories" id="2" data-value="ALL" data-id="1"> <span></span></label><label class="_checkboxLabel" for="2">ALL</label></li>');
            _.each(objs, function (category) {
                checkedName = '';
                checkedSelectedId = '';
                if (objs.indexOf(category._id) >= 0) {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox classCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                    checkedSelectedId = category._id;
                    checkedName = category.name;
                } else {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox classCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                }
                if (checkedName) {
                    $checkedCategoryContainer.append('<li><span class="checkedClassCategories"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag icon-close3"></span></li>');
                }
            });
        },

        deleteSubject: function(e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var id = $thisEl.find($target.closest('li')
                .find('.checkedProductCategories')[0])
                .data('id');

            e.stopPropagation();

            $thisEl.find('.productCategories[data-id="' + id + '"]')
            .prop('checked', false);
            $target.closest('li').remove();
            if (typeof this.useFilter === 'function') {
                this.useFilter();
        }
    },

        changeClass : function(e) {
            var $thisEl = this.$el;
            var self = this;
            var $categoryContainer = $thisEl.find('#checkedClassCategories');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var idsArray = [];
            var checkedProductCategory = $thisEl.find('.checkedClassCategories');
            var checkedValues = $thisEl.find('.classCategories')
            e.stopPropagation();
            if (categoryId == '1') {
                if ($target.is(':checked')) {
                    $thisEl.find('.classCategories').prop('checked', true)
                    $thisEl.find('#checkedClassCategories').empty();
                    checkedValues.each(function (key, item) {
                        if ($(item).data('id') != 1) {
                            $categoryContainer.append('<li><span class="checkedClassCategories"  data-value="' + $(item).data('value') + '" data-id="' + $(item).data('id') + '">' + $(item).data('value') + '</span><span class="deleteClassess icon-close3"></span></li>');
                        }
                    });
                } else {
                    $thisEl.find('#checkedClassCategories').empty();
                    $thisEl.find('.classCategories').prop('checked', false)
                }

            }
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

            if (categoryId && categoryId != '1') {
                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedClassCategories"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteClassess icon-close3"></span></li>');
                }
            }
            this.selectClasses = [];
            var checkedProductCategory = $thisEl.find('.checkedClassCategories');
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectClasses.push($(item).data('id'));
                });
            }

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },
        changeSubject : function(e) {
            var $thisEl = this.$el;
            var self = this;
            var $categoryContainer = $thisEl.find('#checkedProductCategories');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var idsArray = [];
            var checkedProductCategory = $thisEl.find('.checkedProductCategories');
            var checkedValues = $thisEl.find('.productCategories')
            e.stopPropagation();
            if (categoryId == '1') {
                if ($target.is(':checked')) {
                    $thisEl.find('.productCategories').prop('checked', true)
                    $thisEl.find('#checkedProductCategories').empty();
                    checkedValues.each(function (key, item) {
                        if ($(item).data('id') != 1) {
                            $categoryContainer.append('<li><span class="checkedProductCategories"  data-value="' + $(item).data('value') + '" data-id="' + $(item).data('id') + '">' + $(item).data('value') + '</span><span class="delSubject icon-close3"></span></li>');
                        }
                    });
                } else {
                    $thisEl.find('#checkedProductCategories').empty();
                    $thisEl.find('.productCategories').prop('checked', false)
                }

            }
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

            if (categoryId && categoryId != '1') {
                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedProductCategories"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="delSubject icon-close3"></span></li>');
                }
            }

            this.selectSubject = [];
            var checkedProductCategory = $thisEl.find('.checkedProductCategories');
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectSubject.push($(item).data('id'));
                });
            }
            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },
        hideSelect: function() {
            $('._categoriesList').hide();
        }
    });

    return EditView;
});
