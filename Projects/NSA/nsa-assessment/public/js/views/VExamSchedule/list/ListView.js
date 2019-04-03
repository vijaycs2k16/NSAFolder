define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'models/VExamScheduleModel',
    'text!templates/VExamSchedule/list/ListHeader.html',
    'text!templates/VExamSchedule/list/StudentListHeader.html',
    'views/VExamSchedule/CreateView',
    'views/VExamSchedule/list/ListItemView',
    'views/VExamSchedule/EditView',
    'collections/VExamSchedule/filterCollection',
    'dataService',
    'helpers/ga',
    'constants/googleAnalytics',
    'moment',
    'Backbone',
    'vconstants',
    'text!templates/VExamSchedule/list/searchTemplate.html',
    'custom'
], function ($, _, ListViewBase, Model, listHeader,StudentListHeader, CreateView, ListItemView, EditView, ContentCollection, dataService, ga, GA, moment, Backbone, constant, searchTemplate, custom) {
    'use strict';

    var UsersListView = ListViewBase.extend({
        CreateView       : CreateView,
        ListItemView     : ListItemView,
        contentCollection: ContentCollection,
        contentType      : 'VExamSchedule', // needs in view.prototype.changeLocationHash

        events: {
            'click .goToEdit' : 'gotoEditDialog',
            'click .goToRemove' : 'deleteItem',
            'click .writeExam'  : 'startExam',
            'click .goToView'   : 'goToView',
            'click .viewStudExam' : 'viewResult',
            'click .goToStudentResult'  : 'goToStudentResult',
            'keypress #selectInput'  : 'keydownHandler',
        },

        initialize: function (options) {
            this.intialRender = false;
            var self = this;
            this.collection = options.collection;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;
            this.sort = options.sort;
            options.mode = true
            var timeOut = App.currentUser.profile._id === 1519104899000 ? 60 * 1000 : 60 * 10000;
                setInterval(function () {
                    var path = window.location.href.split('#');
                    if(path[1].indexOf('erp/VExamSchedule/list') != -1) {
                        self.intialRender = true;
                        self.collection = new ContentCollection({
                            viewType: 'list',
                            page: 1,
                            reset: true,
                            count: 50,
                            contentType: self.contentType,
                            showMore: false
                        });
                        self.collection.bind('reset', self.render, self);
                    }
                }, timeOut);
            ListViewBase.prototype.initialize.call(self, options);

        },
        startExam: function(e){
            var id = $(e.target).closest('tr').data('id');
            if(id) {
                var url = '/#erp/examForm/' + id;
                window.open(url, "popupwindow", "width=1000,height=800,left=200,top=5,scrollbars,toolbar=0,resizable", '_blank');
                window.focus();
                return false;
            }
        },

        keydownHandler: function(e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
                e.preventDefault();
                return false;
            }
        },

        changeDateRange: function (dateArray) {
            var itemsNumber = $('#itemsNumber').text();
            var searchObject;

            if (!this.filter) {
                this.filter = {};
            }

            this.filter.date = {
                value: dateArray
            };

            searchObject = {
                mode: true,
                page  : 1,
                count  : 10000,
                filter: this.filter
            };

            this.collection.getFirstPage(searchObject);

            this.changeLocationHash(1, itemsNumber, this.filter);

            App.filtersObject.filter = this.filter;

        },

        deleteItem: function (e) {
            var self = this;
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);
            var answer = confirm('Really DELETE items ?!');

            e.preventDefault();

            if (answer === true && model) {

                model.destroy({
                    success: function (model) {
                        self.$el.find('tr[data-id="' + model.id + '"]').remove();
                    },

                    error: function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        }
                    }
                });
            }
        },

        goToStudentResult: function(e){
            var id = $(e.target).closest('tr').data('log');
            var model = this.collection.get(id);
            if(id) {
                var url = '/erp/VExamStudentsResult/' + id;
                Backbone.history.navigate(url, {trigger: true});
            }
        },
        gotoEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = this.collection.getElement(id);
            if (!model) {
                return;
            }

            App.ownContentType = true;

            return new EditView({model: model});
        },

        viewResult: function (e) {
            var id = $(e.target).closest('tr').data('id');
            if(id) {
                var url = '/erp/VExamResult/' + id;
                Backbone.history.navigate(url, {trigger: true});
            }
        },

        render: function () {
            var $currentEl;
            var self = this;
            $('.ui-dialog ').remove();

            $currentEl = this.$el;
            var userType = App.currentUser.profile.profileName;
            $currentEl.html(_.template(searchTemplate));
            dataService.getData('/permission', {moduleId: constant.MID.VExamSchedule}, function (data) {
                if(userType == 'Student'){
                    $currentEl.append(_.template(StudentListHeader,{
                        data : data.data
                    }));
                } else {
                    $currentEl.append(_.template(listHeader, {
                        data : data.data
                    }));
                }
                $('#timeRecivingDataFromServer').remove()
                if(self.intialRender) {
                    $currentEl.append(new ListItemView({
                        collection : self.collection,
                        page       : self.page,
                        itemsNumber: self.collection.namberToShow
                    }).render());


                }
                  self.renderPagination($currentEl, self);
            })

        }
    });

    return UsersListView;
});