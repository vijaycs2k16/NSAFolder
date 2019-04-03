/**
 * Created by Kiranmai A on 3/27/2017.
 */

var models = require('../../models/index'),
    baseService = require('../common/base.service'),
    dateService = require('../../utils/date.service'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    _ = require('lodash'),
    constant = require('@nsa/nsa-commons').constants,
    numberToText = require('number2text');

exports.feeTransactionDetails = function(data) {
    var feeTransactionDetails;
    try {
        feeTransactionDetails = new models.instance.FeeTransactionDetails  ({
            fee_trans_id: models.uuid(),
            fee_id: models.uuidFromString(data.feeId),
            user_name: data.userName,
            sub_merchant_id: data.subMerchantId,
            tenant_id: models.timeuuidFromString(data.tenant_id),
            school_id: models.uuidFromString(data.school_id),
            academic_year: data.academic_year,
            tracking_id: data.trackingId,
            txn_status: data.txnStatus,
            success_msg: data.successMsg,
            failure_msg: data.failureMsg,
            payment_mode : data.paymentMode,
            card_name : data.cardName,
            card_holder_name : data.cardHolderName,
            amount : models.datatypes.BigDecimal.fromString(data.collectedAmount),
            payment_gateway: data.paymentGateway,
            raw_response: data.rawResponse,
            txn_date: new Date(),
            user_code: data.userCode,
            class_id: models.uuidFromString(data.classId),
            class_name: data.className,
            section_id: models.uuidFromString(data.sectionId),
            section_name: data.sectionName,
            mode : data.mode,
            fee_amount : models.datatypes.BigDecimal.fromString(data.feeAmount),
            fee_structure_id : models.uuidFromString(data.feeStructureId),
            fee_name : data.feeName,
            first_name : data.firstName,
            cheque_no : data.chequeNo,
            is_bounce : data.isBounce,
            cheque_date : data.chequeDate
        });
        //console.log('feeTransactionDetails........222..',JSON.parse(JSON.stringify(feeTransactionDetails)))
    } catch (err) {
        throwConverterErr(err, message.nsa437);
    }
    return feeTransactionDetails;
};

exports.feePaymentGatewayTransactionDetails = function(data) {
    var feeTransactionDetails;
    try {
        feeTransactionDetails = new models.instance.FeeTransactionDetails  ({
            fee_trans_id: models.uuid(),
            fee_id: models.uuidFromString(data.feeId),
            user_name: data.userName,
            sub_merchant_id: data.subMerchantId,
            tenant_id: models.timeuuidFromString(data.tenant_id),
            school_id: models.uuidFromString(data.school_id),
            academic_year: data.academic_year,
            tracking_id: data.trackingId,
            txn_status: data.txnStatus,
            success_msg: data.successMsg,
            failure_msg: data.failureMsg,
            payment_mode : data.paymentMode,
            card_name : data.cardName,
            card_holder_name : data.cardHolderName,
            amount : models.datatypes.BigDecimal.fromString(data.amount),
            payment_gateway: data.paymentGateway,
            raw_response: data.rawResponse,
            txn_date: new Date(),
            user_code: data.userCode,
            class_id: models.uuidFromString(data.classId),
            class_name: data.className,
            section_id: models.uuidFromString(data.sectionId),
            section_name: data.sectionName,
            mode: data.mode,
            fee_amount: models.datatypes.BigDecimal.fromString(data.feeAmount),
            fee_structure_id : models.uuidFromString(data.feeStructureId),
            fee_name : data.feeName,
            first_name : data.firstName
        });
    } catch (err) {
        throwConverterErr(err, message.nsa437);
    }
    return feeTransactionDetails;
};

exports.getfeeTransactionDetails = function(datas) {
    try {
        if(!_.isEmpty(datas)) {
            _.forEach(datas, function(data){
                data.fee_id = data.fee_id,
                data.user_name = data.user_name,
                data.sub_merchant_id = data.sub_merchant_id,
                data.tracking_id = data.tracking_id,
                data.txn_status = data.txn_status,
                data.success_msg = data.success_msg,
                data.failure_msg = data.failure_msg,
                data.payment_mode = data.payment_mode,
                data.card_name = data.card_name,
                data.card_holder_name = data.card_holder_name,
                data.amount = data.amount,
                data.payment_gateway = data.payment_gateway,
                data.raw_response = data.raw_response,
                data.txn_date = dateService.getFormattedDateWithoutTime(data.txn_date),
                data.numberToTextAmount = data.amount ? numberToText(+data.amount) : 'zero';
            })
        }
    }
    catch (err) {
        return err
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return datas;
}

function throwConverterErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.FEE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwConverterErr = throwConverterErr;