package nexrise.publication.in.nexrise.Profile;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bumptech.glide.Glide;

import java.net.URISyntaxException;

import nexrise.publication.in.nexrise.BeanClass.ProfileObject;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.ProfileJsonParser;
import nexrise.publication.in.nexrise.PasswordChangeActivity;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.RoundedImageView;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ProfileActivity extends AppCompatActivity implements Constants,View.OnClickListener {

    String userRole;
    SharedPreferences preferences;
    String profileUrl;
    ProfileObject profileData;
    TextView phoneNumber;
    TextView email;
    TextView shortName;
    TextView employeeUserName;
    TextView designation;
    TextView subjects;
    TextView classAssigned;
    TextView name;

    LinearLayout passwordLayout;
    RoundedImageView profilepic;
    private static final int SELECT_PICTURE = 100;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);
        preferences = PreferenceManager.getDefaultSharedPreferences(ProfileActivity.this);
        StringUtils stringUtils = new StringUtils();
        userRole = stringUtils.getUserRole(this);
        passwordLayout = (LinearLayout)findViewById(R.id.changepassword);
        profilepic = (RoundedImageView) findViewById(R.id.civProfilePic);
        phoneNumber = (TextView) findViewById(R.id.phone_number);
        email = (TextView) findViewById(R.id.email_name);
        shortName = (TextView) findViewById(R.id.short_name);
        employeeUserName = (TextView) findViewById(R.id.emp_username);
        designation = (TextView) findViewById(R.id.designation_name);
        subjects = (TextView) findViewById(R.id.subjects);
        classAssigned = (TextView)findViewById(R.id.classes);
        name = (TextView) findViewById(R.id.profil_name);

        Log.v("USer","Role"+userRole);
        final String username = preferences.getString(CURRENT_USERNAME,null);
        Log.v("UserNAme"," "+username);
            profileUrl = BASE_URL + API_VERSION_ONE + ES +USER+username;
            Log.v("Profile","Url "+profileUrl);
            GETUrlConnection profileCredential = new GETUrlConnection(this,profileUrl,null){
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    Log.v("Profile "," Response"+response);
                    ProfileJsonParser profileJsonParser = new ProfileJsonParser();
                    profileData = profileJsonParser.getProfileList(response);
                    name.setText(profileData.getFirst_name());
                    phoneNumber.setText(profileData.getPrimary_phone());
                    shortName.setText(profileData.getShort_name());
                    employeeUserName.setText(profileData.getUser_name());
                    subjects.setText(profileData.getSubjects());
                    email.setText(profileData.getEmail());
                    designation.setText(profileData.getDesignation());
                }
            };
            profileCredential.execute();
            String profilePicUrl = BASE_URL + API_VERSION_ONE + EMPLOYEE_URL + username;
            GETUrlConnection profilepicCredential = new GETUrlConnection(this,profilePicUrl,null){
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    Log.v("Profie",""+response);
                }
            };
            profilepicCredential.execute();

        passwordLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ProfileActivity.this, PasswordChangeActivity.class);
                startActivity(intent);
            }
        });

         // profilepic.setImageResource(R.drawable.pic2);

        ActionBar actionBar = getSupportActionBar();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle(R.string.profile_info);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
    }

    void openImageChooser() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), SELECT_PICTURE);
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == RESULT_OK) {
            if (requestCode == SELECT_PICTURE) {
                // Get the url from data
                Uri selectedImageUri = data.getData();
                if (null != selectedImageUri) {
                    // Get the path from the Uri
                    try {
                        String path =new StringUtils().getPath(selectedImageUri,ProfileActivity.this);
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                    }
                    // Set the image in ImageView
                    Glide.with(this)
                            .load(selectedImageUri)
                            .asBitmap()
                            .into(profilepic);
                }
            }
        }
    }


    @Override
    public void onClick(View v) {
        openImageChooser();
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:

                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }
}
