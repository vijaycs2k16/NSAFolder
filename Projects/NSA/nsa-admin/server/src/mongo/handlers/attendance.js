var mongoose = require('mongoose');
var events = require('@nsa/nsa-commons').events;
var baseService = require('@nsa/nsa-cassandra').BaseService;
var dateUtils = require('../helpers/dateService');
var FilterMapper = require('../helpers/filterMapper');
var filterMapper = new FilterMapper();
//var notificationHandler = require('./notifications');
var async = require('async');
var pageHelper = require('../helpers/pageHelper');
var utils = require('../helpers/serviceUtils');
var serviceUtils = require('../helpers/serviceUtils')
var _ = require('lodash');
var moment = require('moment');
var generateColor = require('generate-color')
var nsaElasticSearch = require('@nsa/nsa-elasticsearch')
var logger = require('../../common/logging');
var message = require('@nsa/nsa-commons').messages;
var AttendanceSchema = mongoose.Schemas.schoolAttendanceSchema;
var AttendanceDetailSchema = mongoose.Schemas.schoolAssignmentDetails;

var Module = function (models) {
   // var notification = new notificationHandler(models);
    var objectId = mongoose.Types.ObjectId;

    this.getAttendanceAll = function(req, next){
        console.log('vijayarangan....getAttendanceAll...')
    }

     this.saveAttendance = function(req, res){
         console.log('djnjdjejnedn.....')
         var notify = {}
         notify.sms = true;
         req.body.notify = notify;
         req.body.status = true;

         async.waterfall([
             saveAttendanceObj.bind(null, req),
             saveAttendanceDetailObj.bind()
         ], function (err, result) {
             var cnt  = 0 ;
             cnt++;
             console.log('count.....',cnt)
             console.log('result...efefe...',result)
             if(err) {
                 return next(err);
             } else {
                 return res.status(200).send({success:true});
             }
         })
         //saveAttendance(req, {}, function (err, req, result) {
         //    if(err) {
         //        return next(err);
         //    } else {
         //        return res.status(200).send({success:true});
         //    }
         //});
     }


    //function saveAttendance(req, callback){
    //    console.log('save.....')
    //    async.waterfall([
    //        saveAttendanceObj.bind(null, req),
    //        saveAttendanceDetailObj.bind()
    //    ], function (err, result) {
    //        console.log('result....vjvjvj',result)
    //        callback(err, result)
    //    })
    //}


    function saveAttendanceObj(req, callback) {
        var body = req.body;
        var users = body.users;
        var AttendanceModel = models.get(req.session.lastDb, 'schoolAttendanceSchema', AttendanceSchema);
        var section =  objectId(body.section)
        var totalStrength = users.length;
        var headers = baseService.getHeaders(req);
        var tenantId = headers.tenant_id;
        var schoolId = headers.school_id;
        var academicYear = headers.academic_year;
        var presenties = _.filter(users, ['isPresent', true]);
        var totalStrength = users.length;
        var noOfPresent = presenties.length;
        var noOfAbsent = totalStrength - noOfPresent;
        var presentPercent = (noOfPresent / totalStrength) * 100;
        var currentDate = new Date();
        var media = baseService.getMedia(req);

        var dataObj = {
            school_id: schoolId,
            tenant_id: tenantId,
            academic_year: academicYear,
            media_name: media,
            class_id : body.classId,
            class_name : body.className,
            section_id : body.sectionId,
            section_name : body.sectionName,
            total_strength :totalStrength,
            admission_no : body.admission_no ,
            no_of_present : noOfPresent,
            no_of_absent : noOfAbsent,
            present_percent : presentPercent,
            attendance_date : new Date(body.attendance_date),
            recorded_date: new Date(currentDate),
            recorded_by: headers.user_id,
            recorded_username : headers.user_name,
            updated_by : headers.user_id,
            updated_username : body.updated_username,
            updated_date: new Date(currentDate),
            created_by : headers.user_id,
            created_date: new Date(currentDate),
            created_firstname: headers.user_name,
        };

        //console.log('dataObj.....',dataObj)
        var Attendance = new AttendanceModel(dataObj);

        Attendance.save(function (err, result) {
            callback(err, req, result)
        });
    }


    function saveAttendanceDetailObj(req, data, callback){
        console.log('data......',data)
        var AttendanceDetailModel = models.get(req.session.lastDb, 'schoolAssignmentDetailsSchema', AttendanceDetailSchema);
        var users = req.body.users;
        var array = [];

        _.forEach(users, function(value,key){
            var dataObj = {
                user_name : value.userName,
                is_hostel : value.isHostel,
                first_name : value.firstName,
            }

            var arrObj = {
                is_present : value.isPresent,
                remarks : value.remarks
            }
            array.push(arrObj);
            dataObj.details = array;

            var AttendanceDetails = new AttendanceDetailModel(dataObj);

            AttendanceDetails.save(function (err, result) {
                console.log('result.......',result)
                callback(err, result)
            });
        })
    }

};

module.exports = Module;