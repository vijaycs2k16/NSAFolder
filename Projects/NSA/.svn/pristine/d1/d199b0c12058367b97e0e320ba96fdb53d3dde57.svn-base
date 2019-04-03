define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VExamSchedule/ExamPaperTopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: 'ExamPaper',
        contentHeader: 'ExamPaper',
        template   : _.template(ContentTopBarTemplate),
    });

    return TopBarView;
});
