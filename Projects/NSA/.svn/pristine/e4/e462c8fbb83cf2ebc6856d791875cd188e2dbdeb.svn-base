define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VExam/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.VExamConfig,
        contentHeader: 'ExamConfiguration',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
