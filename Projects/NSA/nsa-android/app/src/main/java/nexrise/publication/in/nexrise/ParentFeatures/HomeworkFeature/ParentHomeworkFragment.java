package nexrise.publication.in.nexrise.ParentFeatures.HomeworkFeature;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
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

import org.json.JSONException;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;

import nexrise.publication.in.nexrise.BeanClass.ParentHomeWork;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.CustomHashMap.Initiater;
import nexrise.publication.in.nexrise.CustomHashMap.OnUpdateListener;
import nexrise.publication.in.nexrise.JsonParser.ParentHomeworkParser;
import nexrise.publication.in.nexrise.NavigationDrawerActivity;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

import static android.app.Activity.RESULT_OK;
import static android.view.View.GONE;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ParentHomeworkFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ParentHomeworkFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ParentHomeworkFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    ParentHomeWorkArrayAdapter arrayAdapter;
    HashMap<String, String> attachments = new HashMap<String, String>();
    String studentName = "Ashmita Prakash";
    ArrayList<ParentHomeWork> homeworkList;
    View view;
    StringUtils stringUtils;
    int weeks;
    int year;
    ImageView prevButton;
    ImageView nextButton;
    TextView week;
    public static Boolean clicked = false;
    private static Boolean parentHomeworkRendered = false;
    OnUpdateListener update;
    int start = 0;
    boolean canFetch = false;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public ParentHomeworkFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ParentHomeworkFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ParentHomeworkFragment newInstance(String param1, String param2) {
        ParentHomeworkFragment fragment = new ParentHomeworkFragment();
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
        Calendar calender = Calendar.getInstance();
        weeks = calender.get(Calendar.WEEK_OF_YEAR);
        year = calender.get(Calendar.YEAR);

        Initiater initiater = Initiater.getInstance();
        update = new OnUpdateListener() {
            @Override
            public void onUpdate(String classId, String sectionId, String schoolId, String userId, String featureId, int count) {
                try {
                    Log.v("Listener ","user visible hint"+getUserVisibleHint());

                    if (featureId.equals(CREATE_ASSIGNMENT) && count != 0) {
                        if(getUserVisibleHint())
                            renderWeekList(weeks, year);
                        else
                            parentHomeworkRendered = false;
                    }
                } catch (NullPointerException e) {
                    e.printStackTrace();
                }
            }
        };
        initiater.setOnUpdateListener(update);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_parent_homework, container, false);
        final ImageView help = (ImageView)view.findViewById(R.id.help);
        stringUtils = new StringUtils();
        String userRole = stringUtils.getUserRole(getActivity());

        if (userRole.equalsIgnoreCase(PARENT)) {
            stringUtils.customTooltip(getActivity(),help, (String) getResources().getText(R.string.parent_homework));
        } else {
            stringUtils.customTooltip(getActivity(),help,"Assignments due for you! Enjoy your evening! ");
        }
        //renderData();
        renderWeekList(weeks,year);
        weekSelection();
        parentHomeworkRendered = true;
        return view;
    }

    public void weekSelection() {
        prevButton = (ImageView)view.findViewById(R.id.prev_week);
        nextButton = (ImageView)view.findViewById(R.id.next_week);
        week = (TextView)view.findViewById(R.id.current_week);
        final String yearNo = String.valueOf(year);
        final String weekNo = String.valueOf(weeks);
        week.setText("Week "+weekNo+", "+yearNo);

        prevButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                start = 0;
                if (weeks>1){
                    --weeks;
                    final String dec = String.valueOf("WEEK " +weeks+",");
                    week.setText(dec+" "+year);
                    renderWeekList(weeks,year);
                } else {
                    weeks=52;
                    --year;
                    final String dec = String.valueOf("WEEK " +weeks+",");
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
                    final String inc = String.valueOf("WEEK " +weeks+",");
                    week.setText(inc+" "+year);
                    renderWeekList(weeks,year);
                } else {
                    weeks=1;
                    year++;
                    final String dec = String.valueOf("WEEK " +weeks+",");
                    week.setText(dec+" "+year);
                    renderWeekList(weeks,year);
                }
            }
        });
    }

    public void renderWeekList(int weeks, int year) {
        final ListView listView = (ListView) view.findViewById(R.id.fragment_class_listview);
        String url = BASE_URL + API_VERSION_ONE + ASSIGNMENT + WEEK + YEAR + "?weekNo=" + weeks + "&year=" + year + "&start="+start+"&length="+LENGTH;
        Log.v("calender","url"+url);
        GETUrlConnection getUrl = new GETUrlConnection(getActivity(),url,null){
            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView) view.findViewById(R.id.no_content);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response){
                super.onPostExecute(response);
                progressBarLayout.setVisibility(GONE);
                progressBar.setVisibility(GONE);
                Log.v("calender","response"+response);
                try {
                    stringUtils.checkSession(response);
                    ParentHomeworkParser parentHomeworkParser = new ParentHomeworkParser();
                    homeworkList = parentHomeworkParser.weekDataParser(response, null);
                    arrayAdapter = new ParentHomeWorkArrayAdapter(getActivity(), homeworkList);
                    View view = getActivity().getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                    listView.addFooterView(view);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView);
                    canFetch = true;
                    pagination(listView, arrayAdapter, homeworkList);
                } catch (JSONException | NullPointerException e) {
                    if(progressBarLayout.getVisibility() == GONE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                    canFetch = false;
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getUrl.execute();
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
                            // renderData();
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

    private void pagination(final ListView listView, final ParentHomeWorkArrayAdapter adapter, final ArrayList<ParentHomeWork> homeWorks) {
        listView.setOnScrollListener(new AbsListView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(AbsListView absListView, int i) {
            }

            @Override
            public void onScroll(AbsListView absListView, int firstVisibleItem, int visibleItemCount, int totalItemCount) {

                if(listView.getLastVisiblePosition() == listView.getAdapter().getCount()-1 && listView.getChildAt(listView.getChildCount()-1).getBottom() <= listView.getHeight() && canFetch) {
                    if (homeWorks.size() < LENGTH)
                        return;
                    start += LENGTH;
                    String url = BASE_URL + API_VERSION_ONE + ASSIGNMENT + WEEK + YEAR + "?weekNo=" + weeks + "&year=" + year + "&start="+start+"&length="+LENGTH;
                    GETUrlConnection getUrl = new GETUrlConnection(getActivity(),url,null){
                        RelativeLayout progressBarLayout = (RelativeLayout)listView.findViewById(R.id.loading_bar_container);
                        ProgressBar progressBar = (ProgressBar)listView.findViewById(R.id.loading_bar);
                        TextView noContent = (TextView) listView.findViewById(R.id.no_content);

                        @Override
                        protected void onPreExecute() {
                            super.onPreExecute();
                            progressBarLayout.setVisibility(View.VISIBLE);
                            progressBar.setVisibility(View.VISIBLE);
                            if(noContent.getVisibility() == View.VISIBLE)
                                noContent.setVisibility(View.INVISIBLE);
                            canFetch = false;
                        }

                        @Override
                        protected void onPostExecute(String response){
                            super.onPostExecute(response);
                            progressBarLayout.setVisibility(GONE);
                            progressBar.setVisibility(GONE);
                            Log.v("calender","response"+response);
                            try {
                                stringUtils.checkSession(response);
                                ParentHomeworkParser parentHomeworkParser = new ParentHomeworkParser();
                                ArrayList<ParentHomeWork> parentHomeWorks = parentHomeworkParser.weekDataParser(response, homeWorks);
                                if(parentHomeWorks.size() == 0)
                                    throw new JSONException("Empty Json");
                                homeWorks.addAll(parentHomeWorks);
                                adapter.notifyDataSetChanged();
                                canFetch = true;
                            } catch (JSONException | NullPointerException e) {
                                canFetch = false;
                                e.printStackTrace();
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

    @Override
    public void onResume() {
        super.onResume();
        if(!parentHomeworkRendered)
            renderWeekList(weeks, year);
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

    public void listviewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent;
                int pos =  listView.getPositionForView(view);
                ParentHomeWork selectedData = (ParentHomeWork) listView.getItemAtPosition(position);
                Log.v("Position "," "+pos);
                intent = new Intent(getActivity(), ParentDetailsActivity.class);
                intent.putExtra("FromActivity","MainActivity");
                intent.putExtra("Index",pos);
                intent.putExtra("studentName", studentName);
                intent.putExtra("ListData",selectedData);
                startActivityForResult(intent, 5);
            }
        });
    }

    @Override
    public void onPause() {
        super.onPause();

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Initiater.getInstance().remove(update);

    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == 5 && resultCode == RESULT_OK) {
            for (int i=0; i<homeworkList.size(); i++) {
                String id = data.getStringExtra("Assignment ID");
                if(homeworkList.get(i).getId().equals(id)) {
                    homeworkList.get(i).setIsSubmitted("Submitted");
                    arrayAdapter.notifyDataSetChanged();
                }
            }
        }
    }
    public void search(String text){

        try {
            CharSequence s = text;
            arrayAdapter.getFilter().filter(s);
        }catch (NullPointerException e){
            e.printStackTrace();
        }
    }
}

