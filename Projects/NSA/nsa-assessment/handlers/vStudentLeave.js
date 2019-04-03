var mongoose = require('mongoose');
var StudentLeaveSchema = mongoose.Schemas.StudentLeave;
var mediaSchema = mongoose.Schemas.mediaTemplate;
var async = require('async');
var pageHelper = require('../helpers/pageHelper');
var moment = require('../public/js/libs/moment/moment');
var CapacityHandler = require('./capacity');
var CONSTANTS = require('../constants/mainConstants');
var notificationHandler = require('../handlers/vNotifications');

var Module = function (models) {

    var capacityHandler = new CapacityHandler(models);
    var NotificationHandler = new notificationHandler(models, null);
    var objectId = mongoose.Types.ObjectId;
    var StudentLeaveSchema = mongoose.Schemas.StudentLeave;
    var studentSchema = mongoose.Schemas.Student
    var DepartmentSchema = mongoose.Schemas.Department;
    var EmployeeSchema = mongoose.Schemas.Employee;
    var async = require('async');
    var _ = require('lodash');

    function calculateWeeks(array, month, year) {
        var dateValue; // = moment([year, month - 1]);
        var resultObj = {};
        var weekKey;
        var dayNumber;
        var day;

        if (array.length) {
            for (day = array.length; day >= 0; day--) {
                if (array[day]) {
                    dateValue = moment([year, month - 1, day + 1]);
                    // weekKey = year * 100 + moment(dateValue).isoWeek();
                    weekKey = dateValue.isoWeekYear() * 100 + dateValue.isoWeek();

                    dayNumber = dateValue.day();

                    if (dayNumber !== 0 && dayNumber !== 6) {
                        resultObj[weekKey] ? resultObj[weekKey] += 1 : resultObj[weekKey] = 1;
                    }

                    if (resultObj[weekKey] === 0) {
                        delete resultObj[weekKey];
                    }
                }
            }
        }

        return resultObj;
    }

    function calculate(data, year, response) {
        var leaveDays = 0;
        var workingDays = 0;
        var vacation = 0;
        var medical = 0;
        var half = 0;
        var sick = 0;
        var education = 0;
        var weekend = 0;
        var startYear;
        var endYear;
        var dayCount;
        var dayMonthCount;
        var startType;
        var endType;
        var monthArray;
        var monthYear;
        var startMonth;
        var day;
        var i;
        var j;

        data.forEach(function (attendance) {
            attendance.vacArray.forEach(function (day) {
                switch (day) {
                    case 'V':
                        vacation++;
                        break;
                    case 'M':
                        medical++;
                        break;
                    case 'H':
                        half++;
                        break;
                    case 'S':
                        sick++;
                        break;
                    case 'E':
                        education++;
                        break;
                    // skip default;
                }
            });
        });

        if (year !== 'Line Year') {
            monthArray = new Array(12);

            for (i = 0; i < monthArray.length; i++) {
                dayMonthCount = moment().set('year', year).set('month', i).endOf('month').date();

                for (j = 1; j <= dayMonthCount; j++) {
                    day = new Date(year, i, j);
                    day = day.getDay();

                    if (day === 0 || day === 6) {
                        weekend++;
                    }
                }
            }

            startYear = moment([year, 0, 1]);
            endYear = moment([year, 11, 31]);
        } else {
            monthArray = new Array(13);
            startMonth = moment().month();

            for (i = 0; i < monthArray.length; i++) {
                if (i >= startMonth) {
                    monthYear = moment().year() - 1;
                } else {
                    monthYear = moment().year();
                }
                dayMonthCount = moment().set('year', monthYear).set('month', i).endOf('month').date();

                for (j = 1; j <= dayMonthCount; j++) {
                    day = new Date(monthYear, i, j);
                    day = day.getDay();
                    if (day === 0 || day === 6) {
                        weekend++;
                    }
                }
            }

            dayCount = moment().set('year', moment().year()).set('month', moment().month()).endOf('month').date();
            startYear = moment([moment().year() - 1, moment().month(), 1]);
            endYear = moment([moment().year(), moment().month(), dayCount]);
        }

        leaveDays = vacation + medical + sick + half + education;
        if(response && response.batch) {
            var batchDate = response.batch.startDate;
            var fDate = moment(batchDate).format('YYYY-MM-DD');
            var nDate = moment(new Date()).format('YYYY-MM-DD');
            fDate = fDate.split('-');
            nDate = nDate.split('-');
            var monthNum = nDate[1] - fDate[1];
            if(+fDate[0] === (+year) && new Date(batchDate) < new Date()) {
                var dateB = moment(moment(batchDate).format('YYYY-MM-DD'));
                var dateC = moment(moment(new Date()).format('YYYY-MM-DD'));
                var days = (new Date() - new Date(batchDate)) / 1000 / 60 / 60 / 24;

                var Weeks=Math.round(days)/7;

                var totalWeekends = Math.round(Weeks)*2;
                workingDays = (dateC.diff(dateB, 'days') + 1) - totalWeekends;
            } else {
                workingDays = endYear.diff(startYear, 'days') - weekend;
            }
        } else {
            workingDays = endYear.diff(startYear, 'days') - weekend;
        }


        return {
            leaveDays  : leaveDays,
            workingDays: workingDays,
            vacation   : vacation,
            medical    : medical,
            half       : half,
            sick       : sick,
            education  : education
        };
    }

    this.getYears = function (req, res, next) {
        var Vacation = models.get(req.session.lastDb, 'StudentLeave', StudentLeaveSchema);
        var query;
        var newYear;
        var year;
        /* var lastEl;
         var length;*/
        var curDate = new Date();
        var curYear = curDate.getFullYear();
        var yearFrom = curYear - CONSTANTS.HR_VAC_YEAR_BEFORE;
        var yearTo = curYear + CONSTANTS.HR_VAC_YEAR_AFTER;

        query = Vacation.distinct('year');

        query.exec(function (err, years) {
            var result;

            if (err) {
                return next(err);
            }
            result = _.map(years, function (element) {
                var el = element;

                element = {};
                element._id = el;
                element.name = el;

                return element;
            });

            for (year = yearFrom; year <= yearTo; year++) {
                newYear = {
                    _id : year,
                    name: year
                };

                if (years.indexOf(year) === -1) {
                    result.push(newYear);
                }
            }

            result.sort();

            /* length = result.length;
             lastEl = result[length - 1];*/

            /* if (lastEl._id >= curDate.getFullYear() - 1) {
             result[length] = {};
             result[length]._id = lastEl._id + 1;
             result[length].name = lastEl._id + 1;
             }*/

            res.status(200).send(result);
        });
    };

    this.getStatistic = function (req, res, next) {
        var month = parseInt(req.query.month, 10) + 1;
        var year = parseInt(req.query.year, 10);
        var Vacation = models.get(req.session.lastDb, 'StudentLeave', StudentLeaveSchema);

        Vacation.aggregate([{
            $match: {
                month: month,
                year : year
            }
        }, {
            $unwind: '$vacArray'
        }, {
            $group: {
                _id  : '$vacArray',
                count: {$sum: 1}
            }
        }], function (err, result) {
            var resObj = {};
            var medical;
            var half;
            var education;
            var vacation;
            var sick;

            if (err) {
                return next(err);
            }

            medical = _.find(result, function (item) {
                return item._id === 'M';
            });

            half = _.find(result, function (item) {
                return item._id === 'H';
            });

            education = _.find(result, function (item) {
                return item._id === 'E';
            });

            vacation = _.find(result, function (item) {
                return item._id === 'V';
            });

            sick = _.find(result, function (item) {
                return item._id === 'S';
            });

            resObj.medical = (medical && medical.count) || 0;
            resObj.half = (half && half.count) || 0;
            resObj.education = (education && education.count) || 0;
            resObj.vacation = (vacation && vacation.count) || 0;
            resObj.sick = (sick && sick.count) || 0;

            res.status(200).send(resObj);
        });
    };

    function getVacationFilter(req, res, next) {
        var Vacation = models.get(req.session.lastDb, 'StudentLeave', StudentLeaveSchema);
        var options = req.query;
        var queryObject = {};
        var startDate;
        var endDate;
        var stat;
        var present;
        var date;
        var startQuery;
        var endQuery;
        var condition1;
        var condition2;
        var employeeQuery = {};

        if (options) {
            if (options.employee) {
                queryObject['employee._id'] = objectId(options.employee);
            }
            if (options.year && options.year !== 'Line Year') {
                if (options.month) {
                    queryObject.year = parseInt(options.year, 10);
                    queryObject.month = parseInt(options.month, 10);
                } else {
                    endDate = moment([options.year, 12]);
                    startDate = moment([options.year, 1]);

                    // queryObject.year = {'$in': [options.year, (options.year - 1).toString()]};
                    queryObject.year = {$in: [parseInt(options.year, 10), (options.year - 1)]}; // changed from String to Number
                }
            } else if (options.year) {
                date = new Date();

                employeeQuery['employee._id'] = queryObject['employee._id'];

                date = moment([date.getFullYear(), date.getMonth()]);

                endDate = new Date(date);
                endDate.setMonth(endDate.getMonth() + 1);

                condition1 = {month: {$lte: parseInt(date.format('M'), 10)}};
                condition2 = {year: {$lte: parseInt(date.format('YYYY'), 10)}};

                endQuery = {$and: [condition1, condition2, employeeQuery]};

                date.subtract(12, 'M');
                startDate = new Date(date);

                // date.subtract(12, 'M');

                condition1 = {month: {$gte: parseInt(date.format('M'), 10)}};
                condition2 = {year: {$gte: parseInt(date.format('YYYY'), 10)}};

                startQuery = {$and: [condition1, condition2, employeeQuery]};

                queryObject = {};

                queryObject.$or = [startQuery, endQuery];
            }
        }

        // query = Vacation.find(queryObject);

        // query.exec(function (err, result) {
        Vacation.aggregate([{
            $lookup: {
                from        : 'Employees',
                localField  : 'employee',
                foreignField: '_id',
                as          : 'employee'
            }
        }, {
            $lookup: {
                from        : 'Department',
                localField  : 'department',
                foreignField: '_id',
                as          : 'department'
            }
        }, {
            $project: {
                department: {$arrayElemAt: ['$department', 0]},
                employee  : {$arrayElemAt: ['$employee', 0]},
                month     : 1,
                year      : 1,
                vacations : 1,
                vacArray  : 1,
                monthTotal: 1
            }
        }, {
            $project: {
                'department.name': 1,
                'employee.name'  : 1,
                'employee._id'   : 1,
                month            : 1,
                year             : 1,
                vacations        : 1,
                vacArray         : 1,
                monthTotal       : 1
            }
        }, {
            $match: queryObject
        }, {
            $sort: {'employee.name.first': 1}
        }
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            if (options.month) {
                res.status(200).send(result);
            } else {
                async.waterfall([
                    function (callback) {
                        var resultObj = {
                            curYear: [],
                            preYear: []
                        };

                        result.forEach(function (element) {
                            date = moment([element.year, element.month]);

                            if (date >= startDate && date <= endDate) {
                                resultObj.curYear.push(element);
                            } else {
                                resultObj.preYear.push(element);
                            }
                        });

                        callback(null, resultObj);
                    }, function (result, callback) {
                        if (options.year !== 'Line Year') {
                            stat = calculate(result.preYear, options.year - 1);
                            present = calculate(result.preYear, options.year);
                        } else {
                            stat = calculate(result.preYear, options.year);
                            present = calculate(result.preYear, options.year + 1);
                        }

                        callback(null, result, stat, present);
                    }
                ], function (err, object, stat, present) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({data: object.curYear, stat: stat, present: present});
                });
            }
        });

    }

    function getVacationByWeek(req, res, next) {
        var Vacation = models.get(req.session.lastDb, 'StudentLeave', StudentLeaveSchema);
        var options = req.query;
        var year = parseInt(options.year, 10);
        var week = parseInt(options.week, 10);
        var employee = options.employee;
        var dateByWeek = week + year * 100;
        var dateByWeekField = 'vacations.' + dateByWeek;
        var date = moment().isoWeekYear(year);
        var aggregateQuery = [];
        var vacationsWeek = {};
        var daysOfMonth = {};
        var query = {};
        var monthDay;
        var month;
        var day;
        var i;

        date.isoWeek(week);

        for (i = 1; i <= 7; i++) {
            date.isoWeekday(i);
            month = date.month() + 1;
            day = date.date();
            daysOfMonth[day + 100 * month] = i;
        }

        query.$match = {};
        query.$match[dateByWeekField] = {$exists: true};
        query.$match.employee = objectId(employee);

        aggregateQuery.push(query);

        query = {
            $project: {
                _id     : 0,
                vacArray: 1,
                month   : 1
            }
        };

        aggregateQuery.push(query);

        query = {
            $unwind: {
                path             : '$vacArray',
                includeArrayIndex: 'day'
            }
        };

        aggregateQuery.push(query);

        Vacation.aggregate(aggregateQuery,
            function (err, result) {
                if (err) {
                    return next(err);
                }
                result.forEach(function (vacation) {
                    day = vacation.day + 1;
                    month = vacation.month;
                    monthDay = day + 100 * month;
                    if (daysOfMonth[monthDay]) {
                        vacationsWeek[daysOfMonth[monthDay]] = vacation.vacArray;
                    }
                });

                res.status(200).send(vacationsWeek);
            });

    }

    this.getForView = function (req, res, next) {
        if (req.query.week) {
            getVacationByWeek(req, res, next);
        } else {
            getVacationFilter(req, res, next);
        }
    };

    this.getStudentAttendance = function (req, res, next) {
        //req.query.id = req.query.id ? req.query.id : req.session.lid
        req.query = {
            year: '2018',
            employee: null,
            centerId: req.query.center ? req.query.center :req.session.cId,
            courseId: req.query.cid ? req.query.cid :req.session.courseId,
            batchId: req.query.bid ? req.query.bid :req.session.bId,
            student: req.query.id ? req.query.id : req.session.lid
        }

        

        var Model = models.get(req.session.lastDb, 'StudentLeave', StudentLeaveSchema);
        var data = req.query;
        var options = req.query;
        var query;
        var queryObject = {};
        var startDate;
        var endDate;
        var stat;
        var present;
        var date;
        var startQuery;
        var endQuery;
        var condition1;
        var condition2;
        var employeeQuery = {};
        if (options.year && options.year !== 'Line Year') {
            if (options.month) {
                queryObject.year = parseInt(options.year, 10);
                queryObject.month = parseInt(options.month, 10);
            } else {
                endDate = moment([options.year, 11, 31]);
                startDate = moment([options.year, 0]);
                // queryObject.year = {'$in': [options.year, (options.year - 1).toString()]};
                queryObject.year = {$in: [parseInt(options.year, 10), (options.year - 1)]}; // changed from String to Number
                queryObject.$and = [{center: mongoose.Types.ObjectId(data.centerId), course: mongoose.Types.ObjectId(data.courseId), batch: mongoose.Types.ObjectId(data.batchId), student:mongoose.Types.ObjectId(data.student)}]
            }
        } else if (options.year) {
            date = new Date();

            employeeQuery['employee._id'] = queryObject['employee._id'];

            date = moment([date.getFullYear(), date.getMonth()]);

            endDate = new Date(date);
            endDate.setMonth(endDate.getMonth() + 1);

            condition1 = {month: {$lte: parseInt(date.format('M'), 10)}};
            condition2 = {year: {$lte: parseInt(date.format('YYYY'), 10)}};

            endQuery = {$and: [condition1, condition2, employeeQuery]};

            date.subtract(12, 'M');
            startDate = new Date(date);

            // date.subtract(12, 'M');

            condition1 = {month: {$gte: parseInt(date.format('M'), 10)}};
            condition2 = {year: {$gte: parseInt(date.format('YYYY'), 10)}};

            startQuery = {$and: [condition1, condition2, employeeQuery]};

            queryObject = {};

            queryObject.$or = [startQuery, endQuery];
            queryObject.$and = [{center: mongoose.Types.ObjectId(data.centerId), course: mongoose.Types.ObjectId(data.courseId), batch: mongoose.Types.ObjectId(data.batchId), year: data.year}]
        }
        Model.aggregate([{
            $match: queryObject}, {
            $lookup: {
                from: 'Batch',
                localField: 'batch',
                foreignField: '_id',
                as: 'batch'
            },
        },{
            $unwind: {
                path : '$batch'
            }
        }], function (err, response) {
            console.log("response", response)
            //query = Model.find({center: data.centerId, course: data.courseId, batch: data.batchId, year: data.year});
            if (err) {
                return next(err);
            }
            async.waterfall([
                function (callback) {
                    var resultObj = {
                        curYear: [],
                        preYear: []
                    };

                    response.forEach(function (element) {
                        date = moment([element.year, (element.month -1)]);
                        if (date >= startDate && date <= endDate) {
                            resultObj.curYear.push(element);
                        } else {
                            resultObj.preYear.push(element);
                        }
                    });

                    callback(null, resultObj);
                }, function (result, callback) {
                    if (options.year !== 'Line Year') {
                        stat = calculate(result.curYear, options.year - 1, response[0]);
                        present = calculate(result.curYear, options.year, response[0]);
                    } else {
                        stat = calculate(result.preYear, options.year, response[0]);
                        present = calculate(result.curYear, options.year + 1, response[0]);
                    }

                    callback(null, result, stat, present);
                }
            ], function (err, object, stat, present) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: object.curYear, stat: stat});
            });
        });
    };

    this.getEmployeeAttendance = function (req, res, next) {
        req.query = {
            year: '2018',
            employee: null,
            centerId: req.session.cId,
            courseId: req.session.courseId,
            batchId: req.session.bId,
            student: req.session.lid
        }

        var Model = models.get(req.session.lastDb, 'StudentLeave', StudentLeaveSchema);
        var data = req.query;
        var options = req.query;
        var query;
        var queryObject = {};
        var startDate;
        var endDate;
        var stat;
        var date;
        var startQuery;
        var endQuery;
        var condition1;
        var condition2;
        var employeeQuery = {};
        if (options.year && options.year !== 'Line Year') {
            if (options.month) {
                queryObject.year = parseInt(options.year, 10);
                queryObject.month = parseInt(options.month, 10);
            } else {
                endDate = moment([options.year, 11, 31]);
                startDate = moment([options.year, 0]);
                // queryObject.year = {'$in': [options.year, (options.year - 1).toString()]};
                queryObject.year = {$in: [parseInt(options.year, 10), (options.year - 1)]}; // changed from String to Number
                queryObject.$and = [{center: mongoose.Types.ObjectId(data.centerId), course: mongoose.Types.ObjectId(data.courseId), batch: mongoose.Types.ObjectId(data.batchId), student:mongoose.Types.ObjectId(data.student)}]
            }
        } else if (options.year) {
            date = new Date();

            employeeQuery['employee._id'] = queryObject['employee._id'];

            date = moment([date.getFullYear(), date.getMonth()]);

            endDate = new Date(date);
            endDate.setMonth(endDate.getMonth() + 1);

            condition1 = {month: {$lte: parseInt(date.format('M'), 10)}};
            condition2 = {year: {$lte: parseInt(date.format('YYYY'), 10)}};

            endQuery = {$and: [condition1, condition2, employeeQuery]};

            date.subtract(12, 'M');
            startDate = new Date(date);

            // date.subtract(12, 'M');

            condition1 = {month: {$gte: parseInt(date.format('M'), 10)}};
            condition2 = {year: {$gte: parseInt(date.format('YYYY'), 10)}};

            startQuery = {$and: [condition1, condition2, employeeQuery]};

            queryObject = {};

            queryObject.$or = [startQuery, endQuery];
            queryObject.$and = [{center: mongoose.Types.ObjectId(data.centerId), course: mongoose.Types.ObjectId(data.courseId), batch: mongoose.Types.ObjectId(data.batchId), year: data.year}]
        }
        Model.aggregate([{
            $match: queryObject
        }], function (err, response) {
            //query = Model.find({center: data.centerId, course: data.courseId, batch: data.batchId, year: data.year});
            if (err) {
                return next(err);
            }
            async.waterfall([
                function (callback) {
                    var resultObj = {
                        curYear: [],
                        preYear: []
                    };

                    response.forEach(function (element) {
                        date = moment([element.year, (element.month -1)]);
                        if (date >= startDate && date <= endDate) {
                            resultObj.curYear.push(element);
                        } else {
                            resultObj.preYear.push(element);
                        }
                    });

                    callback(null, resultObj);
                }, function (result, callback) {
                    if (options.year !== 'Line Year') {
                        stat = calculate(result.curYear, options.year - 1);
                    } else {
                        stat = calculate(result.preYear, options.year);
                    }

                    callback(null, result, stat);
                }
            ], function (err, object, stat) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: object.curYear, stat: stat});
            });
        });
    };

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = req.body;
        var vacArr = data.vacArray || [];
        var dbName = req.session.lastDb;
        var Vacation = models.get(dbName, 'StudentLeave', StudentLeaveSchema);
        var capData = {
            db: dbName
        };

        data.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };

        data.vacations = calculateWeeks(vacArr, data.month, data.year);

        Vacation.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, response) {
            if (err) {
                return next(err);
            }

            capacityHandler.vacationChanged(capData, next);
            capData.id = response.employee;
            capData.year = response.year;
            capData.month = response.month;

            res.status(200).send({success: 'updated'});
            event.emit('setReconcileTimeCard', {
                req     : req,
                month   : response.month,
                year    : response.year,
                employee: response.employee
            });
            event.emit('recollectVacationDash', {dbName: dbName});
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var Vacation = models.get(dbName, 'StudentLeave', StudentLeaveSchema);
        var capData = {db: dbName};
        var uId;

        async.each(body, function (data, cb) {
            var id = data._id;

            capData.id = id;

            data.editedBy = {
                user: uId,
                date: new Date().toISOString()
            };
            delete data._id;

            if (data.vacArray) {
                data.vacations = calculateWeeks(data.vacArray, data.month, data.year);
            }

            Vacation.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'updated'});
        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var dbName = req.session.lastDb;
        var Vacation = models.get(dbName, 'StudentLeave', StudentLeaveSchema);

        Vacation.findByIdAndRemove({_id: id}, function (err, vacation) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: vacation});
            event.emit('setReconcileTimeCard', {
                req     : req,
                month   : vacation.month,
                year    : vacation.year,
                employee: vacation.employee
            });
            event.emit('recollectVacationDash', {dbName: dbName});
        });
    };

    this.create = function(req, res, next){
        var data = {};
        var body = req.body;
        req.body.status = true;
           async.waterfall([
            studentLeave.bind(null, req, data),
            getAttendanceTempalte.bind(),
            constructUsers.bind(),
            NotificationHandler.sendNotification.bind(),
            NotificationHandler.saveAttNotificationInfo.bind()
            ], function(err, result){
            if(err)
                return next(err)
        })

        res.status(200).send({success: 'saved'})
    }

    function getAttendanceTempalte(req, data, cb) {
        var dataObj = {};
        dataObj.userData = data;
        var mediaModel = models.get(req.session.lastDb, 'mediaTemplate', mediaSchema)  ;
        mediaModel.findOne({mid: '39'}, function(err, result){
            dataObj.template = result;
            cb(err, req, dataObj);
        })
    }


    function studentLeave (req, data, callback) {
        var body = req.body;
        var id = req.params.id;
        var dbName = req.session.lastDb;
        var Vacation = models.get(dbName, 'StudentLeave', StudentLeaveSchema);
        var users = [];
        async.each(body, function (data, cb) {
            var vacArr = data.vacArray || [];
            var vacation;
            var vacationKeys;
            var result = 0;
            var dateByMonth;

            data.vacations = calculateWeeks(vacArr, data.month, data.year);
            var tDate = new Date().getDate();
            if(vacArr[tDate - 1] && vacArr[tDate - 1] != null) {
                users.push({"phoneNo": data.studentPhone,student:data.student,studentName: data.studentName, course: data.course, center: data.center, batch: data.batch});
            }
            vacationKeys = Object.keys(data.vacations);

            vacationKeys.forEach(function (key) {
                result += data.vacations[key];
            });

            data.monthTotal = result;

            dateByMonth = parseInt(data.year, 10) * 100 + parseInt(data.month, 10);

            data.dateByMonth = dateByMonth;
            delete data._id;

            vacation = new Vacation(data);
            var delQuery = {student: objectId(data.student), course: objectId(data.course), center: objectId(data.center), batch: objectId(data.batch), month: +data.month, year: +data.year};
            Vacation.remove(delQuery, function (err, result) {
                if(err) {
                    return callback(err)
                }
                vacation.save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    cb(null, result);

                });
            });
        }, function (err, data) {
            callback(err, req, users)
        });

    };

     this.studentLeave = studentLeave;

    function constructUsers(req, data, callback){
        var arr = [];
        var msgdata = {}
        req.body.notify = req.body[0].notify;
        async.each(data.userData, function (datas, cb) {
            var obj = {};
            var string = datas.studentName
            obj.mobile = datas.phoneNo;
            obj.message = data.template.smsTemp.replace(/%s%/g, string ,'$');
            arr.push(obj);
            cb(null, arr);
        }, function (err) {
            if (err) {
                callback(err, null);
            }
        });
        msgdata.data = arr;
        data.users = msgdata;
        callback(null, req, data);
    }

    //this.getUser = getUser;

      /*  this.create = function (req, res, next) {
         var body = req.body;
         var id = req.params.id;
         var dbName = req.session.lastDb;
         var Vacation = models.get(dbName, 'StudentLeave', StudentLeaveSchema);
         async.each(body, function (data, cb) {

             var vacArr = data.vacArray || [];
            var vacation;
            var vacationKeys;
            var result = 0;
            var dateByMonth;

            data.vacations = calculateWeeks(vacArr, data.month, data.year);

            vacationKeys = Object.keys(data.vacations);

            vacationKeys.forEach(function (key) {
                result += data.vacations[key];
            });
            data.monthTotal = result;

            dateByMonth = parseInt(data.year, 10) * 100 + parseInt(data.month, 10);

            data.dateByMonth = dateByMonth;
            delete data._id;

            vacation = new Vacation(data);
            var delQuery = {student: objectId(data.student), course: objectId(data.course), center: objectId(data.center), batch: objectId(data.batch), month: +data.month, year: +data.year};
            Vacation.remove(delQuery, function (err, result) {
                if(err) {
                    return  next(err)
                }
                vacation.save(function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    cb(null, result);
                });
            });
        }, function (err, res) {
            if (err) {
                return next(err);
            }
             res.status(200).send({success: 'saved'});
        });

    };*/

    this.getYearForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'StudentLeave', StudentLeaveSchema);
        var data = req.query;
        var options = req.query;
        var query;
        var queryObject = {};
        var startDate;
        var endDate;
        var stat;
        var present;
        var date;
        var startQuery;
        var endQuery;
        var condition1;
        var condition2;
        var employeeQuery = {};
        if (options.year && options.year !== 'Line Year') {
            if (options.month) {
                queryObject.year = parseInt(options.year, 10);
                queryObject.month = parseInt(options.month, 10);
            } else {
                endDate = moment([options.year, 11, 31]);
                startDate = moment([options.year, 0]);
                // queryObject.year = {'$in': [options.year, (options.year - 1).toString()]};
                queryObject.year = {$in: [parseInt(options.year, 10), (options.year - 1)]}; // changed from String to Number
                queryObject.$and = [{center: mongoose.Types.ObjectId(data.centerId), course: mongoose.Types.ObjectId(data.courseId), batch: mongoose.Types.ObjectId(data.batchId), student:mongoose.Types.ObjectId(data.student)}]
            }
        } else if (options.year) {
            date = new Date();

            employeeQuery['employee._id'] = queryObject['employee._id'];

            date = moment([date.getFullYear(), date.getMonth()]);

            endDate = new Date(date);
            endDate.setMonth(endDate.getMonth() + 1);

            condition1 = {month: {$lte: parseInt(date.format('M'), 10)}};
            condition2 = {year: {$lte: parseInt(date.format('YYYY'), 10)}};

            endQuery = {$and: [condition1, condition2, employeeQuery]};

            date.subtract(12, 'M');
            startDate = new Date(date);

            // date.subtract(12, 'M');

            condition1 = {month: {$gte: parseInt(date.format('M'), 10)}};
            condition2 = {year: {$gte: parseInt(date.format('YYYY'), 10)}};

            startQuery = {$and: [condition1, condition2, employeeQuery]};

            queryObject = {};

            queryObject.$or = [startQuery, endQuery];
            queryObject.$and = [{center: mongoose.Types.ObjectId(data.centerId), course: mongoose.Types.ObjectId(data.courseId), batch: mongoose.Types.ObjectId(data.batchId), year: data.year}]
        }
        Model.aggregate([{
            $match: queryObject}, {
            $lookup: {
                from: 'Batch',
                localField: 'batch',
                foreignField: '_id',
                as: 'batch'
            },
        },{
            $unwind: {
                path : '$batch'
            }
        }], function (err, response) {
            //query = Model.find({center: data.centerId, course: data.courseId, batch: data.batchId, year: data.year});
            if (err) {
                return next(err);
            }
            async.waterfall([
                function (callback) {
                    var resultObj = {
                        curYear: [],
                        preYear: []
                    };

                    response.forEach(function (element) {
                        date = moment([element.year, (element.month -1)]);
                        if (date >= startDate && date <= endDate) {
                            resultObj.curYear.push(element);
                        } else {
                            resultObj.preYear.push(element);
                        }
                    });

                    callback(null, resultObj);
                }, function (result, callback) {
                    if (options.year !== 'Line Year') {
                        stat = calculate(result.preYear, options.year - 1, response[0]);
                        present = calculate(result.curYear, options.year, response[0]);
                    } else {
                        stat = calculate(result.preYear, options.year, response[0]);
                        present = calculate(result.curYear, options.year + 1, response[0]);
                    }

                    callback(null, result, stat, present);
                }
            ], function (err, object, stat, present) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: object.curYear, stat: stat, present: present});
            });


        });
    };

};

module.exports = Module;
