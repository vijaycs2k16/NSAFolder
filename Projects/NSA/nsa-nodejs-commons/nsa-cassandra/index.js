/**
 * Created by magesh on 1/29/17.
 */

module.exports = {

    Models: require('./src/models/index'),
    Base: require('./src/services/common/index'),
    BaseService: require('./src/services/common/base.service'),
    Ping: require('./src/services/ping/ping.service'),
    Authentication: require('./src/services/authentication/authentication.service'),
    Template: require('./src/services/sms/templates/templates.service'),
    User: require('./src/services/user/user.service'),
    Department: require('./src/services/user-mgmt/department.service'),
    Designation: require('./src/services/user-mgmt/designation.service'),
    LeaveType: require('./src/services/user-mgmt/leaveType.service'),
    LeaveAssign: require('./src/services/user-mgmt/leaveAssign.service'),
    UserMgmt: require('./src/services/user-mgmt/user.service'),
    UserClassify: require('./src/services/user-mgmt/userClassify.service'),
    UserContact: require('./src/services/user-mgmt/userContact.service'),
    Contact: require('./src/services/contact/contact.service'),
    UserJson: require('./src/services/user/createJson.service'),
    Fee: require('./src/services/fee/fee.service'),
    Taxanomy: require('./src/services/taxanomy/taxanomy.service'),
    Languages: require('./src/services/language/language.service'),
    Terms: require('./src/services/terms/terms.service'),
    Feature: require('./src/services/feature/feature.service'),
    MediaUsageLimit: require('./src/services/media/mediaUsageLimit.service'),
    Notification: require('./src/services/sms/notifications/notification.service'),
    Onboard: require('./src/services/sms/onboard/onboard.service'),
    MediaUsageLog: require('./src/services/media/mediaUsageLog.service'),
    Subject: require('./src/services/subject/subject.service'),
    Scheduler: require('./src/services/scheduler/scheduler.service'),
    Notifications: require('./src/services/notifications/notification.service'),
    AssignmentTypes: require('./src/services/assignments/assignmentTypes.service'),
    feedBackDetails: require('./src/services/feedback/feedback.service'),
    Assignments: require('./src/services/assignments/assignments.service'),
    AuditLog: require('./src/services/auditLog/auditLog.service'),
    Conversation: require('./src/services/conversation/conversation.service'),
    Classes: require('./src/services/class/class.service'),
    Section: require('./src/services/section/section.service'),
    Attendance: require('./src/services/attendance/attendance.service'),
    Academics: require('./src/services/academics/academics.service.js'),
    NotificationConverter: require('./src/converters/notification.converter'),
    TemplateConverter: require('./src/converters/template.converter'),
    FeeTransactionObjConverter: require('./src/converters/feeTransactionObject.converter'),
    FeeTransaction: require('./src/services/payment/feeTransaction.service'),
    Periods: require('./src/services/periods/periods.service'),
    Timetable: require('./src/services/timetable/timetable.service'),
    Days: require('./src/services/days/days.service'),
    Aspect: require('./src/services/aspects/aspects.service'),
    Holiday: require('./src/services/holidays/holidays.service'),
    School: require('./src/services/school/school.service'),
    Member: require('./src/services/school/members.service'),
    Vehicle: require('./src/services/transport/vehicle.service'),
	Events: require('./src/services/events/events.service'),
    Course: require('./src/services/course/course.service'),
    Driver: require('./src/services/transport/driver.service'),
    Route: require('./src/services/transport/route.service'),
    VehicleAllocation: require('./src/services/transport/vehicleAllocation.service'),
    Leaves: require('./src/services/leaves/leaves.service'),
    Date: require('./src/utils/date.service'),
    Roles: require('./src/services/roles/roles.service'),
    Gallery: require('./src/services/gallery/gallery.service'),
    Exam: require('./src/services/exam/exam.service'),
    Marks: require('./src/services/marks/marks.service'),
    Grades: require('./src/services/grades/grades.service'),
    VoiceNotification: require('./src/services/voice/notification.service'),
    HallOFFame: require('./src/services/hall-of-fame/hallOfFame.service'),
    Promotion: require('./src/services/promotions/promotion.service'),
    Nexapp: require('./src/services/nexapp/nexapp.service'),
    Syllabus: require('./src/services/syllabus/syllabus.service'),
    groups: require('./src/services/groups/groups.service'),
};
