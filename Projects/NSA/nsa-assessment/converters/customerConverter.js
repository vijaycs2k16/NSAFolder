/**
 * Created by senthil on 11/02/18.
 */
var mainConstants = require('../constants/mainConstants')
exports.createCustomerObj = function (req, data, next) {
    var body = req.body
    var customerObj = {
        id: null,
        isStudent: true,
        type: "Person",
        name: {
            first: body.studentName,
            last: body.lastName || ''
        },
        email: body.studentEmail,
        address: {
            street: body.street1,
            city: body.city,
            state: body.state,
            zip: body.pincode,
            country: "India",
            name: body.studentName
        },
        shippingAddress: {
            street: body.street1,
            city: body.city,
            state: body.state,
            zip: body.pincode,
            country: "India",
            name: body.studentName
        },
        website: "",
        jobPosition: "",
        skype: "",
        phones: {
            phone: body.studentPhone,
            mobile: body.studentPhone,
            fax: ""
        },
        salesPurchases: {
            isCustomer: true,
            isSupplier: false,
            active: false,
            implementedBy: null,
            salesPerson: null,
            salesTeam: null,
            reference: "",
            language: "English"
        },
        dateBirth: body.dateOfBirth,
        attachments: [],
        notes: [],
        company: null,
        social: {
            LI: "",
            FB: ""
        },
        groups: {
            owner: null,
            users: [],
            group: []
        }
    }
    data.customerObj = customerObj
    next(null, req, data)

}

exports.createPaymentObj = function (req, data, next) {

    var paymetObj = {
        "supplier": data.createStudentCustomer._id,
        "bankExpenses": {
            "account": mainConstants.COGS,
            "amount": 0
        },
        "paidAmount": parseInt(data.bookFee),
        "paymentMethod": mainConstants.PAYMENTMETHOD,
        "date": data.invoiceDate,
        "name": "PP",
        "paymentRef": "",
        "differenceAmount": 0,
        "invoice": data.invoiceId,
        "invoiced": 0,
        "mid": 128,
        "forSale": true,
        "currency": {
            "_id": "INR",
            "name": "INR"
        },
        "bankAccount": mainConstants.BANK_AND_CASH[1],
        "overPayment": {
            "amount": 0
        }
    }
    data.paymentObj = paymetObj;
    next(null, req, data)

}

exports.createOrderObj = function (req, data, next) {
    var productInfo = req.body.productInfo;
    var products = [];
    if(productInfo) {
        var product = {
            "product": productInfo._id ,
            "unitPrice": parseInt(productInfo.unitPrice) * 100,
            "costPrice": null,
            "warehouse": req.body.store ? req.body.store : mainConstants.WAREHOUSE,
            "quantity": "1",
            "taxes": [],
            "description": productInfo.info.description,
            "subTotal": parseInt(productInfo.unitPrice) * 100,
            "creditAccount": mainConstants.INVENTORY,
            "debitAccount" : mainConstants.COGS,
            "totalTaxes": 0
        }
        products.push(product)
    }

    var orderObj = {
        "supplier": data.createStudentCustomer._id,
        "project": null,
        "workflow": "580db83bc2acba093649073c",
        "supplierReference": "",
        "orderDate": new Date(),
        "expectedDate": new Date(),
        "name": "PO",
        "invoiceControl": null,
        "invoiceRecived": false,
        "paymentTerm": null,
        "fiscalPosition": null,
        "destination": null,
        "incoterm": null,
        "products": products,
        "conflictTypes": [],
        "currency": {
            "_id": "INR",
            "name": "INR"
        },
        "paymentMethod": mainConstants.PAYMENTMETHOD,
        "forSales": true,
        "deliverTo": "",
        "priceList": mainConstants.PRICELISTS,
        "salesPerson": null,
        "warehouse": req.body.store ? req.body.store : mainConstants.WAREHOUSE,
        "shippingExpenses": {
            "amount": 0
        },
        "populate": true,
        "paymentInfo": {
            "total": parseInt(data.bookFee) * 100,
            "unTaxed": parseInt(productInfo.unitPrice) * 100,
            "discount": (parseInt(productInfo.unitPrice) - parseInt(data.bookFee)) * 100,
            "taxes": 0
        },
        "status": {
            "allocateStatus": "NOT",
            "fulfillStatus": "NOT",
            "shippingStatus": "NOT"
        },
        "groups": {
            "owner": null,
            "users": [],
            "group": []
        }
    }
    data.orderObj = orderObj;
    next(null, req, data)

}

