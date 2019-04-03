define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VExamSchedule/studentResults/TopBarTemplate.html'
], function (_, BaseView, TopBarTemplate) {
    'use strict';
    var TopBarView = BaseView.extend({
        contentType     : 'VExamSchedule',
        collectionLength: 0,
        template        : _.template(TopBarTemplate)
    });

    return TopBarView;
});
