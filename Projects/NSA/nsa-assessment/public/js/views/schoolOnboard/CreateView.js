define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/schoolOnboard/CreateTemplate.html',
    'text!templates/schoolOnboard/CenterCourseItems.html',
    'text!templates/schoolOnboard/CenterCourseItem.html',
    'models/schoolOnboardModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'dataService',
    'Lodash',
    'views/schoolOnboard/list/ListView',
    'services/productCategories',
    'services/examManagment'
], function (Backbone, $, _, Parent, template, CenterCourseItems, CenterCourseItem, Model, populate, CONSTANTS, keyValidator, dataService, lodash, ListView, productCategories, examManagmentService) {
    'use strict';

    var terms = [{name : 'Term', _id : 'Term'},{name : 'Semester', _id : 'Semester'}];
    var onBoardCreateView = Parent.extend({
        template: _.template(template),
        contentType: 'schoolOnboard',

        initialize: function (options) {
            options = options || {};

            if (options.eventsChannel) {
                this.eventsChannel = options.eventsChannel;
            }

            _.bindAll(this, 'render', 'saveItem');
            this.selectClasses = {};

            this.currentModel = new Model();
            this.collection = options.collection;
            this.responseObj = {};
            this.render();
        },

        events: {
            'keypress #paymentTermCount' : 'keypressHandler',
            'click .addProductItem a'    : 'getProducts',
            'click .removeJob'           : 'deleteRow',
            'change .topicCategories'    : 'changeClasses',
            'click .delStatus'           : 'deleteClasses',
            'click ._formBlock'          : 'hideSelect',
            'input .multiSelectSearch'   : examManagmentService.multiSelectSearch,
            'click #showBtn1'            : examManagmentService.showTopics,
            'click ._variantsTopics'     : examManagmentService.showTopics,
            'click .deleteTag1'          : 'deleteTopic'
        },

        changeClasses : function(e){
            var $thisEl = this.$el;
            var self = this;
            var $categoryContainer = $(e.target).parent().parent().parent().parent().find('#checkedTopics');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var titleId = $(e.target).parents('tr').find('#titleDd').data('id');

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
            this.selectClasses[titleId] = [];
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectClasses[titleId].push($(item).data('id'));
                });
            }

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },

        renderClasses : function(objs, holder){
            var $thisEl = this.$el;
            var $checkedCategoryContainer = holder.closest('td').next('td').find('#checkedTopics');
            var $categoriesBlock = holder.closest('td').next('td').find('#topicBlocks');
            var $categoryContainer = holder.closest('td').next('td').find('#topicCategories');
            var checkedSelectedId;
            var checkedName;
            if(!_.isEmpty(objs)){
                $categoryContainer.append('<input type="text" id="myTopicInput" class="multiSelectSearch"   placeholder="Search for class.." title="Type in a class">')
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

        deleteClasses: function (e) {
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

        getProducts: function () {
            var self = this;
            this.$el.find('#productList').append(_.template(CenterCourseItem, {model: {}, termObj : ''}));
        },

        keypressHandler: function (e) {
            return keyValidator(e);
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var $thisEl = this.$el;
            $('.newSelectList').hide();
            var tr = $target.closest('tr');
            var idName = $target.closest('.current-selected').attr('id');
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            var titleId = tr.find('#titleDd').attr('data-id');

            if(idName == 'schoolId') {
                this.selectClasses = {};
                this.renderTitle($target.attr('id'));
            }

            if(idName == 'titleDd') {
                var self = this;
                tr.find('#termId').empty();
                tr.find('#termId').text('Select Term')
                tr.find('#checkedTopics').empty();
                tr.find('#topicCategories').empty();
                self.responseObj['#termId'] = terms;
            }

            if(idName == 'termId') {
                tr.find('#checkedTopics').empty();
                tr.find('#topicCategories').empty();
                this.titleId = titleId;
                this.getClasses(titleId, holder);
            }
        },

        getClasses : function(ids, holder){
            var self = this;
            var ClassDatas = [];
            dataService.getData('/title/'+ ids, {}, function(details) {
                self.titles = details.data;
                 _.map(JSON.parse(JSON.stringify(self.titles)), function(detail) {
                    detail.name = detail.classDetail.className;
                     detail._id = detail.classDetail._id;
                    ClassDatas.push(detail)
                });
                var union = lodash.uniqBy(ClassDatas, '_id');
                self.renderClasses(union, holder);
            });
        },

        renderTitle: function() {
            var self = this;
            self.$el.find('#productItemsHolder').html(_.template(CenterCourseItems, {model: '', termObj : ''}));
        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var mid = 1052;
            var Titles = [];
            var id = thisEl.find('#schoolId').data('id');
            var targetEl;
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var i;
            var ids = id.split(',');
            var school_id = ids[0];
            var tenant_id = ids[1];
            var school_name = ids[2];

            if (!selectedProducts.length) {
                return App.render({
                    type: 'error',
                    message: "Title can't be empty. Add Title"
                });
            }

            this.getSelectedTitle();
            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                var titles = targetEl.find('.titleDd').attr("data-id");
                var terms = targetEl.find('.termId').attr("data-id");
                var classdtls = this.selectClasses[titles];
                var isTitle = lodash.filter(this.selectedTitle, {id: titles});

                if(isTitle.length > 1) {
                    return App.render({
                        type: 'error',
                        message: "Duplicate Class " + targetEl.find('.titleDd').text() + " at place " + (i + 1)
                    });
                    break;
                }

                if (!titles.length) {
                    return App.render({
                        type: 'error',
                        message: "Select the title from the list."
                    });
                }

                if(_.isEmpty(terms)){
                    return App.render({
                        type   : 'error',
                        message: "Please Select term."
                    });
                }

                if(_.isEmpty(classdtls)){
                    return App.render({
                        type   : 'error',
                        message: "Please Select class."
                    });
                }

                Titles.push({
                    title: titles,
                    academic: terms,
                    classDetail: classdtls
                });

                if(i == 0) {
                    this.currentModel.save({
                        tenant_id: tenant_id,
                        school_id: school_id,
                        school_name: school_name,
                        academic_year: "2018-2019",
                        titles : Titles
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

        deleteTopic :function (e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var id = $thisEl.find($target.closest('li')
                .find('.checkedTopics')[0])
                .data('id');

            e.stopPropagation();

            $thisEl.find('.topicCategories[data-id="' + id + '"]')
                .prop('checked', false);
            $target.closest('li').remove();

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },

        getSelectedTitle: function() {
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            this.selectedTitle = [];
            var targetEl;
            for (var i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                var titles = targetEl.find('.titleDd').attr("data-id");
                this.selectedTitle.push({id: titles})
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

            dataService.getData('/search/schools', {size: '10000'}, function (schools) {
                schools = _.map(schools.data, function (school) {
                    school.name = school._source.school_name;
                    school.school_id = school._source.school_id;
                    school.tenant_id = school._source.tenant_id;
                    school._id = school._source.school_id + ',' +  school._source.tenant_id + ',' + school._source.school_name;
                    return school;
                });
                self.responseObj['#schoolId'] = schools;
            });

            dataService.getData('/title/schoolTitle', {}, function (titles) {
                titles = _.map(titles.data, function (title) {
                    title.name = title.titleName;
                    return title;
                });
                self.responseObj['#titleDd'] = titles;
            });

            return this;
        }
    });

    return onBoardCreateView;
});