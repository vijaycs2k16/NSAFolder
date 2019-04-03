define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/VStudent/EditTemplate.html',
    'text!templates/myProfile/ChangePassword.html',
    'views/Editor/NoteView',
    'views/Editor/AttachView',
    'views/dialogViewBase',
    'models/VStudentDetailsModel',
    'common',
    'populate',
    'moment',
    'helpers/keyCodeHelper',
    'vconstants',
    'helpers',
    'helpers/ga',
    'constants/googleAnalytics',
    'dataService',
    'mixins/changePassword'
], function (Backbone,
             $,
             _,
             EditTemplate,
             ChangePassTempl,
             NoteView,
             AttachView,
             ParentView,
             StudentDetailsModel,
             common,
             populate,
             moment,
             keyCodes,
             CONSTANTS,
             helpers,
             ga,
             GA,
             dataService,
             changePasswordMixIn) {
    'use strict';
    var EditView = ParentView.extend({
        el             : '#content-holder',
        contentType    : 'VStudent',
        imageSrc       : '',
        studentModel     : StudentDetailsModel,
        template       : _.template(EditTemplate),
        changePassTempl: _.template(ChangePassTempl),
        responseObj    : {},
        changedModels  : {},
        removeTransfer : [],

        events: {
            'mouseenter .avatar'                                   : 'showEdit',
            'mouseleave .avatar'                                   : 'hideEdit',
            'click td.editable'                                    : 'editJob',
            'click #changePassword'                                : 'changePassword',
            'click #removeImage'                                   : 'image'
        },

        image: function (e) {
            this.imageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC77'
            this.saveItem();
        },

        initialize: function (options) {
            var isSalary;
            var transfers;
            this.isDelete = options.delete ? true : false

            _.bindAll(this, 'saveItem', 'render','deleteStudent');

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

            if (options.collection) {
                this.studentCollection = options.collection;
                this.currentModel = this.studentCollection.getElement();
            } else {
                this.currentModel = options.model;
            }

            this.currentModel.urlRoot = '/vstudents/';

            this.render(options);
        },

        showNotification: function (e) {
            var msg;

            e.preventDefault();

            msg = 'You can edit ';
            msg += e.currentTarget.id;
            msg += ' at "Job" tab';

            App.render({
                type   : 'notify',
                message: msg
            });
        },

        deleteStudent: function (e) {
            var self = this;
            var target = $(e.target);
            dataService.deleteData(CONSTANTS.URLS.VSTUDENTDETAILS +'/' + self.currentModel.id, self.currentModel, function (err, response) {
             if (err) {
             return App.render({
             type   : 'error',
             message: 'Can\'t remove items'
             });
             }
             $('.edit-dialog').remove();
             });
            Backbone.history.fragment = '';
            Backbone.history.navigate('erp/' + self.contentType, {trigger: true});
            this.gaTrackingDelete();
        },

        gaTrackingDelete: function () {
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.DELETE_DIALOG
            });
        },

        editJob: function (e) {
            var self = this;
            var $target = $(e.target);
            var dataContent = $target.attr('data-content');
            var tempContainer;
            var $tr = $target.parent('tr');
            var modelId = $tr.attr('id');

            var minDate = new Date('1995-01-01');
            var maxDate = null;

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

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var dateBirthSt;
            var gender;
            var age;
            var course= $thisEl.find('#studentCourse').attr('data-id');
            var batch = $thisEl.find('#StudentBatch').attr('data-id');
            var center = $thisEl.find('#studentCenter').attr('data-id');
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
                    message: "please enter 10 digits number."
                });
            }
            if(!course){
                return App.render({
                    type   : 'error',
                    message: "please Select course."
                });
            }
            batch = (batch === 'Select' || !batch)? null : batch;
            var studentDetails = {
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
                schoolName          : schoolName,
                _id                 : this.currentModel.attributes.studentDetails ? this.currentModel.attributes.studentDetails._id : null,
            };
            var student = {
                    studentName         : firstName,
                    lastName            : lastName,
                    studentEmail        : studentEmail,
                    studentPassword     : password,
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
                    updatedBy           : App.currentUser.login,
                    createDate          : new Date(),
                    studentImageName    : self.imageSrc,
                    studentStatus       : status,
                    age                 : age,
                    studentDetails      : this.currentModel.attributes.studentDetails ? this.currentModel.attributes.studentDetails._id : null,
            }
            var data = {studentDetails: studentDetails, student: student}
            this.currentModel.set(data);
            this.currentModel.save(data, {
                headers: {
                    mid: 39
                },
                wait   : true,
                put   : true,

                success: function (model) {
                    var redirectUrl = window.location.hash;
                    if (model.get('relatedUser') === App.currentUser._id) {
                        App.currentUser.imageSrc = self.imageSrc;
                    }
                    self.hideDialog();
                    return App.render({
                        type: 'notify',
                        message: "updated successfully"
                    });
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(redirectUrl, {trigger: true});
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


        deleteEditable: function () {
            this.$el.find('.edited').removeClass('edited');
        },

        calculateAge: function(birthday) { // birthday is a date
            var dofb = new Date(birthday);
            var now = new Date();
            return now.getFullYear() - dofb.getFullYear();
        },
        render: function (options) {
            var self = this;
            var $lastElement;
            var $firstElement;
            var $jobPosElement;
            var $departmentElement;
            var $projectManagerElement;
            var isForProfile = !!options.currentUser;
            var timezoneOffset = (new Date()).getTimezoneOffset();

            var firstEL = false;
            var login = '';
            var formString;
            var timezone;
            var editRow;
            var $thisEl;
            var notDiv;
            var lastTr;
            var hideClass = "";

            if (timezoneOffset < 0) {
                timezone = ('UTC +' + (timezoneOffset / 60) * (-1));
            } else {
                timezone = ('UTC -' + (timezoneOffset / 60) * (-1));
            }

            if (isForProfile) {
                login = App.currentUser.login || '';
                this.isForProfile = true;
            }

            formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter,
                isForProfile    : isForProfile,
                timezone        : timezone,
                login           : login
            })


            if (this.currentModel.get('dateBirth')) {
                this.currentModel.set({
                    dateBirth: this.currentModel.get('dateBirth').split('T')[0].replace(/-/g, '/')
                }, {
                    silent: true
                });
            }

            if(this.isDelete) {
                hideClass = 'hide';
            }


            dataService.getData('/permission', {moduleId: CONSTANTS.MID.VStudent}, function (data) {
                var dialogOptions = {
                    dialogClass: 'edit-dialog',
                    width      : 1000,
                    buttons    : {
                        save: {
                            text : 'Save',
                            class: + data.data.update ? 'btn blue' : 'btn blue hide',
                            click: function () {
                                self.saveItem();
                                self.gaTrackingEditConfirm();
                            }
                        }
                    }
                };
                self.isDelete ? !self.isDelete : data.data.delete
                if (!isForProfile) {
                    dialogOptions.buttons.cancel = {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    };
                    dialogOptions.buttons.delete = {
                        text : 'Delete',
                        class:  self.isDelete ? 'btn ' : 'btn hide',
                        click: self.deleteStudent
                    };
                } else {
                    dialogOptions.buttons.close = {
                        text : 'Close',
                        class: 'btn',
                        click: self.hideDialog
                    };
                }
                self.$el = $(formString).dialog(dialogOptions);

                $thisEl = self.$el;

                notDiv = $thisEl.find('#attach-container');

                self.editorView = new NoteView({
                    model      : self.currentModel,
                    contentType: 'VStudent',
                    onlyNote: true
                });

                notDiv.append(
                    self.editorView.render().el
                );

                populate.get('#studentCenter', '/franchise/', {}, 'centerName', self, true);
                self.currentModel.toJSON();
                self.currentModel['imageSrc'] = self.currentModel.attributes.studentImageName;
                common.canvasDraw({model: self.currentModel}, self);

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
                    yearRange  : '-100y:c+nn',
                    minDate    : null
                });
                $thisEl.find('#courseEndDate').datepicker({
                    changeMonth: true,
                    changeYear : true,
                    yearRange  : '-100y:c+nn',
                    minDate    : null
                });
                $thisEl.find('#dateofJoining').datepicker({
                    changeMonth: true,
                    changeYear : true,
                    yearRange  : '-100y:c+nn',
                    minDate    : null
                });


                self.delegateEvents(self.events);

                $lastElement = $thisEl.find('#last');
                $firstElement = $thisEl.find('#first');
                $jobPosElement = $thisEl.find('#jobPosition');
                $departmentElement = $thisEl.find('#department');
                $projectManagerElement = $thisEl.find('#manager');

                self.lastData = $.trim($lastElement.val());
                self.firstData = $.trim($firstElement.val());
                self.jobPositionData = $.trim($jobPosElement.attr('data-id'));
                self.departmentData = $.trim($departmentElement.attr('data-id'));
                self.projectManagerData = $.trim($projectManagerElement.attr('data-id'));

            });


            return this;
        },
        selectCenter: function (id) {
            var self = this;
            var $thisEl = this.$el;
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

    });

    EditView = changePasswordMixIn(EditView);

    return EditView;
});


