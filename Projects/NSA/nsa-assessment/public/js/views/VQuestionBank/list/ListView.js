define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'models/VQuestionBank',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/VAssessment/questionBank/list/ListHeader.html',
    'text!templates/stages.html',
    'views/VQuestionBank/CreateView',
    'views/VQuestionBank/list/ListItemView',
    'views/VQuestionBank/list/ListTotalView',
    'views/VQuestionBank/EditView',
    'collections/VQuestionBank/filterCollection',
    'common',
    'dataService',
    'helpers',
    'vconstants'
], function (Backbone, $, _, listViewBase, OrderModel, paginationTemplate, listTemplate, stages, createView, ListItemView, ListTotalView, EditView, contentCollection, common, dataService, helpers, CONSTANTS) {
    'use strict';
    var OrdersListView = listViewBase.extend({
        CreateView       : createView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'VQuestionBank',
        hasPagination    : true,

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.filter = options.filter || {};
            this.formUrl = 'erp/' + this.contentType + '/tform/';
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;

            listViewBase.prototype.initialize.call(this, options);

            this.contentCollection = contentCollection;
        },

        /*recalcTotal: function () {
         var total = 0;
         var balance = 0;
         var paid = 0;

         _.each(this.collection.toJSON(), function (model) {
         total += parseFloat(model.paymentInfo.total);
         balance += parseFloat(model.paymentBalance);
         paid += parseFloat(model.paymentsPaid);
         });

         this.$el.find('#total').text(helpers.currencySplitter(total.toFixed(2)));
         this.$el.find('#balance').text(helpers.currencySplitter((balance / 100).toFixed(2)));
         this.$el.find('#paid').text(helpers.currencySplitter((paid / 100).toFixed(2)));
         },*/

        /* chooseOption: function (e) {
         var self = this;
         var target$ = $(e.target);
         var targetElement = target$.parents('td');
         var id = targetElement.attr('id');
         var model = this.collection.get(id);

         model.save({
         workflow: target$.attr('id')
         }, {
         headers: {
         mid: 55
         },

         patch   : true,
         validate: false,
         success : function () {
         self.showFilteredPage(self.filter, self);
         }
         });

         this.hideNewSelect();
         return false;
         },*/



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

            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});
        },

        hideNewSelect: function () {
            $('.newSelectList').remove();
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
                page  : 1,
                filter: this.filter
            };

            this.collection.getFirstPage(searchObject);

            this.changeLocationHash(1, itemsNumber, this.filter);

            App.filtersObject.filter = this.filter;

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
             // page       : this.page,
               // itemsNumber: this.collection.namberToShow
            }).render()); // added two parameters page and items number
            //$currentEl.html(new ListTotalView({element: this.$el.find('#listTable'), cellSpan: 7}).render());

            //this.recalcTotal();

            // this.renderPagination($currentEl, this);
            // this.renderFilter();

            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

            dataService.getData(CONSTANTS.URLS.WORKFLOWS_FETCH, {
                wId         : 'Purchase Order',
                source      : 'purchase',
                targetSource: 'order'
            }, function (stages) {
                self.stages = stages;
            });
        }

        /* goToEditDialog: function (e) {
         var tr = $(e.target).closest('tr');
         var id = tr.data('id');
         var url = 'erp/' + this.contentType + '/form/' + id;
         var notEditable = tr.hasClass('notEditable');
         var model = new QuotationModel({validate: false});
         var onlyView = false;

         e.preventDefault();

         if (notEditable) {
         onlyView = true;
         }


         /!*model.urlRoot = '/orders/';
         model.fetch({
         data: {
         id      : id,
         viewType: 'form'
         },

         success: function (model) {
         return new EditView({model: model, onlyView: onlyView});
         },

         error: function () {
         App.render({
         type   : 'error',
         message: 'Please refresh browser'
         });
         }
         });*!/

         Backbone.history.navigate(url, {trigger: true});
         }*/

    });
    return OrdersListView;
});