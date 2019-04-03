define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/EnrollMent/Registration/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.ENROLLMENT,
        contentHeader: 'EnrollMent',
        template   : _.template(ContentTopBarTemplate),
        events: {
            'click .closeBtn' : 'returnToList'
        },

    });

    return TopBarView;
});
