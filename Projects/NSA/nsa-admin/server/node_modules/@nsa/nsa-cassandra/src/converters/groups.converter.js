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
    //SyllabusDomain = require('../common/domains/Syllabus'),
    logger = require('../../config/logger');



exports.groupsObjs = function(req, data) {
    var convertGroupsArr = [];
    var obj = [];
    if(_.isEmpty(data)) {
        convertGroupsArr = [];
    } else {
        try {
            _.forEach(data, function(value, key) {
                var convertGroupsArr = Object.assign({});
                var updatedDate = dateService.getFormattedDate(value['updated_date']);
                    convertGroupsArr.id= value['id'],
                    convertGroupsArr.tenant_id= value['tenant_id'],
                    convertGroupsArr.school_id= value['school_id'],
                    convertGroupsArr.academic_year= value['academic_year'],
                    convertGroupsArr.group_name= value['group_name'],
                    convertGroupsArr.group_user = value['group_user'],
                    convertGroupsArr.members= value['members'],
                    convertGroupsArr.created_by= value['created_by'],
                    convertGroupsArr.created_firstname= value['created_firstname'],
                    convertGroupsArr.created_date= updatedDate,
                    convertGroupsArr.updated_date= updatedDate,
                    obj.push(convertGroupsArr);
            });
        }
        catch (err) {
            logger.debug(err);
            //return responseBuilder.buildResponse(constant.CLASS_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return obj;
};

