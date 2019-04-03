package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by praga on 24-May-17.
 */

public class LeaveApproval implements Serializable {
    private String empId;
    private String appliedLeaveId;
    private String tenantId;
    private String schoolId;
    private String academicYear;
    private String reportingEmpId;
    private String requestedDate;
    private String updatedBy;
    private String designation;
    private String empName;
    private String fromDate;
    private String toDate;
    private String leaveTypeName;
    private int leavesCount;
    private String leaveReason;
    private String leaveTypeId;
    private String status;
    private String updatedDate;
    private String totalLeaves;
    private String remainingLeaves;


    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getEmpId() {
        return empId;
    }


    public String getAppliedLeaveId() {
        return appliedLeaveId;
    }

    public void setAppliedLeaveId(String appliedLeaveId) {
        this.appliedLeaveId = appliedLeaveId;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getReportingEmpId() {
        return reportingEmpId;
    }

    public void setReportingEmpId(String reportingEmpId) {
        this.reportingEmpId = reportingEmpId;
    }

    public int getLeavesCount() {
        return leavesCount;
    }

    public void setLeavesCount(int leavesCount) {
        this.leavesCount = leavesCount;
    }

    public String getRequestedDate() {
        return requestedDate;
    }

    public void setRequestedDate(String requestedDate) {
        this.requestedDate = requestedDate;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getTotalLeaves() {
        return totalLeaves;
    }

    public void setTotalLeaves(String totalLeaves) {
        this.totalLeaves = totalLeaves;
    }

    public String getRemainingLeaves() {
        return remainingLeaves;
    }

    public void setRemainingLeaves(String remainingLeaves) {
        this.remainingLeaves = remainingLeaves;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public String getFromDate() {
        return fromDate;
    }

    public void setFromDate(String fromDate) {
        this.fromDate = fromDate;
    }

    public String getToDate() {
        return toDate;
    }

    public void setToDate(String toDate) {
        this.toDate = toDate;
    }

    public String getLeaveTypeName() {
        return leaveTypeName;
    }

    public void setLeaveTypeName(String leaveTypeName) {
        this.leaveTypeName = leaveTypeName;
    }

    public String getLeaveReason() {
        return leaveReason;
    }

    public void setLeaveReason(String leaveReason) {
        this.leaveReason = leaveReason;
    }

    public String getLeaveTypeId() {
        return leaveTypeId;
    }

    public void setLeaveTypeId(String leaveTypeId) {
        this.leaveTypeId = leaveTypeId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
