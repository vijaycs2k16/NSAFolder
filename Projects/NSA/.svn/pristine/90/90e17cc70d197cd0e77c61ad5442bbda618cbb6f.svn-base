define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/schoolOnboard/list/ListHeader.html',
    'views/schoolOnboard/CreateView',
    'views/schoolOnboard/list/ListItemView',
    'models/schoolOnboardModel',
    'collections/schoolOnboard/filterCollection',
    'vconstants',
    'views/schoolOnboard/EditView',
    'helpers/ga',
    'constants/googleAnalytics',
    'dataService',
    'common'
], function (Backbone, $, _, ListViewBase, listTemplate, CreateView, ListItemView, CurrentModel, contentCollection, CONSTANTS, EditView, ga, GA, dataService, common) {
    'use strict';

    var onBoardListView = ListViewBase.extend({
        CreateView   : CreateView,
        viewType     : 'list',
        responseObj  : {},
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : CONSTANTS.SCHOOLONBOARD,
        changedModels: {},

        initialize: function (options) {
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
            var id = $(e.target).closest('td').attr('data-id');
            var model = this.collection.getElement(id);
            var answer = confirm('Are you sure to delete this entry?');

            var obj = {
                school_id: model.attributes.school_id,
                tenant_id: model.attributes.tenant_id
            };

            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel: GA.EVENT_LABEL.DELETE_SHIPPING_METHOD
            });

            if (answer === true && model) {
                dataService.deleteData('schoolSubjectTitle/', obj, function (err, result) {
                    if (!err) {
                        self.$el.find('tr[data-id="' + id + '"]').remove();
                        self.render();

                        return App.render({
                            type: 'notify',
                            message: "School deleted successfully"
                        });
                    }
                    else{
                        if (err.status === 401) {
                            App.render({
                                type   : 'error',
                                message: err.responseText
                            });
                        }
                    }
                })
            }
        },

        render: function () {
            var $currentEl = this.$el;
            $('.ui-dialog ').remove();

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.numberToShow
            }).render());

            setTimeout(function () {
                common.datatableInitWithoutExport('exampleJS')
            }, 100);

            return this;
        }
    });

    return onBoardListView;
});