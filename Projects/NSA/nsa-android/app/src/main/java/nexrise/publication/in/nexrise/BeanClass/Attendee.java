package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by Karthik on 04-May-17.
 */

public class Attendee implements Serializable{

    private String firstName;
    private String event_detail_id;
    private String userName;
    private String classId;
    private String className;
    private String sectionId;
    private String sectionName;
    private Boolean mandatory;
    private Boolean registered;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getClassId() {
        return classId;
    }

    public Boolean getMandatory() {
        return mandatory;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEvent_detail_id() {
        return event_detail_id;
    }

    public void setEvent_detail_id(String event_detail_id) {
        this.event_detail_id = event_detail_id;
    }

    public void setMandatory(Boolean mandatory) {
        this.mandatory = mandatory;
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

    public Boolean getRegistered() {
        return registered;
    }

    public void setRegistered(Boolean registered) {
        this.registered = registered;
    }
}
