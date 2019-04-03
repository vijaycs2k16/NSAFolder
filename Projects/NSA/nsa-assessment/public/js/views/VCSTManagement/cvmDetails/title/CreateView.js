define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VCSTManagement/cvmDetails/title/CreateTemplate.html',
    'text!templates/VCSTManagement/cvmDetails/title/CenterCourseItems.html',
    'text!templates/VCSTManagement/cvmDetails/title/CenterCourseItem.html',
    'models/titleModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'dataService',
    'Lodash',
    'views/VCSTManagement/cvmDetails/title/ListView',
    'services/productCategories',
    'services/examManagment'
], function (Backbone, $, _, Parent, template, CenterCourseItems, CenterCourseItem, Model, populate, CONSTANTS, keyValidator, dataService, lodash, ListView, productCategories, examManagmentService) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(template),
        contentType: 'VCourses',

        initialize: function (options) {
            options = options || {};

            if (options.eventsChannel) {
                this.eventsChannel = options.eventsChannel;
            }

            _.bindAll(this, 'render', 'saveItem');
            this.selectSubjects = {};

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
        },

        events: {
            'keypress #paymentTermCount': 'keypressHandler',
            'click .addProductItem a': 'getProducts',
            'click .removeJob': 'deleteRow',
            'change .topicCategories'    : 'changeSubject',
            'click .delStatus': 'deleteSubject',
            'click ._formBlock'             : 'hideSelect',
            'input .multiSelectSearch'   : examManagmentService.multiSelectSearch,
            'click #showBtn1'            : examManagmentService.showTopics,
            'click ._variantsTopics'     : examManagmentService.showTopics,
        },


        changeSubject : function(e){
            var $thisEl = this.$el;
            var self = this;
            var $categoryContainer =$(e.target).parent().parent().parent().parent().find('#checkedTopics');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var classId = $(e.target).parents('tr').find('#classId').data('id');

            var checkedProductCategory = $(e.target).parent('tr').parent().parent().parent().find('.checkedTopics');
            var idsArray = [];
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

            e.stopPropagation();

            if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
            } else {
                $categoryContainer.append('<li><span class="checkedTopics"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteTag1 icon-close3"></span></li>');
            }
            var checkedProductCategory =  $(e.target).parents('tr').find('.checkedTopics');
            this.selectSubjects[classId] = [];
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectSubjects[classId].push($(item).data('id'));
                });
            }

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },

        renderSubjects : function(objs, holder){
            var $thisEl = this.$el;
            var $checkedCategoryContainer = holder.closest('td').next('td').find('#checkedTopics');
            var $categoriesBlock = holder.closest('td').next('td').find('#topicBlocks');
            var $categoryContainer = holder.closest('td').next('td').find('#topicCategories');
            var checkedSelectedId;
            var checkedName;
            if(!_.isEmpty(objs)){
                $categoryContainer.append('<input type="text" id="myTopicInput" class="multiSelectSearch"   placeholder="Search for subjects.." title="Type in a subjects">')
                _.each(objs, function (category) {

                    checkedName = '';
                    checkedSelectedId = '';
                    if (objs.indexOf(category._id) >= 0) {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox topicCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" style="text-align: left" for="' + category._id + '">' + category.name + '</label></li>');
                        checkedSelectedId = category._id;
                        checkedName = category.name;
                    } else {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox topicCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" style="text-align: left" for="' + category._id + '">' + category.name + '</label></li>');
                    }

                    if (checkedName) {
                        $checkedCategoryContainer.append('<li><span class="checkedTopics"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag1 icon-close3"></span></li>');
                    }
                });
            } else {
                $categoryContainer.append('<li><label>No Data Found</label></li>');
            }
        },

        deleteSubject: function (e) {
            var tr = $(e.target).closest('tr');
            var id = tr.attr('id');
            var answer = confirm('Really DELETE items ?!');
            e.preventDefault();
            e.stopPropagation();
            var self = this;

            if (answer === true) {
                if(id) {
                    dataService.deleteData('/vbatchSchedule/' + id, {}, function (err) {
                        self.$el.find('tr[id="' + id + '"]').remove();
                    });
                } else {
                    this.t
                        .row( $(e.target).parents('tr') )
                        .remove()
                        .draw();
                }

            }
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

        keypressHandler: function (e) {
            return keyValidator(e);
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            $('.newSelectList').hide();
            var tr = $target.closest('tr');
            var idName = $target.closest('.current-selected').attr('id');

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            var classId = tr.find('#classId').attr('data-id');

            if(idName == 'titleId') {
                this.renderTitle($target.attr('id'))
            }
            if(idName == 'classId') {
                this.classId = classId
                this.getSubjects(classId, holder)
            }

        },

        getSubjects : function(ids, holder){
            var self = this;
            var TopicDats = [];

            dataService.getData('/vsubject', {category: 'SUBJECTS'}, function (subjects) {
                subjects = _.map(subjects.data, function (subject) {
                    subject.name = subject.subjectName;
                    subject._id = subject._id;
                    TopicDats.push(subject)
                });
                var union = lodash.uniqBy(TopicDats, '_id');
                self.renderSubjects(union, holder);
            });
        },

        renderTitle: function(id) {
            var self = this;
            dataService.getData('/franchise/getForCenter', {center: id}, function (data) {
                self.$el.find('#productItemsHolder').html(_.template(CenterCourseItems, {model: data.data}));
            });
        },

        saveItem: function (e) {
            var thisEl = this.$el;
            var $targetE = this.$el;
            var self = this;
            var mid = 39;
            var title = thisEl.find('#titleId').data('id');
            var targetEl;
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var i;
            var data = [];

            if (!selectedProducts.length) {
                return App.render({
                    type: 'error',
                    message: "Subject details can't be empty. Add Subject"
                });
            }

            this.getSelectedClass();

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                var classes = targetEl.find('.classDd').attr("data-id") ;
                var subjectObj = this.selectSubjects[classes];
                var isClass = lodash.filter(self.selectedClass, {id: classes})

                if(isClass.length > 1) {
                    return App.render({
                        type: 'error',
                        message: "Duplicate Class " + targetEl.find('.classId').text() + " at place " + (i + 1)
                    });
                    break;
                }

                if (!classes.length) {
                    return App.render({
                        type: 'error',
                        message: "Select the class from the list."
                    });
                }

                if(_.isEmpty(subjectObj)){
                    return App.render({
                        type   : 'error',
                        message: "Please Select subject."
                    });
                }

                data.push({
                    title: title,
                    classDetail: classes,
                    subject: subjectObj
                });

                if(i == 0) {
                    this.currentModel.save({
                        data: data
                    }, {
                        wait   : true,
                        success: function (model) {
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(window.location.hash, {trigger: true});
                            self.hideDialog();
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

        getSelectedClass: function() {
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            this.selectedClass = []
            var targetEl;
            for (var i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                var classes = targetEl.find('.classDd').attr("data-id");
                this.selectedClass.push({id: classes})
            }
        },

        hideSelect: function() {
            $('._categoriesList').hide();
        },

        hideDialog: function () {
            if (this.eventsChannel) {
                return this.eventsChannel.trigger('closeCreatePriceList');
            }

            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var formString = this.template({
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen: true,
                dialogClass: 'edit-dialog',
                title: 'Create Title',
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

            dataService.getData('/title/schoolTitle', {}, function (titles) {
                titles = _.map(titles.data, function (title) {
                    title.name = title.titleName;
                    return title;
                });
                self.responseObj['#titleId'] = titles;
            });

            dataService.getData('/title/classDetails', {}, function (details) {
                details = _.map(details.data, function (detail) {
                    detail.name = detail.className;
                    return detail;
                });
                self.classDetails = details;
                self.responseObj['#classId'] = details;
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