exports.createRegisterPaymentObj = function (req, data, next) {
    var paymetObj = {
        "supplier": data.createStudentCustomer._id,
        "bankExpenses": {
            "account": mainConstants.COGS,
            "amount": 0
        },
        "paidAmount": parseInt(data.total),
        "paymentMethod": mainConstants.PAYMENTMETHOD,
        "date": (new Date()).toDateString(),
        "name": req.body.registrationNo,
        "paymentRef": "",
        "differenceAmount": parseInt(data.totalAmount) - parseInt(data.total),
        "invoice": data.trans.length > 0 ? (data.trans[0].invoice._id).toString() : data.invoiceId,
        "gstAmount": (parseInt(data.gstAmount)) * 100,
        "invoiced": 0,
        "mid": 0,
        "student": data.studentId,
        "forSale": true,
        "currency": {
            "_id": "INR",
            "name": "INR"
        },
        "overPayment": {
            "amount": 0
        },
        "bankAccount": mainConstants.BANK_AND_CASH[1],
        "journal": mainConstants.STUDNET_REGISTERATION

    }
    console.log(" data.paymentObj",  paymetObj)
    data.paymentObj = paymetObj;
    next(null, req, data)

}

exports.createOtherOrderObj = function (req, data, next) {
    if(data.trans.length == 0) {
        /*var products = [];
        var product = {
            "product": "5aa0cc392d6d57554665e15c" ,
            "unitPrice": parseInt(data.totalAmount) * 100,
            "costPrice": null,
            "warehouse": req.body.store ? req.body.store : mainConstants.WAREHOUSE,
            "quantity": "1",
            "taxes": [],
            "description": "Registration Fees",
            "subTotal": parseInt(data.totalAmount) * 100,
            "creditAccount": mainConstants.INVENTORY,
            "debitAccount" : mainConstants.COGS,
            "totalTaxes": 0
        }
        products.push(product)*/

        var orderObj = {
            "supplier": data.createStudentCustomer._id,
            "project": null,
            "workflow": "580db83bc2acba093649073c",
            "supplierReference": "",
            "orderDate": new Date(),
            "expectedDate": new Date(),
            "name": "PO" + req.body.registrationNo,
            "invoiceControl": null,
            "invoiceRecived": false,
            "paymentTerm": null,
            "fiscalPosition": null,
            "destination": null,
            "incoterm": null,
            "products": data.feeProducts,
            "conflictTypes": [],
            "currency": {
                "_id": "INR",
                "name": "INR"
            },
            "isBookFee": data.isBookFee,
            "student": data.studentId,
            "paymentMethod": mainConstants.PAYMENTMETHOD,
            "forSales": true,
            "deliverTo": "",
            "priceList": mainConstants.PRICELISTS,
            "salesPerson": null,
            "warehouse": req.body.store ? req.body.store : mainConstants.WAREHOUSE,
            "shippingExpenses": {
                "amount": 0
            },
            "populate": true,
            "paymentInfo": {
                "total": (parseInt(data.totalAmount)) * 100,
                "unTaxed": (parseInt(data.totalAmount)  - parseInt(data.totalGstAmount))  * 100,
                "discount": 0,
                "taxes": parseInt(data.totalGstAmount) * 100
            },
            "groups": {
                "owner": null,
                "users": [],
                "group": []
            }
        }
        data.orderObj = orderObj;
    }

    next(null, req, data)

}
