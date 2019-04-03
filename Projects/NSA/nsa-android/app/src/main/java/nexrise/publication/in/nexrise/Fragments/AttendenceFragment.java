package nexrise.publication.in.nexrise.Fragments;

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
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.michael.easydialog.EasyDialog;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import nexrise.publication.in.nexrise.Attendence.AttendanceActivityFragment;
import nexrise.publication.in.nexrise.Attendence.AttendanceHistoryActivity;
import nexrise.publication.in.nexrise.Attendence.LeaveApprovalActivity;
import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.TaxanomyJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.AddClassFragmentAdapter;
import nexrise.publication.in.nexrise.TimetableFeature.AddSectionFragmentAdapter;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link AttendenceFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link AttendenceFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class AttendenceFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    ArrayList<Classes> section;
    String sectionId;
    String classid;
    String className;
    String sectionName;
    View view;
    SharedPreferences preferences;

    private OnFragmentInteractionListener mListener;

    public AttendenceFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment AttendenceFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static AttendenceFragment newInstance(String param1, String param2) {
        AttendenceFragment fragment = new AttendenceFragment();
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
        view = inflater.inflate(R.layout.activity_attendence, container, false);
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        if (StringUtils.taxanomy == null) {
            String Class = BASE_URL + API_VERSION_ONE + TAXANOMY;

            GETUrlConnection url = new GETUrlConnection(getActivity(), Class,null) {
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject responseJson = new JSONObject(response);
                        JSONArray classesArray = responseJson.getJSONArray("data");
                        Log.v("ClassDetails", "" + response);
                        StringUtils.taxanomy = classesArray;
                        TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                        StringUtils.classList = classListJsonparser.getClassDetails(classesArray);
                        Log.v("vlass List", "" + StringUtils.classList);
                        setUpClassSpinner(StringUtils.classList);
                    } catch (JSONException | NullPointerException e) {
                        Toast.makeText(getActivity(), R.string.oops, Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    }
                }
            };
            url.execute();
        } else {
            setUpClassSpinner(StringUtils.classList);
        }

        TextView cdate = (TextView)view.findViewById(R.id.classtime);
        TextView myLeaves = (TextView)view.findViewById(R.id.leaves);

        Button submitButton = (Button)view.findViewById(R.id.attendance_submit_button);
        getClassAttendance(submitButton);
        // setUpSpinner(classList);

        Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy");
        String date = dateFormat.format(now);
        cdate.setText(date);
        renderView();

        /*ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setElevation(0);
            actionBar.setTitle("Attendance Management");
        }*/

        myLeaves.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), AttendanceActivityFragment.class);
                startActivity(intent);
            }
        });
        customTooltip();
        return view;
    }

    private void renderView() {
        String username = preferences.getString(CURRENT_USERNAME, null);
        String leaveApprovalCredential = BASE_URL + API_VERSION_ONE + LEAVES + EMP + REQUESTED + username;
        GETUrlConnection getUrlConnection = new GETUrlConnection(getActivity(), leaveApprovalCredential,null) {
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("response ", " leave" + response);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject mainObject = new JSONObject(response);
                    JSONArray dataArray = mainObject.getJSONArray(DATA);
                    if (dataArray.length() != 0) {
                        LinearLayout approvalLayout = (LinearLayout)view.findViewById(R.id.approval_layout);
                        approvalLayout.setVisibility(View.VISIBLE);
                        approvalLayout.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                Intent intent = new Intent(getActivity(), LeaveApprovalActivity.class);
                                startActivity(intent);
                            }
                        });
                    }
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getUrlConnection.execute();
    }

    private void customTooltip() {
        final ImageView help = (ImageView)view.findViewById(R.id.help);
        help.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                TextView tooltip = (TextView)view.findViewById(R.id.textView53);
                tooltip.setText(R.string.emp_attendance);
                tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                new EasyDialog(getActivity()).setLayout(view)
                        .setLocationByAttachedView(help)
                        .setGravity(EasyDialog.GRAVITY_BOTTOM)
                        .setTouchOutsideDismiss(true)
                        .setMatchParent(false)
                        .setBackgroundColor(getActivity().getResources().getColor(R.color.colorGreen))
                        .setMarginLeftAndRight(44,34)
                        .show();
            }
        });
    }

    private void getClassAttendance(Button submitButton) {
        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), AttendanceHistoryActivity.class);
                intent.putExtra("classId", classid);
                intent.putExtra("sectionId", sectionId);
                intent.putExtra("className",className);
                intent.putExtra("sectionName",sectionName);
                startActivity(intent);
            }
        });
    }

    private void setUpClassSpinner(final ArrayList<Classes> classList) {
        final Spinner spinner = (Spinner)view.findViewById(R.id.classspin);

        AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(getActivity(), classList);
        spinner.setAdapter(adapter);

        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                classid = classList.get(position).getId();
                className =classList.get(position).getLabel();

                Log.v("class_id","current "+classid);
                Classes selectedClass = classList.get(position);
                section = selectedClass.getSections();
                Log.v("class9",""+selectedClass.getSections());
                AddSectionFragmentAdapter adapter = new AddSectionFragmentAdapter(getActivity(), section);
                Spinner spinner1 = (Spinner)AttendenceFragment.this.view.findViewById(R.id.sectionspin);
                spinner1.setAdapter(adapter);
                spinner1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                        sectionId = section.get(position).getId();
                        sectionName = section.get(position).getLabel();
                        Log.v("section_id","current"+sectionId);
                        Log.v("Spinner "," "+sectionId);
                    }
                    @Override
                    public void onNothingSelected(AdapterView<?> parent) {
                    }
                });
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
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
