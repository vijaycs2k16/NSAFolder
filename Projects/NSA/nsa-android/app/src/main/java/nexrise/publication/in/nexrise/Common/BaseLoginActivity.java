package nexrise.publication.in.nexrise.Common;

import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.preference.PreferenceManager;
import android.util.Base64;
import android.util.Log;

import org.apache.http.message.BasicHeader;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;

import nexrise.publication.in.nexrise.BeanClass.FeatureConfiguration;
import nexrise.publication.in.nexrise.BeanClass.Icons;
import nexrise.publication.in.nexrise.BeanClass.User;
import nexrise.publication.in.nexrise.Config;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.FeatureConfigurationParser;
import nexrise.publication.in.nexrise.JsonParser.UserDetailsJsonParser;
import nexrise.publication.in.nexrise.NavigationDrawerActivity;
import nexrise.publication.in.nexrise.ParentFeatures.ParentLogin.MultipleSchoolsActivity;
import nexrise.publication.in.nexrise.ParentFeatures.ParentLogin.ParentLogin;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Karthik on 9/25/17.
 */

public class BaseLoginActivity extends BaseActivity implements Constants {

    SharedPreferences preferences;
    SharedPreferences.Editor editor;
    HashMap<String, String> device_token = new HashMap<>();

    public String decode(String token) {
        String decoded = null;
        try {
            String[] split = token.split("\\.");
            byte[] decodedBytes = Base64.decode(split[1], Base64.URL_SAFE);
            decoded = new String(decodedBytes, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return decoded;
    }

    public LinkedHashMap<String,Icons> initiateConfig(LinkedHashMap<String,Icons> featureBasedIcons) {
        if(featureBasedIcons == null) {
            Config config = new Config();
            return config.getFeatureBasedIcons();
        }
        return featureBasedIcons;
    }

    public void getUserAndConfig(String currentUserId)throws Exception {
        // Once we get the session token we will make another rest call with session token as header and get the serverAPIKey and project number
        DatabaseHelper helper = new DatabaseHelper(this);

        String userCredentialsUrl = BASE_URL + API_VERSION_ONE + AUTHENTICATE + CREDENTIALS + "/" + currentUserId;
        GETUrlConnection getUserCredentials = new GETUrlConnection(BaseLoginActivity.this, userCredentialsUrl, null);
        getUserCredentials.execute();

        String configUrl = BASE_URL + API_VERSION_ONE + FEATURE + APP + "/" + ACTIVE;
        Log.v("Configuration ", "url " + configUrl);
        GETUrlConnection getConfig = new GETUrlConnection(BaseLoginActivity.this, configUrl, null);
        getConfig.execute();

        if (StringUtils.userRole.equalsIgnoreCase(PARENT))
            getUserClassAndSection(true);
        else {
            SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
            preferences.edit().putString(CLASS_ID, "NIL").apply();
            preferences.edit().putString(SECTION_ID, "NIL").apply();

            String schoolId = preferences.getString(SCHOOL_ID, null);
            String userName = preferences.getString(CURRENT_USERNAME, null);
            String classId= preferences.getString(CLASS_ID, null);
            String sectionId = preferences.getString(SECTION_ID, null);
            helper.initializeValues(classId, sectionId, schoolId, userName);
        }

        String userCredentials = getUserCredentials.get();
        Log.v("userCredentials ", "response " + userCredentials);
        JSONObject userCredentialsObj = new JSONObject(userCredentials);
        JSONObject userCredentialsData = userCredentialsObj.getJSONObject(DATA);
        JSONObject user = userCredentialsData.getJSONObject("user");
        String deviceToken = user.getString("deviceToken");
        device_token = new StringUtils().stringToMap(deviceToken);

        Intent messageReceivingService = new Intent(BaseLoginActivity.this, MessageReceivingService.class);
        messageReceivingService.putExtra(DEVICE_TOKEN, device_token);
        Log.v("MAP ", " " + device_token);
        startService(messageReceivingService);

        String configuration = getConfig.get();
        Log.v("Configuration ", "response " + configuration);
        JSONObject configJson = new JSONObject(configuration);
        JSONArray features = configJson.getJSONArray(DATA);
        String schoolId = features.getJSONObject(0).getString("schoolId");
        helper.saveConfig(schoolId, configuration);

        ArrayList<FeatureConfiguration> configurationList = new ArrayList<FeatureConfiguration>();
        FeatureConfigurationParser featureConfigurationParser = new FeatureConfigurationParser();
        configurationList = featureConfigurationParser.configJsonParser(configuration);
        LinkedHashMap<String, Icons> featureList = initiateConfig(Config.featureBasedIcons);

        MessageReceivingService.newFeatureList.clear();
        for (int i = 0; i < configurationList.size(); i++) {
            String featureId = configurationList.get(i).getFeatureId();
            if (configurationList.get(i).getStatus()) {
                Log.v("FEature ", "featureId " + featureId);
                Icons icons = featureList.get(featureId);
                MessageReceivingService.newFeatureList.put(featureId, icons);
            }
        }

        Intent intent = new Intent(BaseLoginActivity.this, NavigationDrawerActivity.class);
        startActivity(intent);
    }

    public void authorizeSibilings(final User user) {
        JSONObject body = getJsonBody(user.getUsername());
        final String encodedUserName = Uri.encode(user.getUsername());

        if (body == null)
            return;
        String authorizeUrl = BASE_URL + API_VERSION_ONE + AUTHENTICATE + "/" +APP + "/" + AUTHORIZE;
        POSTUrlConnection authorize = new POSTUrlConnection(body, authorizeUrl, new StringUtils().getHeadersWithoutSession(BaseLoginActivity.this), BaseLoginActivity.this) {

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    JSONObject responseObj = new JSONObject(response);
                    JSONObject data = responseObj.getJSONObject(DATA);
                    String currentUserId = handleToken(data, encodedUserName, false);

                    DatabaseHelper helper = new DatabaseHelper(BaseLoginActivity.this);
                    Cursor cursor = helper.getUser(user.getUsername());
                    String sessionToken = "";

                    while (cursor.moveToNext())
                        sessionToken = cursor.getString(cursor.getColumnIndex(helper.SESSION_TOKEN));

                    cursor.close();

                    String classNameAndSectionUrl = BASE_URL + API_VERSION_ONE + ES + USER + user.getUsername();
                    Log.v("Sibilings ","response "+classNameAndSectionUrl);
                    BasicHeader[] headers = new BasicHeader[]{
                            new BasicHeader("Accept","application/json")
                            ,new BasicHeader("Content-Type","application/json")
                            ,new BasicHeader("academic_year",ACADEMIC_YEAR)
                            ,new BasicHeader("session-id", sessionToken)};

                    //For siblings with different schoolID with same tenantID  may have different features for each schoolID to fetch that feature the below call is done
                    Cursor configCursor = helper.getConfig(user.getSchoolId());
                    if(configCursor.getCount() == 0) {
                        String configUrl = BASE_URL + API_VERSION_ONE + FEATURE + APP + "/" + ACTIVE;
                        GETUrlConnection getConfig = new GETUrlConnection(BaseLoginActivity.this, configUrl, headers);
                        getConfig.execute();

                        String configuration = getConfig.get();
                        Log.v("Configuration ", "response " + configuration);
                        JSONObject configJson = new JSONObject(configuration);
                        JSONArray features = configJson.getJSONArray(DATA);
                        String schoolId = features.getJSONObject(0).getString("schoolId");
                        helper.saveConfig(schoolId, configuration);
                    }
                    configCursor.close();

                    GETUrlConnection getresponse = new GETUrlConnection(BaseLoginActivity.this,classNameAndSectionUrl,headers){
                        @Override
                        protected void onPostExecute(String response) {
                            super.onPostExecute(response);
                            Log.v("Elastic","response"+response);
                            UserDetailsJsonParser userDetailsJsonParser = new UserDetailsJsonParser();
                            try {
                                userDetailsJsonParser.getUserDetails(response,BaseLoginActivity.this, false);
                            } catch (JSONException | NullPointerException e) {
                                e.printStackTrace();
                            }
                        }
                    };
                    getresponse.execute();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                Log.v("PARENT ","login "+response);
            }
        };
        authorize.execute();
    }

    public JSONObject getJsonBody(String username) {
        JSONObject obj = null;
        try {
            obj = new JSONObject();
            obj.put("accessId", ACCESS_ID);
            obj.put("username", username);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }

    public void getUserClassAndSection(final boolean saveInPrefs)throws Exception {
        if(preferences == null) preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String classNameAndSectionUrl = BASE_URL + API_VERSION_ONE + ES + USER + preferences.getString(CURRENT_USERNAME,null);
        Log.v("Elastic"," url "+classNameAndSectionUrl);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String sesssionToken = preferences.getString(SESSION_TOKEN, null);
        Log.v("sesssionToken"," token "+sesssionToken);
        GETUrlConnection getresponse = new GETUrlConnection(this,classNameAndSectionUrl,null);
        UserDetailsJsonParser userDetailsJsonParser = new UserDetailsJsonParser();
        String response = getresponse.execute().get();
        Log.v("Elastic","response"+response);
        userDetailsJsonParser.getUserDetails(response,BaseLoginActivity.this, saveInPrefs);

        /*{
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Elastic","response"+response);
                UserDetailsJsonParser userDetailsJsonParser = new UserDetailsJsonParser();
                try {
                    userDetailsJsonParser.getUserDetails(response,BaseLoginActivity.this, saveInPrefs);
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                }
            }
        };*/
    }

    public String handleToken(JSONObject data, String encodedUserName, boolean saveInPrefs) throws JSONException, NullPointerException {
        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        editor = preferences.edit();

        String decoded = decode(data.getString("id_token"));
        Log.v("id_token", " " + decoded);
        JSONObject userObj = new JSONObject(decoded);
        String sessionToken = userObj.getString("session_id");
        String userType = userObj.getString("user_type");
        String firstName = userObj.getString("first_name");
        String schoolId = userObj.getString("school_id");
        String tenantId = userObj.getString("tenant_id");
        String academicYear = userObj.getString("academic_year");

        if (userType.equalsIgnoreCase("employee") || userType.equalsIgnoreCase("schooladmin")) {
            StringUtils.userRole = "Employee";
            editor.putString(USER_ROLE, "Employee");
        } else if(userType.equalsIgnoreCase("parent") || userType.equalsIgnoreCase("student")){
            StringUtils.userRole = "Parent";
            editor.putString(USER_ROLE, "Parent");
        }

        if(!academicYear.isEmpty() && academicYear != null && !academicYear.equals("null"))
            editor.putString(CURRENT_ACADEMIC_YEAR, academicYear);
        else
            editor.putString(CURRENT_ACADEMIC_YEAR, ACADEMIC_YEAR);

        String currentUserId = userObj.getString("id");
        String userName = Uri.encode(userObj.getString("user_name"));

        JSONArray permissionsArray = userObj.getJSONArray("permissions");
        MessageReceivingService.permissions.clear();
        for (int i = 0; i < permissionsArray.length(); i++) {
            MessageReceivingService.permissions.add(permissionsArray.getString(i));
        }
        DatabaseHelper helper = new DatabaseHelper(this);
        helper.saveUser(userName, userName, schoolId, sessionToken, firstName, permissionsArray.toString());

        if(saveInPrefs) {
            Cursor cursor = helper.getUser(userName);

            while (cursor.moveToNext()) {
                editor.putString(SESSION_TOKEN, cursor.getString(cursor.getColumnIndex(helper.SESSION_TOKEN)));
                editor.putString(FIRST_NAME, cursor.getString(cursor.getColumnIndex(helper.FIRST_NAME)));
                editor.putString(CURRENT_USERNAME, cursor.getString(cursor.getColumnIndex(helper.USER_NAME)));
                editor.putString(CURRENT_USER_ID, cursor.getString(cursor.getColumnIndex(helper.USER_ID)));
                editor.putString(SCHOOL_ID, cursor.getString(cursor.getColumnIndex(helper.SCHOOL_ID)));
                editor.putString(TENANT_ID, tenantId);
                editor.putString(PERMISSIONS, cursor.getString(cursor.getColumnIndex(helper.PERMISSIONS)));
                editor.apply();
            }
        }

        return currentUserId;
    }

    public void parseMultipleSchools(JSONArray dataAry) throws Exception {
        HashMap<String, ArrayList<User>> multipleUsers = new HashMap<>();
        for(int i=0; i<dataAry.length(); i++) {
            JSONObject data = dataAry.getJSONObject(i);
            String schoolId = data.getString("school_id");
            String schoolName = data.getString("school_name");
            String userId = data.getString("user_id");
            String firstName = data.getString("first_name");
            String username = data.getString("user_name");

            User user = new User();
            user.setSchoolId(schoolId);
            user.setFirstName(firstName);
            user.setSchoolName(schoolName);
            user.setUserId(userId);
            user.setUsername(username);

            String key = schoolId + " "+schoolName;
            if(multipleUsers.containsKey(key)) {
                ArrayList<User> users = multipleUsers.get(key);
                users.add(user);
            } else {
                ArrayList<User> users = new ArrayList<>();
                users.add(user);
                multipleUsers.put(key, users);
            }
        }

        if(multipleUsers.size() > 1) {
            Intent intent = new Intent(BaseLoginActivity.this, MultipleSchoolsActivity.class);
            intent.putExtra(MULTIPLE_USERS, multipleUsers);
            startActivity(intent);
        } else {
            Intent intent = new Intent(BaseLoginActivity.this, ParentLogin.class);
            ArrayList<User> usersList = new ArrayList<>();
            for (ArrayList<User> user: multipleUsers.values())
                usersList.addAll(user);

            intent.putExtra(MULTIPLE_USERS, usersList);
            intent.putExtra(FROM_ACTIVITY, "LoginActivity");
            startActivity(intent);
        }
    }
}