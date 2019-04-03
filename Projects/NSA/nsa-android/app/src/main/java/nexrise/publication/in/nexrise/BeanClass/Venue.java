package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by rsury on 26-04-2017.
 */

public class Venue implements Serializable{
    private String venue_type_id;
    private String venue_type_name;
    private String location;
    private String tenant_id;
    private String school_id;
    private String updated_date;
    private String updated_by;
    private String updated_username;
    private boolean checked;

    public String getUpdated_username() {
        return updated_username;
    }

    public void setUpdated_username(String updated_username) {
        this.updated_username = updated_username;
    }

    public String getVenue_type_id() {
        return venue_type_id;
    }

    public void setVenue_type_id(String venue_type_id) {
        this.venue_type_id = venue_type_id;
    }

    public String getVenue_type_name() {
        return venue_type_name;
    }

    public void setVenue_type_name(String venue_type_name) {
        this.venue_type_name = venue_type_name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getTenant_id() {
        return tenant_id;
    }

    public void setTenant_id(String tenant_id) {
        this.tenant_id = tenant_id;
    }

    public String getUpdated_date() {
        return updated_date;
    }

    public void setUpdated_date(String updated_date) {
        this.updated_date = updated_date;
    }

    public String getSchool_id() {
        return school_id;
    }

    public void setSchool_id(String school_id) {
        this.school_id = school_id;
    }

    public String getUpdated_by() {
        return updated_by;
    }

    public void setUpdated_by(String updated_by) {
        this.updated_by = updated_by;
    }

    public String getUpdated_userd_name() {
        return updated_username;
    }

    public void setUpdated_userd_name(String updated_userd_name) {
        this.updated_username = updated_userd_name;
    }

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }
}

