package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by Sai Deepak on 16-Oct-16.
 */

public class ProfileObject implements Serializable {
    private String first_name;
    private String short_name;
    private String primary_phone;
    private String email;
    private String class_associations;
    private String subjects;
    private String profile_picture;
    private String user_name;
    private String designation;


    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getShort_name() {
        return short_name;
    }

    public void setShort_name(String short_name) {
        this.short_name = short_name;
    }

    public String getPrimary_phone() {
        return primary_phone;
    }

    public void setPrimary_phone(String primary_phone) {
        this.primary_phone = primary_phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getClass_associations() {
        return class_associations;
    }

    public void setClass_associations(String class_associations) {
        this.class_associations = class_associations;
    }

    public String getSubjects() {
        return subjects;
    }

    public void setSubjects(String subjects) {
        this.subjects = subjects;
    }

    public String getProfile_picture() {
        return profile_picture;
    }

    public void setProfile_picture(String profile_picture) {
        this.profile_picture = profile_picture;
    }
}
