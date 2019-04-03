define([
    'Backbone',
    'Underscore',
    'collections/parent',
    'models/VExamStudentResultModel',
    'common',
    'vconstants'
], function (Backbone, _, Parent, ExamResultModel, common, CONSTANTS) {
    'use strict';

    var ExamResultCollection = Parent.extend({
        model   : ExamResultModel,
        url     : CONSTANTS.URLS.VEXAMSTUDENTRESULT,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var page;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }
            console.info('options',options.error);

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

    return ExamResultCollection;
});
