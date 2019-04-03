package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by praga on 27-Mar-17.
 */

public class FeatureChannel implements Serializable {

    private String tenant_id;
    private String feature_id;
    private String school_id;
    private Boolean sms;
    private Boolean email;
    private Boolean push;

    public String getTenant_id() {
        return tenant_id;
    }

    public void setTenant_id(String tenant_id) {
        this.tenant_id = tenant_id;
    }

    public String getFeature_id() {
        return feature_id;
    }

    public void setFeature_id(String feature_id) {
        this.feature_id = feature_id;
    }

    public String getSchool_id() {
        return school_id;
    }

    public void setSchool_id(String school_id) {
        this.school_id = school_id;
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
}
