define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VCourses/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.VCOURSES,
        contentHeader: 'course',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
