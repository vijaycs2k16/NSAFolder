package nexrise.publication.in.nexrise.EventsFeature;

import java.io.Serializable;

/**
 * Created by praga on 27-Apr-17.
 */

public class PastEventObject implements Serializable {
    private String tagName;
    private String eventName;
    private String eventTitle;
    private String updated_username;
    private String eventDesc;
    private String startDate;
    private String endDate;
    private String startTime;
    private String endTime;

    public String getEventName() {
        return eventName;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public String getUpdated_username() {
        return updated_username;
    }

    public void setUpdated_username(String updated_username) {
        this.updated_username = updated_username;
    }

    public String getEventDesc() {
        return eventDesc;
    }

    public void setEventDesc(String eventDesc) {
        this.eventDesc = eventDesc;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}
