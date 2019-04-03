package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by praga on 21-Feb-17.
 */

public class Notify implements Serializable {
    private String notificationId;
    private String id;
    private String username;
    private String academic_year;
    private String updatedDate;
    private String pushTemplateMessage;
    private String status;
    private String sentby;
    private String pushTemplateTitle;
    private String title;
    private String notified_categories;
    private String priority;
    private String CreatedDate;
    private String PhoneNo;
    private String TemplateId;
    private String updatedUsername;
    private boolean editPermission;
    private String notified_students;
    private ArrayList<Student> students;
    private HashMap<String, String> attachments;

    public Notify (String notificationId, String id, String username, String academic_year, String updatedDate, String pushTemplateMessage, String status, String sentby, String pushTemplateTitle, String title, String priority, String CreatedDate, String PhoneNo, String TemplateId, String updatedUsername, String notified_categories) {
        this.notificationId = notificationId;
        this.id = id;
        this.username = username;
        this.academic_year = academic_year;
        this.updatedDate = updatedDate;
        this.pushTemplateMessage = pushTemplateMessage;
        this.status = status;
        this.sentby = sentby;
        this.pushTemplateTitle = pushTemplateTitle;
        this.title = title;
        this.priority = priority;
        this.CreatedDate = CreatedDate;
        this.PhoneNo = PhoneNo;
        this.TemplateId  = TemplateId;
        this.updatedUsername = updatedUsername;
        this.notified_categories = notified_categories;
    }

    public String getTemplateId() {
        return TemplateId;
    }

    public void setTemplateId(String templateId) {
        TemplateId = templateId;
    }

    public String getCreatedDate() {
        return CreatedDate;
    }

    public void setCreatedDate(String createdDate) {
        CreatedDate = createdDate;
    }

    public String getPhoneNo() {
        return PhoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        PhoneNo = phoneNo;
    }

    public String getNotified_categories() {
        return notified_categories;
    }

    public void setNotified_categories(String notified_categories) {
        this.notified_categories = notified_categories;
    }

    public String getNotified_students() {
        return notified_students;
    }

    public void setNotified_students(String notified_students) {
        this.notified_students = notified_students;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSentby() {
        return sentby;
    }

    public void setSentby(String sentby) {
        this.sentby = sentby;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(String notificationId) {
        this.notificationId = notificationId;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAcademic_year() {
        return academic_year;
    }

    public void setAcademic_year(String academic_year) {
        this.academic_year = academic_year;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getPushTemplateMessage() {
        return pushTemplateMessage;
    }

    public void setPushTemplateMessage(String pushTemplateMessage) {
        this.pushTemplateMessage = pushTemplateMessage;
    }

    public String getPushTemplateTitle() {
        return pushTemplateTitle;
    }

    public void setPushTemplateTitle(String pushTemplateTitle) {
        this.pushTemplateTitle = pushTemplateTitle;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUpdatedUsername() {
        return updatedUsername;
    }

    public void setUpdatedUsername(String updatedUsername) {
        this.updatedUsername = updatedUsername;
    }

    public boolean isEditPermission() {
        return editPermission;
    }

    public void setEditPermission(boolean editPermission) {
        this.editPermission = editPermission;
    }

    public ArrayList<Student> getStudents() {
        return students;
    }

    public void setStudents(ArrayList<Student> students) {
        this.students = students;
    }

    public HashMap<String, String> getAttachments() {
        return attachments;
    }

    public void setAttachments(HashMap<String, String> attachments) {
        this.attachments = attachments;
    }
}
