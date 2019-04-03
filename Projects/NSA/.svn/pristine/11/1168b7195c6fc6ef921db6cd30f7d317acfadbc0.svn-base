define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/selectView/selectView',
    'text!templates/VSLeaveReports/list/ListTemplate.html',
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
                if(App.currentUser.profile._id === 1522230115000) {
                    self.selectCenter(centers[0]._id);
                } else {
                    self.responseObj['#studentCenter'] = centers;
                }
            });
            self.responseObj['#studentYear'] = years;

            dataService.getData('vStudents/leave/report', {}, function (result) {
                    $currentEl.html(_.template(listTemplate, {
                        data        : '',
                        collection  : result,
                        _           : _,
                        lodash      : lodash,
                        yearToday   : yearToday,
                        center      : self.centers
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
            var courseId = $('#studentCourse').attr('data-id');
            var batchId = $('#studentBatch').attr('data-id');
            var cYear = $('#studentYear').attr('data-id');
            var center = lodash.filter(this.centers, {'_id': centerId})
            var course = lodash.filter(this.courses, {'_id': courseId})
            var batch = lodash.filter(this.batches, {'_id': batchId})
            var batchI = $('#studentBatch').text();
            var courseI=$('#studentCourse').text();
            var year = lodash.filter(this.years, {'_id': +cYear})
            if(courseI=='Select')
            {
                return App.render({
                    type:'notify',
                    message:'Course Cannot be empty'
                })
            }
            if(batchI == 'Select'){
                return App.render({
                    type: 'notify',
                    message:'Batch cannot be empty'
                })
            }
            var data = {center: center.length > 0 ? center[0]: {}, course: course.length > 0 ? course[0]: {}, batch: batch.length > 0 ? batch[0]: {}, year: year.length > 0 ? year[0] : {}};
            dataService.getData('vStudents/leave/report', {centerId: centerId, courseId: courseId, batchId: batchId, year: cYear},
                function (result) {
                    $currentEl.html(_.template(listTemplate, {
                        data: data,
                        collection: result,
                        _: _,
                        lodash: lodash,
                        yearToday: yearToday
                    }));
                    common.datatableInit('report')

            })


        }

    });

    return ListView;
});
