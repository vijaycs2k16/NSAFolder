/**
 * Created by bharatkumarr on 17/11/17.
 */

var java = require("java");

var transactMeAPI = java.newInstanceSync("com.awl.merchanttoolkit.transaction.AWLMEAPI");
var reqMsgDTO = java.newInstanceSync("com.awl.merchanttoolkit.dto.ReqMsgDTO");
var decryptionObj = java.newInstanceSync("com.awl.merchanttoolkit.security.VTransactSecurity");

var Crypto = function f(options) {
    var self = this;
};

Crypto.encryption = function(paymentDetails, callback) {
    var worldLink = paymentDetails.worldLink
    reqMsgDTO.setMidSync(worldLink.mid);
    reqMsgDTO.setEnckeySync(worldLink.enckey);
    reqMsgDTO.setOrderIdSync(paymentDetails.orderId);
    //reqMsgDTO.setTrnAmtSync("100");
    reqMsgDTO.setTrnAmtSync(paymentDetails.transAmount+"");
    reqMsgDTO.setTrnCurrencySync(paymentDetails.transCurrency);
    reqMsgDTO.setTrnRemarksSync(paymentDetails.trnRemarks);
    reqMsgDTO.setMeTransReqTypeSync(paymentDetails.transReqType);
    reqMsgDTO.setRecurrPeriodSync("");
    reqMsgDTO.setRecurrDaySync("");
    reqMsgDTO.setNoOfRecurringSync("");
    if (paymentDetails.studentId) {
        console.log('worldLink.studentResponseUrl', worldLink.studentResponseUrl)
        reqMsgDTO.setResponseUrlSync(worldLink.studentResponseUrl);
    } else {
        reqMsgDTO.setResponseUrlSync(worldLink.responseUrl);
    }
    reqMsgDTO.setAddField1Sync(paymentDetails.studentId ? paymentDetails.studentId+"": "");
    reqMsgDTO.setAddField2Sync(paymentDetails.registrationNo ? paymentDetails.registrationNo+"": "");
    reqMsgDTO.setAddField3Sync("");
    reqMsgDTO.setAddField4Sync("");
    reqMsgDTO.setAddField5Sync("");
    reqMsgDTO.setAddField6Sync("");
    reqMsgDTO.setAddField7Sync("");
    reqMsgDTO.setAddField8Sync("");
   /* reqMsgDTO.setCardNumberSync(paymentDetails.card_number);
    reqMsgDTO.setExpiryDateSync(paymentDetails.expDate);
    reqMsgDTO.setCvvSync(paymentDetails.cvv);
    reqMsgDTO.setNameOnCardSync(paymentDetails.card_name);
    reqMsgDTO.setPayTypeCodeSync(paymentDetails.payment_type);
    reqMsgDTO = transactMeAPI.generateTrnReqMsgWithCardSync(reqMsgDTO);*/

    reqMsgDTO = transactMeAPI.generateTrnReqMsgSync(reqMsgDTO);
    if(reqMsgDTO.getStatusDescSync() === "Success" ){
       var merchantRequest = reqMsgDTO.getReqMsgSync();
       var response = {};
       response.merchantRequest = merchantRequest;
       response.mid = worldLink.mid;
       response.paymentUrl = worldLink.ccPaymentUrl;
        callback(response);
    }
};

Crypto.decryption = function(req, callback) {
    console.log('req.body', req.body)
    console.log('req.body.merchantResponse', req.body.merchantResponse)
    var host = req.headers.host.split(":")[0];
    var worldLink = global.config.payment.worldlink[host]
    decryptionObj.initDecryptSync(worldLink.enckey);
    var trnResMsg = decryptionObj.decryptMEssageSync(req.body.merchantResponse);

    var resMsgDTO =transactMeAPI.parseTrnResMsgSync(req.body.merchantResponse, worldLink.enckey);
    var resData = {};
    resData.transaction_id = resMsgDTO.getPgMeTrnRefNoSync();
    resData.orderId = resMsgDTO.getOrderIdSync();
    resData.RRN = resMsgDTO.getRrnSync();
    resData.authzcode = resMsgDTO.getAuthZCodeSync();
    resData.response_code = resMsgDTO.getResponseCodeSync();
    resData.transaction_date = resMsgDTO.getTrnReqDateSync();
    resData.status_code = resMsgDTO.getStatusCodeSync();
    resData.amount = resMsgDTO.getTrnAmtSync();
    resData.status_description = resMsgDTO.getStatusDescSync();
    resData.raw_response = trnResMsg;
    resData.studentId = resMsgDTO.getAddField1Sync() === "" ? "" : parseInt(resMsgDTO.getAddField1Sync());
    resData.registrationNo = resMsgDTO.getAddField2Sync();
    // resData.bill_number = resMsgDTO.getAddField2Sync();

    callback(resData);

//U2FsdGVkX18gqwK85jmVdUikQTZnC5aiqc8th5n6QrEW8FHiDGy3JSFmc8RnCj2MbNeuCQnh3Yz72HtjjF7sf/cox0jyOawknYdRzHJC6+9ZboI5yZPG5sacfbUh/qS8Uja6umOr7906yyECnPkdTV6SywJRNpomisaH9Pb15sFtXSxSmMn5L0XFrqD0QZFadBWMMth0pNH4RF0g/xmzmUY4WgrCu34900eRGv7kdCs=
};

module.exports = Crypto;
