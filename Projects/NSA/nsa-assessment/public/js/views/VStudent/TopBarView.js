define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VStudent/TopBarTemplate.html'
], function (_, BaseView, ContentTopBarTemplate) {
    'use strict';
    var TopBarView = BaseView.extend({
        el            : '#top-bar',
        contentType   : 'VStudent',
        template      : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
