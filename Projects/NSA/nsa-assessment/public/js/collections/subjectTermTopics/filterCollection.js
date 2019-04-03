define([
    'Backbone',
    'Underscore',
    'collections/parent',
    'models/subjectTermTopicsModel',
    'common',
    'vconstants',
], function (Backbone, _, Parent, TermTopicsModel, common, CONSTANTS) {
    'use strict';

    var termTopicsCollection = Parent.extend({
        model   : TermTopicsModel,
        url     : CONSTANTS.URLS.SUBJECTTERMTOPICS,
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

            options.reset = true
            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });

    return termTopicsCollection;
});
