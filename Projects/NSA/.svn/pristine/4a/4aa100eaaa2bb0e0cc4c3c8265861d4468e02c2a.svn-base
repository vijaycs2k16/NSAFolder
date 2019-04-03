define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/VDashboardReports/list/ListTotal.html',
    'text!templates/VDashboardReports/list/ListTotal.html',
    'helpers'
], function (Backbone, _, $, listTemplate, invoiceTotal, helpers) {
    'use strict';
    var OrderListTotalView = Backbone.View.extend({
        el: '#listTotal',

        getTotal: function () {
            var result = {unTaxed: 0, total: 0, paid: 0, balance: 0, cellSpan: this.cellSpan};


            this.element.find('td.paid').each(function () {
                result.paid += parseFloat(helpers.spaceReplacer($(this).text()));
            });
            this.element.find('td.outstanding').each(function () {
                result.balance += parseFloat(helpers.spaceReplacer($(this).text()));
            });

            return result;
        },

        initialize: function (options) {
            this.element = options.element;
            this.cellSpan = options.cellSpan;
            this.invoiceTemplate = options.invoiceTemplate;
        },

        render: function () {
            var template = this.invoiceTemplate ? _.template(invoiceTotal) : _.template(listTemplate);

            if (this.$el.find('tr').length > 0) {
            } else {
                this.$el.append(template({total: this.getTotal()}));
            }
        }
    });

    return OrderListTotalView;
});
