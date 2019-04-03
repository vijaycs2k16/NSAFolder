define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/selectView/selectView',
    'text!templates/VLeadsReports/list/ListTemplate.html',
    'models/vTransactionsModel',
    'dataService',
    'async',
    'helpers',
    'Lodash',
    'populate',
    'moment',
    'common',
    'export'
], function ($, _, listViewBase, SelectView, listTemplate, CurrentModel, dataService, async, helpers, lodash, populate, moment, common, Export) {
    'use strict';

    var ListView = listViewBase.extend({
        listTemplate     : listTemplate,
        CurrentModel     : CurrentModel,
        contentType      : 'VLeadsReports',
        changedModels    : {},
        responseObj      : {},

        initialize: function (options) {
            $(document).off('click');

            this.render(null);
        },

        events: {
          'click .searchBtn': 'renderData',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click td.editable, .current-selected'             : 'showNewSelect'
        },

        /*showNewSelect: function (e) {

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
            var centerId = $thisEl.find('#studentCenter').attr('data-id');
            var courseId = $thisEl.find('#studentCourse').attr('data-id');
            if (holder.attr('id') === 'studentCenter') {
                this.selectCenter(centerId);
            }
            if (holder.attr('id') === 'studentCourse') {
                this.selectBatch(centerId, courseId);
            }
        },

        selectCenter: function (id) {
            var self = this;
            this.$el.find('#studentCourse').text('Select');
            this.$el.find('#studentBatch').text('Select');
            if (id !== '') {
                dataService.getData('/fcourse/center', {centerId: id}, function (courses) {
                    courses = _.map(courses.data, function (course) {
                        course.name = course.course.courseName;
                        course._id = course.course._id;

                        return course;
                    });
                    self.courses = courses
                    self.responseObj['#studentCourse'] = courses;
                    self.responseObj['#studentBatch'] = [];
                });
            } else {
                self.responseObj['#studentCourse'] = [];
                self.responseObj['#studentBatch'] = [];
            }

        },
        selectBatch: function (centerId, courseId) {
            var self = this;
            this.$el.find('#studentBatch').text('Select');
            if (centerId !== '' && courseId !=='') {
                dataService.getData('/vbatch/center/course', {centerId: centerId, courseId: courseId}, function (batches) {
                    batches = _.map(batches.data, function (batch) {
                        batch.name = batch.batchName;

                        return batch;
                    });
                    self.batches = batches
                    self.responseObj['#studentBatch'] = batches;
                });
            } else {
                self.responseObj['#studentBatch'] = [];
            }

        },*/
        changeDateRange: function (dateArray) {
            var itemsNumber = $('#itemsNumber').text();
            var searchObject;

            if (!this.filter) {
                this.filter = {};
            }

            this.filter.date = {
                value: dateArray
            };

            searchObject = {
                page  : 1,
                count  : 10000,
                filter: this.filter
            };

            console.log(this.collection)
            this.render(searchObject);

            //this.changeLocationHash(1, itemsNumber, this.filter);

            App.filtersObject.filter = this.filter;

            //custom.cacheToApp('journalEntry.filter', this.filter);
        },

        render: function (ele) {
            var $currentEl;
            var itemView;
            var self = this;
            var template;
            $currentEl = this.$el;
            $('.ui-dialog ').remove();
            if(ele != null) {
            } else {
                ele = {}
            }
            dataService.getData('leads/data/report', ele, function (result) {
                    $currentEl.html(_.template(listTemplate, {
                        collection      : result,
                        _           : _,
                        lodash      : lodash,
                }));

            })

            setTimeout(function () {
                common.datatableInit('leads-report');
                Export.tableExports('leads-report');
            },1000)


        }

    });

    return ListView;
});
