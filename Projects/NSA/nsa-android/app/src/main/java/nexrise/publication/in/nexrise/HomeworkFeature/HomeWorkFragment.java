package nexrise.publication.in.nexrise.HomeworkFeature;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

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
import java.util.List;
import java.util.Locale;
import java.util.Timer;
import java.util.TimerTask;

import nexrise.publication.in.nexrise.BeanClass.TeacherHomeWork;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.CustomHashMap.Initiater;
import nexrise.publication.in.nexrise.CustomHashMap.OnUpdateListener;
import nexrise.publication.in.nexrise.JsonParser.HomeworkParser;
import nexrise.publication.in.nexrise.NavigationDrawerActivity;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

import static android.view.View.GONE;

public class HomeWorkFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters-
    private int mParam1;
    private String mParam2;
    ListView listView;
    View view;
    private int ADD_HOMEWORK = 11;
    public static Boolean teacherHomeWorkRendered = false;
    StringUtils stringUtils;
    public static String date = "21.02.2017";

    int weeks;
    int year;
    ImageView prevButton;
    ImageView nextButton;
    TextView week;
    HomeWorkFragmentArrayAdapter arrayAdapter;
    OnUpdateListener update;
    int start = 0;
    boolean canFetch = false;

    public HomeWorkFragment() {

        // Required empty public constructor
    }
    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment HomeWorkFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static HomeWorkFragment newInstance(int param1, String param2) {
        HomeWorkFragment fragment = new HomeWorkFragment();
        Bundle args = new Bundle();
        args.putInt(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);

        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getInt(ARG_PARAM1, 0);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }

        Initiater initiater = Initiater.getInstance();
        update = new OnUpdateListener() {
            @Override
            public void onUpdate(String classId, String sectionId, String schoolId, String userId, String featureId, int count) {
                try {
                    if (featureId.equals(CREATE_ASSIGNMENT) && count != 0) {
                        if(getUserVisibleHint()) {
                            start = 0;
                            renderWeekList(weeks, year);
                        } else
                            teacherHomeWorkRendered = false;
                    }
                } catch (NullPointerException e) {
                    e.printStackTrace();
                }
            }
        };
        initiater.setOnUpdateListener(update);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, final ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment

        view = inflater.inflate(R.layout.fragment_homework, container, false);
        stringUtils = new StringUtils();
        listView = (ListView)view.findViewById(R.id.fragment_class_listview);
        floatingActionButtonClick(view);
        //final ImageView help = (ImageView) view.findViewById(R.id.help);
        //stringUtils.customTooltip(getActivity(),help,"Create assignments for students and follow up on their completion status");
        setRetainInstance(true);
        Calendar calender = Calendar.getInstance();
        weeks = calender.get(Calendar.WEEK_OF_YEAR);
        year = calender.get(Calendar.YEAR);
        //renderData();
        teacherHomeWorkRendered = true;
        renderWeekList(weeks,year);
        weekSelection();
        return view;
    }

    private void weekSelection() {
        prevButton = (ImageView)view.findViewById(R.id.prev_week);
        nextButton = (ImageView)view.findViewById(R.id.next_week);
        week = (TextView)view.findViewById(R.id.current_week);
        final String yearNo = String.valueOf(year);
        final String weekNo = String.valueOf(weeks);
        Log.v("week","year"+weekNo+","+yearNo);
        week.setText("Week "+weekNo+", "+yearNo);

        prevButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                start = 0;
                if (weeks>1){
                    --weeks;
                    final String dec = String.valueOf("WEEK "+weeks+",");
                    week.setText(dec+" "+year);
                    renderWeekList(weeks,year);
                } else {
                    weeks=52;
                    --year;
                    final String dec = String.valueOf("WEEK "+weeks+",");
                    week.setText(dec+" "+year);
                    renderWeekList(weeks,year);
                }
            }
        });

        nextButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                start = 0;
                if (weeks<52) {
                    ++weeks;
                    final String inc = String.valueOf("WEEK "+weeks+",");
                    week.setText(inc+" "+year);
                    renderWeekList(weeks,year);
                } else {
                    weeks=1;
                    year++;
                    final String dec = String.valueOf("WEEK "+weeks+",");
                    week.setText(dec+" "+year);
                    renderWeekList(weeks,year);
                }
            }
        });
    }

    private void renderWeekList(int weeks, int year) {
        String url = BASE_URL + API_VERSION_ONE + ASSIGNMENT + EMP + WEEK + YEAR + "?weekNo=" + weeks + "&year=" + year + "&start="+start+"&length="+LENGTH;
        Log.v("calender","url"+url);
        GETUrlConnection getUrl = new GETUrlConnection(getActivity(),url,null){
            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.container);
            ProgressBar progress = (ProgressBar)view.findViewById(R.id.loading);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progress.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response){
                super.onPostExecute(response);
                progress.setVisibility(View.INVISIBLE);
                progressBarLayout.setVisibility(GONE);
                Log.v("calender","response"+response);
                try {
                    stringUtils.checkSession(response);
                    HomeworkParser homeworkParser = new HomeworkParser();
                    ArrayList<TeacherHomeWork> homeworkList = new ArrayList<>();
                    homeworkList = homeworkParser.weekDataParser(response, homeworkList);
                    if(homeworkList.size() == 0)
                        throw new JSONException("Empty Json");
                    arrayAdapter = new HomeWorkFragmentArrayAdapter(getActivity(), homeworkList);
                    View view = getActivity().getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                    listView.addFooterView(view);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView);
                    canFetch = true;
                    pagination(listView, arrayAdapter, homeworkList);
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                    if(progressBarLayout.getVisibility() == GONE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                    listView.setAdapter(null);
                    canFetch = false;
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getUrl.execute();
    }

    public void floatingActionButtonClick(final View view){
        FloatingActionButton floatingActionButton = (FloatingActionButton)view.findViewById(R.id.floating_action_button);
        String permission = stringUtils.getPermission(getActivity(), "create_assignments");
        if(permission.contains("manage") || permission.contains("manageAll")) {
            floatingActionButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(getActivity(), AddHomeWorkActivity.class);
                    intent.putExtra("FromActivity", "Floating");
                    getActivity().startActivityForResult(intent, ADD_HOMEWORK);
                }
            });
        } else {
            floatingActionButton.setVisibility(View.GONE);
        }
    }

    @Override
    public void setMenuVisibility(boolean visible) {
        super.setMenuVisibility(visible);
        if(visible && getActivity() instanceof NavigationDrawerActivity) {
            final NavigationDrawerActivity parentActivity = (NavigationDrawerActivity) getActivity();

            if (parentActivity != null) {
                //renderData();
                MessageReceivingService.notificationCount.put(CREATE_ASSIGNMENT, 0);
                parentActivity.setNotificationCount();
            } else {
                Timer timer = new Timer();
                final TimerTask timerTask = new TimerTask() {
                    @Override
                    public void run() {
                        if (parentActivity != null) {
                            //renderData();
                            MessageReceivingService.notificationCount.put(CREATE_ASSIGNMENT, 0);
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

    @Override
    public void onPause() {
        super.onPause();
    }

    @Override
    public void onResume() {
        super.onResume();
        if(!teacherHomeWorkRendered) {
            //renderData();
            Log.v("date","dueeee"+date);
            Calendar cal = Calendar.getInstance();
            SimpleDateFormat sdf = new SimpleDateFormat("MMM dd yyyy", Locale.ENGLISH);
            try {
                cal.setTime(sdf.parse(date));
            } catch (ParseException e) {
                e.printStackTrace();
            }
            weeks = cal.get(Calendar.WEEK_OF_YEAR);
            year = cal.get(Calendar.YEAR);
             String yearNo = String.valueOf(year);
             String weekNo = String.valueOf(weeks);
            week.setText("Week "+weekNo+", "+yearNo);
            start = 0;
            renderWeekList(weeks,year);
            teacherHomeWorkRendered = true;
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Initiater.getInstance().remove(update);
    }

    public void listviewClick(final ListView listView){

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                int pos =  listView.getPositionForView(view);
                TeacherHomeWork selectedData = (TeacherHomeWork) listView.getItemAtPosition(position);

                if(selectedData.getStatus().equalsIgnoreCase("Published")) {
                    Intent intent = new Intent(getActivity(), DetailsPageActivity.class);
                    intent.putExtra("FromActivity", "MainActivity");
                    intent.putExtra("Index", pos);
                    Log.v("selected","data"+selectedData);
                    intent.putExtra("ListData", selectedData);
                    startActivity(intent);
                } else {
                    Log.v("PerMissIon "," To edit "+selectedData.isEditPermissions());
                    if(selectedData.isEditPermissions()) {
                        Intent intent = new Intent(getActivity(), AddHomeWorkActivity.class);
                        intent.putExtra("FromActivity", "MainActivity");
                        intent.putExtra("ListData", selectedData);
                        startActivity(intent);
                    } else {
                        Toast.makeText(getActivity(), R.string.no_permission_edit, Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });

    }

    private void pagination(final ListView listView, final HomeWorkFragmentArrayAdapter adapter, final ArrayList<TeacherHomeWork> homeWorks) {
        listView.setOnScrollListener(new AbsListView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(AbsListView absListView, int i) {
            }

            @Override
            public void onScroll(AbsListView absListView, int firstVisibleItem, int visibleItemCount, int totalItemCount) {

                if (listView.getLastVisiblePosition() == listView.getAdapter().getCount() - 1 && listView.getChildAt(listView.getChildCount() - 1).getBottom() <= listView.getHeight() && canFetch) {
                    if(homeWorks.size() < LENGTH)
                        return;
                    start += LENGTH;
                    String url = BASE_URL + API_VERSION_ONE + ASSIGNMENT + EMP + WEEK + YEAR + "?weekNo=" + weeks + "&year=" + year + "&start="+start+"&length="+LENGTH;
                    Log.v("HomeWeek "," "+url);
                    GETUrlConnection getUrl = new GETUrlConnection(getActivity(),url,null){
                        RelativeLayout progressBarLayout = (RelativeLayout)listView.findViewById(R.id.container);
                        ProgressBar progress = (ProgressBar)listView.findViewById(R.id.loading_bar);
                        TextView noContent = (TextView)listView.findViewById(R.id.no_content);

                        @Override
                        protected void onPreExecute() {
                            super.onPreExecute();
                            progressBarLayout.setVisibility(View.VISIBLE);
                            progress.setVisibility(View.VISIBLE);
                            if(noContent.getVisibility() == View.VISIBLE)
                                noContent.setVisibility(View.INVISIBLE);
                        }

                        @Override
                        protected void onPostExecute(String response){
                            super.onPostExecute(response);
                            progress.setVisibility(View.INVISIBLE);
                            progressBarLayout.setVisibility(GONE);
                            Log.v("calender","response"+response);
                            try {
                                stringUtils.checkSession(response);
                                HomeworkParser homeworkParser = new HomeworkParser();
                                ArrayList<TeacherHomeWork> homeworkList = new ArrayList<>();
                                homeworkList = homeworkParser.weekDataParser(response, homeWorks);
                                homeWorks.addAll(homeworkList);
                                adapter.notifyDataSetChanged();
                                canFetch = true;
                            } catch (JSONException | NullPointerException e) {
                                e.printStackTrace();
                                canFetch = false;
                            } catch (SessionExpiredException e) {
                                e.handleException(getActivity());
                            }
                        }
                    };
                    getUrl.execute();
                }
            }
        });
    }

    public void search(String text){
        if(arrayAdapter != null){
            CharSequence s = text;
            arrayAdapter.getFilter().filter(s);
        }
    }

    public void renderData() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String username = preferences.getString(CURRENT_USERNAME, null);
        final String assignmentCredential = BASE_URL + API_VERSION_ONE + ASSIGNMENT;
        Log.v("asssignemnt","credential"+assignmentCredential);

        GETUrlConnection GETUrlConnection = new GETUrlConnection(getActivity(), assignmentCredential,null) {
            ProgressBar progress = (ProgressBar)view.findViewById(R.id.loading);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progress.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String assignmentresponse) {
                super.onPostExecute(assignmentresponse);
                progress.setVisibility(View.GONE);
                JSONObject jsonObject = null;
                try {
                    stringUtils.checkSession(assignmentresponse);
                    jsonObject = new JSONObject(assignmentresponse);
                    Log.v("assignment","array"+jsonObject.toString());
                    JSONArray data = jsonObject.getJSONArray(DATA);
                    if(data.length() == 0) throw new JSONException("Empty Json");

                    ObjectMapper mapper = new ObjectMapper();
                    mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                    ArrayList<TeacherHomeWork> homeworkList = mapper.readValue(data.toString(), TypeFactory.collectionType(List.class, TeacherHomeWork.class));
                    listView = (ListView) view.findViewById(R.id.fragment_class_listview);

                    HomeWorkFragmentArrayAdapter arrayAdapter = new HomeWorkFragmentArrayAdapter(getActivity(), homeworkList);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView);
                } catch (NullPointerException | JSONException  | IOException e) {
                    e.printStackTrace();
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        GETUrlConnection.execute();
    }
}