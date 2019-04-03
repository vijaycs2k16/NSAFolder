define([
    'Backbone',
    'collections/parent',
    'models/bundleMoveModel',
    'vconstants'
], function (Backbone, Parent, bonusTypeModel, CONSTANTS) {
    'use strict';

    var bonusTypeCollection = Parent.extend({
        model   : bonusTypeModel,
        url     : CONSTANTS.URLS.BUNDLEMOVE,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var page;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.isReturn = false;
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
