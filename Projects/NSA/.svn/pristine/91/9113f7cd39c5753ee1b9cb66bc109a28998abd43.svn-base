/**
 * Created by Sathya on 12/28/2018.
 */

define([
    'Backbone',
    'Underscore',
    'collections/parent',
    'models/testConfigurationModel',
    'common',
    'vconstants'
], function (Backbone, _, Parent, configModel, common, CONSTANTS) {
    'use strict';

    var configurationCollection = Parent.extend({
        model   : configModel,
        url     : CONSTANTS.URLS.TESTCONFIGURATION,
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

    return configurationCollection;
});
