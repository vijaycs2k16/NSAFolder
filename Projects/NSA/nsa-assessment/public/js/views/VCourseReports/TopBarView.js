define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VCourseReports/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.VCOURSES,
        contentHeader: 'Aggregate Reports',
        template   : _.template(ContentTopBarTemplate),
    });

    return TopBarView;
});
