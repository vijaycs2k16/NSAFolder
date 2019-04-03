package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by praga on 20-Mar-17.
 */

public class LeaveStatus implements Serializable {
    private String id;
    private String tenantId;
    private String schoolId;
    private String academicYear;
    private String attendanceId;
    private String userName;
    private String admissionNo;
    private String firstName;
    private String classId;
    private String className;
    private String sectionId;
    private String sectionName;
    private int isPresent;
    private String attendanceDate;
    private String recordedDate;
    private String recordedBy;
    private String recordedUsername;
    private String updatedBy;
    private String updatedDate;
    private String updatedUsername;
    private String remarks;
    private int isAbsent;
    private int totalDays;
    private int percent;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getAttendanceId() {
        return attendanceId;
    }

    public void setAttendanceId(String attendanceId) {
        this.attendanceId = attendanceId;
    }


    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAdmissionNo() {
        return admissionNo;
    }

    public void setAdmissionNo(String admissionNo) {
        this.admissionNo = admissionNo;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getSectionId() {
        return sectionId;
    }

    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public int getIsPresent() {
        return isPresent;
    }

    public void setIsPresent(int isPresent) {
        this.isPresent = isPresent;
    }

    public String getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(String attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public String getRecordedDate() {
        return recordedDate;
    }

    public void setRecordedDate(String recordedDate) {
        this.recordedDate = recordedDate;
    }

    public String getRecordedBy() {
        return recordedBy;
    }

    public void setRecordedBy(String recordedBy) {
        this.recordedBy = recordedBy;
    }

    public String getRecordedUsername() {
        return recordedUsername;
    }

    public void setRecordedUsername(String recordedUsername) {
        this.recordedUsername = recordedUsername;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedUsername() {
        return updatedUsername;
    }

    public void setUpdatedUsername(String updatedUsername) {
        this.updatedUsername = updatedUsername;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public int getIsAbsent() {
        return isAbsent;
    }

    public void setIsAbsent(int isAbsent) {
        this.isAbsent = isAbsent;
    }

    public int getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(int totalDays) {
        this.totalDays = totalDays;
    }

    public int getPercent() {
        return percent;
    }

    public void setPercent(int percent) {
        this.percent = percent;
    }
}