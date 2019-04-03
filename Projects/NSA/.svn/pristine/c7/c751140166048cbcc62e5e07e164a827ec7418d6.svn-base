define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VCSTManagement/cvmDetails/courses/EditTemplate.html',
    'text!templates/VCSTManagement/cvmDetails/courses/MultiDuration.html',
    'views/selectView/selectView',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'dataService',
    'services/productCategories',
    'services/examManagment',
], function (Backbone, $, _, Parent, EditTemplate, MultiDuration, SelectView, populate, CONSTANTS, keyValidator, helpers, dataService, productCategories, examManagementService) {
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
            'click .removeJob'          : 'deleteRow',
            'click #variantsClassBlock ': examManagementService.showClass,
            'click #showClsBtn '        : examManagementService.showClass,
            'click .deleteClasses '     : examManagementService.deleteClasses,
            'click  ._formBlock'             : 'hideSelect',
            'change #classCategories'        : 'changeClass',
            'change .productCategories'        : 'changeSubject',
            'click  .delSubject '            : 'deleteSubject',
            'click  ._variantsSubjects'      : productCategories.showSubject,
            'click  #showBtn'                : productCategories.showSubject,
            'input  .multiSelectSearch'      : examManagementService.multiSelectSearch,
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('.deleteRow');
            e.stopPropagation();
            e.preventDefault();
            tr.remove();
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var name = $.trim($thisEl.find('#name').val());
            var code = $.trim($thisEl.find('#code').val());
            var classes = this.selectClasses;
            var subject = this.selectSubject;
            var status = $thisEl.find('#yes').prop('checked') || false;

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

            var data = {};
            data.titleName = name;
            data.titleStatus = status;
            data.titleCode = code;
            data.classDetail = classes,
            data.subject = subject
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

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

        },

        render: function () {
            var self = this;
            this.selectCenters = []
            this.selectClasses = []
            this.selectSubject = []
            dataService.getData('/vstudents/course/' + self.currentModel.toJSON()._id, {}, function(data) {
                var formString = self.template({
                    model           : self.currentModel.toJSON(),
                    data: data,
                    currencySplitter: helpers.currencySplitter
                });

                self.$el = $(formString).dialog({
                    autoOpen: true,
                    dialogClass: 'edit-dialog',
                    title: 'Edit Bank Account',
                    width: '500px',
                    buttons: [{
                        text: 'Save',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingEditConfirm();
                        }
                    }, {
                        text: 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }]

                });

                var ClassesData = []
                _.map(self.currentModel.toJSON().classDetail, function (obj) {
                    var classes = {};
                    classes.name = obj.name;
                    classes._id = obj._id;
                    self.selectClasses.push(obj._id);
                    ClassesData.push(classes);
                });

                var SubjectData = []
                _.map(self.currentModel.toJSON().subject, function (obj) {
                    var subject = {};
                    subject.name = obj.name;
                    subject._id = obj._id;
                    self.selectSubject.push(obj._id);
                    SubjectData.push(subject);
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

                self.delegateEvents(self.events);
            })
            return this;
        },

        renderSubject : function(objs){
            var $thisEl = this.$el;
            var self = this;
            var $checkedCategoryContainer = $thisEl.find('#checkedProductCategories');
            var $categoriesBlock = $thisEl.find('#variantsCenterBlock');
            var $categoryContainer = $thisEl.find('#productCategories');
            var checkedSelectedId;
            var checkedName;
            $categoryContainer.append('<input type="text" id="mySubjectInput" class="multiSelectSearch" placeholder="Search for Subject..." title="Type in a center">');
            $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCategories" id="2" data-value="ALL" data-id="1"> <span></span></label><label class="_checkboxLabel" for="2">ALL</label></li>');
            _.each(objs, function (category) {
                checkedName = '';
                checkedSelectedId = '';
                if (self.selectSubject.indexOf(category._id) >= 0) {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox productCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                    checkedSelectedId = category._id;
                    checkedName = category.name;
                } else {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                }

                if (checkedName) {
                    $checkedCategoryContainer.append('<li><span class="checkedProductCategories"  dat' +
                        'a-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="delSubject icon-close3"></span></li>');
                }
            });
        },

        renderClass : function(objs){
            var $thisEl = this.$el;
            var self = this;
            var $checkedCategoryContainer = $thisEl.find('#checkedClassCategories');
            var $categoriesBlock = $thisEl.find('#variantsClassBlock');
            var $categoryContainer = $thisEl.find('#classCategories');
            var checkedSelectedId;
            var checkedName;
            $categoryContainer.append('<input type="text" id="ClassCate" class="multiSelectSearch" placeholder="Search for Classes.." title="Type in a center">');
            $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox classCategories" id="3" data-value="ALL" data-id="1"> <span></span></label><label class="_checkboxLabel" for="3">ALL</label></li>');
            _.each(objs, function (category) {
                checkedName = '';
                checkedSelectedId = '';
                if (self.selectClasses.indexOf(category._id) >= 0) {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox classCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                    checkedSelectedId = category._id;
                    checkedName = category.name;
                } else {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox classCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                }

                if (checkedName) {
                    $checkedCategoryContainer.append('<li><span class="checkedClassCategories"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteClasses icon-close3"></span></li>');
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
            this.changeSubject(e);
            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },



        changeClass : function(e){
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

            if(categoryId == '1') {
                if($target.is(':checked')) {
                    $thisEl.find('.classCategories').prop('checked', true)
                    $thisEl.find('#checkedClassCategories').empty();
                    checkedValues.each(function (key, item) {
                        if($(item).data('id') != 1) {
                            $categoryContainer.append('<li><span class="checkedClassCategories"  data-value="' + $(item).data('value') + '" data-id="' + $(item).data('id') + '">' + $(item).data('value') + '</span><span class="deleteClasses icon-close3"></span></li>');
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

            if(categoryId && categoryId != '1') {
                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedClassCategories"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteClasses icon-close3"></span></li>');
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
