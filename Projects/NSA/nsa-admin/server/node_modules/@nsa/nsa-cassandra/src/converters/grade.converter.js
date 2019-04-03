/**
 * Created by Deepak on 4/3/2017.
 */
var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    AspectsDomain = require('../common/domains/Aspects');



exports.gradeObjs = function(req, data) {
    var convertaspectsObjs = [];
    if(_.isEmpty(data)) {
        convertaspectsObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function(value, key) {
                var aspectsObj = Object.assign({}, AspectsDomain);
                    aspectsObj.id= value['id'],
                    aspectsObj.grade_id= value['grade_id'],
                    aspectsObj.tenant_id= value['tenant_id'],
                    aspectsObj.school_id = value['school_id'],
                    aspectsObj.description = value['description'],
                    aspectsObj.grade_name =value['grade_name'],
                    aspectsObj.start_range= (value['start_range']).toFixed(2),
                    aspectsObj.end_range= (value['end_range']).toFixed(2),
                    aspectsObj.cgpa_value= value['cgpa_value'],
                    aspectsObj.color =value['color'];
                    aspectsObj.application =value['application'];
                convertaspectsObjs.push(aspectsObj);
            });
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.ASPECTS, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return convertaspectsObjs;
};

