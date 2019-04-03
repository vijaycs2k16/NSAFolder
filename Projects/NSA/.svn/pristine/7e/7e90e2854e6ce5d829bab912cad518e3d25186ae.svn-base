package nexrise.publication.in.nexrise.JsonParser;

import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.preference.PreferenceManager;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import nexrise.publication.in.nexrise.Common.DatabaseHelper;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by praga on 07-Apr-17.
 */

public class UserDetailsJsonParser implements Constants {
    private SharedPreferences preferences;
    private SharedPreferences.Editor editor;

    public void getUserDetails(String json ,Context context, boolean saveInPrefs) throws JSONException {
        DatabaseHelper helper = new DatabaseHelper(context);

        preferences = PreferenceManager.getDefaultSharedPreferences(context);
        editor = preferences.edit();

        JSONObject mainObject = new JSONObject(json);
        JSONArray dataArray = mainObject.getJSONArray(DATA);
        for (int i=0;i<dataArray.length();i++){
            JSONObject dataObject = dataArray.getJSONObject(i);
            JSONArray classArray = dataObject.getJSONArray("classes");
            String userName = dataObject.getString("userName");
            String schoolId = dataObject.getString("schoolId");

            for (int j=0;j<classArray.length();j++){
                JSONObject classObject = classArray.getJSONObject(j);
                String classId = classObject.getString("class_id");
                String className = classObject.getString("class_name");
                String section_id = classObject.getString("section_id");
                String section_name = classObject.getString("section_name");
                int update = helper.updateUser(userName, classId, className, section_id, section_name);
                helper.initializeValues(classId, section_id, schoolId, userName);
                Log.v("Classes ","Parser "+classObject);

                if(saveInPrefs) {
                    Cursor cursor = helper.getUser(userName);
                    while (cursor.moveToNext()) {
                        editor.putString(CLASS_ID, cursor.getString(cursor.getColumnIndex(helper.CLASS_ID)));
                        editor.putString(SECTION_ID, cursor.getString(cursor.getColumnIndex(helper.SECTION_ID)));
                        editor.putString(CLASS_NAME, cursor.getString(cursor.getColumnIndex(helper.CLASS_NAME)));
                        editor.putString(SECTION_NAME, cursor.getString(cursor.getColumnIndex(helper.SECTION_NAME)));
                        editor.putString(CURRENT_USERNAME, cursor.getString(cursor.getColumnIndex(helper.USER_NAME)));
                        editor.apply();
                    }
                    cursor.close();
                }
            }
        }
    }
}
