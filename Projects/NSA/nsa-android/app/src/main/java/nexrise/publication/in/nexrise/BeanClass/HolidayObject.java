package nexrise.publication.in.nexrise.BeanClass;

/**
 * Created by Sai Deepak on 11-Oct-16.
 */

public class HolidayObject {

    String festival;
    String date;
    String month;

    public HolidayObject(String festival, String date, String month) {
        this.festival = festival;
        this.date = date;
        this.month = month;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getFestival() {
        return festival;
    }

    public void setFestival(String festival) {
        this.festival = festival;
    }

}
