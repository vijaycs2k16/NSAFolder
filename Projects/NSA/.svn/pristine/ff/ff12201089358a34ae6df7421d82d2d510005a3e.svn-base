define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VCenter/TopBarTemplate.html',
    'custom',
    'common',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.VFRANCHISE,
        contentHeader: 'Franchise',
        template     : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }

            this.render(options);
        }
    });

    return TopBarView;
});
