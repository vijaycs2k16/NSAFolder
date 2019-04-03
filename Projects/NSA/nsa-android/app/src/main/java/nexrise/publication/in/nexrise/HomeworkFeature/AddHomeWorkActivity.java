package nexrise.publication.in.nexrise.HomeworkFeature;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.message.BasicHeader;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import nexrise.publication.in.nexrise.BeanClass.AttachmentDetails;
import nexrise.publication.in.nexrise.BeanClass.HomeworkType;
import nexrise.publication.in.nexrise.BeanClass.Subject;
import nexrise.publication.in.nexrise.BeanClass.TeacherHomeWork;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.AttachmentActivity;
import nexrise.publication.in.nexrise.ReusedActivities.DueDateActivity;
import nexrise.publication.in.nexrise.Taxanomy.TaxonomyActivity;
import nexrise.publication.in.nexrise.TimetableFeature.ViewNotesActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class AddHomeWorkActivity extends AppCompatActivity implements Constants{

    Subject subject;
    String taxanomyJson = "";
    String esQuery = "";
    JSONArray usersAry = null;
    HomeworkType homeworkType;
    JSONObject taxanomyObject;
    boolean sms = false;
    boolean push = false;
    boolean email = false;
    CheckBox smschannel;
    CheckBox pushchannel;
    CheckBox emailchannel;
    boolean updatable = false;

    private Boolean status;
    String uuid;
    HashMap<String, String> uploadedImages = new HashMap<>();
    JSONArray attachmentsAry = new JSONArray();
    String attachmentCount = "";

    String selected = "Not selected";
    String assignmentDescription = "Enter description";
    String priority = "Medium";
    String dueDates = "";
    String homeworkTypeName = "";
    String subjectName = "";
    String typeId;
    ArrayList<HomeworkType> homeworkTypeList;
    Toast toast;

    final int SELECT_CLASS = 100;
    final int HOMEWORK_TYPE = 1;
    final int SUBJECT = 7;
    final int DUE_DATE = 2;
    final int ATTACHMENT = 4;

    SharedPreferences preferences;
    SharedPreferences.Editor editor;
    TeacherHomeWork homeWorkData;
    StringUtils stringUtils;
    EditText homeworkName;
    TextView classesTextView;
    TextView subjectTextView;
    TextView homeworkTypeTextView;
    TextView dueDateTextView;
    TextView attachmentsTextView;
    TextView priorityTextView;
    TextView descriptionTextView;
    Button draft;
    JSONArray subjectArray;
    ArrayList<Subject> selectedSubjectList;
    String fromActivity = "";

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(final Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_home_work);
        uuid = UUID.randomUUID().toString();
        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        editor = preferences.edit();
        init();

        stringUtils = new StringUtils();
        TextView classes = (TextView) findViewById(R.id.classView);
        classes.setText(stringUtils.mandatory("Classes"));
        TextView subject = (TextView) findViewById(R.id.subjectView);
        subject.setText(stringUtils.mandatory("Subject"));
        TextView type = (TextView) findViewById(R.id.typeView);
        type.setText(stringUtils.mandatory("Type"));
        TextView duration = (TextView) findViewById(R.id.duedateView);
        duration.setText(stringUtils.mandatory("Due Date"));

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM dd yyyy");
        dueDates = dateFormat.format(calendar.getTime());
        dueDateTextView.setText(dueDates);
        //priorityTextView.setText(priority);

        fromActivity = getIntent().getStringExtra("FromActivity");

        if (fromActivity.equalsIgnoreCase("MainActivity")){
            updatable = true;
            homeWorkData = (TeacherHomeWork) getIntent().getSerializableExtra("ListData");
            homeworkName.setText(homeWorkData.getAssignmentName());
            Log.v("Assignmet ","Description "+homeWorkData.getAssignmentDesc());
            if(homeWorkData.getAssignmentDesc() != null && !homeWorkData.getAssignmentDesc().equals("null")) {
                assignmentDescription = homeWorkData.getAssignmentDesc();
            } else {
                assignmentDescription = "";
            }
            stringUtils.setTextColorRed(this, classesTextView, "Verify selected");
            classesTextView.setText(R.string.verify_selected);
            descriptionTextView.setText(assignmentDescription);
            priorityTextView.setText(stringUtils.setPriority(homeWorkData.getPriority()));
            dueDateTextView.setText(stringUtils.Dateset(homeWorkData.getDueDate()));
            homeworkTypeTextView.setText(homeWorkData.getAssignmentTypeName());
            selectedSubjectList = homeWorkData.getSubjects();
            selectedSubjectName(selectedSubjectList);
            subjectList(selectedSubjectList);
            priority = stringUtils.setPriority(homeWorkData.getPriority());
            dueDates = stringUtils.Dateset(homeWorkData.getDueDate());
            homeworkTypeName = homeWorkData.getAssignmentTypeName();
            typeId = homeWorkData.getAssignmentTypeId();

            ArrayList<AttachmentDetails> attachmentDetails = new ArrayList<>();
            if(homeWorkData.getAttachments() != null)
                attachmentDetails.addAll(homeWorkData.getAttachments());

            for (int i=0; i<attachmentDetails.size(); i++) {
                String url = attachmentDetails.get(i).getId();
                String fileName = attachmentDetails.get(i).getFileName();
                uploadedImages.put(url, fileName);
            }
            attachmentCount = String.valueOf(uploadedImages.size()) + "Attachments";
            attachmentsTextView.setText(attachmentCount);
        } else
            renderHomeworkType();

        String featurecredential = BASE_URL + API_VERSION_ONE + FEATURE ;// CREATE_ASSIGNMENT;
        BasicHeader[] header = stringUtils.headers(AddHomeWorkActivity.this,CREATE_ASSIGNMENT);

        GETUrlConnection urlConnection = new GETUrlConnection(AddHomeWorkActivity.this,featurecredential,header) {
            @Override
            protected void onPostExecute(String assignmentresponse) {
                super.onPostExecute(assignmentresponse);
                Log.v("feature ","featureresponse "+assignmentresponse);
                JSONObject jsonObject = null;
                try {
                    stringUtils.checkSession(assignmentresponse);
                    jsonObject = new JSONObject(assignmentresponse);
                    JSONObject data = jsonObject.getJSONObject(DATA);
                    Boolean smsStatus = data.getBoolean("sms");
                    Boolean emailStatus = data.getBoolean("email");
                    Boolean pushStatus = data.getBoolean("push");

                    smschannel = (CheckBox)findViewById(R.id.smscheck);
                    pushchannel = (CheckBox)findViewById(R.id.pushcheck);
                    emailchannel = (CheckBox)findViewById(R.id.emailcheck);
                    TextView textChannel = (TextView)findViewById(R.id.textView4);

                    String channel = "Notification :";
                    String colored = " *";
                    SpannableStringBuilder builder = new SpannableStringBuilder();
                    builder.append(channel);
                    int start = builder.length();
                    builder.append(colored);
                    int end = builder.length();
                    builder.setSpan(new ForegroundColorSpan(Color.RED), start, end,
                            Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
                    textChannel.setText(builder);

                    ImageView icon = (ImageView)findViewById(R.id.icons);
                    icon.setVisibility(View.VISIBLE);
                    draftButtonClick();

                    if (pushStatus)
                        pushchannel.setVisibility(View.VISIBLE);

                    if (smsStatus)
                        smschannel.setVisibility(View.VISIBLE);

                    if (emailStatus)
                        emailchannel.setVisibility(View.VISIBLE);

                } catch (NullPointerException | JSONException  e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(AddHomeWorkActivity.this);
                }
            }
        };
        urlConnection.execute();

        android.support.v7.app.ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null) {
            if (updatable)
                actionBar.setTitle(R.string.edit_homework);
            else
                actionBar.setTitle(R.string.add_homework);

            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
    }

    public void init() {
        homeworkName = (EditText)findViewById(R.id.homework_name);
        classesTextView = (TextView)findViewById(R.id.classes);
        subjectTextView = (TextView)findViewById(R.id.subject);
        homeworkTypeTextView = (TextView)findViewById(R.id.assignment_type);
        dueDateTextView = (TextView)findViewById(R.id.due_date);
        attachmentsTextView = (TextView)findViewById(R.id.attachments);
        priorityTextView = (TextView)findViewById(R.id.priority);
        descriptionTextView = (TextView)findViewById(R.id.description);
        draft = (Button)findViewById(R.id.save_as_draft);
        dueDateTextView.setText(dueDates);
        subjectArray = new JSONArray();
        selectedSubjectList = new ArrayList<>();

        clickhandler();
    }

    private void renderHomeworkType() {
        String url = BASE_URL + API_VERSION_ONE + ASSIGNMENT + TYPES;
        GETUrlConnection getAssignmentTypes = new GETUrlConnection(this, url,null) {

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                homeworkTypeTextView.setText(R.string.loading);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                if(response != null) {
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject assignmentTypes = new JSONObject(response);
                        JSONArray data = assignmentTypes.getJSONArray("data");
                        if(data.length() == 0 )
                            throw new JSONException("Empty Json");
                        ObjectMapper valuesMapper = new ObjectMapper();
                        valuesMapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                        homeworkTypeList = valuesMapper.readValue(data.toString(), TypeFactory.collectionType(ArrayList.class, HomeworkType.class));
                        if(checkHomeworkType()) {
                            homeworkTypeName = homeworkTypeList.get(0).getName();
                            homeworkTypeTextView.setText(homeworkTypeName);
                            typeId = homeworkTypeList.get(0).getId();
                        }
                    } catch (JSONException | NullPointerException | IOException e) {
                        e.printStackTrace();
                        homeworkTypeTextView.setText("");
                    } catch (SessionExpiredException e) {
                        e.handleException(AddHomeWorkActivity.this);
                    }
                }
            }
        };
        getAssignmentTypes.execute();
    }

    private boolean checkHomeworkType() {
        return (homeworkTypeList != null && homeworkTypeList.size() > 0);
    }

    public void clickhandler() {
        LinearLayout classesLayout = (LinearLayout)findViewById(R.id.classes_layout);
        classesLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent taxanomy = new Intent(AddHomeWorkActivity.this, TaxonomyActivity.class);
                if (updatable && taxanomyObject == null)
                    taxanomy.putExtra("notifiedCategories",homeWorkData.getNotifiedCategories());
                taxanomy.putExtra(FROM,HOMEWORKFEATURE);
                startActivityForResult(taxanomy, SELECT_CLASS);
            }
        });

        LinearLayout subjectLayout = (LinearLayout)findViewById(R.id.subject_layout);
        subjectLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent subjectActivity = new Intent(AddHomeWorkActivity.this, SubjectHomeWorkActivity.class);
                subjectActivity.putExtra("ActionBarTitle","Select Subject");
                subjectActivity.putExtra("selectedList",selectedSubjectList);
                startActivityForResult(subjectActivity, SUBJECT);
            }
        });

        LinearLayout typeLayout = (LinearLayout)findViewById(R.id.type_layout);
        typeLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent homeworkTypeActivity = new Intent(AddHomeWorkActivity.this, HomeworkTypeActivity.class);
                homeworkTypeActivity.putExtra("ActionBarTitle","Homework Type");
                if(homeworkTypeList != null)
                    homeworkTypeActivity.putExtra("HomeworkType",homeworkTypeList);
                startActivityForResult(homeworkTypeActivity, HOMEWORK_TYPE);
            }
        });

        LinearLayout descriptionLayout = (LinearLayout)findViewById(R.id.description_layout);
        descriptionLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder enterDescriptionBuilder = new AlertDialog.Builder(AddHomeWorkActivity.this);
                LayoutInflater layoutInflater = getLayoutInflater();
                final View descriptionDialogView = layoutInflater.inflate(R.layout.enter_description_dialog, null);
                enterDescriptionBuilder.setView(descriptionDialogView);
                EditText enteredText = (EditText)descriptionDialogView.findViewById(R.id.enter_descripition);

                if(!assignmentDescription.equals("Enter description"))
                    enteredText.setText(assignmentDescription);
                enterDescriptionBuilder.setTitle(R.string.enter_description);

                enterDescriptionBuilder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(final DialogInterface dialog, int which) {
                        TextView description = (TextView)findViewById(R.id.description);
                        EditText enteredText = (EditText)descriptionDialogView.findViewById(R.id.enter_descripition);
                        assignmentDescription = String.valueOf(enteredText.getText());
                        description.setText(assignmentDescription);

                        dialog.dismiss();
                    }
                });

                enterDescriptionBuilder.setNegativeButton("CANCEL", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
                enterDescriptionBuilder.show();
            }
        });

        LinearLayout duedateLayout = (LinearLayout)findViewById(R.id.duedate_layout);
        duedateLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent dueDateActivity = new Intent(AddHomeWorkActivity.this, DueDateActivity.class);
                dueDateActivity.putExtra(PAST_DATE_FREEZE,true);
                dueDateActivity.putExtra("Date","Due Date");
                startActivityForResult(dueDateActivity, DUE_DATE);
            }
        });

        LinearLayout attachmentsLayout = (LinearLayout)findViewById(R.id.attachments_layout);
        attachmentsLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String url = BASE_URL + API_VERSION_ONE + UPLOAD + "/";
                HashMap<String, String> uploadBody = new HashMap<String, String>();
                uploadBody.put("uploadId", uuid);

                if(uploadedImages == null || uploadedImages.size() == 0) {
                    Intent attachmentActivity = new Intent(AddHomeWorkActivity.this, AttachmentActivity.class);
                    attachmentActivity.putExtra(JSON, uploadBody);
                    attachmentActivity.putExtra(URL, url);
                    attachmentActivity.putExtra(UPLOAD_ID, uuid);
                    attachmentActivity.putExtra(ID, CREATE_ASSIGNMENT);
                    startActivityForResult(attachmentActivity, ATTACHMENT);
                } else {
                    Intent viewNotes = new Intent(AddHomeWorkActivity.this, ViewNotesActivity.class);
                    viewNotes.putExtra(UPLOADED_IMAGES, uploadedImages);
                    viewNotes.putExtra(JSON, uploadBody);
                    viewNotes.putExtra(URL, url);
                    viewNotes.putExtra(UPLOAD_ID, uuid);
                    viewNotes.putExtra(ID, CREATE_ASSIGNMENT);
                    startActivityForResult(viewNotes, ATTACHMENT);
                }
            }
        });

        LinearLayout priorityLayout = (LinearLayout)findViewById(R.id.priority_layout);
        priorityLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder alertBuilder = new AlertDialog.Builder(AddHomeWorkActivity.this);
                LayoutInflater inflater = getLayoutInflater();
                final View dialogView = inflater.inflate(R.layout.priority_alert_dialog, null);
                alertBuilder.setView(dialogView);
                final RadioGroup priorityRadioGroup = (RadioGroup)dialogView.findViewById(R.id.priority_radiogroup);
                int priorityIndex = stringUtils.getPriority(priority);
                priorityIndex = priorityIndex - 1;
                priorityRadioGroup.getChildAt(1).setSelected(true);
                final AlertDialog alertDialog = alertBuilder.create();
                alertDialog.show();
                priorityRadioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                    @Override
                    public void onCheckedChanged(RadioGroup group, int checkedId) {
                        priority = ((RadioButton)dialogView.findViewById(priorityRadioGroup.getCheckedRadioButtonId())).getText().toString();
                        TextView priorityTextView = (TextView)findViewById(R.id.priority);
                        priorityTextView.setText(priority);
                        alertDialog.dismiss();
                    }
                });
            }
        });
    }

    public void draftButtonClick(){
        draft.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                status = false;
                if (updatable)
                    updateAssignment((String) getResources().getText(R.string.homework_updated));
                else
                   saveAssignment((String) getResources().getText(R.string.homework_save_draft));
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.add_homework_actionbar, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                setResult(RESULT_CANCELED);
                editor.putString(TAXANOMY_SELECTION, null);
                editor.apply();
                finish();
                break;
            case R.id.tick:
                status = true;
                if(updatable)
                    updateAssignment((String) getResources().getText(R.string.homework_published));
                 else
                    saveAssignment((String) getResources().getText(R.string.homework_published));

                break;
        }
        return super.onOptionsItemSelected(item);
    }

    public void saveAssignment(final String data) {
        String url = BASE_URL + API_VERSION_ONE + ASSIGNMENT;
        JSONObject assignmentJson = createAssignmentJson();
        if(assignmentJson == null)
            return;
        BasicHeader[] headers = stringUtils.headers(AddHomeWorkActivity.this, CREATE_ASSIGNMENT);
        POSTUrlConnection saveAssignment = new POSTUrlConnection(assignmentJson, url, headers, this){
            ProgressDialog progressDialog = new ProgressDialog(AddHomeWorkActivity.this);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressDialog.setMessage(getResources().getText(R.string.creating_homework));
                progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
                progressDialog.setCancelable(false);
                progressDialog.setCanceledOnTouchOutside(false);
                progressDialog.show();
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("response of Assignment","assignment"+response);
                progressDialog.dismiss();
                try {
                    stringUtils.checkSession(response);
                    JSONObject responseObj = new JSONObject(response);
                    boolean success = responseObj.getBoolean(SUCCESS);
                    String message = responseObj.getString(DATA);
                    if(success) {
                        Toast.makeText(AddHomeWorkActivity.this, data, Toast.LENGTH_SHORT).show();
                        preferences.edit().putString(TAXANOMY_SELECTION, null).apply();
                        HomeworkActivity.teacherHomeWorkRendered = false;
                        HomeWorkFragment.teacherHomeWorkRendered = false;
                        AdminHomeworkActivity.teacherHomeWorkRendered = false;
                        HomeWorkFragment.date = dueDateTextView.getText().toString();
                        AddHomeWorkActivity.this.finish();
                    } else {
                        Toast.makeText(AddHomeWorkActivity.this, R.string.could_not_create_assignment, Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(AddHomeWorkActivity.this);
                }
            }
        };
        saveAssignment.execute();
    }

    public void updateAssignment(final String data) {
        BasicHeader[] headers = stringUtils.headers(AddHomeWorkActivity.this, CREATE_ASSIGNMENT);
        JSONObject assignmentJson = createAssignmentJson();
        if(assignmentJson == null)
            return;
        String draftUrl = BASE_URL + API_VERSION_ONE + ASSIGNMENT + homeWorkData.getId();
        UPDATEUrlConnection urlConnection = new UPDATEUrlConnection(AddHomeWorkActivity.this, draftUrl, headers, assignmentJson) {
            ProgressDialog dialog = new ProgressDialog(AddHomeWorkActivity.this, ProgressDialog.STYLE_SPINNER);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                dialog.setMessage(getResources().getText(R.string.save_homework));
                dialog.setCancelable(false);
                dialog.setCanceledOnTouchOutside(false);
                dialog.show();
            }

            @Override
            protected void onPostExecute(String success) {
                super.onPostExecute(success);
                if(dialog != null && dialog.isShowing())
                    dialog.dismiss();
                try {
                    stringUtils.checkSession(success);
                    JSONObject responseObj = new JSONObject(success);
                    boolean success1 = responseObj.getBoolean(SUCCESS);

                    String message = responseObj.getString(DATA);
                    if (success1) {
                        if (toast != null)
                            toast.cancel();
                        toast = Toast.makeText(AddHomeWorkActivity.this, data, Toast.LENGTH_SHORT);
                        toast.show();
                        preferences.edit().putString(TAXANOMY_SELECTION, null).apply();
                        HomeworkActivity.teacherHomeWorkRendered = false;
                        HomeWorkFragment.teacherHomeWorkRendered = false;
                        AdminHomeworkActivity.teacherHomeWorkRendered = false;
                        HomeWorkFragment.date = dueDateTextView.getText().toString();
                        AddHomeWorkActivity.this.finish();
                    } else {
                        if (toast != null)
                            toast.cancel();
                        toast = Toast.makeText(AddHomeWorkActivity.this, message, Toast.LENGTH_SHORT);
                        toast.show();
                    }
                } catch (JSONException | NullPointerException e) {
                    Toast.makeText(AddHomeWorkActivity.this, R.string.could_not_create_assignment, Toast.LENGTH_SHORT).show();
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(AddHomeWorkActivity.this);
                }
            }
        };
        urlConnection.execute();
    }

    public JSONObject createAssignmentJson(){
        JSONObject createAssignmentJson = new JSONObject();
        final String assignmentName = homeworkName.getText().toString();
        try {
            if(!assignmentName.isEmpty() && typeId !=null && (taxanomyObject != null && taxanomyObject.getJSONArray("selectedNodes").length() != 0) && usersAry != null && subjectArray.length() != 0 && (pushchannel.isChecked() || smschannel.isChecked())) {
                createAssignmentJson.put("assignmentName", assignmentName);
                createAssignmentJson.put("assignmentTypeId", typeId);
                createAssignmentJson.put("status", status);
                createAssignmentJson.put("assignmentTypeName", homeworkTypeName);
                createAssignmentJson.put("assignmentId", uuid);
                if(attachmentsAry.length() != uploadedImages.size())
                    createAssignmentArray();
                createAssignmentJson.putOpt("attachments", attachmentsAry);
                if (assignmentDescription.equalsIgnoreCase("Enter description"))
                    assignmentDescription = "";
                createAssignmentJson.put("assignmentDesc", assignmentDescription);
                createAssignmentJson.putOpt("taxanomy", taxanomyObject.getJSONArray("taxanomy"));
                createAssignmentJson.putOpt("selectedNodes", taxanomyObject.getJSONArray("selectedNodes"));
                createAssignmentJson.put("notifiedTo", "All");
                createAssignmentJson.put("repeatOption", "once");
                createAssignmentJson.put("repeatOptionId", "49866640-cd24-4650-adca-1546ae9af96e");
                JSONObject notifyTo = new JSONObject();
                notifyTo.put("status","Sent");
                createAssignmentJson.put("notifyTo",notifyTo);
                createAssignmentJson.putOpt("users", usersAry);
                createAssignmentJson.put("updatedUserName", preferences.getString(CURRENT_USERNAME,null));
                createAssignmentJson.put("updatedBy", preferences.getString(FIRST_NAME,null));
                JSONObject notify = new JSONObject();
                sms = smschannel.isChecked();
                push = pushchannel.isChecked();
                email = emailchannel.isChecked();

                notify.put("sms", sms);
                notify.put("email", email);
                notify.put("push", push);
                createAssignmentJson.put("notify", notify);
                String dueDate = stringUtils.Dateset(dueDates);
                createAssignmentJson.put("dueDate", dueDate);
                int priority = stringUtils.getPriority(AddHomeWorkActivity.this.priority);
                createAssignmentJson.put("priority", priority);
                createAssignmentJson.putOpt("subjects",subjectArray);
                Log.v("JSON "," "+createAssignmentJson);
            } else {
                if(toast != null)
                    toast.cancel();
                toast =  Toast.makeText(this, R.string.fill_mandatory_fields, Toast.LENGTH_SHORT);
                toast.show();
                return null;
            }
        } catch (JSONException |NullPointerException e) {
            e.printStackTrace();
            return null;
        }
        Log.v("Create","JSon"+createAssignmentJson);
        return createAssignmentJson;
    }

    public void createAssignmentArray() throws JSONException {
        List<Map.Entry<String, String>> entries = new ArrayList<>(uploadedImages.entrySet());
        attachmentsAry = new JSONArray();
        for (int i=0; i<entries.size(); i++) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id", entries.get(i).getKey());
            jsonObject.put("name", entries.get(i).getValue());
            attachmentsAry.put(jsonObject);
        }
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        if (preferences.contains(TAXANOMY_SELECTION)){
            editor.putString(TAXANOMY_SELECTION, null);
            editor.apply();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode){
            case HOMEWORK_TYPE:
                if(resultCode == RESULT_OK && data.getSerializableExtra("Type")!= null) {
                    homeworkType = (HomeworkType) data.getSerializableExtra("Type");
                    homeworkTypeName = homeworkType.getName();
                    typeId = homeworkType.getId();
                    homeworkTypeTextView.setText(homeworkTypeName);
                } /*else if(checkHomeworkType()){
                    homeworkTypeName = homeworkTypeList.get(0).getName();
                    typeId = homeworkTypeList.get(0).getId();
                    homeworkTypeTextView.setText(homeworkTypeName);
                }*/
                break;
            case DUE_DATE:
                if (resultCode == RESULT_OK && data.getIntExtra("Date", 0) != 0) {
                    dueDates = stringUtils.DisplayDate(data.getIntExtra("Date", 0) + "/" + data.getIntExtra("Month", 0) + "/" + data.getIntExtra("Year", 0));
                    dueDateTextView.setText(dueDates);
                }
                break;
            case SUBJECT:
                if(resultCode == RESULT_OK) {
                    selectedSubjectList = (ArrayList<Subject>) data.getSerializableExtra("Subject");
                    selectedSubjectName(selectedSubjectList);
                    subjectList(selectedSubjectList);

                } else {
                    subjectName = "";
                    subjectTextView.setText(subjectName);
                }
                break;
            case SELECT_CLASS:
                if(resultCode == RESULT_OK && data!= null) {
                    taxanomyJson = data.getStringExtra("Taxanomy json");
                    esQuery = data.getStringExtra("ES query");
                    classesTextView.setTextColor(this.getResources().getColor(R.color.colorBlack));
                    classesTextView.setText(R.string.loading);
                    try {
                        taxanomyObject = new JSONObject(taxanomyJson);
                        JSONObject elasticSearchQuery = new JSONObject(esQuery);
                        Log.v("ES ","Query "+elasticSearchQuery);
                        String url = BASE_URL + API_VERSION_ONE + ES + STUDENT+ "/" + CLASSES;
                        POSTUrlConnection getUsersByClassAndSections = new POSTUrlConnection(elasticSearchQuery, url, null, this) {
                            @Override
                            protected void onPostExecute(String response) {
                                super.onPostExecute(response);
                                Log.v("ES values", " " + response);
                                try {
                                    JSONObject jsonResponse = new JSONObject(response);
                                    usersAry = jsonResponse.getJSONArray("data");
                                    JSONArray selectedNodes = taxanomyObject.getJSONArray("selectedNodes");
                                    stringUtils.setTextColorRed(AddHomeWorkActivity.this, classesTextView, "selected");
                                    classesTextView.setText(""+selectedNodes.length()+ " selected");
                                    if(usersAry == null || usersAry.length() == 0)
                                        throw new JSONException("Empty json array");
                                } catch (JSONException | NullPointerException e) {
                                    e.printStackTrace();
                                    classesTextView.setText(selected);
                                    taxanomyObject = null;
                                    Toast.makeText(AddHomeWorkActivity.this, R.string.no_student_associate, Toast.LENGTH_SHORT).show();
                                    if(editor != null) {
                                        editor.putString(TAXANOMY_SELECTION, null);
                                        editor.apply();
                                    }
                                }
                            }
                        };
                        getUsersByClassAndSections.execute();
                        Log.v("Selected values", " " + taxanomyObject);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                   // selected = "Not selected";
                    stringUtils.setTextColorRed(this, classesTextView, selected);
                    classesTextView.setText(selected);
                }
                break;
            case ATTACHMENT:
                if(resultCode == RESULT_OK && data != null) {
                    HashMap<String, String> images = (HashMap<String, String>) data.getSerializableExtra(UPLOADED_IMAGES);
                    uploadedImages.putAll(images);

                    String attachmentAry = data.getStringExtra("attachmentAry");
                    try {
                        JSONArray attachmentsArray = new JSONArray(attachmentAry);
                        if(attachmentsArray.length() == uploadedImages.size())
                            attachmentsAry = attachmentsArray;
                        else {
                            createAssignmentArray();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    Log.v("Attachment "," array"+attachmentsAry);
                    attachmentCount = String.valueOf(uploadedImages.size());
                    attachmentsTextView.setText(attachmentCount + "Attachment");
                }
                else if(resultCode == RESULT_CANCELED && data != null) {
                    if(!data.hasExtra("AttachmentObject")) return;

                    HashMap<String, String> images = (HashMap<String, String>) data.getSerializableExtra("AttachmentObject");
                    uploadedImages.clear();
                    uploadedImages.putAll(images);

                    if(homeWorkData!= null && homeWorkData.getAttachments() != null) {
                        Log.v("NoTiFiCation ","attachmentsize "+homeWorkData.getAttachments().size());
                        homeWorkData.getAttachments().clear();
                        ArrayList<AttachmentDetails> attachmentDetails  = meth(data);
                        Log.v("Attachment "," array"+attachmentDetails);
                        homeWorkData.getAttachments().addAll(attachmentDetails);
                    }

                    attachmentsTextView.setText(String.valueOf(uploadedImages.size()) + " attachments");
                }
                break;
        }
    }

    public ArrayList<AttachmentDetails> meth(Intent data) {
        HashMap<String, String> images = (HashMap<String, String>) data.getSerializableExtra("AttachmentObject");
        ArrayList<AttachmentDetails> attachmentDetails = new ArrayList<>();
        for (String key : images.keySet()) {
            AttachmentDetails attachmentDetail = new AttachmentDetails();
            attachmentDetail.setId(key);
            attachmentDetail.setName(images.get(key));
            attachmentDetails.add(attachmentDetail);
        }
        return attachmentDetails;

    }

    @Override
    protected void onPause() {
        super.onPause();
        if (toast != null)
            toast.cancel();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (toast != null)
            toast.cancel();
    }

    public void subjectList(ArrayList<Subject> selectedSubjectList) {
        try {
            subjectArray = new JSONArray();
            if(selectedSubjectList.size() !=0) {
                for (int i = 0; i < (selectedSubjectList.size() - 1); i++) {
                    JSONObject subjectObject = new JSONObject();
                    subjectObject.put("id", selectedSubjectList.get(i).getSubjectId());
                    subjectObject.put("name", selectedSubjectList.get(i).getSubName());
                    subjectArray.put(subjectObject);
                }
                JSONObject subjectObject = new JSONObject();
                subjectObject.put("id", selectedSubjectList.get(selectedSubjectList.size() - 1).getSubjectId());
                subjectObject.put("name", selectedSubjectList.get(selectedSubjectList.size() - 1).getSubName());
                subjectArray.put(subjectObject);
                JSONObject mainObject = new JSONObject();
                mainObject.put("subjects",subjectArray);
                Log.v("Subject","Array"+subjectArray);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void selectedSubjectName(ArrayList<Subject> selectedSubjectList) {
        String subjectNames = "";

        if(selectedSubjectList.size() !=0) {
            for (int i = 0; i < (selectedSubjectList.size() - 1); i++)
                subjectNames += selectedSubjectList.get(i).getSubName() + ",";

            subjectNames += selectedSubjectList.get(selectedSubjectList.size() - 1).getSubName() + ".";
        }
        subjectTextView.setText(subjectNames);
    }
}
