define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/EnrollMent/Registration/CreateTemplate.html',
    'models/EnrollMentModel',
    'dataService',
    'populate',
    'common',
    'moment',
    'vconstants'
], function (Backbone, $, _, Parent, orgTemplate, Model, dataService, populate, common, moment, constants) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'EnrollMent',
        actionType: 'Content',
        template: _.template(orgTemplate),
        el: '#content-holder',
        responseObj: {},

        initialize: function (options) {
            var self = this;
            this.startTime = options.startTime;
            this.model = new Model();
            this.feeTypeDetails = [];
            this.courses = [];

            this.responseObj['#studentGender'] = [
                {
                    _id: 'Male',
                    name: 'Male'
                }, {
                    _id: 'Female',
                    name: 'Female'
                }
            ];

            this.render();
            $('#top-bar').hide();
        },

        events: {
            'mouseenter .avatar': 'showEdit',
            'mouseleave .avatar': 'hideEdit',
            'click .saveBtn': 'saveItem',
            'click ._circleRadioRadiance': 'checked',
            'click #startDate': 'changeDate',
            'click .cancelBtn': 'returnEnrollment',
            'keyup #discountAmount': 'discountApply',
            "click .checkbox": "discountChecked",
            'keyup #bookingAmount':'bookingApply',
            "click .checkboxBooking": "bookingChecked",
            "keyup .enterAmount": "enterAmount"
        },

        checked: function (e) {
            var value = $(e.target).val();
            if (value == 'DD' || value == 'Cheque' || value == 'neft' || value == 'Cash') {

                $('.billDetails').removeClass('hide');
                $('.billDetails1').removeClass('hide');

                if(value == 'Cheque') {
                    $('#label').text("Enter Cheque No");
                }
                else if(value == 'Cash') {
                    $('#label').text("Enter Denominations");
                    $('.billDetails1').addClass('hide');
                }
                else {
                    $('#label').text("Enter Bill No")
                }

            } else {
                $('.billDetails').addClass('hide');
                $('.billDetails1').addClass('hide');
            }
        },

        enterAmount: function (e) {
            var self = this;
            var thisEl = this.$el;
            this.totalInstallmentAmount = 0;
            this.feeTypeDetails.forEach(function (item) {
                var enterAmount = thisEl.find('#' + item._id).val();
                self.totalInstallmentAmount += enterAmount ? +(enterAmount) : 0;
            })
            $('#billAmount').val(this.totalInstallmentAmount);
        },

        discountChecked: function (e) {
            var checked = $(e.target).prop('checked');
            if (checked) {
                $('.discount').removeClass('hide');
            } else {
                $('.discount').addClass('hide');
            }
        },

        bookingChecked: function (e) {
            var checked = $(e.target).prop('checked');
            if (checked) {
                $('.booking').removeClass('hide');
                $('#feeTypes').hide();
            } else {
                $('.booking').addClass('hide');
                $('#feeTypes').show();
            }
        },
        bookingApply:function (e) {
            var bookingValue=  $(e.target).val();
            if(parseInt(bookingValue) > this.fee.centerCourseFees){
                $('#bookingAmount').val(bookingValue.substr(0, bookingValue.length - 1));
                bookingValue = $('#bookingAmount').val();
            }
        },
        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var data = {};
            var object = thisEl.find('#createRegisterForm').serializeArray();
            $(object).each(function (i, field) {
                data[field.name] = field.value;
            });
            var feeTypeObjs = [];
            this.feeTypeDetails.forEach(function (item) {
                var enterAmount = thisEl.find('#' + item._id).val();
                item.paidAmount = enterAmount ? enterAmount : 0;
                item.gstAmount = parseInt(item.gstAmount);
                feeTypeObjs.push(item);
            });
            data.center = thisEl.find('#center').attr('data-id');
            data.centerName = thisEl.find('#center').text();
            data.courseName = thisEl.find('#course').text();
            data.course = thisEl.find('#course').attr('data-id');
            data.centerCode = thisEl.find('#centerCode').text();
            data.store = this.store

            data.academicYear = thisEl.find('#academic').attr('data-id');
            data.followedBy = thisEl.find('#followedBy').attr('data-id')
            data.batch = thisEl.find('#batch').attr('data-id');
            data.studentGender = thisEl.find('#studentGender').attr('data-id')
            data.feeTypeObjs = feeTypeObjs;
            data.existingStudentId = this.existingStudentId;
            data.exitsingStudentDetailsId = this.exitsingStudentDetailsId;
            data.isRegistration = true;
            data.DateOfJoining = thisEl.find('#dateOfJoining').val()
            if((thisEl.find('#registrationNo').text()).length > 0) {
                data.oldRegNo = thisEl.find('#registrationNo').text()
            }
            if(!data.DateOfJoining){
                return App.render({
                    type   : 'error',
                    message: 'Date of joining cannot be empty'
                });
            }
            data.batch = (!data.batch || data.batch === 'Select') ? null : data.batch;
            if (data.dateOfBirth) {
                data.age = this.calculateAge(data.dateOfBirth);
            }
            if (!data.studentName) {
                return App.render({
                    type: 'error',
                    message: "Name field can't be empty."
                });
            }

            if (!data.center || data.center === 'Select') {
                return App.render({
                    type: 'error',
                    message: "Please select center."
                });
            }
            if (!data.course || data.course === 'Select') {
                return App.render({
                    type: 'error',
                    message: "Please Select course."
                });
            }

            if (!data.academicYear || data.academicYear === 'Select') {
                return App.render({
                    type: 'error',
                    message: "Please Select Academic Year."
                });
            }
            if (!data.batch || data.batch === 'Select') {
                return App.render({
                    type: 'error',
                    message: "Please Select batch."
                });
            }
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.studentEmail)) {
                return App.render({
                    type: 'error',
                    message: "Please provide valid email."
                });
            }
            if (!data.studentPhone.match(/^\d{10}$/)) {
                return App.render({
                    type: 'error',
                    message: "Please enter 10 digits number."
                });
            }
            if ((data.studentPassword.length < 6) && (data.originalPassword.length < 6)) {
                return App.render({
                    type: 'error',
                    message: "Please Enter password more than 6 characters ."
                });
            }
            if (data.studentPassword !== data.originalPassword) {
                return App.render({
                    type: 'error',
                    message: "Please Enter correct password ."
                });
            }
            data.productInfo = this.productInfo
            data.centerCourseFees = this.fee.centerCourseFees;
            data.actualFeeAmount = this.totalFeeAmount;
            data.totalGSTAmount = this.fee.totalGSTAmount;
            data.totalInstallmentAmount = 0;
            data.amountPaidUpto = 0;
            var paidAmount = 0;
            var totalAmount = 0;
            data.isDiscountApplicable = data.isDiscountApplicable == 'on' ? true : false;
            data.isBooking = data.isBooking == 'on' ? true : false;
            data.studentStatus = data.isBooking ? false : true;

            feeTypeObjs.forEach(function (item) {
                paidAmount = paidAmount + (+item.paidAmount);
                totalAmount += item.fullAmountWithGST
                item.paidAmount = +item.paidAmount;
                item.completed = (+item.fullAmountWithGST - (+item.paidAmount + +item.adjustableAmt) <= 0) ? true: false;
                item.isAdjusted = (+item.adjustableAmt - +item.paidAmount) > 0 ? false: true;
                item.currentInstallmentAmount = item.paidAmount;
                data.totalInstallmentAmount += item.paidAmount ? item.paidAmount : 0;
                data.amountPaidUpto += item.paidAmount;
            })
            if (data.paymentMode == 'DD' || data.paymentMode == 'Cheque' || data.paymentMode == 'neft' || data.paymentMode == 'Cash') {
                var paymentModeDetails = {
                    billNo: data.billNo,
                    billAmount: data.billAmount,
                    billDate: data.billDate,
                    bankName: data.bankName,
                    paymentMode: data.paymentMode,
                };
                if(data.paymentMode == 'Cash') {
                    var paymentModeDetails = {
                        cash: data.billNo
                    }

                    if ((data.billNo == '')) {
                        return App.render({
                            type: 'error',
                            message: "Please Enter Denominations"
                        });
                    }
                }

                data.paymentModeDetails = paymentModeDetails;
            }

            if (parseInt(totalAmount) == parseInt(paidAmount)) {
                data.isCompleted = true;
            }

            data.paidAmount = paidAmount;

            if (data.totalInstallmentAmount == 0 && data.bookingAmount <= 0) {
                return App.render({
                    type: 'error',
                    message: "Please Enter Fee types amount."
                });
            }
            var validation = this.feeMaxValidation(this.feeTypeDetails);
            if (!_.isEmpty(validation)) {
                return App.render({
                    type: 'error',
                    message: validation[0] + " Enter less than remaining amount."
                })
            } else {
                var bookFee = _.find(feeTypeObjs, function(o){ return o.feeTypeName == "Book Fees"});
                if((bookFee.currentInstallmentAmount != 0) && (bookFee.fullAmount !== bookFee.currentInstallmentAmount && data.bookingAmount <= 0)){
                    return App.render({
                        type   : 'error',
                        message: "Book Fees partial amount not allowed."
                    });
                }

                this.model.save(data, {
                    wait: true,
                    validate: true,
                    success: function (result) {
                        if ((data.paymentMode).toLowerCase() === 'online') {
                            var successData = result.toJSON().data
                            var form = document.createElement("form");
                            form.setAttribute("method", 'post');
                            form.setAttribute("action", successData.paymentData.paymentUrl);

                            var hiddenField = document.createElement("input");
                            hiddenField.setAttribute("type", "hidden");
                            hiddenField.setAttribute("name", "MID");
                            hiddenField.setAttribute("value", successData.paymentData.mid);
                            form.appendChild(hiddenField);

                            var hiddenField2 = document.createElement("input");
                            hiddenField2.setAttribute("type", "hidden");
                            hiddenField2.setAttribute("name", "merchantRequest");
                            hiddenField2.setAttribute("value", successData.paymentData.merchantRequest);
                            form.appendChild(hiddenField2);

                            document.body.appendChild(form);
                            form.submit();
                        } else {
                            self.returnEnrollment()
                        }
                        $('.saveBtn').attr("disabled", true);

                        return App.render({
                            type: 'notify',
                            message:constants.RESPONSES.CREATE_SUCCESS
                        });
                    },

                    error: function (model, xhr) {
                        $('.saveBtn').prop("disabled", false);
                        self.errorNotification(xhr);
                    }
                });
            }
        },
        discountApply: function (e) {
            var discountValue = $(e.target).val();
            if (parseInt(discountValue ? discountValue : 0) < this.fee.centerCourseFees) {
                $("#feeTypes").empty();
                if (discountValue) {
                    var afterDisc = parseInt(this.totalAmtWithGst) - parseInt(discountValue ? discountValue : 0);
                    $('#netFees').val(afterDisc.toFixed(2));
                } else {
                    discountValue = 0;
                    $('#netFees').val(this.totalAmtWithGst);
                }
                var totalGSTAmount = 0;
                var self = this;
                _.forEach(this.feeTypeDetails, function (value) {
                    value.paidAmount = 0;
                    value.gstAmount = 0;
                    value.fullAmount = ((self.fee.centerCourseFees * value.feeTypePert) / 100);
                    if (value.feeTypeIsGST) {
                        value.fullAmount = value.fullAmount - ((parseInt(discountValue) * value.feeTypePert) / 100);
                        value.gstAmount = (value.fullAmount * value.feeTypeGstPercentage) / 100;
                        totalGSTAmount += value.gstAmount
                    }
                    value.fullAmountWithGST = (value.fullAmount + value.gstAmount) || 0;
                });
                this.fee.totalGSTAmount = totalGSTAmount;
                this.feeTypeBody(this.feeTypeDetails);
            } else {
                $('#discountAmount').val(discountValue.substr(0, discountValue.length - 1));
                discountValue = $('#discountAmount').val();
            }
            this.totalFeeAmount = this.fee.centerCourseFees - parseInt(discountValue ? discountValue : 0);
        },
        feeMaxValidation: function (fee) {
            var thisEl = this.$el;
            var nonValidFees = [];
            fee.forEach(function (item) {
                var enterAmount = thisEl.find('#' + item._id).val();
                enterAmount = enterAmount ? parseInt(enterAmount) : 0;
                var maxAmount = parseInt(thisEl.find('#' + item._id).attr('max'));
                if (enterAmount > maxAmount) {
                    nonValidFees.push(item.feeTypeName);
                }
            });
            return nonValidFees;
        },
        chooseOption: function (e) {
            var self = this;
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
            var centerId = $thisEl.find('#center').attr('data-id');
            var courseId = $thisEl.find('#course').attr('data-id');
            if (holder.attr('id') === 'studentDd') {
                this.selectStudent($target.attr('id'));
            }
            if (holder.attr('id') === 'center') {
                this.restValues();
                this.selectCenter(centerId);
            }
            try{
                if (holder.attr('id') === 'course') {
                    this.restValues();
                    var product = _.filter(this.courses, {'_id': courseId})
                    this.productInfo = {};
                    if (product) {
                        this.productInfo = product[0].course.product;
                        dataService.getData('/priceList/getPrices', {
                            product: self.productInfo._id,
                            priceList: "58109ae869b3249417f74baf",
                            quantity: 1
                        }, function (response) {
                            self.productInfo.unitPrice = response.price;
                        });
                    }
                    this.selectBatch(centerId, courseId);
                    this.getFeeTypes(centerId, courseId);
                }
            }
            catch(err){
                this.selectBatch(centerId,courseId);
                //this.getFeeTypes(centerId, courseId);
                return App.render({
                    type: 'error',
                    message: "Product didn't associated to this course."
                });
            }
        },
        calculateAge: function (birthday) { // birthday is a date
            var dofb = new Date(birthday);
            var now = new Date();
            return now.getFullYear() - dofb.getFullYear();
        },
        selectStudent: function (id) {
            if (id !== '') {
                dataService.getData(constants.URLS.VSTUDENT + id, {}, function (response, context) {
                    context.existingStudentId = id;
                    var student = response;
                    $("#feeTypes").empty();
                    if (student.center && student.course) {
                        context.getFeeTypes(student.center._id, student.course._id);
                        context.$el.find('#course').attr('data-id', student.course._id);
                        context.$el.find('#course').text(student.course.courseName);
                    }
                    context.$el.find('#studentName').val(student.studentName);
                    context.$el.find('#lastName').val(student.studentName);
                    context.$el.find('#studentEmail').val(student.studentEmail);
                    context.$el.find('#studentPhone').val(student.studentPhone);
                    context.$el.find('#center').text(student.center? student.center.centerName: '');
                    context.$el.find('#centerCode').text(student.center ? student.center.centerCode: '');
                    context.$el.find('#center').attr('data-id', student.center? student.center._id: '');
                    context.$el.find('#academic').text(student.academic ? student.academic.academicYear: '');
                    context.$el.find('#followedBy').text(student.followedBy? student.followedBy:'' );
                    context.$el.find('#academic').attr('data-id',student.academic ? student.academic._id: '');
                    context.$el.find('#batch').text(student.batch ? student.batch.batchName: '');
                    context.$el.find('#batch').attr('data-id', student.batch ? student.batch._id: '');
                    context.$el.find('#studentGender').val(student.studentGender);
                    context.$el.find('#password').val(student.studentPassword);
                    context.$el.find('#confirmpassword').val(student.studentPassword);
                    context.$el.find('#registrationNo').text(student.registrationNo);
                    if(student.studentDetails) {
                        context.exitsingStudentDetailsId = student.studentDetails ? student.studentDetails._id : null;
                        context.$el.find('#dateOfJoining').val(student.studentDetails.dateOfJoining);
                        context.$el.find('#fatherName').val(student.studentDetails.fatherName);
                        context.$el.find('#motherName').val(student.studentDetails.motherName);
                        context.$el.find('#category').val(student.studentDetails.category);
                        context.$el.find('#dateOfBirth').val(student.studentDetails.dateOfBirth);
                        context.$el.find('#occupation').val(student.studentDetails.occupation);
                        context.$el.find('#annualIncome').val(student.studentDetails.annualIncome);
                        context.$el.find('#schoolName').val(student.studentDetails.schoolName);
                        context.$el.find('#marksSecured').val(student.studentDetails.marksSecured);
                        context.$el.find('#plustwoPassedYear').val(student.studentDetails.plustwoPassedYear);
                        context.$el.find('#street1').val(student.studentDetails.street1);
                        context.$el.find('#street2').val(student.studentDetails.street2);
                        context.$el.find('#state').val(student.studentDetails.state);
                        context.$el.find('#pincode').val(student.studentDetails.pincode);
                        context.$el.find('#city').val(student.studentDetails.city);
                        switch (student.studentDetails.boardOfEdu) {
                            case 'CBSE':
                                context.$el.find('#CBSE').prop('checked', true);
                                break;
                            case 'StateBoard' :
                                context.$el.find('#State').prop('checked', true);
                                break;
                            case 'ICSE':
                                context.$el.find('#ICSE').prop('checked', true);
                                break;
                            case 'othersBOE' :
                                context.$el.find('#othersBOE').val(student.studentDetails.boardOfEdu);
                                break;
                            default:
                                context.$el.find('#CBSE').prop('checked', true);
                        }
                    }

                }, this);
            } else {
                this.restValues();
                this.existingStudentId = null;
                this.exitsingStudentDetailsId = null;
                this.$el.find('#registrationNo').val('');
                this.$el.find('#studentName').val('');
                this.$el.find('#lastName').val('');
                this.$el.find('#studentEmail').val('');
                this.$el.find('#studentPhone').val('');
                this.$el.find('#dateOfBirth').val('');
                this.$el.find('#course').attr('data-id', '');
                this.$el.find('#course').text('');
                this.$el.find('#center').text('');
                this.$el.find('#center').attr('data-id', '');
                this.$el.find('#academic').text('');
                this.$el.find('#academic').attr('data-id', '');
                this.$el.find('#batch').text('');
                this.$el.find('#batch').attr('data-id', '');
                this.$el.find('#dateOfJoining').val('');
                this.$el.find('#studentGender').val('');
                this.$el.find('#studentGender').val('data-id', '');
                this.$el.find('#password').val('');
                this.$el.find('#confirmpassword').val('');
                this.$el.find('#fatherName').val('');
                this.$el.find('#motherName').val('');
                this.$el.find('#category').val('');
                this.$el.find('#occupation').val('');
                this.$el.find('#annualIncome').val('');
                this.$el.find('#schoolName').val('');
                this.$el.find('#marksSecured').val('');
                this.$el.find('#plustwoPassedYear').val('');
                this.$el.find('#street1').val('');
                this.$el.find('#street2').val('');
                this.$el.find('#state').val('');
                this.$el.find('#pincode').val('');
                this.$el.find('#city').val('');
                this.$el.find('#CBSE').prop('checked', false);
                this.$el.find('#State').prop('checked', false);
                this.$el.find('#ICSE').prop('checked', true);
                this.$el.find('#othersBOE').val('')
            }

        },

        restValues: function () {
            $("#feeTypes").empty();
            $('.discountTab').addClass('hide');
            $('#netFees').val('');
            $('#discountAmount').val('');
        },
        changeDate: function () {
            var model = this.model.toJSON();

            if (model.startDate) {
                App.render({
                    type: 'error',
                    message: 'You can set start date only 1 time and this value cannot be changed'
                });
            }
        },
        selectCenter: function (id) {
            var self = this;
            this.store = null;
            var store = _.filter(this.centers, {_id: id});
            if (store) {
                this.store = store[0].store ? store[0].store._id : null;
            }

            this.$el.find('#course').text('Select');
            this.$el.find('#batch').text('Select');
            if (id !== '') {
                dataService.getData('/franchise/center?id=' + id, {}, function (center) {
                    $('#centerCode').text(center.data.centerCode)
                });
                dataService.getData('/fcourse/center', {centerId: id}, function (courses) {
                    courses = _.map(courses.data, function (course) {
                        if(course.course) {
                            course.name = course.course.courseName;
                            course._id = course.course._id;

                        }
                        return course;
                    });
                    self.courses = courses;
                    self.responseObj['#course'] = courses;
                    self.responseObj['#batch'] = [];
                });
            } else {
                self.responseObj['#course'] = [];
                self.responseObj['#batch'] = [];
            }
        },

        selectBatch: function (centerId, courseId) {
            var self = this;
            this.$el.find('#batch').text('Select');
            if (centerId !== '' && courseId !== '') {
                dataService.getData('/vbatch/center/course', {
                    centerId: centerId,
                    courseId: courseId
                }, function (batches) {
                    batches = _.map(batches.data, function (batch) {
                        batch.name = batch.batchName;

                        return batch;
                    });
                    self.responseObj['#batch'] = batches;
                });
            } else {
                self.responseObj['#batch'] = [];
            }

        },

        getFeeTypes: function (center, course) {
            var self = this;
            var data = {center: center, course: course};
            $('.discountTab').removeClass('hide');
            var url = '/vregister/' + 'feeTypeDetails';
            dataService.postData(url, data, function (err, response) {
                self.showTotalFee(response.data.fee);
                if (response.data) {
                    self.feeTypeDetails = response.data.feeTypeDetails;
                    self.fee = response.data.fee;
                    self.totalAmtWithGst = parseInt(self.fee.centerCourseFees) + parseInt(self.fee.totalGSTAmount);
                    self.totalFeeAmount = self.fee.centerCourseFees;
                    self.feeTypeBody(self.feeTypeDetails);
                }
            })

        },
        feeTypeBody: function (feeTypeDetails) {
            feeTypeDetails.forEach(function (item) {
                item.gstAmount = item.gstAmount ? item.gstAmount.toFixed(2) : 0;
                var maxAmount = parseInt(item.fullAmount) + parseInt(item.gstAmount);
                $(".feeTypeLists").append('<tr><td class="text-left">' + item.feeTypeName + '</td><td class="text-left">' + item.feeTypePert + ' %' + '</td><td class="text-left money">' + item.fullAmountWithGST.toFixed(2) + '</td><td class="text-left money">' + item.gstAmount + '</td>' +
                    '<td class="text-left"><input type="number" class="height-25 enterAmount money" max="' + item.fullAmountWithGST.toFixed(2) + '" id="' + item._id + '" value="0"/></td></tr>')
            })
        },

        showTotalFee: function (fee) {
            var totalFee = parseInt(fee.centerCourseFees) + parseInt(fee.totalGSTAmount);
            $(".totalFee").removeClass('hide');
            $(".totalAmount").text(fee.centerCourseFees.toFixed(2));
            $(".totalGst").text(fee.totalGSTAmount.toFixed(2));
            $("#netFees").val(totalFee.toFixed(2))
            $(".netFees").text(totalFee.toFixed(2))
        },
        returnEnrollment: function () {
            $('.saveBtn').prop("disabled", false);
            var url = 'erp/' + this.contentType;
            Backbone.history.navigate(url + '/list', {trigger: true});
        },
        render: function () {
            var model = this.model.toJSON();
            var self = this;
            var $thisEl = this.$el;
            var formString = this.template({model: model});
            dataService.getData('/franchise', {}, function (centers) {
                centers = _.map(centers.data, function (center) {
                    center.name = center.centerName;
                    center._id = center._id;

                    return center;
                });
                self.centers = centers;
                self.responseObj['#center'] = centers;
            });

            dataService.getData('/vregister/years', {}, function (academics) {
                academics = _.map(academics.data, function (academic) {
                    academic.name = academic.year;
                    academic._id = academic.year;

                    return academic;
                });
                self.academic = academics;
                self.responseObj['#academic'] = academics;
                if(!_.isEmpty(academics)) {
                    var acYear = academics.filter(function(val) { return val._id == '2018-2019' } );
                    if(!_.isEmpty(acYear)) {
                        $('#academic').attr('data-id', acYear[0]._id);
                        $('#academic').text(acYear[0].name);
                    } else {
                        $('#academic').attr('data-id', 'Select');
                        $('#academic').text('Select');
                    }
                } else {
                    $('#academic').attr('data-id', 'Select');
                    $('#academic').text('Select');
                }
            });

            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.last + ' ' + employee.name.first  ;
                    return employee;
                });

                self.responseObj['#followedBy'] = employees;
            });

            populate.get('#studentDd', '/vstudents', {"isRegistration":false, count: 10000000}, 'studentName', this, true, true);
            this.$el.html(formString);
            $thisEl.find('#dateOfBirth, #billDate, #dateOfJoining').datepicker({
                changeMonth: true,
                changeYear: true,
                yearRange: '-100y:c+nn',
                maxDate: new Date(),
                minDate: null
            });

            return this;
        },

    });

    return ContentView;
});
