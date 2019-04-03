define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/VDashboardReports/TopBarTemplate.html',
    'vconstants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.VCOURSES,
        contentHeader: 'course',
        template   : _.template(ContentTopBarTemplate),

        events: {
            'click #top-bar-exportToCsvBtn' : 'exportToCsv',
            'click #top-bar-exportToXlsxBtn': 'exportToXlsx'
        },

        exportToCsv: function (event) {
            event.preventDefault();
            this.trigger('exportToCsv');
        },

        exportToXlsx: function (event) {
            event.preventDefault();
            this.trigger('exportToXlsx');
        },

    });

    return TopBarView;
});
