package nexrise.publication.in.nexrise.Attendence;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
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
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.StudentAttendanceHistory;
import nexrise.publication.in.nexrise.BeanClass.StudentAttendanceObject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link AttendanceLeaveHistory.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link AttendanceLeaveHistory#newInstance} factory method to
 * create an instance of this fragment.
 */
public class AttendanceLeaveHistory extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    List<StudentAttendanceObject> studentAttendanceObjects;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public AttendanceLeaveHistory() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment AttendanceLeaveHistory.
     */
    // TODO: Rename and change types and number of parameters
    public static AttendanceLeaveHistory newInstance(String param1, String param2) {
        AttendanceLeaveHistory fragment = new AttendanceLeaveHistory();
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
        EditText search = (EditText) view.findViewById(R.id.text);
        search.setHint(R.string.search);

        Bundle arguments = getArguments();
        String classId = arguments.getString("classId");
        String sectionId = arguments.getString("sectionId");

        String url = BASE_URL + API_VERSION_ONE + ATTENDANCE + HISTORY + "?" + CLASS_ID + "=" + classId +"&" +SECTION_ID +"=" +sectionId;
        Log.v("URL "," as0 "+url);

        GETUrlConnection getAttendanceHistory = new GETUrlConnection(getActivity(), url,null){
            ProgressBar loading = (ProgressBar)view.findViewById(R.id.loading_bar);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                loading.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                if(response != null) {
                    loading.setVisibility(View.INVISIBLE);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject json = new JSONObject(response);
                        JSONArray data = json.getJSONArray(DATA);

                        ObjectMapper objectMapper = new ObjectMapper();
                        objectMapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                        List<StudentAttendanceHistory> attendanceHistories = objectMapper.readValue(data.toString(), TypeFactory.collectionType(List.class, StudentAttendanceHistory.class));
                    } catch (JSONException | IOException e) {
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    }
                } else {
                    TextView noContent = (TextView)view.findViewById(R.id.no_content);
                    noContent.setVisibility(View.VISIBLE);
                    loading.setVisibility(View.INVISIBLE);
                }
            }
        };
        getAttendanceHistory.execute();
     /*   for(AttendenceObject attendenceObject : attendanceList) {
         *//*   if(className.equals(attendenceObject.getClassCode()) && sectionName.equals(attendenceObject.getSectionCode())) {
                studentAttendanceObjects = attendenceObject.getStudentAttendanceObjects();
            }*//*
        }
*/
        ListView listview = (ListView)  view.findViewById(R.id.leave_list);
      /*  AttendanceLeaveArrayAdapter adapter = new AttendanceLeaveArrayAdapter(getActivity(), studentAttendanceObjects);
        listview.setAdapter(adapter);
        listviewClick(listview);*/
        return view;
    }


    private void listviewClick(final ListView listView) {
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                int pos =  listView.getPositionForView(view);
                TextView viewById = (TextView)parent.getChildAt(position).findViewById(R.id.student_no);
                TextView date = (TextView)view.findViewById(R.id.student_no);
                String text = date.getText().toString();
                for(StudentAttendanceObject object : studentAttendanceObjects) {

                    if(object.getRno().equals(text)) {
                        LayoutInflater classLayoutInflater = getActivity().getLayoutInflater();
                        final View classAlertDialogView = classLayoutInflater.inflate(R.layout.fragment_leave_history_alert, null);
                        TextView present = (TextView) classAlertDialogView.findViewById(R.id.student_presents);
                        present.setText(object.getPresent());
                        TextView absent = (TextView) classAlertDialogView.findViewById(R.id.student_absents);
                        absent.setText(object.getAbsent());
                        TextView att = (TextView) classAlertDialogView.findViewById(R.id.student_attendance);
                        att.setText(object.getAttendance());
                        AlertDialog.Builder classAlertBuilder = new AlertDialog.Builder(getActivity());
                        classAlertBuilder.setView(classAlertDialogView);
                        final AlertDialog classAlertDialog = classAlertBuilder.create();
                        classAlertDialog.show();
                    }
                }

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
