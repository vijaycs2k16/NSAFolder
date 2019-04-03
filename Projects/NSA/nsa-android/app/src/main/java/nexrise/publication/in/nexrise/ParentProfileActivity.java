package nexrise.publication.in.nexrise;

import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.provider.OpenableColumns;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;

import org.apache.http.message.BasicHeader;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import nexrise.publication.in.nexrise.BeanClass.ParentProfile;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;

import nexrise.publication.in.nexrise.URLConnection.FileUploadUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.RoundedImageView;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class ParentProfileActivity extends AppCompatActivity implements Constants,View.OnClickListener {
    private static final int SELECT_PICTURE = 100;
    SharedPreferences preferences;
    String profileUrl;
    TextView phoneNumber;
    TextView className;
    TextView sectionName;
    RoundedImageView profilepic;
    TextView dateOfBirth;
    StringUtils stringUtils = new StringUtils();
    LinearLayout passwordLayout;
    TextView name;
    String uuid;
    BasicHeader[] headers = null;
    File finalFile;
    String username;
    Toast toast;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_parent_profile);

        preferences = PreferenceManager.getDefaultSharedPreferences(ParentProfileActivity.this);
        String schoolId = preferences.getString(SCHOOL_ID,null);
        username = preferences.getString(CURRENT_USERNAME,null);
        profilepic = (RoundedImageView) findViewById(R.id.civProfilePic);
        phoneNumber = (TextView) findViewById(R.id.phone_number);
        className = (TextView) findViewById(R.id.class_name);
        sectionName = (TextView) findViewById(R.id.section_name);
        name = (TextView) findViewById(R.id.profil_name);
        dateOfBirth = (TextView) findViewById(R.id.dob_name);
        passwordLayout = (LinearLayout)findViewById(R.id.changepassword);
        Intent intent = getIntent();
        final ParentProfile parentProfile = (ParentProfile) intent.getSerializableExtra("ParentProfile") ;

        className.setText(" : "+preferences.getString(CLASS_NAME," - "));
        sectionName.setText(" : "+preferences.getString(SECTION_NAME," - "));
        try {
            name.setText(nullCheck(parentProfile.getFirst_name()));
            phoneNumber.setText(" : " + nullCheck(parentProfile.getPrimary_phone()));

            if (parentProfile.getDob() != null && !parentProfile.getDob().equals(" - ")) {
                dateOfBirth.setText(" : " + stringUtils.examDate(parentProfile.getDob()));
                //dateOfBirth.setText(" : " + stringUtils.dobFormat(stringUtils.dateSeperate(parentProfile.getDob())));
                
            }
            if (parentProfile.getProfile_picture() != null && !parentProfile.getProfile_picture().equals("null")) {
                String image = AWS_BASE_URL + schoolId + "/" + parentProfile.getProfile_picture();
                Glide.with(ParentProfileActivity.this)
                        .load(image)
                        .asBitmap()
                        .into(profilepic);
            } else {
                Glide.with(ParentProfileActivity.this)
                        .load(R.drawable.user)
                        .asBitmap()
                        .into(profilepic);
            }
        } catch (NullPointerException e) {
            Glide.with(ParentProfileActivity.this)
                    .load(R.drawable.user)
                    .asBitmap()
                    .into(profilepic);
        }

        ActionBar actionBar = getSupportActionBar();
        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle(R.string.profile_info);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        profilepic.setOnClickListener(ParentProfileActivity.this);
        passwordLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ParentProfileActivity.this, PasswordChangeActivity.class);
                startActivity(intent);
            }
        });
    }
    @Override
    public void onClick(View v) {
        openImageChooser();
    }

    void openImageChooser() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), SELECT_PICTURE);
    }

    private String nullCheck(String input) {
        String value = " ";
        if(input != null)
            value = input;
        return value;
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == RESULT_OK) {
            if (requestCode == SELECT_PICTURE) {
                // Get the url from data
                Uri selectedImageUri = data.getData();
                try {
                    finalFile = new File(new StringUtils().getPath(selectedImageUri,ParentProfileActivity.this));
                } catch (NullPointerException | URISyntaxException e) {
                    e.printStackTrace();
                }

                if (null != selectedImageUri) {
                    // Get the path from the Uri

                    // Set the image in ImageView
                    Glide.with(this)
                            .load(selectedImageUri)
                            .asBitmap()
                            .into(profilepic);
                    uploadFile();
                }
            }
        }

    }
    public String getRealPathForDocs(Uri selectedDoc) {
        Cursor cursor = ParentProfileActivity.this.getContentResolver().query(selectedDoc, null, null, null, null);

        if(cursor != null ) {
            cursor.moveToFirst();
            int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
            String path = cursor.getString(index);
            cursor.close();
            return path;
        } else {
            return selectedDoc.toString();
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                setResult(RESULT_CANCELED);
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onResume() {
        super.onResume();
    }
    public void uploadFile(){
        String url = BASE_URL + API_VERSION_ONE + UPLOAD + "/";
        String upload = preferences.getString(CURRENT_USERNAME,null);
        Map<String,String> jsonBody = new HashMap<>();
        List<Map.Entry<String,String>> json = new ArrayList<>(jsonBody.entrySet());
        headers = StringUtils.getInstance().fileUploadHeader(ParentProfileActivity.this, "33b667c3-768c-4bc7-9b10-7bfb34e112e0", upload);
        FileUploadUrlConnection fileUpload = new FileUploadUrlConnection(this, url, headers, finalFile, json) {

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Upload ", "response " + response);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject jsonObject = new JSONObject(response);
                    boolean success = jsonObject.getBoolean(SUCCESS);
                    if (success) {
                        getUploadedFiles(jsonObject);

                    } else {
                        String status = "Upload failed";
                        throw new JSONException("Upload failed");
                    }
                } catch (NullPointerException | JSONException e) {
                    String status = "Upload failed";
                } catch (SessionExpiredException e) {
                    e.handleException(ParentProfileActivity.this);
                }
            }
        };
        fileUpload.execute();

    }
    public void getUploadedFiles(JSONObject jsonObject) throws JSONException, NullPointerException {
        if(jsonObject.has("files")) {
            JSONArray files = jsonObject.getJSONArray("files");
            JSONObject profile = new JSONObject();
            JSONObject mainObject = new JSONObject();
            JSONArray profileArray = new JSONArray();
            for(int i=0; i<files.length(); i++) {
                JSONObject fileObj = files.getJSONObject(i);
                String fileUrl = fileObj.getString("key");
                String fileName = fileObj.getString("fieldname");
                profile.put("id", fileUrl);
                profile.put("name",fileName);
                profileArray.put(profile);
                mainObject.put("profile",profileArray);
            }
            mainObject.put("id",username);
            mainObject.put("attachments",null);
            profileupdate(mainObject);
        }
    }
    public void profileupdate(JSONObject jsonObject){
        String updateUrl = BASE_URL +API_VERSION_ONE + USER + "attachments" + "/" + username;
        UPDATEUrlConnection updateUrlConnection = new UPDATEUrlConnection(ParentProfileActivity.this,updateUrl,null,jsonObject){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                if (response != null) {
                    try {
                        stringUtils.checkSession(response);
                        JSONObject success = new JSONObject(response);
                        boolean status = success.getBoolean(SUCCESS);
                        JSONObject dataObject = success.getJSONObject(DATA);
                        String message = dataObject.getString("message");
                        Log.v("message", "" + message);
                        if (status) {
                            if(toast != null)
                                toast.cancel();
                            toast = Toast.makeText(ParentProfileActivity.this, message, Toast.LENGTH_SHORT);
                            toast.setGravity(Gravity.CENTER, 0, 380);
                            toast.show();
                            setResult(RESULT_OK);
                            finish();

                        } else {
                            if (toast!= null)
                                toast.cancel();
                            toast = Toast.makeText(ParentProfileActivity.this, message, Toast.LENGTH_SHORT);
                            toast.setGravity(Gravity.CENTER,0,380);
                            toast.show();

                        }
                    } catch (JSONException |NullPointerException e) {
                        e.printStackTrace();
                    }catch (SessionExpiredException e){
                        e.handleException(ParentProfileActivity.this);
                    }

                } else {
                    if (toast!= null)
                        toast.cancel();
                    toast = Toast.makeText(ParentProfileActivity.this, R.string.photo_not_updated, Toast.LENGTH_SHORT);
                    toast.show();
                }
            }
        };
        updateUrlConnection.execute();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        setResult(RESULT_CANCELED);
        finish();
    }
}
