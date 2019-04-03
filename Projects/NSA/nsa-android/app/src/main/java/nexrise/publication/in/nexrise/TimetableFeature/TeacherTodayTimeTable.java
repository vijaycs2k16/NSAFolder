package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONException;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import nexrise.publication.in.nexrise.BeanClass.TeacherTimeTable;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.BeanClass.Image;
import nexrise.publication.in.nexrise.JsonParser.TeacherTodayParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link TeacherTodayTimeTable.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link TeacherTodayTimeTable#newInstance} factory method to
 * create an instance of this fragment.
 */
public class TeacherTodayTimeTable extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    ArrayList<Image> images = new ArrayList<>();
    private OnFragmentInteractionListener mListener;
    private View view;
    public static Boolean rendered = false;

    public TeacherTodayTimeTable() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment TeacherTodayTimeTable.
     */
    // TODO: Rename and change types and number of parameters
    public static TeacherTodayTimeTable newInstance(String param1, String param2) {
        TeacherTodayTimeTable fragment = new TeacherTodayTimeTable();
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
        view = inflater.inflate(R.layout.fragment_teacher_today_time_table, container, false);
        String values =  Utility.readProperty(getActivity(), DISABLE_NOTES);
        if (values.contains(ACCESS_ID)) {
            TableRow tableRow = (TableRow)view.findViewById(R.id.table_teacher);
            tableRow.setWeightSum(4);
            TextView uploadNotes = (TextView)view.findViewById(R.id.cell4);
            uploadNotes.setVisibility(View.GONE);
        }
        renderData();
        rendered = true;
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
        if(!rendered) {
            renderData();
            rendered = true;
        }
    }

    public void renderData() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        Calendar calendar = Calendar.getInstance();
        String dayLongName = calendar.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.getDefault());
        String dayId = new StringUtils().dayId(dayLongName);
        Log.v("day","ID"+dayId);
        String id = preferences.getString(CURRENT_USERNAME, null);
        Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String currentDay = dateFormat.format(now);

        String url = BASE_URL + API_VERSION_ONE + TIMETABLE + EMP + id + "/" +dayId+"?date="+currentDay;
        Log.v("Today","TEacher "+url);
        Log.v("teacher1","today1"+url);
        GETUrlConnection getTodayTimetable = new GETUrlConnection(getActivity(), url,null) {
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
                Log.v("Today","TEacher"+response);
                progressBar.setVisibility(View.INVISIBLE);
                try {
                    new StringUtils().checkSession(response);
                    progressBarLayout.setVisibility(View.GONE);
                    TeacherTodayParser todayTimeTableParser = new TeacherTodayParser();
                    ArrayList<TeacherTimeTable> timeTable = todayTimeTableParser.getTimeTable(getActivity(), response);
                    ListView listView = (ListView) view.findViewById(R.id.teacher_listview);
                    AddTeacherTodayArrayAdpter adapter = new AddTeacherTodayArrayAdpter(getActivity(), timeTable, "Today");
                    listView.setAdapter(adapter);
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                    if (progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() == View.INVISIBLE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getTodayTimetable.execute();

        TextView todayDate = (TextView) view.findViewById(R.id.todayDate);
        todayDate.setText(dayLongName +System.getProperty("line.separator"));
    }

    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }

    public void uploadedImages(ArrayList<Image> imagesList) {
        images = imagesList;
    }
}
