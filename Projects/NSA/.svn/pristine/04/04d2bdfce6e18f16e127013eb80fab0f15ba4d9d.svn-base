define([
    'Backbone',
    'Underscore',
    'collections/parent',
    'models/VExamScheduleModel',
    'common',
    'vconstants',
    'helpers/getDateHelper',
    'custom',
], function (Backbone, _, Parent, JobPositionsModel, common, CONSTANTS, DateHelper, Custom) {
    'use strict';

    var ExamScheduleCollection = Parent.extend({
        model   : JobPositionsModel,
        url     : CONSTANTS.URLS.VEXAMSCHEDULE,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var page;
            var dateRange;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            this.filter = options.filter || Custom.retriveFromCash('ExamSchedule.filter');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisMonth');
            options.mode = true;
            console.log("options.mode = true;",options)

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options.filter = this.filter || {};


            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            Custom.cacheToApp('ExamSchedule.filter', options.filter);


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
