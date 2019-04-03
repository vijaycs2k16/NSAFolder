package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by karthik on 12/7/17.
 */

public class MMS implements Serializable{

    private String fileName;
    private String schoolId;
    private String audioId;
    private String updatedDate;
    private String publishedBy;
    private String downloadLink;
    private String notifiedCategories;
    private String status;
    private ArrayList<Student> students;
    private String title;
    private String id;
    private boolean isEditPermission;

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }

    public String getAudioId() {
        return audioId;
    }

    public void setAudioId(String audioId) {
        this.audioId = audioId;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getPublishedBy() {
        return publishedBy;
    }

    public void setPublishedBy(String publishedBy) {
        this.publishedBy = publishedBy;
    }

    public String getDownloadLink() {
        return downloadLink;
    }

    public void setDownloadLink(String downloadLink) {
        this.downloadLink = downloadLink;
    }

    public String getNotifiedCategories() {
        return notifiedCategories;
    }

    public void setNotifiedCategories(String notifiedCategories) {
        this.notifiedCategories = notifiedCategories;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ArrayList<Student> getStudents() {
        return students;
    }

    public void setStudents(ArrayList<Student> students) {
        this.students = students;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean isEditPermission() {
        return isEditPermission;
    }

    public void setEditPermission(boolean editPermission) {
        isEditPermission = editPermission;
    }

}
