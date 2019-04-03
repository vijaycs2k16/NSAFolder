define([
    'Underscore',
    'views/topBarViewBase',
    'views/Filter/dateFilter',
    'text!templates/VAssessment/questionBank/TopBarTemplate.html',
    'vconstants',
    'custom',
    'dataService',
    'common',
    'moment'
], function (_, BaseView, DateFilterView, ContentTopBarTemplate, CONSTANTS, Custom, dataService, common, moment) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.VQUESTIONBANK,
        contentHeader:  'QuestionBank',
        template     : _.template(ContentTopBarTemplate),
        events       : {
            'click #magentoExport' : 'magentoOrdersExport',
            'click #magentoImport' : 'magentoOrdersImport'
        },

        magentoOrdersExport: function (event) {
            event.preventDefault();
            this.trigger('exportToMagento');
        },

        magentoOrdersImport: function (event) {
            event.preventDefault();
            this.trigger('importFromMagento');
        },

        render: function () {
            var self = this;
            var viewType = Custom.getCurrentVT();
            var filter = Custom.retriveFromCash('QuestionBank.filter');
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
                    data                : data.data,
                    contentType         : self.contentType
                }))

                self.dateFilterView = new DateFilterView({
                    contentType: 'QuestionBank',
                    el         : self.$el.find('#dateFilter')
                });

                self.dateFilterView.on('dateChecked', function () {
                    self.trigger('changeDateRange', self.dateFilterView.dateArray);
                });

                Custom.cacheToApp('QuestionBank.filter', self.filter);

                self.dateFilterView.checkElement('custom', [startDate, endDate]);

            });

            return this;
        },

        changeDateRange: function (e) {
            var dateFilter = e ? $(e.target).closest('ul.dateFilter') : this.$el.find('ul.dateFilter');
            var startDate = dateFilter.find('#startDate');
            var endDate = dateFilter.find('#endDate');
            var startTime = dateFilter.find('#startTime');
            var endTime = dateFilter.find('#endTime');

            startDate = startDate.val();
            endDate = endDate.val();

            startTime.text(startDate);
            endTime.text(endDate);

            this.trigger('changeDateRange');
            this.toggleDateRange();
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
