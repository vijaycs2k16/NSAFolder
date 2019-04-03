package nexrise.publication.in.nexrise.MMS;

import android.Manifest;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.support.annotation.NonNull;
import android.support.v7.app.ActionBar;
import android.support.v7.widget.CardView;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.message.BasicHeader;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import nexrise.publication.in.nexrise.BeanClass.MMS;
import nexrise.publication.in.nexrise.BeanClass.Student;
import nexrise.publication.in.nexrise.Common.BaseActivity;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.EventsFeature.AttendeesActivity;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Taxanomy.TaxonomyActivity;
import nexrise.publication.in.nexrise.URLConnection.FileUploadUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class CreateMMSActivity extends BaseActivity implements Constants{
    String createdDate = "";
    MMS mms;
    boolean updatable = false;
    JSONObject taxanomyObject ;
    JSONObject elasticObject;
    JSONArray attendeesArray = new JSONArray();

    ArrayList<Student> selectedStudents = new ArrayList<Student>();
    final int ATTENDEES = 16;
    final int TAXANOMY = 100;
    final int AUDIO_GALLERY = 12;
    StringUtils stringUtils;
    String selected = "Not Selected";
    Boolean first = false;
    private String status;
    private String uploadId;

    SharedPreferences preferences;
    SharedPreferences.Editor editor;

    boolean audio_gallery = true;

    TextView selectionIndication;
    TextView attendees;
    TextView audioAttachment;
    EditText title ;
    LinearLayout channelLayout;
    RadioButton inApp;
    RadioButton voiceCall;

    String download_link = "";
    String file_name = "";
    String audioUuid = "";
    CardView cardView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_mms);
        uploadId = UUID.randomUUID().toString();
        init();

        ActionBar actionBar = getSupportActionBar();
        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            if(updatable) {
                actionBar.setTitle("Modify MMS");
                first = true;
            } else {
                actionBar.setTitle("Create MMS");
            }
        }
    }

    private void init() {
        selectionIndication = (TextView)findViewById(R.id.selection_indication);
        title = (EditText) findViewById(R.id.create_title);
        channelLayout = (LinearLayout) findViewById(R.id.channel);
        audioAttachment = (TextView)findViewById(R.id.audio);
        preferences = PreferenceManager.getDefaultSharedPreferences(CreateMMSActivity.this);
        editor = preferences.edit();
        stringUtils = new StringUtils();
        cardView = (CardView)findViewById(R.id.audio_player);
        attendees = (TextView)findViewById(R.id.student_values);
        inApp = (RadioButton)findViewById(R.id.in_app);
        voiceCall = (RadioButton)findViewById(R.id.voice_call);

        TextView classSection = (TextView)findViewById(R.id.message_to);
        setMandatoryField(classSection, "Class & Section");

        TextView audioAttachment = (TextView)findViewById(R.id.audio_attachment);
        setMandatoryField(audioAttachment, "Select Audio");

        TextView voiceChannel = (TextView)findViewById(R.id.notification);
        setMandatoryField(voiceChannel, "Notification");

        Intent intent = getIntent();
        Bundle bundle = intent.getBundleExtra(BUNDLE);
        mms = (MMS) bundle.getSerializable(MMS_OBJECT);

        if(mms != null) {
            createdDate = mms.getUpdatedDate();
            uploadId = mms.getId();
            if (mms.getNotifiedCategories()!=null) {
                selected = "Verify selected";
                selectionIndication.setText(selected);
                stringUtils.setTextColorRed(CreateMMSActivity.this, selectionIndication, selected);
            }
            title.setText(mms.getTitle());

            if (mms.getStudents().size() !=0) {
                attendees.setText("Verify selected");
                attendees.setTextColor(Color.RED);
            }

            download_link = mms.getDownloadLink();
            String streamLink = AWS_BASE_URL + mms.getSchoolId() + "/" + mms.getDownloadLink();
            file_name = mms.getFileName();
            audio_gallery = false;
            audioPlayerHandler(streamLink, file_name);
            updatable = true;
        } else {
            cardView.setVisibility(View.GONE);
            updatable = false;
        }

        Button draft = (Button) findViewById(R.id.draftbutton);
        draftHandler(draft);
        initalizeView();
        individualStudent();
        audioAttachment();
    }

    private void setMandatoryField(TextView textView, String message) {
        String colored = " *";
        SpannableStringBuilder builder = new SpannableStringBuilder();
        builder.append(message);

        int start = builder.length();
        builder.append(colored);
        int end = builder.length();
        builder.setSpan(new ForegroundColorSpan(Color.RED), start, end,
                Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        textView.setText(builder);
    }

    private void audioPlayerHandler(final String url, final String fileName) {
        cardView.setVisibility(View.VISIBLE);
        ImageView closeButton = (ImageView)findViewById(R.id.close);
        closeButton.setVisibility(View.VISIBLE);

        closeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AlertDialog alertDialog = new AlertDialog.Builder(CreateMMSActivity.this)
                        .setTitle("Discard audio").setMessage("Do you want to discard this audio").setPositiveButton("YES", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                uploadId = UUID.randomUUID().toString();
                                discardAudio();
                            }
                        }).setNegativeButton("NO", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {

                            }
                        }).create();
                alertDialog.show();
            }
        });

        TextView title = (TextView)findViewById(R.id.title);
        title.setText(fileName);
        TextView duration = (TextView)findViewById(R.id.date);
        duration.setText("");
        TextView publishedBy = (TextView)findViewById(R.id.published_by);

        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String username = preferences.getString(FIRST_NAME, "");
        publishedBy.setText(username);

        cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                /*MMSArrayAdapter arrayAdapter = new MMSArrayAdapter(CreateMMSActivity.this, 0, null);
                arrayAdapter.audioPlayer(url, fileName, CreateMMSActivity.this.getLayoutInflater());*/
                AudioPlayer player = new AudioPlayer();
                player.playAudio(url, fileName, CreateMMSActivity.this.getLayoutInflater(), CreateMMSActivity.this);
            }
        });
    }

    private void draftHandler(Button draft) {
        draft.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                status = "Draft";
                handleMMSCreation();
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.actionbar_with_send_button, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                editor.putString(TAXANOMY_SELECTION, null);
                editor.apply();
                selectedStudents.clear();
                Intent intent = new Intent();
                if (mms != null)
                    intent.putExtra("Attachments", mms);
                setResult(RESULT_CANCELED, intent);
                finish();
                overridePendingTransition(R.anim.left_to_right_anim, R.anim.left_to_right_exit);
                break;
            case R.id.send:
                setResult(RESULT_OK);
                status = "Sent";
                handleMMSCreation();
        }
        return super.onOptionsItemSelected(item);
    }

    private void handleMMSCreation() {
        JSONObject notificationJson = createJson();
        if (notificationJson == null)
            return ;

        final ProgressDialog progressDialog = new ProgressDialog(CreateMMSActivity.this);
        if (updatable){
            BasicHeader[] headers = stringUtils.headers(CreateMMSActivity.this, VOICE_MMS_ID);
            String draftUrl = BASE_URL + API_VERSION_ONE + VOICE + NOW + "/" + mms.getId();
            UPDATEUrlConnection urlConnection = new UPDATEUrlConnection(CreateMMSActivity.this, draftUrl, headers, notificationJson){

                @Override
                protected void onPreExecute() {
                    super.onPreExecute();
                    progressDialog.setCancelable(false);
                    progressDialog.setCanceledOnTouchOutside(false);
                    progressDialog.setMessage("Sending MMS...");
                    progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
                    progressDialog.show();
                }
                @Override
                protected void onPostExecute(String success) {
                    super.onPostExecute(success);
                    Log.v("draft","response "+success);
                    progressDialog.dismiss();
                    if(success != null) {
                        try {
                            stringUtils.checkSession(success);
                            setResult(RESULT_OK);
                            finish();
                            if(status.equals(SENT))
                                showToast("MMS sent successfully");
                            else
                                showToast("Draft updated successfully");
                        } catch (SessionExpiredException e) {
                            e.handleException(CreateMMSActivity.this);
                        }
                    } else
                    if(status.equals(SENT))
                        showToast("MMS not sent");
                    else
                        showToast("MMS draft updation failed");
                }
            };
            if (notificationJson.length() != 0)
                urlConnection.execute();

        } else {
            String authenticateUrl = BASE_URL + API_VERSION_ONE + VOICE + NOW;
            BasicHeader[] headers = stringUtils.headers(CreateMMSActivity.this, VOICE_MMS_ID);
            POSTUrlConnection urlConnection = new POSTUrlConnection(notificationJson, authenticateUrl, headers, CreateMMSActivity.this) {

                @Override
                protected void onPreExecute() {
                    super.onPreExecute();
                    progressDialog.setCancelable(false);
                    progressDialog.setCanceledOnTouchOutside(false);
                    progressDialog.setMessage("Creating MMS...");
                    progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
                    progressDialog.show();
                }

                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    progressDialog.dismiss();
                    Log.v("success","success "+response);

                    try {
                        if (response != null ) {
                            JSONObject responseObj = new JSONObject(response);
                            boolean success = responseObj.getBoolean(SUCCESS);
                            stringUtils.checkSession(response);
                            if(success) {
                                showToast("MMS Created Successfully");
                                editor.putString(TAXANOMY_SELECTION, null);
                                editor.apply();
                                setResult(RESULT_OK);
                                finish();
                                overridePendingTransition(R.anim.left_to_right_anim, R.anim.left_to_right_exit);
                            } else
                                showToast("MMS Not Created");
                        } else
                            showToast("MMS Not Created");
                    } catch (SessionExpiredException e) {
                        e.handleException(CreateMMSActivity.this);
                    } catch (JSONException | NullPointerException e) {
                        showToast("MMS Not Created");
                        e.printStackTrace();
                    }

                }
            };
            if (notificationJson.length() != 0)
                urlConnection.execute();
        }
    }

    private void initalizeView() {
        LinearLayout tree = (LinearLayout) findViewById(R.id.taxonomy);
        tree.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent taxanomy = new Intent(CreateMMSActivity.this,TaxonomyActivity.class);
                if (updatable && mms.getNotifiedCategories()!=null && taxanomyObject == null)
                    taxanomy.putExtra("notifiedCategories",mms.getNotifiedCategories());
                taxanomy.putExtra(FROM,"NotificationActivity");
                startActivityForResult(taxanomy, 100);
            }
        });
    }

    private void individualStudent() {
        LinearLayout attendees = (LinearLayout)findViewById(R.id.individual_student);
        attendees.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent attendees = new Intent(CreateMMSActivity.this, AttendeesActivity.class);
                if (updatable && mms.getStudents() != null) {
                    attendees.putExtra("Selected students", mms.getStudents());
                    Log.v("getstudent", " " + mms.getStudents());
                } else
                    attendees.putExtra("Selected students", selectedStudents);
                startActivityForResult(attendees, ATTENDEES);
            }
        });
    }

    private void audioAttachment() {
        LinearLayout attachment = (LinearLayout)findViewById(R.id.attachment_layout);
        attachment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED)
                        audioGallery();
                    else {
                        String[] perm = {Manifest.permission.READ_EXTERNAL_STORAGE};
                        requestPermissions(perm, 10);
                    }
                } else {
                    audioGallery();
                }
            }
        });
    }

    private void audioGallery() {
        Intent audioGallery = new Intent(CreateMMSActivity.this, AudioGalleryActivity.class);
        startActivityForResult(audioGallery, AUDIO_GALLERY);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(grantResults.length > 0) {
            if(grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                audioGallery();
            } else
                Toast.makeText(this, "Please allow permission to enable this functionality", Toast.LENGTH_LONG).show();
        } else
            Toast.makeText(this, "Please allow permission to enable this functionality", Toast.LENGTH_LONG).show();

    }

    public JSONObject createJson() {
        JSONObject entireObject = new JSONObject();
        JSONObject notifyTo = new JSONObject();
        JSONObject notify = new JSONObject();
        final String messageTitle = title.getText().toString();

        try {
            if(!messageTitle.isEmpty() && ((taxanomyObject != null && taxanomyObject.has("selectedNodes") && taxanomyObject.getJSONArray("selectedNodes").length() != 0) || attendeesArray.length() !=0 ) && !download_link.isEmpty() && !file_name.isEmpty() && (inApp.isChecked() || voiceCall.isChecked())) {
                boolean smsValue = false;
                boolean pushValue = true;
                boolean emailValue = false;

                entireObject.put("name", messageTitle);
                notify.put("sms", smsValue);
                notify.put("push",true);
                notify.put("email",emailValue);
                notifyTo.put("status", status);
                entireObject.put("notifiedCategories", "");
                entireObject.put("createdDate", "");

                entireObject.put("notify", notify);
                entireObject.put("students", attendeesArray);
                entireObject.put("download_link", download_link);
                entireObject.put("file_name", file_name);

                if(inApp.isChecked())
                    entireObject.put("is_app_notification", true);
                else
                    entireObject.put("is_app_notification", false);

                entireObject.put("save_gallery", audio_gallery);

             //   entireObject.put("id", uploadId);
                entireObject.put("audio_id", audioUuid);
                entireObject.put("notificationId", "");

                if (elasticObject != null)
                    entireObject.put("classes", elasticObject.getJSONArray("classes"));
                else
                    entireObject.put("classes", new JSONArray());

                if (taxanomyObject != null) {
                    notifyTo.put("userType", taxanomyObject.getJSONObject("notifyTo").getJSONArray("userType"));
                    entireObject.putOpt("taxanomy", taxanomyObject.getJSONArray("taxanomy"));
                    entireObject.putOpt("selectedNodes", taxanomyObject.getJSONArray("selectedNodes"));
                }
                else
                    notifyTo.put("userType", new JSONArray());
                entireObject.put("notifyTo", notifyTo);
            } else {
                showToast("Please select the recipients using Class & Section, Mobile Number or Students options to send the mms");
                return null;
                //throw new JSONException("Mandatory fields are missing");
            }
        } catch (JSONException | NullPointerException e) {
            showToast("Please select the recipients using Class & Section, Mobile Number or Students options to send the mms");
            e.printStackTrace();
            return null;
        }
        Log.v("created","Json"+entireObject.toString());
        return entireObject;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode){
            case TAXANOMY:
                if (resultCode == RESULT_OK){
                    String taxanomyJson = data.getStringExtra("Taxanomy json");
                    String esQuery = data.getStringExtra("ES query");
                    stringUtils.setTextColorRed(this, selectionIndication, "selected");
                    try {
                        taxanomyObject = new JSONObject(taxanomyJson);
                        elasticObject = new JSONObject(esQuery);
                        JSONArray selectedNodes = taxanomyObject.getJSONArray("selectedNodes");

                        if(selectedNodes.length() != 0)
                            selectionIndication.setText(""+selectedNodes.length()+" selected");
                        else {
                            selectionIndication.setText("Not Selected");
                            selected = "Not Selected";
                        }
                        Log.v("elasticObject values"," "+elasticObject);
                    } catch (JSONException | NullPointerException e) {
                        e.printStackTrace();
                    }
                } else {
                    selectionIndication.setText("Not Selected");
                    taxanomyObject = null;
                    elasticObject = null;
                }
                break;

            case ATTENDEES:
                attendees = (TextView) findViewById(R.id.student_values);
                attendees.setTextColor(getResources().getColor(R.color.colorBlack));
                if (resultCode == RESULT_OK) {
                    selectedStudents = (ArrayList<Student>) data.getSerializableExtra("SelectedList");
                    try {
                        attendeesArray = new JSONArray(data.getStringExtra("AttendeesArray"));
                        Log.v("attendeesArray values","stu "+attendeesArray);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    if (selectedStudents.size() != 0)
                        attendees.setText("" + selectedStudents.size() + " selected");
                    else
                        attendees.setText("Not selected");
                } else {
                    attendees.setText("Not selected");
                }
                break;

            case AUDIO_GALLERY:
                if(resultCode == RESULT_OK && data != null) {
                    String audioFilePath = data.getStringExtra("AudioFilePath");
                    String audioFileName = data.getStringExtra("AudioFileName");
                    audioUuid = data.getStringExtra("AudioId");

                    // here audioFilePath and downloadLink is same
                    download_link = audioFilePath;
                    file_name = audioFileName;
                    audio_gallery = false; // This indicates whether to save the audio in the server or not. Here user selects previously uploaded audio so, no need to save it again

                    SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
                    String schoolId = preferences.getString(SCHOOL_ID,"");
                    String encodedAudioPath = Uri.encode(audioFilePath);
                    String completeUrl = AWS_BASE_URL + schoolId + "/" + encodedAudioPath;

                    audioPlayerHandler(completeUrl, audioFileName);
                }
                break;
        }
    }

    private void uploadAudio(String audioFilePath) {
        final ProgressDialog progressDialog = new ProgressDialog(this);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        progressDialog.setMessage("Uploading audio");
        progressDialog.setCancelable(false);
        progressDialog.setCanceledOnTouchOutside(false);

        String url = BASE_URL + API_VERSION_ONE + UPLOAD + "/";
        HashMap<String, String> uploadBody = new HashMap<String, String>();
        uploadBody.put("uploadId", uploadId);
        File file = new File(audioFilePath);
        ArrayList<Map.Entry<String, String>> jsonBody = new ArrayList<>(uploadBody.entrySet());

        BasicHeader[] headers = StringUtils.getInstance().fileUploadHeader(CreateMMSActivity.this, VOICE_MMS_ID, uploadId);
        final FileUploadUrlConnection fileUpload = new FileUploadUrlConnection(this, url, headers, file, jsonBody) {
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    boolean success = jsonObject.getBoolean(SUCCESS);
                    if(success) {
                        JSONArray files = jsonObject.getJSONArray("files");
                        String fileUrl = "";
                        String fileName = "";
                        for (int i = 0; i < files.length(); i++) {
                            JSONObject attachment = new JSONObject();
                            JSONObject fileObj = files.getJSONObject(i);
                            download_link = fileObj.getString("key");
                            file_name = fileObj.getString("fieldname");
                            audio_gallery = true;
                        }
                        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(CreateMMSActivity.this);
                        String schoolId = preferences.getString(SCHOOL_ID, "");
                        String streamingLink = AWS_BASE_URL + schoolId + "/" + download_link;
                        audioPlayerHandler(streamingLink,file_name);
                        if (progressDialog.isShowing()) progressDialog.dismiss();
                        Toast.makeText(CreateMMSActivity.this, "File uploaded successfully", Toast.LENGTH_SHORT).show();
                    } else {
                        discardAudio();
                        if (progressDialog.isShowing()) progressDialog.dismiss();
                        Toast.makeText(CreateMMSActivity.this, "File uploading failed", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    if (progressDialog.isShowing()) progressDialog.dismiss();
                    discardAudio();
                    Toast.makeText(CreateMMSActivity.this, "File uploading failed", Toast.LENGTH_SHORT).show();
                    e.printStackTrace();
                }
            }
        }; fileUpload.execute();

        progressDialog.setButton(DialogInterface.BUTTON_NEGATIVE, "Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                if(fileUpload != null) {
                    fileUpload.cancel(true);
                    discardAudio();
                }
            }
        });

        if(!audioFilePath.isEmpty()) {
            if(isConnected())
                progressDialog.show();
            else
                Toast.makeText(this, "Please check you internet connection", Toast.LENGTH_SHORT).show();
        }
    }

    private void discardAudio() {
        cardView.setVisibility(View.GONE);
        audioAttachment.setText("0 attachment");
        download_link = "";
        file_name = "";
    }

    private String getFileName(Uri fileUri) {
        String uriString = fileUri.toString();
        File file = new File(uriString);
        String fileName = "";
        if(uriString.startsWith("content://")) {
            Cursor cursor = null;
            try {
                cursor = this.getContentResolver().query(fileUri, null, null, null, null);
                if(cursor != null && cursor.moveToFirst()) {
                    fileName = cursor.getString(cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME));
                }
            } finally {
                if(cursor != null) cursor.close();
            }
        } else if(uriString.startsWith("file://"))
            fileName = file.getName();

        return fileName;
    }

    private String getAudioFilePath(Uri uri) {
        String uriString = uri.toString();
        File file = new File(uriString);
        String fileUrl = "";

        Cursor cursor = null;
        try {
            cursor = this.getContentResolver().query(uri, null, null, null, null);
            if(cursor != null && cursor.moveToFirst()) {
                fileUrl = cursor.getString(cursor.getColumnIndex(MediaStore.Audio.Media.DATA));
            }
        } finally {
            if(cursor != null) cursor.close();
        }

        return fileUrl;
    }
}
