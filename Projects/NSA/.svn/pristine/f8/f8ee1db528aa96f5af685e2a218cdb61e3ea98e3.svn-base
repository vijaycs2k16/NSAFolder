define([
    'Backbone',
    'collections/parent',
    'models/vEmpNotificationsModel',
    'vconstants'
], function (Backbone, Parent, NotificationModel, CONSTANTS) {
    'use strict';

    var JournalCollection = Parent.extend({
        model   : NotificationModel,
        url     : CONSTANTS.URLS.VEMPNOTIFICATIONS,
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
            options.reset = true;
            options.count = 100000;
            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });
    return JournalCollection;
});
