package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;
import java.util.List;

/**
 * Created by karthik on 04-11-2016.
 */

public class Subjects implements Serializable {
    private String date;
    private String session;
    private String subjectName;
    private List<Portions> portions;

    public Subjects(String date, String session, String subjectName, List<Portions> portions) {
        this.date = date;
        this.session = session;
        this.subjectName = subjectName;
        this.portions = portions;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getSession() {
        return session;
    }

    public void setSession(String session) {
        this.session = session;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public List<Portions> getExamList() {
        return portions;
    }

    public void setExamList(List<Portions> portions) {
        this.portions = portions;
    }
}
