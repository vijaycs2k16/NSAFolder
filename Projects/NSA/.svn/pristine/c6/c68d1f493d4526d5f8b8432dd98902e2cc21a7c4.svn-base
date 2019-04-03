define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/DealTasks/list/ListHeader.html',
    'text!templates/stages.html',
    'views/DealTasks/CreateView',
    'views/DealTasks/list/ListItemView',
    'views/DealTasks/EditView',
    'models/DealTasksModel',
    'views/Projects/EditView',
    'models/ProjectsModel',
    'collections/DealTasks/filterCollection',
    'views/Filter/filterView',
    'common',
    'Lodash',
    'export'
], function ($, _, ListViewBase, paginationTemplate, listTemplate, stagesTamplate, CreateView, ListItemView, EditView, CurrentModel, ProjectEditView, ProjectModel, ContentCollection, FilterView, common, Lodash, Export) {
    var TasksListView = ListViewBase.extend({

        CreateView              : CreateView,
        listTemplate            : listTemplate,
        ListItemView            : ListItemView,
        contentCollection       : ContentCollection,
        filterView              : FilterView,
        hasPagination           : true,
        contentType             : 'DealTasks',

        events: {
            'click td:not(:has("input[type="checkbox"]"))': 'goToEditDialog',
            'click .stageSelect'                          : 'showNewSelect',
            'click .stageSelectType'                      : 'showNewSelectType',
            'click .newSelectList li'                     : 'chooseOption'
        },

        initialize: function (options) {
            $(document).off('click');
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.stages = [];
            this.sort = options.sort;
            this.filter = options.filter;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;
            this.contentCollection = ContentCollection;

            ListViewBase.prototype.initialize.call(this, options);
        },

        goToEditDialog: function (e) {
            var id;
            var model;

            e.preventDefault();

            id = $(e.target).closest('tr').data('id');
            model = new CurrentModel({validate: false});

            model.urlRoot = '/dealTasks/';
            model.fetch({
                data   : {id: id, viewType: 'form'},
                success: function (newModel) {
                    new EditView({model: newModel});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        pushStages: function (stages) {
            this.stages = stages;
        },

        showNewSelectType: function (e) {
            var targetElement;

            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
            } else {
                targetElement = $(e.target).parents('td');
                targetElement.find('.newSelectList').show();
            }

            return false;
        },

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
            } else {
                var currentRow = $(e.target).parents('tr').attr('data-id'), finalArr = [];
                for(var i=0; i < this.collection.models.length; i++) {
                    if(this.collection.models[i].attributes._id === currentRow){
                        var resObj = this.collection.models[i].attributes;
                        break;
                    }
                }
                if(resObj && !_.isUndefined(resObj.taskType) && resObj.taskType.stages.length > -1){
                    for(var j=0; j < resObj.taskType.stages.length; j++) {
                        for(var k=0; k < this.stages.length; k++){
                            if(this.stages[k]._id === resObj.taskType.stages[j]) {
                                finalArr.push(this.stages[k]);
                                finalArr = Lodash.flatten(finalArr);
                            }
                        }
                    }
                } else {
                    finalArr = [];
                }
                $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: finalArr}));
            }

            return false;
        },

        chooseOption: function (e) {
            var that = this;
            var target = $(e.target);
            var targetParrentElement = target.parents('td');
            var selectType = targetParrentElement.attr('id').split('_')[0];
            var model;
            var id;
            var modelJSON;
            var type;

            if (selectType === 'stages') {
                if ($(target).attr('data-status') === 'done') {
                    id = targetParrentElement.attr('id').replace('stages_', '');
                    model = this.collection.get(id);
                    modelJSON = model.toJSON();
                    model.urlRoot = '/DealTasks';
                    model.save(
                        {
                            workflow     : target.attr('id'),
                            sequence     : -1,
                            sequenceStart: modelJSON.sequence,
                            workflowStart: modelJSON.workflow ? modelJSON.workflow._id : null
                        },
                        {
                            headers: {
                                mid: 39
                            },

                            patch   : true,
                            validate: false,
                            success : function () {
                                that.showFilteredPage({}, that);
                            }
                        });
                } else {
                    id = targetParrentElement.attr('id').replace('stages_', '');
                    model = this.collection.get(id);
                    modelJSON = model.toJSON();
                    model.urlRoot = '/DealTasks';
                    model.save(
                        {
                            workflow     : target.attr('id'),
                            sequence     : -1,
                            sequenceStart: -1,
                            workflowStart: modelJSON.workflow ? modelJSON.workflow._id : null
                        },
                        {
                            headers: {
                                mid: 39
                            },

                            patch   : true,
                            validate: false,
                            success : function () {
                                that.showFilteredPage({}, that);
                            }
                        });
                }
            } else if (selectType === 'type') {
                id = targetParrentElement.attr('id').replace('type_', '');
                model = this.collection.get(id);
                model.urlRoot = '/DealTasks';
                type = target.attr('id');
                model.save(
                    {
                        type: type
                    },
                    {
                        headers: {
                            mid: 39
                        },

                        patch   : true,
                        validate: false,
                        success : function (newModel) {
                            that.showFilteredPage({}, that); // When add filter by Type, then uncoment this code
                        }
                    });
            }
            this.hideNewSelect();
            return false;
        },

        hideNewSelect: function () {
            $('.newSelectList').hide();
        },

        render: function () {
            var self;
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            itemView = new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            });
            itemView.bind('incomingStages', this.pushStages, this);
            $currentEl.append(itemView.render());

            common.populateWorkflowsList('CRM Tasks', '.filter-check-list', '#workflowNamesDd', '/Workflows', null, function (stages) {
                var stage = (self.filter) ? self.filter.workflow || [] : [];

                itemView.trigger('incomingStages', stages);
            });

            setTimeout(function () {
                Export.tableExports('tasks');
                $(".tableexport-caption").addClass('exportBtnStyle');
            },1000)
        }

    });

    return TasksListView;
});