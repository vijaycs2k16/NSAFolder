define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/FacultyLogs/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.FACULTYLOGS,
        contentHeader: 'FacultyLogs',
        template   : _.template(ContentTopBarTemplate),
    });

    return TopBarView;
});
