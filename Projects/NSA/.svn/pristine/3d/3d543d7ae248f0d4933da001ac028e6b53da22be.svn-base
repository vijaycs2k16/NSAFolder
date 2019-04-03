/**
 * Created by icomputers on 24/02/18.
 */

exports.exportObj = function (data) {
    var datObj = []
    if(!_.isEmpty(data)) {
        try {
            _.forEach(data, function (value, key) {
                var obj = {};
                obj._id = value._id;
                obj.Center = value.student ? (value.student.center ? value.student.center.centerName: '' ) : '';
                obj.RegNo = value.registrationNo;
                obj.Student = value.student ? value.student.studentName : '';
                obj.Course = value.student ? (value.student.course ? value.student.course.courseName: '' ) : '';
                obj.FeeAmount = value.studentFeeDetails ? value.studentFeeDetails.actualFeeAmount : '';
                obj.DiscountAmount = value.studentFeeDetails ? value.studentFeeDetails.discountAmount : '';
                obj.PaidAmount = value.studentFeeDetails ? value.studentFeeDetails.paidAmount : '';
                obj.Outstanding = value.studentFeeDetails ? (parseInt(value.studentFeeDetails.actualFeeAmount) - parseInt(value.studentFeeDetails.paidAmount)) : '';
                datObj.push(obj);
            });
        }
        catch (err) {
            console.log("err", err)
        }
    }
    return datObj;
};