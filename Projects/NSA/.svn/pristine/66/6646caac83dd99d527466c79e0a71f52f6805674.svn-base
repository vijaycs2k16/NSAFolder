define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/BundleReturns/topBarTemplate.html',
    'vconstants'
], function (_, BaseView, TopBarTemplate, CONSTANTS) {
    'use strict';

    var topBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.BUNDLERETURNS,
        contentHeader: 'Bundle Returns',
        template     : _.template(TopBarTemplate)
    });

    return topBarView;
});
