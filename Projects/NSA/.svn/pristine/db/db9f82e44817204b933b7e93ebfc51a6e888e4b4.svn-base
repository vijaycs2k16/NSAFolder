define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VNotifications/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.VNOTIFICATIONS,
        contentHeader: 'Notifications',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
