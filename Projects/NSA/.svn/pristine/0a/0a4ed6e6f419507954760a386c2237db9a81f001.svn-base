define([
    'Underscore',
    'views/topBarViewBase',
    'views/Filter/dateFilter',
    'text!templates/VExamSchedule/TopBarTemplate.html',
    'vconstants',
    'custom',
    'dataService',
    'common',
    'moment'
], function (_, BaseView, DateFilterView, TopBarTemplate, CONSTANTS, Custom, dataService, common, moment) {
    'use strict';
    var TopBarView = BaseView.extend({
        contentType     : 'VExamSchedule',
        contentHeader   : 'Exam Schedule',
        collectionLength: 0,
        template        : _.template(TopBarTemplate),


        render: function () {
            var self = this;
            var viewType = Custom.getCurrentVT();
            var filter = Custom.retriveFromCash('ExamSchedule.filter');
            var dateRange;
            var startDate;
            var endDate;

            if (!this.collection) {
                dateRange = filter && filter.date ? filter.date.value : [];

                startDate = new Date(dateRange[0]);
                endDate = new Date(dateRange[1]);
            } else {
                startDate = this.collection.startDate;
                endDate = this.collection.endDate;
            }

            startDate = moment(startDate).format('D MMM, YYYY');
            endDate = moment(endDate).format('D MMM, YYYY');

            $('title').text(this.contentHeader || this.contentType);
            dataService.getData('/permission', {moduleId: CONSTANTS.MID[this.contentType]}, function (data) {
                self.$el.css('display', '')
                self.$el.html(self.template({
                    viewType            : viewType,
                    data                : data.data
                }))

                self.dateFilterView = new DateFilterView({
                    contentType: 'ExamSchedule',
                    el         : self.$el.find('#dateFilter')
                });

                self.dateFilterView.on('dateChecked', function () {
                    self.trigger('changeDateRange', self.dateFilterView.dateArray);
                });

                Custom.cacheToApp('ExamSchedule.filter', self.filter);

                self.dateFilterView.checkElement('custom', [startDate, endDate]);

            });

            return this;
        },



        toggleDateRange: function (e) {
            var ul = e ? $(e.target).closest('ul') : this.$el.find('.dateFilter');

            if (!ul.hasClass('frameDetail')) {
                ul.find('.frameDetail').toggleClass('hidden');
            } else {
                ul.toggleClass('hidden');
            }
        },
    });

    return TopBarView;
});
