package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by Karthik on 7/7/17.
 */

public class ExamSubject implements Serializable {

    private String subject_name;
    private String date;
    private String mark;
    private String examStartTime;
    private String examEndTime;
    private String day;

    public String getSubject_name() {
        return subject_name;
    }

    public void setSubject_name(String subject_name) {
        this.subject_name = subject_name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getMark() {
        return mark;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }

    public String getExamStartTime() {
        return examStartTime;
    }

    public void setExamStartTime(String examStartTime) {
        this.examStartTime = examStartTime;
    }

    public String getExamEndTime() {
        return examEndTime;
    }

    public void setExamEndTime(String examEndTime) {
        this.examEndTime = examEndTime;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }
}
