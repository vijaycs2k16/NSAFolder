define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VBatches/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.VBATCHES,
        contentHeader: 'batches',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
