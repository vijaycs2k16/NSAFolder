define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VUserManagement/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.VUSERMANAGEMENT,
        contentHeader: 'course',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});