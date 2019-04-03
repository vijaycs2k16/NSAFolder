package nexrise.publication.in.nexrise.HomeworkFeature;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.AssignmentStatus;
import nexrise.publication.in.nexrise.BeanClass.Homework;
import nexrise.publication.in.nexrise.BeanClass.Student;
import nexrise.publication.in.nexrise.BeanClass.TeacherHomeWork;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.HomeworkStatusJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link StatusFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link StatusFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class StatusFragment extends Fragment implements Constants {
    TeacherHomeWork homeworkList;
    ArrayList<Homework> homeworkcomplete;
    ArrayList<Homework> homeworkincomplete;
    String id;
    Homework homeworkincompletedata;
    int size;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    List<AssignmentStatus> listData;
    static StatusFragmentArrayAdapter listAdapter;

    private OnFragmentInteractionListener mListener;

    public StatusFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment StatusFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static StatusFragment newInstance(String param1, String param2) {
        StatusFragment fragment = new StatusFragment();
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
        Bundle bundle = this.getArguments();
        homeworkList = (TeacherHomeWork) bundle.getSerializable("SerializedList");
        assert homeworkList != null;
        id = homeworkList.getId();
        Log.v("id", "asf "+id);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        final View view = inflater.inflate(R.layout.fragment_status, container, false);
        final ExpandableListView expandableListView = (ExpandableListView) view.findViewById(R.id.fragment_status_listview);
        String statusCredential = BASE_URL + API_VERSION_ONE + ASSIGNMENT + DETAILS + id;
        final GETUrlConnection GETUrlConnection = new GETUrlConnection(getActivity(), statusCredential,null) {
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String assignmentresponse) {
                super.onPostExecute(assignmentresponse);
                try {
                    if (assignmentresponse != null) {
                        new StringUtils().checkSession(assignmentresponse);
                        progressBar.setVisibility(View.INVISIBLE);
                        Log.v("assignmentstatus", "statusresponse" + assignmentresponse);
                        HomeworkStatusJsonParser homeworkStatusJsonParser = new HomeworkStatusJsonParser();
                        homeworkStatusJsonParser.getStatus(assignmentresponse);

                        homeworkcomplete = HomeworkStatusJsonParser.completedList;
                        homeworkincomplete = HomeworkStatusJsonParser.incompletedList;
                        size = homeworkcomplete.size() + homeworkincomplete.size();
                        Log.v("total", "student" + size);
                        Log.v("completed ", "students " + homeworkcomplete.size());
                        Log.v("incompleted ", "student " + homeworkincomplete.size());
                        prepareListData();
                        listAdapter = new StatusFragmentArrayAdapter(getActivity(), listData);
                        expandableListView.setAdapter(listAdapter);
                        //listviewClick(expandableListView);
                    } else {
                        progressBar.setVisibility(View.INVISIBLE);
                        TextView noContent = (TextView) view.findViewById(R.id.no_content);
                        noContent.setVisibility(View.VISIBLE);
                    }
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        GETUrlConnection.execute();

        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

    }

    @Override
    public void onDetach() {
        super.onDetach();

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

    private void prepareListData() {
        listData = new ArrayList<AssignmentStatus>();

        AssignmentStatus totalStudents = new AssignmentStatus("Total Students :"+ " " + size+ " " + "Students", new ArrayList<Student>());
        listData.add(totalStudents);

        AssignmentStatus completedStudents = new AssignmentStatus("Completed :"+ " "+ homeworkcomplete.size() + " " + "student(s)", new ArrayList<Student>());
        listData.add(completedStudents);
    //    generateListDataChild(homeworkcomplete);

        AssignmentStatus incompletedStudents = new AssignmentStatus("Incomplete :"+ " "+ homeworkincomplete.size() + " " + "student(s)", new ArrayList<Student>());
        listData.add(incompletedStudents);
        Log.v("Incomplete","Student"+listData.toString());
        generateListDataChild(homeworkincomplete);
    }

    public void generateListDataChild(ArrayList<Homework> homeworkList) {
        Collections.sort(homeworkList, new IncompletedStudentsComparator());

        if(homeworkList.size() > 0) {
            AssignmentStatus assignmentStatus = new AssignmentStatus(homeworkList.get(0).getClassName() + " "+homeworkList.get(0).getSectionName(), new ArrayList<Student>());
            listData.add(assignmentStatus);
        }

        for (int j=0; j<homeworkList.size(); j++) {
            Homework homework = homeworkList.get(j);
            String className = homework.getClassName()+ " "+homework.getSectionName();

            if(listData.get(listData.size()-1).getHeaderName().equals(className)) {
                Student student = new Student();
                student.setClassName(homework.getClassName());
                student.setSection(homework.getSectionName());
                student.setUsername(homework.getUsername());
                student.setFirstname(homework.getFirstName());
                Log.v("Student","name "+homework.getFirstName() + " "+homework.getClassName()+homework.getSectionName());
                student.setAssignmentId(homework.getAssignmentId());
                student.setId(homework.getAssignmentDetailId());
                student.setClassId(homework.getClassId());
                student.setSectionId(homework.getSectionid());

                listData.get(listData.size()-1).getStudentsList().add(student);
            } else {
                AssignmentStatus assignmentStatus = new AssignmentStatus(homework.getClassName() + " "+homework.getSectionName(), new ArrayList<Student>());
                listData.add(assignmentStatus);
                --j;
            }
        }
    }


    public void listviewClick(final ExpandableListView expandableListView){

        /*expandableListView.setOnChildClickListener(new ExpandableListView.OnChildClickListener() {
            @Override
            public boolean onChildClick(ExpandableListView parent, View v, int groupPosition, int childPosition, long id) {
                AssignmentStatus assignmentStatus = (AssignmentStatus) expandableListView.getItemAtPosition(groupPosition);
                Student student = assignmentStatus.getStudentsList().get(childPosition);
                String studentName = student.getFirstname();
                Intent chat = new Intent(getActivity(), TeacherCommentActivity.class);
                chat.putExtra("Homework", homeworkList);
                chat.putExtra("Student", student);
                chat.putExtra("ActionBarTitle", studentName);
                chat.putExtra(FROM, "StatusFragment");
                startActivity(chat);
                getActivity().overridePendingTransition(R.anim.right_to_left_anim, R.anim.exit_animation);

                return false;
            }
        });*/
    }

    @Override
    public void onStart() {
        super.onStart();
    }

    public void search(String text) {
        if(listAdapter != null)
            listAdapter.getFilter().filter(text);
    }
}
