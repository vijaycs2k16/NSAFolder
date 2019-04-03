/**
 * Created by Kiranmai A on 3/3/2017.
 */

var baseService = require('@nsa/nsa-cassandra').BaseService,
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    nsaau = require('@nsa/nsa-bodybuilder').assignmentUtil,
    common = require('../../core/assignment'),
    assignConverter = require('../../converters/assignment'),
    //dateUtils = require('@nsa/nsa-commons').dateUtils,
    //notificationService = require('../sms/notifications/notification.service'),
    logger = require('../../../../config/logger'),
    _ = require('lodash');
    //moment = require('moment');



var assignments = function (models) {


    this.getAllAssignments = function(req, res) {
        try {
            /*var assignmentQuery, viewPermission, headers = nsaCassandra.BaseService.getHeaders(req);
            viewPermission = nsaCassandra.BaseService.checkPermissionsToQuery(req, constant.ASSIGNMENT_PERMISSIONS);
            if (req.query.search) {
                req.query.keyword = req.query.search['value'];
            }

            var sortParam = { key: constant.ES_UPDATED_DATE, order: constant.ES_ORDER_DSC };
            assignmentQuery = nsaau.getAssignmentQuery(req, headers, viewPermission, sortParam);
            nsaElasticSearch.search.searchAssignments(req, assignmentQuery, function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
                } else {
                    events.emit('SearchResponse', req, res, result);
                }
            })*/

            var headers = baseService.getHeaders(req);
            var findQuery = {
                school_id: '42326603-6924-4dbb-a622-6126eada2cca',
                tenant_id: 'e74e3a00-6d34-11e7-ace1-b38d7197d91b',
                academic_year : headers.academic_year,
            };
            common.getAssessment(req, findQuery, models, function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
                } else {
                    events.emit('SearchResponse', req, res, result);
                }
            })
        } catch (cerr) {
            logger.debug(cerr);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(cerr, message.nsa1208));
        }
    };

    this.getAssigmentsOverview = function (req, res) {
        async.parallel({
            list: getListofAssignments.bind(null, req)
        }, function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1603));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    };

    this.getAssigmentsOverviewCount = function (req, res) {
        async.parallel({
            subDetails: getAssignmentSubCount.bind(null, req),
            count: getTodayAssignments.bind(null, req)
        }, function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1603));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    };

    function getListofAssignments(req, callback) {
        var headers = baseService.getHeaders(req);
        var findQuery = {
            academic_year : headers.academic_year,
            username : req.params.id ? req.params.id : headers.user_id,
            'details.deactivated' : false
        };
        common.getAssessmentDetail(req, findQuery, models, function (err, result) {
            callback(err, assignConverter.schoolAssignmentObjs(result))
        })

    };
    exports.getListofAssignments = getListofAssignments;

    function buildErrResponse(err, message) {
        return responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
    };
    exports.buildErrResponse = buildErrResponse;

    function throwAssignmentErr(err, message) {
        throw new BaseError(responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
    };
    exports.throwAssignmentErr = throwAssignmentErr;

}

module.exports = assignments;