define([
    'Backbone',
    'jQuery',
    'Underscore',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/FacultyLogs/list/ViewTemplate.html',
    'views/selectView/selectView',
    'populate',
    'moment',
    'vconstants',
    'dataService',
    'helpers/keyValidator',
    'helpers',
    'models/FacultyLogsModel',
    'libs/timepicki',
    'common'
], function (Backbone, $, _, lodash, Parent, ViewTemplate, SelectView, populate, moment, CONSTANTS, dataService, keyValidator, helpers, Model, timepicki, common) {

    'use strict';
    var monthObj;

    var EditView = Parent.extend({
        template: _.template(ViewTemplate),

        initialize: function (options) {

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
            'click .details-control'   : 'accordianSlide',
            'click .newSelectList li:not(.miniStylePagination)': 'loadMonthData'
        },

        loadMonthData: function(e) {
            var self = this;
            var thisEl = this.$el;
            var center = $('#center').attr('data-id');
            var facultyId = thisEl.find('#facultyName').attr('data-id');
            var facultymonth = thisEl.find('#month').attr('data-id');
            var year = 2018;

            if(lodash.isEmpty(center)){
                $('#facultyDate').val('');
                return App.render({
                    type: 'error',
                    message: 'Please Choose Center'
                });
            }

            if(!lodash.isEmpty(facultymonth)){
                self.loadBatches(center);
                self.loadSubject();
                dataService.getData('/facultyLogs/month', {center: center, employee: facultyId, month: facultymonth, year: year}, function (data) {
                    self.dataObj = data.data;
                    monthObj = facultymonth;
                    self.render();
                });
            }

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

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            var subjectId = $thisEl.find('#subject').attr('data-id');
            var bIdVal = $thisEl.find('#batch').attr('data-id');

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

        loadTable: function(d){
            var duration = d ? d.duration : "";
            var phone = d ? d.phone : "";
            var workEmail = d ? d.workEmail : "";
            var dressCode = d ? d.dressCode : "";
            var feedBack = d ? d.feedBack : "";
            return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
                '<tr>'+
                '<td class="filedWidth">Duration:</td>'+
                '<td data-name="duration" class="text-left select-disabled"> <div class="_animateInputBox rowWidth"> <input type="text" name="duration" class="_animate" value="' + duration + '"  id="duration" required/></div> </td>'+
                '</tr>'+
                '<tr>'+
                '<td class="filedWidth">Phone No:</td>'+
                '<td data-name="contact" class="text-left select-disabled"> <div class="_animateInputBox rowWidth"> <input type="text" name="contact" class="_animate" value="' + phone+ '" id="contact" required/></div> </td>'+
                '</tr>'+
                '<tr>'+
                '<td class="filedWidth">Email:</td>'+
                '<td data-name="email" class="text-left select-disabled"> <div class="_animateInputBox rowWidth"> <input type="text" name="email" class="_animate" value="' + workEmail+ '" id="email" required/></div> </td>'+
                '</tr>'+
                '<tr>'+
                '<td class="filedWidth">Dress Code:</td>'+
                '<td data-name="dressCode" class="text-left select-disabled"> <div class="_animateInputBox rowWidth"> <input type="text" name="dressCode" class="_animate" value="' + dressCode + '" id="dressCode" required/></div> </td>'+
                '</tr>'+
                '<tr>'+
                '<td class="filedWidth">Feedback:</td>'+
                '<td data-name="feedback" class="text-left select-disabled"> <div class="_animateInputBox rowWidth"> <input type="text" name="feedback" class="_animate" value="' + feedBack + '" id="feedback" required/></div> </td>'+
                '</tr>'+
                '</table>';
        },

        accordianSlide: function(e){
            var tr = $(e.target).closest('tr');

            var table =  $('#example5').DataTable( {
                "destroy": true,
            } );
            var row = table.row( tr );

            if(tr.hasClass('shown')){
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                var data = lodash.filter(this.dataObj, {'_id': tr.data('id')})
                row.child( this.loadTable(data.length > 0 ? data[0]: {}) ).show();
                tr.addClass('shown');
            }
        },


        render: function () {
            var self = this;
            var classDate, classDate1, classStartTime, classEndTime, time, time1;
            var formString = this.$el;
            var months = [{name: 'January', _id: 1},{name: 'February', _id: 2},{name: 'March', _id: 3},{name: 'April', _id: 4},{name: 'May', _id: 5},{name: 'June', _id: 6},
                {name: 'July', _id: 7},{name: 'August', _id: 8},{name: 'September', _id: 9},{name: 'October', _id: 10},{name: 'November', _id: 11},{name: 'December', _id: 12}];

            formString.html(_.template(ViewTemplate, {
                model           : self.data,
                center          : self.center,
                moment          : moment,
                currencySplitter: helpers.currencySplitter,
                permission      : self.permission,
                data            : '',
                dataObj         : self.dataObj,
                dateObj         : self.dateObj,
                monthObj        : monthObj
            }));
            setTimeout(function () {
                self.table = common.datatableInitWithoutExport('example5')
            }, 300);

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Faculty Logs',
                width      : '1100px',
                top        : '50px',
                buttons    : [{
                    text : 'Close',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });

            var center = $('#center').attr('data-id');

            dataService.getData('/facultyLogs/reporting/', {}, function (reporting) {
                reporting = _.map(reporting.data, function (report) {
                    report.name = report.name;
                    return report;
                });
                self.responseObj['#reportingPoint'] = reporting;
            });

            dataService.getData('/facultyLogs/class/', {}, function (typeofClass) {
                typeofClass = _.map(typeofClass.data, function (types) {
                    types.name = types.className;
                    return types;
                });
                self.responseObj['#typeofClass'] = typeofClass;
            });

            populate.get('#center', '/franchise/', {category: 'CENTER', count: 10000}, 'centerName', this, true);


            self.responseObj['#month'] = months;

            this.$el.find('#facultyDate').datepicker({
                changeMonth: true,
                changeYear: true
            });

            this.$el.find('#classDate').datepicker({
                changeMonth: true,
                changeYear: true
            });

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