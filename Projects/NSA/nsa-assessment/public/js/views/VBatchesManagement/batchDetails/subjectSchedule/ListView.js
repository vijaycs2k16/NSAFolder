    define([
        'jQuery',
        'Underscore',
        'views/listViewBase',
        'views/selectView/selectView',
        'text!templates/VBatchesManagement/batchDetails/subjectSchedule/ListTemplate.html',
        'models/vTransactionsModel',
        'dataService',
        'async',
        'helpers',
        'Lodash',
        'populate',
        'moment',
        'common',
        'vconstants',
        'helpers/ga',
        'constants/googleAnalytics'
    ], function ($, _, listViewBase, SelectView, listTemplate, CurrentModel, dataService, async, helpers, lodash, populate, moment, common, CONSTANTS, ga, GA) {
        'use strict';
        var monthObj;

        var ListView = listViewBase.extend({
            template  : _.template(listTemplate),
            listTemplate     : listTemplate,
            CurrentModel     : CurrentModel,
            contentType      : 'VSLeaveReports',
            changedModels    : {},
            responseObj      : {},
            el        : '#subjectTab',

            initialize: function (options) {
                $(document).off('click');
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.schedule = options.schedule;

                this.collection.bind('add change', this.render, this);

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

                var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
                holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

                var centerId = $thisEl.find('#center1').attr('data-id');
            },

            render: function () {
                var $currentEl = this.$el;
                var self = this;
                var $thisEl = this.$el;
                $currentEl.html('');
                var centerId = $thisEl.find('#center1').attr('data-id');
                var subjectId = $thisEl.find('#subject_SC').attr('data-id');
                var result = [] ;
                var months = [{name: 'January', _id: 1},{name: 'February', _id: 2},{name: 'March', _id: 3},{name: 'April', _id: 4},{name: 'May', _id: 5},{name: 'June', _id: 6},
                    {name: 'July', _id: 7},{name: 'August', _id: 8},{name: 'September', _id: 9},{name: 'October', _id: 10},{name: 'November', _id: 11},{name: 'December', _id: 12}];

                $('.ui-dialog ').remove();
                $('#top-bar-deleteBtn').hide();

                dataService.getData('/franchise/', {}, function (centers) {
                    centers = _.map(centers.data, function (center) {
                        center.name = center.centerName;
                        return center;
                    });
                    self.centers = centers;
                    self.responseObj['#center1'] = centers;
                });

                dataService.getData('/vsubject/', {category: 'SUBJECT'} , function (subjects) {
                    subjects = _.map(subjects.data, function (subject) {
                        if(!lodash.isEmpty(subject)) {
                            subject.name = subject.subjectName;
                        }
                        return subject;
                    });
                    self.subjects = subjects;
                    self.responseObj['#subject_SC'] = subjects;
                });

                self.responseObj['#month'] = months;

                dataService.getData('/permission/tabs', {module : CONSTANTS.MID.VBatchesManagement, moduleId: CONSTANTS.MID.SubjectSchedule}, function (data) {
                    self.permissionObj = data.data;
                    var className =  (data.data.tab) ? 'active' : '';
                    $('#subjectschedule').addClass(className);
                    $('#subjectTab').addClass(className)

                    if(data.data.read) {
                        $('#subjectschedule').removeClass('hide')
                        $('#subjectTab').removeClass('hide')
                    } else {
                        $('#subjectschedule').addClass('hide')
                        $('#subjectTab').addClass('hide')
                    }
                    if(centerId !== '' && subjectId !== '' ) {
                        dataService.getData('/Vacation/leave', {centerId: centerId, subjectId: subjectId}, function (resultObj) {
                            result = resultObj;
                        });
                    }
                    $currentEl.html(_.template(listTemplate, {
                        data            : '',
                        collection      : result,
                        lodash          : lodash,
                        dataPermission  : data,
                        monthObj        : monthObj,
                        moment          : moment
                    }));
                    setTimeout(function () {
                        common.datatableInitWithoutExport('example2')
                    }, 500)
                });

            },

            renderData: function () {
                var $currentEl = this.$el;
                var self = this;
                var $thisEl = this.$el;
                var centerId = $thisEl.find('#center1').attr('data-id');
                var subjectId = $thisEl.find('#subject_SC').attr('data-id');
                var center = lodash.filter(this.centers, {'_id': centerId});
                var subject = lodash.filter(this.subjects, {'_id': subjectId});
                var dataObj = {center: center.length > 0 ? center[0]: {}, subject: subject.length > 0 ? subject[0] : {}};
                var facultymonth = $thisEl.find('#month').attr('data-id');
                monthObj = facultymonth;
                var year = 2018;

                $('.ui-dialog ').remove();
                $('#top-bar-deleteBtn').hide();

                if (!center.length) {
                    return App.render({
                        type: 'error',
                        message: "Select the center from the list."
                    });
                }

                if (!subject.length) {
                    return App.render({
                        type: 'error',
                        message: "Select the subject from the list."
                    });
                }
            
                dataService.getData('/permission/tabs', {module : CONSTANTS.MID.VFRANCHISEDETAILS, moduleId: CONSTANTS.MID.VFRANCHISECOURSES}, function (data) {
                    dataService.getData('/vsubject/month', {center: centerId, subject: subjectId, month: facultymonth, year: year}, function (result) {
                        $currentEl.html(_.template(listTemplate, {
                            data            : dataObj,
                            collection      : result.data,
                            lodash          : lodash,
                            dataPermission  : data,
                            monthObj        : monthObj,
                            moment          : moment
                        }));
                        setTimeout(function () {
                            common.datatableInitWithoutExport('example2')
                        }, 500)

                    });
                });

            }

        });

        return ListView;
    });
