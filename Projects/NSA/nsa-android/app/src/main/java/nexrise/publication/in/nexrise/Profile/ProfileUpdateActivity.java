package nexrise.publication.in.nexrise.Profile;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.ParentProfileJsonParser;
import nexrise.publication.in.nexrise.JsonParser.ProfileJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ProfileUpdateActivity extends AppCompatActivity implements Constants {

  //  LoginObject loginObject;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile_update);

        EditText mobileNo = (EditText) findViewById(R.id.profile_mobile);
        EditText email = (EditText) findViewById(R.id.profile_email);
        EditText address = (EditText) findViewById(R.id.profile_address);
        EditText name = (EditText) findViewById(R.id.profile_name);
        StringUtils stringUtils = new StringUtils();

        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String jsonString = preferences.getString("profileList", null);
        String user = stringUtils.getUserRole(ProfileUpdateActivity.this);

        if(user.equalsIgnoreCase(EMPLOYEE)) {

            ProfileJsonParser profileJsonParser = new ProfileJsonParser();
           // List<ProfileObject> profileData = profileJsonParser.getProfileList(jsonString);
            //ProfileObject profileObject = profileData.get(0);

            //mobileNo.setText(profileObject.getMobileNo());
            //email.setText(profileObject.getEmail());
            //address.setText(profileObject.getPersonalAddres());
            //name.setText(profileObject.getName());

        } else if(user.equalsIgnoreCase(PARENT)){
            ParentProfileJsonParser jsonParser = new ParentProfileJsonParser();
           // List<ParentProfile> parentProfiles = jsonParser.parse(jsonString, "Parent");
            //ParentProfile parentProfile = parentProfiles.get(0);

            /*mobileNo.setText(parentProfile.getContact());
            email.setText(parentProfile.getEmail());
            address.setText(parentProfile.getAddress());
            name.setText(parentProfile.getName());*/
        }else if(user.equalsIgnoreCase(STUDENT)){
            ParentProfileJsonParser jsonParser = new ParentProfileJsonParser();
           // List<ParentProfile> parentProfiles = jsonParser.parse(jsonString, "Student");
            //ParentProfile parentProfile = parentProfiles.get(0);

            /*mobileNo.setText(parentProfile.getContact());
            email.setText(parentProfile.getEmail());
            address.setText(parentProfile.getAddress());
            name.setText(parentProfile.getName());*/
        }
        ActionBar actionBar = getSupportActionBar();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle("Edit Info");
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.add_homework_actionbar, menu);
        MenuItem menuItem1 = menu.findItem(R.id.tick);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                break;
            case R.id.tick:

                EditText mobileNo = (EditText) findViewById(R.id.profile_mobile);
                EditText email = (EditText) findViewById(R.id.profile_email);
                EditText address = (EditText) findViewById(R.id.profile_address);
                EditText name = (EditText) findViewById(R.id.profile_name);
                String sMobile = mobileNo.getText().toString();
                String sEmail = email.getText().toString();
                String sAddress = address.getText().toString();
                String sName = name.getText().toString();

                SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
                String jsonString = preferences.getString("profileList", null);

                //update profile data
                /*if(loginObject.getUserName().equals("Teacher")){
                    update(jsonString, preferences, sMobile, sEmail, sAddress, sName);
                }else{
                    update(sMobile, sEmail, sAddress, sName);
                }
*/
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void update(String jsonString, SharedPreferences preferences, String sMobile, String sEmail, String sAddress, String sName) {

        JSONObject jsonObject = null;
        try {
            jsonObject = new JSONObject(jsonString);
            JSONArray jsonArray = jsonObject.getJSONArray("profileList");

            for(int i =0; i < jsonArray.length() ; i++ ) {
                JSONObject jsonObject1 = jsonArray.getJSONObject(i);
                    jsonObject1.put("name", sName);
                    jsonObject1.put("Address", sAddress);
                    jsonObject1.put("Email", sEmail);
                    jsonObject1.put("mobileNo", sMobile);
                    jsonArray.put(i, jsonObject1);
                    jsonObject.putOpt("profileList", jsonArray);
                    SharedPreferences.Editor  editor = preferences.edit();
                    editor.putString("profileList", jsonObject.toString());
                    editor.apply();
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

    public void update(String sMobile, String sEmail, String sAddress, String sName){
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String jsonString = preferences.getString("profileList", null);

        try {
            JSONObject jsonObject = new JSONObject(jsonString);
            jsonObject.put("Name", sName);
            jsonObject.put("Address", sAddress);
            jsonObject.put("Email", sEmail);
            jsonObject.put("Contact", sMobile);
            SharedPreferences.Editor  editor = preferences.edit();
            editor.putString("profileList", jsonObject.toString());
            editor.apply();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

}
