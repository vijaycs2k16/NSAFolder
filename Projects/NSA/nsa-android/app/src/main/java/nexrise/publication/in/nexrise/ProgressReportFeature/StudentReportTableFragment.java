package nexrise.publication.in.nexrise.ProgressReportFeature;

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

import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.BeanClass.ExamMarks;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.ExamMarkParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link StudentReportTableFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link StudentReportTableFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class StudentReportTableFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public StudentReportTableFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment StudentReportTableFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static StudentReportTableFragment newInstance(String param1, String param2) {
        StudentReportTableFragment fragment = new StudentReportTableFragment();
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
        View view = inflater.inflate(R.layout.fragment_student_report_table, container, false);
        Bundle bundle = getArguments();
        TextView examName = (TextView) view.findViewById(R.id.exam_name);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String userId = preferences.getString(CURRENT_USERNAME, null);
        StringUtils utils = new StringUtils();

        if(bundle.containsKey("examObject")) {
            Exam exam = (Exam) bundle.getSerializable("examObject");
            assert exam != null;
            String url = BASE_URL + API_VERSION_ONE + MARKS + USER + DETAILS + userId + "/" + exam.getScheduleId();
            Log.v("Marks"," "+url);
            renderData(view, inflater, url);
        } else if (bundle.containsKey(SCHEDULE_ID) && bundle.containsKey(EXAM_NAME)) {
            String scheduleId = bundle.getString(SCHEDULE_ID);
            String url = BASE_URL + API_VERSION_ONE + MARKS + USER + DETAILS + userId + "/" + scheduleId;
            renderData(view, inflater, url);
        } else if(bundle.containsKey("markList")){
            ArrayList<ExamMarks> examMarkList = (ArrayList<ExamMarks>) bundle.getSerializable("markList");
            ListView listView = (ListView)view.findViewById(R.id.student_report_table_listview);
            View footer = inflater.inflate(R.layout.student_total, listView, false);
            listView.addFooterView(footer);

            StudentReportTableArrayAdapter arrayAdapter = new StudentReportTableArrayAdapter(getActivity(), examMarkList);
            listView.setAdapter(arrayAdapter);
            TextView totalMark = (TextView)listView.findViewById(R.id.total_mark);
            totalMark.setText(bundle.getString(TOTAL_MARKS) /*+ " / " + bundle.getString(TOTAL_OBTAINED)*/);
            Log.v("result","total   "+bundle.getString(TOTAL_MARKS)/*+" / "+bundle.getString(TOTAL_OBTAINED)*/);
            String studentName = bundle.getString(FIRST_NAME);
            examName.setText(studentName);
        }

        if(utils.getUserRole(getActivity()).equalsIgnoreCase(EMPLOYEE) && bundle.containsKey(CLASS_NAME) && bundle.containsKey(SECTION_NAME)) {
            String studentName = bundle.getString(FIRST_NAME);
            examName.setText(studentName);
        } else  if(utils.getUserRole(getActivity()).equalsIgnoreCase(PARENT)) {
            String username = preferences.getString(FIRST_NAME, null);
            examName.setText(username);
        }
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

    private void renderData(final View view, final LayoutInflater inflater, String url) {

        GETUrlConnection getMarkList = new GETUrlConnection(getActivity(), url, null) {
            RelativeLayout progressBarContainer = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent =(TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBarContainer.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    Log.v("MARK ","list "+response);
                    progressBar.setVisibility(View.INVISIBLE);
                    progressBarContainer.setVisibility(View.GONE);
                    ExamMarkParser markParser = new ExamMarkParser();
                    Exam examMarks = markParser.examMarksParser(response);
                    ListView listView = (ListView)view.findViewById(R.id.student_report_table_listview);
                    View footer = inflater.inflate(R.layout.student_total, listView, false);
                    listView.addFooterView(footer);

                    StudentReportTableArrayAdapter arrayAdapter = new StudentReportTableArrayAdapter(getActivity(), examMarks.getMarkList());
                    listView.setAdapter(arrayAdapter);
                    TextView totalMark = (TextView)listView.findViewById(R.id.total_mark);
                    totalMark.setText(examMarks.getTotalObtained()+ "/"+ examMarks.getTotalMarks());
                } catch (NullPointerException | JSONException e) {
                    if(progressBarContainer.getVisibility() == View.GONE)
                        progressBarContainer.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getMarkList.execute();
    }


}
