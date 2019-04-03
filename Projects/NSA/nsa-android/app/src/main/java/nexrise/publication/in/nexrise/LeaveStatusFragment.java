package nexrise.publication.in.nexrise;

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
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.michael.easydialog.EasyDialog;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import nexrise.publication.in.nexrise.BeanClass.LeaveStatus;
import nexrise.publication.in.nexrise.BeanClass.LoginObject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.ParentFeatures.Attendance.StatusAttendanceActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link LeaveStatusFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link LeaveStatusFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class LeaveStatusFragment extends Fragment implements Constants {
    LeaveStatus leavestatus;
    View view;
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    LoginObject userObject;

    private OnFragmentInteractionListener mListener;

    public LeaveStatusFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment LeaveStatusFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static LeaveStatusFragment newInstance(String param1, String param2) {
        LeaveStatusFragment fragment = new LeaveStatusFragment();
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

        view = inflater.inflate(R.layout.fragment_leave_status, container, false);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String username = preferences.getString(CURRENT_USERNAME,null);
        String statuscredential = BASE_URL + API_VERSION_ONE + ATTENDANCE +USER + OVERVIEW + username;
        GETUrlConnection GETUrlConnection = new GETUrlConnection(getActivity(), statuscredential,null) {
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("status","response"+response);
                if (response != null) {
                    Log.v("status","response"+response);
                    JSONObject jsonObject = null;
                    try {
                        new StringUtils().checkSession(response);
                        jsonObject = new JSONObject(response);
                        JSONObject data = jsonObject.getJSONObject("data");
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                        try {
                            leavestatus = mapper.readValue(data.toString(),LeaveStatus.class);
                            TextView student = (TextView) view.findViewById(R.id.studentname);
                            TextView attendancepercentage = (TextView) view.findViewById(R.id.attendance_percentage);
                            TextView days_present = (TextView) view.findViewById(R.id.days_present);
                            TextView days_absent = (TextView) view.findViewById(R.id.days_absent);
                            student.setText(leavestatus.getFirstName());
                            attendancepercentage.setText(R.string.att_persentage + leavestatus.getPercent());
                            days_absent.setText(R.string.no_of_days_absent + leavestatus.getIsAbsent());
                            days_present.setText(R.string.no_of_days_present + leavestatus.getIsPresent() +" / " + leavestatus.getTotalDays());
                            LinearLayout layout = (LinearLayout) view.findViewById(R.id.absent_names);
                            layout.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    Intent intent = new Intent(getActivity(), StatusAttendanceActivity.class);
                                    intent.putExtra("studentName", leavestatus.getFirstName());
                                    startActivity(intent);
                                }
                            });
                            customTooltip(view);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    }
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
    public void customTooltip(View view){

        final ImageView help = (ImageView)view.findViewById(R.id.help);
        if(StringUtils.userRole.equalsIgnoreCase(PARENT)){
            help.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                    TextView tooltip = (TextView) view.findViewById(R.id.textView53);
                    tooltip.setText(R.string.parent_attendance);
                    tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                    new EasyDialog(getActivity()).setLayout(view)
                            .setLocationByAttachedView(help)
                            .setGravity(EasyDialog.GRAVITY_BOTTOM)
                            .setTouchOutsideDismiss(true)
                            .setMatchParent(false)
                            .setBackgroundColor(getActivity().getResources().getColor(R.color.colorGreen))
                            .setMarginLeftAndRight(44, 34)
                            .show();
                }
            });
        }else {
            help.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                    TextView tooltip = (TextView) view.findViewById(R.id.textView53);
                    tooltip.setText("Your attendance history and leave details");
                    tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                    new EasyDialog(getActivity()).setLayout(view)
                            .setLocationByAttachedView(help)
                            .setGravity(EasyDialog.GRAVITY_BOTTOM)
                        /*.setAnimationTranslationShow(EasyDialog.DIRECTION_X, 1000, -600, 100, -50, 50, 0)
                        .setAnimationAlphaShow(1000, 0.3f, 1.0f)
                        .setAnimationTranslationDismiss(EasyDialog.DIRECTION_X, 500, -50, 800)
                        .setAnimationAlphaDismiss(500, 1.0f, 0.0f)*/
                            .setTouchOutsideDismiss(true)
                            .setMatchParent(false)
                            .setBackgroundColor(getActivity().getResources().getColor(R.color.colorGreen))
                            .setMarginLeftAndRight(44, 34)
                            .show();
                }
            });
        }
    }


}
