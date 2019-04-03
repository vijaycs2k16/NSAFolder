package nexrise.publication.in.nexrise.EventsFeature;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.annotation.RequiresApi;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.roomorama.caldroid.CaldroidFragment;
import com.roomorama.caldroid.CaldroidListener;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.json.JSONArray;
import org.json.JSONObject;

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
import java.util.Timer;
import java.util.TimerTask;

import nexrise.publication.in.nexrise.BeanClass.EventDate;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.NavigationDrawerActivity;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link EventsFeatureFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link EventsFeatureFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class EventsFeatureFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    ArrayList<EventDate> calendarList;
    CaldroidFragment caldroidFragment;

    public static Boolean clicked = false;
    public static boolean dataRendered = false;
    StringUtils stringUtils;
    String userRole;
    private OnFragmentInteractionListener mListener;
    LinearLayout pastEvents;
    LinearLayout addEvents;
    LinearLayout eventTab;
    RelativeLayout whiteback;
    FloatingActionButton pastEventsFab;
    FloatingActionButton addEventsFab;
    View view;
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

    public EventsFeatureFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment EventsFeatureFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static EventsFeatureFragment newInstance(String param1, String param2) {
        EventsFeatureFragment fragment = new EventsFeatureFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        stringUtils = StringUtils.getInstance();
        userRole = stringUtils.getUserRole(getActivity());
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        super.onSaveInstanceState(savedInstanceState);
        view = inflater.inflate(R.layout.fragment_events_feature, container, false);
        init(view);
        eventFeatureList();

        /*FragmentTransaction transaction = getFragmentManager().beginTransaction();
        EventsFeatureListFragment.rendered = false;
        transaction.replace(R.id.events_feature_frame, new EventsFeatureListFragment(), "EventsFeatureListFragment");
        transaction.commit();
        //dataRendered = true;*/
        setAppColor();
        allActivities.setBackgroundColor(selectedColor);
        footerClickHandler();

        if (userRole.equals(EMPLOYEE)) {
            pastEvents.setVisibility(View.INVISIBLE);
            addEvents.setVisibility(View.INVISIBLE);
        } else {
            pastEvents.setVisibility(View.VISIBLE);
            pastEventText.setTextColor(Color.BLACK);
            addEvents.setVisibility(View.GONE);
            eventTab.setVisibility(View.GONE);
        }
        buttonClick(view);
        customTooltip(view);
        return view;
    }

    private void init(View view) {
        stringUtils = StringUtils.getInstance();
        userRole = stringUtils.getUserRole(getActivity());
        allActivities = (LinearLayout)view.findViewById(R.id.all_activiies_footer);
        firstLayout = (LinearLayout)view.findViewById(R.id.first_footer);
        secondLayout = (LinearLayout)view.findViewById(R.id.second_footer);
        thirdLayout = (LinearLayout)view.findViewById(R.id.third_footer);
        fourthLayout = (LinearLayout)view.findViewById(R.id.fourth_footer);
        normalColor = getActivity().getResources().getColor(R.color.appColor);
        selectedColor = getActivity().getResources().getColor(R.color.appColorTransparent);
        pastEvents = (LinearLayout)view.findViewById(R.id.past_events_with_text);
        pastEventText = (TextView)view.findViewById(R.id.past_event_textview);
        addEvents = (LinearLayout)view.findViewById(R.id.add_events_with_text);
        eventTab = (LinearLayout)view.findViewById(R.id.more_events_with_text);
        whiteback = (RelativeLayout)view.findViewById(R.id.whiteback);
        pastEventsFab = (FloatingActionButton)view.findViewById(R.id.past_events);
        addEventsFab = (FloatingActionButton)view.findViewById(R.id.add_events);
    }

    @Override
    public void setMenuVisibility(boolean menuVisible) {
        super.setMenuVisibility(menuVisible);
        if(menuVisible) {
            final NavigationDrawerActivity parentActivity = (NavigationDrawerActivity) getActivity();

            if(parentActivity != null) {
                MessageReceivingService.notificationCount.put(CREATE_EVENT, 0);
                parentActivity.setNotificationCount();
            } else {
                Timer timer = new Timer();
                final TimerTask timerTask = new TimerTask() {
                    @Override
                    public void run() {
                        if(parentActivity != null) {
                            MessageReceivingService.notificationCount.put(CREATE_EVENT, 0);
                            parentActivity.setNotificationCount();
                            this.cancel();
                        }
                    }
                };
                timer.schedule(timerTask, 100);
                timerTask.run();
            }
        }
    }

    private void setAppColor() {
        allActivities.setBackgroundColor(normalColor);
        firstLayout.setBackgroundColor(normalColor);
        secondLayout.setBackgroundColor(normalColor);
        thirdLayout.setBackgroundColor(normalColor);
        fourthLayout.setBackgroundColor(normalColor);
    }

    public void customTooltip(View view){

        final ImageView help = (ImageView)view.findViewById(R.id.help);
        if (userRole.equals(EMPLOYEE)){
            stringUtils.customTooltip(getActivity(),help, (String) getResources().getText(R.string.emp_event));
        } else{
            stringUtils.customTooltip(getActivity(),help,(String) getResources().getText(R.string.parent_event));
        }
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }

    public void buttonClick(final View view){
        list = (ImageButton)view.findViewById(R.id.imageButton);
        grid = (ImageButton)view.findViewById(R.id.imageButton2);
        final int appColor = getResources().getColor(R.color.appColor);
        final int colorWhite = getResources().getColor(R.color.colorWhite);

        list.setColorFilter(appColor);
        grid.setColorFilter(colorWhite);
        list.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
            @Override
            public void onClick(View v) {
                if(!clicked) {
                    FragmentTransaction transaction = getFragmentManager().beginTransaction();
                    EventsFeatureListFragment.rendered = false;
                    transaction.replace(R.id.events_feature_frame, new EventsFeatureListFragment(), "EventsFeatureListFragment");
                    transaction.commit();

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

        FloatingActionButton actionButton = (FloatingActionButton)view.findViewById(R.id.fab_events_feature);
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
                    Intent intent = new Intent(getActivity(), PastEventsActivity.class);
                    startActivity(intent);
                }
            });
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
        FragmentTransaction transaction = getFragmentManager().beginTransaction();
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
        GETUrlConnection calendarUrl = new GETUrlConnection(getActivity(),calendarCredential,null){
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
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
        calendarUrl.execute();
    }

    private void footerClickHandler() {

        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        final String username = preferences.getString(CURRENT_USERNAME, null);

        allActivities.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(!clicked && checkFragmentVisibility()) {
                    EventsFeatureListFragment fragment = (EventsFeatureListFragment) getFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                    String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username;
                    fragment.renderData(url);
                    setTitle((String) getResources().getText(R.string.all_activities_caps));
                    setAppColor();
                    allActivities.setBackgroundColor(selectedColor);
                }
            }
        });

        firstLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!clicked && checkFragmentVisibility()) {
                    EventsFeatureListFragment fragment = (EventsFeatureListFragment) getFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                    String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username + "/" +ACTIVITY + "/" + "73700598-8fa5-4c68-a445-9c4c24e1151c";
                    fragment.renderData(url);
                    setTitle((String) getResources().getText(R.string.events_caps));

                    setAppColor();
                    firstLayout.setBackgroundColor(selectedColor);
                }
            }
        });

        secondLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!clicked && checkFragmentVisibility()) {
                    EventsFeatureListFragment fragment = (EventsFeatureListFragment) getFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                    String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username + "/" + ACTIVITY + "/" + "96e2e795-5677-4bec-b50d-9958abddde94";
                    fragment.renderData(url);
                    setTitle((String) getResources().getText(R.string.competitions));

                    setAppColor();
                    secondLayout.setBackgroundColor(selectedColor);
                }
            }
        });

        thirdLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!clicked && checkFragmentVisibility()) {
                    EventsFeatureListFragment fragment = (EventsFeatureListFragment) getFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                    String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username + "/" + ACTIVITY + "/" + "189648ab-5831-48f9-ad84-a919338fd941";
                    fragment.renderData(url);
                    setTitle((String) getResources().getText(R.string.extra_curricular));

                    setAppColor();
                    thirdLayout.setBackgroundColor(selectedColor);
                }
            }
        });

        fourthLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!clicked && checkFragmentVisibility()) {
                    EventsFeatureListFragment fragment = (EventsFeatureListFragment) getFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                    String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username + "/" + ACTIVITY + "/" + "05f66738-919e-46e4-8dca-4a041c133da0";
                    fragment.renderData(url);
                    setTitle((String) getResources().getText(R.string.subject_enrichment));

                    setAppColor();
                    fourthLayout.setBackgroundColor(selectedColor);
                }
            }
        });
    }

    public boolean checkFragmentVisibility() {
        Fragment fragment = getFragmentManager().findFragmentByTag("EventsFeatureListFragment");
        return (fragment != null && fragment.isVisible());
    }

    private void setTitle(String title) {
        TextView textView = (TextView)view.findViewById(R.id.textView16);
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

                    Intent intent = new Intent(getActivity(), PastEventsActivity.class);
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
                    Intent intent = new Intent(getActivity(), PastEventsActivity.class);
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
                    Intent intent = new Intent(getActivity(), AddEventActivity.class);
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
        String permission = stringUtils.getPermission(getActivity(), "create_events");
        if(permission.contains("manage") || permission.contains("manageAll"))
            addEvents.setVisibility(View.VISIBLE);
        else
            addEvents.setVisibility(View.GONE);
    }

    private void addEventsFabInvisible() {
        String permission = stringUtils.getPermission(getActivity(), "create_events");
        if(permission.contains("manage") || permission.contains("manageAll"))
            addEvents.setVisibility(View.INVISIBLE);
    }

    @Override
    public void onResume() {
        super.onResume();

        if (!dataRendered) {
            Fragment fragment = getFragmentManager().findFragmentByTag("EventsFeatureListFragment");
            if(fragment != null && fragment.isVisible()) {
                setTitle("ALL ACTIVITIES");
                setAppColor();
                allActivities.setBackgroundColor(selectedColor);
            }
        }
    }
    public void eventFeatureList(){
        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        EventsFeatureListFragment.rendered = false;
        transaction.replace(R.id.events_feature_frame, new EventsFeatureListFragment(), "EventsFeatureListFragment");
        transaction.commit();
        dataRendered = true;
    }
}