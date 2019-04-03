define([
    'Backbone',
    'collections/parent',
    'models/VFranchiseCourseModel',
    'vconstants'
], function (Backbone, Parent, Model, CONSTANTS) {
    'use strict';

    var JournalCollection = Parent.extend({
        model   : Model,
        url     : CONSTANTS.URLS.VFRANCHISECOURSE,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var page;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;
            options.count = 100000;

            options.reset = true;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });
    return JournalCollection;
});

