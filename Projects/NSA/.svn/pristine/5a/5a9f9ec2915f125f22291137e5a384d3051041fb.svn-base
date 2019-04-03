define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VPracticeExam/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.VPRACTICEEXAM,
        contentHeader: 'PracticeExam',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
