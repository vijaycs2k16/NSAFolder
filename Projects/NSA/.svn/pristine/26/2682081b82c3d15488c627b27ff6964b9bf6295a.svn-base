define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/VAttendance/index.html',
    'models/AttendanceModel',
    'views/Attendance/MonthView',
    'moment',
    'dataService',
    'views/selectView/selectView',
    'vconstants',
    'views/guideTours/guideNotificationView',
    'populate',
    'Lodash'
], function (Backbone, _, $, mainTemplate, AttendanceModel, MonthView, moment, dataService, SelectView, CONSTANTS, GuideNotify, populate, Lodash) {
    'use strict';

    var View = Backbone.View.extend({
        el: '#content-holder',

        template: _.template(mainTemplate),

        events: {
            'click .editable'                                  : 'showNewSelect',  // changed dropdown list
            'change #currentStatus'                            : 'changeStatus',
            'change #currentTime'                              : 'changeTime',
            'click .newSelectList li:not(.miniStylePagination)': 'changeEmployee',  // changed to click for selectView dd
            'click .course'                                    : 'course' ,
            'click .batch'                                     : 'batch' ,
            'click .student'                                   : 'student' ,
            click                                              : 'removeInputs'

        },

        removeInputs: function () {

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        initialize: function () {
            var self = this;
            var employees;
            var centers;
            var status;
            var years;
            var relatedEmployeeId;
            var employeeArray;
            var relatedEmployee;

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

                if(App.currentUser.profile._id === 1522230115000) {
                    centers = Lodash.filter(centers, function(v){ return v._id === App.currentUser.centerId });
                }
                self.model.set({
                    center: centers
                });
                self.currentCenter = centers[0];
                status = self.model.get('status');
                years = self.model.get('years');

                relatedEmployeeId = App.currentUser.relatedEmployee ? App.currentUser.relatedEmployee._id : null;

                if (relatedEmployeeId) {
                    /* employeeArray = self.model.get('employees');
                     relatedEmployee = _.find(employeeArray, function (el) {
                     return el._id === relatedEmployeeId;
                     });
                     self.currentEmployee = relatedEmployee;*/
                } else {
                    //self.currentEmployee = employees[0];
                }

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

            /*dataService.getData(CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, function (result) {
                var yearToday = moment().year();

                employees = result;
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;
                    return employee;
                });

                self.model.set({
                    employees: employees,
                });

                status = self.model.get('status');
                years = self.model.get('years');

                relatedEmployeeId = App.currentUser.relatedEmployee ? App.currentUser.relatedEmployee._id : null;

                if (relatedEmployeeId) {
                   /!* employeeArray = self.model.get('employees');
                    relatedEmployee = _.find(employeeArray, function (el) {
                        return el._id === relatedEmployeeId;
                    });
                    self.currentEmployee = relatedEmployee;*!/
                } else {
                    //self.currentEmployee = employees[0];
                }

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

            });*/
        },


        course : function (e) {
            if(this.centerStatus) {
                this.selectCenter(this.centerId, e)
            }

        },

        batch : function (e) {
            if(this.courseStatus) {
                this.selectBatch(this.courseId, e)
            }
        },

        student: function (e) {
            if(this.batchStatus) {
                this.selectStudent(this.batchId, e);
            }

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
                responseObj: {'#center': this.model.get('center'), '#course' : this.model.get('course'), '#batch' : this.model.get('batch'),'#employee' : this.model.get('employee') }
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
                $('.course').click();
            } else if (className == 'course') {
                this.courseStatus = true;
                this.courseId = target.attr('id');
                $('.batch').click();
            } else if (className == 'batch') {
                this.batchId = target.attr('id');
                this.batchStatus = true;
                $('.student').click();
            } else if (className == 'employee') {
                this.studentId = target.attr('id');
                this.studentStatus = true;
            }

            if (tempClass && tempClass === 'fired') {
                target.closest('.editable').addClass('fired');
            } else {
                target.closest('.editable').removeClass('fired');
            }
            if(this.centerId) {
                self.currentCenter = target.attr('id');
                targetElement.text(target.text());
            } else {
                this.$el.find('.center').find('span').text(self.currentCenter ? self.currentCenter.centerName : 'Select');
                this.$el.find('.center').attr('data-id', self.currentCenter ? self.currentCenter._id : null);
                targetElement.text(target.text());
            }



            dataService.getData('/vsleave/year', {
                year    : self.currentTime,
                centerId: this.centerId,
                courseId: this.courseId,
                batchId: this.batchId,
                student: this.studentId

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
                    present : result.present,
                    startTime : startTime
                }));
            });
        },

        /* changeStatus: function () {
         var self = this;
         self.currentStatus = this.$el.find('#currentStatus option:selected').attr('id');

         dataService.getData(CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, function () {
         // ToDo Hired and Not Hired
         });
         },*/

        selectCenter: function (id, e) {
            var self = this;
            if (id !== '') {
                dataService.getData('/fcourse/center', {centerId: id}, function (courses) {
                    courses = _.map(courses.data, function (course) {
                        course.name = course.course.courseName;
                        course._id = course.course._id;

                        return course;
                    });
                    self.model.set({
                        course : courses
                    })
                    self.selectView = new SelectView({
                        e          : e,
                        responseObj: {'#course': courses}
                    });

                    $(e.target).append(self.selectView.render().el);
                    self.centerStatus = false;
                    return false;
                });
            }

        },

        selectBatch: function (id, e) {
            var self = this;
            if (id !== '') {
                dataService.getData('/vbatch/center/course', {centerId: this.centerId, courseId: id}, function (batches) {
                    batches = _.map(batches.data, function (batch) {
                        batch.name = batch.batchName;

                        return batch;
                    });
                    self.model.set({
                        batch : batches
                    })
                    self.selectView = new SelectView({
                        e          : e,
                        responseObj: {'#batch': batches}
                    });

                    $(e.target).append(self.selectView.render().el);
                    self.courseStatus = false;
                    return false;
                });
            }

        },

        selectStudent: function (id, e) {
            var self = this;
            this.batchStatus = false;
            if (id !== '') {
                dataService.getData('/vstudents/batch/students', {centerId: this.centerId, courseId: this.courseId, batchId: id}, function (students) {
                    students = _.map(students.data, function (student) {
                        student.name = student.studentName;

                        return student;
                    });
                    self.model.set({
                        employee : students
                    })
                    self.selectView = new SelectView({
                        e          : e,
                        responseObj: {'#employee': students}
                    });

                    $(e.target).append(self.selectView.render().el);
                    self.courseStatus = false;
                    return false;
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

            if(App.currentUser.student){
                var student = App.currentUser.student;
                var center = student.center,
                    course = student.course,
                    batch = student.batch,
                    id = student._id;
            }


            self.currentTime = this.$el.find('#currentTime option:selected').text().trim();

            if (!self.currentTime) {
                self.currentTime = self.model.get('years')[0].id;
            }

            dataService.getData('/vsleave/year', {
                year    : self.currentTime,
                employee: self.currentEmployee,
                centerId: center ? center : this.centerId,
                courseId: course ? course : this.courseId,
                batchId : batch ? batch : this.batchId,
                student : id ? id : this.studentId

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
                    present: result.present,
                    startTime : startTime
                }));
            });
        },

        render: function () {
            var self = this;

            this.$el.html(this.template(self.model.toJSON()));

            this.rendered = true;

            setTimeout(function(){
                if(App.currentUser.profile._id === 1522230115000) {
                    self.centerId = self.currentCenter._id;
                    self.centerStatus = true;
                    self.$el.find('.center').find('span').text('Select');
                    self.$el.find('.center').attr('data-id', null);
                }
            },200)

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
