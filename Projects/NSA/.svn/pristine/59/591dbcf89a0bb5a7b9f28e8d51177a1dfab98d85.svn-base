define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/course/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.COURSE,
        contentHeader: 'course',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
