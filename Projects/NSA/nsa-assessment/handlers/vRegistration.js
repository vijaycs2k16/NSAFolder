/**
 * Created by senthil on 30/01/18.
 */
var mongoose = require('mongoose'),
    studentHandler = require('./vStudent')
TransactionHandler = require('../handlers/vTransaction')
UserHandler = require('./user');
CustomerHandler = require('./customer');
feeTypesHandler = require('./vFeeTypes')
batchHandler = require('./vBatch')
studentFeeDetailsHandler = require('./vStudentFeeDetails')
transactionHandler = require('./vTransaction')
feesHandler = require('./vFees')
feeCardHandler = require('./vFeeCard')
franchiseCourseHandler = require('./vFranCourse')
courseHandler = require('./vCourse')
async = require('async')
crypto = require('../helpers/crypto'),
    serviceUtils = require('../utils/serviceUtils')
dateUtils = require('../utils/dateService')
customerConverter = require('../converters/customerConverter'),
    userConverter = require('../converters/userConverter'),
    paymentHandler = require('./payment'),
    invoiceHandler = require('./invoices'),
    QuotationHandler = require('../handlers/order'),
    utils = require('../services/utils'),
    notificationHandler = require('../handlers/vNotifications');
_ = require('lodash');
var mainConstants = require('../constants/mainConstants');
var Student = mongoose.Schemas.Student;
var ObjectId = mongoose.Types.ObjectId;

