package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONException;
import org.json.JSONObject;

import nexrise.publication.in.nexrise.BeanClass.ParentProfile;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by karthik on 28-10-2016.
 */

public class ParentProfileJsonParser implements Constants  {

    public ParentProfile parse(String json) throws JSONException, NullPointerException {
        ParentProfile parentProfile = new ParentProfile();
            JSONObject mainObject = new JSONObject(json);
            JSONObject dataObject = mainObject.getJSONObject(DATA);
            String id = dataObject.getString("id");
            String profile_picture = dataObject.getString("profile_picture");
            String first_name = dataObject.getString("first_name");
            String user_name = dataObject.getString("user_name");
            String dob = dataObject.getString("date_of_birth");
            String primary_phone = dataObject.getString("primary_phone");
            parentProfile.setUser_name(value(user_name));
            parentProfile.setFirst_name(value(first_name));
            parentProfile.setPrimary_phone(value(primary_phone));
            parentProfile.setDob(value(dob));
            parentProfile.setId(id);
            parentProfile.setProfile_picture(profile_picture);
        return parentProfile;
    }
    public String value(String string){
        String value = " - ";
        if(string.equals("null")){
            value = " - ";
        }else {
            value = string;
        }
        return value;
    }
}
