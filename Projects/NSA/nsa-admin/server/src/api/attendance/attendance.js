/**
 * Created by Kiranmai A on 3/13/2017.
 */


var express = require('express'),
    router = express.Router(),
    attendance = require('../../services/attendance/attendance.service');

router.get('/', attendance.getAllAttendances); //web
router.get('/class/:classId/section/:sectionId/:date', attendance.getUsersByClassAndSection); //web
router.get('/mobile/class/:classId/section/:sectionId/:date', attendance.getUsersByClassAndSections);//mobile
router.get('/', attendance.getAttendanceLists); // -- 1
router.post('/', attendance.saveAttendance); //mobile and web
router.put('/:id', attendance.updateAttendance); //web
router.get('/leave/history/class/:classId/section/:sectionId', attendance.getAllStudentLeaveHistory); // No Need
router.get('/leave/history/overall', attendance.getOverallLeaveHistory); // No Need
router.get('/leave/history/:id', attendance.getUserLeaveHistory);  // get user leave history till date
router.get('/details/:id', attendance.getDetailsByAttendanceId); //mobile and web -----
router.get('/details/user/:id', attendance.getDetailsByUserId);// web ----> // get no of leaves taken by user from details table
router.get('/details/mobile/user/:id', attendance.getDetailsMobileByUserId); // get no of leaves taken by user from details table //mobile
router.post('/leave', attendance.saveLeaveDetails);
router.put('/leave/:id', attendance.updateLeaveDetails);

router.get('/user/overview/:id', attendance.getAttendanceOverviewByUser); //mobile
router.get('/details/month/:id', attendance.getMonthlyAttendanceByUser); ////mobile
router.get('/overall/history', attendance.getOverallAttendanceHistory); // No Need --2
router.get('/history', attendance.getAttendanceHistory); //mobile and web
router.get('/history/overview', attendance.getAttendanceHistoryOverview); //mobile and web

router.get('/month/year', attendance.getAttendanceByMonthOfYear);

router.get('/test', attendance.getAttendanceAll);


module.exports = router;