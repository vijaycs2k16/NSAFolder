package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by vignesh on 13-09-2017.
 */

public class HallOfFame implements Serializable{
    private String award_name;
    private String date_of_issue;
    private int number_of_students;
    private String description;
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAward_name() {
        return award_name;
    }

    public void setAward_name(String award_name) {
        this.award_name = award_name;
    }

    public String getDate_of_issue() {
        return date_of_issue;
    }

    public void setDate_of_issue(String date_of_issue) {
        this.date_of_issue = date_of_issue;
    }

    public int getNumber_of_students() {
        return number_of_students;
    }

    public void setNumber_of_students(int number_of_students) {
        this.number_of_students = number_of_students;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
