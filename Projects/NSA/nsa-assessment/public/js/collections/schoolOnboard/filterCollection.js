define([
    'Backbone',
    'Underscore',
    'collections/parent',
    'models/schoolOnboardModel',
    'common',
    'vconstants',
    'helpers/getDateHelper',
    'custom'
], function (Backbone, _, Parent, JobPositionsModel, common, CONSTANTS) {
    'use strict';

    var onBoardCollection = Parent.extend({
        model   : JobPositionsModel,
        url     : CONSTANTS.URLS.SCHOOLONBOARD,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var page;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options.filter = this.filter || {};
            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;
            this.startTime = new Date();
            options.reset = true;

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });

    return onBoardCollection;
});
