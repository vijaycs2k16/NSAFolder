package nexrise.publication.in.nexrise.EventsFeature;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.Switch;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import nexrise.publication.in.nexrise.Attendence.EventTypeAdapter;
import nexrise.publication.in.nexrise.BeanClass.EventType;
import nexrise.publication.in.nexrise.BeanClass.FeatureChannel;
import nexrise.publication.in.nexrise.BeanClass.Student;
import nexrise.publication.in.nexrise.BeanClass.Venue;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.AttachmentActivity;
import nexrise.publication.in.nexrise.Taxanomy.TaxonomyActivity;
import nexrise.publication.in.nexrise.TimetableFeature.ViewNotesActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;


public class AddEventActivity extends AppCompatActivity implements Constants {
    JSONObject taxanomyObject;
    JSONObject elasticObject;
    CheckBox sms;
    CheckBox push;
    CheckBox email;
    FeatureChannel featureChannel;
    String eventDescription = "Enter description";
    ArrayList<Student> selectedStudents = new ArrayList<Student>();
    String startDate = null;
    String endDate = null;
    ArrayList<Venue> venues = new ArrayList<>();
    EditText eventName;
    String eventTypeName;
    String eventTypeId;
    String activityTypeName;
    String activityTypeId;
    JSONArray venueArray = new JSONArray();
    JSONArray attendeesArray = new JSONArray();
    SharedPreferences preferences;
    String uuid;
    HashMap<String, String> uploadedImages = new HashMap<>();
    String attachmentCount = "";
    JSONArray attachmentsAry = new JSONArray();
    ArrayList<EventType> eventTypeArrayList = new ArrayList<>();
    ArrayList<EventType> activityList = new ArrayList<>();
    Double latitude = null;
    Double longitude = null;
    String address = null;

    TextView attendees;
    TextView classes;

