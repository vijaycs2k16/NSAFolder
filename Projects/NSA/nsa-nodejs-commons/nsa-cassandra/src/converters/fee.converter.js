/**
 * Created by magesh on 17/01/17.
 */

var requestParam = require('../common/domains/RequestParam');
    feeTypeDomain = require('../common/domains/FeeType'),
    feeScholarshipDomain = require('../common/domains/FeeScholarship'),
    feeStructureDomain = require('../common/domains/FeeStructure'),
    feeAssignmentDomain = require('../common/domains/FeeAssignment'),
    feeAssignmentDetailsDomain = require('../common/domains/FeeAssignmentDetails'),
    baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../../../config/logger');

exports.feeTypeObjs = function(req, data) {
    var convertFeeTypeObjs = [];
    if(_.isEmpty(data)) {
        convertFeeTypeObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(_(data).omitBy(_.isUndefined).omitBy(_.isNull).value(), function(value, key) {
                var convertFeeTypeObj = Object.assign({}, feeTypeDomain);
                var updatedDate = dateService.getFormattedDate(value['updated_date']);
                convertFeeTypeObj.id= value['fee_type_id'],
                convertFeeTypeObj.tenantId = value['tenant_id'],
                convertFeeTypeObj.schoolId = value['school_id'],
                convertFeeTypeObj.updatedBy = value['updated_by'],
                convertFeeTypeObj.isDefault = value['default_value'],
                convertFeeTypeObj.feeDeposit = value['deposit'],
                convertFeeTypeObj.feeTypeDesc = value['fee_desc'],
                convertFeeTypeObj.name = value['fee_type_name'],
                convertFeeTypeObj.status = value['status'],
                convertFeeTypeObj.updatedDate = updatedDate,
                convertFeeTypeObj.updatedUsername =value['updated_username'],
                convertFeeTypeObj.updateddateAndName = value['updated_username']+' - '+updatedDate;
                convertFeeTypeObj.editPermissions = baseService.havePermissionsToEdit(req, constant.FEE_TYPE_PERMISSIONS, value['created_by']);
                convertFeeTypeObjs.push(convertFeeTypeObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return buildErrResponse(err, message.nsa401);
        }
    }
    return convertFeeTypeObjs;
};


exports.feeTypeObj = function(req, feetype) {
    var convertFeeTypeObj = {};
    if(_.isEmpty(feetype)) {
        convertFeeTypeObj = baseService.emptyResponse();
    } else {
        try {
            convertFeeTypeObj = Object.assign({}, feeTypeDomain);
            var updatedDate  = dateService.getFormattedDate(feetype['updated_date']);
            convertFeeTypeObj.id= feetype['fee_type_id'],
            convertFeeTypeObj.updatedUsername =feetype['updated_username'],
            convertFeeTypeObj.tenantId = feetype['tenant_id'],
            convertFeeTypeObj.schoolId = feetype['school_id'],
            convertFeeTypeObj.updatedBy = feetype['updated_by'],
            convertFeeTypeObj.isDefault = feetype['default_value'],
            convertFeeTypeObj.feeDeposit = feetype['deposit'],
            convertFeeTypeObj.feeTypeDesc = feetype['fee_desc'],
            convertFeeTypeObj.name = feetype['fee_type_name'],
            convertFeeTypeObj.status = feetype['status'];
            convertFeeTypeObj.updatedDate = updatedDate;
            convertFeeTypeObj.updateddateAndName = feetype['updated_username']+' - '+updatedDate;
        }
        catch (err) {
            logger.debug(err);
            return buildErrResponse(err, message.nsa401);
        }
    }
    return convertFeeTypeObj;

}

exports.feeScholarshipObjs = function(req, data) {
   var convertFeeScholarshipObjs = [];
    if(_.isEmpty(data)) {
        convertFeeScholarshipObjs = baseService.emptyResponse();
    } else {
        try {
            data.forEach(function (feeScholarship) {
                var convertFeeScholarshipObj = Object.assign({}, feeScholarshipDomain);
                var updatedDate = dateService.getFormattedDate(feeScholarship['updated_date']);
                var validUpto = dateService.getFormattedDateWithoutTime(feeScholarship['valid_upto']);
                convertFeeScholarshipObj.id= feeScholarship['scholarship_id'],
                convertFeeScholarshipObj.tenantId = feeScholarship['tenant_id'],
                convertFeeScholarshipObj.schoolId = feeScholarship['school_id'],
                convertFeeScholarshipObj.amount = feeScholarship['amount'],
                convertFeeScholarshipObj.attachment = feeScholarship['attachment'],
                convertFeeScholarshipObj.updatedBy = feeScholarship['updated_by'],
                convertFeeScholarshipObj.updatedUsername =feeScholarship['updated_username'],
                convertFeeScholarshipObj.scholarshipDesc = feeScholarship['scholarship_desc'],
                convertFeeScholarshipObj.name = feeScholarship['scholarship_name'],
                convertFeeScholarshipObj.status = feeScholarship['status'],
                convertFeeScholarshipObj.validUpto = validUpto,
                convertFeeScholarshipObj.updateddate = updatedDate;
                convertFeeScholarshipObj.updateddateAndName = feeScholarship['updated_username']+' - '+updatedDate;
                convertFeeScholarshipObj.editPermissions = baseService.havePermissionsToEdit(req, constant.FEE_SCHOLARSHIP_PERMISSIONS, feeScholarship['created_by']);
                convertFeeScholarshipObjs.push(convertFeeScholarshipObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return buildErrResponse(err, message.nsa408);
        }
    }
    return convertFeeScholarshipObjs;
}

exports.feeScholarshipObj = function(req, scholarship) {
    var convertFeeScholarshipObj = {};
    if(_.isEmpty(scholarship)) {
        convertFeeScholarshipObj = baseService.emptyResponse();
    } else {
        try {
            var convertFeeScholarshipObj = Object.assign({}, feeScholarshipDomain);
            var updatedDate = dateService.getFormattedDate(scholarship['updated_date']);
            var validUpto = dateService.getFormattedDateWithoutTime(scholarship['valid_upto']);
                convertFeeScholarshipObj.id= scholarship['scholarship_id'],
                convertFeeScholarshipObj.tenantId = scholarship['tenant_id'],
                convertFeeScholarshipObj.schoolId = scholarship['school_id'],
                convertFeeScholarshipObj.amount = scholarship['amount'],
                convertFeeScholarshipObj.attachment = scholarship['attachment'],
                convertFeeScholarshipObj.updatedBy = scholarship['updated_by'],
                convertFeeScholarshipObj.scholarshipDesc = scholarship['scholarship_desc'],
                convertFeeScholarshipObj.name = scholarship['scholarship_name'],
                convertFeeScholarshipObj.status = scholarship['status'],
                convertFeeScholarshipObj.validUpto = validUpto;
                convertFeeScholarshipObj.updateddate = updatedDate;
                convertFeeScholarshipObj.updatedUsername =scholarship['updated_username'],
                convertFeeScholarshipObj.updateddateAndName =scholarship['updated_username']+' - '+updatedDate;
        } catch (err) {
            logger.debug(err);
            return buildErrResponse(err, message.nsa408);
        }
    }
    return convertFeeScholarshipObj;
}

exports.feeStructureObjs = function(req, data) {
    var convertFeeStructureObjs = [];
    try {
        data.forEach(function (feeStructure) {
            var convertFeeStructureObj = Object.assign({}, feeStructureDomain);

            var applicableFeeTypes = baseService.getFormattedMap(feeStructure['applicable_fee_types']);
            var terms = baseService.getFormattedMap(feeStructure['applicable_terms']);
            var applicableTerms = baseService.getArrayFromMap(feeStructure['applicable_terms']);
            var feeStatus = feeStructure['status'] ? constants.STATUS_ACTIVE : constants.STATUS_INACTIVE;
            var updatedDate = dateService.getFormattedDate(feeStructure['updated_date']);

            convertFeeStructureObj.feeStructureId = feeStructure['fee_structure_id'],
                convertFeeStructureObj.tenantId = feeStructure['tenant_id'],
                convertFeeStructureObj.schoolId = feeStructure['school_id'],
                convertFeeStructureObj.academicYear = feeStructure['academic_year'],
                convertFeeStructureObj.applicableFeeTypes = applicableFeeTypes,
                convertFeeStructureObj.applicableTerms = applicableTerms,
                convertFeeStructureObj.terms = terms,
                convertFeeStructureObj.updatedBy = feeStructure['updated_by'],
                convertFeeStructureObj.feeStructureDesc = feeStructure['fee_structure_desc'],
                convertFeeStructureObj.feeStructureName = feeStructure['fee_structure_name'],
                convertFeeStructureObj.status = feeStatus,
                convertFeeStructureObj.updatedUsername =feeStructure['updated_username'],
                convertFeeStructureObj.updatedDate = updatedDate;
            	convertFeeStructureObj.editPermissions = baseService.havePermissionsToEdit(req, constant.FEE_STRUCTURE_PERMISSIONS, feeStructure['created_by']);
            	convertFeeStructureObjs.push(convertFeeStructureObj);
        });
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa408);
    }
    return convertFeeStructureObjs;
}

exports.feeStructureObj = function(req, feeStructure) {
    var convertFeeStructureObj = Object.assign({}, feeStructureDomain);
    try {
            var applicableFeeTypes = baseService.getFormattedMap(feeStructure['applicable_fee_types']);
            var terms = baseService.getFormattedMap(feeStructure['applicable_terms']);
            var applicableTerms = baseService.getArrayFromMap(feeStructure['applicable_terms']);
            var feeStatus = feeStructure['status'] ? constants.STATUS_ACTIVE : constants.STATUS_INACTIVE;
            var updatedDate = dateService.getFormattedDate(feeStructure['updated_date']);

            convertFeeStructureObj.feeStructureId = feeStructure['fee_structure_id'],
            convertFeeStructureObj.tenantId = feeStructure['tenant_id'],
            convertFeeStructureObj.schoolId = feeStructure['school_id'],
            convertFeeStructureObj.academicYear = feeStructure['academic_year'],
            convertFeeStructureObj.applicableFeeTypes = applicableFeeTypes,
            convertFeeStructureObj.applicableTerms = applicableTerms,
            convertFeeStructureObj.terms = terms,
            convertFeeStructureObj.updatedBy = feeStructure['updated_by'],
            convertFeeStructureObj.updatedUsername =feeStructure['updated_username'],
            convertFeeStructureObj.feeStructureDesc = feeStructure['fee_structure_desc'],
            convertFeeStructureObj.feeStructureName = feeStructure['fee_structure_name'],
            convertFeeStructureObj.status = feeStatus,
            convertFeeStructureObj.updatedDate = updatedDate;
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa408);
    }
    return convertFeeStructureObj;
}

exports.feeAssignmentObjs = function(req, data) {
    var convertFeeAssignmentObjs = [];
    try {
        data.forEach(function (feeAssignment) {
                var convertFeeAssignmentObj = Object.assign({}, feeAssignmentDomain);

                var feeTypes = baseService.getFormattedMaps(feeAssignment['applicable_fee_types'], feeAssignment['fee_types_amount'],
                    feeAssignment['refundable_percentage']);
                var applicableClasses = baseService.getFormattedMap(feeAssignment['applicable_classes']);
                var applicableLanguages = baseService.getFormattedMap(feeAssignment['applicable_languages']);

                var mediaTypes = baseService.getFormattedMap(feeAssignment['media_type']);
                var feeStatus = feeAssignment['status'] ? constants.STATUS_PUBLISH : constants.STATUS_PENDING;
                var dueDate = dateService.getFormattedDate(feeAssignment['due_date']);
                var updatedDate = dateService.getFormattedDate(feeAssignment['updated_date']);

                convertFeeAssignmentObj.feeAssignmentId = feeAssignment['fee_assignment_id'],
                convertFeeAssignmentObj.feeStructureId = feeAssignment['fee_structure_id'],
                convertFeeAssignmentObj.tenantId = feeAssignment['tenant_id'],
                convertFeeAssignmentObj.schoolId = feeAssignment['school_id'],
                convertFeeAssignmentObj.academicYear = feeAssignment['academic_year'],
                convertFeeAssignmentObj.feeAssignmentName = feeAssignment['fee_assignment_name'],
                convertFeeAssignmentObj.classes = applicableClasses,
                convertFeeAssignmentObj.languages = applicableLanguages,
                convertFeeAssignmentObj.mediaType = mediaTypes,
                convertFeeAssignmentObj.feeTypes = feeTypes,
                convertFeeAssignmentObj.totalFeeAmount = feeAssignment['total_fee_amount'],
                convertFeeAssignmentObj.dueDate = dueDate,
                convertFeeAssignmentObj.updatedDate = updatedDate,
                convertFeeAssignmentObj.updatedBy = feeAssignment['updated_by'],
                convertFeeAssignmentObj.updatedUsername=feeAssignment['updated_username'],
                convertFeeAssignmentObj.status = feeStatus,
                convertFeeAssignmentObj.assignedCategories = feeAssignment['assigned_categories'],
                convertFeeAssignmentObj.editPermissions = baseService.havePermissionsToEdit(req, constant.FEE_ASSIGN_PERMISSIONS, feeAssignment['created_by']);
            	convertFeeAssignmentObjs.push(convertFeeAssignmentObj);
        });
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa422);
    }
    return convertFeeAssignmentObjs;
}

exports.feeAssignmentObj = function(req, feeAssignment) {
    var convertFeeAssignmentObj = Object.assign({}, feeAssignmentDomain);
    try {
            var feeTypes = baseService.getFormattedMaps(feeAssignment['applicable_fee_types'], feeAssignment['fee_types_amount'],
                feeAssignment['refundable_percentage']);
            var applicableClasses = baseService.getFormattedMap(feeAssignment['applicable_classes']);
            var applicableLanguages = baseService.getFormattedMap(feeAssignment['applicable_languages']);
            var mediaTypes = baseService.getFormattedMap(feeAssignment['media_type']);
            var feeStatus = feeAssignment['status'] ? constants.STATUS_PUBLISH : constants.STATUS_PENDING;
            var dueDate = dateService.getFormattedDate(feeAssignment['due_date']);
            var updatedDate = dateService.getFormattedDate(feeAssignment['updated_date']);

            convertFeeAssignmentObj.feeAssignmentId = feeAssignment['fee_assignment_id'],
            convertFeeAssignmentObj.feeStructureId = feeAssignment['fee_structure_id'],
            convertFeeAssignmentObj.tenantId = feeAssignment['tenant_id'],
            convertFeeAssignmentObj.schoolId = feeAssignment['school_id'],
            convertFeeAssignmentObj.academicYear = feeAssignment['academic_year'],
            convertFeeAssignmentObj.feeAssignmentName = feeAssignment['fee_assignment_name'],
            convertFeeAssignmentObj.classes = applicableClasses,
            convertFeeAssignmentObj.languages = applicableLanguages,
            convertFeeAssignmentObj.mediaType = mediaTypes,
            convertFeeAssignmentObj.feeTypes = feeTypes,
            convertFeeAssignmentObj.totalFeeAmount = feeAssignment['total_fee_amount'],
            convertFeeAssignmentObj.dueDate = dueDate,
            convertFeeAssignmentObj.updatedDate = updatedDate,
            convertFeeAssignmentObj.updatedBy = feeAssignment['updated_by'],
            convertFeeAssignmentObj.updatedUsername=feeAssignment['updated_username'],
            convertFeeAssignmentObj.status = feeStatus,
            convertFeeAssignmentObj.assignedCategories = feeAssignment['assigned_categories']
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa422);
    }
    return convertFeeAssignmentObj;
};

exports.feeAssignmentDetailsObjs = function(req, data) {
    var convertFeeAssignmentDetailsObjs = [];
    try {
        data.forEach(function (feeAssignmentDetail) {
            var totalScholarShipAmount = 0;
            var convertFeeAssignmentDetailsObj = Object.assign({}, feeAssignmentDetailsDomain);

            var feeTypes = baseService.getFormattedMaps(feeAssignmentDetail['applicable_fee_types'], feeAssignmentDetail['fee_types_amount'],
                feeAssignmentDetail['refundable_percentage']);
            var scholarship = baseService.formattedMaps(feeAssignmentDetail['scholarship_name'], feeAssignmentDetail['scholarship_amount']);
            var feeStatus = feeAssignmentDetail['status'] ? constants.STATUS_PUBLISH : constants.STATUS_PENDING;
            var paidStatus = feeAssignmentDetail['is_paid'] ? constants.STATUS_PAID : constants.STATUS_UNPAID;
            var paidDate = dateService.getFormattedDate(feeAssignmentDetail['paid_date']);
            var dueDate = dateService.getFormattedDate( feeAssignmentDetail['due_date']);
            var updatedDate = dateService.getFormattedDate( feeAssignmentDetail['updated_date']);
            var chequeDate = dateService.getFormattedDate( feeAssignmentDetail['cheque_date']);
            var isBounce = feeAssignmentDetail['is_bounce'] == false ? 'Clear' : 'Bounce';
            var scholarships = _.filter(scholarship, function(o) { return o.amount != ''; });
            if(scholarships != undefined && scholarships.length > 0) {
                _.forEach(scholarships, function(val) {
                    totalScholarShipAmount = totalScholarShipAmount + Number(val.amount);
                })
            }
                convertFeeAssignmentDetailsObj.feeAssignmentDetailId = feeAssignmentDetail['fee_assignment_detail_id'],
                convertFeeAssignmentDetailsObj.feeStructureId = feeAssignmentDetail['fee_structure_id'],
                convertFeeAssignmentDetailsObj.createdDate = feeAssignmentDetail['created_date'],
                convertFeeAssignmentDetailsObj.tenantId = feeAssignmentDetail['tenant_id'],
                convertFeeAssignmentDetailsObj.schoolId = feeAssignmentDetail['school_id'],
                convertFeeAssignmentDetailsObj.academicYear = feeAssignmentDetail['academic_year'],
                convertFeeAssignmentDetailsObj.feeAssignmentId = feeAssignmentDetail['fee_assignment_id'],
                convertFeeAssignmentDetailsObj.feeAssignmentName = feeAssignmentDetail['fee_assignment_name'],
                convertFeeAssignmentDetailsObj.userName = feeAssignmentDetail['user_name'],
                convertFeeAssignmentDetailsObj.firstName = feeAssignmentDetail['first_name'],
                convertFeeAssignmentDetailsObj.termId = feeAssignmentDetail['term_id'],
                convertFeeAssignmentDetailsObj.termName = feeAssignmentDetail['term_name'],
                convertFeeAssignmentDetailsObj.classId = feeAssignmentDetail['class_id'],
                convertFeeAssignmentDetailsObj.className = feeAssignmentDetail['class_name'],
                convertFeeAssignmentDetailsObj.sectionId = feeAssignmentDetail['section_id'],
                convertFeeAssignmentDetailsObj.sectionName = feeAssignmentDetail['section_name'],
                convertFeeAssignmentDetailsObj.feeTypes = feeTypes,
                convertFeeAssignmentDetailsObj.totalScholarshipAmount = totalScholarShipAmount,
                convertFeeAssignmentDetailsObj.netAmount = feeAssignmentDetail['net_amount'] || 0,
                convertFeeAssignmentDetailsObj.dueDate = dueDate,
                convertFeeAssignmentDetailsObj.scholarShip = scholarship,
                convertFeeAssignmentDetailsObj.feeDiscountName = feeAssignmentDetail['fee_discount_name'],
                convertFeeAssignmentDetailsObj.feeDiscountAmount = feeAssignmentDetail['fee_discount_amount'] || 0 ,
                convertFeeAssignmentDetailsObj.updatedBy=feeAssignmentDetail['updated_by'],
                convertFeeAssignmentDetailsObj.updatedUsername=feeAssignmentDetail['updated_username'],
                convertFeeAssignmentDetailsObj.status = feeStatus,
                convertFeeAssignmentDetailsObj.isPaid = paidStatus,
                convertFeeAssignmentDetailsObj.isPartial = feeAssignmentDetail['is_partial'],
                convertFeeAssignmentDetailsObj.paidAmount = feeAssignmentDetail['paid_amount'] || 0,
                convertFeeAssignmentDetailsObj.transportFees = feeAssignmentDetail['transport_fees'] || 0,
                convertFeeAssignmentDetailsObj.totalAmount = parseInt(convertFeeAssignmentDetailsObj['feeDiscountAmount']) + parseInt(totalScholarShipAmount) + parseInt(convertFeeAssignmentDetailsObj['netAmount'] + parseFloat(convertFeeAssignmentDetailsObj['transport_fees'])),
                convertFeeAssignmentDetailsObj.paidDate = paidDate,
                convertFeeAssignmentDetailsObj.updatedDate = updatedDate,
                convertFeeAssignmentDetailsObj.admissionNo =feeAssignmentDetail['admission_no'],
                convertFeeAssignmentDetailsObj.amountPending =feeAssignmentDetail['net_amount'] - feeAssignmentDetail['paid_amount'],
                convertFeeAssignmentDetailsObj.chequeNo = feeAssignmentDetail['cheque_no'] ? feeAssignmentDetail['cheque_no'] + '-' + isBounce : '-',
                convertFeeAssignmentDetailsObjs.push(convertFeeAssignmentDetailsObj);
            //console.log('convertFeeAssignmentDetailsObjs........',convertFeeAssignmentDetailsObjs)
        });
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa429);
    }
    return convertFeeAssignmentDetailsObjs;
}



