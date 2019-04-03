define([
    'Backbone',
    'jQuery',
    'Underscore',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VBatchesManagement/batchDetails/batchSchedule/EditTemplate.html',
    'views/selectView/selectView',
    'populate',
    'moment',
    'vconstants',
    'dataService',
    'helpers/keyValidator',
    'helpers',
    'models/VBatchScheduleModel',
    'text!templates/VBatchesManagement/batchDetails/batchSchedule/BatchItem.html',
    'libs/timepicki',
], function (Backbone, $, _, lodash, Parent, EditTemplate, SelectView, populate, moment, CONSTANTS, dataService, keyValidator, helpers, Model, BatchItem, timepicki) {

    'use strict';

    var EditView = Parent.extend({
        template: _.template(EditTemplate),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            this.eventsChannel = App.eventsChannel || _.extend({}, Backbone.Events);

            if(options.center){
                this.center = options.center;
            } else {
                this.center = {};
            }

            if(options.permission){
                this.permission = options.permission;
            } else {
                this.permission = {};
            }

            this.currentModel = new Model();

            if (options.model) {
                this.data = options.model;
            }

            this.collection = options.collection;

            this.responseObj = {};

            this.render(options);
        },

        events: {
            'keypress #price': 'keypressHandler',
            'click .removeJob': 'deleteRow',
            'click .addProductItem a': 'getProducts',
        },

        getProducts: function (obj) {
            if(obj.data){
                for(var i = 0; i < obj.data.length; i++){
                    var classDate = obj.data[i].classDate;
                    var classDate1 = moment(classDate).format("D MMM, YYYY");
                    var classStartTime = obj.data[i].classStartTime;
                    var classEndTime = obj.data[i].classEndTime;
                    var time = moment(classStartTime).format('H:mm:ss');
                    var time1 = moment(classEndTime).format('H:mm:ss');

                    this.$el.find('.timepickerOne').timepicki({
                        now            : time,
                        showSeconds    : true, //Whether or not to show seconds,
                        secondsInterval: 1, //Change interval for seconds, defaults to 1,
                        minutesInterval: 1
                    });
                    this.$el.find('.timepickerTwo').timepicki({
                        now            : time1,
                        showSeconds    : true, //Whether or not to show seconds,
                        secondsInterval: 1, //Change interval for seconds, defaults to 1,
                        minutesInterval: 1
                    });
                }
            } else {
                this.$el.find('#productList').prepend(_.template(BatchItem, {model: {}}));
                this.$el.find('.timepickerOne').timepicki({
                    showSeconds    : true, //Whether or not to show seconds,
                    secondsInterval: 1, //Change interval for seconds, defaults to 1,
                    minutesInterval: 1
                });
                this.$el.find('.timepickerTwo').timepicki({
                    showSeconds    : true, //Whether or not to show seconds,
                    secondsInterval: 1, //Change interval for seconds, defaults to 1,
                    minutesInterval: 1
                });
            }
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');
            var empId=tr.attr('id');
            var self = this;
            if(empId){
                if(confirm('Are you sure want to delete ? ')){
                    dataService.deleteData('/vbatchSchedule/' + empId, {}, function (err, res) {
                        if (err) {
                            self.errorNotification(err);
                        } else {
                            return App.render({
                                type: 'notify',
                                message: 'Deleted Successfully'
                            })
                        }

                    });

                } else {

                    return false;
                }
            }
            else {

                tr.remove();
            }

            var jobId = tr.find('#productsDd').attr('data-id');
            var product = _.findWhere(this.responseObj['#productsDd'], {_id: jobId});
            if (product) {
                product.selectedElement = false;
            }

            e.stopPropagation();
            e.preventDefault();

            tr.remove();
        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var centerName = thisEl.find('#center').attr('data-id');
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var targetEl;
            var i;
            var body = [];
            var ids = [];
            var cDate = $('#classDate').val();

            if(!centerName){
                return App.render({
                    type: 'error',
                    message: 'Please Select Center'
                })
            }

            if(!cDate){
                return App.render({
                    type: 'error',
                    message: 'Please Choose Date'
                })
            }

            if(selectedLength === 0){
                return App.render({
                    type: 'error',
                    message: 'Please add one batch at least'
                })
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                var _id = targetEl.attr('id');
                if(_id) {
                    ids.push(_id)
                }

                var batch = targetEl.find('#batch').attr('data-id');
                var index = batch.indexOf("-");
                var id = batch.substr(0, index);
                var text = batch.substr(index + 1);
                batch = id;
                var course = text;
                var subject = targetEl.find('#subject').attr('data-id');
                var faculty = targetEl.find('#faculty').attr('data-id');
                var classDate1 = $.trim(this.$el.find('#classDate').val());
                var classDate = moment(classDate1).format("D MMM, YYYY")
                var topics = targetEl.find('#topics').attr('data-id');
                var classStartTime = this.getTimeForDate(moment(targetEl.find('.timepickerOne').val(), ["h:mm A"]).format("HH:mm").split(':'));
                var classEndTime = this.getTimeForDate(moment(targetEl.find('.timepickerTwo').val(), ["h:mm A"]).format("HH:mm").split(':'));
                var start = moment.utc(classStartTime, "HH:mm");
                var end = moment.utc(classEndTime, "HH:mm");
                var d = moment.duration(end.diff(start));
                var classhrs = moment.utc(+d).format('H:mm');

                if(!batch){
                    return App.render({
                        type: 'error',
                        message: 'Please Select Batch'
                    });
                }

                if(!subject){
                    return App.render({
                        type: 'error',
                        message: 'Please Select Subject'
                    });
                }

                if(!topics){
                    return App.render({
                        type: 'error',
                        message: 'Please Select Topic'
                    });
                }

                if(!faculty){
                    return App.render({
                        type: 'error',
                        message: 'Please Select Faculty'
                    });
                }

                body.push({
                    id: self.dataObj ? !_.isUndefined(self.dataObj[i]) ? self.dataObj[i]._id : '' : '',
                    center: centerName,
                    faculty: faculty,
                    classDate: classDate,
                    batch: batch,
                    course: course,
                    subject: subject,
                    topics: topics,
                    classStartTime: classStartTime,
                    classEndTime: classEndTime,
                    classhrs: classhrs
                });
            }
            this.currentModel.save({ids: ids, data: body}, {
                wait: true,
                success: function (model) {
                    self.hideDialog();
                    if (self.eventsChannel) {
                        return self.eventsChannel.trigger('savePriceList', model);
                    }
                    self.collection.add(model);
                   
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        getTimeForDate: function(date){
            var hours = date[0] ? date[0] : '';
            var minutes = date[1] ? date[1] : '';

            return moment(new Date()).hours(hours).minutes(minutes).toDate();
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var $thisEl = this.$el;
            var $target = $(e.target);

            $('.newSelectList').hide();
            var batchId = target.closest('.current-selected').attr('id')
            $target.closest('.current-selected').attr('title', target.text().trim()).text($target.text()).attr('data-id', $target.attr('id'));

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            $(e.target).find('.current-selected').attr('title', $(e.target).text().trim());
            var centerId = $thisEl.find('#center').attr('data-id');
            var centerid = $thisEl.find('#center').attr('id');
            var subjectId = $thisEl.find('#subject').attr('data-id');
            var subjectid = $thisEl.find('#subject').attr('id');
            var courseId = $thisEl.find('#course').attr('data-id');
            var courseid = $thisEl.find('#course').attr('id');
            var topicId = $thisEl.find('#topics').attr('data-id');
            var topicid = $thisEl.find('#topics').attr('id');
            var bId = $thisEl.find('#batch').attr('id');
            var bIdVal = $thisEl.find('#batch').attr('data-id');

            /*if (centerid === 'center') {
             this.selectEmployee(centerId);
             }*/

            /*if (courseid === 'course') {
             this.selectCourse(subjectId);
             }*/
            if(!_.isUndefined(bIdVal)){
                var index = bIdVal.indexOf("-");
                var id = bIdVal.substr(0, index);
                var text = bIdVal.substr(index + 1);
                if (bIdVal !== '' && subjectId !== '') {
                    this.selectTopic(subjectId,text);
                }
            }
            return false;

        },

        loadEmployee: function (id) {
            var self = this;
            if (id !== '') {
                dataService.getData('/employees/getForDD', {isEmployee: true, department: '5ad4869ea3acc70f28c50620'}, function (employees) {
                    employees = lodash.filter(employees.data, function (v) {
                        if(!_.isUndefined(v.center)){
                            return v.center._id === id;
                        }
                    });
                    employees = _.map(employees, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;
                        return employee;
                    });
                    self.responseObj['#faculty'] = employees;
                });
            } else {
                self.responseObj['#faculty'] = [];
            }
        },

        /*selectEmployee: function (id) {
            var self = this;
            if (id !== '') {
                dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                    employees = _.map(employees.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;
                        return employee;
                    });
                    self.responseObj['#faculty'] = employees;
                });
            } else {
                self.responseObj['#faculty'] = [];
            }
        },*/

        selectCourse: function (id) {
            var self = this;
            if (id !== '') {
                dataService.getData('/vtopic/subject/',  {subject: id}, function (courses) {
                    courses = _.map(courses.data, function (course) {
                        course.name = course.course.courseName
                        course._id = course.course._id;
                        return course;
                    });
                    self.responseObj['#course'] = courses;
                });
            } else {
                self.responseObj['#course'] = [];
            }
            return false;
        },

        selectTopic: function (sid, cid) {
            var self = this;
            if (sid !== '' && cid !== '') {
                dataService.getData('/vtopic/subject/course', {subject: sid, course: cid}, function (topics) {
                    var topics =  lodash.flatMap(topics.data, ele => lodash(ele.topics).map(topic => ({name : topic.name, _id : topic._id})).value());
                    self.responseObj['#topics'] = topics;
                });
            } else {
                self.responseObj['#topics'] = [];
            }
            return false;
        },


        render: function () {
            var self = this;
            var classDate, classDate1, classStartTime, classEndTime, time, time1;
            var isEdit = self.permission.update ? '' : 'hide';
            var formString = this.template({
                model           : this.data,
                center          : this.center,
                moment          : moment,
                currencySplitter: helpers.currencySplitter,
                permission      : this.permission
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Bank Account',
                width      : '950px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue ' + isEdit,
                    click: function () {
                        self.saveItem();
                        self.gaTrackingEditConfirm();
                    }
                }, {
                    text : 'Close',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });
            var center = $('#center').attr('data-id');

            this.loadEmployee(center);
            populate.get('#subject', '/vsubject/', {category: 'SUBJECT', count: 10000}, 'subjectName', this, true);
            populate.get('#center', '/franchise/', {category: 'CENTER', count: 10000}, 'centerName', this, true);
            //populate.get('#employees', '/employees/getForDD', {category: 'EMPLOYEES'}, 'name', this, true);
            //populate.get2name('#employees', '/employees/getForDD', {}, this);
            //populate.get('#topic', '/vtopic/', {category: 'TOPIC'}, 'topics', this, true);

            /* dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                 employees = _.map(employees.data, function (employee) {
                     employee.name = employee.name.first + ' ' + employee.name.last;
                     return employee;
                 });
                 self.responseObj['#faculty'] = employees;
             });*/

            dataService.getData('/vbatch/', {a: 'BATCH', count: 10000, center: center}, function (batches) {
                batches = _.map(batches.data, function (batch) {
                    if(!lodash.isEmpty(batch) && !lodash.isEmpty(batch.course) ){
                        batch._id = batch._id + '-' + batch.course._id;
                        batch.name = batch.batchName + ' - ' + batch.course.courseName;
                    }
                    return batch;
                });
                self.responseObj['#batch'] = batches;
            });

            this.$el.find('#classDate').datepicker({dateFormat: 'd M, yy', minDate: new Date()});
            for(var i = 0; i < this.data.length; i++){
                classDate = this.data[i].classDate;
                classDate1 = moment(classDate).format("D MMM, YYYY");
                classStartTime = this.data[i].classStartTime;
                classEndTime = this.data[i].classEndTime;
                time = moment(classStartTime).format('H:mm:ss');
                time1 = moment(classEndTime).format('H:mm:ss');

                this.$el.find('#timepickerOne' + i).timepicki({
                    now            : time,
                    showSeconds    : true, //Whether or not to show seconds,
                    secondsInterval: 1, //Change interval for seconds, defaults to 1,
                    minutesInterval: 1
                });
                this.$el.find('#timepickerTwo' + i).timepicki({
                    now            : time1,
                    showSeconds    : true, //Whether or not to show seconds,
                    secondsInterval: 1, //Change interval for seconds, defaults to 1,
                    minutesInterval: 1
                });
            }


            this.delegateEvents(this.events);



            return this;
        }
    });

    return EditView;
});