    final int DURATION = 10;
    final int LOCATION = 14;
    final int TAXANOMY = 100;
    final int ATTENDEES = 16;
    final int ATTACHMENT = 15;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_event);
        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        uuid = UUID.randomUUID().toString();
        LocationActivity.venues.clear();

        ActionBar actionBar = getSupportActionBar();
        renderActivityType();

        String eventTypeCredential = BASE_URL + API_VERSION_ONE +EVENTS + TYPES;
        GETUrlConnection eventTypeUrl = new GETUrlConnection(AddEventActivity.this,eventTypeCredential,null){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("event","Type"+response);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject mainObject = new JSONObject(response);
                    JSONArray dataArray = mainObject.getJSONArray(DATA);

                    if (dataArray.length() !=0){
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                        eventTypeArrayList = mapper.readValue(dataArray.toString(), TypeFactory.collectionType(List.class,EventType.class));
                        eventTypeSpinner(eventTypeArrayList);
                    } else {
                        eventTypeSpinner(eventTypeArrayList);
                    }
                } catch (JSONException |IOException | NullPointerException e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(AddEventActivity.this);
                }
            }
        };
        commonChannel();
        setMandatoryFields();
        eventTypeUrl.execute();

        attendees = (TextView)findViewById(R.id.students_value);
        classes = (TextView)findViewById(R.id.classes);
        eventName = (EditText)findViewById(R.id.event_name);

        if(actionBar!= null) {
            actionBar.setTitle(R.string.create_activities);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        buttonClick();
    }

    private void setMandatoryFields() {
        TextView activityType = (TextView)findViewById(R.id.activity_type);
        String type = "Activity type";
        String colored = " *";
        SpannableStringBuilder spanBuilder = new SpannableStringBuilder();
        spanBuilder.append(type);
        int spanStart = spanBuilder.length();
        spanBuilder.append(colored);
        int spanEnd = spanBuilder.length();
        spanBuilder.setSpan(new ForegroundColorSpan(Color.RED), spanStart, spanEnd,
                Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        activityType.setText(spanBuilder);

        TextView textView = (TextView)findViewById(R.id.duration);
        String simple = "Duration";

        SpannableStringBuilder builder = new SpannableStringBuilder();
        builder.append(simple);
        int start = builder.length();
        builder.append(colored);
        int end = builder.length();
        builder.setSpan(new ForegroundColorSpan(Color.RED), start, end,
                Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        textView.setText(builder);
        TextView textLocation = (TextView)findViewById(R.id.location);
        String location = "Location";
        SpannableStringBuilder builder1 = new SpannableStringBuilder();
        builder1.append(location);
        int start1 = builder1.length();
        builder1.append(colored);
        int end1 = builder1.length();
        builder1.setSpan(new ForegroundColorSpan(Color.RED),start1,end1,
                Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        textLocation.setText(builder1);
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
    }

    protected void commonChannel() {
        String eventChannelCredential = BASE_URL + API_VERSION_ONE + FEATURE ;
        BasicHeader[] header = new StringUtils().headers(AddEventActivity.this,CREATE_EVENT);
        GETUrlConnection getUrlConnection = new GETUrlConnection(AddEventActivity.this, eventChannelCredential,header){

            @Override
            protected void onPostExecute(String response){
                super.onPostExecute(response);
                Log.v("channel","channel "+response);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject mainObject = new JSONObject(response);
                    JSONObject data = mainObject.getJSONObject(DATA);
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                    featureChannel = objectMapper.readValue(data.toString(),FeatureChannel.class);
                    LinearLayout linearLayout = (LinearLayout)findViewById(R.id.channel);
                    linearLayout.setVisibility(View.VISIBLE);
                    sms = (CheckBox)findViewById(R.id.smscheck);
                    push = (CheckBox)findViewById(R.id.pushcheck);
                    email = (CheckBox)findViewById(R.id.emailcheck);
                    if(featureChannel.getSms().equals(true))
                        sms.setVisibility(View.VISIBLE);
                    if(featureChannel.getPush().equals(true))
                        push.setVisibility(View.VISIBLE);
                    if(featureChannel.getEmail().equals(true))
                        email.setVisibility(View.VISIBLE);
                } catch (JSONException | IOException | NullPointerException e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(AddEventActivity.this);
                }
            }
        };
        getUrlConnection.execute();
    }

    private void renderActivityType() {
        String eventTypeCredential = BASE_URL + API_VERSION_ONE +EVENTS + ACTIVITY;
        GETUrlConnection getActivityType = new GETUrlConnection(AddEventActivity.this,eventTypeCredential,null) {
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("activity ","Type"+response);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject mainObject = new JSONObject(response);
                    JSONArray dataArray = mainObject.getJSONArray(DATA);

                    if (dataArray.length() !=0){
                        for (int i=0; i<dataArray.length(); i++) {
                            JSONObject dataObj = dataArray.getJSONObject(i);
                            EventType activityType = new EventType();
                            activityType.setEvent_type_id(dataObj.getString("activity_type_id"));
                            activityType.setEvent_type_name(dataObj.getString("activity_type_name"));
                            activityList.add(activityType);
                        }
                        activityTypeSpinner(activityList);
                    } else {
                        activityTypeSpinner(activityList);
                    }
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(AddEventActivity.this);
                }
            }
        };
        getActivityType.execute();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.add_homework_actionbar, menu);
        return super.onCreateOptionsMenu(menu);
    }

    public void eventTypeSpinner(ArrayList<EventType> eventTypes){
        Spinner spinner = (Spinner) findViewById(R.id.typespin);
        // By default none will be displayed in the spinner
        EventType none = new EventType();
        none.setEvent_type_name("None");
        eventTypes.add(0, none);
        EventTypeAdapter eventTypeAdapter = new EventTypeAdapter(AddEventActivity.this,eventTypes);
        spinner.setAdapter(eventTypeAdapter);
        spinnerClickListener(spinner);
    }

    private void activityTypeSpinner(ArrayList<EventType> activityTypes) {
        Spinner spinner = (Spinner) findViewById(R.id.activity_type_spin);
        // By default none will be displayed in the spinner
        EventType none = new EventType();
        none.setEvent_type_name("None");
        activityTypes.add(0, none);
        EventTypeAdapter eventTypeAdapter = new EventTypeAdapter(AddEventActivity.this,activityTypes);
        spinner.setAdapter(eventTypeAdapter);
        activitySpinnerClickListener(spinner);
    }

    private void activitySpinnerClickListener(final Spinner spinner) {
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                EventType eventType = (EventType) spinner.getItemAtPosition(position);
                activityTypeId = eventType.getEvent_type_id();
                activityTypeName = eventType.getEvent_type_name();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                spinner.setSelection(0);
            }
        });
    }

    public void spinnerClickListener(final Spinner spinner) {
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                EventType eventType = (EventType) spinner.getItemAtPosition(position);
                eventTypeId = eventType.getEvent_type_id();
                eventTypeName = eventType.getEvent_type_name();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                spinner.setSelection(0);
            }
        });
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                preferences.edit().putString(TAXANOMY_SELECTION, null).apply();
                onBackPressed();
                break;
            case R.id.tick:
                String event = eventName.getText().toString();
                JSONObject json = new JSONObject();
                StringUtils stringUtils = new StringUtils();

                if(!event.isEmpty() && (startDate!= null && endDate!= null) && (sms.isChecked() || push.isChecked() || email.isChecked()) && (!venues.isEmpty() || latitude != null) && activityTypeId != null && activityTypeName != null) {
                    try {
                        if ((taxanomyObject!= null && taxanomyObject.getJSONArray("selectedNodes").length() != 0)|| attendeesArray.length()!=0) {
                            json.put("eventName", event);
                            json.put("eventTypeName", eventTypeName);
                            json.put("eventTypeId", eventTypeId);
                            json.put("activityTypeName", activityTypeName);
                            json.put("activityTypeId", activityTypeId);
                            json.putOpt("venue", venueArray);
                            json.put("latitude", latitude);
                            json.put("longitude", longitude);
                            json.put("mapLocation", address);
                            String date = stringUtils.DisplayDate(startDate) + " - " + stringUtils.DisplayDate(endDate);
                            json.put("date", date);

                            String startTime = stringUtils.durationTime(startDate);
                            String endTime = stringUtils.durationTime(endDate);
                            json.put("startTime", startTime);
                            json.put("endTime", endTime);

                            if(elasticObject == null)
                                json.put("classes", new JSONArray());
                            else
                                json.put("classes", elasticObject.getJSONArray("classes"));

                            if(attachmentsAry.length() != uploadedImages.size())
                                createAssignmentArray();
                            json.putOpt("attachments", attachmentsAry);

                            if (taxanomyObject == null) {
                                JSONObject notifyTo = new JSONObject().put("status", "Sent");
                                json.put("notifyTo", notifyTo);
                            } else {
                                JSONObject notifyTo = taxanomyObject.getJSONObject("notifyTo").put("status", "Sent");
                                Log.v("taxt object","single "+ taxanomyObject);
                                if (taxanomyObject.getJSONArray("users").length() != 0)
                                    json.putOpt("users", taxanomyObject.getJSONArray("users"));
                                json.putOpt("taxanomy", taxanomyObject.getJSONArray("taxanomy"));
                                json.putOpt("selectedNodes", taxanomyObject.getJSONArray("selectedNodes"));
                                json.put("notifyTo", notifyTo);
                            }

                            eventDescription = eventDescription.equals("Enter description") ? "": eventDescription;
                            json.put("desc", eventDescription);
                            Switch mandatory = (Switch) findViewById(R.id.mandatory);
                            json.put("isMandatory", mandatory.isChecked());

                            JSONObject notify = new JSONObject();
                            notify.put("sms", sms.isChecked());
                            notify.put("push", push.isChecked());
                            notify.put("email", email.isChecked());

                            json.putOpt("notify", notify);
                            json.putOpt("students", attendeesArray);
                            Log.v("Formed ", "json " + json);
                            CreateEvent(json);
                        } else {
                            Toast toast = Toast.makeText(this, R.string.class_student_select, Toast.LENGTH_SHORT);
                            toast.setGravity(Gravity.CENTER_VERTICAL, 0, 130);
                            toast.show();
                        }
                    } catch (JSONException | NullPointerException e) {
                        e.printStackTrace();
                        Toast toast = Toast.makeText(this, R.string.could_not_create_event, Toast.LENGTH_SHORT);
                        toast.setGravity(Gravity.CENTER_VERTICAL, 0, 130);
                        toast.show();
                    }
                } else
                    Toast.makeText(this, R.string.fill_mandatory_fields, Toast.LENGTH_SHORT).show();

                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void CreateEvent(JSONObject json) {
        String postEventCredential = BASE_URL + API_VERSION_ONE + EVENTS ;
        Log.v("Post","Url"+postEventCredential);
        BasicHeader[] headers = new StringUtils().headers(AddEventActivity.this, CREATE_EVENT);
        POSTUrlConnection postEvent = new POSTUrlConnection(json,postEventCredential, headers, AddEventActivity.this){
            ProgressDialog  dialog = new ProgressDialog(AddEventActivity.this);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                dialog.setMessage(getResources().getText(R.string.creating_event));
                dialog.setCanceledOnTouchOutside(false);
                dialog.setCancelable(false);
                dialog.setProgress(ProgressDialog.STYLE_SPINNER);
                dialog.show();
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Create event ","response "+response);
                dialog.dismiss();
                if (response!=null){
                    try {
                        new StringUtils().checkSession(response);
                        Toast.makeText(AddEventActivity.this, R.string.event_create_success, Toast.LENGTH_SHORT).show();
                        preferences.edit().putString(TAXANOMY_SELECTION, null).apply();
                        EventsFeatureFragment.dataRendered = false;
                        EventsFeatureListFragment.rendered = false;
                        EventsFeatureActivity.dataRendered = false;
                        finish();
                    } catch (SessionExpiredException e) {
                        e.handleException(AddEventActivity.this);
                    }
                } else {
                    Toast.makeText(AddEventActivity.this, R.string.event_not_success, Toast.LENGTH_SHORT).show();
                }
            }
        };
        postEvent.execute();
    }

    public void buttonClick() {
        LinearLayout duration = (LinearLayout) findViewById(R.id.duration_layout);
        duration.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AddEventActivity.this, DurationActivity.class);
                startActivityForResult(intent, DURATION);
            }
        });

        LinearLayout location = (LinearLayout)findViewById(R.id.location_layout);
        location.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AddEventActivity.this, LocationActivity.class);
                intent.putExtra("Selected location", venues);
                startActivityForResult(intent, LOCATION);
            }
        });

        LinearLayout addDescription = (LinearLayout)findViewById(R.id.description_layout);
        addDescription.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder enterDescriptionBuilder = new AlertDialog.Builder(AddEventActivity.this);
                LayoutInflater layoutInflater = getLayoutInflater();
                final View descriptionDialogView = layoutInflater.inflate(R.layout.enter_description_dialog, null);
                enterDescriptionBuilder.setView(descriptionDialogView);
                EditText enteredText = (EditText)descriptionDialogView.findViewById(R.id.enter_descripition);
                if(!eventDescription.equals("Enter description"))
                    enteredText.setText(eventDescription);
                enterDescriptionBuilder.setTitle("Enter Description");

                enterDescriptionBuilder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(final DialogInterface dialog, int which) {
                        TextView description = (TextView)findViewById(R.id.add_description_value);
                        EditText enteredText = (EditText)descriptionDialogView.findViewById(R.id.enter_descripition);
                        eventDescription = String.valueOf(enteredText.getText());
                        description.setText(eventDescription);
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

        LinearLayout classes = (LinearLayout)findViewById(R.id.attendees_layout);
        classes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AddEventActivity.this, TaxonomyActivity.class);
                intent.putExtra(FROM,"Event Fragment");
                startActivityForResult(intent, TAXANOMY);
            }
        });

        LinearLayout attendees = (LinearLayout)findViewById(R.id.students_layout);
        attendees.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent attendees = new Intent(AddEventActivity.this, AttendeesActivity.class);
                attendees.putExtra("Selected students", selectedStudents);
                startActivityForResult(attendees, ATTENDEES);
            }
        });
        LinearLayout attachment = (LinearLayout)findViewById(R.id.attachment_layout);
        attachment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String url = BASE_URL + API_VERSION_ONE + UPLOAD + "/";
                HashMap<String, String> uploadBody = new HashMap<String, String>();
                uploadBody.put("uploadId", uuid);

                if(uploadedImages == null || uploadedImages.size() == 0) {
                    Intent attachmentActivity = new Intent(AddEventActivity.this, AttachmentActivity.class);
                    attachmentActivity.putExtra(JSON, uploadBody);
                    attachmentActivity.putExtra(URL, url);
                    attachmentActivity.putExtra(ID, CREATE_EVENT);
                    attachmentActivity.putExtra(UPLOAD_ID, uuid);
                    startActivityForResult(attachmentActivity, ATTACHMENT);
                } else {
                    Intent viewNotes = new Intent(AddEventActivity.this, ViewNotesActivity.class);
                    viewNotes.putExtra(UPLOADED_IMAGES, uploadedImages);
                    viewNotes.putExtra(JSON, uploadBody);
                    viewNotes.putExtra(URL, url);
                    viewNotes.putExtra(ID, CREATE_EVENT);
                    viewNotes.putExtra(UPLOAD_ID, uuid);
                    startActivityForResult(viewNotes, ATTACHMENT);
                }
            }
        });
    }
    @Override
    public void onBackPressed() {
        super.onBackPressed();
        preferences.edit().putString(TAXANOMY_SELECTION, null).apply();
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
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case 1:
                onBackPressed();
                break;

            case DURATION:
                startDate = data.getStringExtra("Start date");
                endDate = data.getStringExtra("End date");
                if (startDate != null && endDate != null) {
                    TextView duration = (TextView) findViewById(R.id.duration_value);
                    duration.setText(startDate + "\n" + endDate);
                }
                break;

            case LOCATION:
                if(resultCode == RESULT_OK) {
                    venueArray = new JSONArray();
                    venues = (ArrayList<Venue>) data.getSerializableExtra("Our school");
                    double lat = data.getDoubleExtra("Lattitude", 0);
                    double lng = data.getDoubleExtra("Longitude", 0);
                    if(lat != 0.0 && lng != 0.0 ) {
                        latitude = data.getDoubleExtra("Lattitude", 0);
                        longitude = data.getDoubleExtra("Longitude", 0);
                    }
                    address = data.getStringExtra("Address");
                    Log.v("AddressAdd",""+address);
                    Log.v("result", "result " + venues);
                    TextView textView = (TextView) findViewById(R.id.location_value);
                    String venue = "";
                    String words = "";
                    for (int i = 0; i < venues.size(); i++) {
                        JSONObject venueObj = new JSONObject();
                        try {
                            venueObj.put("id", venues.get(i).getVenue_type_id());
                            venueObj.put("name", venues.get(i).getVenue_type_name());
                            venueArray.put(venueObj);
                            Log.v("full","object "+venueArray);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        venue += venues.get(i).getVenue_type_name() + " ";
                    }
                    words+= venue + "\n"+address;
                    Log.v("full","adress"+words);
                    textView.setText(words);
                } else {
                    venues.clear();
                    LocationActivity.venues.clear();
                    Log.v("result ","canceld "+venues);
                }
                break;

            case TAXANOMY:
                if(resultCode == RESULT_OK) {
                    String taxanomyJson = data.getStringExtra("Taxanomy json");
                    String esQuery = data.getStringExtra("ES query");
                    try {
                        taxanomyObject = new JSONObject(taxanomyJson);
                        elasticObject = new JSONObject(esQuery);
                        JSONArray selectedNodes = taxanomyObject.getJSONArray("selectedNodes");
                        classes.setText(""+selectedNodes.length()+ "selected");
                        Log.v("selected", "Nodes :" + selectedNodes.length());
                        Log.v("Selected values", " " + taxanomyObject);
                    } catch (JSONException e) {
                        e.printStackTrace();
                        classes.setText("Not Selected");
                    }
                } else {
                    taxanomyObject = null;
                    elasticObject = null;
                    classes.setText("Not Selected");
                }
                break;

            case ATTENDEES:
                if(resultCode == RESULT_OK) {
                    selectedStudents = (ArrayList<Student>) data.getSerializableExtra("SelectedList");
                    try {
                        attendeesArray = new JSONArray(data.getStringExtra("AttendeesArray"));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    if (selectedStudents.size() != 0)
                        attendees.setText(""+selectedStudents.size()+ "Selected");
                    else
                        attendees.setText("Not Selected");
                } else {
                    attendees.setText("Not Selected");
                }
                break;

            case ATTACHMENT:
                TextView attachment = (TextView)findViewById(R.id.attachment_value);
                if(data != null && resultCode == RESULT_OK) {
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
                    attachmentCount = String.valueOf(uploadedImages.size());
                    attachment.setText(attachmentCount + " attachments");
                }
                break;
        }
    }
}