exports.feeAssignmentDetailsObj = function(req, feeAssignmentDetail) {
    var convertFeeAssignmentDetailsObj = Object.assign({}, feeAssignmentDetailsDomain);
    try {
            var feeTypes = baseService.getFormattedMaps(feeAssignmentDetail['applicable_fee_types'], feeAssignmentDetail['fee_types_amount'],
                feeAssignmentDetail['refundable_percentage']);
            var scholarship = baseService.formattedMaps(feeAssignmentDetail['scholarship_name'], feeAssignmentDetail['scholarship_amount']);
            var feeStatus = feeAssignmentDetail['status'] ? constants.STATUS_PUBLISH : constants.STATUS_PENDING;
            var paidStatus = feeAssignmentDetail['is_paid'] ? constants.STATUS_PAID : constants.STATUS_UNPAID;
            var paidDate = dateService.getFormattedDate(feeAssignmentDetail['paid_date']);
            var dueDate = dateService.getFormattedDate(feeAssignmentDetail['due_date']);
            var updatedDate = dateService.getFormattedDate( feeAssignmentDetail['updated_date']);

            convertFeeAssignmentDetailsObj.feeAssignmentDetailId = feeAssignmentDetail['fee_assignment_detail_id'],
            convertFeeAssignmentDetailsObj.feeStructureId = feeAssignmentDetail['fee_structure_id'],
            convertFeeAssignmentDetailsObj.createdDate = feeAssignmentDetail['created_date'],
            convertFeeAssignmentDetailsObj.tenantId = feeAssignmentDetail['tenant_id'],
            convertFeeAssignmentDetailsObj.schoolId = feeAssignmentDetail['school_id'],
            convertFeeAssignmentDetailsObj.academicYear = feeAssignmentDetail['academic_year'],
            convertFeeAssignmentDetailsObj.feeAssignmentId = feeAssignmentDetail['fee_assignment_id'],
            convertFeeAssignmentDetailsObj.feeAssignmentName = feeAssignmentDetail['fee_assignment_name'],
            convertFeeAssignmentDetailsObj.userName = feeAssignmentDetail['user_name'],
            convertFeeAssignmentDetailsObj.firstName = feeAssignmentDetail['first_name'],
            convertFeeAssignmentDetailsObj.termId = feeAssignmentDetail['term_id'],
            convertFeeAssignmentDetailsObj.termName = feeAssignmentDetail['term_name'],
            convertFeeAssignmentDetailsObj.classId = feeAssignmentDetail['class_id'],
            convertFeeAssignmentDetailsObj.className = feeAssignmentDetail['class_name'],
            convertFeeAssignmentDetailsObj.sectionId = feeAssignmentDetail['section_id'],
            convertFeeAssignmentDetailsObj.sectionName = feeAssignmentDetail['section_name'],
            convertFeeAssignmentDetailsObj.feeTypes = feeTypes,
            convertFeeAssignmentDetailsObj.netAmount = feeAssignmentDetail['net_amount'],
            convertFeeAssignmentDetailsObj.dueDate = dueDate,
            convertFeeAssignmentDetailsObj.scholarShip = scholarship,
            convertFeeAssignmentDetailsObj.feeDiscountName = feeAssignmentDetail['fee_discount_name'],
            convertFeeAssignmentDetailsObj.feeDiscountAmount = feeAssignmentDetail['fee_discount_amount'],
            convertFeeAssignmentDetailsObj.status = feeStatus,
            convertFeeAssignmentDetailsObj.isPaid = paidStatus,
            convertFeeAssignmentDetailsObj.paidDate = paidDate,
            convertFeeAssignmentDetailsObj.isPartial = feeAssignmentDetail['is_partial'],
            convertFeeAssignmentDetailsObj.paidAmount = feeAssignmentDetail['paid_amount'] || 0,
            convertFeeAssignmentDetailsObj.updatedBy =feeAssignmentDetail['updated_by'],
            convertFeeAssignmentDetailsObj.updatedUsername =feeAssignmentDetail['updated_username'],
            convertFeeAssignmentDetailsObj.updatedDate = updatedDate,
            convertFeeAssignmentDetailsObj.admissionNo =feeAssignmentDetail['admission_no']

    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa429);
    }
    return convertFeeAssignmentDetailsObj;
};

exports.feeAssignmentDetailObjs = function(req, data) {
    var convertFeeAssignmentDetailsObjs = [];
    try {
        data.forEach(function (feeAssignmentDetail) {
            var convertFeeAssignmentDetailsObj = Object.assign({}, feeAssignmentDetailsDomain);
            convertFeeAssignmentDetailsObj.feeAssignmentDetailId = feeAssignmentDetail['fee_assignment_detail_id'],
                convertFeeAssignmentDetailsObj.createdDate = feeAssignmentDetail['created_date'],
                convertFeeAssignmentDetailsObj.tenantId = feeAssignmentDetail['tenant_id'],
                convertFeeAssignmentDetailsObj.schoolId = feeAssignmentDetail['school_id'],
                convertFeeAssignmentDetailsObj.academicYear = feeAssignmentDetail['academic_year']
            convertFeeAssignmentDetailsObjs.push(convertFeeAssignmentDetailsObj);
        });
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa429);
    }
    return convertFeeAssignmentDetailsObjs;
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.FEE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;