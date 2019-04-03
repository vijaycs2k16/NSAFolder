package nexrise.publication.in.nexrise.JsonParser;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.ProfileObject;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by Sai Deepak on 16-Oct-16.
 */

public class ProfileJsonParser implements Constants {

    public ProfileObject getProfileList(String jsonObject){
        ProfileObject profileList = new ProfileObject();
        try {
            JSONObject mainObject = new JSONObject(jsonObject);
            JSONArray dataArray = mainObject.getJSONArray(DATA);
            for(int j=0;j<dataArray.length();j++){
                JSONObject dataObject = dataArray.getJSONObject(j);
                String first_name = dataObject.getString("firstName");
                String short_name = dataObject.getString("shortName");
                String primary_phone = dataObject.getString("primaryPhone");
                String email = " - ";
                if(dataObject.has("emailAddress"))
                    email = dataObject.getString("emailAddress");
                JSONObject desg = dataObject.getJSONObject("desg");
                String designation = desg.getString("desg_name");
                String user_name = dataObject.getString("userName");
                JSONArray rolesArray = dataObject.getJSONArray("subjects");
                ArrayList<String> subjectList = new ArrayList<>();
                for(int i=0;i<rolesArray.length();i++){
                    JSONObject arrayObject = rolesArray.getJSONObject(i);
                    String name = arrayObject.getString("subject_name");
                    subjectList.add(name);
                }
                StringBuilder commaSepValueBuilder = new StringBuilder();
                for ( int i=0;i<subjectList.size();i++) {
                    commaSepValueBuilder.append(subjectList.get(i));
                    if ( i != subjectList.size()-1) {
                        commaSepValueBuilder.append(",");
                    }
                }
                profileList.setDesignation(value(designation));
                profileList.setFirst_name(value(first_name));
                profileList.setEmail(value(email));
                profileList.setPrimary_phone(value(primary_phone));
                profileList.setSubjects(commaSepValueBuilder.toString());
                profileList.setShort_name(value(short_name));
                profileList.setUser_name(value(user_name));
            }
        } catch (JSONException | NullPointerException e) {
            e.printStackTrace();
        }
        Log.v("Profile","List"+profileList.getPrimary_phone());
        return profileList;
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
