define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VLeave/TopBarTemplate.html',
    'custom',
    'common',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.VACATION,
        contentHeader: 'Leave',
        template     : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }
            this.render();
        }
    });

    return TopBarView;
});
