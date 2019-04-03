define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/Attendance/index.html',
    'models/AttendanceModel',
    'views/Attendance/MonthView',
    'moment',
    'dataService',
    'views/selectView/selectView',
    'vconstants',
    'views/guideTours/guideNotificationView'
], function (Backbone, _, $, mainTemplate, AttendanceModel, MonthView, moment, dataService, SelectView, CONSTANTS, GuideNotify) {
    'use strict';

    var View = Backbone.View.extend({
        el: '#content-holder',

        template: _.template(mainTemplate),

        events: {
            'click .editable'                                  : 'showNewSelect',  // changed dropdown list
            'change #currentStatus'                            : 'changeStatus',
            'change #currentTime'                              : 'changeTime',
            'click .newSelectList li:not(.miniStylePagination)': 'changeEmployee',  // changed to click for selectView dd
            'click .employee'                                  : 'employee' ,
            // click                                             : 'removeInputs'
        },

        /*removeInputs: function () {

            if (this.selectView) {
                this.selectView.remove();
            }
        },*/

        initialize: function () {
            var self = this;
            var centers;
            var status;
            var years;

            this.currentEmployee = null;
            this.currentStatus = null;
            this.currentTime = null;
            this.currentCenter = null;


            this.model = new AttendanceModel();
            this.listenTo(this.model, 'change:currentEmployee', this.changeEmployee);
            dataService.getData(CONSTANTS.URLS.VFRANCHISE, {}, function (result) {
                var yearToday = moment().year();
                centers = result;
                centers = _.map(centers.data, function (center) {
                    center.name = center.centerName;
                    return center;
                });
                self.model.set({
                    center: centers
                });
                self.currentCenter = centers[0];
                status = self.model.get('status');
                years = self.model.get('years');

                self.currentStatus = status[0];
                self.currentTime = years[0];

                while (years.indexOf(yearToday) === -1) {
                    years.push(years[years.length - 1] + 1);
                }

                self.render();

                self.model.set({
                    currentEmployee: '',
                    currentStatus  : self.currentStatus,
                    currentTime    : self.currentTime,
                    years          : years
                });

            });
        },

        showNewSelect: function (e) {
            var modelsForNewSelect;
            var $target = $(e.target);

            e.stopPropagation();

            if (this.currentStatus === 'statusNotHired') {
                modelsForNewSelect = _.filter(this.model.get('employees'), function (element) {
                    return element.isEmployee === false;
                });
            } else if (this.currentStatus === 'statusHired') {
                modelsForNewSelect = _.filter(this.model.get('employees'), function (element) {
                    return element.isEmployee === true;
                });
            } else {
                modelsForNewSelect = this.model.get('employees');
            }

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new SelectView({
                e          : e,
                responseObj: {'#center': this.model.get('center'), '#employee' : this.model.get('employee') }
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        changeEmployee: function (e) {
            var startTime = new Date();
            var self = this;
            var labels;
            var month;
            var data;
            var keys;

            var target = $(e.target);
            var targetElement = target.closest('.editable').find('span');
            var tempClass = target.attr('class');
            var className = target.closest('.editable').attr('data-content');
            if(className == 'center') {
                this.centerId = target.attr('id');
                this.centerStatus = true;
                this.$el.find('.center').attr('data-id',this.centerId ? this.centerId : null);
                targetElement.text(target.text());
                $('.employee').click();
            } else {
                if (tempClass && tempClass === 'fired') {
                    target.closest('.editable').addClass('fired');
                } else {
                    target.closest('.editable').removeClass('fired');
                }
                self.currentEmployee = target.attr('id');
                if(this.centerId) {
                    self.currentCenter = target.attr('id');
                    targetElement.text(target.text());
                } else {
                    this.$el.find('.center').find('span').text(self.currentCenter ? self.currentCenter.centerName : 'Select');
                    this.$el.find('.center').attr('data-id', self.currentCenter ? self.currentCenter._id : null);
                    targetElement.text(target.text());
                }

                dataService.getData('/vacation/', {
                    year    : self.currentTime,
                    employee: self.currentEmployee
                }, function (result) {
                    labels = self.model.get('labelMonth');
                    month = new MonthView();

                    data = _.groupBy(result.data, 'year');
                    keys = Object.keys(data);

                    keys.forEach(function (key) {
                        data[key] = _.groupBy(data[key], 'month');
                    });

                    self.$el.append(month.render({
                        labels    : labels,
                        year      : self.currentTime,
                        attendance: data,
                        statistic : result.stat,
                        startTime : startTime
                    }));
                });
            }


        },

        changeTime: function () {
            var startTime = new Date();
            var self = this;
            var labels;
            var month;
            var data;
            var keys;

            self.currentTime = this.$el.find('#currentTime option:selected').text().trim();

            if (!self.currentTime) {
                self.currentTime = self.model.get('years')[0].id;
            }

            dataService.getData('/vacation/', {
                year    : self.currentTime,
                employee: self.currentEmployee
            }, function (result) {
                labels = self.model.get('labelMonth');
                month = new MonthView();

                data = _.groupBy(result.data, 'year');
                keys = Object.keys(data);

                keys.forEach(function (key) {
                    data[key] = _.groupBy(data[key], 'month');
                });

                self.$el.append(month.render({
                    labels    : labels,
                    year      : self.currentTime,
                    attendance: data,
                    statistic : result.stat,
                    startTime : startTime
                }));
            });
        },

        employee: function (e) {
            if(this.centerStatus) {
                this.selectEmployee(this.centerId, e);
            }

        },

        selectEmployee: function (id, e) {
            var self = this;
            if (id !== '') {
                dataService.getData(CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {centerId: id}, function (employees) {
                    employees = _.map(employees.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;
                        return employee;
                    });

                    self.model.set({
                        employees: employees
                    });
                    self.selectView = new SelectView({
                        e          : e,
                        responseObj: {'#employee': employees}
                    });

                    $(e.target).append(self.selectView.render().el);
                    self.courseStatus = false;
                    return false;
                });
            }

        },

        render: function () {
            var self = this;

            this.$el.html(this.template(self.model.toJSON()));

            this.rendered = true;

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }

            return this;
        }

    });

    return View;
});
