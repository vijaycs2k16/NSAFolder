package nexrise.publication.in.nexrise.HomeworkFeature;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Subject;
import nexrise.publication.in.nexrise.BeanClass.TeacherHomeWork;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.ViewNotesActivity;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link DetailsFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link DetailsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class DetailsFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    TeacherHomeWork homeworkList;
    ArrayList<String> homeworkarray;
    String priority;

    private OnFragmentInteractionListener mListener;

    public DetailsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment DetailsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static DetailsFragment newInstance(String param1, String param2) {
        DetailsFragment fragment = new DetailsFragment();
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
        Log.v("Home","List"+homeworkList.getAssignmentDesc());
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_details, container, false);
        final ListView listView = (ListView)view.findViewById(R.id.details_listview);
        final List<String> key = new ArrayList<String>();
        key.add(getResources().getString(R.string.title));
        key.add(getResources().getString(R.string.subject));
        key.add(getResources().getString(R.string.due_date));
        key.add(getResources().getString(R.string.teacher));
        //key.add("Priority");
       /* if (homeworkList.getAssignmentDesc() != null && !homeworkList.getAssignmentDesc().isEmpty() && !homeworkList.getAssignmentDesc().equals("null"))
            key.add("Description");*/
        homeworkarray = new ArrayList<String>();
        homeworkarray.add(homeworkList.getAssignmentName());
        ArrayList<Subject> selectedSubjectList = new ArrayList<>();
        selectedSubjectList = homeworkList.getSubjects();
        String subjectNames = "";
        if (selectedSubjectList.size() != 0) {
            for (int i = 0; i < (selectedSubjectList.size() - 1); i++)
                subjectNames += selectedSubjectList.get(i).getSubName() + ",";
            subjectNames += selectedSubjectList.get(selectedSubjectList.size() - 1).getSubName() + ".";
        }
        homeworkarray.add(subjectNames);
        homeworkarray.add(new StringUtils().Dateset(homeworkList.getDueDate()));
        homeworkarray.add(homeworkList.getUpdatedUserName());
        //homeworkarray.add(new StringUtils().setPriority(homeworkList.getPriority()));
        if (homeworkList.getAssignmentDesc() != null && !homeworkList.getAssignmentDesc().isEmpty() && !homeworkList.getAssignmentDesc().equals("null")) {
            final View footer = getActivity().getLayoutInflater().inflate(R.layout.description_footer, listView, false);
            listView.addFooterView(footer);
            TextView description = (TextView) footer.findViewById(R.id.desc);
            description.setText(String.valueOf(homeworkList.getAssignmentDesc()));
        }

        DetailsFragmentArrayAdapter arrayAdapter = new DetailsFragmentArrayAdapter(getActivity(), key, homeworkarray);
        Log.v("Ässignment ","attachment "+homeworkList.getAttachments());
       if (homeworkList.getAttachments()!= null && !homeworkList.getAttachments().isEmpty()) {
            final View footer = getActivity().getLayoutInflater().inflate(R.layout.attachment_footer, listView, false);
            listView.addFooterView(footer);
            TextView attach_value = (TextView) footer.findViewById(R.id.attach_value);
            attach_value.setText(String.valueOf(homeworkList.getAttachments().size()));
            footer.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent attach = new Intent(getActivity(), ViewNotesActivity.class);
                    HashMap<String, String> attachments = new HashMap<String, String>();
                    for (int i = 0; i < homeworkList.getAttachments().size(); i++) {
                        String imageUrl = homeworkList.getAttachments().get(i).getId();
                        String fileName = homeworkList.getAttachments().get(i).getFileName();
                        attachments.put(imageUrl, fileName);
                    }
                    attach.putExtra("Files", attachments);
                    attach.putExtra(FROM, "Assignment");
                    startActivity(attach);
                }
            });
        }
        listView.setAdapter(arrayAdapter);
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
}