var Module = function (models) {
    'use strict';
    var CustomerSchema = mongoose.Schemas.Customer;
    var academicSchema = mongoose.Schemas.academic;
    var transactionSchema = mongoose.Schemas.Transactions;
    var examScheduleSchema = mongoose.Schemas.ExamSchedule;
    var examStudentSchema = mongoose.Schemas.StudentExam;
    var NotificationHandler = new notificationHandler(models, null);
    var student = new studentHandler(models);
    var feeTypes = new feeTypesHandler(models);
    var customer = new CustomerHandler(models);
    var user = new UserHandler(null, models);
    var payment = new paymentHandler(models);
    var invoice = new invoiceHandler(models);
    var batch = new batchHandler(models);
    var transaction = new transactionHandler(models);
    var studentFeeDetails = new studentFeeDetailsHandler(models);
    var fees = new feesHandler(models);
    var franchise = new franchiseCourseHandler(models);
    var course = new courseHandler(models);
    var order = new QuotationHandler(models, null);
    var _transactionHandler = new TransactionHandler(models, null);

    this.register = function (req, res, next) {
        var data = {};
        req.body.users = [{"phoneNo": req.body.studentPhone}];
        req.body.notify = {"sms" :global.config.register.sms};
        req.body.status = true;
        var Users = mongoose.Schemas.Users;
        var Model = models.get('CRM', 'Users', Users);
        Model.find({ email: req.body.studentEmail }, function (err, response) {
            if(err)
                next(err, null);
            else {
                if(!_.isEmpty(response)){
                    var msg = new Error();
                    msg.message = 'Email Id Already Exists';
                    next(msg, null);
                } else {
                    async.waterfall([
                            course.getCourseById.bind(null, req, data),
                            student.getStudentCount.bind(),
                            student.addStudentDetails.bind(),
                            student.newStudentRegister.bind(),
                            constructStudentFeeDetails.bind(),
                            customerConverter.createCustomerObj.bind(),
                            userConverter.createUserObj.bind(),
                            customer.createStudentCustomer.bind(),
                            user.createStudentUser.bind(),
                            studentFeeDetails.addStudentsFeeDetails.bind(),
                            async.apply(NotificationHandler.constructRegisterUsers, req),
                            NotificationHandler.sendNotification.bind()
                        ],
                        function (err, req, result) {
                            if (err) {
                                return next(err);
                            }
                            batch.getBatch(req, function (err, batch) {
                                result.batch = batch
                                if (err) {
                                    return next(err);
                                } else {
                                    utils.testPressUserCreate(req, batch, function (err, result2) {
                                        if ((req.body.paymentMode.toString().indexOf('Online') > -1 || req.body.paymentMode.toString().indexOf('online') > -1)) {
                                            paymentRegister(req, result, function (err, result1) {
                                                orderFlow(req, result, function (err, result) {
                                                    res.status(200).send({data: result1});
                                                })

                                            });
                                        } else {
                                            orderFlow(req, result, function (err, result) {
                                                var message = "";
                                                if (err) {
                                                    message = " but unable to create user in LMS ";
                                                }
                                                res.status(200).send({message: 'User saved successfully in ERP' + message});
                                            })

                                        }
                                    });

                                }
                            })
                        });
                }
            }
        });
    };

    this.mobileRegister = function (req, res, next) {
        var data = {};
        req.body.users = [{"phoneNo": req.body.studentPhone}];
        req.body.defaultStudent = true;
        var Users = mongoose.Schemas.Users;
        req.session.lastDb = 'CRM';
        req.body.center = '5bae1cfc888ffb44cb884aee';
        req.body.centerCode = 'VAC29';
        req.body.batch = '5bae1d53888ffb44cb884af1';
        req.body.interestCourse = req.body.course;
        req.body.course = '5bae1d2b888ffb44cb884af0';
        var Model = models.get('CRM', 'Users', Users);
        Model.find({ login: req.body.studentPhone }, function (err, response) {
            if(err)
                next(err, null);
            else {
                if (!_.isEmpty(response)) {
                    var msg = new Error();
                    msg.message = 'PhoneNo Already Exists';
                    next(msg, null);
                } else {
                    async.waterfall([
                            course.getCourseById.bind(null, req, data),
                            student.getStudentCount.bind(),
                            student.addStudentDetails.bind(),
                            student.newStudentRegister.bind(),
                            customerConverter.createCustomerObj.bind(),
                            userConverter.createUserObj.bind(),
                            customer.createStudentCustomer.bind(),
                            user.createStudentUser.bind(),
                            getExamStudent.bind(),
                            saveExamStudent.bind()
                        ],
                        function (err, req, result) {
                            if (err) {
                                return next(err);
                            }
                            req.body.login = req.body.studentPhone;
                            req.body.pass = req.body.originalPassword;
                            req.body.dbId = 'CRM';
                            req.body.rememberMe = "true";
                            user.login(req, res, next)
                            //res.status(200).send({success: true});
                            //res.status(200).send('Register Successfully');
                        }
                    );
                }
            }
        });
    };


    function saveExamStudent(req, data, callback) {
        var Model = models.get(req.session.lastDb, 'StudentExam', examStudentSchema);
        var bulk = Model.collection.initializeOrderedBulkOp();
        if(!_.isEmpty(data.schedule)) {
            async.each(data.schedule, function (value, cb) {
                bulk.insert({
                    examId: value._id,
                    dateBeginAhead: new Date(value.dateBeginAhead),
                    student: ObjectId(data.studentId),
                    examMode: true,
                    score: 0,
                    isCorrected: false,
                    isSubmit: false
                })
                cb(null, bulk);
            }, function (err) {
                if (err) {
                    return next(err);
                }
                bulk.execute(function (err, result) {
                    callback(err, req, result);
                });
            });
        } else {
            callback(null, req, data);
        }
    }


    function getExamStudent(req, data, cb) {
        var Model = models.get(req.session.lastDb, 'ExamSchedule', examScheduleSchema);
        var findQuery = {
            center: ObjectId(req.body.center),
            course: ObjectId(req.body.course),
            batch: ObjectId(req.body.batch)
        }
        Model.find(findQuery).exec(function (err, result) {
            if (err) {
                return next(err);
            }
            data.schedule = result;
            cb(err, req, data);
        });
    }


    function constructUsers(req, data, callback) {
        var arr = [];
        var body = req.body;
        async.each(body.users, function (data, cb) {
            var obj = {};
            obj.to = data.phoneNo;
            obj.message = body.smsTemplateMsg;
            arr.push(obj);
            cb(null, arr);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
        });
        data.users = arr;
        callback(null, req, data);
    }

    function sendNotification(req, data, callback) {
        async.parallel({
            sms: sendSMS.bind(null, req, data)
        }, function (err, response, body) {
            if(err){
                callback(err, null);
            } else {
                data.smsObj = response.sms;
                callback(null, req, data);
            }
        });
    }
    this.sendNotification = sendNotification;

    function orderFlow(req, data, callback) {
        var shallow = _.clone(data);
        async.parallel({
            //bookFee : bookFee.bind(null, req, shallow),
            otherFee: otherFee.bind(null, req, data)
        }, function (err, result) {
            callback(err, result);
        })


    }


    function getCustomer(req, data, cb) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var queryObject = {};
        if(data.studentId) {
            queryObject.isStudent = true;
            queryObject.email = req.body.studentEmail;
        }

        Customers
            .findOne(queryObject)
            .exec(function (err, customer) {
                data.createStudentCustomer = customer;
                cb(err, req, data);
            });

    }


    function bookFee(req, data, callback) {
        var body = req.body;
        data.isRegisterFee = false;
        var bookFeeObj = _.filter(body.feeTypeObjs, {"_id": "5a8035406029abc2ae19d698"});
        if(!_.isEmpty(bookFeeObj) && (bookFeeObj[0].paidAmount > 0 && !bookFeeObj[0].completed)) {
            data.bookFee = bookFeeObj[0].fullAmountWithGST;
            async.waterfall([
                _transactionHandler.getTransactionsBySid.bind(null, req, data),
                customerConverter.createOrderObj.bind(),
                order.placeOrder.bind(),
                student.receiveInvoice.bind(),
                customerConverter.createPaymentObj.bind(),
                payment.createRegisterPayement.bind(),
                invoice.approveRegisterInvoice.bind(),
                saveRegisterTrans.bind()
            ], function (err, result) {
                callback(err, data)
            });

        } else {
            callback(null, data)
        }
    }

    function saveRegisterTrans(req, data, callback) {
        if(data.trans.length > 0) {
            callback(null, []);
        } else {
            var transSchema = mongoose.Schemas.Transactions;
            var TransSchema = models.get('CRM', 'Transactions', transSchema);
            var body = {
                student  : data.studentId,
                order    : data.order._id || null,
                payment  : data.payment._id || null,
                invoice  : data.invoiceId || null,
                studentFeeDetails : data.studentFeeDetails._id || null,
                registrationNo : req.body.registrationNo,
                isRegisterFee: data.isRegisterFee

            }
            var transSchemaModel = new TransSchema(body);
            transSchemaModel.save(function (err, result) {
                if(err){
                    callback(err, null);
                } else {
                    callback(null, result);
                }
            });
        }

    }

    function calculateAmount(body, req, totalAmount, totalGstAmount, products, gstAmount, total, data) {
        var isBookFee = false;
        _.forEach(body.feeTypeObjs, function (value, index) {
            var taxes = [];
            var product = {};
            if (+(value.currentInstallmentAmount) > 0) {
                if (+(value.gstAmount) > 0) {
                    gstAmount = gstAmount + ((+(value.currentInstallmentAmount) * +(value.gstAmount)) / +(value.fullAmountWithGST))
                }
                total = total + +(value.currentInstallmentAmount);

                /*if (value._id != "5a8035406029abc2ae19d698") {
                 total = total + +(value.currentInstallmentAmount);
                 }*/
            }

            if (+(value.gstAmount) > 0) {
                taxes = [{"taxCode": "589894b749cd23e02ca7c323", "tax": +(value.gstAmount) * 100}]
                gstAmount = gstAmount + ((+(value.currentInstallmentAmount) * +(value.gstAmount)) / +(value.fullAmountWithGST))
            }

            product = {
                "product": value._id,
                "unitPrice": +(value.fullAmount) * 100,
                "costPrice": null,
                "warehouse": req.body.store ? req.body.store : mainConstants.WAREHOUSE,
                "quantity": "1",
                "taxes": taxes,
                "description": value.feeTypeDesc,
                "subTotal": +(value.fullAmountWithGST) * 100,
                "creditAccount": mainConstants.INVENTORY,
                "debitAccount": mainConstants.COGS,
                "totalTaxes": 0
            }


            totalAmount = totalAmount + +(value.fullAmountWithGST);
            totalGstAmount = totalGstAmount + +(value.gstAmount);
            if (value._id == "5a8035406029abc2ae19d698") {
                var productInfo = req.body.productInfo;
                if(productInfo) {
                    _.forEach(productInfo, function (val, index) {
                        product = {
                            "product": val._id,
                            "unitPrice": +(value.fullAmount) * 100,
                            "name": "Book Fee",
                            "costPrice": null,
                            "warehouse": req.body.store ? req.body.store : mainConstants.WAREHOUSE,
                            "quantity": "1",
                            "taxes": [],
                            "description": "Book Fee",
                            "subTotal": +(value.fullAmountWithGST/productInfo.length) * 100,
                            "creditAccount": mainConstants.INVENTORY,
                            "debitAccount": mainConstants.COGS,
                            "totalTaxes": 0
                        }
                        products.push(product);
                    })

                }
                isBookFee = +(value.currentInstallmentAmount) > 0 ? true : false;
                isBookFee = !isBookFee ? value.completed : isBookFee;
            }



            if(index == (body.feeTypeObjs.length - 1)) {
                data.total = total;
                data.totalPaidAmount = total;
                data.gstAmount = gstAmount;
                data.totalGstAmount = totalGstAmount;
                data.totalAmount = totalAmount;
                data.isRegisterFee = true;
                data.feeProducts = products;
                data.regFee = true;
                data.isBookFee = isBookFee;
            }
        });

    }

    function otherFee(req, data, callback) {
        var body = req.body;
        var total = 0;
        var gstAmount = 0;
        var totalAmount = 0;
        var products = [];
        var totalGstAmount = 0;
        calculateAmount(body, req, totalAmount, totalGstAmount, products, gstAmount, total, data);
        if(data.total > 0) {
            async.waterfall([
                _transactionHandler.getTransactionsBySid.bind(null, req, data),
                customerConverter.createOtherOrderObj.bind(),
                order.placeOrder.bind(),
                student.receiveInvoice.bind(),
                customerConverter.createRegisterPaymentObj.bind(),
                payment.createRegisterPayement.bind(),
                invoice.approveRegisterInvoice.bind(),
                saveRegisterTrans.bind()
            ], function (err, result) {
                callback(err, data)
            })

        } else {
            callback(null, data)
        }
    }

    this.update = function (req, res, next) {
        delete req.body._id
        async.waterfall([
                student.updateStudentDetails.bind(null, req, {}),
                student.updateStudent.bind(),
                constructStudentFeeDetails.bind(),
                getCustomer.bind(),
                customer.updateCust.bind(),
                studentFeeDetails.addFeeInstallment.bind(),
                studentFeeDetails.updateStudentsFee.bind(),
            ],
            function (err, result) {
                if (err) {
                    return next(err);
                }
                batch.getBatch(req, function (err, batch) {
                    result.batch = batch;
                    if (err) {
                        return next(err);
                    } else {
                        if ((req.body.paymentMode.toString().indexOf('Online') > -1 || req.body.paymentMode.toString().indexOf('online') > -1)) {
                            paymentRegister(req, result, function (err, result1) {
                                orderFlow(req, result, function (err, test) {
                                    res.status(200).send({data: result1});
                                })
                            });
                        } else {
                            orderFlow(req, result, function (err, result) {
                                var message = "";
                                if (err) {
                                    message = " but unable to create user in LMS ";
                                }
                                res.status(200).send({data: result});
                            });

                            //res.status(200).send({message: 'User saved successfully in ERP' + message});
                        }
                    }
                })
            });

    };

    function getStudentFeeDetailsObj(body, callback) {
        var studentDetails = mongoose.Schemas.StudentFeeDetails;
        var Model = models.get('CRM', 'StudentFeeDetails', studentDetails);
        Model.find({ _id: body.id }).populate({path: 'student'}).exec(function (err, data) {
            if(err)
                callback(err, null);
            else
                callback(null, body, data[0]);
        });
    }

    function deleteUsers(body, data, callback) {
        var Users = mongoose.Schemas.Users;
        var Model = models.get('CRM', 'Users', Users);
        if((data && !_.isUndefined(data.student)) || body.studentId){
            Model.remove({ student: data && !_.isUndefined(data.student) ? data.student._id : body.studentId }, function (err, res) {
                if(err)
                    callback(err, null);
                else
                    callback(null, body, data)
            });
        } else {
            callback(null, body, data)
        }
    }

    function deleteCustomers(body, data, callback) {
        var Users = mongoose.Schemas.Customer;
        var Customers = models.get('CRM', 'Customers', Users);
        if(data && !_.isUndefined(data.student)) {
            Customers.remove({ email: data.student.studentEmail }, function (err, res) {
                if(err)
                    callback(err, null);
                else
                    callback(null, body, data)
            });
        } else {
            callback(null, body, data)
        }
    }

    function deleteStudentDetailsById(body, data, callback) {
        var studentDetails = mongoose.Schemas.StudentDetails;
        var Model = models.get('CRM', 'StudentDetails', studentDetails);
        if(data && !_.isUndefined(data.student)) {
            Model.remove({ _id: data.student.studentDetails }, function (err, res) {
                if(err)
                    callback(err, null);
                else
                    callback(null, body, data)
            });
        } else {
            callback(null, body, data)
        }
    }

    function deleteStudentObj(body, data, callback) {
        var student = mongoose.Schemas.Student;
        var Model = models.get('CRM', 'Student', student);
        if((data && !_.isUndefined(data.student)) || body.studentId) {
            Model.remove({ _id: data && !_.isUndefined(data.student) ? data.student._id : body.studentId }, function (err, res) {
                if(err)
                    callback(err, null);
                else
                    callback(null, body, data)
            });
        } else {
            callback(null, body, data)
        }
    }

    function deleteStudentFeeDetailsObj(body, data, callback) {
        var studentDetails = mongoose.Schemas.StudentFeeDetails;
        var Model = models.get('CRM', 'StudentFeeDetails', studentDetails);
        Model.remove({ _id: body.id }, function (err, res) {
            if(err)
                callback(err, null);
            else
                callback(null, data)
        });
    }

    this.deleteRegistration = function (req, res, next) {
        var body = req.body;
        if(!body.status){
            async.waterfall([
                getStudentFeeDetailsObj.bind(null, body),
                deleteUsers.bind(),
                deleteCustomers.bind(),
                deleteStudentDetailsById.bind(),
                deleteStudentObj.bind(),
                deleteStudentFeeDetailsObj.bind()
            ], function (err, response) {
                if(err)
                    next(err);
                else
                    res.status(200).send({ message: 'Deleted Successfully' });
            })
        } else {
            async.waterfall([
                geAllTransactionDetails.bind(null, req),
                getAllPaymentDetails.bind()
            ], function (err, response) {
                if(err){
                    next(err);
                } else {
                    if(!_.isEmpty(response)){
                        async.waterfall([
                            deleteStudent.bind(null, req, response),
                            deleteStudentDetails.bind(),
                            deleteStudentFeeDetails.bind(),
                            deleteUsersDetails.bind(),
                            deleteCustomers.bind(),
                            deleteOrders.bind(),
                            deleteTransaction.bind(),
                            deleteJournalEntries.bind(),
                            deletePayments.bind(),
                            deleteInvoice.bind(),
                        ], function (err, data) {
                            if(err)
                                next(err);
                            else
                                res.status(200).send({ message: 'Deleted Successfully' });
                        })
                    } else {
                        res.status(400).send({ message: 'Delete failed' });
                    }
                }

            })
        }
    };

    function geAllTransactionDetails(req, callback) {
        var body = req.body;
        var findObj = !_.isEmpty(body.studentId) ? { student: body.studentId } : { studentFeeDetails: body.id };
        var Model = models.get('CRM', 'Transactions', transactionSchema);
        Model.find(findObj)
            .populate({path : 'student'})
            .populate({path : 'studentFeeDetails'})
            .populate({path : 'order'})
            .populate({path : 'payment'})
            .populate({path : 'invoice'}).exec(function (err, result) {
            if(err)
                callback(err, null);
            else
                callback(null, req, result[0]);
        })
    }

    function getAllPaymentDetails(req, data, callback) {
        var body = req.body;
        var pay = mongoose.Schemas.Payment;
        var Model = models.get('CRM', 'Payment', pay);
        if((data && !_.isUndefined(data.student)) || body.studentId) {
            var findObj = data && !_.isUndefined(data.student) ? { student: data.student._id } : { student: body.studentId };
            Model.find(findObj, function (err, res) {
                if(err)
                    callback(err, null);
                else {
                    if(data){
                        data.AllPayments = res;
                        callback(null, data);
                    } else {
                        var paymentObj = {};
                        paymentObj.AllPayments = res;
                        callback(null, paymentObj);
                    }
                }
            });
        } else {
            callback(null, []);
        }
    }

    function deleteStudent(req, data, callback) {
        var student = mongoose.Schemas.Student;
        var Model = models.get('CRM', 'Student', student);
        if((data && !_.isUndefined(data.student)) || req.body.studentId) {
            var query = data && !_.isUndefined(data.student) ? { _id: data.student._id } : { _id: req.body.studentId };
            Model.remove(query, function (err, res) {
                if(err)
                    callback(err, null);
                else
                    callback(null, req, data)
            });
        } else {
            callback(null, req, data)
        }
    }

    function deleteStudentDetails(req, data, callback) {
        var studentDetails = mongoose.Schemas.StudentDetails;
        var Model = models.get('CRM', 'StudentDetails', studentDetails);
        if(data && !_.isUndefined(data.student)){
            Model.remove({ _id: data.student.studentDetails }, function (err, res) {
                if(err)
                    callback(err, null);
                else
                    callback(null, req, data)
            });
        } else {
            callback(null, req, data)
        }
    }

    function deleteStudentFeeDetails(req, data, callback) {
        var studentDetails = mongoose.Schemas.StudentFeeDetails;
        var Model = models.get('CRM', 'StudentFeeDetails', studentDetails);
        if((data && !_.isUndefined(data.student)) || req.body.id){
            var findObj = data && !_.isUndefined(data.student) ? { student: data.student._id } : { _id: req.body.id };
            Model.remove(findObj, function (err, res) {
                if(err)
                    callback(err, null);
                else
                    callback(null, req, data)
            });
        } else {
            callback(null, req, data)
        }
    }

    function deleteUsersDetails(req, data, callback) {
        var Users = mongoose.Schemas.Users;
        var Model = models.get('CRM', 'Users', Users);
        if((data && !_.isUndefined(data.student)) || req.body.studentId) {
            Model.remove(data && !_.isUndefined(data.student) ? { student: data.student._id } : { student: req.body.studentId }, function (err, res) {
                if (err)
                    callback(err, null);
                else
                    callback(null, req, data)
            });
        } else {
            callback(null, req, data)
        }
    }

    function deleteTransaction(req, data, callback) {
        var trans = mongoose.Schemas.Transactions;
        var Model = models.get('CRM', 'Transactions', trans);
        if((data && !_.isUndefined(data.student)) || req.body.studentId) {
            var findObj = data && !_.isUndefined(data.student) ? {student: data.student._id} : {student: req.body.studentId};
            Model.remove(findObj, function (err, res) {
                if (err)
                    callback(err, null);
                else
                    callback(null, req, data)
            });
        } else {
            callback(null, req, data)
        }
    }

    function deleteOrders(req, data, callback) {
        var order = mongoose.Schemas.Order;
        var Model = models.get('CRM', 'Order', order);
        if((data && !_.isUndefined(data.order)) || req.body.studentId) {
            var findObj = data && !_.isUndefined(data.order) ? {_id: data.order._id} : {student: req.body.studentId};
            Model.remove(findObj, function (err, res) {
                if (err)
                    callback(err, null);
                else
                    callback(null, req, data)
            });
        } else {
            callback(null, req, data)
        }
    }

    function deleteInvoice(req, data, callback) {
        var invoice = mongoose.Schemas.Invoice;
        var Model = models.get('CRM', 'Invoice', invoice);
        if(data && !_.isUndefined(data.invoice)) {
            Model.remove({_id: data.invoice._id}, function (err, res) {
                if (err)
                    callback(err, null);
                else
                    callback(null, res)
            });
        } else {
            callback(null, {})
        }
    }

    function deletePayments(req, data, callback) {
        var Payment = mongoose.Schemas.Payment;
        var Model = models.get('CRM', 'Payment', Payment);
        if((data && !_.isUndefined(data.student)) || req.body.studentId) {
            var findObj = data && !_.isUndefined(data.student) ? {student: data.student._id} : {student: req.body.studentId};
            Model.remove(findObj, function (err, res) {
                if (err)
                    callback(err, null);
                else
                    callback(null, req, data);
            });
        } else {
            callback(null, req, data);
        }
    }

    function deleteJournalEntries(req, data, callback) {
        async.parallel([
            deleteAllPaymentsById.bind(null, req, data),
            deleteAllInvoicesById.bind(null, req, data)
        ], function(err, res) {
            if(err)
                callback(err, null);
            else
                callback(null, req, data);
        })
    }

    function deleteAllInvoicesById(req, Obj, callback) {
        var journal = mongoose.Schemas.journalEntry;
        var Model = models.get('CRM', 'journalEntry', journal);
        if(Obj && !_.isUndefined(Obj.AllPayments)) {
            Model.remove({ 'sourceDocument._id': Obj.AllPayments[0].invoice }, function (err, res) {
                if(err)
                    callback(err, null);
                else
                    callback(null, res);
            });
        } else {
            callback(null, {});
        }
    }

    function deleteAllPaymentsById(req, Obj, callback) {
        var journal = mongoose.Schemas.journalEntry;
        var Model = models.get('CRM', 'journalEntry', journal);
        if(Obj && !_.isUndefined(Obj.AllPayments)) {
            var ids = _.map(Obj.AllPayments, '_id');
            Model.remove({ 'sourceDocument._id': { $in: ids } }, function (err, res) {
                if(err)
                    callback(err, null);
                else
                    callback(null, res);
            });
        } else {
            callback(null, {});
        }
    }

    this.deleteSinglePaymentDetails = function (req, res, next) {
        var body = req.body;
        async.waterfall([
            getStudentFeeDetailsById.bind(null, body),
            constructUpdateStudentInstallments.bind()
        ], function (err, data) {
            if(err){
                next(err);
            } else {
                async.waterfall([
                    getAllPaymentsObj.bind(null, body, data),
                    updateInvoiceDetails.bind(),
                    deleteJournalEntriesById.bind(),
                    deletePaymentsById.bind(),
                    updateStudentFeeDetails.bind()
                ], function (err, response) {
                    if(err) {
                        next(err);
                    } else if(body.length === 1) {
                        async.waterfall([
                            geAllTransactionDetails.bind(null, req),
                            deleteInvoiceInJournalEntires.bind()
                        ], function (err, data) {
                            if(err){
                                next(err);
                            } else {
                                async.waterfall([
                                    deleteTransaction.bind(null, req, data),
                                    deleteOrders.bind(),
                                    deleteInvoice.bind(),
                                ], function (err, val) {
                                    if(err){
                                        next(err);
                                    } else {
                                        res.status(200).send('Deleted Successfully');
                                    }
                                })
                            }
                        })
                    } else {
                        res.status(200).send('Deleted Successfully');
                    }
                })
            }
        })
    };

    function deleteInvoiceInJournalEntires(req, data, callback) {
        var journal = mongoose.Schemas.journalEntry;
        var Model = models.get('CRM', 'journalEntry', journal);
        Model.remove({ 'sourceDocument._id': data.invoice._id }).exec(function (err, response) {
            if(err) {
                callback(err, null);
            }
            callback(null, data);
        })
    }

    function updateInvoiceDetails(body, data, callback) {
        var invoice = mongoose.Schemas.Invoice;
        var Model = models.get('CRM', 'Invoice', invoice);
        async.waterfall([
            getInvoiceById.bind(null, body, data, Model),
            updateInvoiceData.bind()
        ], function (err, res) {
            if(err){
                callback(err, null);
            } else {
                callback(null, body, data)
            }
        })
    }

    function getInvoiceById(body, data, model, callback) {
        model.find({ _id: data.allPayments[0].invoice }, function (err, response) {
            if(err){
                callback(null, err);
            } else {
                data.invoice = response;
            }
            callback(null, body, data, model);
        })
    }

    function updateInvoiceData(body, data, model, callback) {
        var paymentArr = data.invoice[0].payments;
        var filterPayments = paymentArr.filter(function (id) {
            return JSON.stringify(id) !== JSON.stringify(data.allPayments[0]._id);
        });
        var paymentInfo = data.invoice[0].paymentInfo;
        paymentInfo.balance = paymentInfo.balance + data.allPayments[0].paidAmount;

        model.update({ _id: data.allPayments[0].invoice }, { $set: { payments: filterPayments, paymentInfo: paymentInfo } }).exec(function (err, res) {
            if(err) {
                callback(err, null);
            }
            callback(null, body, data);
        })
    }

    function deletePaymentsById(body, data, callback) {
        var Payment = mongoose.Schemas.Payment;
        var Model = models.get('CRM', 'Payment', Payment);
        Model.deleteOne({ _id: data.allPayments[0]._id }).exec(function (err, response) {
            if(err) {
                callback(err, null);
            }
            callback(null, body, data);
        });
    }

    function deleteJournalEntriesById(body, data, callback) {
        var journal = mongoose.Schemas.journalEntry;
        var Model = models.get('CRM', 'journalEntry', journal);
        Model.remove({ 'sourceDocument._id': data.allPayments[0]._id }).exec(function (err, response) {
            if(err) {
                callback(err, null);
            }
            callback(null, body, data);
        })
    }

    function getStudentFeeDetailsById(body, callback){
        var studentDetails = mongoose.Schemas.StudentFeeDetails;
        var Model = models.get('CRM', 'StudentFeeDetails', studentDetails);
        Model.find({ _id: body._id }).populate({path: 'student'}).exec(function (err, data) {
            if(err)
                callback(err, null);
            else
                callback(null, body, data[0]);
        });
    }

    function constructUpdateStudentInstallments(body, data, callback) {
        var installments = data.installmentDetails, filterArr, notFilterArr;
        notFilterArr = _.filter(installments, function(o) { return o.billNo !== body.billNo.toString(); });
        filterArr = _.filter(installments, function (o) { return o.billNo === body.billNo.toString() });
        try {
            if(!_.isEmpty(filterArr)) {
                _.forEach(notFilterArr, function (value) {
                    value.amountPaidUpto = value.amountPaidUpto >=  +body.amountPaid ?  value.amountPaidUpto - body.amount : value.amountPaidUpto;
                    _.forEach(value.details, function (val) {
                        var filterObj = _.filter(filterArr[0].details, {'_id': val._id});
                        if(!_.isEmpty(filterObj)) {
                            val.paidAmount = val.paidAmount >= filterObj[0].paidAmount ? (val.paidAmount - filterObj[0].paidAmount) : val.paidAmount;
                        }
                    })

                });

                _.forEach(data.feeTypeDetails, function (feeTypeDetail) {
                    var filterObj = _.filter(filterArr[0].details, {'_id': feeTypeDetail._id});
                    if(!_.isEmpty(filterObj)) {
                        var paidAmount = (filterObj[0].enteredAmount  || filterObj[0].enteredAmount == 0) ? filterObj[0].enteredAmount  : filterObj[0].paidAmount;
                        feeTypeDetail.paidAmount = feeTypeDetail.paidAmount >= paidAmount ? (feeTypeDetail.paidAmount - paidAmount) : feeTypeDetail.paidAmount;
                    }
                })
            }

            data.isCompleted = false;
            data.paidAmount = data.paidAmount >=  body.amount ?  data.paidAmount - body.amount : data.paidAmount;
            data.newInstallments = notFilterArr;

            callback(null, data);
        } catch (err) {
            callback(err, null);
        }

    }

    function updateStudentFeeDetails(body, data, callback) {
        var studentDetails = mongoose.Schemas.StudentFeeDetails;
        var Model = models.get('CRM', 'StudentFeeDetails', studentDetails);
        Model.findByIdAndUpdate({ _id: body._id }, { $set: { installmentDetails: body.length === 1 ? [] : data.newInstallments, paidAmount: data.paidAmount, isCompleted: data.isCompleted, feeTypeDetails: data.feeTypeDetails } }, function (err, response) {
            if(err) {
                callback(err, null);
            }
            callback(null, data);
        })
    }

    function getAllPaymentsObj(body, data, callback) {
        var Payment = mongoose.Schemas.Payment;
        var Model = models.get('CRM', 'Payment', Payment);
        Model.find({ student: body.studentId, paidAmount: Math.floor(body.amount) * 100 }, function (err, res) {
            if(err)
                callback(err, null);
            else {
                data.allPayments = res;
            }
            callback(null, body, data);
        });
    }

    function constructStudentFeeDetails(req, data, next) {
        var studentFeeDetails = {}
        var bookingDate
        req.body.smsTemplateMsg = [];
        var body = req.body;
        if(req.body.courseName) {
            req.body.smsTemplateMsg.push("Hi " + req.body.studentName + ", \n Welcome to NSA. You have successfully registered for " + (req.body.courseName).trim() + " at " + (req.body.centerName).trim() + " . Your registration number is  " + req.body.registrationNo + ". For assistance call 1800-212-5088.");
        }

        data.billNumber = new Date().valueOf().toString(),
            studentFeeDetails.student = data.studentId
        studentFeeDetails.course = body.course
        studentFeeDetails.batch = body.batch
        studentFeeDetails.center = body.center
        studentFeeDetails.courseAmount = body.centerCourseFees
        studentFeeDetails.gstAmount =  body.totalGSTAmount
        studentFeeDetails.isBooking = body.isBooking ? body.isBooking: false;
        studentFeeDetails.isBookingSplitted = body.isBookingSplitted ? body.isBookingSplitted: false;
        studentFeeDetails.bookingAmount = body.isBooking ? body.bookingAmount: 0
        studentFeeDetails.isDiscountApplicable = body.isDiscountApplicable ? body.isDiscountApplicable: false;
        studentFeeDetails.discountAmount = body.discountAmount ? parseInt(body.discountAmount) : 0;
        studentFeeDetails.discountDetails = {}
        studentFeeDetails.actualFeeAmount = body.actualFeeAmount;
        studentFeeDetails.paidAmount = body.paidAmount;
        studentFeeDetails.totalAdjustment = body.totalAdjustedAmt || 0;
        studentFeeDetails.isCompleted = body.isCompleted;
        var instalmentDetail = {
            amount: body.totalInstallmentAmount,
            adjustmentAmount: body.installmentAdjustedAmt,
            amountPaidUpto: body.amountPaidUpto,
            details: body.feeTypeObjs,
            date: new Date(),
            billNo: data.billNumber,
            isPaid: (body.paymentMode === 'Online' || body.paymentMode === 'online') ? false : true,
            transactionResId: null,
            createdBy: req.session.uId,
            paymentMode: body.paymentMode,
        }
        if(body.isBooking == true && body.bookingDetails != undefined ){
            bookingDate = body.bookingDetails[0].date ? body.bookingDetails[0].date : new Date()
        }
        var bookingDetail = {
            amount: body.bookingAmount,
            date: bookingDate ? bookingDate : new Date(),
            billNo: data.billNumber,
            isPaid: (body.paymentMode === 'Online' || body.paymentMode === 'online') ? false : true,
            transactionResId: null,
            createdBy: req.session.uId,
            paymentMode: body.paymentMode,
        }
        if(body.paymentModeDetails) {
            instalmentDetail.paymentModeDetails = body.paymentModeDetails
        }
        studentFeeDetails.installmentDetails = body.totalInstallmentAmount > 0 ? [instalmentDetail] : [],
            studentFeeDetails.bookingDetails = body.isBooking ? [bookingDetail] : [];
        studentFeeDetails.feeTypeDetails = body.feeTypeObjs;
        data.studentFeeDetails = studentFeeDetails;
        var totalAmount = parseInt(body.actualFeeAmount) + parseInt(body.totalGSTAmount.toFixed(2));
        var balance = totalAmount - parseInt(body.paidAmount);
        req.body.smsTemplateMsg.push("Hi " + req.body.studentName + " , Thank you for your fees payment of Rs. " + body.paidAmount + ",  your total fees amount " + totalAmount + " \n For assistance Call 1800-212-5088 \n Happy Learning!");
        req.body.smsTemplateMsg.push("Hi " + req.body.studentName + ", \n Your online Study Platform & App username is " + req.body.studentEmail + " and password " + req.body.studentPassword + ". Web url https://localhost/ and app users download NexSchoolApp from play store and use above log in credentials. ");
        /*if(balance <= 0 ){
         req.body.smsTemplateMsg2 = "Hi " + req.body.studentName + " , Thank you for your fees payment of Rs. " + body.paidAmount + ",  your total fees amount " + totalAmount + " \n For assistance Call 1800-212-5088 \n Happy Learning!";
         } else {
         req.body.smsTemplateMsg2 = "Hi " + req.body.studentName + " , Thank you for your fees payment of Rs. " + body.paidAmount + ",  your total fees amount " + totalAmount + " Your Next payment dates is. \n For assistance Call 1800-212-5088 \n Happy Learning!";
         }*/


        next(null, req, data)
    }


    function calculateInstalmentDates(data) {
        var totalAmount = parseInt(body.actualFeeAmount) + parseInt(body.totalGSTAmount.toFixed(2));
        var balance = totalAmount - parseInt(body.paidAmount);
        if(balance <= 0 ){
            req.body.smsTemplateMsg2 = "Hi " + req.body.studentName + " , Thank you for your fees payment of Rs. " + body.paidAmount + ",  your total fees amount " + totalAmount + " \n For assistance Call 1800-212-5088 \n Happy Learning!";
        } else {
            req.body.smsTemplateMsg2 = "Hi " + req.body.studentName + " , Thank you for your fees payment of Rs. " + body.paidAmount + ",  your total fees amount " + totalAmount + " Your Next payment dates is. \n For assistance Call 1800-212-5088 \n Happy Learning!";
        }
    }

    function paymentRegister(req, result, next) {
        var host = req.headers.host.split(":")[0];
        var worldLink = global.config.payment.worldlink[host]
        var reqDetails = {};
        reqDetails.secretKey = global.config.key;
        reqDetails.transCurrency = 'INR';
        reqDetails.transReqType = 'S';
        reqDetails.transAmount = parseInt(String(req.body.totalInstallmentAmount) + '00');
        reqDetails.transAmount = reqDetails.transAmount +  (+(req.body.bookingAmount) * 100);
        reqDetails.orderId = result.billNumber
        reqDetails.trnRemarks = 'This txn has to be done for Student registration';
        reqDetails.studentId = result.studentId;
        reqDetails.registartionNo = req.body.registartionNo;
        reqDetails.worldLink = worldLink;
        transaction.saveTransReqDetails(req, reqDetails, function (err, data) {
            if (err) {
                next(err, data)
            } else {
                try {
                    crypto.encryption(reqDetails, function (finalResult) {
                        finalResult.fee_type = req.body.fee_type;
                        result.paymentData = finalResult
                        next(null, result)
                    })
                } catch (err) {
                    next(err, null)

                }
            }
        })

    }

    this.payInstallmentFee = function (req, res, next) {
        async.waterfall([
                fees.getBillNumber.bind(null, req, {}),
                getFeeCardsForCourse.bind(),
                fees.addFeeCardByAdmin.bind(),
                fees.addFees.bind(),
            ],
            function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    };

    this.transaction = function (req, res, next) {
        crypto.decryption(req, function (result) {
            var transResp = result;
            if(transResp.status_code === 'S') {
                async.waterfall([
                        constructTransResObj.bind(null, req, transResp),
                        transaction.saveTransResDetails.bind(),
                        studentFeeDetails.updateStudentsFeeDetails.bind(),
                    ],
                    function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.redirect(global.config.redirectUrl)
                    });

            } else {
                /*studentFeeDetails.revertStudentsFeeDetails(req, transResp, function (err, result) {
                 res.redirect(global.config.redirectUrl + '?status=F')
                 })*/
                res.redirect(global.config.redirectUrl + '?status=F')

            }
        });
    };

    function constructTransResObj(req, data, next) {
        var resObj = {}
        resObj.transactionId = data.transaction_id
        resObj.orderId = data.orderId
        resObj.amount = data.amount
        resObj.statusCode = data.status_code
        resObj.RRN = data.RRN
        resObj.authzCode = data.authzcode
        resObj.responseCode = data.response_code
        resObj.transactionDate = data.transaction_date
        resObj.rawResponse = data.raw_response
        data.transResObj = resObj
        next(null, req, data)
    }

    function getFeeCardsForCourse(req, data, next) {
        async.parallel({
            fee: franchise.getCenterCoursesFees.bind(null, req),
            feeTypes: feeTypes.getFeeTypes.bind(null, req)
        }, function (err, result) {
            if (err) {
                callback(err, req, data);
            } else {
                constructFeeTypesDetails(result, function (err, feeDetails) {
                    data.fee = feeDetails.fee;
                    data.feeTypeDetails = feeDetails.feeTypeDetails;
                    next(err, req, data);
                });
            }
        });

    }

    this.getStudentFeeTypesDetails = function (req, res) {
        async.parallel({
            fee: franchise.getCenterCoursesFees.bind(null, req),
            feeTypes: feeTypes.getFeeTypes.bind(null, req)
        }, function (err, result) {
            if (err) {
                return next(err);
            } else {
                constructFeeTypesDetails(result, function (err, feeTypeDetails) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({data: feeTypeDetails});
                });
            }
        });
    }

    function constructFeeTypesDetails (result, next) {
        var feeTypeDetails = []
        var fee = _.assign({}, result.fee.toJSON())
        var totalGSTAmount = 0
        async.each(result.feeTypes, function(feeType, callback) {
            var feeTypeDetail = _.assign({}, feeType.toJSON())
            feeTypeDetail.paidAmount = 0
            feeTypeDetail.gstAmount = 0;
            feeTypeDetail.fullAmount = (result.fee.centerCourseFees * feeType.feeTypePert) / 100;
            if (feeType.feeTypeIsGST) {
                feeTypeDetail.gstAmount = (feeTypeDetail.fullAmount * feeType.feeTypeGstPercentage) / 100;
                totalGSTAmount += feeTypeDetail.gstAmount
            }
            feeTypeDetail.fullAmountWithGST = (feeTypeDetail.fullAmount + feeTypeDetail.gstAmount) || 0
            feeTypeDetails.push(feeTypeDetail)
            callback();
        }, function (err) {
            fee.totalGSTAmount = totalGSTAmount
            next(err, {feeTypeDetails: feeTypeDetails, fee: fee});
        });
    }

    this.updateStage = function(req, res, next) {
        var Model = models.get('CRM', 'Student', Student);
        var body = req.body;
        if(body.stage.id == '102'){
            body.isRegistration = false;
        } else {
            body.isRegistration = true;
        }

        Model.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $set: body } , function (err, result) {
            if(err){
                next(err);
            } else {
                res.status(200).send({success: true, message: 'Updated Successfully'});
            }
        });
    };


    this.updateApproveStatus = function(req, res, next) {
        var studentDetails = mongoose.Schemas.StudentFeeDetails;
        var Model = models.get('CRM', 'StudentFeeDetails', studentDetails);
        var body = req.body;

        Model.findOneAndUpdate({ student: ObjectId(req.params.id) }, { $set: body } , function (err, result) {
            if(err){
                next(err);
            } else {
                res.status(200).send({success: true, message: 'Updated Successfully'});
            }
        });
    };

    this.getRegistrationDetailsById = function(req, res, next) {
        async.waterfall([
                studentFeeDetails.getStudentsFeeDetailsById.bind(null, req),
                convert.bind(),
            ],
            function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    }

    this.getAcademicYears = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'academic', academicSchema);
        var data = req.query;
        var query;

        query = Model.find({});
        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data:response});

        });
    };

    this.getStudentFeeDetailsById = function(req, res, next) {
        req.query.id = req.query.id ? req.query.id : req.session.lid
        async.waterfall([
                studentFeeDetails.getStudentsFeeDetailsById.bind(null, req),
                buildDonutObj.bind(),
            ],
            function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    }

    this.getRegistrationDetails = function(req, res, next) {
        async.waterfall([
                studentFeeDetails.getStudentsFeeDetails.bind(null, req),
                convert.bind(),
            ],
            function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
    }

    function convert(req, data, next) {
        var dataObj = serviceUtils.parseDbObjectAsJSON(data.data)
        async.each(dataObj, function(obj, callback) {
            var installmentDetails = obj.installmentDetails
            if(!obj.isBookingSplitted)
                calculateBookingAmtAdjustment(obj)
            var installmentPaidAmount = 0
            for(var key in installmentDetails) {
                var installment = installmentDetails[key]
                installmentPaidAmount += +(installment.amount || 0)
            }
            obj.totalInstallmentAmount = installmentPaidAmount
            callback();
        }, function(err) {
            dateUtils.formatObjectsDates(dataObj, ['dateOfBirth', 'dateOfJoining', 'date', 'createDate'], 'type1', function (err, dataObj) {
                data.data = dataObj;
                next(err, data)
            })
        });
    }

    function calculateBookingAmtAdjustment(object) {
        var bookingAmount = +(object.bookingAmount)
        object.isBookingSplitted = true
        async.map(object.feeTypeDetails, function(feeType, callback) {
            if(!_.isEmpty(feeType) ) {
                var percentage = +(feeType.feeTypePert)
                if(object.isBooking && bookingAmount > 0) {
                    feeType.adjustableAmt = bookingAmount / 100 * percentage
                } else {
                    feeType.adjustableAmt = 0
                }
                feeType.isAdjusted = false
                callback(null, feeType);
            }
        }, function(err, results) {
            return object
        });

    }

    function buildDonutObj(req, data, next) {
        data = serviceUtils.parseDbObjectAsJSON(data)
        var donutObjs = []
        var paidAmount = 0
        var actualAmount = 0
        if(data.length) {
            async.each(data, function(obj, callback) {
                paidAmount += obj.paidAmount
                actualAmount += obj.courseAmount
                callback();
            }, function(err) {
                donutObjs.push({_id: 'Paid Amount', sum: paidAmount})
                donutObjs.push({_id: 'UnPaid Amount', sum: Math.max(0, (actualAmount - paidAmount))})
                next(err, donutObjs)
            });
        } else {
            next(null, data)
        }
    }


    function constructFeeTypes (result, finalCallback) {
        result.payableAmount = {};
        result.payableAmount.full_amount = 0;
        result.payableAmount._12_installment = 0;
        result.payableAmount._13_installment = 0;
        result.payableAmount._2_installment = 0;
        result.payableAmount._3_installment = 0;
        result.payableAmount.gstAmount = 0;
        async.each(result.feeTypes, function(feeType, callback) {
            feeType.fullAmount = (result.fee.centerCourseFees * feeType.feeTypePert) / 100;
            result.payableAmount.full_amount += feeType.fullAmount;
            if (feeType.feeTypeIsInst) {
                feeType._2_installment = feeType.fullAmount / 2;
                feeType._3_installment = feeType.fullAmount / 3;
                result.payableAmount._12_installment += feeType._2_installment;
                result.payableAmount._13_installment += feeType._3_installment;
                result.payableAmount._2_installment += feeType._2_installment;
                result.payableAmount._3_installment += feeType._3_installment;
                if (feeType.feeTypeIsGST) {
                    feeType.gstAmount = (feeType.fullAmount * feeType.feeTypeGstPercentage) / 100;
                    feeType._2_gstAmount = (feeType._2_installment * feeType.feeTypeGstPercentage) / 100;
                    feeType._3_gstAmount = (feeType._3_installment * feeType.feeTypeGstPercentage) / 100;
                    result.payableAmount.full_amount += feeType.gstAmount;
                    result.payableAmount.gstAmount += feeType.gstAmount;
                    result.payableAmount._12_installment += feeType._2_gstAmount;
                    result.payableAmount._13_installment += feeType._3_gstAmount;
                    result.payableAmount._2_installment += feeType._2_gstAmount;
                    result.payableAmount._3_installment += feeType._3_gstAmount;
                } else {
                    feeType.gstAmount = 0;
                }

            } else if (feeType.feeTypeIsInst) {
                result.payableAmount._12_installment += feeType.fullAmount;
                result.payableAmount._13_installment += feeType.fullAmount;
                if (feeType.feeTypeIsGST === 0) {
                    feeType.gst_amount = (feeType.fullAmount * feeType.feeTypeGstPercentage) / 100;
                    result.payableAmount.full_amount += feeType.gstAmount;
                    result.payableAmount._12_installment += result.payableAmount.full_amount;
                    result.payableAmount._13_installment += result.payableAmount.full_amount;
                } else {
                    feeType.gstAmount = 0;
                }
            }
            feeType.fullAmount = parseFloat(feeType.fullAmount).toFixed(1);
            feeType._2_installment = parseFloat(feeType._2_installment).toFixed(1);
            feeType._3_installment = parseFloat(feeType._3_installment).toFixed(1);
            feeType.gstAmount = parseFloat(feeType.gstAmount).toFixed(1);
            feeType._2_gstAmount = parseFloat(feeType._2_gstAmount).toFixed(1);
            feeType._3_gstAmount = parseFloat(feeType._3_gstAmount).toFixed(1);
            callback();
        }, function (err) {
            result.payableAmount.full_amount = Math.round(parseFloat(result.payableAmount.full_amount).toFixed(1));
            result.payableAmount._12_installment = Math.round(parseFloat(result.payableAmount._12_installment).toFixed(1));
            result.payableAmount._13_installment = Math.round(parseFloat(result.payableAmount._13_installment).toFixed(1));
            result.payableAmount._2_installment = Math.round(parseFloat(result.payableAmount._2_installment).toFixed(1));
            result.payableAmount._3_installment = Math.round(parseFloat(result.payableAmount._3_installment).toFixed(1));

            var diff_instl2 = result.payableAmount.full_amount - result.payableAmount._12_installment - result.payableAmount._2_installment;
            var diff_instl3 = result.payableAmount.full_amount - result.payableAmount._13_installment - result.payableAmount._3_installment - result.payableAmount._3_installment;

            if (diff_instl2 > 0) {
                result.payableAmount._12_installment = result.payableAmount._12_installment + diff_instl2;
            } else {
                result.payableAmount._12_installment = result.payableAmount._12_installment - (diff_instl2 * -1);
            }

            if (diff_instl3 > 0) {
                result.payableAmount._13_installment = result.payableAmount._13_installment + diff_instl3;
            } else {
                result.payableAmount._13_installment = result.payableAmount._13_installment - (diff_instl3 * -1);
            }

            finalCallback(err);
        });

    }
};

module.exports = Module;
