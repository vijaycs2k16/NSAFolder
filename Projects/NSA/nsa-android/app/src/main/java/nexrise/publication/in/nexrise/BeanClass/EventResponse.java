package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by praga on 03-May-17.
 */

public class EventResponse implements Serializable {
    private Boolean sms;
    private Boolean push;
    private Boolean email;
    private String smsTemplateName;
    private String smsTemplateTitle;
    private String pushTemplateName;
    private String pushTemplateTitle;
    private String emailTemplateName;
    private String emailTemplateTitle;

    public Boolean getSms() {
        return sms;
    }

    public void setSms(Boolean sms) {
        this.sms = sms;
    }

    public Boolean getPush() {
        return push;
    }

    public void setPush(Boolean push) {
        this.push = push;
    }

    public Boolean getEmail() {
        return email;
    }

    public void setEmail(Boolean email) {
        this.email = email;
    }

    public String getSmsTemplateName() {
        return smsTemplateName;
    }

    public void setSmsTemplateName(String smsTemplateName) {
        this.smsTemplateName = smsTemplateName;
    }

    public String getSmsTemplateTitle() {
        return smsTemplateTitle;
    }

    public void setSmsTemplateTitle(String smsTemplateTitle) {
        this.smsTemplateTitle = smsTemplateTitle;
    }

    public String getPushTemplateName() {
        return pushTemplateName;
    }

    public void setPushTemplateName(String pushTemplateName) {
        this.pushTemplateName = pushTemplateName;
    }

    public String getPushTemplateTitle() {
        return pushTemplateTitle;
    }

    public void setPushTemplateTitle(String pushTemplateTitle) {
        this.pushTemplateTitle = pushTemplateTitle;
    }

    public String getEmailTemplateName() {
        return emailTemplateName;
    }

    public void setEmailTemplateName(String emailTemplateName) {
        this.emailTemplateName = emailTemplateName;
    }

    public String getEmailTemplateTitle() {
        return emailTemplateTitle;
    }

    public void setEmailTemplateTitle(String emailTemplateTitle) {
        this.emailTemplateTitle = emailTemplateTitle;
    }
}
