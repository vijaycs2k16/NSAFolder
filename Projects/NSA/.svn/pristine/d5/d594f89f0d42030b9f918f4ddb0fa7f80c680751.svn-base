package nexrise.publication.in.nexrise.ExamFeature;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.apache.http.message.BasicHeader;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.BeanClass.ExamMarks;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.TeacherExamListParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link TeacherExamListFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link TeacherExamListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class TeacherExamListFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    ArrayList<Exam> studentList;
    ListView nameList;
    View view;
    TeacherExamListAdapter teacherExamListAdapter;
    String examesName;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;
    public TeacherExamListFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment TeacherExamListFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static TeacherExamListFragment newInstance(String param1, String param2) {
        TeacherExamListFragment fragment = new TeacherExamListFragment();
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
        view = inflater.inflate(R.layout.fragment_teacher_exam_list, container, false);
        Bundle bundle = getArguments();
        TextView examName = (TextView) view.findViewById(R.id.exam_name);
        String classId = "";
        String sectionId = "";
        String examScheduleId = "";
        String examNameStr = "";
        StringUtils utils = new StringUtils();

        if(bundle.containsKey("examObject")) {
            Exam exam = (Exam) bundle.getSerializable("examObject");
            classId = bundle.getString(CLASS_ID);
            sectionId = bundle.getString(SECTION_ID);
            examesName = bundle.getString(EXAM_NAME);
            assert exam != null;
            examScheduleId = exam.getScheduleId();
            examNameStr = exam.getExamName();
        } else if (bundle.containsKey(SCHEDULE_ID) && bundle.containsKey(CLASS_ID) && bundle.containsKey(SECTION_ID) && bundle.containsKey(EXAM_NAME)) {
            examesName = bundle.getString(EXAM_NAME);
            examName.setText(bundle.getString(EXAM_NAME));
            classId = bundle.getString(CLASS_ID);
            sectionId = bundle.getString(SECTION_ID);
            examScheduleId = bundle.getString(SCHEDULE_ID);
        }
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());

        if(utils.getUserRole(getActivity()).equalsIgnoreCase(EMPLOYEE) && bundle.containsKey(CLASS_NAME) && bundle.containsKey(SECTION_NAME)) {
            String className = bundle.getString(CLASS_NAME);
            String sectionName = bundle.getString(SECTION_NAME);
            examNameStr = className + " - " + sectionName+" "+"  "+"("+preferences.getString(CURRENT_ACADEMIC_YEAR,ACADEMIC_YEAR)+")";
        } else  if(utils.getUserRole(getActivity()).equalsIgnoreCase(PARENT)) {
            String username = preferences.getString(FIRST_NAME, null);
            examName.setText(username);
        }
        examName.setText(examNameStr);
        renderData(examScheduleId, classId, sectionId);
        return view;
    }

    private void renderData(String examScheduleId, String classId, String sectionId) {
        String examListUrl = BASE_URL + API_VERSION_ONE + MARKS + examScheduleId + "/"+classId+"/"+sectionId;

        Log.v("examList","url"+examListUrl);
        BasicHeader[] headers = new StringUtils().fileUploadHeader(getActivity(), EXAM_FEATURE, "");
        GETUrlConnection examListCredential = new GETUrlConnection(getActivity(), examListUrl, headers){
            RelativeLayout progressBarLayout = (RelativeLayout) view.findViewById(R.id.loading_bar_container);
            ProgressBar progressBar = (ProgressBar) view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView) view.findViewById(R.id.no_content);

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
                Log.v("TEacher","List"+response);
                super.onPostExecute(response);
                progressBar.setVisibility(View.INVISIBLE);
                if(response!= null) {
                    progressBarLayout.setVisibility(View.GONE);
                    try {
                        nameList = (ListView) view.findViewById(R.id.student_list);
                        TeacherExamListParser teacherExamListParser = new TeacherExamListParser();
                        studentList = teacherExamListParser.ExamListParser(response);
                        Collections.sort(studentList,new NameComparator());
                        teacherExamListAdapter = new TeacherExamListAdapter(getActivity(), studentList);
                        nameList.setAdapter(teacherExamListAdapter);
                      //  listviewClick(nameList);
                    } catch (JSONException | NullPointerException e){
                        if (progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() == View.INVISIBLE)
                            progressBarLayout.setVisibility(View.VISIBLE);
                        noContent.setVisibility(View.VISIBLE);
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    }
                }else {
                    if (progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() == View.INVISIBLE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                }
            }
        };
        examListCredential.execute();

        final EditText editText = (EditText)view.findViewById(R.id.text);
        editText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                try {
                    s = editText.getText().toString().toLowerCase();
                    teacherExamListAdapter.getFilter().filter(s);
                } catch (NullPointerException e){
                    e.printStackTrace();
                }
            }
            @Override
            public void afterTextChanged(Editable s) {
            }
        });
        // Inflate the layout for this fragment
    }

    public void listviewClick(final ListView listView) {
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                int pos = listView.getPositionForView(view);
                Exam selectedData = (Exam) listView.getItemAtPosition(position);
                ArrayList<ExamMarks> marksArrayList = selectedData.getMarkList();
                Intent intent = new Intent(getActivity(), nexrise.publication.in.nexrise.ProgressReportFeature.StudentDetailsActivity.class);
                intent.putExtra("markList",marksArrayList);
                intent.putExtra(FIRST_NAME,selectedData.getFirstName());
                intent.putExtra(TOTAL_MARKS,selectedData.getTotalMarks());
                intent.putExtra(TOTAL_OBTAINED,selectedData.getTotalObtained());
                intent.putExtra(EXAM_NAME, examesName);
                startActivity(intent);
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

    class NameComparator implements Comparator<Exam>{

        @Override
        public int compare(Exam o1, Exam o2) {
            String studentName1 = o1.getFirstName();
            String studentName2 = o2.getFirstName();
            return studentName1.trim().compareTo(studentName2.trim());
        }
    }
}
