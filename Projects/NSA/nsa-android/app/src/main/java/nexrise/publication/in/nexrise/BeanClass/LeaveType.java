package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by senthil on 25-May-17.
 */

public class LeaveType implements Serializable {
    private String id;
    private String emp_id;
    private String emp_username;
    private String reporting_emp_id;
    private String reporting_emp_username;
    private String dept_id;
    private String leave_type_id;
    private String leave_type_name;
    private String no_of_leaves;
    private String updated_date;
    private String updated_by;
    private String updated_username;
    private String updated_name;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmp_id() {
        return emp_id;
    }

    public void setEmp_id(String emp_id) {
        this.emp_id = emp_id;
    }

    public String getEmp_username() {
        return emp_username;
    }

    public void setEmp_username(String emp_username) {
        this.emp_username = emp_username;
    }

    public String getReporting_emp_id() {
        return reporting_emp_id;
    }

    public void setReporting_emp_id(String reporting_emp_id) {
        this.reporting_emp_id = reporting_emp_id;
    }

    public String getReporting_emp_username() {
        return reporting_emp_username;
    }

    public void setReporting_emp_username(String reporting_emp_username) {
        this.reporting_emp_username = reporting_emp_username;
    }

    public String getDept_id() {
        return dept_id;
    }

    public void setDept_id(String dept_id) {
        this.dept_id = dept_id;
    }

    public String getLeave_type_id() {
        return leave_type_id;
    }

    public void setLeave_type_id(String leave_type_id) {
        this.leave_type_id = leave_type_id;
    }

    public String getLeave_type_name() {
        return leave_type_name;
    }

    public void setLeave_type_name(String leave_type_name) {
        this.leave_type_name = leave_type_name;
    }

    public String getNo_of_leaves() {
        return no_of_leaves;
    }

    public void setNo_of_leaves(String no_of_leaves) {
        this.no_of_leaves = no_of_leaves;
    }

    public String getUpdated_date() {
        return updated_date;
    }

    public void setUpdated_date(String updated_date) {
        this.updated_date = updated_date;
    }

    public String getUpdated_by() {
        return updated_by;
    }

    public void setUpdated_by(String updated_by) {
        this.updated_by = updated_by;
    }

    public String getUpdated_username() {
        return updated_username;
    }

    public void setUpdated_username(String updated_username) {
        this.updated_username = updated_username;
    }

    public String getUpdated_name() {
        return updated_name;
    }

    public void setUpdated_name(String updated_name) {
        this.updated_name = updated_name;
    }
}
