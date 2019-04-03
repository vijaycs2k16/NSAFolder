package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by Sai Deepak on 11-Oct-16.
 */

public class WeekObject implements Serializable {

    private String dayId;
    private String dayName;
    private String employeeId;
    private String employeeName;

    private String subjectName;
    private String subjectId;

    private String subEmpCode;
    private String color;

    public String getDayId() {
        return dayId;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setDayId(String dayId) {
        this.dayId = dayId;
    }

    public String getDayName() {
        return dayName;
    }

    public void setDayName(String dayName) {
        this.dayName = dayName;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }


    public String getSubEmpCode() {
        return subEmpCode;
    }

    public void setSubEmpCode(String subEmpCode) {
        this.subEmpCode = subEmpCode;
    }
}
