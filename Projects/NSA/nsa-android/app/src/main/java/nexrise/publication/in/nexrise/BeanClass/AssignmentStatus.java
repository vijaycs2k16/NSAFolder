package nexrise.publication.in.nexrise.BeanClass;

import java.util.ArrayList;

/**
 * Created by Karthik on 4/25/2017.
 */

public class AssignmentStatus {

    private String headerName;
    private ArrayList<Student> studentsList;

    public AssignmentStatus(String headerName, ArrayList<Student> studentsList) {
        this.headerName = headerName;
        this.studentsList = studentsList;
    }

    public String getHeaderName() {
        return headerName;
    }

    public void setHeaderName(String headerName) {
        this.headerName = headerName;
    }

    public ArrayList<Student> getStudentsList() {
        return studentsList;
    }

    public void setStudentsList(ArrayList<Student> studentsList) {
        this.studentsList = studentsList;
    }
}
