package nexrise.publication.in.nexrise.EventsFeature;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import nexrise.publication.in.nexrise.BeanClass.Event;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link EventsFeatureListFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link EventsFeatureListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class EventsFeatureListFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private OnFragmentInteractionListener mListener;
    View view;
    Timer timer;
    StringUtils stringUtils;
    public static boolean rendered = false;
    EventsFeatureArrayAdapter arrayAdapter;
    TextView noContent;
    RelativeLayout progressBarLayout;


    public EventsFeatureListFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment EventsFeatureListFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static EventsFeatureListFragment newInstance(String param1, String param2) {
        EventsFeatureListFragment fragment = new EventsFeatureListFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
        stringUtils = StringUtils.getInstance();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view =  inflater.inflate(R.layout.fragment_events_feature_list, container, false);
        progressBarLayout = (RelativeLayout) view.findViewById(R.id.progress_bar);
        noContent = (TextView) view.findViewById(R.id.no_content);
        final Handler handler = new Handler();
        timer = new Timer();
        TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Integer notificationCount = MessageReceivingService.notificationCount.get(CREATE_EVENT);
                            if (notificationCount != null && notificationCount != 0) {
                                final SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
                                String username = preferences.getString(CURRENT_USERNAME, null);
                                String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username;
                                renderData(url);
                                MessageReceivingService.notificationCount.put(CREATE_EVENT, 0);
                            }
                        } catch (NullPointerException e) {
                            noContent.setVisibility(View.VISIBLE);
                            e.printStackTrace();
                        }
                    }
                });
            }
        };
        timer.schedule(timerTask, 200, 3500);
        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if(view != null && !rendered) {
            final SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
            String username = preferences.getString(CURRENT_USERNAME, null);
            String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username;
            renderData(url);
            rendered = true;
        }
    }

    public void renderData(String url) {
        final ListView listView = (ListView)view.findViewById(R.id.events_feature_listview);
        if(getActivity() != null) {
            /*final SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
            String username = preferences.getString(CURRENT_USERNAME, null);
            String url = BASE_URL + API_VERSION_ONE + EVENTS + ALL + username;*/
            Log.v("Event", "url" + url);

            GETUrlConnection getAllEvents = new GETUrlConnection(getActivity(), url,null) {

                ProgressBar progressBar = (ProgressBar) view.findViewById(R.id.loading_bar);


                @Override
                protected void onPreExecute() {
                    super.onPreExecute();
                    progressBarLayout.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.VISIBLE);
                    if (noContent.getVisibility() == View.VISIBLE)
                        noContent.setVisibility(View.INVISIBLE);
                }

                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    Log.v("All ", "Events response " + response);
                    progressBar.setVisibility(View.INVISIBLE);
                    try {
                        new StringUtils().checkSession(response);
                        progressBarLayout.setVisibility(View.GONE);
                        JSONObject jsonObject = new JSONObject(response);
                        JSONObject data = jsonObject.getJSONObject(DATA);

                        JSONArray myEventsAry = data.getJSONArray("myEvents");
                        List<Event> myEvents = parseEvents(myEventsAry, "MY EVENTS");

                        JSONArray todayEvents = data.getJSONArray("today");
                        List<Event> day = parseEvents(todayEvents, "DAY");

                        JSONArray weekEvents = data.getJSONArray("week");
                        List<Event> week = parseEvents(weekEvents, "WEEK");

                        List<JSONObject> jsonObjectList = new ArrayList<>();
                        JSONArray latestEvent = data.getJSONArray("latest");

                        for (int i = 0; i < latestEvent.length(); i++) {
                            jsonObjectList.add(latestEvent.getJSONObject(i));
                        }
                        Collections.sort(jsonObjectList, new LatestEventsComparator());
                        List<Event> monthEvents = parseLatestEvents(jsonObjectList);
                        myEvents.addAll(day);
                        myEvents.addAll(week);
                        myEvents.addAll(monthEvents);

                        if (myEvents.size() != 0) {
                            arrayAdapter = new EventsFeatureArrayAdapter(getActivity(), myEvents, EventsFeatureListFragment.this);
                            listView.setAdapter(arrayAdapter);
                            Log.v("array2","adapter2 "+arrayAdapter.getCount());
                            listviewClick(listView);
                        } else {
                            throw new NullPointerException("No events");
                        }
                    } catch (JSONException | NullPointerException e) {
                        e.printStackTrace();
                        listView.setAdapter(null);
                        if (progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() == View.INVISIBLE)
                            progressBarLayout.setVisibility(View.VISIBLE);
                        noContent.setVisibility(View.VISIBLE);
                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    }
                }
            };
            getAllEvents.execute();
        }
    }

    public List<Event> parseEvents(JSONArray jsonArray, String tag) throws JSONException, NullPointerException {

        List<Event> events = new ArrayList<>();
        List<JSONObject> jsonObjectList = new ArrayList<>();
        for (int i=0; i<jsonArray.length(); i++) {
            jsonObjectList.add(jsonArray.getJSONObject(i));
        }
        Collections.sort(jsonObjectList, new LatestEventsComparator());
        for (int i=0; i<jsonObjectList.size(); i++) {
            JSONObject json = jsonObjectList.get(i);
            Event event = addEventObject(json);

            if(i == 0) {
                event.setTag(tag);
            } else {
                event.setTag(null);
            }
            events.add(event);
        }
        return events;
    }

    public List<Event> parseLatestEvents(List<JSONObject> jsonObjects) throws JSONException, NullPointerException {
        List<Event> eventList = new ArrayList<>();
        int index = 0;

        if(jsonObjects.size() != 0) {
            JSONObject jsonObject = jsonObjects.get(0);
            Event event = addEventObject(jsonObject);
            event.setTag(monthFormatter(jsonObject.getString("month")));
            eventList.add(event);
        }
        for (int i=1; i<jsonObjects.size(); i++) {
            if(jsonObjects.get(index).getString("month").equals(jsonObjects.get(i).getString("month"))) {
                JSONObject jsonObject = jsonObjects.get(i);
                Event event = addEventObject(jsonObject);
                event.setTag(null);
                eventList.add(event);
                ++index;
            } else {
                JSONObject jsonObject = jsonObjects.get(i);
                Event event = addEventObject(jsonObject);
                event.setTag(monthFormatter(jsonObject.getString("month")));
                eventList.add(event);
                ++index;
            }
        }
        return eventList;
    }

    private Event addEventObject(JSONObject jsonObject) throws JSONException{
        Event event = new Event();
        event.setId(jsonObject.getString("eventId"));
        event.setName(jsonObject.getString("eventName"));
        event.setTypeName(jsonObject.getString("eventTypeName"));
        event.setTypeId(jsonObject.getString("eventTypeId"));
        if(jsonObject.has("activityTypeId"))
            event.setActivityTypeId(jsonObject.getString("activityTypeId"));
        if(jsonObject.has("activityTypeName"))
            event.setActivityTypeName(jsonObject.getString("activityTypeName"));
        event.setStartDate(jsonObject.getString("startDate"));
        event.setEndDate(jsonObject.getString("endDate"));
        event.setStartTime(jsonObject.getString("startTime"));
        event.setEndTime(jsonObject.getString("endTime"));
        event.setDescription(jsonObject.getString("eventDesc"));
        event.setMonth(jsonObject.getString("month"));
        event.setDate(jsonObject.getString("date"));

        return event;
    }

    private String monthFormatter(String month) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MMM");
        Date date = null;
        try {
            date = simpleDateFormat.parse(month);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        SimpleDateFormat postFormatter = new SimpleDateFormat("MMMM");
        String formattedDate = postFormatter.format(date);
        return formattedDate;
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

    public void listviewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                if((!EventsFeatureFragment.clicked) && (!EventsFeatureActivity.clicked)) {
                    Event eventsFeature = (Event) listView.getItemAtPosition(position);
                    Intent intent = new Intent(getActivity(), EventDetailsActivity.class);
                    intent.putExtra("Actionbar title", "Event Details");
                    intent.putExtra("EventsFeature", eventsFeature);
                    startActivity(intent);
                }
            }
        });
    }

    public void search(String text){
        if(arrayAdapter != null) {
            progressBarLayout.setVisibility(View.GONE);
            arrayAdapter.getFilter().filter(text);
            Log.v("array3", "adapter3 " + arrayAdapter.getCount());
        }
    }

    public void displayNothingToShow() {
        if (progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() == View.INVISIBLE)
            progressBarLayout.setVisibility(View.VISIBLE);
        noContent.setVisibility(View.VISIBLE);
    }

    private class LatestEventsComparator implements Comparator<JSONObject> {

        @Override
        public int compare(JSONObject o1, JSONObject o2) {
            Date date1 = null;
            Date date2 = null;
            try {
                String date1Str =  o1.getString("startDate");
                String date2Str = o2.getString("startDate");
                StringUtils stringUtils = StringUtils.getInstance();
                date1 = stringUtils.convertStringToDate(new StringUtils().Dateset(date1Str));
                date2 = stringUtils.convertStringToDate(new StringUtils().Dateset(date2Str));

            } catch (JSONException e) {
                e.printStackTrace();
            }
            assert date1 != null;
            return date1.compareTo(date2);
        }
    }
}
