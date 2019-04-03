package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by karthik on 18-10-2016.
 */

public class ProgressResult implements Serializable{

    private String name;
    private String classname;
    private String section;
    private int id;
    private String english;
    private String tamil;
    private String maths;
    private String science;
    private String social;
    private String overallGrade;
    private String exam;
    private String duration;
    private String passPercent;

    public ProgressResult(String name, String classname, String section, int id,
                          String english, String tamil, String maths, String science,
                          String social, String overallGrade, String exam, String duration, String passPercent) {
        this.name = name;
        this.classname = classname;
        this.section = section;
        this.id = id;
        this.english = english;
        this.tamil = tamil;
        this.maths = maths;
        this.science = science;
        this.social = social;
        this.overallGrade = overallGrade;
        this.exam = exam;
        this.duration = duration;
        this.passPercent = passPercent;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClassname() {
        return classname;
    }

    public void setClassname(String classname) {
        this.classname = classname;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEnglish() {
        return english;
    }

    public void setEnglish(String english) {
        this.english = english;
    }

    public String getTamil() {
        return tamil;
    }

    public void setTamil(String tamil) {
        this.tamil = tamil;
    }

    public String getMaths() {
        return maths;
    }

    public void setMaths(String maths) {
        this.maths = maths;
    }

    public String getScience() {
        return science;
    }

    public void setScience(String science) {
        this.science = science;
    }

    public String getSocial() {
        return social;
    }

    public void setSocial(String social) {
        this.social = social;
    }

    public String getOverallGrade() {
        return overallGrade;
    }

    public void setOverallGrade(String overallGrade) {
        this.overallGrade = overallGrade;
    }

    public String getExam() {
        return exam;
    }

    public void setExam(String exam) {
        this.exam = exam;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getPassPercent() {
        return passPercent;
    }

    public void setPassPercent(String passPercent) {
        this.passPercent = passPercent;
    }
}
