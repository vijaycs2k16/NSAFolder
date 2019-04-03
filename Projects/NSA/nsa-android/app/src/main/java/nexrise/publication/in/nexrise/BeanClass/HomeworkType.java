package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by karthik on 13-03-2017.
 */

public class HomeworkType implements Serializable{
    private String id;
    private String tenantId;
    private String schoolId;
    private String name;
    private String desc;
    private String updatedDate;
    private String updatedBy;
    private String updatedUserName;
    private Boolean Default;
    private String status;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
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

    public String getUpdatedUserName() {
        return updatedUserName;
    }

    public void setUpdatedUserName(String updatedUserName) {
        this.updatedUserName = updatedUserName;
    }

    public Boolean getDefault() {
        return Default;
    }

    public void setDefault(Boolean aDefault) {
        Default = aDefault;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
