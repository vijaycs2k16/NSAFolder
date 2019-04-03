define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/subjectTermTopics/CreateTemplate.html',
    'models/subjectTermTopicsModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'dataService',
    'Lodash',
    'views/subjectTermTopics/list/ListView',
    'services/examManagment'
], function (Backbone, $, _, Parent, template, Model, populate, CONSTANTS, keyValidator, dataService, lodash, ListView, examManagementService) {
    'use strict';

    var CreateView = Parent.extend({
        template: _.template(template),
        contentType: 'subjectTermTopics',

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
            'keypress #paymentTermCount' : 'keypressHandler',
            'click ._formBlock'          : 'hideSelect',
            'input .multiSelectSearch'   : examManagementService.multiSelectSearch,
            'click #showBtn1'            : examManagementService.showTopics,
            'click ._variantsTopics'     : examManagementService.showTopics,
            'change .topicCategories'    : 'changeTopic',
            'click .deleteTag1'          : 'deleteTopic'
        },

        keypressHandler: function (e) {
            return keyValidator(e);
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var $thisEl = this.$el;
            var id = target.attr('id');
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            var titleId = $thisEl.find('#title').attr('data-id');
            var termId = $thisEl.find('#term').attr('data-id');
            if (id == titleId) {
                this.titleId = titleId;
                this.selectTitle(titleId);
                this.selectTerm(this.titleId)
            }

            if( id == termId ){
                this.termId = termId;
            }
        },

        selectTitle: function(id){
            this.resetTitle();
            var self = this;
            var ids = id.split('-');
            var titleId = ids[1];
            var classId = ids[2];
            var subjectId = ids[3];

            var mix = {
                classDetail: classId,
                subject: subjectId,
                title: titleId
            };

            dataService.getData('/subTopics/class',mix, function (topics) {
                self.topics = topics.data;
                var objs = [];
                _.map(JSON.parse(JSON.stringify(self.topics)), function (value) {
                    value._id = value.topics._id;
                    value.name = value.topics.name;
                    objs.push(value);
                });
                self.topicData = lodash.uniqBy(objs, '_id');
                self.renderTopics(self.topicData);
            });
        },

        selectTerm: function(id){
            var ids = id.split('-');
            var termIds = ids[0];
            var self = this;
            dataService.getData('/schoolsubjectTitle/term', {subjectTitle : termIds}, function (terms) {
                terms = _.map(terms.data, function (termsub) {
                    termsub._id = termsub._id;
                    termsub.name = termsub.term_name;
                    return termsub;
                });
                self.responseObj['#term'] = lodash.uniqBy(terms, '_id');
            })
        },

        resetTitle: function(){
            this.$el.find('#term').empty();
            this.$el.find('#topicCategories').empty();
            this.$el.find('#checkedTopics').empty();
        },

        setValues: function () {
            var $thisEl = this.$el;
            this.data = {};
            this.data.subjectTitleTerm = $thisEl.find('#term').attr('data-id');
            this.data.subjectTopic = this.selectTopics;
        },

        saveItem: function () {
            var self = this;
            this.setValues();

            if(!this.data.subjectTitleTerm || this.data.subjectTitleTerm === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please Select Term."
                });
            }

            if(_.isEmpty(this.data.subjectTopic)){
                return App.render({
                    type   : 'error',
                    message: "Please Select topic."
                });
            }

            this.currentModel.save(this.data , {
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

        renderTopics : function(objs){
            var $thisEl = this.$el;
            var $checkedCategoryContainer = $thisEl.find('#checkedTopics');
            var $categoriesBlock = $thisEl.find('#topicBlocks');
            var $categoryContainer = $thisEl.find('#topicCategories');
            var checkedSelectedId;
            var checkedName;
            if(!_.isEmpty(objs)){
                $categoryContainer.append('<input type="text" id="myTopicInput" class="multiSelectSearch"   placeholder="Search for topics.." title="Type in a topics">')
                $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox topicCategories" id="3" data-value="ALL" data-id="3"> <span></span></label><label class="_checkboxLabel" for="3">ALL</label></li>');
                _.each(objs, function (category) {
                    checkedName = '';
                    checkedSelectedId = '';

                    if (objs.indexOf(category._id) >= 0) {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox topicCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name +'</label></li>');
                        checkedSelectedId = category._id;
                        checkedName = category.name;
                    } else {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox topicCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name +'</label></li>');
                    }

                    if (checkedName) {
                        $checkedCategoryContainer.append('<li><span class="checkedTopics"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag1 icon-close3"></span></li>');
                    }
                });
            } else {
                $categoryContainer.append('<li><label>No Data Found</label></li>');
            }
        },

        changeTopic : function(e){
            var $thisEl = this.$el;
            var self = this;
            var $categoryContainer = $thisEl.find('#checkedTopics');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var checkedProductCategory = $thisEl.find('.checkedTopics');
            var idsArray = [];
            var checkedValues = $thisEl.find('.topicCategories');

            if (categoryId == '3') {
                if ($target.is(':checked')) {
                    $thisEl.find('.topicCategories').prop('checked', true);
                    $thisEl.find('#checkedTopics').empty();
                    checkedValues.each(function (key, item) {
                        if ($(item).data('id') != 3) {
                            $categoryContainer.append('<li><span class="checkedTopics"  data-value="' + $(item).data('value') + '" data-id="' + $(item).data('id') + '">' + $(item).data('value') + '</span><span class="delSubject icon-close3"></span></li>');
                        }
                    });
                } else {
                    $thisEl.find('#checkedTopics').empty();
                    $thisEl.find('.topicCategories').prop('checked', false)
                }

            }
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

            e.stopPropagation();
            if (categoryId && categoryId != '3') {
                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedTopics"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteTag1 icon-close3"></span></li>');
                }
            }

            this.selectTopics = [];
            var checkedProductCategory = $thisEl.find('.checkedTopics');
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectTopics.push($(item).data('id'));
                });
            }

            if (typeof this.useFilter === 'function') {
                this.useFilter();
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

            dataService.getData('/subjectTitle/', {}, function (titles) {
                titles = _.map(titles.data, function (title) {
                    title.name = title.title.titleName + ' - '+ title.classDetail.className + ' - ' + title.subject.subjectName;
                    title._id = title._id + '-' +  title.title._id + '-' + title.classDetail._id + '-'+ title.subject._id;
                    return title;
                });
                self.responseObj['#title'] =lodash.uniqBy(titles, '_id');
                self.titleId = titles._id;
            });

            return this;
        }
    });

    return CreateView;
});