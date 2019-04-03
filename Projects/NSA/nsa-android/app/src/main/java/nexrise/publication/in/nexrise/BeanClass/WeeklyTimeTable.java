package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by Sai Deepak on 11-Oct-16.
 */

public class WeeklyTimeTable implements Serializable {
    private String periodId;
    private String periodName;
    private String periodStartTime;
    private String periodEndTime;
    private ArrayList<WeekObject> days;

    public String getPeriodId() {
        return periodId;
    }

    public void setPeriodId(String periodId) {
        this.periodId = periodId;
    }

    public String getPeriodName() {
        return periodName;
    }

    public void setPeriodName(String periodName) {
        this.periodName = periodName;
    }

    public String getPeriodStartTime() {
        return periodStartTime;
    }

    public void setPeriodStartTime(String periodStartTime) {
        this.periodStartTime = periodStartTime;
    }

    public String getPeriodEndTime() {
        return periodEndTime;
    }

    public void setPeriodEndTime(String periodEndTime) {
        this.periodEndTime = periodEndTime;
    }

    public ArrayList<WeekObject> getDays() {
        return days;
    }

    public void setDays(ArrayList<WeekObject> days) {
        this.days = days;
    }
}
