define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/VPracticeExam/list/listHeader.html',
    'views/VPracticeExam/CreateView',
    'views/VPracticeExam/list/ListItemView',
    'models/VPracticeExamModel',
    'collections/VPracticeExam/filterCollection',
    'vconstants',
    'views/VPracticeExam/EditView'
], function (Backbone, $, _, ListViewBase, listTemplate, CreateView, ListItemView, CurrentModel, contentCollection, CONSTANTS, EditView) {
    'use strict';

    var bonusTypeListView = ListViewBase.extend({
        CreateView   : CreateView,
        viewType     : 'list',
        responseObj  : {},
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : CONSTANTS.VPRACTICEEXAM,
        changedModels: {},
        hasPagination: true,

        initialize: function (options) {
            $(document).off('click');

            this.CurrentModel = CurrentModel;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            ListViewBase.prototype.initialize.call(this, options);

            this.render();
        },

        events: {
            'click .goToEdit' : 'gotoEditDialog',
            'click .goToRemove' : 'deleteItem'
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

        render: function () {
            var self = this;
            var $currentEl = this.$el;

            $('.ui-dialog ').remove();

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.numberToShow
            }).render());

            return this;
        }
    });

    return bonusTypeListView;
});

