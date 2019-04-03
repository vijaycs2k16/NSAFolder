define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/VStudent/CreateTemplate.html',
    'models/vStudentModel',
    'models/VStudentDetailsModel',
    'common',
    'populate',
    'views/Editor/NoteView',
    'views/Editor/AttachView',
    'views/Assignees/AssigneesView',
    'views/dialogViewBase',
    'vconstants',
    'moment',
    'helpers',
    'dataService'
], function (Backbone,
             $,
             _,
             CreateTemplate,
             studentModel,
             StudentDetailsModel,
             common,
             populate,
             NoteView,
             AttachView,
             AssigneesView,
             ParentView,
             CONSTANTS,
             moment,
             helpers,
             dataService) {
    'use strict';

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType:  'VStudent',
        template   : _.template(CreateTemplate),
        imageSrc   : '',
        responseObj: {},

        initialize: function () {
            this.mId = CONSTANTS.MID[this.contentType];
            _.bindAll(this, 'saveItem');
            this.model = new studentModel();

            this.responseObj['#studentGender'] = [
                {
                    _id : 'Male',
                    name: 'Male'
                }, {
                    _id : 'Female',
                    name: 'Female'
                }
            ];
            this.responseObj['#boardOfEdu'] = [
                {
                    _id : 'CBSE',
                    name: 'CBSE'
                }, {
                    _id : 'ICSE',
                    name: 'ICSE'
                },
                {
                    _id : 'State board',
                    name: 'State board'
                }
            ];

            this.render();
        },

        events: {
            'mouseenter .avatar': 'showEdit',
            'mouseleave .avatar': 'hideEdit',
            'click td.editable' : 'editJob',
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
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

        addAttach: function () {
            var $thisEl = this.$el;
            var s = $thisEl.find('.inputAttach:last').val().split('\\')[$thisEl.find('.inputAttach:last').val().split('\\').length - 1];

            $thisEl.find('.attachContainer').append('<li class="attachFile">' +
                '<a href="javascript:;">' + s + '</a>' +
                '<a href="javascript:;" class="deleteAttach">Delete</a></li>'
            );
            $thisEl.find('.attachContainer .attachFile:last').append($thisEl.find('.input-file .inputAttach').attr('hidden', 'hidden'));
            $thisEl.find('.input-file').append('<input type="file" value="Choose File" class="inputAttach" name="attachfile">');
        },

        deleteAttach: function (e) {
            $(e.target).closest('.attachFile').remove();
        },

        fileSizeIsAcceptable: function (file) {
            if (!file) {
                return false;
            }
            return file.size < App.File.MAXSIZE;
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var vstudentModel;
            var studentDetails;
            var vstudentDetailsModel;
            var dateBirthSt;
            var gender;
            var age;
            var course= $thisEl.find('#studentCourse').attr('data-id');
            var batch = $thisEl.find('#StudentBatch').attr('data-id');
            var center = $thisEl.find('#studentCenter').attr('data-id');
            vstudentModel = new studentModel();
            var status = $thisEl.find('#yes').prop('checked') || false;
             var firstName = $.trim($thisEl.find('#studentFirst').val()) ? $.trim($thisEl.find('#studentFirst').val()) : null;
             var lastName = $.trim($thisEl.find('#studentlast').val()) ? $.trim($thisEl.find('#studentlast').val()) : null;
             var studentEmail = $.trim($thisEl.find('#personalEmail').val()) ? $.trim($thisEl.find('#personalEmail').val()) : null;
             var password  = $.trim($thisEl.find('#password').val()) ? $.trim($thisEl.find('#password').val()) : null;
             var studentPhone  = $.trim($thisEl.find('#studentMobile').val()) ? $.trim($thisEl.find('#studentMobile').val()) : '';
             var studentCity  = $.trim($thisEl.find('#studentCity').val()) ? $.trim($thisEl.find('#studentCity').val()) : null;
             var registrationNo  = $.trim($thisEl.find('#registrationNo').val()) ? $.trim($thisEl.find('#registrationNo').val()) : null;
            var courseStartDate  = $.trim($thisEl.find('#courseStartDate').val()) ? $.trim($thisEl.find('#courseStartDate').val()) : null;
            var courseEndDate  = $.trim($thisEl.find('#courseEndDate').val()) ? $.trim($thisEl.find('#courseEndDate').val()) : null;
            var courseFee  = $.trim($thisEl.find('#CourseFee').val()) ? $.trim($thisEl.find('#CourseFee').val()) : null;
            var street1  = $.trim($thisEl.find('#studentStreet1').val()) ? $.trim($thisEl.find('#studentStreet1').val()) : null;
            var city  = $.trim($thisEl.find('#studentCity').val()) ? $.trim($thisEl.find('#studentCity').val()) : null;
            var state  = $.trim($thisEl.find('#studentState').val()) ? $.trim($thisEl.find('#studentState').val()) : null;
            var zipcode  = $.trim($thisEl.find('#studentZip').val()) ? $.trim($thisEl.find('#studentZip').val()) : null;
            var fatherName  = $.trim($thisEl.find('#studentFatherName').val()) ? $.trim($thisEl.find('#studentFatherName').val()) : null;
            var motherName  = $.trim($thisEl.find('#studentMotherName').val()) ? $.trim($thisEl.find('#studentMotherName').val()) : null;
            var occupation  = $.trim($thisEl.find('#occupation').val()) ? $.trim($thisEl.find('#occupation').val()) : null;
            var fatherAnnualIncome  = $.trim($thisEl.find('#fatherAnnualIncome').val()) ? $.trim($thisEl.find('#fatherAnnualIncome').val()) : null;
            var dateofJoining  = $.trim($thisEl.find('#dateofJoining').val()) ? $.trim($thisEl.find('#dateofJoining').val()) : null;
            dateBirthSt = $.trim($thisEl.find('#dateBirth').val()) ? $.trim($thisEl.find('#dateBirth').val()) : null;
            var schoolName  = $.trim($thisEl.find('#schoolName').val()) ? $.trim($thisEl.find('#schoolName').val()) : null;

            gender = $thisEl.find('#studentGender').attr('data-id') || null;
           var boardOfEdu = $thisEl.find('#boardOfEdu').attr('data-id') || null;
            if(dateBirthSt){
                age = this.calculateAge(dateBirthSt);
            }

            if (!firstName) {
                return App.render({
                    type   : 'error',
                    message: "firstName field can't be empty."
                });
            }
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(studentEmail)) {
                return App.render({
                    type   : 'error',
                    message: "Please provide valid email."
                });
            }
            if (!studentPhone.match(/^\d{10}$/)) {
                return App.render({
                    type   : 'error',
                    message: "Please enter 10 digits number."
                });
            }
            if(center === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please select center."
                });
            }
            if(course === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please Select course."
                });
            }
            if(batch === 'Select'){
                batch = null ;
            }
            studentDetails = {
                street1             : street1,
                city                : city,
                state               : state,
                pincode             : zipcode,
                faterName           : fatherName,
                motherName          : motherName,
                occupation          : occupation,
                annualIncome        : fatherAnnualIncome,
                dateOfJoining       : dateofJoining,
                dateOfBirth         : dateBirthSt,
                boardOfEdu          : boardOfEdu,
                schoolName          : schoolName
            }
            vstudentDetailsModel = new StudentDetailsModel();
            vstudentDetailsModel.save(studentDetails, {
                headers: {
                    mid: 39
                },

                success: function (model) {
                    if (model.get('relatedUser') === App.currentUser._id) {
                        App.currentUser.imageSrc = self.imageSrc;
                    }
                    var data = {
                        studentDetails      : model.id,
                        studentName         : firstName,
                        lastName            : lastName,
                        studentEmail        : studentEmail,
                        studentPassword     : password,
                        originalPassword    : password,
                        studentGender       : gender,
                        studentPhone        : studentPhone,
                        userName            : studentEmail,
                        studentCity         : studentCity,
                        registrationNo      : registrationNo,
                        course              : course,
                        courseStartDate     : courseStartDate,
                        courseEndDate       : courseEndDate,
                        center              : center,
                        batch               : batch,
                        totalFees           : courseFee,
                        createdBy           : App.currentUser.login,
                        createDate          : new Date(),
                        studentImageName    : self.imageSrc,
                        studentStatus       : status,
                        age                 : age
                    };

                    vstudentModel.save(data, {
                        error: function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
                    self.hideDialog();
                    return App.render({
                        type: 'notify',
                        message:CONSTANTS.RESPONSES.CREATE_SUCCESS
                    });
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }

            });
            Backbone.history.fragment = '';
            Backbone.history.navigate('erp/' + self.contentType, {trigger: true});
        },

        selectCenter: function (id) {
            var self = this;
            this.$el.find('#studentCourse').text('Select');
            this.$el.find('#StudentBatch').text('Select');
            if (id !== '') {
                dataService.getData('/fcourse/center', {centerId: id}, function (courses) {
                    courses = _.map(courses.data, function (course) {
                        course.name = course.course.courseName;
                        course._id = course.course._id;

                        return course;
                    });
                    self.responseObj['#studentCourse'] = courses;
                    self.responseObj['#StudentBatch'] = [];
                });
            } else {
                self.responseObj['#studentCourse'] = [];
                self.responseObj['#StudentBatch'] = [];
            }

        },
        selectBatch: function (centerId, courseId) {
            var self = this;
            this.$el.find('#StudentBatch').text('Select');
            if (centerId !== '' && courseId !=='') {
                dataService.getData('/vbatch/center/course', {centerId: centerId, courseId: courseId}, function (batches) {
                    batches = _.map(batches.data, function (batch) {
                        batch.name = batch.batchName;

                        return batch;
                    });
                    self.responseObj['#StudentBatch'] = batches;
                });
            } else {
                self.responseObj['#StudentBatch'] = [];
            }

        },
        calculateAge: function(birthday) { // birthday is a date
            var dofb = new Date(birthday);
            var now = new Date();
            return now.getFullYear() - dofb.getFullYear();
        },

        render: function () {
            var formString = this.template({
                moment: moment
            });
            var $notDiv;
            var self = this;
            var $thisEl;

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 900,
                title      : 'Create Student',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        id   : 'createBtnDialog',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                }
            });

            $thisEl = this.$el;

            $notDiv = $thisEl.find('#attach-container');

            this.model = new studentModel();

            this.editorView = new NoteView({
                model      : this.model,
                contentType: self.contentType,
                onlyNote   : true,
                isCreate   : true
            });

            $notDiv.append(
                this.editorView.render().el
            );

            this.attachView = new AttachView({
                model      : this.model,
                contentType: self.contentType,
                noteView   : this.editorView,
                forDoc     : true,
                isCreate   : true
            });

            $thisEl.find('.attachments').append(
                this.attachView.render().el
            );

            $notDiv = this.$el.find('.assignees-container');
            $notDiv.append(
                new AssigneesView({
                    model      : this.currentModel,
                    contentType: self.contentType
                }).render().el
            );

            populate.get('#studentCenter', '/franchise/', {}, 'centerName', this, true);


            $thisEl.find('#dateBirth').datepicker({
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : new Date(),
                minDate    : null
            });
            $thisEl.find('#courseStartDate').datepicker({
                changeMonth: true,
                changeYear : true,
                minDate    : null
            });
            $thisEl.find('#courseEndDate').datepicker({
                changeMonth: true,
                changeYear : true,
                minDate    : null
            });
            $thisEl.find('#dateofJoining').datepicker({
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                minDate    : null
            });

            common.canvasDraw({model: this.model.toJSON()}, this);

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
