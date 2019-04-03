package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by karthik on 17-03-2017.
 */

public class TeacherHomeWork implements Serializable{

    private String id;
    private String tenantId;
    private String schoolId;
    private String academicYear;
    private String assignmentName;
    private String assignmentTypeId;
    private String assignmentTypeName;
    private String assignmentDesc;
    private String notifiedCategories;
    private String subjectId;
    private String subjectName;
    private String dueDate;
    private String repeatOptionId;
    private String repeatOption;
    private int priority;
    private String notifyTo;
    private String attachment;
    private String updatedBy;
    private String updatedDate;
    private String updatedUserName;
    private String status;
    private boolean editPermissions;
    private ArrayList<AttachmentDetails> attachments;
    private String tag;
    private ArrayList<Subject> subjects;

    public String getId() {
        return id;
    }

    public String getNotifiedCategories() {
        return notifiedCategories;
    }

    public void setNotifiedCategories(String notifiedCategories) {
        this.notifiedCategories = notifiedCategories;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTenantId() {
        return tenantId;
    }

    public ArrayList<AttachmentDetails> getAttachments() {
        return attachments;
    }

    public void setAttachments(ArrayList<AttachmentDetails> attachments) {
        this.attachments = attachments;
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

    public String getAssignmentName() {
        return assignmentName;
    }

    public void setAssignmentName(String assignmentName) {
        this.assignmentName = assignmentName;
    }

    public String getAssignmentTypeId() {
        return assignmentTypeId;
    }

    public void setAssignmentTypeId(String assignmentTypeId) {
        this.assignmentTypeId = assignmentTypeId;
    }

    public String getAssignmentTypeName() {
        return assignmentTypeName;
    }

    public void setAssignmentTypeName(String assignmentTypeName) {
        this.assignmentTypeName = assignmentTypeName;
    }

    public String getAssignmentDesc() {
        return assignmentDesc;
    }

    public void setAssignmentDesc(String assignmentDesc) {
        this.assignmentDesc = assignmentDesc;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getRepeatOptionId() {
        return repeatOptionId;
    }

    public void setRepeatOptionId(String repeatOptionId) {
        this.repeatOptionId = repeatOptionId;
    }

    public String getRepeatOption() {
        return repeatOption;
    }

    public void setRepeatOption(String repeatOption) {
        this.repeatOption = repeatOption;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public String getNotifyTo() {
        return notifyTo;
    }

    public void setNotifyTo(String notifyTo) {
        this.notifyTo = notifyTo;
    }

    public String getAttachment() {
        return attachment;
    }

    public void setAttachment(String attachment) {
        this.attachment = attachment;
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

    public String getUpdatedUserName() {
        return updatedUserName;
    }

    public void setUpdatedUserName(String updatedUserName) {
        this.updatedUserName = updatedUserName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isEditPermissions() {
        return editPermissions;
    }

    public void setEditPermissions(boolean editPermissions) {
        this.editPermissions = editPermissions;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public ArrayList<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(ArrayList<Subject> subjects) {
        this.subjects = subjects;
    }
}
