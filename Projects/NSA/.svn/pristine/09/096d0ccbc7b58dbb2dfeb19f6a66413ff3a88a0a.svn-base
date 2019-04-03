/**
 * Created by kiranmai on 25/01/18.
 */

use CRM;

db.Course.insertMany([{"courseCode": 1, "courseName": "Maths", "courseStatus": 1 , "isDeleteCourse": 1, "orderBy": 0}])

db.Center.insertMany([{"centerCode": "VAC02", "centerName": "KOVILPATTI - VENPER ACADEMY",
    "centerAddress": "No 1/445, 2nd Floor, Upstairs to KFC, Opp to Sri Ramachandra University,, Mount Poonamalle Road, Porur, Chennai, Tamil Nadu 600116",
    "centerEmail":"admission@venperacademy.com", "originalPassword": "venper@123", "centerPassword": "a8504ea9573855d796c8ce97374ba8e1",
    "centerPhoneNo": "9841641333", "centerIncharge": "MRS.Jegatheeswari", "centerInchargeMobileno": "9841354333",
    "circularViewDatetime": {"$date":"2017-09-12T12:40:38.143Z"}, "lastLoginTime": {"$date":"2017-09-12T12:40:38.143Z"}, "centerStatus":1, "isDeleteCenter":0}])

db.CenterCourse.insertMany([{"center": 1, "course" : 1, "centerCourseFees": 100000, "centerCourseStatus": 1, "isDeleteCenterCourse": 0,
    "isDiscountApplicable": null, "actualFees": null, "discountType": null, "discountValue": null}])

db.Batch.insertMany([{"center": 1, "course": 1, "batchName": "class 11 & class 12" , "batchStatus" : 1, "isDeleteBatch": 0}])

db.BatchSchedule.insertMany([{"batch": 1, "subject": 1, "faculty": 1 , "topics": 1, "classhrs": null, "assessmenthrs": null,
    "classDate" : {"$date":"2018-01-28T12:40:38.143Z"}, "classStartTime": "13:00", "classEndTime": "14:00"}])

db.BatchAssessmentSchedule.insertMany([{"batch": 1, "subject": 1, "faculty": 1 , "topics": 1,
    "assessmentDate" : {"$date":"2018-01-28T12:40:38.143Z"}, "assessmentStartTime": "13:00", "assessmentEndTime": "14:00"}])

db.AssignBatch.insertMany([{"faculty": 1, "batch": 1}])

db.Assessments.insertMany([{"assessmentName": "Test", "assessmentDate": {"$date":"2018-01-28T12:40:38.143Z"},
    "assessmentTime" : "14:00"}])

db.AssessmentDetails.insertMany([{"assessment": 1, "studentRegNo": "VAB12345", "subject": 1,
    "topic" : 1, "total_marks": 80}])

db.Class.insertMany([{"classDate": {"$date":"2018-01-28T12:40:38.143Z"}, "className": "Class 4", "startTime": "14:00",
    "endTime": "16:00", "center": 1, "course": 1, "batch": 1, "faculty": 1, "topic": 1, "classStatus": 1, "isDeleteClass": 0}])

db.Topic.insertMany([
    {"course": {"$oid":"5a69b2a43608ae708e4c5663"},"subject": {"$oid": "5a69b2ed3608ae708e4c5666"}, "topics": "Biomolecules"},
    {"course": {"$oid":"5a69b2a43608ae708e4c5663"},"subject": {"$oid": "5a69b2ed3608ae708e4c5664"}, "topics": "Cell cycle & Cell Division"},
    {"course": {"$oid":"5a69b2a43608ae708e4c5663"},"subject": {"$oid": "5a69b2ed3608ae708e4c5667"}, "topics": "APPLICATION OF matrics & determinants"}
])

db.Subject.insertMany([
    {"subjectName": "Physics", "subjectCode": "PHY001", "subjectStatus": 1, "isDeleteSubject": 0},
    {"subjectName": "Chemistry", "subjectCode": "CHE001", "subjectStatus": 1, "isDeleteSubject": 0},
    {"subjectName": "Biology", "subjectCode": "BIO001",  "subjectStatus": 1, "isDeleteSubject": 0},
    {"subjectName": "Mathematics", "subjectCode": "MAT001", "subjectStatus": 1, "isDeleteSubject": 0}
])

db.Student.insertMany([
    {"studentName": "Admin", "studentEmail": "admin@venper.com", "originalPassword": "password","studentPassword": "5f4dcc3b5aa765d61d8327deb882cf99",
        "studentGender": "Male", "studentPhone" : 9790579973, "studentCity": "chennai", "registartionNo" : "VAC03CNCC9", "course": {"$oid":"5a69b2a43608ae708e4c5663"},
        "courseStartDate": {"$date": "2018-01-28T12:40:38.143Z"}, "courseEndDate": {"$date":"2018-02-28T12:40:38.143Z"}, "center": {"$oid": "5a69b3443608ae708e4c5668"},
        "batch": {"$oid": "5a69b3693608ae708e4c5669"}, "totalFees" : 10000,"createdBy": "admin", "createDate" : {"$date": "2018-01-28T12:40:38.143Z"}, "createIp": "192.168.0.121",
        "lastLoginTime": {"$date":"2018-01-28T12:40:38.143Z"},"studentImageName": "blob.jpg", "cirularViewDateTime" : {"$date": "2018-01-28T12:40:38.143Z"},
        "studentStatus": 1, "isDeleteStudent": 0, "academicYear": "2018"},
])

db.Notifications.insert({"tenant_id": 1, "center": 1, "course": 1, "batch": 1, "smsTamplateTitle": "Class Postponed", "smsTamplateMsg": "Physics CLass postponed from 8 to 9", "pushTemplateTitle": "Class Postponed", "pushTemplateMsg": "Physics CLass postponed from 8 to 9", "emailTemplateTitle": "Class Postponed", "emailTemplateMsg": "Physics CLass postponed from 8 to 9", "sender": 1, "count": 20, "createdBy": "admin", "createdDate": "2017-01-26 00:00:00", status: 1})

db.NotificationDetails.insert({"notification": 1, "count": 1, "deactivated": 0, "read": 0, "student": 123}, {"notification": 1, "count": 1, "deactivated": 0, "read": 0, "student": 124})

db.MediaDetails.insert({"availableLimit": 50000, "usedCount": 0, "senderName": "ANTECH", "media": 1})

db.MediaTypes.insert({"mediaName": "sms", "mediaStatus": 1})

db.Events.insert({"tenant_id": 1, "center": 1, "course": 1, "batch": 1, "eventName": "Bashyam School Event", "eventVenue": "Bashyam Guntur", "startDate": "25-01-2018", "endDate": "26-01-2018", "startTime": "09:00", "endTime": "11:00"})

db.EventDetails.insert({"event": 1, "user": 123, "deactivated": 0})