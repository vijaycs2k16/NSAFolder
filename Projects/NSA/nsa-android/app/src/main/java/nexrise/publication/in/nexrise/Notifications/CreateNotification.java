package nexrise.publication.in.nexrise.Notifications;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.message.BasicHeader;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import nexrise.publication.in.nexrise.BeanClass.Notify;
import nexrise.publication.in.nexrise.BeanClass.Student;
import nexrise.publication.in.nexrise.BeanClass.Template;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.EventsFeature.AttendeesActivity;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.AttachmentActivity;
import nexrise.publication.in.nexrise.Taxanomy.TaxonomyActivity;
import nexrise.publication.in.nexrise.TimetableFeature.CategoriesSpinnerAdapter;
import nexrise.publication.in.nexrise.TimetableFeature.ViewNotesActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class CreateNotification extends AppCompatActivity implements Constants {
    String createdDate = "";
    Notify notification;
    boolean updatable = false;
    EditText title, description,number ;
    CheckBox sms;
    CheckBox push;
    Template template;
    JSONObject taxanomyObject;
    JSONObject elasticObject;
    private String status;
    private String uploadId;
    HashMap<String, String> uploadedImages = new HashMap<>();

    String draftUrl;
    EditText editText;
    SharedPreferences preferences;
    SharedPreferences.Editor editor;
    String selected = "Not Selected";
    TextView selectionIndication;
    int position = 0;
    Toast toast;
    StringUtils stringUtils;
    Boolean first = false;
    Spinner categories;
    LinearLayout channelLayout;
    boolean spinnerSelect = false;

    ArrayList<Student> selectedStudents = new ArrayList<Student>();
    final int ATTENDEES = 16;
    final int TAXANOMY = 100;
    final int ATTACHMENT = 11;
    JSONArray attendeesArray = new JSONArray();
    JSONArray attachmentsAry = new JSONArray();
    TextView attendees;
    TextView attachmentTextView;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_notification);
        uploadId = UUID.randomUUID().toString();
        init();

        ActionBar actionBar = getSupportActionBar();
        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setElevation(0);
            if(updatable) {
                actionBar.setTitle(R.string.modify_notification);
                first = true;
            } else {
                actionBar.setTitle(R.string.create_notifications);
            }
        }

        /*if (savedInstanceState != null) {
            Log.v("instance ","state "+savedInstanceState.getString("Value"));
            selected = savedInstanceState.getString("Value");
            selectionIndication.setText(selected);
            position = savedInstanceState.getInt("Position");
        } else {
            selected = "Not Selected";
            selectionIndication.setText(selected);
        }*/

        final String featurecredential = BASE_URL + API_VERSION_ONE + FEATURE;
        //CREATE_NOTIFICATION
        BasicHeader[] header = stringUtils.headers(CreateNotification.this,Constants.CREATE_NOTIFICATION);
        GETUrlConnection urlConnection = new GETUrlConnection(CreateNotification.this, featurecredential,header) {
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("feature ","featureresponse "+response);
                JSONObject jsonObject = null;
                try {
                    stringUtils.checkSession(response);
                    jsonObject = new JSONObject(response);
                    JSONObject data = jsonObject.getJSONObject(DATA);
                    Boolean smsStatus = data.getBoolean("sms");
                    Boolean emailStatus =data.getBoolean("email");
                    Boolean pushStatus = data.getBoolean("push");
                    String colored = " *";

                    TextView textChannel = (TextView)findViewById(R.id.textView4);
                    String channel = "Notification";

                    SpannableStringBuilder builder2 = new SpannableStringBuilder();
                    builder2.append(channel);
                    int start2 = builder2.length();
                    builder2.append(colored);
                    int end2 = builder2.length();
                    builder2.setSpan(new ForegroundColorSpan(Color.RED), start2, end2,
                            Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
                    textChannel.setText(builder2);

                    channelLayout.setVisibility(View.VISIBLE);
                    if (smsStatus)
                        sms.setVisibility(View.VISIBLE);
                    if (pushStatus)
                        push.setVisibility(View.VISIBLE);

                } catch (NullPointerException | JSONException  e) {
                    e.printStackTrace();
                    showToast((String) getResources().getText(R.string.oops));
                } catch (SessionExpiredException e) {
                    e.handleException(CreateNotification.this);
                }
            }
        };
        urlConnection.execute();
    }

    private void init() {
        attendees = (TextView) findViewById(R.id.student_values);
        selectionIndication = (TextView)findViewById(R.id.selection_indication);
        title = (EditText) findViewById(R.id.create_title);
        description = (EditText)findViewById(R.id.description);
        number = (EditText)findViewById(R.id.mobilenumber);
        preferences = PreferenceManager.getDefaultSharedPreferences(CreateNotification.this);
        editor = preferences.edit();
        stringUtils = new StringUtils();
        channelLayout = (LinearLayout) findViewById(R.id.channel);
        sms = (CheckBox) findViewById(R.id.smscheck);
        push = (CheckBox) findViewById(R.id.pushcheck);

        TextView text = (TextView)findViewById(R.id.message);
        String simple = "Message";
        String colored = " *";
        SpannableStringBuilder builder = new SpannableStringBuilder();
        builder.append(simple);

        int start = builder.length();
        builder.append(colored);
        int end = builder.length();
        builder.setSpan(new ForegroundColorSpan(Color.RED), start, end,
                Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        text.setText(builder);

        /*TextView taxanomy = (TextView)findViewById(R.id.message_to);
        String messageTo = "Message To";
        SpannableStringBuilder builder1 = new SpannableStringBuilder();
        builder1.append(messageTo);
        int start1 = builder1.length();
        builder1.append(colored);
        int end1 = builder1.length();
        builder1.setSpan(new ForegroundColorSpan(Color.RED), start1, end1,
                Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        taxanomy.setText(builder1);*/

        Intent intent = getIntent();
        Bundle bundle = intent.getBundleExtra(BUNDLE);
        notification = (Notify) bundle.getSerializable(NOTIFICATION_OBJECT);
        if(notification != null) {
            createdDate = notification.getCreatedDate();
            uploadId = notification.getNotificationId();
            String notify = notification.getNotified_categories();
            
            if (notification.getNotified_categories() != null && !notification.getNotified_categories().isEmpty() && !notification.getNotified_categories().equalsIgnoreCase("null")) {
                selected = "Verify selected";
                selectionIndication.setText(selected);
                stringUtils.setTextColorRed(CreateNotification.this, selectionIndication, selected);
            }
            if(!notification.getPhoneNo().equalsIgnoreCase("null") && !notification.getPhoneNo().isEmpty() && notification.getPhoneNo() != null) {
                number.setText(notification.getPhoneNo().trim());
			}
            title.setText(notification.getTitle());
            description.setText(notification.getPushTemplateMessage().trim());
            if (notification.getStudents().size() != 0) {
                attendees.setText("Verify selected");
                attendees.setTextColor(Color.RED);
            }

            if(notification.getAttachments() != null && notification.getAttachments().size() != 0) {
                attachmentTextView = (TextView)findViewById(R.id.attachments);
                uploadedImages.putAll(notification.getAttachments());
                attachmentTextView.setText(uploadedImages.size()+ " attachment(s)");
            }

            updatable = true;
        } else {
            updatable = false;
        }

        Button draft = (Button) findViewById(R.id.draftbutton);
        draftButtonClick(draft);
        initializeAttachments();
        initalizeView();
        individualStudent();
        setUpSpinner();
    }

    private void draftButtonClick(final Button draft) {
        draft.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                editText = (EditText) findViewById(R.id.create_title);
                status = "Draft";
                JSONObject notificationJson = notificationChannelValidation();

                if(notificationJson == null) return;

                if (updatable) {
                    editor.putString(TAXANOMY_SELECTION, null);
                    editor.apply();
                    draftUrl = BASE_URL + API_VERSION_ONE + SMS + NOTIFICATIONS_DRAFT + notification.getNotificationId();
                    BasicHeader[] headers = stringUtils.headers(CreateNotification.this, CREATE_NOTIFICATION);
                    UPDATEUrlConnection urlConnection = new UPDATEUrlConnection(CreateNotification.this, draftUrl, headers, notificationJson) {
                        ProgressDialog dialog = new ProgressDialog(CreateNotification.this, ProgressDialog.STYLE_SPINNER);

                        @Override
                        protected void onPreExecute() {
                            super.onPreExecute();
                            dialog.setMessage(getResources().getText(R.string.updating_noitfy));
                            dialog.setCancelable(false);
                            dialog.setCanceledOnTouchOutside(false);
                            dialog.show();
                        }

                        @Override
                        protected void onPostExecute(String success) {
                            super.onPostExecute(success);
                            dialog.dismiss();
                            Log.v("draft", "csd" + success);
                            if (success != null) {
                                try {
                                    stringUtils.checkSession(success);
                                    Intent intent = new Intent();
                                    setResult(RESULT_OK, intent);
                                    finish();
                                    showToast((String) getResources().getText(R.string.notify_save_draft));
                                } catch (SessionExpiredException e) {
                                    e.handleException(CreateNotification.this);
                                }
                            }
                        }
                    };
                    urlConnection.execute();
                } else {
                    editor.putString(TAXANOMY_SELECTION, null);
                    editor.apply();
                    draftUrl = BASE_URL + API_VERSION_ONE + SMS + NOTIFICATIONS_DRAFT;
                    BasicHeader[] headers = stringUtils.headers(CreateNotification.this, CREATE_NOTIFICATION);
                    POSTUrlConnection urlConnection = new POSTUrlConnection(notificationJson, draftUrl, headers, CreateNotification.this) {
                        ProgressDialog dialog = new ProgressDialog(CreateNotification.this, ProgressDialog.STYLE_SPINNER);
                        @Override
                        protected void onPreExecute() {
                            super.onPreExecute();
                            dialog.setMessage(getResources().getText(R.string.creating_notify));
                            dialog.setCancelable(false);
                            dialog.setCanceledOnTouchOutside(false);
                            dialog.show();
                        }
                        @Override
                        protected void onPostExecute(String success) {
                            super.onPostExecute(success);
                            dialog.dismiss();
                            Log.v("draft2","response "+success);
                            if (success != null) {
                                try {
                                    stringUtils.checkSession(success);
                                    showToast((String) getResources().getText(R.string.notify_save_draft));
                                    finish();
                                } catch (SessionExpiredException e) {
                                    e.handleException(CreateNotification.this);
                                }
                            } else
                                showToast((String) getResources().getText(R.string.notify_not_save_draft));
                        }
                    };
                    urlConnection.execute();
                }
            }

        });
    }

    private void initalizeView() {
        LinearLayout tree = (LinearLayout) findViewById(R.id.taxonomy);
        tree.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent taxanomy = new Intent(CreateNotification.this,TaxonomyActivity.class);
                if (updatable && notification.getNotified_categories()!=null && taxanomyObject == null)
                    taxanomy.putExtra("notifiedCategories",notification.getNotified_categories());
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
                Intent attendees = new Intent(CreateNotification.this, AttendeesActivity.class);
                if (updatable && notification.getStudents() != null) {
                    attendees.putExtra("Selected students", notification.getStudents());
                    Log.v("getstudent", " " + notification.getStudents());
                } else
                    attendees.putExtra("Selected students", selectedStudents);
                startActivityForResult(attendees, ATTENDEES);
            }
        });
    }

    private void initializeAttachments() {
        LinearLayout attachmentsLayout = (LinearLayout)findViewById(R.id.attachment_layout);
        attachmentsLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String url = BASE_URL + API_VERSION_ONE + UPLOAD + "/";
                HashMap<String, String> uploadBody = new HashMap<String, String>();
                uploadBody.put("uploadId", uploadId);

                if(uploadedImages.size() == 0) {
                    Intent attachmentActivity = new Intent(CreateNotification.this, AttachmentActivity.class);
                    attachmentActivity.putExtra(JSON, uploadBody);
                    attachmentActivity.putExtra(URL, url);
                    attachmentActivity.putExtra(UPLOAD_ID, uploadId);
                    attachmentActivity.putExtra(ID, CREATE_NOTIFICATION);
                    startActivityForResult(attachmentActivity, ATTACHMENT);
                } else  {
                    Intent viewNotes = new Intent(CreateNotification.this, ViewNotesActivity.class);
                    viewNotes.putExtra(UPLOADED_IMAGES, uploadedImages);
                    viewNotes.putExtra(JSON, uploadBody);
                    viewNotes.putExtra(URL, url);
                    viewNotes.putExtra(UPLOAD_ID, uploadId);
                    viewNotes.putExtra(ID, CREATE_NOTIFICATION);
                    viewNotes.putExtra(ACTIONBAR_TITLE, "Attachments");
                    startActivityForResult(viewNotes, ATTACHMENT);
                }
            }
        });
    }

    private JSONObject notificationChannelValidation() {
        JSONObject notificationJson;
        if(channelLayout.getVisibility() == View.VISIBLE && (sms.isChecked() | push.isChecked()))
            notificationJson = createJson();
        else if(channelLayout.getVisibility() == View.INVISIBLE || channelLayout.getVisibility() == View.GONE)
            notificationJson = createJson();
        else if(((taxanomyObject != null) || attendeesArray.length() !=0))
            notificationJson = createJson();
        else {
            showToast((String) getResources().getText(R.string.fill_mandatory_fields));
            notificationJson = null;
        }
        return notificationJson;
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
                if(notification != null)
                    intent.putExtra("Attachments", notification);
                setResult(RESULT_CANCELED, intent);
                finish();
                overridePendingTransition(R.anim.left_to_right_anim, R.anim.left_to_right_exit);
                break;
            case R.id.send:
                setResult(RESULT_OK);
                status = "Sent";
                JSONObject notificationJson = notificationChannelValidation();
                if (notificationJson == null)
                    return false;
                final ProgressDialog progressDialog = new ProgressDialog(CreateNotification.this);
                if (updatable){
                    BasicHeader[] headers = stringUtils.headers(CreateNotification.this, CREATE_NOTIFICATION);
                    draftUrl = BASE_URL + API_VERSION_ONE + SMS + NOTIFICATIONS_DRAFT + notification.getNotificationId();
                    UPDATEUrlConnection urlConnection = new UPDATEUrlConnection(CreateNotification.this, draftUrl, headers, notificationJson){

                        @Override
                        protected void onPreExecute() {
                            super.onPreExecute();
                            progressDialog.setCancelable(false);
                            progressDialog.setCanceledOnTouchOutside(false);
                            progressDialog.setMessage(getResources().getText(R.string.sending_notify));
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
                                    showToast((String) getResources().getText(R.string.notify_sent));
                                } catch (SessionExpiredException e) {
                                    e.handleException(CreateNotification.this);
                                }
                            } else
                                showToast((String) getResources().getText(R.string.notify_not_sent));
                        }
                    };
                    if (notificationJson.length() != 0)
                        urlConnection.execute();

                } else {
                    String authenticateUrl = BASE_URL + API_VERSION_ONE + SMS + NOTIFICATIONS;
                    BasicHeader[] headers = stringUtils.headers(CreateNotification.this, CREATE_NOTIFICATION);
                    POSTUrlConnection urlConnection = new POSTUrlConnection(notificationJson, authenticateUrl, headers, CreateNotification.this) {

                        @Override
                        protected void onPreExecute() {
                            super.onPreExecute();
                            progressDialog.setCancelable(false);
                            progressDialog.setCanceledOnTouchOutside(false);
                            progressDialog.setMessage(getResources().getText(R.string.creating_notify));
                            progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
                            progressDialog.show();
                        }

                        @Override
                        protected void onPostExecute(String success) {
                            super.onPostExecute(success);
                            progressDialog.dismiss();
                            Log.v("success","success "+success);
                            if (success != null) {
                                try {
                                    stringUtils.checkSession(success);
                                    showToast((String) getResources().getText(R.string.notify_create_success));
                                    editor.putString(TAXANOMY_SELECTION, null);
                                    editor.apply();
                                    finish();
                                    overridePendingTransition(R.anim.left_to_right_anim, R.anim.left_to_right_exit);
                                } catch (SessionExpiredException e) {
                                    e.handleException(CreateNotification.this);
                                }
                            } else
                                showToast((String) getResources().getText(R.string.notify_not_create_success));

                        }
                    };
                    if (notificationJson.length() != 0)
                        urlConnection.execute();
                }
        }
        return super.onOptionsItemSelected(item);
    }

    private void setUpSpinner() {

        categories = (Spinner)findViewById(R.id.categoriesspin);
        String url = BASE_URL + API_VERSION_ONE + SMS + TEMPLATES;
        GETUrlConnection getUrlConnection = new GETUrlConnection(CreateNotification.this, url,null){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                if(response != null) {
                    try {
                        stringUtils.checkSession(response);
                        List<Template> templates = jsonParser(response);
                        renderSpinnerData(templates);

                        if (updatable) {
                            int pos = getMatchedIndex(templates, notification);
                            // Log.v("pppp", "" + pos);
                            categories.setSelection(pos);
                        } else
                            categories.setSelection(position);
                    } catch (SessionExpiredException e) {
                        e.handleException(CreateNotification.this);
                    } catch (JSONException | NullPointerException e) {
                        //None alone will be there in spinner
                        renderSpinnerData(new ArrayList<Template>());
                    }
                } else
                    //None alone will be there in spinner
                    renderSpinnerData(new ArrayList<Template>());
            }
        };
        getUrlConnection.execute();

        categories.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view,int position, long id) {
                if(first) {
                    description.setText(notification.getPushTemplateMessage());
                    first = false;
                }else {
                    template = (Template) categories.getItemAtPosition(position);
                    description.setText(template.getMessage());
                    description.invalidate();
                    CreateNotification.this.position = position;
                    spinnerSelect=true;
                }
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putString("Value",selected);
        outState.putInt("Position",position);
        Log.v("text ","list "+ selected + " " + position);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        if (preferences.contains(TAXANOMY_SELECTION)){
            editor.putString(TAXANOMY_SELECTION, null);
            editor.apply();
        }
    }

    private void renderSpinnerData(List<Template> templates) {
        Template template = new Template(null, null, " ", null);
        template.setTitle("None");
        template.setTemplateId("00000000-0000-0000-0000-000000000000");
        templates.add(0, template);
        CategoriesSpinnerAdapter adapter = new CategoriesSpinnerAdapter(CreateNotification.this, templates);
        categories.setAdapter(adapter);
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

            case ATTACHMENT:
                attachmentTextView = (TextView)findViewById(R.id.attachments);
                if(resultCode == RESULT_OK) {
                    HashMap<String, String> images = (HashMap<String, String>) data.getSerializableExtra(UPLOADED_IMAGES);
                    uploadedImages.putAll(images);

                    String attachmentAry = data.getStringExtra("attachmentAry");
                    try {
                        JSONArray attachmentsArray = new JSONArray(attachmentAry);
                        if(attachmentsArray.length() == uploadedImages.size())
                            attachmentsAry = attachmentsArray;
                        else
                            createAssignmentArray();

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    Log.v("Attachment "," array"+attachmentsAry);
                    attachmentTextView.setText(String.valueOf(uploadedImages.size()) + " attachments");
                } else if(resultCode == RESULT_CANCELED && data != null) {
                    if(!data.hasExtra("AttachmentObject")) return;

                    HashMap<String, String> images = (HashMap<String, String>) data.getSerializableExtra("AttachmentObject");
                    uploadedImages.clear();
                    uploadedImages.putAll(images);

                    if(notification!= null && notification.getAttachments() != null) {
                        Log.v("NoTiFiCation ","attachmentsize "+notification.getAttachments().size());
                        notification.getAttachments().clear();
                        notification.getAttachments().putAll(images);
                    }

                    attachmentTextView.setText(String.valueOf(uploadedImages.size()) + " attachments");
                }
                break;
        }
    }

    public List<Template> jsonParser(String jsonString) throws JSONException, NullPointerException {
        List<Template> templates = new ArrayList<>();

        JSONObject templatesObject = new JSONObject(jsonString);
        JSONArray tempatesArray = templatesObject.getJSONArray(DATA);
        for (int i=0; i<tempatesArray.length(); i++) {
            JSONObject object = tempatesArray.getJSONObject(i);
            String templateId = object.getString("template_id");
            String status = object.getString("status");
            String title = object.getString("template_title");
            String message = object.getString("template_message");
            Template template = new Template(templateId, title, message, status);
            templates.add(template);
        }

        return templates;
    }

    public void createAssignmentArray() throws JSONException {
        Log.v("Attachment "," create array"+attachmentsAry);
        List<Map.Entry<String, String>> entries = new ArrayList<>(uploadedImages.entrySet());
        attachmentsAry = new JSONArray();
        for (int i=0; i<entries.size(); i++) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id", entries.get(i).getKey());
            jsonObject.put("name", entries.get(i).getValue());
            attachmentsAry.put(jsonObject);
        }
    }

    public JSONObject createJson() {
        JSONObject entireObject = new JSONObject();
        JSONObject templateJson = new JSONObject();
        JSONObject notifyTo = new JSONObject();
        JSONObject notify = new JSONObject();
        JSONArray users = new JSONArray();
        final String messageTitle = title.getText().toString();
        final String phoneNo = number.getText().toString();
        try {
            if(!messageTitle.isEmpty() && ((taxanomyObject != null && taxanomyObject.getJSONArray("selectedNodes").length() != 0)  || !phoneNo.isEmpty() || attendeesArray.length() != 0) && !description.getText().toString().isEmpty() ) {
                final String desc = description.getText().toString();
                double descLength = desc.length();
                double count = Math.ceil(descLength / 150);
                boolean smsValue = sms.isChecked();
                boolean pushValue = push.isChecked();
                boolean emailValue = false;

                if (updatable){
                    if(spinnerSelect) {
                        templateJson.put("templateId", template.getTemplateId());
                    } else  {
                        templateJson.put("templateId",notification.getTemplateId());
                    }
                    templateJson.put("templateName", description.getText().toString().trim());
                    if(notification.getTitle().equals("None"))
                        templateJson.put("templateTitle"," ");
                    else {
                        if(spinnerSelect)
                            templateJson.put("templateTitle", template.getTitle());
                        else
                            templateJson.put("templateTitle",notification.getPushTemplateTitle());
                    }
                } else {
                    templateJson.put("templateId", template.getTemplateId());
                    templateJson.put("templateName", description.getText().toString().trim());
                    if(template.getTitle().equals("None")){
                        templateJson.put("templateTitle"," ");
                    }else {
                        templateJson.put("templateTitle", template.getTitle());
                    }
                }
                templateJson.put("title", messageTitle);
                notifyTo.put("count", String.valueOf(count));
                notify.put("sms", smsValue);
                notify.put("push",pushValue);
                notify.put("email",emailValue);
                notifyTo.put("status", status);
                entireObject.put("phoneNo", phoneNo);
                entireObject.put("notifiedCategories", "");
                entireObject.put("createdDate", createdDate);
                entireObject.put("smsTemplate", templateJson);
                entireObject.put("pushTemplate", templateJson);
                entireObject.put("emailTemplate", templateJson);
                entireObject.put("notify", notify);
                entireObject.put("isChecked",notifyTo);
                entireObject.put("students", attendeesArray);
                if(attachmentsAry.length() != uploadedImages.size())
                    createAssignmentArray();
                entireObject.putOpt("attachments", attachmentsAry);

                if(notification!= null)
                    entireObject.put("notificationId", uploadId);
                if (elasticObject != null)
                    entireObject.put("classes", elasticObject.getJSONArray("classes"));
                else
                    entireObject.put("classes", new JSONArray());
                //Log.v("Taxonomy ","object "+elasticObject.getJSONArray("classes"));
                if (taxanomyObject != null) {
                    Log.v("taxt object","single "+ taxanomyObject);
                    if (taxanomyObject.getJSONArray("users").length() != 0)
                        entireObject.putOpt("users", taxanomyObject.getJSONArray("users"));
                //    else
                    if(taxanomyObject.has("notifyTo") && taxanomyObject.getJSONObject("notifyTo").has("userType"))
                        notifyTo.put("userType", taxanomyObject.getJSONObject("notifyTo").getJSONArray("userType"));
                    entireObject.putOpt("taxanomy", taxanomyObject.getJSONArray("taxanomy"));
                    entireObject.putOpt("selectedNodes", taxanomyObject.getJSONArray("selectedNodes"));
                }
                else
                    notifyTo.put("userType", new JSONArray());
                notifyTo.put("sendMedia",true);
                entireObject.put("notifyTo", notifyTo);
            } else {
                showToast((String) getResources().getText(R.string.notify_toast));
                return null;
                //throw new JSONException("Mandatory fields are missing");
            }
        } catch (JSONException | NullPointerException e) {
            showToast((String) getResources().getText(R.string.notify_toast));
            e.printStackTrace();
            return null;
        }
        Log.v("created","Json"+entireObject.toString());
        return entireObject;
    }

    private void showToast(String message) {
        if (toast != null)
            toast.cancel();
        toast = Toast.makeText(CreateNotification.this, message, Toast.LENGTH_LONG);
        toast.show();
    }

    public int getMatchedIndex(List<Template> templates, Notify notification) {
        int index = 0;
        for (Template template : templates) {
            if (template.getTemplateId() != null && template.getTemplateId().equals(notification.getTemplateId()))
                index = templates.indexOf(template);
        }
        return index;
    }
}