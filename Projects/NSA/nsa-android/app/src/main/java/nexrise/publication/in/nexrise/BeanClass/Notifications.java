package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by Sai Deepak on 14-Oct-16.
 */

public class Notifications implements Serializable {

    private String title;
    private String description;
    private String shortDesc;
    private String status;
    private String publishedBy;
    private String date;
    private String creationTime;

    public Notifications(String title, String description, String shortDesc, String status, String publishedBy, String date, String creationTime) {
        this.title = title;
        this.description = description;
        this.shortDesc = shortDesc;
        this.status = status;
        this.publishedBy = publishedBy;
        this.date = date;
        this.creationTime = creationTime;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(String creationTime) {
        this.creationTime = creationTime;
    }

    public String getPublishedBy() {
        return publishedBy;
    }

    public void setPublishedBy(String publishedBy) {
        this.publishedBy = publishedBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getShortDesc() {
        return shortDesc;
    }

    public void setShortDesc(String shortDesc) {
        this.shortDesc = shortDesc;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

}
