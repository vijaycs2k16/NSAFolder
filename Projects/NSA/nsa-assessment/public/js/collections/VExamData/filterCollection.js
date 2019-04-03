define([
    'Backbone',
    'Underscore',
    'collections/parent',
    'models/VExamScheduleModel',
    'common',
    'vconstants'
], function (Backbone, _, Parent, JobPositionsModel, common, CONSTANTS) {
    'use strict';

    var ExamScheduleCollection = Parent.extend({
        model   : JobPositionsModel,
        url     : CONSTANTS.URLS.VEXAMSCHEDULE + '/schedule',
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

            options.reset = true

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });

    return ExamScheduleCollection;
});
