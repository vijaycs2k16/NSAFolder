define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'models/VQuestionBank',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/FeedBack/list/ListHeader.html',
    'text!templates/stages.html',
    'views/FeedBack/CreateView',
    'views/FeedBack/list/ListItemView',
    'collections/FeedBack/filterCollection',
    'common',
    'dataService',
    'helpers',
    'vconstants'
], function (Backbone, $, _, listViewBase, OrderModel, paginationTemplate, listTemplate, stages, createView, ListItemView, contentCollection, common, dataService, helpers, CONSTANTS) {
    'use strict';
    var OrdersListView = listViewBase.extend({
        CreateView       : createView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'FeedBack',
        hasPagination    : true,

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.filter = options.filter || {};
            this.filter.forSales = {
                key  : 'forSales',
                type : 'boolean',
                value: ['true']
            };
            this.formUrl = 'erp/' + this.contentType + '/tform/';
            this.forSales = true;
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;

            listViewBase.prototype.initialize.call(this, options);

            this.contentCollection = contentCollection;
        },

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
                return false;
            }
            $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));
            return false;

        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var page = this.collection.currentPage;
            var countPerPage = this.collection.pageSize;
            var url = this.formUrl + id + '/p=' + page + '/c=' + countPerPage;

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            if ($(e.target).closest('tfoot').length) {
                return;
            }

            console.info('url',url);
            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});
        },

        hideNewSelect: function () {
            $('.newSelectList').remove();
        },

        render: function () {
            var self;
            var $currentEl;
            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.html(_.template(listTemplate));
            $currentEl.append(new ListItemView({
                collection : this.collection,

            }).render());

        }
    });
    return OrdersListView;
});