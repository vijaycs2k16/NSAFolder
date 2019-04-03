define([
    'Backbone',
    'jQuery',
    'Underscore',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VBatchesManagement/batchDetails/batchSchedule/CreateTemplate.html',
    'text!templates/VBatchesManagement/batchDetails/batchSchedule/BatchItems.html',
    'text!templates/VBatchesManagement/batchDetails/batchSchedule/BatchItem.html',
    'models/VBatchScheduleModel',
    'populate',
    'moment',
    'vconstants',
    'helpers/keyValidator',
    'dataService',
    'helpers',
    'libs/timepicki',
], function (Backbone, $, _, lodash, Parent, template, BatchItems, BatchItem, Model, populate, moment, CONSTANTS, keyValidator, dataService, helpers, BatchesScheduleCollection, timepicki) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(template),
        contentType: 'shippingMethods',

        initialize: function (options) {
            options = options || {};

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
        },

        events: {
            'keypress #price'        : 'keypressHandler',
            'click .addProductItem a': 'getProducts',
            'click .removeJob'       : 'deleteRow',
            'change #classDate'      : 'loadData',
        },

        loadData: function(e) {
            var self = this;
            var center = $('#center').attr('data-id');
            var classDate = $('#classDate').val();

            if(lodash.isEmpty(center)){
                $('#classDate').val('');
                return App.render({
                    type: 'error',
                    message: 'Please Choose Center'
                });
            }

            if(!lodash.isEmpty(classDate) && !lodash.isEmpty(center)){
                self.loadBatches(center);
                self.loadEmployee(center);
                self.loadSubject();
                dataService.getData('/vbatchSchedule/date', {center: center, classDate: classDate}, function (data) {
                    self.dataObj = data.data;
                    self.$el.find('#productItemsHolder').html(_.template(BatchItems, { model: {}, data: data.data, _: lodash, moment: moment }));
                    self.getProducts({ data: data.data });
                    /*if(!lodash.isEmpty(data.data)){
                        self.$el.find('#productList').prepend(_.template(BatchItem, { model: {}, data: data.data, _: lodash, moment: moment }));
                        self.$el.find('#timepickerOne').wickedpicker({
                            showSeconds: true,
                            secondsInterval: 1,
                            minutesInterval: 1
                        });

                        self.$el.find('#timepickerTwo').wickedpicker({
                            showSeconds: true,
                            secondsInterval: 1,
                            minutesInterval: 1
                        });
                    }*/
                });
            }

        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');
            var jobId = tr.find('#productsDd').attr('data-id');
            var product = _.findWhere(this.responseObj['#productsDd'], {_id: jobId});
            if (product) {
                product.selectedElement = false;
            }

            e.stopPropagation();
            e.preventDefault();

            tr.remove();
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

                    this.$el.find('#timepickerOne' + i).timepicki({
                        now            : time,
                        showSeconds    : true, //Whether or not to show seconds,
                        secondsInterval: 1, //Change interval for seconds, defaults to 1,
                        minutesInterval: 1
                    });
                    this.$el.find('#timepickerTwo' +  i).timepicki({
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

        chooseOption: function (e) {
            var target = $(e.target);
            var $target = $(e.target);
            var $thisEl = this.$el;
            var id = target.attr('id');
            e.preventDefault();
            $('.newSelectList').hide();
            var batchId = target.closest('.current-selected').attr('id')
            target.closest('.current-selected').text(target.text()).attr('data-id', target.attr('id'));

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
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
            if(batchId == 'batch') {
                $thisEl.find('#subject').text('Select');
                $thisEl.find('#subject').attr('data-id', '');
                $thisEl.find('#topics').text('Select');
                $thisEl.find('#topics').attr('data-id', '');
                $thisEl.find('#faculty').text('Select');
                $thisEl.find('#faculty').attr('data-id', '');

            }
            if(batchId == 'subject') {
                $thisEl.find('#topics').text('Select');
                $thisEl.find('#topics').attr('data-id', '');
                $thisEl.find('#faculty').text('Select');
                $thisEl.find('#faculty').attr('data-id', '');

            }
            if(batchId == 'topics') {
                $thisEl.find('#faculty').text('Select');
                $thisEl.find('#faculty').attr('data-id', '');

            }
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

        /*selectCourse: function (id) {
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
        },*/

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
                var sDate = $.trim(thisEl.find('#timepickerOne').val());
                var eDate = $.trim(thisEl.find('#timepickerTwo').val());

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

                if(!sDate){
                    return App.render({
                        type: 'error',
                        message: 'Please Select Start Time'
                    });
                }

                if(!eDate){
                    return App.render({
                        type: 'error',
                        message: 'Please Select End Time'
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
                    self.collection.add(model);
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash + '?schedule=schedule', {trigger: true, replace: true});
                    return App.render({
                        type: 'notify',
                        message:CONSTANTS.RESPONSES.CREATE_SUCCESS
                    });
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

        loadBatches: function(id){
            var self = this;
            dataService.getData('/vbatch/', {a: 'BATCH', count: 10000, center: id}, function (batches) {
                batches = _.map(batches.data, function (batch) {
                    if(!lodash.isEmpty(batch) && !lodash.isEmpty(batch.course) ) {
                        batch._id = batch._id + '-' + batch.course._id;
                        batch.name = batch.batchName + ' - ' + batch.course.courseName;
                    }
                    return batch;
                });
                self.responseObj['#batch'] = batches;
            });
        },

        loadSubject: function(){
            var self = this;
            dataService.getData('/vsubject/', {category: 'SUBJECT'} , function (subjects) {
                subjects = _.map(subjects.data, function (subject) {
                    if(!lodash.isEmpty(subject)) {
                        subject.name = subject.subjectName;
                    }
                    return subject;
                });
                self.responseObj['#subject'] = subjects;
            });
        },

        render: function () {
            var self = this;
            var formString;

            formString = this.template({
                model: this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });

            this.$el = $(formString).dialog({
                autoOpen: true,
                dialogClass: 'edit-dialog',
                title: 'Create Shipping Method',
                width: '950px',
                buttons: [{
                    text: 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text: 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });
            //populate.get('#batch', '/vbatch/', {category: 'BATCH'}, 'batchName', '-', this, true);
            // populate.get('#subject', '/vsubject/', {category: 'SUBJECT'}, 'subjectName', this, true);
            populate.get('#center', '/franchise/', {category: 'CENTER', count: 10000}, 'centerName', this, true,{});
            // populate.get('#subject', '/vsubject/', {category: 'SUBJECT',  count: 10000}, 'subjectName', this, true);
            //populate.get('#employees', '/employees/getForDD', {category: 'EMPLOYEES'}, 'name', this, true);
            //populate.get2name('#employees', '/employees/getForDD', {}, this);
            //populate.get('#topic', '/vtopic/', {category: 'TOPIC'}, 'topics', this, true);

            /*dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;
                    return employee;
                });
                self.responseObj['#faculty'] = employees;
            });*/


            /*dataService.getData('/vbatch/', {a: 'BATCH', count: 10000}, function (batches) {
                batches = _.map(batches.data, function (batch) {
                    if(!lodash.isEmpty(batch)) {
                        batch.name = batch.batchName + ' - ' + batch.course.courseName;
                    }
                    return batch;
                });
                self.responseObj['#batch'] = batches;
            });*/

            this.$el.find('#classDate').datepicker({
                changeMonth: true,
                changeYear: true
            });

            this.delegateEvents(this.events);

            // this.$el.find('#productItemsHolder').html(_.template(BatchItems));
            return this;
        }
    });

    return EditView;
});
