package nexrise.publication.in.nexrise.Fragments;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.ParentFeatures.Attendance.ParentAttendanceActivity;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ParentAttendanceFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ParentAttendanceFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ParentAttendanceFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    SharedPreferences preference;
    StringUtils utils;

    private OnFragmentInteractionListener mListener;

    public ParentAttendanceFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ParentAttendanceFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ParentAttendanceFragment newInstance(String param1, String param2) {
        ParentAttendanceFragment fragment = new ParentAttendanceFragment();
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
        final View view = inflater.inflate(R.layout.fragment_fee_management_parent, container, false);
        preference = PreferenceManager.getDefaultSharedPreferences(getActivity());
        utils = new StringUtils();
        final String firstName = preference.getString(FIRST_NAME,null);
        final String className = preference.getString(CLASS_NAME,null);
        final String sectionName = preference.getString(SECTION_NAME,null);
        ImageView icon = (ImageView)view.findViewById(R.id.icon_fragment);
        TextView name = (TextView) view.findViewById(R.id.name_my);
        TextView studyValue = (TextView)view.findViewById(R.id.details);
        TextView info = (TextView)view.findViewById(R.id.info_fragment);
        info.setText(className + "-" + sectionName);
        studyValue.setText(R.string.leave_details);
        name.setText(firstName);
        icon.setImageResource(R.drawable.ic_attendance);
        parentAttendanceActivity(view);
        final ImageView help = (ImageView) view.findViewById(R.id.help);
        utils.customTooltip(getActivity(),help, (String) getResources().getText(R.string.fee_parent_frgment));
        return view;
    }

    private void parentAttendanceActivity(View view) {
        LinearLayout student = (LinearLayout)view.findViewById(R.id.student_info);
        student.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent parentAttendance = new Intent(getActivity(), ParentAttendanceActivity.class);
                getActivity().startActivity(parentAttendance);
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
}