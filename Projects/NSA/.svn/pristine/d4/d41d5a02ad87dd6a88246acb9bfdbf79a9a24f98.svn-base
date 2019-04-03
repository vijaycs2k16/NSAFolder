define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/selectView/selectView',
    'text!templates/VDashboardReports/list/cancelEdit.html',
    'text!templates/VDashboardReports/list/ListHeader.html',
    'text!templates/VDashboardReports/list/ListTemplate.html',
    'views/VDashboardReports/list/ListItemView',
    'views/VDashboardReports/list/ListTotalView',
    'views/VDashboardReports/CreateView',
    'models/vTransactionsModel',
    'collections/VDashboardReports/filterCollection',
    'collections/VDashboardReports/editCollection',
    'dataService',
    'async',
    'helpers',
    'common'
], function ($, _, listViewBase, SelectView, cancelEdit, listHeaderTemplate, listTemplate, ListItemView, ListTotalView, CreateView, CurrentModel, contentCollection, EditCollection, dataService, async, helpers, common) {
    'use strict';

    var ListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        CurrentModel     : CurrentModel,
        contentCollection: contentCollection,
        contentType      : 'vtansactions',
        changedModels    : {},
        responseObj      : {},
        cancelEdit       : cancelEdit,

        initialize: function (options) {
            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.render();
        },

        recalcTotal: function () {
            var total = 0;
            var balance = 0;
            var paid = 0;

            _.each(this.collection.toJSON(), function (model) {
                if(model.studentFeeDetails) {
                    total += parseFloat(model.studentFeeDetails.paidAmount ? model.studentFeeDetails.paidAmount : 0);
                    balance += parseInt(model.studentFeeDetails.actualFeeAmount ? model.studentFeeDetails.paidAmount : 0) - parseInt(model.studentFeeDetails.paidAmount ? model.studentFeeDetails.paidAmount : 0);
                    paid += parseFloat(model.studentFeeDetails.paidAmount ? model.studentFeeDetails.paidAmount : 0);
                }

            });

            this.$el.find('#total').text(helpers.currencySplitter(total.toFixed(2)));
            this.$el.find('#balance').text(helpers.currencySplitter((balance).toFixed(2)));
            this.$el.find('#paid').text(helpers.currencySplitter((paid).toFixed(2)));
        },

        render: function () {
            var $currentEl;
            var itemView;
            var self = this;
            var template;

            $('.ui-dialog ').remove();

            $('#top-bar-deleteBtn').hide();

            $currentEl = this.$el;
            $currentEl.html(_.template(listTemplate, {
                collection      : this.collection.toJSON()
            }));
            common.datatableInit('report')

        }

    });

    return ListView;
});
