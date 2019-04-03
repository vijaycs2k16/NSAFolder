package nexrise.publication.in.nexrise.BeanClass;

/**
 * Created by karthik on 15-10-2016.
 */

public class PastEvents {
    private String tag;
    private String event;
    private String date;

    public PastEvents(String tag, String event, String date) {
        this.tag = tag;
        this.event = event;
        this.date = date;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
