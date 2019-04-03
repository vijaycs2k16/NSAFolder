package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by user on 27-Sep-16.
 */

public class Homework implements Serializable{
    private String firstName;
    private String isSubmitted;
    private String sectionName;
    private String className;
    private String username;
    private String assignmentDetailId;
    private String id;
    private String classId;
    private String sectionid;

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getIsSubmitted() {
        return isSubmitted;
    }

    public void setIsSubmitted(String isSubmitted) {
        this.isSubmitted = isSubmitted;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAssignmentDetailId() {
        return assignmentDetailId;
    }

    public void setAssignmentDetailId(String assignmentDetailId) {
        this.assignmentDetailId = assignmentDetailId;
    }

    public String getAssignmentId() {
        return id;
    }

    public void setAssignmentId(String id) {
        this.id = id;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public String getSectionid() {
        return sectionid;
    }

    public void setSectionid(String sectionid) {
        this.sectionid = sectionid;
    }
}
