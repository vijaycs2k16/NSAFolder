package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by vignesh on 08-05-2017.
 */

public class Holiday implements Serializable {
    private String tenantId;
    private String schoolId;
    private String holidayId;
    private String holidayTypeId;
    private String holidayName;
    private String holidayType;
    private String academicYear;
    private String startDate;
    private String endDate;
    private String fullDate;
    private String updatedDate;
    private String updatedBy;
    private String updatedUsername;
    private String updateddateAndName;

    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getHolidayId() {
        return holidayId;
    }

    public void setHolidayId(String holidayId) {
        this.holidayId = holidayId;
    }

    public String getHolidayTypeId() {
        return holidayTypeId;
    }

    public void setHolidayTypeId(String holidayTypeId) {
        this.holidayTypeId = holidayTypeId;
    }

    public String getHolidayName() {
        return holidayName;
    }

    public void setHolidayName(String holidayName) {
        this.holidayName = holidayName;
    }

    public String getHolidayType() {
        return holidayType;
    }

    public void setHolidayType(String holidayType) {
        this.holidayType = holidayType;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getFullDate() {
        return fullDate;
    }

    public void setFullDate(String fullDate) {
        this.fullDate = fullDate;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getUpdatedUsername() {
        return updatedUsername;
    }

    public void setUpdatedUsername(String updatedUsername) {
        this.updatedUsername = updatedUsername;
    }

    public String getUpdateddateAndName() {
        return updateddateAndName;
    }

    public void setUpdateddateAndName(String updateddateAndName) {
        this.updateddateAndName = updateddateAndName;
    }
}
