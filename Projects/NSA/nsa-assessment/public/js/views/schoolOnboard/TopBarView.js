define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/schoolOnboard/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.SCHOOLONBOARD,
        contentHeader: 'NexApp School Onboard',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
