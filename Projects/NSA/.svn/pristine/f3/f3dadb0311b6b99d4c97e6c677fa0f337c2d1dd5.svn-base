package nexrise.publication.in.nexrise;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.roomorama.caldroid.CaldroidFragment;
import com.roomorama.caldroid.CaldroidListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import nexrise.publication.in.nexrise.BeanClass.ClassAndSection;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.EventsFeature.EventDetailsActivity;
import nexrise.publication.in.nexrise.ExamFeature.ExamActivity;
import nexrise.publication.in.nexrise.ExamFeature.ExamDetailsActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OverviewFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link OverviewFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class OverviewFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    String username;
    ListView listView;
    List<nexrise.publication.in.nexrise.BeanClass.Calendar> calendarList;
    OverviewArrayAdapter arrayAdapter;
    StringUtils utils;
    SharedPreferences preferences;

    private OnFragmentInteractionListener mListener;

    public OverviewFragment() {
        // Required empty public constructor

    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment OverviewFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static OverviewFragment newInstance(String param1, String param2) {
        OverviewFragment fragment = new OverviewFragment();
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
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        final View view = inflater.inflate(R.layout.overview_fragment, container, false);
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        username = preferences.getString(CURRENT_USERNAME, null);
        listView = (ListView)view.findViewById(R.id.activity_result);
        calendarList = new ArrayList<>();
        utils = new StringUtils();

        Calendar calendar = Calendar.getInstance();
        final int month = calendar.get(Calendar.MONTH);
        final int year = calendar.get(Calendar.YEAR);

        final CaldroidFragment caldroidFragment = new CaldroidFragment();
        Bundle args = new Bundle();
        caldroidFragment.setArguments(args);
        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        transaction.replace(R.id.calendarabs, caldroidFragment, "Calendar");
        transaction.commit();

        final CaldroidListener listener =  new CaldroidListener() {
            @Override
            public void onCaldroidViewCreated() {
                super.onCaldroidViewCreated();
                caldroidFragment.setEnableSwipe(false);
                Button leftArrow = caldroidFragment.getLeftArrowButton();
                Button rightArrow = caldroidFragment.getRightArrowButton();
                renderData(view, month, year, caldroidFragment);
                leftArrow.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        caldroidFragment.prevMonth();
                        renderData(view, caldroidFragment.getMonth() - 1, caldroidFragment.getYear(), caldroidFragment);
                        Log.v("Current ","Moonth " + caldroidFragment.getMonth());
                        Log.v("Current ","Year "+ caldroidFragment.getYear());
                    }
                });
                rightArrow.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        caldroidFragment.nextMonth();
                        renderData(view, caldroidFragment.getMonth() - 1, caldroidFragment.getYear(), caldroidFragment);
                        Log.v("Current ","Moonth " + caldroidFragment.getMonth());
                        Log.v("Current ","Year "+ caldroidFragment.getYear());
                    }
                });
            }

            @Override
            public void onSelectDate(Date date, View dateView) {
                Log.v("Date "," "+date);
                if(arrayAdapter != null) {
                    List<nexrise.publication.in.nexrise.BeanClass.Calendar> filteredList = new ArrayList<>();
                    Log.v("Calender List ","Size "+calendarList.size());
                    for (int i=0; i<calendarList.size(); i++) {
                        nexrise.publication.in.nexrise.BeanClass.Calendar activities = calendarList.get(i);
                        Date startdate = utils.schoolsActivityDate(utils.dateSeperate(activities.getStartDate()));
                        Date endDate = utils.schoolsActivityDate(utils.dateSeperate(activities.getEndDate()));
                        String[] splittedDate = date.toString().split("\\s");
                        String selectedDate = splittedDate[1] +" "+ splittedDate[2];

                        if(startdate != null && endDate != null) {
                            if (startdate.equals(endDate) && startdate.toString().contains(selectedDate)) {
                                filteredList.add(calendarList.get(i));
                            } else {
                                Calendar activityStartDate = Calendar.getInstance();
                                activityStartDate.setTime(startdate);
                                Calendar activityEndDate = Calendar.getInstance();
                                activityEndDate.setTime(endDate);

                                while (!activityStartDate.after(activityEndDate)) {
                                    if (activityStartDate.getTime().toString().contains(selectedDate))
                                        filteredList.add(calendarList.get(i));
                                    activityStartDate.add(Calendar.DATE, 1);
                                }
                            }
                        }
                    }
                    if(filteredList.size() != 0) {
                        RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
                        progressBarLayout.setVisibility(View.GONE);
                        arrayAdapter = new OverviewArrayAdapter(getActivity(), 0, filteredList);
                        listView.setAdapter(arrayAdapter);
                    } else {
                        RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
                        ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
                        TextView noContent = (TextView)view.findViewById(R.id.no_content);
                        if(progressBarLayout.getVisibility() == View.GONE)
                            progressBarLayout.setVisibility(View.VISIBLE);
                        noContent.setVisibility(View.VISIBLE);
                        listView.setAdapter(null);
                    }
                }
            }
        };
        caldroidFragment.setCaldroidListener(listener);

        return  view;
    }

    private void renderData(final View view, int month, int year, final CaldroidFragment caldroidFragment) {
        String url = BASE_URL + API_VERSION_ONE + DASHBOARD + EVENTS + username + "?monthNo="+ month + "&year=" + year;

        if(utils.getUserRole(getActivity()).equalsIgnoreCase(PARENT)) {
            String classId = preferences.getString(CLASS_ID, null);
            String sectionId = preferences.getString(SECTION_ID, null);
            url = BASE_URL + API_VERSION_ONE + DASHBOARD + CALENDAR + STUDENT + "/" + "?monthNo=" + month + "&year=" + year + PARAMETER_SEP + CLASS_ID + PARAMETER_EQUALS + classId + PARAMETER_SEP + SECTION_ID + PARAMETER_EQUALS + sectionId;
        }
        Log.v("OVerview ","url "+url);
        GETUrlConnection getSchoolActivities = new GETUrlConnection(getActivity(), url, null) {
            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.GONE);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                progressBarLayout.setVisibility(View.GONE);
                progressBar.setVisibility(View.GONE);
                Log.v("ACTIVITIES "," "+response);

                try {
                    utils.checkSession(response);
                    calendarList = new ArrayList<>();
                    JSONObject json = new JSONObject(response);
                    JSONObject dataObj = json.getJSONObject(DATA);
                    HashMap<Date, Drawable> datesAndColors  = new HashMap<>();

                    JSONArray examAry = dataObj.getJSONArray("exams");
                    datesAndColors = parseActivities(examAry, datesAndColors);
                    JSONArray eventsAry = dataObj.getJSONArray("events");
                    datesAndColors = parseActivities(eventsAry, datesAndColors);
                    if(datesAndColors.size() == 0)
                        throw new JSONException("Empty Json");

                    caldroidFragment.setBackgroundDrawableForDates(datesAndColors);
                    caldroidFragment.refreshView();
                    Collections.sort(calendarList, new SortData());
                    renderListview(calendarList);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                } catch (Exception e) {
                    if(progressBarLayout.getVisibility() == View.GONE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                    listView.setAdapter(null);
                }
            }
        };
        getSchoolActivities.execute();
    }

    private HashMap<Date, Drawable> parseActivities(JSONArray dataAry, HashMap<Date, Drawable> datesAndColors) throws JSONException, NullPointerException {

        for (int i=0; i<dataAry.length(); i++) {
            JSONObject dataObj = dataAry.getJSONObject(i);
            nexrise.publication.in.nexrise.BeanClass.Calendar cal = new nexrise.publication.in.nexrise.BeanClass.Calendar();
            ArrayList<ClassAndSection> sections = new ArrayList<>();

            String start = dataObj.getString("start");
            String end = dataObj.getString("end");
            String eventId = null;
            String scheduleId = null;
            String classId = null;
            String className = null;
            String sectionId = null;
            String subjectName = null;

            if(dataObj.has("event_id"))
                eventId = dataObj.getString("event_id");
            if(dataObj.has("exam_schedule_id"))
                scheduleId = dataObj.getString("exam_schedule_id");
            if(dataObj.has("class_id"))
                classId = dataObj.getString("class_id");
            if(dataObj.has("class_name"))
                className = dataObj.getString("class_name");
            if(dataObj.has("sections")) {
                sectionId = dataObj.getString("sections");
                JSONArray sectionAry = new JSONArray(sectionId);
                for (int j=0; j <sectionAry.length(); j++) {
                    ClassAndSection classAndSection = new ClassAndSection();
                    JSONObject section = sectionAry.getJSONObject(j);
                    classAndSection.setSection_id(section.getString("section_id"));
                    classAndSection.setSection_name(section.getString("section_name"));
                    classAndSection.setClass_id(classId);
                    classAndSection.setClass_name(className);
                    sections.add(classAndSection);
                }
            }
            if(dataObj.has("subject_name")) {
                subjectName = dataObj.getString("subject_name");
            }

            Log.v("start","start"+utils.dateSeperate(start));
            Date startdate = utils.schoolsActivityDate(utils.dateSeperate(start));
            Date endDate = utils.schoolsActivityDate(utils.dateSeperate(end));
            String title = dataObj.getString("title");
            String color = dataObj.getString("color");

            cal.setColor(color);
            cal.setTitle(title);
            cal.setStartDate(start);
            cal.setEndDate(end);
            cal.setId(eventId);
            cal.setScheduleId(scheduleId);
            cal.setClassId(classId);
            cal.setClassName(className);
            cal.setClasses(sections);
            cal.setSubjectName(subjectName);
            calendarList.add(cal);
            ColorDrawable colorDrawable = new ColorDrawable();
            if(startdate.equals(endDate)) {
                colorDrawable.setColor(Color.parseColor(color));
                datesAndColors.put(startdate, colorDrawable);
            } else {
                Calendar activityStartDate = Calendar.getInstance();
                activityStartDate.setTime(startdate);
                Calendar activityEndDate = Calendar.getInstance();
                activityEndDate.setTime(endDate);

                while (!activityStartDate.after(activityEndDate)) {
                    colorDrawable.setColor(Color.parseColor(color));
                    datesAndColors.put(activityStartDate.getTime(), colorDrawable);
                    activityStartDate.add(Calendar.DATE, 1);
                }
            }
        }
        return datesAndColors;
    }

    private void renderListview(List<nexrise.publication.in.nexrise.BeanClass.Calendar> calendarList) {
        arrayAdapter = new OverviewArrayAdapter(getActivity(), 0, calendarList);
        listView.setAdapter(arrayAdapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                nexrise.publication.in.nexrise.BeanClass.Calendar calendar = (nexrise.publication.in.nexrise.BeanClass.Calendar) listView.getItemAtPosition(position);
                if(calendar.getId() != null) {
                    Intent intent = new Intent(getActivity(), EventDetailsActivity.class);
                    intent.putExtra("Actionbar title", "Event Details");
                    intent.putExtra("Id", calendar.getId());
                    startActivity(intent);
                } else if (calendar.getScheduleId() != null && calendar.getClassId() != null && calendar.getClassName() != null && calendar.getClasses() != null && calendar.getClasses().size() != 0) {

                    if(utils.getUserRole(getActivity()).equalsIgnoreCase(PARENT)) {
                        Intent intent = new Intent(getActivity(), ExamDetailsActivity.class);
                        intent.putExtra(EXAM_NAME, calendar.getTitle());
                        intent.putExtra(SCHEDULE_ID, calendar.getScheduleId());
                        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
                        intent.putExtra(CLASS_ID, preferences.getString(CLASS_ID, null));
                        intent.putExtra(CLASS_NAME, preferences.getString(CLASS_NAME, null));
                        intent.putExtra(SECTION_ID, preferences.getString(SECTION_ID, null));
                        intent.putExtra(SECTION_NAME, preferences.getString(SECTION_NAME, null));
                        startActivity(intent);
                    } else {
                        if(calendar.getClasses().size() == 1) {
                            ArrayList<ClassAndSection> sections = calendar.getClasses();

                            String scheduleId = calendar.getScheduleId();
                            String classId = sections.get(0).getClass_id();
                            String sectionId = sections.get(0).getSection_id();
                            String examName = calendar.getTitle();
                            String className = sections.get(0).getClass_name();
                            String sectionName = sections.get(0).getSection_name();
                            Intent intent = new Intent(getActivity(), ExamDetailsActivity.class);
                            intent.putExtra(EXAM_NAME, examName);
                            intent.putExtra(SCHEDULE_ID, scheduleId);
                            intent.putExtra(CLASS_ID,classId );
                            intent.putExtra(CLASS_NAME, className);
                            intent.putExtra(SECTION_ID, sectionId);
                            intent.putExtra(SECTION_NAME, sectionName);
                            startActivity(intent);
                            /*markList(scheduleId,classId,sectionId,examName,className,sectionName);*/

                        } else {
                            Intent intent = new Intent(getActivity(), ExamActivity.class);
                            intent.putExtra(EXAM_NAME, calendar.getTitle());
                            intent.putExtra(SCHEDULE_ID, calendar.getScheduleId());
                            ArrayList<ClassAndSection> sections = calendar.getClasses();
                            intent.putExtra(CLASS_SECTION, sections);
                            startActivity(intent);
                        }
                    }
                }
            }
        });
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

    private class SortData implements Comparator<nexrise.publication.in.nexrise.BeanClass.Calendar> {

        @Override
        public int compare(nexrise.publication.in.nexrise.BeanClass.Calendar calendar, nexrise.publication.in.nexrise.BeanClass.Calendar calendar2) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            if(utils == null)
                utils = new StringUtils();

            Date date1 = null;
            Date date2 = null;
            try {
                date1 = simpleDateFormat.parse(utils.dateSeperate(calendar.getStartDate()));
                date2 = simpleDateFormat.parse(utils.dateSeperate(calendar2.getStartDate()));
            } catch (ParseException e) {
                e.printStackTrace();
            }
            assert date1 != null;
            assert date2 != null;
            return date1.compareTo(date2);
        }
    }
   /* private void markList(final String scheduleId, final String classId, final String sectionId, final String examName, final String className, final String sectionName){
        String examUrl = BASE_URL + API_VERSION_ONE + MARKS + scheduleId +"/" + classId +"/"+ sectionId;
        Log.v("ExamUrl","DAte"+examUrl);
        GETUrlConnection markListIdConnection = new GETUrlConnection(getActivity(),examUrl,null){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("MarksList","Detail"+response);
                if(response != null){
                    try {
                        JSONObject jsonObject = new JSONObject(response);
                        JSONObject dataObject = jsonObject.getJSONObject(DATA);
                        JSONArray userArray = dataObject.getJSONArray("users");

                        String markListId = userArray.getJSONObject(0).getString("marklistId");

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        };
        markListIdConnection.execute();
    }*/

}
