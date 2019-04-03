define([
    'Underscore',
    'Backbone',
    'collections/parent',
    'models/VQuestionBank',
    'common',
    'vconstants',
    'helpers/getDateHelper',
    'custom'
], function (_, Backbone, ParentCollection, OrdersModel, common, CONSTANTS, DateHelper, Custom) {
    'use strict';

    var QuotationFilterCollection = ParentCollection.extend({

        model: OrdersModel,
        url  : 'vassessment/questions',

        initialize: function (options) {
            var page;
            var dateRange;

            function _errorHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            this.filter = options.filter || Custom.retriveFromCash('QuestionBank.filter');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisMonth');

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options.filter = this.filter || {};

            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            Custom.cacheToApp('QuestionBank.filter', options.filter);

            options = options || {};
            page = options.page;
            options.error = options.error || _errorHandler;
            this.contentType = options.contentType;

            this.startTime = new Date();

            if (options.url) {
                this.url = options.url;
            }

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        },

        parse: function (response) {
            var quotations = response.data;

            response.data = _.map(quotations, function (quotation) {
                quotation.orderDate = common.utcDateToLocaleDate(quotation.orderDate);
                if (quotation.expectedDate) {
                    quotation.expectedDate = common.utcDateToLocaleDate(quotation.expectedDate);
                }

                return quotation;
            });

            return ParentCollection.prototype.parse.call(this, response);
        }

    });

    return QuotationFilterCollection;

});
