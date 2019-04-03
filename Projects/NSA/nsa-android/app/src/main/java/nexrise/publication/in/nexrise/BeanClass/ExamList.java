package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;
import java.util.List;

/**
 * Created by karthik on 04-11-2016.
 */

public class ExamList implements Serializable {
    private String month;
    private String roomNo;
    private String className;
    private String schedule;
    private String examName;
    private List<Subjects> subjects;

    public ExamList(String month, String roomNo, String className, String schedule, String examName, List<Subjects> subjects) {
        this.month = month;
        this.roomNo = roomNo;
        this.className = className;
        this.schedule = schedule;
        this.examName = examName;
        this.subjects = subjects;
    }

    public String getRoomNo() {
        return roomNo;
    }

    public void setRoomNo(String roomNo) {
        this.roomNo = roomNo;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getSchedule() {
        return schedule;
    }

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }

    public String getExamName() {
        return examName;
    }

    public List<Subjects> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<Subjects> subjects) {
        this.subjects = subjects;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }
}
