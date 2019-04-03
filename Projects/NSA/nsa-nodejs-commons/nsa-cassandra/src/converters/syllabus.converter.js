/**
 * Created by Deepa on 7/31/2018.
 */


var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    SyllabusDomain = require('../common/domains/Syllabus'),
    logger = require('../../config/logger');



exports.syllabusObjs = function(req, data) {
    var convertSyllabusArr = [];
    if(_.isEmpty(data) && req.params.id) {
        convertSyllabusArr = [];
        // convertSyllabusArr.push(baseService.emptyResponse());
    } else {
        try {
            _.forEach(data, function(value, key) {
                var convertSyllabusObjs = Object.assign({}, SyllabusDomain);
                var updatedDate = dateService.getFormattedDate(value['updated_date']);
                    convertSyllabusObjs.classId= value['class_id'],
                    convertSyllabusObjs.id= value['class_id'],
                    convertSyllabusObjs.tenantId= value['tenant_id'],
                    convertSyllabusObjs.schoolId= value['school_id'],
                    convertSyllabusObjs.academicYear= value['academic_year'],
                    convertSyllabusObjs.name= value['name'],
                    convertSyllabusObjs.attachments = baseService.getFormattedMap(value['attachments']),
                    convertSyllabusObjs.description= value['description'],
                    convertSyllabusObjs.className= value['class_name'],
                    convertSyllabusObjs.createdDate= updatedDate,
                    convertSyllabusObjs.updatedDate= updatedDate,
                convertSyllabusObjs.editPermissions = baseService.havePermissionsToEdit(req, constant.CLASS_PERMISSIONS, value['created_by']);
                convertSyllabusArr.push(convertSyllabusObjs);
            });
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.CLASS_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return convertSyllabusArr;
};

