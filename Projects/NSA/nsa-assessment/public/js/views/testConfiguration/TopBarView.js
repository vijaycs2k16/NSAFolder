define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/testConfiguration/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ConfigTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.TESTCONFIGURATION,
        contentHeader: 'Test Configuration',
        template   : _.template(ConfigTopBarTemplate)
    });

    return TopBarView;
});
