package nexrise.publication.in.nexrise.EventsFeature;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import nexrise.publication.in.nexrise.BeanClass.Attendee;
import nexrise.publication.in.nexrise.BeanClass.Event;
import nexrise.publication.in.nexrise.BeanClass.PastEventObject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.ViewNotesActivity;
import nexrise.publication.in.nexrise.TransportManager.TransportMapActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

import static android.view.View.GONE;

public class EventDetailsActivity extends AppCompatActivity implements Constants{
    SharedPreferences preferences;
    StringUtils stringUtils;
    HashMap<String, String> attachments = new HashMap<String, String>();
    String id = "";
    String userRole;
    TextView title;
    TextView startDate;
    TextView endDate;
    TextView duration;
    TextView mapLocationTxtVw;
    TextView schoolLocation;
    TextView category;
    TextView teacherName;
    TextView attendees;
    WebView description;
    TextView activityType;
    LinearLayout activityTypeLayout;
    Button register;
    Button decline;
    LinearLayout schoolLocationLayout;
    LinearLayout attendeesLayout;
    LinearLayout buttonLayout;
    LinearLayout mapLocationLayout;
    TextView mandatoryText;
    Toast toast;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_details);
        stringUtils = StringUtils.getInstance();
        ActionBar actionBar = getSupportActionBar();
        preferences = PreferenceManager.getDefaultSharedPreferences(EventDetailsActivity.this);
        final Intent intent = getIntent();
        String actionBarTitle = intent.getStringExtra(ACTIONBAR_TITLE);

        userRole = stringUtils.getUserRole(this);
        title = (TextView)findViewById(R.id.title_value);
        startDate = (TextView)findViewById(R.id.start_date_value);
        endDate = (TextView)findViewById(R.id.end_date_value);
        duration = (TextView)findViewById(R.id.time_value);
        mapLocationTxtVw = (TextView)findViewById(R.id.location_value);
        schoolLocation = (TextView) findViewById(R.id.school_location_value);
        category = (TextView)findViewById(R.id.category_value);
        teacherName = (TextView)findViewById(R.id.teacher_name_value);
        activityTypeLayout = (LinearLayout)findViewById(R.id.activity_type_layout);
        activityType = (TextView)findViewById(R.id.activity_value);
        attendees = (TextView)findViewById(R.id.attendees_value);
        description = (WebView) findViewById(R.id.long_description);
        register = (Button) findViewById(R.id.setvisible);
        decline = (Button) findViewById(R.id.decline);
        schoolLocationLayout = (LinearLayout)findViewById(R.id.school_location);
        mapLocationLayout = (LinearLayout)findViewById(R.id.location);
        attendeesLayout = (LinearLayout)findViewById(R.id.attendees_layout);
        mandatoryText = (TextView)findViewById(R.id.mandatory);

        if(actionBar!= null) {
            actionBar.setTitle(actionBarTitle);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        if(intent.hasExtra(FROM)) {
            String pastEvent = getIntent().getStringExtra(FROM);
            if(pastEvent.equals("pastEvent")) {
                register.setVisibility(GONE);
                decline.setVisibility(GONE);
            }
        } else {
            register.setVisibility(View.VISIBLE);
        }

        buttonLayout = (LinearLayout) findViewById(R.id.buttonvisibility);
        if (actionBarTitle.equals(PAST_EVENT_DETAILS))
            buttonLayout.setVisibility(GONE);

        if(intent.hasExtra("EventsFeature")) {
            Event event = (Event)intent.getSerializableExtra("EventsFeature");
            id = event.getId();
            renderData();
            Log.v("Id",""+id);
        } else if(intent.hasExtra("PastObject")) {
            PastEventObject event = (PastEventObject)intent.getSerializableExtra("PastObject");
            id = event.getEventId();
            renderData();
            Log.v("Id",""+id);
        } else if(intent.hasExtra("Id")) {
            id = intent.getStringExtra("Id");
            renderData();
        }


    }

    public void renderData() {
        String url = BASE_URL + API_VERSION_ONE + EVENTS + DETAILS + id;
        Log.v("Detail","Url"+url);
        GETUrlConnection getEvent = new GETUrlConnection(this, url,null) {
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.loading_bar);
            ScrollView eventDetailsLayout = (ScrollView)findViewById(R.id.activity_event_details);
            TextView noContent = (TextView)findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                eventDetailsLayout.setVisibility(View.INVISIBLE);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(final String response) {
                super.onPostExecute(response);
                Log.v("Event ","details "+response);
                progressBar.setVisibility(View.INVISIBLE);
                try {
                    stringUtils.checkSession(response);
                    JSONObject responseObj = new JSONObject(response);
                    eventDetailsLayout.setVisibility(View.VISIBLE);
                    JSONObject dataObj = responseObj.getJSONObject(DATA);
                    JSONObject eventObj = dataObj.getJSONObject("events");
                    Object attachment = eventObj.get("attachments");
                    if(!attachment.toString().equals("null")) {
                        JSONArray attachArray = eventObj.getJSONArray("attachments");
                        for (int j=0;j<attachArray.length();j++) {
                            JSONObject attachObject = attachArray.getJSONObject(j);
                            String imageUrl = attachObject.getString("id");
                            String fileName = attachObject.getString("name");
                            attachments.put(imageUrl,fileName);
                        }
                    }
                    String desc = eventObj.getString("eventDesc");
                    setLocation(eventObj);
                    attachmentClickHandler();

                    ArrayList<Attendee> attendeeList = eventsParser(dataObj.getJSONArray("eventDetails"));
                    JSONArray eventDetails = dataObj.getJSONArray("eventDetails");
                    for (int j=0;j<eventDetails.length();j++){
                        JSONObject eventDetailsObject = eventDetails.getJSONObject(j);
                        Boolean mandatory = eventDetailsObject.getBoolean("is_mandatory");
                        if (mandatory) {
                            register.setText(R.string.accept);
                            mandatoryText.setVisibility(View.VISIBLE);
                        } else {
                            register.setText(R.string.register);
                        }
                    }
                    String event_id = getObject(attendeeList);

                    String userName = eventObj.getString("updatedBy");
                    if (userName.equals(preferences.getString(CURRENT_USERNAME,null)))
                        buttonLayout.setVisibility(GONE);

                    String startTime = eventObj.getString("startTime");
                    String endTime = eventObj.getString("endTime");
                    title.setText(eventObj.getString("eventName"));
                    startDate.setText(eventObj.getString("startDate"));
                    endDate.setText(eventObj.getString("endDate"));
                    duration.setText(stringUtils.time12HrFormat(startTime)+ " - " +stringUtils.time12HrFormat(endTime));
                    teacherName.setText(eventObj.getString("updatedUserName"));
                    if(userRole.equals(EMPLOYEE))
                        attendees.setText(String.valueOf(eventDetails.length()));
                    else
                        attendeesLayout.setVisibility(GONE);

                    if(eventObj.has("activityTypeName"))
                        activityType.setText(eventObj.getString("activityTypeName"));
                    else
                        activityTypeLayout.setVisibility(GONE);

                    category.setText(eventObj.getString("eventTypeName"));
                    attendeesClickHandler();
                    JSONObject jsonObject = postJson(true);
                    if(desc != null && !desc.isEmpty()) {
                        String htmlText = "<html><body style=\"text-align:justify\"> %s </body></Html>";
                        WebView webview = (WebView) findViewById(R.id.long_description);
                        webview.loadData(String.format(htmlText, desc), "text/html", "utf-8");
                    }
                    else
                        description.setVisibility(GONE);
                    acceptOrDecline(register, decline, event_id);
                    Date eventEndDate = stringUtils.convertStringToDate(eventObj.getString("endDate"));
                    Date today = stringUtils.today();
                    if(eventEndDate.before(today))
                        buttonLayout.setVisibility(GONE);
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                    if(eventDetailsLayout.getVisibility() == View.VISIBLE)
                        eventDetailsLayout.setVisibility(View.INVISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(EventDetailsActivity.this);
                }
            }
        };
        getEvent.execute();
    }

    void setLocation(JSONObject eventObj) throws JSONException, NullPointerException {
        StringBuilder builder = new StringBuilder();
        Object venue = eventObj.get("venues");
        String mapLocation = eventObj.getString("mapLocation");
        if(venue!= null && !venue.toString().equals("null")) {
            JSONArray venueArray = eventObj.getJSONArray("venues");
            for (int i = 0; i < venueArray.length(); i++) {
                JSONObject venueObj = venueArray.getJSONObject(i);
                builder.append(venueObj.getString("name")).append("  ");
            }
            schoolLocation.setText(builder.toString());
        } else {
            schoolLocationLayout.setVisibility(GONE);
        }
        // User may select both school location and map location in order to display both we have put an if condition instead of else if condition
        if(mapLocation != null && !mapLocation.equals("null") && !mapLocation.isEmpty()) {
            mapLocationTxtVw.setText(mapLocation);
            Double latitude = eventObj.getDouble("latitude");
            Double longitude = eventObj.getDouble("longitude");
            mapLocationClickHandler(latitude, longitude, mapLocation);
        } else {
            mapLocationLayout.setVisibility(GONE);
        }
    }

    public void attachmentClickHandler() {
        if(attachments.size() != 0) {
            LinearLayout attachLayout = (LinearLayout) findViewById(R.id.attach_layout);
            attachLayout.setVisibility(View.VISIBLE);
            TextView attachNumber = (TextView) findViewById(R.id.attach_value);
            attachNumber.setText(String.valueOf(attachments.size()));
            attachLayout.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent attach = new Intent(EventDetailsActivity.this, ViewNotesActivity.class);
                    attach.putExtra(UPLOADED_IMAGES, attachments);
                    attach.putExtra(FROM, "Events");
                    startActivity(attach);
                }
            });
        }
    }

    public void mapLocationClickHandler(final Double latitude, final Double longitude, final String address) {

        mapLocationLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(EventDetailsActivity.this, TransportMapActivity.class);
                intent.putExtra(FROM_ACTIVITY, "EventDetailsActivity");
                intent.putExtra("Latitude", latitude);
                intent.putExtra("Longitude", longitude);
                intent.putExtra("Address", address);
                startActivity(intent);
            }
        });
    }

    public void acceptOrDecline(final Button register, Button decline, String event_id) {
        final String registerCrendential = BASE_URL + API_VERSION_ONE + EVENTS + DETAILS + event_id  ;
        Log.v("register","Credential"+registerCrendential);
        register.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                UPDATEUrlConnection registerUrl = new UPDATEUrlConnection(EventDetailsActivity.this,registerCrendential,null,postJson(true)){
                    @Override
                    protected void onPostExecute(String response) {
                        super.onPostExecute(response);
                            if (response != null) {
                                try {
                                    new StringUtils().checkSession(response);
                                    if (register.getText().equals("Register")) {
                                        if (toast != null)
                                            toast.cancel();
                                        toast = Toast.makeText(EventDetailsActivity.this, R.string.registered_successfully, Toast.LENGTH_LONG);
                                        toast.show();
                                        finish();
                                    } else {
                                        if (toast != null)
                                            toast.cancel();
                                        toast = Toast.makeText(EventDetailsActivity.this, R.string.accept_this_event, Toast.LENGTH_LONG);
                                        toast.show();
                                        finish();
                                    }
                                } catch (SessionExpiredException e) {
                                    e.handleException(EventDetailsActivity.this);
                                }
                            }
                    }
                };
                registerUrl.execute();
            }
        });

        decline.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                UPDATEUrlConnection declineUrl = new UPDATEUrlConnection(EventDetailsActivity.this,registerCrendential,null,postJson(false)){
                    @Override
                    protected void onPostExecute(String response) {
                        super.onPostExecute(response);
                            if (response != null) {
                                try {
                                    new StringUtils().checkSession(response);
                                    Toast.makeText(EventDetailsActivity.this, R.string.declined_this_event, Toast.LENGTH_LONG).show();
                                    finish();
                                } catch (SessionExpiredException e) {
                                    e.handleException(EventDetailsActivity.this);
                                }
                            } else {
                                Toast.makeText(EventDetailsActivity.this, R.string.cant_declined, Toast.LENGTH_LONG).show();
                            }
                    }
                };
                declineUrl.execute();
            }
        });
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                Intent intent = new Intent();
                setResult(RESULT_CANCELED, intent);
                onBackPressed();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void attendeesClickHandler() {
        LinearLayout attendeesLayout = (LinearLayout)findViewById(R.id.attendees_layout);
        attendeesLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent attendeesList = new Intent(EventDetailsActivity.this, AttendeesListActivity.class);
                attendeesList.putExtra("Attendees", id);
                startActivity(attendeesList);
            }
        });
    }

    private ArrayList<Attendee> eventsParser(JSONArray jsonArray) throws JSONException, NullPointerException {
        ArrayList<Attendee> eventDetails = new ArrayList<>();

        for (int i=0; i<jsonArray.length(); i++) {
            Attendee details = new Attendee();
            JSONObject eventObject = jsonArray.getJSONObject(i);
            details.setUserName(eventObject.getString("user_name"));
            details.setEvent_detail_id(eventObject.getString("event_detail_id"));
            details.setFirstName(eventObject.getString("first_name"));
            details.setClassId(eventObject.getString("class_id"));
            details.setClassName(eventObject.getString("class_name"));
            details.setSectionId(eventObject.getString("section_id"));
            details.setSectionName(eventObject.getString("section_name"));
            details.setMandatory(eventObject.getBoolean("is_mandatory"));
            Log.v("is_registered","data"+eventObject.getString("is_registered"));
            if(!eventObject.getString("is_registered").equalsIgnoreCase("null"))
            details.setRegistered(Boolean.valueOf(eventObject.getString("is_registered")));
            eventDetails.add(details);
        }
        return eventDetails;
    }

    public String getObject(ArrayList<Attendee> event){
        String event_id = "";
        Boolean is_registered;
        Boolean is_mandatory ;
        String userName = preferences.getString(CURRENT_USERNAME,null);
        for (Attendee attendee : event) {
            if (attendee.getUserName().equals(userName)) {
                String values = Utility.readProperty(this, DISABLE_BUTTONS);
                if (values.contains(ACCESS_ID))
                    buttonLayout.setVisibility(View.GONE);
                else
                    buttonLayout.setVisibility(View.VISIBLE);
                event_id =  attendee.getEvent_detail_id();
                is_registered = attendee.getRegistered();
                is_mandatory = attendee.getMandatory();
                Log.v("Is_ registered",""+is_registered);
                if(attendee.getRegistered() !=null) {
                    if (is_registered) {
                        if (is_mandatory) {
                            register.setText(R.string.accept);
                        } else {
                            register.setText(R.string.registered);
                        }
                        register.setEnabled(false);
                    } else if (!is_registered) {
                        decline.setText(R.string.decline);
                        decline.setEnabled(false);
                    }
                } else {
                    decline.setText(R.string.decline);
                }
                break;
            }
        }
        return event_id;
    }

    public JSONObject postJson(Boolean value){
        JSONObject mainObject = new JSONObject();
        try {
            mainObject.put("isRegistered",value);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return mainObject;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (toast!=null)
            toast.cancel();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (toast!=null)
            toast.cancel();
    }
}
