package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by praga on 14-May-17.
 */

public class FeatureConfiguration implements Serializable {
    private String featureId;
    private String featureName;
    private String tenantId;
    private String schoolId;
    private String schoolName;
    private int mobilePriority;
    private Boolean status;
    private int priority;
    private Boolean sms;
    private Boolean email;
    private Boolean push;
    private String id;
    private String assetUrl;

    public String getFeatureId() {
        return featureId;
    }

    public void setFeatureId(String featureId) {
        this.featureId = featureId;
    }

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
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

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public int getMobilePriority() {
        return mobilePriority;
    }

    public void setMobilePriority(int mobilePriority) {
        this.mobilePriority = mobilePriority;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public Boolean getSms() {
        return sms;
    }

    public void setSms(Boolean sms) {
        this.sms = sms;
    }

    public Boolean getEmail() {
        return email;
    }

    public void setEmail(Boolean email) {
        this.email = email;
    }

    public Boolean getPush() {
        return push;
    }

    public void setPush(Boolean push) {
        this.push = push;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAssetUrl() {
        return assetUrl;
    }

    public void setAssetUrl(String assetUrl) {
        this.assetUrl = assetUrl;
    }
}
