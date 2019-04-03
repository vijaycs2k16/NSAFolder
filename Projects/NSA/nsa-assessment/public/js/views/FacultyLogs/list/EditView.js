define([
    'Backbone',
    'jQuery',
    'Underscore',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/FacultyLogs/list/EditTemplate.html',
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
], function (Backbone, $, _, lodash, Parent, EditTemplate, SelectView, populate, moment, CONSTANTS, dataService, keyValidator, helpers, Model, timepicki, common) {

    'use strict';
    var DataObjLen = [];

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
            'change #facultyDate'      : 'loadData',
            'click .details-control'   : 'accordianSlide'
        },

        loadData: function(e) {
            var self = this;
            var thisEl = this.$el;
            var center = $('#center').attr('data-id');
            var facultyDate = $('#facultyDate').val();
            var facultyId = thisEl.find('#facultyName').attr('data-id');

            if(lodash.isEmpty(center)){
                $('#facultyDate').val('');
                return App.render({
                    type: 'error',
                    message: 'Please Choose Center'
                });
            }

            if(!lodash.isEmpty(facultyDate) && !lodash.isEmpty(center)){
                self.loadBatches(center);
                self.loadSubject();
                dataService.getData('/facultyLogs/date', {center: center, faculty: facultyId, classDate: facultyDate}, function (data) {
                    self.dataObj = data.data;
                    self.dateObj = facultyDate;
                    DataObjLen = data.data;
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

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var centerName = thisEl.find('#center').attr('data-id');
            var department = thisEl.find('#department').attr('data-id');
            var employee = thisEl.find('#facultyName').attr('data-id');
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var targetEl;
            var i;
            var body = [];
            var ids = [];

            if(!centerName){
                return App.render({
                    type: 'error',
                    message: 'Please Select Center'
                })
            }

            if(!department){
                return App.render({
                    type: 'error',
                    message: 'Please Select Center'
                })
            }

            if(!employee){
                return App.render({
                    type: 'error',
                    message: 'Please Select employee'
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
                var cDate = $('#classDate').val();
                var classDate1 = $.trim(this.$el.find('#classDate').val());
                var classDate = moment(classDate1).format("D MMM, YYYY");
                var batch = targetEl.find('#batch').attr('data-id');
                var index = batch.indexOf("-");
                var id = batch.substr(0, index);
                var text = batch.substr(index + 1);
                batch = id;
                var course = text;
                var subject = targetEl.find('#subject').attr('data-id');
                var topics = targetEl.find('#topics').attr('data-id');
                var reportingPoint = targetEl.find('#reportingPoint').attr('data-id');
                var typeofClass = targetEl.find('#typeofClass').attr('data-id');
                var classStartTime = this.getTimeForDate(moment(targetEl.find('.timepickerOne').val(), ["h:mm"]).format("HH:mm").split(':'));
                var classEndTime = this.getTimeForDate(moment(targetEl.find('.timepickerTwo').val(), ["h:mm"]).format("HH:mm").split(':'));
                var sDate = $.trim(thisEl.find('#timepickerOne0').val());
                var eDate = $.trim(thisEl.find('#timepickerTwo0').val());
                var duration = targetEl.next('tr').find("#duration").val()
                var contact = targetEl.next('tr').find("#contact").val()
                var email = targetEl.next('tr').find("#email").val()
                var dressCode = targetEl.next('tr').find("#dressCode").val()
                var feedback = targetEl.next('tr').find("#feedback").val()

                if(!cDate){
                    return App.render({
                        type: 'error',
                        message: 'Please Choose Date'
                    })
                }

                if(!batch){
                    return App.render({
                        type: 'error',
                        message: 'Please Select batch'
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

                if(!reportingPoint){
                    return App.render({
                        type: 'error',
                        message: 'reportingPoint can not be empty'
                    })
                }

                if(!typeofClass){
                    return App.render({
                        type: 'error',
                        message: 'typeofClass can not be empty'
                    })
                }

                if(!sDate){
                    return App.render({
                        type: 'error',
                        message: 'Please Select In Time'
                    });
                }

                if(!eDate){
                    return App.render({
                        type: 'error',
                        message: 'Please Select Out Time'
                    });
                }

                if(!duration){
                    return App.render({
                        type: 'error',
                        message: 'duration can not be empty'
                    })
                }

                if(!contact){
                    return App.render({
                        type: 'error',
                        message: 'contact can not be empty'
                    })
                }

                if(!email){
                    return App.render({
                        type: 'error',
                        message: 'email can not be empty'
                    })
                }

                if(!dressCode){
                    return App.render({
                        type: 'error',
                        message: 'dressCode can not be empty'
                    })
                }

                if(!feedback){
                    return App.render({
                        type: 'error',
                        message: 'feedback can not be empty'
                    });
                }


                body.push({
                    id: self.dataObj ? !_.isUndefined(self.dataObj[i]) ? self.dataObj[i]._id : '' : '',
                    center: centerName,
                    department: department,
                    employee  : employee,
                    classDate: classDate,
                    batch: batch,
                    subject: subject,
                    topics: topics,
                    duration: duration,
                    phone: contact,
                    workEmail: email,
                    dressCode: dressCode,
                    reportingPoint: reportingPoint,
                    typeOfClass: typeofClass,
                    inTime: classStartTime,
                    outTime: classEndTime,
                    feedBack: feedback
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
                    return App.render({
                        type: 'notify',
                        message:CONSTANTS.RESPONSES.EDIT_SUCCESS
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
            var duration = d.logs ? d.logs.duration : "";
            var phone = d.logs ? d.logs.phone : "";
            var workEmail = d.logs ? d.logs.workEmail : "";
            var dressCode = d.logs ? d.logs.dressCode : "";
            var feedBack = d.logs ? d.logs.feedBack : "";
            return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
                '<tr>'+
                '<td class="filedWidth">Duration:</td>'+
                '<td data-name="duration" class="text-left"> <div class="_animateInputBox rowWidth"> <input type="text" name="duration" class="_animate" value="' + duration + '"  id="duration" required/></div> </td>'+
                '</tr>'+
                '<tr>'+
                '<td class="filedWidth">Phone No:</td>'+
                '<td data-name="contact" class="text-left"> <div class="_animateInputBox rowWidth"> <input type="text" name="contact" class="_animate" value="' + phone+ '" id="contact" required/></div> </td>'+
                '</tr>'+
                '<tr>'+
                '<td class="filedWidth">Email:</td>'+
                '<td data-name="email" class="text-left"> <div class="_animateInputBox rowWidth"> <input type="text" name="email" class="_animate" value="' + workEmail+ '" id="email" required/></div> </td>'+
                '</tr>'+
                '<tr>'+
                '<td class="filedWidth">Dress Code:</td>'+
                '<td data-name="dressCode" class="text-left"> <div class="_animateInputBox rowWidth"> <input type="text" name="dressCode" class="_animate" value="' + dressCode + '" id="dressCode" required/></div> </td>'+
                '</tr>'+
                '<tr>'+
                '<td class="filedWidth">Feedback:</td>'+
                '<td data-name="feedback" class="text-left"> <div class="_animateInputBox rowWidth"> <input type="text" name="feedback" class="_animate" value="' + feedBack + '" id="feedback" required/></div> </td>'+
                '</tr>'+
                '</table>';
        },

        accordianSlide: function(e){
           var tr = $(e.target).closest('tr');

            var row = this.table.row( tr );
            if(tr.hasClass('shown')){
                tr.next('tr').addClass('hide');
                tr.removeClass('shown');
            }
            else {
                tr.next('tr').removeClass('hide');
                if(!tr.next('tr').find("#duration").val()) {
                    var data = lodash.filter(this.dataObj, {'_id': tr.data('id')})
                }
                tr.addClass('shown');

            }
        },


        render: function () {
            var self = this;
            var classDate, classDate1, classStartTime, classEndTime, time, time1;
            var formString = this.$el;

            formString.html(_.template(EditTemplate, {
                model           : self.data,
                center          : self.center,
                moment          : moment,
                currencySplitter: helpers.currencySplitter,
                permission      : self.permission,
                data            : '',
                dataObj         : self.dataObj,
                dateObj         : self.dateObj
            }));
            setTimeout(function () {
                self.table =  $('#example5').DataTable( {
                    "destroy": true,
                } );
            }, 300);

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Faculty Logs',
                width      : '1100px',
                top        : '50px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue ',
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


            this.$el.find('#facultyDate').datepicker({
                changeMonth: true,
                changeYear: true
            });

            this.$el.find('#classDate').datepicker({
                changeMonth: true,
                changeYear: true
            });

            for(var i = 0; i < DataObjLen.length; i++){
                classDate = DataObjLen[i].classDate;
                classDate1 = moment(classDate).format("D MMM, YYYY");
                classStartTime = DataObjLen[i].classStartTime;
                classEndTime = DataObjLen[i].classEndTime;
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
