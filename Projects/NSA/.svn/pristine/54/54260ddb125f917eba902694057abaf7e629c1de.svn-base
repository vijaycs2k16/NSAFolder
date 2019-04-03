define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/selectView/selectView',
    'text!templates/VELeaveReports/list/ListTemplate.html',
    'models/vTransactionsModel',
    'dataService',
    'async',
    'helpers',
    'Lodash',
    'populate',
    'moment',
    'common'
], function ($, _, listViewBase, SelectView, listTemplate, CurrentModel, dataService, async, helpers, lodash, populate, moment, common) {
    'use strict';

    var ListView = listViewBase.extend({
        listTemplate     : listTemplate,
        CurrentModel     : CurrentModel,
        contentType      : 'VSLeaveReports',
        changedModels    : {},
        responseObj      : {},

        initialize: function (options) {
            $(document).off('click');

            this.render();
        },

        events: {
          'click .searchBtn': 'renderData',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click td.editable, .current-selected'             : 'showNewSelect'
        },

        showNewSelect: function (e) {

            var $target = $(e.target);

            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            if ($target.hasClass('current-selected')) {

                this.selectView = new SelectView({
                    e          : e,
                    responseObj: this.responseObj,
                    number     : 12
                });
                $target.append(this.selectView.render().el);

            } else {

                this.selectView = new SelectView({
                    e          : e,
                    responseObj: this.responseObj
                });

                $target.append(this.selectView.render().el);
                // $target.find('input').show();

            }

            return false;
        },

        chooseOption: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var $td = $target.closest('td');
            var parentUl = $target.parent();
            var $element = $target.closest('a') || parentUl.closest('a');
            var id = $element.attr('id') || parentUl.attr('id');
            var valueId = $target.attr('id');
            var managersIds = this.responseObj['#boardOfEdu'];

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

        },

        render: function () {
            var $currentEl;
            var itemView;
            var self = this;
            var template;

            $('.ui-dialog ').remove();

            $('#top-bar-deleteBtn').hide();

            $currentEl = this.$el;
            var yearData =  [2017];
            var years = [{name: 2017, _id: 2017}];
            var yearToday = moment().year();
            while (yearData.indexOf(yearToday) === -1) {
                years.push({name: yearData[yearData.length - 1] + 1, _id: yearData[yearData.length - 1] + 1});
                yearData.push(yearData[yearData.length - 1] + 1)
            }

            this.years = years;

            $currentEl.html('');
            dataService.getData('/franchise', {}, function (centers) {
                centers = _.map(centers.data, function (center) {
                    center.name = center.centerName;

                    return center;
                });
                self.centers = centers;
                self.responseObj['#studentCenter'] = centers;
            });
            self.responseObj['#studentYear'] = years;

            dataService.getData('employees/leave/reports', {}, function (result) {
                    $currentEl.html(_.template(listTemplate, {
                        data: '',
                        collection      : result,
                        _           : _,
                        lodash      : lodash,
                        yearToday   : yearToday
                }));
                common.datatableInit('report')
            })


        },
        renderData: function () {
            var $currentEl;
            var itemView;
            var self = this;
            var template;

            $('.ui-dialog ').remove();

            $('#top-bar-deleteBtn').hide();

            $currentEl = this.$el;
            var yearToday = moment().year();

            var centerId = $('#studentCenter').attr('data-id');
            var cYear = $('#studentYear').attr('data-id');
            var center = lodash.filter(this.centers, {'_id': centerId})
            var year = lodash.filter(this.years, {'_id': +cYear})
            var data = {center: center.length > 0 ? center[0]: {}, year: year.length > 0 ? year[0] : {}};
            dataService.getData('employees/leave/reports', {centerId: centerId, year: cYear}, function (result) {
                $currentEl.html(_.template(listTemplate, {
                    data        : data,
                    collection      : result,
                    _           : _,
                    lodash      : lodash,
                    yearToday   : yearToday
                }));
                common.datatableInit('report')

            })


        }

    });

    return ListView;
});
