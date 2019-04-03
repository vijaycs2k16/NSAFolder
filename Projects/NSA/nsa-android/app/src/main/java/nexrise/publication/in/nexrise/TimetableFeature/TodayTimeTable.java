package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
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
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONException;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.BeanClass.TimeTableObject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.TodayTimeTableParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.AttachmentActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

/**
 * Created by Sai Deepak on 06-Oct-16.
 */

public class TodayTimeTable extends Fragment implements Constants {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private  String dayLongName;
    private List<TimeTableObject> timeTable;
    SharedPreferences preferences;
    StringUtils stringUtils;
    String userRole;

    private TodayTimeTable.OnFragmentInteractionListener mListener;

    public TodayTimeTable() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment TodayTimeTable.
     */
    // TODO: Rename and change types and number of parameters
    public static TodayTimeTable newInstance(String param1, String param2) {
        TodayTimeTable fragment = new TodayTimeTable();
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
        final View view = inflater.inflate(R.layout.fragment_today_time_table, container, false);
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String classId = preferences.getString(CLASS_ID,null);
        String sectionId = preferences.getString(SECTION_ID,null);
        Bundle bundle = getArguments();
        stringUtils = new StringUtils();
        userRole = stringUtils.getUserRole(getActivity());
        String values = Utility.readProperty(getActivity(),DISABLE_NOTES);
        if(values.contains(ACCESS_ID)){
            TableRow tableRow = (TableRow)view.findViewById(R.id.table_parent);
            tableRow.setWeightSum(4);
            TextView textView = (TextView)view.findViewById(R.id.view_notes_parent);
            textView.setVisibility(View.GONE);
        }

        if(getArguments().containsKey("Classes")) {
            Classes classes = (Classes) bundle.getSerializable("Classes");
            classId = classes.getClassId();
            sectionId = classes.getSectionId();
        }
        Calendar calendar = Calendar.getInstance();
        dayLongName = calendar.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.getDefault());
        TextView todayDate = (TextView) view.findViewById(R.id.todayDate);
        todayDate.setText(dayLongName +System.getProperty("line.separator"));
        Log.v("today","name "+dayLongName);
        String dayId = stringUtils.dayId(dayLongName);
        Log.v("day","ID"+dayId);
        Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String today = dateFormat.format(now);
        String todayTimetable = BASE_URL + API_VERSION_ONE + TIMETABLE + CLASS + classId +SECTION+ sectionId+ "/"+ dayId +"?date="+today ;
        Log.v("today","section"+todayTimetable);
        GETUrlConnection url = new GETUrlConnection(getActivity(), todayTimetable,null) {
            RelativeLayout progressBarLayout = (RelativeLayout) view.findViewById(R.id.progress_bar);
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
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Today","Timetable : "+response);
                progressBar.setVisibility(View.INVISIBLE);
                try {
                    stringUtils.checkSession(response);
                    progressBarLayout.setVisibility(View.GONE);
                    TodayTimeTableParser todayTimeTableParser = new TodayTimeTableParser();
                    timeTable = todayTimeTableParser.getTimeTable(response);
                    ListView listView = (ListView) view.findViewById(R.id.listview);
                    AddTodayTimeTableArrayAdapter adapter = new AddTodayTimeTableArrayAdapter(getActivity(), timeTable, "Today");
                    listView.setAdapter(adapter);
                    //listviewClick(listView);
                } catch (NullPointerException | JSONException e) {
                    e.printStackTrace();
                    if (progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() == View.INVISIBLE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        url.execute();
        return view;
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

    public void listviewClick(ListView listView) {
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {

                if(userRole.equalsIgnoreCase(EMPLOYEE)) {
                    Intent intent = new Intent(getActivity(), AttachmentActivity.class);
                    startActivity(intent);
                } else {
                    Intent intent = new Intent(getActivity(), ViewNotesActivity.class);
                    intent.putExtra(FROM,"TimeTable");
                    startActivity(intent);
                }
            }
        });
    }
}
