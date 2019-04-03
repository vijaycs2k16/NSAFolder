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
import android.widget.TextView;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.Calendar;

import nexrise.publication.in.nexrise.BeanClass.WeekTeacherObject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.WeekTeacherJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link WeeklyTeacheeTimeTableFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link WeeklyTeacheeTimeTableFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class WeeklyTeacheeTimeTableFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public WeeklyTeacheeTimeTableFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment WeeklyTeacheeTimeTableFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static WeeklyTeacheeTimeTableFragment newInstance(String param1, String param2) {
        WeeklyTeacheeTimeTableFragment fragment = new WeeklyTeacheeTimeTableFragment();
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
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        // Inflate the layout for this fragment
        final View view = inflater.inflate(R.layout.fragment_weekly_teachee_time_table, container, false);
        final Calendar calendar = Calendar.getInstance();
        String weekId = String.valueOf(calendar.get(Calendar.WEEK_OF_YEAR));
        String id = preferences.getString(CURRENT_USERNAME,null);
        TextView academicYear = (TextView) view.findViewById(R.id.teacher_heading);
        academicYear.setText("Academic Year"+"("+preferences.getString(CURRENT_ACADEMIC_YEAR,ACADEMIC_YEAR)+")");
        String techearWeekData = BASE_URL + API_VERSION_ONE + TIMETABLE + EMP + id + "?weekNo=" + weekId;
        Log.v("Teacher","week"+techearWeekData);
        GETUrlConnection weekData = new GETUrlConnection(getActivity(),techearWeekData,null){
            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.progress_bar);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute(){
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Teacher","week"+response);
                progressBar.setVisibility(View.INVISIBLE);
                try {
                    new StringUtils().checkSession(response);
                    progressBarLayout.setVisibility(View.GONE);
                    WeekTeacherJsonParser weeklyTimeTableParser = new WeekTeacherJsonParser();
                    ArrayList<WeekTeacherObject> weektimeTableList = weeklyTimeTableParser.getWeektimeTableList(response);
                    TextView textView = (TextView) view.findViewById(R.id.teacher_heading);
                    ListView listView = (ListView) view.findViewById(R.id.tableListView);

                    WeeklyTeacherTimeArrayAdapter adapter = new WeeklyTeacherTimeArrayAdapter(getActivity(), weektimeTableList);
                    listView.setAdapter(adapter);
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                    if (progressBarLayout.getVisibility()== View.GONE || progressBarLayout.getVisibility()==View.INVISIBLE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        weekData.execute();
        return  view;
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
}
