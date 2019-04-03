/**
 * Created by Kiranmai A on 3/27/2017.
 */


var feeTransactionObjDomain = require('../common/domains/FeeTransactionObject'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    randomstring = require("randomstring"),
    constant = require('@nsa/nsa-commons').constants;


exports.feeTransactionObj = function(req, data, callback) {
    var feeTransactionObj;try {
        var customParam1 = data['merchant_param1'].split("/");
        var customParam3 = data['merchant_param3'].split("/");
        var customParam4 = data['merchant_param4'].split("/");
            feeTransactionObj = Object.assign({}, feeTransactionObjDomain);
            feeTransactionObj.feeId= customParam1[1],
            feeTransactionObj.userName = customParam1[0],
            feeTransactionObj.subMerchantId = customParam3[0],
            feeTransactionObj.tenant_id = customParam3[1],
            feeTransactionObj.school_id = customParam3[2],
            feeTransactionObj.academic_year = customParam3[3],
            feeTransactionObj.trackingId = data['tracking_id'],
            feeTransactionObj.txnStatus = data['order_status'],
            feeTransactionObj.successMsg = data['success_message'],
            feeTransactionObj.statusMsg = data['status_message'],
            feeTransactionObj.failureMsg = data['failure_message'],
            feeTransactionObj.paymentMode = data['payment_mode'],
            feeTransactionObj.cardName = data['card_name'],
            feeTransactionObj.cardHolderName = '',
            feeTransactionObj.amount = data['amount'],
            feeTransactionObj.paymentGateway = data['merchant_param2'],
            feeTransactionObj.rawResponse = JSON.stringify(data),
            feeTransactionObj.txnDate =data['trans_date'],
            feeTransactionObj.user_code = customParam4[0],
            feeTransactionObj.classId = customParam4[1],
            feeTransactionObj.className = customParam4[2],
            feeTransactionObj.sectionId = customParam4[3],
            feeTransactionObj.sectionName = customParam4[4],
            feeTransactionObj.feeAmount = customParam4[5],
            feeTransactionObj.mode = customParam4[6] || 'Online',
            feeTransactionObj.feeStructureId = customParam4[7],
            feeTransactionObj.firstName = customParam4[8],
            feeTransactionObj.feeName = customParam4[9]
    }
    catch (err) {
        throw new BaseError(responseBuilder.buildResponse(constant.FEE_NAME, constant.APP_TYPE, message.nsa401, err.message, constant.HTTP_BAD_REQUEST));
    }
    callback(null, req, feeTransactionObj);
};

exports.feePayByCashTransactionObj = function(req, callback) {
    var feeTransactionObj;
    var body = req.body;
    //console.log('body........',body)
    try {
        feeTransactionObj = Object.assign({}, feeTransactionObjDomain);
        feeTransactionObj.feeId=  body.feeAssignmentDetailId,
            feeTransactionObj.userName = body.userName,
            feeTransactionObj.subMerchantId = '',
            feeTransactionObj.tenant_id = body.tenantId,
            feeTransactionObj.school_id = body.schoolId,
            feeTransactionObj.academic_year = body.academicYear,
            feeTransactionObj.trackingId = String(new Date().valueOf()),
            feeTransactionObj.txnStatus = 'Success',
            feeTransactionObj.successMsg = 'Payment Paid By '+ body.mode,
            feeTransactionObj.statusMsg = '',
            feeTransactionObj.failureMsg = '',
            feeTransactionObj.paymentMode = 'Collected By '+ body.mode,
            feeTransactionObj.cardName = '',
            feeTransactionObj.cardHolderName = '',
            feeTransactionObj.amount = body.paidAmount,
            feeTransactionObj.collectedAmount = body.collectedAmount,
            feeTransactionObj.isPartial = body.isPartial,
            feeTransactionObj.netAmount = body.netAmount,
            feeTransactionObj.paymentGateway = body.mode,
            feeTransactionObj.rawResponse = '',
            feeTransactionObj.txnDate = new Date(),
            feeTransactionObj.userCode = body.admissionNo,
            feeTransactionObj.classId = body.classId,
            feeTransactionObj.className = body.className,
            feeTransactionObj.sectionId = body.sectionId,
            feeTransactionObj.sectionName = body.sectionName,
            feeTransactionObj.mode = body.mode,
            feeTransactionObj.feeAmount = body.netAmount,
            feeTransactionObj.feeStructureId = body.feeStructureId,
            feeTransactionObj.feeName = body.feeAssignmentName,
            feeTransactionObj.firstName = body.firstName,
            feeTransactionObj.chequeNo = body.mode == 'Cheque' ? body.chequeNo : null,
            feeTransactionObj.isBounce = body.mode == 'Cheque' ? body.isBounce : null,
            feeTransactionObj.chequeDate = body.mode == 'Cheque' ? dateService.getFormattedDate(body.chequeDate) : null
            //console.log('feeTransactionObj...........',feeTransactionObj)

    }
    catch (err) {
        throw new BaseError(responseBuilder.buildResponse(constant.FEE_NAME, constant.APP_TYPE, message.nsa401, err.message, constant.HTTP_BAD_REQUEST));
    }
    callback(null, req, feeTransactionObj);
};