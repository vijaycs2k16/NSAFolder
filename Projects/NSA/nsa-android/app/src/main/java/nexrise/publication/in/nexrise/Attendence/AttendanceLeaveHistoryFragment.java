package nexrise.publication.in.nexrise.Attendence;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AlertDialog;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.StudentAttendanceHistory;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link AttendanceLeaveHistoryFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link AttendanceLeaveHistoryFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class AttendanceLeaveHistoryFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    static AttendanceLeaveArrayAdapter adapter;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public AttendanceLeaveHistoryFragment() {
        // Required empty public constructor
    }

    // TODO: Rename and change types and number of parameters
    public static AttendanceLeaveHistoryFragment newInstance(String param1, String param2) {
        AttendanceLeaveHistoryFragment fragment = new AttendanceLeaveHistoryFragment();
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
        final View view = inflater.inflate(R.layout.fragment_attendance_leave_history, container, false);
        //inorder to avoid keypad on starting of activity
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);
        EditText search = (EditText) view.findViewById(R.id.text);
        search.setHint(R.string.search);

        Bundle arguments = getArguments();
        String classId = arguments.getString("classId");
        String sectionId = arguments.getString("sectionId");

        String url = BASE_URL + API_VERSION_ONE + ATTENDANCE + HISTORY + "?" + CLASS_ID + "=" + classId +"&" +SECTION_ID +"=" +sectionId + "&startDate=" + "" + "&endDate=" + "" ;

        Log.v("Att ","url "+url);
        GETUrlConnection getAttendanceHistory = new GETUrlConnection(getActivity(), url,null){
            ProgressBar loading = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                loading.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("leave","history "+response);
                if(response != null) {
                    loading.setVisibility(View.INVISIBLE);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject json = new JSONObject(response);
                        JSONArray data = json.getJSONArray(DATA);
                        if(data.length() != 0) {
                            ObjectMapper objectMapper = new ObjectMapper();
                            objectMapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                            List<StudentAttendanceHistory> attendanceHistories = objectMapper.readValue(data.toString(), TypeFactory.collectionType(List.class, StudentAttendanceHistory.class));
                            ListView listview = (ListView) view.findViewById(R.id.leave_list);
                            Collections.sort(attendanceHistories, new AttendanceComparator());
                            adapter = new AttendanceLeaveArrayAdapter(getActivity(), attendanceHistories);
                            listview.setAdapter(adapter);
                            listviewClick(listview);
                        } else {
                            noContent.setVisibility(View.VISIBLE);
                            loading.setVisibility(View.INVISIBLE);
                        }
                    } catch (JSONException | IOException e) {
                        noContent.setVisibility(View.VISIBLE);
                        loading.setVisibility(View.INVISIBLE);
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    }
                } else {
                    noContent.setVisibility(View.VISIBLE);
                    loading.setVisibility(View.INVISIBLE);
                }
            }
        };
        getAttendanceHistory.execute();

        final EditText editText = (EditText)view.findViewById(R.id.text);
        editText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
             try {
                 s = editText.getText().toString().toLowerCase();
                 adapter.getFilter().filter(s);
             } catch (NullPointerException e){
                 e.printStackTrace();
             }

            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
        return view;
    }

    private void listviewClick(final ListView listView) {
        try {
            LayoutInflater classLayoutInflater = getActivity().getLayoutInflater();
            final View classAlertDialogView = classLayoutInflater.inflate(R.layout.fragment_leave_history_alert, null);
            final TextView present = (TextView) classAlertDialogView.findViewById(R.id.student_presents);
            final TextView absent = (TextView) classAlertDialogView.findViewById(R.id.student_absents);
            final TextView att = (TextView) classAlertDialogView.findViewById(R.id.student_attendance);
            final AlertDialog.Builder classAlertBuilder = new AlertDialog.Builder(getActivity());
            classAlertBuilder.setView(classAlertDialogView);
            final AlertDialog classAlertDialog = classAlertBuilder.create();

            listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                    StudentAttendanceHistory studentAttendance = (StudentAttendanceHistory) listView.getItemAtPosition(position);
                    present.setText(String.valueOf(studentAttendance.getPresent()));
                    absent.setText(String.valueOf(studentAttendance.getAbsent()));
                    att.setText(String.valueOf(studentAttendance.getPercent()));
                    classAlertDialog.show();
                }
            });
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
     public class AttendanceComparator implements Comparator<StudentAttendanceHistory> {


        @Override
        public int compare(StudentAttendanceHistory student1, StudentAttendanceHistory student2) {
            String student1Name = student1.getFirstName();
            String student2Name = student2.getFirstName();
            return student1Name.trim().compareTo(student2Name.trim());
        }
    }

}
