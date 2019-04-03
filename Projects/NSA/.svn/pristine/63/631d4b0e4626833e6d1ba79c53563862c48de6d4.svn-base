define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/EnrollMent/Registration/printInvoice.html',
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
            'click #printInfo' : 'print',
            'click .cancel' : 'afterPrint'
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
            if(value == 'DD' || value == 'Cheque'  || value == 'neft'){
                $('.billDetails').removeClass('hide');
            }else{
                $('.billDetails').addClass('hide');
            }
        },

        updateItem: function () {
            var self = this;
            var thisEl = this.$el;
            var data = {};
            var currentData = this.currentModel.toJSON();
            data.centerCourseFees = currentData.courseAmount;
            data.totalGSTAmount = currentData.gstAmount;
            var object =  thisEl.find('#createRegisterForm').serializeArray();
            data.studentId = currentData.student._id
            data.studentDetailsId = currentData.student.studentDetails._id
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
            data.batch = thisEl.find('#batch').attr('data-id');
            data.batch = (data.batch === 'Select' || !data.batch)? null : data.batch;
            data.studentGender = thisEl.find('#studentGender').attr('data-id');
            if(data.dateOfBirth){
                data.age = this.calculateAge(data.dateOfBirth);
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
            if(data.paymentMode == 'DD' || data.paymentMode == 'Cheque'  || data == 'neft'){
                var paymentModeDetails = {
                    billNo: data.billNo,
                    billAmount: data.billAmount,
                    billDate: data.billDate,
                    bankName: data.bankName,
                    paymentMode: data.paymentMode,
                };
                data.paymentModeDetails = paymentModeDetails;
            }
            data.totalInstallmentAmount = 0;
            data.isBooking = false;
            data.studentStatus =  true;
            feeTypeObjs.forEach( function (item){
                var enteredAmount = item.enteredAmount ? +item.enteredAmount : 0 ;
                data.totalInstallmentAmount += enteredAmount;
            })
            var completed = _.find(feeTypeObjs,{'completed': false});
            data.isCompleted = _.isEmpty(completed) ? true : false;
            if(data.totalInstallmentAmount == 0 && !_.isEmpty(completed)){
                return App.render({
                    type   : 'error',
                    message: "Please Enter Feetypes amount."
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
                    data.amountPaidUpto += item.paidAmount;
                    item.currentInstallmentAmount = enteredAmount ;
                })

                data.paidAmount = data.amountPaidUpto;
                var bookFee = _.find(feeTypeObjs, function(o){ return o.feeTypeName == "Book Fees"});
                if((bookFee.currentInstallmentAmount <= 0) && (bookFee.fullAmount !== bookFee.currentInstallmentAmount && data.bookingAmount <= 0)){
                    return App.render({
                        type   : 'error',
                        message: "Book Fees partial amount not allowed."
                    });
                }
                this.currentModel.save(data, {
                    put: true,
                    wait: true,
                    success: function (result) {
                        if (data.paymentMode === 'online' && !_.isEmpty(completed)) {
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
                        course.name = course.course.courseName;
                        course._id = course.course._id;

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

        showTotalFee: function(fee){
            $(".totalAmount").text(fee.centerCourseFees);
            $(".totalGst").text(fee.totalGSTAmount);
        },

        accordianSlide: function(e){
            $('.tbl-accordion-nested').each(function(){
                var thead = $(this).find('thead');
                var tbody = $(this).find('tbody');
                tbody.hide();
                thead.click(function(){
                    tbody.slideToggle();
                })
            })
        },

        print: function (e) {
            var printContents = document.getElementById('example-print').innerHTML;
            var originalContents = document.body.innerHTML;

            document.body.innerHTML = printContents;

            window.print();

            document.body.innerHTML = originalContents;
           window.location.reload();

        },

        afterPrint: function (e) {
            var url = '/#erp/print/' + (this.currentModel.toJSON()).student._id;

            Backbone.history.navigate(url, {trigger: true});
        },


        render: function (options) {
            var self = this;
            var $thisEl = this.$el;
            var formString = this.template({
                model           : this.currentModel.toJSON(),
                moment          : moment
            });
            populate.get('#center', '/franchise/', {}, 'centerName', this, true, true);

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
