define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/BundleMove/topBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var topBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.BUNDLEMOVE,
        contentHeader: 'Bundle Move',
        template     : _.template(ContentTopBarTemplate)
    });

    return topBarView;
});
