define([
    'Backbone',
    'collections/parent',
    'models/bundleReturnsModel',
    'constants'
], function (Backbone, Parent, BundleReturnsModel, CONSTANTS) {
    'use strict';

    var bonusTypeCollection = Parent.extend({
        model   : BundleReturnsModel,
        url     : CONSTANTS.URLS.BUNDLERETURNS,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var page;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.isReturn = true;
            options.error = options.error || _errHandler;
            page = options.page;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });

    return bonusTypeCollection;
});
