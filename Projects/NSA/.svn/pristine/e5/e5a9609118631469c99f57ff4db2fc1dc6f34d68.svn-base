package nexrise.publication.in.nexrise.EventsFeature;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.annotation.RequiresApi;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.SearchView;
import android.widget.TextView;

import com.roomorama.caldroid.CaldroidFragment;
import com.roomorama.caldroid.CaldroidListener;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import nexrise.publication.in.nexrise.BeanClass.EventDate;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

public class EventsFeatureActivity extends AppCompatActivity implements Constants {
    ArrayList<EventDate> calendarList;
    CaldroidFragment caldroidFragment;

    public static Boolean clicked = false;
    public static boolean dataRendered = false;
    StringUtils stringUtils;
    String userRole;
    private EventsFeatureFragment.OnFragmentInteractionListener mListener;
    LinearLayout pastEvents;
    LinearLayout addEvents;
    LinearLayout eventTab;
    RelativeLayout whiteback;
    FloatingActionButton pastEventsFab;
    FloatingActionButton addEventsFab;
    ImageButton list;
    ImageButton grid;
    TextView pastEventText;
    LinearLayout allActivities;
    LinearLayout firstLayout;
    LinearLayout secondLayout;
    LinearLayout thirdLayout;
    LinearLayout fourthLayout;
    int normalColor;
    int selectedColor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fragment_events_feature);
        init();
        eventFeatureList();
        setAppColor();
        allActivities.setBackgroundColor(selectedColor);
        footerClickHandler();

        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(R.string.activities);
            actionBar.setElevation(0);
        }
        if (userRole.equals(EMPLOYEE)) {
            pastEvents.setVisibility(View.INVISIBLE);
            addEvents.setVisibility(View.INVISIBLE);
        } else {
            pastEvents.setVisibility(View.VISIBLE);
            pastEventText.setTextColor(Color.BLACK);
            addEvents.setVisibility(View.GONE);
            eventTab.setVisibility(View.GONE);
        }
        buttonClick();
        customTooltip();
    }

    private void init() {
        stringUtils = StringUtils.getInstance();
        userRole = stringUtils.getUserRole(this);
        allActivities = (LinearLayout)findViewById(R.id.all_activiies_footer);
        firstLayout = (LinearLayout)findViewById(R.id.first_footer);
        secondLayout = (LinearLayout)findViewById(R.id.second_footer);
        thirdLayout = (LinearLayout)findViewById(R.id.third_footer);
        fourthLayout = (LinearLayout)findViewById(R.id.fourth_footer);
        normalColor = this.getResources().getColor(R.color.appColor);
        selectedColor = this.getResources().getColor(R.color.appColorTransparent);
        pastEvents = (LinearLayout)findViewById(R.id.past_events_with_text);
        pastEventText = (TextView)findViewById(R.id.past_event_textview);
        addEvents = (LinearLayout)findViewById(R.id.add_events_with_text);
        eventTab = (LinearLayout)findViewById(R.id.more_events_with_text);
        whiteback = (RelativeLayout)findViewById(R.id.whiteback);
        pastEventsFab = (FloatingActionButton) findViewById(R.id.past_events);
        addEventsFab = (FloatingActionButton) findViewById(R.id.add_events);
    }

    public void customTooltip(){

        final ImageView help = (ImageView)findViewById(R.id.help);
        if (userRole.equals(EMPLOYEE)){
            stringUtils.customTooltip(this,help, (String) getResources().getText(R.string.emp_event));
        } else{
            stringUtils.customTooltip(this,help,(String) getResources().getText(R.string.parent_event));
        }
    }

    public void buttonClick(){
        list = (ImageButton)findViewById(R.id.imageButton);
        grid = (ImageButton)findViewById(R.id.imageButton2);
        final int appColor = getResources().getColor(R.color.appColor);
        final int colorWhite = getResources().getColor(R.color.colorWhite);

        list.setColorFilter(appColor);
        grid.setColorFilter(colorWhite);
        list.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
            @Override
            public void onClick(View v) {
                if(!clicked) {
                    eventFeatureList();

                    list.setColorFilter(appColor);
                    grid.setColorFilter(colorWhite);
                    setAppColor();
                    allActivities.setBackgroundColor(selectedColor);
                }
            }
        });

        grid.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!clicked) {
                    list.setColorFilter(colorWhite);
                    grid.setColorFilter(appColor);
                    renderData();
                    setAppColor();
                    allActivities.setBackgroundColor(selectedColor);
                }
            }
        });

        FloatingActionButton actionButton = (FloatingActionButton)findViewById(R.id.fab_events_feature);
        // clicked = true;
        if(userRole.equals(EMPLOYEE)){
            actionButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    whiteback.setVisibility(View.VISIBLE);

                    if(userRole.equals(EMPLOYEE)){
                        floatingActionButtonTeacher();
                    }
                }
            });
        } else
            pastEventsFab.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    //   whiteback.setVisibility(View.VISIBLE);
                    Intent intent = new Intent(EventsFeatureActivity.this, PastEventsActivity.class);
                    startActivity(intent);
                }
            });
    }

    private void setAppColor() {
        allActivities.setBackgroundColor(normalColor);
        firstLayout.setBackgroundColor(normalColor);
        secondLayout.setBackgroundColor(normalColor);
        thirdLayout.setBackgroundColor(normalColor);
        fourthLayout.setBackgroundColor(normalColor);
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.actionbar, menu);
        final MenuItem menuItem = menu.findItem(R.id.searchbar);
        final android.widget.SearchView searchView = (android.widget.SearchView) menuItem.getActionView();
        SearchManager searchManager = (SearchManager)getSystemService(Context.SEARCH_SERVICE);
        if(searchManager != null) {
            searchView.setSearchableInfo(searchManager.getSearchableInfo(getComponentName()));
        }
        Utility.searchViewHandler(searchView,menuItem);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                EventsFeatureListFragment eventsListFragment = (EventsFeatureListFragment)getSupportFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                if(eventsListFragment!= null && eventsListFragment.isVisible())
                    eventsListFragment.search(newText);

                return true;
            }
        });
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                if(clicked) {
                    floatingActionButtonTeacher();
                } else
                    finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        if(clicked)
            floatingActionButtonTeacher();
        else
            finish();
    }

    private void renderData(){
        Date dated= new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(dated);
        int month = cal.get(Calendar.MONTH);
        int year = cal.get(Calendar.YEAR);
        Log.v("Current","month"+month);
        Log.v("Current","year"+year);
        caldroidFragment = new CaldroidFragment();
        final Bundle args = new Bundle();
        caldroidFragment.setArguments(args);
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        EventsFeatureListFragment.rendered = false;
        transaction.replace(R.id.events_feature_frame, caldroidFragment, "CaldroidFragment");
        transaction.commit();
        calendarData(month,year);

        final CaldroidListener listener = new CaldroidListener() {

            @Override
            public void onSelectDate(Date date, View view) {
                // Do something
            }

            @Override
            public void onCaldroidViewCreated() {
                // Supply your own adapter to weekdayGridView (SUN, MON, etc)
                caldroidFragment.setEnableSwipe(false);
                if(caldroidFragment.isEnableSwipe()){

                }
                Button leftButton = caldroidFragment.getLeftArrowButton();
                Button rightButton = caldroidFragment.getRightArrowButton();
                leftButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if(!clicked) {
                            caldroidFragment.prevMonth();
                            calendarData(caldroidFragment.getMonth() - 1, caldroidFragment.getYear());
                        }
                    }

                });
                rightButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Log.v("Clicked","Right Arrow");
                        if(!clicked) {
                            calendarData(3, 2017);
                            caldroidFragment.nextMonth();
                            calendarData(caldroidFragment.getMonth() - 1, caldroidFragment.getYear());
                        }
                    }
                });
                // Do customization here
            }
        };
        caldroidFragment.setCaldroidListener(listener);
    }


    public void calendarData (int month,int year){
        String calendarCredential = BASE_URL + API_VERSION_ONE + EVENTS + MONTH + YEAR +"?monthNo="+month+"&year="+year;
        Log.v("calendar","Url"+calendarCredential);
        GETUrlConnection calendarUrl = new GETUrlConnection(this,calendarCredential,null){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Calendar","response"+response);
                try {
                    stringUtils.checkSession(response);
                    JSONObject mainObject = new JSONObject(response);
                    JSONArray dataArray = mainObject.getJSONArray(DATA);
                    ObjectMapper mapper = new ObjectMapper();
                    mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                    calendarList = mapper.readValue(dataArray.toString(), TypeFactory.collectionType(List.class, EventDate.class));
                    if (calendarList!= null){
                        Log.v("Class","List"+calendarList);
                        eventDate(calendarList);
                    }
                } catch (JSONException | NullPointerException | IOException e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(EventsFeatureActivity.this);
                }
            }
        };
        calendarUrl.execute();
    }

    private void footerClickHandler() {

        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        final String username = preferences.getString(CURRENT_USERNAME, null);

        allActivities.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(!clicked && checkFragmentVisibility()) {
                    EventsFeatureListFragment fragment = (EventsFeatureListFragment) getSupportFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                    String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username;
                    fragment.renderData(url);
                    setTitle(R.string.all_activities_caps);
                    setAppColor();
                    allActivities.setBackgroundColor(selectedColor);
                }
            }
        });

        firstLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!clicked && checkFragmentVisibility()) {
                    EventsFeatureListFragment fragment = (EventsFeatureListFragment) getSupportFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                    String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username + "/" +ACTIVITY + "/" + "73700598-8fa5-4c68-a445-9c4c24e1151c";
                    fragment.renderData(url);
                    setTitle(R.string.events_caps);

                    setAppColor();
                    firstLayout.setBackgroundColor(selectedColor);
                }
            }
        });

        secondLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!clicked && checkFragmentVisibility()) {
                    EventsFeatureListFragment fragment = (EventsFeatureListFragment) getSupportFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                    String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username + "/" + ACTIVITY + "/" + "96e2e795-5677-4bec-b50d-9958abddde94";
                    fragment.renderData(url);
                    setTitle(R.string.competitions);

                    setAppColor();
                    secondLayout.setBackgroundColor(selectedColor);
                }
            }
        });

        thirdLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!clicked && checkFragmentVisibility()) {
                    EventsFeatureListFragment fragment = (EventsFeatureListFragment) getSupportFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                    String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username + "/" + ACTIVITY + "/" + "189648ab-5831-48f9-ad84-a919338fd941";
                    fragment.renderData(url);
                    setTitle(R.string.extra_curricular);

                    setAppColor();
                    thirdLayout.setBackgroundColor(selectedColor);
                }
            }
        });

        fourthLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!clicked && checkFragmentVisibility()) {
                    EventsFeatureListFragment fragment = (EventsFeatureListFragment) getSupportFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                    String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username + "/" + ACTIVITY + "/" + "05f66738-919e-46e4-8dca-4a041c133da0";
                    fragment.renderData(url);
                    setTitle(R.string.subject_enrichment);

                    setAppColor();
                    fourthLayout.setBackgroundColor(selectedColor);
                }
            }
        });
    }

    public boolean checkFragmentVisibility() {
        Fragment fragment = getSupportFragmentManager().findFragmentByTag("EventsFeatureListFragment");
        return (fragment != null && fragment.isVisible());
    }

    private void setTitle(String title) {
        TextView textView = (TextView)findViewById(R.id.textView16);
        textView.setText(title);
    }

    public void eventDate(ArrayList<EventDate> event){
        HashMap<Date, Drawable> map = new HashMap<Date, Drawable>();
        Drawable absent = getResources().getDrawable(R.color.eventColor);
        Drawable currentDay = getResources().getDrawable(R.color.buttonColor);
        Date date = new Date();
        map.put(date, currentDay);

        ArrayList<Date> dates = new ArrayList<>();
        Set<Date> map1 = new HashSet<>();
        for (int i = 0; i < event.size(); i++) {
            try {
                Date fromdate = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH).parse(stringUtils.dateSeperate(event.get(i).getStart()));
                Log.v("Fromdate", "dsa" + event.get(i).getStart());
                Date todate = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH).parse(stringUtils.dateSeperate(event.get(i).getEnd()));
                Calendar start = Calendar.getInstance();
                start.setTime(fromdate);
                Calendar end = Calendar.getInstance();
                end.setTime(todate);

                while(!start.after(end)) {
                    dates.add(start.getTime());
                    Log.v("Range ","dates "+start.getTime());
                    dates.add(start.getTime());
                    start.add(Calendar.DATE, 1);
                }
                map1.addAll(dates);
                dates.clear();
                dates.addAll(map1);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        for (int j=0;j<dates.size();j++){
            map.put(dates.get(j),absent);
            dateClick();
        }
        caldroidFragment.setBackgroundDrawableForDates(map);
        caldroidFragment.refreshView();
    }

    public void dateClick(){

        caldroidFragment.setCaldroidListener(new CaldroidListener() {
            @Override
            public void onSelectDate(Date date, View view) {
                if(!clicked) {
                    caldroidFragment.clearSelectedDates();
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    String selectedDate = dateFormat.format(date);
                    caldroidFragment.setSelectedDate(date);
                    caldroidFragment.refreshView();
                    caldroidFragment.clearSelectedDates();
                    Log.v("selected", "Date " + selectedDate);

                    Intent intent = new Intent(EventsFeatureActivity.this, PastEventsActivity.class);
                    intent.putExtra("selected", selectedDate);
                    intent.putExtra("Date", true);
                    intent.putExtra("From", "EventList");
                    startActivity(intent);
                }
            }
        });
    }


    public void floatingActionButtonTeacher(){

        if(!clicked) {
            pastEvents.setVisibility(View.VISIBLE);
            //addEvents.setVisibility(View.VISIBLE);
            addEventFabVisible();
            pastEventsFab.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    clicked = false;
                    Intent intent = new Intent(EventsFeatureActivity.this, PastEventsActivity.class);
                    pastEvents.setVisibility(View.INVISIBLE);
                    addEvents.setVisibility(View.INVISIBLE);
                    whiteback.setVisibility(View.GONE);
                    startActivity(intent);
                }
            });

            addEventsFab.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    clicked = false;
                    Intent intent = new Intent(EventsFeatureActivity.this, AddEventActivity.class);
                    pastEvents.setVisibility(View.INVISIBLE);
                    addEvents.setVisibility(View.INVISIBLE);
                    whiteback.setVisibility(View.GONE);
                    startActivity(intent);
                }
            });
            clicked = true;
        } else {
            clicked = false;
            pastEvents.setVisibility(View.INVISIBLE);
            // addEvents.setVisibility(View.INVISIBLE);
            addEventsFabInvisible();
            whiteback.setVisibility(View.GONE);
        }
    }

    private void addEventFabVisible() {
        String permission = stringUtils.getPermission(this, "create_events");
        if(permission.contains("manage") || permission.contains("manageAll"))
            addEvents.setVisibility(View.VISIBLE);
        else
            addEvents.setVisibility(View.GONE);
    }

    private void addEventsFabInvisible() {
        String permission = stringUtils.getPermission(this, "create_events");
        if(permission.contains("manage") || permission.contains("manageAll"))
            addEvents.setVisibility(View.INVISIBLE);
    }

    @Override
    public void onResume() {
        super.onResume();
        if (!dataRendered) {
            setTitle(R.string.all_activities_caps);
            setAppColor();
            allActivities.setBackgroundColor(selectedColor);
        }
    }

    public void eventFeatureList(){
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        EventsFeatureListFragment.rendered = false;
        transaction.replace(R.id.events_feature_frame, new EventsFeatureListFragment(), "EventsFeatureListFragment");
        transaction.commit();
        dataRendered = true;
    }
}
