define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/EnrollMent/Registration/EditTemplate.html',
    'dataService',
    'populate',
    'common',
    'moment',
    'vconstants',
    'views/EnrollMent/Registration/TopBarView'
], function (Backbone, $, _, Parent, orgTemplate, dataService, populate, common, moment, constants, topBarView) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'EnrollMent',
        actionType : 'Content',
        template   : _.template(orgTemplate),
        el         : '#content-holder',
        responseObj: {},

        initialize : function (options) {
            var self = this;
            this.startTime = options.startTime;
            this.feeTypeDetails =[];
            this.courses = [];

            this.responseObj['#studentGender'] = [
                {
                    _id : 'Male',
                    name: 'Male'
                }, {
                    _id : 'Female',
                    name: 'Female'
                }
            ];

            if (options.collection && options.modelId) {
                this.studentCollection = options.collection;
                this.currentModel = this.studentCollection.get(options.modelId)
            } else {
                this.currentModel = options.model;
            }

            this.topbarView = new topBarView({
                actionType  : 'Content',
                hideNavigate: true
            });

            this.render(options);
        },

        events: {
            'click .updateBtn'    : 'updateItem',
            'click .checkbox'   : 'checked',
            'click #startDate'  : 'changeDate',
            'click .backBtn'   : 'backEnrollment',
            'click ._circleRadioRadiance'   : 'checked',
            "keyup .enterAmount" : "enterAmount",
            'click a.goToRemove'  : 'deletePayment',
            'keyup #discountAmount': 'discountApply',
            "click .isDiscountApplicable": "isDiscountApplicable",
        },

        discountApply: function(e) {
            var data = this.currentModel.toJSON();
            var discountValue = $(e.target).val();
            if (parseInt(discountValue ? discountValue : 0) < +data.courseAmount) {
                $("#feeTypes").empty();
                if (discountValue) {
                    var afterDisc = parseInt(data.gstAmount) - parseInt(discountValue ? discountValue : 0);
                    $('#netFees').val(afterDisc.toFixed(2));
                } else {
                    discountValue = 0;
                    $('#netFees').val(data.gstAmount);
                }
                var totalGSTAmount = 0;
                var self = this;
                _.forEach(data.feeTypeDetails, function (value) {
                    value.paidAmount = 0;
                    value.gstAmount = 0;
                    value.fullAmount = ((+data.courseAmount * value.feeTypePert) / 100);
                    if (value.feeTypeIsGST) {
                        value.gstAmount = (value.fullAmount * value.feeTypeGstPercentage) / 100;
                        value.fullAmount = value.fullAmount - ((parseInt(discountValue) * value.feeTypePert) / 100);
                        totalGSTAmount += value.gstAmount
                    }
                    value.fullAmountWithGST = (value.fullAmount + value.gstAmount) || 0;
                });
                data.totalGSTAmount = totalGSTAmount;
                this.feeTypeBody(data.feeTypeDetails);
            } else {
                $('#discountAmount').val(discountValue.substr(0, discountValue.length - 1));
                discountValue = $('#discountAmount').val();
            }
            //this.totalFeeAmount = this.fee.centerCourseFees - parseInt(discountValue ? discountValue : 0);
        },

        deletePayment: function(e){
            var row = $(e.target).closest('tr');
            var date = row.data('date');
            var mode = row.data('mode');
            var amount = row.data('cash');
            var billNo = row.data('no');
            var length = row.data('length');
            var amountPaid = row.data('payamount');
            var id = row.data('id');
            var regId = row.data('reg');
            var self = this;
            var _id = row.data('_id');
            if(confirm('Are you sure want to delete ?')){
                var obj = {
                    _id: _id,
                    date: date,
                    studentId: id,
                    mode: mode,
                    billNo: billNo,
                    regId: regId,
                    amount: amount,
                    amountPaid: amountPaid,
                    length: length
                };
                dataService.deleteData('vregister/single', obj, function (err, res) {
                    if(err) {
                        self.errorNotification(err);
                    } else {
                        return App.render({
                            type   : 'notify',
                            message: 'Deleted Successfully'
                        });
                    }
                });
            } else {
                return false;
            }
            Backbone.history.loadUrl(Backbone.history.getFragment());
        },

        isDiscountApplicable: function(e){
            var checked = $(e.target).prop('checked');
            if (checked) {
                $('.discount').removeClass('hide');
            } else {
                $('.discount').addClass('hide');
            }
        },

        enterAmount : function(e){
            var self = this;
            var thisEl = this.$el;
            this.totalInstallmentAmount = 0;
            this.currentModel.toJSON().feeTypeDetails.forEach( function (item){
                var enterAmount = thisEl.find('#'+ item._id).val();
                self.totalInstallmentAmount += enterAmount ? parseInt(enterAmount) : 0;
            })
            $('#billAmount').val(this.totalInstallmentAmount);
        },

        checked : function(e) {
            var value = $(e.target).val();
            if(value == 'DD' || value == 'Cheque'  || value == 'neft' || value == 'Cash'){

                $('.billDetails').removeClass('hide');
                $('.billDetails1').removeClass('hide');

                if(value == 'Cheque'){
                    $('#lab').text("Enter Cheque No");
                }
                else if(value == 'Cash') {
                    $('#lab').text("Enter Denominations");
                    $('.billDetails1').addClass('hide');
                }
                else{
                    $('#lab').text("Enter Bill No");
                }

            }else{
                $('.billDetails').addClass('hide');
                $('.billDetails1').addClass('hide');
            }
        },

        updateItem: function () {
            var self = this;
            var thisEl = this.$el;
            var data = {};
            var enterAmount = 0;
            var currentData = JSON.parse(JSON.stringify(this.currentModel.toJSON()));
            data.centerCourseFees = currentData.courseAmount;
            data.totalGSTAmount = currentData.gstAmount;
            var object =  thisEl.find('#createRegisterForm').serializeArray();
            data.studentId = currentData.student._id;
            data.registrationNo = currentData.student.registrationNo;
            data.studentDetailsId = currentData.student.studentDetails ? currentData.studentDetails._id : null;
            $(object).each(function(i, field){
                data[field.name] = field.value;
            });
            var feeTypeObjs =[];
            currentData.feeTypeDetails.forEach( function (item){
                var enterAmount = thisEl.find('#'+ item._id).val();
                item.enteredAmount = enterAmount ? +enterAmount : 0;
                feeTypeObjs.push(item);
            });
            data.center = thisEl.find('#center').attr('data-id')
            data.course = thisEl.find('#course').attr('data-id')
            data.academicYear =thisEl.find('#academic').attr('data-id');
            data.followedBy = thisEl.find('#followedBy').attr('data-id')
            data.batch = thisEl.find('#batch').attr('data-id');
            data.batch = (data.batch === 'Select' || !data.batch)? null : data.batch;
            data.studentGender = thisEl.find('#studentGender').attr('data-id');
            data.discountAmount = thisEl.find('#discountAmount').val();
            data.DateOfJoining = thisEl.find('#dateOfJoining').val();
            if(data.dateOfBirth){
                data.age = this.calculateAge(data.dateOfBirth);
            }
            if(!data.DateOfJoining){
                return App.render({
                    type   : 'error',
                    message: 'Date of joining cannot be empty'
                });
            }
            if (!data.studentName) {
                return App.render({
                    type   : 'error',
                    message: "Name field can't be empty."
                });
            }
            if(!data.center || data.center === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please select center."
                });
            }

            if(!data.academicYear || data.academicYear === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please select Academic Year."
                });
            }
            if(!data.course || data.course === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please Select course."
                });
            }
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.studentEmail)) {
                return App.render({
                    type   : 'error',
                    message: "Please provide valid email."
                });
            }
            if (!data.studentPhone.match(/^\d{10}$/)) {
                return App.render({
                    type   : 'error',
                    message: "Please enter 10 digits number."
                });
            }
            if ((data.studentPassword.length < 6) && (data.originalPassword.length < 6)) {
                return App.render({
                    type   : 'error',
                    message: "Please Enter password more than 6 characters ."
                });
            }
            if (data.studentPassword !== data.originalPassword) {
                return App.render({
                    type   : 'error',
                    message: "Please Enter correct password ."
                });
            }
            if(!data.batch || data.batch === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please Select batch."
                });
            }

            if(data.paymentMode == 'DD' || data.paymentMode == 'Cheque'  || data == 'neft' || data.paymentMode == 'Cash'){
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

            data.totalInstallmentAmount = 0;
            data.studentStatus =  true;
            feeTypeObjs.forEach( function (item){
                var enteredAmount = item.enteredAmount ? +item.enteredAmount : 0 ;
                data.totalInstallmentAmount += enteredAmount;
            })
            var completed = _.find(feeTypeObjs,{'completed': false});
            data.isCompleted = _.isEmpty(completed) ? true : false;

            if(data.totalInstallmentAmount == 0){
                return App.render({
                    type   : 'error',
                    message: "Please Enter Fee types amount."
                });
            }
            var validation = this.feeMaxValidation(currentData.feeTypeDetails);
            if(!_.isEmpty(validation)){
                return App.render({
                    type   : 'error',
                    message: validation[0] + " Enter less than remaining amount."
                })
            } else {
                data.isRegistartion = true;
                data.feeTypeObjs = feeTypeObjs;
                data.amountPaidUpto = 0;
                data.totalInstallmentAmount = 0;
                feeTypeObjs.forEach( function (item){
                    var enteredAmount = item.enteredAmount ? +item.enteredAmount : 0 ;
                    item.paidAmount += enteredAmount;
                    data.totalInstallmentAmount += enteredAmount;
                    item.completed = (+item.fullAmountWithGST - (+item.paidAmount + +item.adjustableAmt) <= 0) ? true: false;
                    item.isAdjusted = (+item.adjustableAmt) > 0 ? true: false;
                    data.amountPaidUpto += item.paidAmount;
                    item.currentInstallmentAmount = enteredAmount ;
                })
                data.paidAmount = data.amountPaidUpto;
                var bookFee = _.find(feeTypeObjs, function(o){ return o.feeTypeName == "Book Fees"});
                data.bookingAmount = currentData.bookingAmount ? currentData.bookingAmount : 0;

                if((bookFee.currentInstallmentAmount != 0) && (bookFee.fullAmount !== (bookFee.currentInstallmentAmount + bookFee.adjustableAmt))){

                    return App.render({
                        type   : 'error',
                        message: "Book Fees partial amount not allowed."
                    });
                }

            }

            if (currentData.productInfo) {
                var $thisEl = this.$el;
                var courseId = $thisEl.find('#course').attr('data-id');
                var product = _.filter(this.courses, {'_id': courseId})
                this.productInfo = {};
                if (product) {
                    data.productInfo = product[0].product;
                    dataService.getData('/priceList/getPrices', {
                        product: data.productInfo[0]._id,
                        priceList: "58109ae869b3249417f74baf",
                        quantity: 1
                    }, function (response) {
                        data.productInfo.unitPrice = response.price;

                        self.currentModel.save(data, {
                            put: true,
                            wait: true,
                            success: function (result) {
                                if ((data.paymentMode).toLowerCase() === 'online' && !_.isEmpty(completed)) {
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
                                }
                            },
                            error: function (model, xhr) {
                                self.errorNotification(xhr);
                            }
                        });
                        Backbone.history.loadUrl(Backbone.history.getFragment());
                    });
                }
            }
        },

        feeMaxValidation: function(fee) {
            var thisEl = this.$el;
            var nonValidFees = [];
            fee.forEach( function (item){
                var enterAmount = thisEl.find('#'+ item._id).val();
                enterAmount = enterAmount ? +enterAmount : 0;
                var maxAmount = +(thisEl.find('#'+ item._id).attr('max'));
                if(enterAmount > maxAmount){
                    nonValidFees.push(item.feeTypeName);
                }
            });
            return nonValidFees;
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
            var centerId = $thisEl.find('#center').attr('data-id');
            var courseId = $thisEl.find('#course').attr('data-id');
            var empId = $thisEl.find('#followedBy').attr('data-id');
            if (holder.attr('id') === 'center') {
                $("#feeTypes").empty();
                this.selectCenter(centerId);
            }
            if (holder.attr('id') === 'course') {
                $("#feeTypes").empty();
                this.selectBatch(centerId, courseId);
            }
        },
        calculateAge: function(birthday) { // birthday is a date
            var dofb = new Date(birthday);
            var now = new Date();
            return now.getFullYear() - dofb.getFullYear();
        },

        changeDate: function () {
            var model = this.model.toJSON();

            if (model.startDate) {
                App.render({
                    type   : 'error',
                    message: 'You can set start date only 1 time and this value cannot be changed'
                });
            }
        },
        selectCenter: function (id) {
            var self = this;
            this.$el.find('#course').text('Select');
            this.$el.find('#batch').text('Select');
            if (id !== '') {
                dataService.getData('/fcourse/center', {centerId: id}, function (courses) {
                    courses = _.map(courses.data, function (course) {
                        if(course.course) {
                            course.name = course.course.courseName;
                            course._id = course.course._id;
                        }


                        return course;
                    });
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
            if (centerId !== '' && courseId !=='') {
                dataService.getData('/vbatch/center/course', {centerId: centerId, courseId: courseId}, function (batches) {
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
                    '<td class="text-left">' + item.paidAmount +'</td>'+ '<td class="text-left">' + item.currentInstallmentAmount + '</td>'+'<td class="text-left">' + item.fullAmount + '</td>'+'<td class="text-left"><input type="number" class="height-25 enterAmount money" max="' + item.fullAmountWithGST.toFixed(2) + '" id="' + item._id + '" value="0"/></td></tr>')

            })
        },
        showTotalFee: function(fee){
            $(".totalAmount").text(fee.centerCourseFees);
            $(".totalGst").text(fee.totalGSTAmount);
        },

        accordianSlide: function(e){
            $('.tbl-accordion-nested').each(function(){
                var thead = $(this).find('.showDetails');
                var tbody = $(this).find('tbody');
                tbody.hide();
                thead.click(function(){
                    tbody.slideToggle();
                })
            })
        },


        render: function (options) {
            var self = this;
            var $thisEl = this.$el;
            var formString = this.template({
                model           : this.currentModel.toJSON()
            });
            populate.get('#center', '/franchise/', {}, 'centerName', this, true, true)

            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.last + ' ' + employee.name.first  ;
                    return employee;
                });
                self.employee = employees;
                self.responseObj['#followedBy'] = employees;
            });

            dataService.getData('/vcourse/', {category: 'COURSES'}, function (courses) {
                courses = _.map(courses.data, function (course) {
                    course.name = course.courseName;
                    return course;
                });
                self.responseObj['#course'] = courses;
                self.courses = courses
            });

            //populate.get('#course', '/vcourse/', {category: 'COURSES'}, 'courseName', this, true);


            dataService.getData('/vregister/years', {}, function (academics) {
                academics = _.map(academics.data, function (academic) {
                    academic.name = academic.year;
                    academic._id = academic.year;

                    return academic;
                });
                self.academic = academics;
                self.responseObj['#academic'] = academics;
            });
            //populate.get('#academic', '/vregister/years', {}, 'year', this, true, true);

            this.$el.html(formString);
            $thisEl.find('#dateOfBirth').datepicker({
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : new Date(),
                minDate    : null
            });
            $thisEl.find('#dateOfJoining').datepicker({
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                minDate    : null
            });
            $thisEl.find('#billDate').datepicker({
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : new Date(),
                minDate    : null
            });
            this.accordianSlide(null)
            var url = 'erp/' + this.contentType;

            return this;
        },

        backEnrollment: function () {
            var url = 'erp/' + this.contentType;

            Backbone.history.navigate(url, {trigger: true});
        },

    });

    return ContentView;
});
