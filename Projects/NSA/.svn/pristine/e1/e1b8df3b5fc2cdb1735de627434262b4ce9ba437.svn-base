package nexrise.publication.in.nexrise.Attendence;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.SharedPreferences;
import android.graphics.PorterDuff;
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
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.message.BasicHeader;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Attendance;
import nexrise.publication.in.nexrise.BeanClass.ClassAndSection;
import nexrise.publication.in.nexrise.BeanClass.Devicetoken;
import nexrise.publication.in.nexrise.BeanClass.StudentAttendanceObject;
import nexrise.publication.in.nexrise.Common.BaseFragment;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.UpdateAttendanceParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
/*Created by praga on 21-01-2017 on my birthday!!!!*/
/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link AttendanceRecordFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link AttendanceRecordFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class AttendanceRecordFragment extends BaseFragment implements Constants {
    String date;
    ArrayList<Attendance> attendanceList;
    ArrayList<Attendance> attendances;
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    List<StudentAttendanceObject> studentAttendanceObjects;
    String classId;
    String sectionId;
    String className;
    String sectionName;
    CheckBox presentCheck;
    CheckBox absentCheck;
    boolean smsState = false;
    boolean pushState = false;
    boolean emailState = false;
    boolean notify_hostelers = false;
    String present = "";
    String absent = "";
    View view;
    static AttendanceArrayAdapter adapter;
    StringUtils utils;
    Button submit;
    String attendance_id;
    CheckBox sms;
    CheckBox push;
    CheckBox email;
    TextView textView;
    EditText search;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    SharedPreferences preferences;

    private OnFragmentInteractionListener mListener;

    public AttendanceRecordFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment AttendanceRecordFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static AttendanceRecordFragment newInstance(String param1, String param2) {
        AttendanceRecordFragment fragment = new AttendanceRecordFragment();
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

        Bundle arguments = getArguments();
        classId = arguments.getString("classId");
        sectionId = arguments.getString("sectionId");
        className = arguments.getString("className");
        sectionName = arguments.getString("sectionName");
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.fragment_attendance_record, container, false);
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);
        utils = new StringUtils();
        Log.v("sent","classid"+classId);
        final Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("ddMMM,yyyy");
        date = dateFormat.format(now);
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        submit = (Button)  view.findViewById(R.id.submit_button);
        submit.setText(R.string.record);
        textView = (TextView) view.findViewById(R.id.text1);
        textView.setText(R.string.uncheck_absentees);
        search = (EditText) view.findViewById(R.id.text);

        String attendanceCredential = BASE_URL + API_VERSION_ONE + ATTENDANCE + CLASS + classId + SECTION + sectionId + "/"+date ;
        Log.v("Attendance","Record"+attendanceCredential);

        GETUrlConnection url = new GETUrlConnection(getActivity(), attendanceCredential,null) {
            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.progress_bar);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);

                if (response != null) {
                    JSONObject jsonObject = null;
                    try {
                        utils.checkSession(response);
                        jsonObject = new JSONObject(response);
                        Object dataObject = jsonObject.get(DATA);

                        if (dataObject instanceof  JSONObject) {
                            final JSONObject childObject = jsonObject.getJSONObject(DATA);
                            JSONArray dataArray = childObject.getJSONArray(DATA);

                            if(dataArray.length() !=0) {
                                JSONObject dataArrayObject =  dataArray.getJSONObject(0);
                                attendance_id = dataArrayObject.getString("attendance_id");
                                Log.v("Attendance","id"+attendance_id);

                                String updateAttendance = BASE_URL + API_VERSION_ONE + ATTENDANCE + DETAILS + attendance_id;
                                GETUrlConnection updateUrl = new GETUrlConnection(getActivity(),updateAttendance,null) {
                                    @Override
                                    protected void onPostExecute(String response) {
                                        super.onPostExecute(response);
                                        progressBar.setVisibility(View.INVISIBLE);
                                        Log.v("updated","Attendance"+response);
                                        try {
                                            Toast.makeText(getActivity(),childObject.getString("message"),Toast.LENGTH_LONG).show();
                                            JSONObject jsonObject1 = new JSONObject(response);
                                            JSONArray data = jsonObject1.getJSONArray(DATA);
                                            if (data.length() != 0) {
                                                progressBarLayout.setVisibility(View.GONE);
                                                UpdateAttendanceParser updateAttendanceParser = new UpdateAttendanceParser();
                                                attendanceList =  updateAttendanceParser.updateAttendance(data);
                                                ListView listview = (ListView) view.findViewById(R.id.attendance_list);
                                                Collections.sort(attendanceList, new AttendanceComparator());
                                                adapter = new AttendanceArrayAdapter(getActivity(), attendanceList);
                                                listview.setAdapter(adapter);
                                                submit.setText(R.string.update);

                                            } else
                                                displayNothingToShow(progressBarLayout, progressBar, noContent);
                                        } catch (Exception e) {
                                            displayNothingToShow(progressBarLayout, progressBar, noContent);
                                        }
                                    }
                                };
                                updateUrl.execute();
                            } else
                                displayNothingToShow(progressBarLayout, progressBar, noContent);

                        } else if(dataObject instanceof JSONArray) {
                            progressBar.setVisibility(View.INVISIBLE);
                            JSONArray data = jsonObject.getJSONArray(DATA);
                            if (data.length() != 0) {
                                progressBarLayout.setVisibility(View.GONE);
                                ObjectMapper mapper = new ObjectMapper();
                                mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                                try {
                                    attendanceList = mapper.readValue(data.toString(), TypeFactory.collectionType(List.class, Attendance.class));
                                    ListView listview = (ListView) view.findViewById(R.id.attendance_list);
                                    Collections.sort(attendanceList, new AttendanceComparator());
                                    adapter = new AttendanceArrayAdapter(getActivity(), attendanceList);
                                    listview.setAdapter(adapter);
                                    submit.setText(R.string.submit);
                                } catch (IOException e) {
                                    displayNothingToShow(progressBarLayout, progressBar, noContent);
                                }
                            } else {
                                displayNothingToShow(progressBarLayout, progressBar, noContent);
                            }
                        }
                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    } catch(Exception e){
                        displayNothingToShow(progressBarLayout, progressBar, noContent);
					}
                } else
                    displayNothingToShow(progressBarLayout, progressBar, noContent);
            }
        };

        url.execute();

        presentCheck = (CheckBox) view.findViewById(R.id.notifypresent);
        presentCheck.setText(R.string.notify_presentees);
        absentCheck = (CheckBox) view.findViewById(R.id.notifyabesent);
        absentCheck.setText(R.string.notify_absentees);
        final ListView listview = (ListView)  view.findViewById(R.id.attendance_list);
        listview.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Attendance attendance = (Attendance) listview.getItemAtPosition(position);
                CheckBox checkBox = (CheckBox) view.findViewById(R.id.checked_list);
                if(!checkBox.isChecked()) {
                    updatepresent(attendance,false);
                    Log.v("Altered","attendance"+attendances);
                } else {
                    updatepresent(attendance,true);
                }
            }
        });

        String permission = utils.getPermission(getActivity(), "attendance_information");
        if(permission.contains("manage") || permission.contains("manageAll")) {
            submit.setEnabled(true);
            presentCheck.setEnabled(true);
            absentCheck.setEnabled(true);
        } else {
            submit.getBackground().setColorFilter(null);
            submit.getBackground().setColorFilter(getResources().getColor(R.color.colorLightGrey), PorterDuff.Mode.MULTIPLY);
            submit.setEnabled(false);
            presentCheck.setEnabled(false);
            absentCheck.setEnabled(false);
        }

        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int presentcount = 0;
                int size = attendanceList.size();
                for (int i=0; i<size; i++){
                    if (attendanceList.get(i).getIsPresent()){
                        presentcount++;
                    }
                }
                final int presentingcount = presentcount;
                final int absentcount = size - presentcount;

                if (presentCheck.isChecked() | absentCheck.isChecked()){
                    final AlertDialog.Builder channelAlertBuilder = new AlertDialog.Builder(getActivity());
                    final LayoutInflater checkboxLayoutInflater = LayoutInflater.from(getActivity());
                    String featurecredential = BASE_URL + API_VERSION_ONE + FEATURE; //CREATE_ATTENDANCE;
                    BasicHeader[] header = utils.headers(getActivity(),CREATE_ATTENDANCE);
                    GETUrlConnection url = new GETUrlConnection(getActivity(),featurecredential,header){
                        ProgressDialog progressDialog = new ProgressDialog(getActivity(), ProgressDialog.STYLE_SPINNER);
                        @Override
                        protected void onPreExecute() {
                            super.onPreExecute();
                            progressDialog.setMessage(getResources().getText(R.string.fetching_detils));
                            progressDialog.show();
                        }

                        @Override
                        protected void onPostExecute(String assignmentresponse) {
                            super.onPostExecute(assignmentresponse);
                            Log.v("feature ","featureresponse "+assignmentresponse);
                            if(progressDialog.isShowing()) progressDialog.dismiss();
                            JSONObject jsonObject = null;
                            try {
                                utils.checkSession(assignmentresponse);
                                jsonObject = new JSONObject(assignmentresponse);
                                JSONObject data = jsonObject.getJSONObject(DATA);
                                Boolean smsStatus = data.getBoolean("sms");
                                Boolean emailStatus =data.getBoolean("email");
                                Boolean pushStatus = data.getBoolean("push");
                                notify_hostelers = data.getBoolean("notify_hostelers");
                                final View checkboxDialogView = checkboxLayoutInflater.inflate(R.layout.checkbox_dialog, null);
                                channelAlertBuilder.setView(checkboxDialogView);
                                final AlertDialog checkboxAlertDialog = channelAlertBuilder.create();
                                checkboxAlertDialog.show();
                                TextView presentcountText = (TextView) checkboxDialogView.findViewById(R.id.present_count);
                                TextView absentcountText = (TextView) checkboxDialogView.findViewById(R.id.absent_count);
                                presentcountText.setText("Present : " + presentingcount);
                                absentcountText.setText("Absent : " + absentcount);
                                Button ok = (Button)checkboxDialogView.findViewById(R.id.checkbox_ok);
                                final TextView notificationTitle = (TextView) checkboxDialogView.findViewById(R.id.notificationtitle);
                                notificationTitle.setVisibility(View.VISIBLE);
                                  sms = (CheckBox)checkboxDialogView.findViewById(R.id.sms);
                                  push = (CheckBox)checkboxDialogView.findViewById(R.id.push);
                                  email = (CheckBox)checkboxDialogView.findViewById(R.id.email);
                                if (pushStatus)
                                    push.setVisibility(View.VISIBLE);
                                if(smsStatus)
                                    sms.setVisibility(View.VISIBLE);
                                if (emailStatus)
                                    email.setVisibility(View.VISIBLE);
                                ok.setOnClickListener(new View.OnClickListener() {
                                    @Override
                                    public void onClick(View v) {
                                        if(sms.isChecked())
                                            smsState = true;
                                        if(push.isChecked())
                                            pushState = true;
                                        if(email.isChecked())
                                            emailState = true;
                                        checkboxAlertDialog.dismiss();
                                        if(submit.getText().toString().equalsIgnoreCase("submit"))
                                            statusUpdate();
                                        else
                                            updateAttendance();
                                    }
                                });
                            } catch (NullPointerException | JSONException  e) {
                                e.printStackTrace();
                            } catch (SessionExpiredException e) {
                                e.handleException(getActivity());
                            }
                        }
                    };
                    if(isConnected())
                        url.execute();
                    else
                        Toast.makeText(getActivity(), R.string.internet_connection_check, Toast.LENGTH_SHORT).show();
                }
                else {
                    final AlertDialog.Builder channelAlertBuilder = new AlertDialog.Builder(getActivity());
                    final LayoutInflater checkboxLayoutInflater = LayoutInflater.from(getActivity());
                    final View checkboxDialogView = checkboxLayoutInflater.inflate(R.layout.checkbox_dialog, null);
                    channelAlertBuilder.setView(checkboxDialogView);
                    final AlertDialog checkboxAlertDialog = channelAlertBuilder.create();
                    checkboxAlertDialog.show();
                    TextView presentcountText = (TextView) checkboxDialogView.findViewById(R.id.present_count);
                    TextView absentcountText = (TextView) checkboxDialogView.findViewById(R.id.absent_count);
                    presentcountText.setText("Present : " + presentingcount);
                    absentcountText.setText("Absent : " + absentcount);
                    Button ok = (Button)checkboxDialogView.findViewById(R.id.checkbox_ok);
                    ok.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            checkboxAlertDialog.dismiss();
                            if(submit.getText().toString().equalsIgnoreCase("submit"))
                                statusUpdate();
                            else
                                updateAttendance();
                        }
                    });
                }
            }
        });

        final EditText editText = (EditText)view.findViewById(R.id.text);
        editText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                s = editText.getText().toString().toLowerCase();
                try {
                    adapter.getFilter().filter(s);
                } catch (NullPointerException e){
                    e.printStackTrace();
                }
                Log.v("Text ","watcher"+s);
            }
            @Override
            public void afterTextChanged(Editable s) {
            }
        });
        return view;
    }
    
    public void statusUpdate(){
        JSONObject saveAttendance = createJson();
        Log.v("SAVE ","Attendanceee "+saveAttendance);
        BasicHeader[] headers = utils.headers(getActivity(), CREATE_ATTENDANCE);
        String attendanceUpdate = BASE_URL + API_VERSION_ONE + ATTENDANCE ;
        POSTUrlConnection urlConnection = new POSTUrlConnection(saveAttendance, attendanceUpdate, headers, getActivity()){
            ProgressDialog dialog = new ProgressDialog(getActivity(), ProgressDialog.STYLE_SPINNER);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                dialog.setMessage(getResources().getText(R.string.saving_attendance));
                dialog.setCancelable(false);
                dialog.setCanceledOnTouchOutside(false);
                dialog.show();
            }
            @Override
            protected void onPostExecute(String success) {
                super.onPostExecute(success);
                Log.v("post", "post" + success);
                dialog.dismiss();
                if (success != null) {
                    try {
                        JSONObject responseObject = new JSONObject(success);
                        Boolean value = responseObject.getBoolean(SUCCESS);
                        if (value) {
                            utils.checkSession(success);
                            Toast.makeText(getActivity(), R.string.attendance_record, Toast.LENGTH_SHORT).show();
                            getActivity().finish();
                        } else
                            Toast.makeText(getActivity(), R.string.status_not_updated, Toast.LENGTH_SHORT).show();
                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    } catch (Exception e){
                        e.printStackTrace();
                    }

                } else {
                    Toast.makeText(getActivity(), R.string.status_not_updated, Toast.LENGTH_SHORT).show();
                }
            }
        };
        if(isConnected())
            urlConnection.execute();
        else
            Toast.makeText(getActivity(), R.string.internet_connection_check, Toast.LENGTH_SHORT).show();
    }

    public void updateAttendance(){
        JSONObject saveAttendance = createJson();
        BasicHeader[] headers = utils.headers(getActivity(), CREATE_ATTENDANCE);
        String attendanceUpdate = BASE_URL + API_VERSION_ONE + ATTENDANCE + attendance_id ;
        UPDATEUrlConnection urlConnection = new UPDATEUrlConnection(getActivity(), attendanceUpdate, headers, saveAttendance){
            ProgressDialog dialog = new ProgressDialog(getActivity(), ProgressDialog.STYLE_SPINNER);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                dialog.setMessage(getResources().getText(R.string.updating_attendance));
                dialog.setCancelable(false);
                dialog.setCanceledOnTouchOutside(false);
                dialog.show();
            }
            @Override
            protected void onPostExecute(String success) {
                super.onPostExecute(success);
                Log.v("Update", "response" + success);
                dialog.dismiss();
                if (success != null) {
                    try {
                        JSONObject responseObject = new JSONObject(success);
                        Boolean value = responseObject.getBoolean(SUCCESS);
                        JSONObject data = responseObject.getJSONObject(DATA);
                        if (value) {
                            utils.checkSession(success);
                            Toast.makeText(getActivity(), data.getString("message"), Toast.LENGTH_SHORT).show();
                            getActivity().finish();
                        } else {
                            dialog.cancel();
                            Toast.makeText(getActivity(), R.string.status_not_updated, Toast.LENGTH_SHORT).show();
                        }
                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    } catch (Exception e){
                        e.printStackTrace();
                    }

                } else {
                    Toast.makeText(getActivity(), R.string.status_not_updated, Toast.LENGTH_SHORT).show();
                }
            }
        };
        if(isConnected())
            urlConnection.execute();
        else
            Toast.makeText(getActivity(), R.string.internet_connection_check, Toast.LENGTH_SHORT).show();
    }

    public JSONObject createJson(){
        Log.v("date", ""+ date);
        JSONObject attendanceObject =  new JSONObject();
        JSONArray data = new JSONArray();
        try {
            attendanceObject.put("classId",classId);
            attendanceObject.put("className",className);
            attendanceObject.put("sectionId",sectionId);
            attendanceObject.put("sectionName",sectionName);
            attendanceObject.put("updatedBy",preferences.getString(CURRENT_USERNAME,null));
            attendanceObject.put("updatedUsername",preferences.getString(FIRST_NAME,null));//not needed for put call only for post call
            attendanceObject.put("attendanceDate",utils.getCurrentDate1());//not needed for put call only for post call
            attendanceObject.put("recordedBy",preferences.getString(CURRENT_USERNAME,null));//not needed for put call only for post call
            attendanceObject.put("recordedUsername",preferences.getString(FIRST_NAME,null));//not needed for put call only for post call
            JSONObject notify = new JSONObject();
            notify.put("sms",smsState);
            notify.put("email",emailState);
            notify.put("push",pushState);
            notify.put("notifyHostelers",notify_hostelers);

            for (int i = 0;i<attendanceList.size();i++) {
                JSONArray deviceTokenAry = new JSONArray();
                JSONObject attendancedetails = new JSONObject();
                attendancedetails.put("id", attendanceList.get(i).getId());
                attendancedetails.put("tenantId", attendanceList.get(i).getTenantId());
                attendancedetails.put("schoolId", attendanceList.get(i).getSchoolId());
                attendancedetails.put("attendanceId", attendanceList.get(i).getAttendanceId());
                attendancedetails.put("userName", attendanceList.get(i).getUserName());
                attendancedetails.put("firstName", attendanceList.get(i).getFirstName());
                attendancedetails.put("classId", attendanceList.get(i).getClassId());
                attendancedetails.put("primaryPhone", attendanceList.get(i).getPrimaryPhone());
                attendancedetails.put("className", attendanceList.get(i).getClassName());
                attendancedetails.put("sectionId", attendanceList.get(i).getSectionId());
                attendancedetails.put("sectionName", attendanceList.get(i).getSectionName());
                attendancedetails.put("updatedBy", preferences.getString(CURRENT_USERNAME,null));
                attendancedetails.put("updatedDate", utils.getCurrentDate());
                attendancedetails.put("updatedUsername", preferences.getString(FIRST_NAME,null));
                attendancedetails.put("isPresent", attendanceList.get(i).getIsPresent());
                if(attendanceList.get(i).getHostel() != null && !attendanceList.get(i).getHostel().toString().equals("null"))
                    attendancedetails.put("isHostel",attendanceList.get(i).getHostel());
                else
                    attendancedetails.put("isHostel",false);
                attendancedetails.put("attendanceDate",utils.getCurrentDate1());
                attendancedetails.put("recordedDate", utils.getCurrentDate1());
                attendancedetails.put("recordedBy", preferences.getString(CURRENT_USERNAME,null));
                attendancedetails.put("recordedUsername",preferences.getString(FIRST_NAME,null));
                attendancedetails.put("remarks", attendanceList.get(i).getRemarks());
                    JSONArray classArray = new JSONArray();
                if(submit.getText().toString().equalsIgnoreCase("submit")) {
                    List<ClassAndSection> classAndSectionList = attendanceList.get(i).getClasses();
                    for (int j = 0; j < classAndSectionList.size(); j++) {
                        JSONObject classDetails = new JSONObject();
                        classDetails.put("class_id", classAndSectionList.get(j).getClass_id());
                        classDetails.put("class_name", classAndSectionList.get(j).getClass_name());
                        classDetails.put("section_id", classAndSectionList.get(j).getSection_id());
                        classDetails.put("section_name", classAndSectionList.get(j).getSection_name());
                        classArray.put(classDetails);
                    }
                    ArrayList<Devicetoken> deviceToken = attendanceList.get(i).getDeviceToken();

                    if(deviceToken != null) {
                        for (int k = 0; k < deviceToken.size(); k++) {
                            JSONObject deviceTokenObj = new JSONObject();
                            deviceTokenObj.put("registration_id", deviceToken.get(k).getRegistration_id());
                            deviceTokenObj.put("endpoint_arn", deviceToken.get(k).getEndpoint_arn());
                            deviceTokenAry.put(deviceTokenObj);
                        }
                    }
                    attendancedetails.putOpt("deviceToken", deviceTokenAry);
                    attendancedetails.put("mediaName", attendanceList.get(i).getMediaName());
                } else {
                    JSONObject classDetails = new JSONObject();
                    classDetails.put("class_id", classId);
                    classDetails.put("class_name", className);
                    classDetails.put("section_id", sectionId);
                    classDetails.put("section_name", sectionName);
                    classArray.put(classDetails);
                    JSONArray mediaName = new JSONArray();
                    if(pushState)
                        mediaName.put("push");
                    if(smsState)
                        mediaName.put("sms");
                    if(emailState)
                        mediaName.put("email");
                    attendancedetails.put("mediaName",mediaName);
                    attendancedetails.put("admissionNo", attendanceList.get(i).getAdmissionNo());
                    attendancedetails.put("academicYear", attendanceList.get(i).getAcademicYear());
                    attendancedetails.put("deviceToken", attendanceList.get(i).getTokens());
                }
                    attendancedetails.put("classes", classArray);
                data.put(attendancedetails);
            }

            attendanceObject.put("users",data);
            attendanceObject.put("notify",notify);
            JSONObject notifyTo = new JSONObject();
            notifyTo.put("status","Sent");
            attendanceObject.put("notifyTo",notifyTo);
            if (presentCheck.isChecked())
                present = "Present";
            if (absentCheck.isChecked())
                absent = "Absent";
            JSONArray notifiedTo = new JSONArray();
            if(!present.isEmpty() || !absent.isEmpty()){
                notifiedTo.put(present);
                notifiedTo.put(absent);
            }
            attendanceObject.put("notifiedTo",notifiedTo);
        } catch (JSONException | NullPointerException e) {
          e.printStackTrace();
        }
        Log.v("attendanceobject","response"+attendanceObject.toString());
        return attendanceObject;
    }

    private void displayNothingToShow(RelativeLayout progressBarLayout, ProgressBar progressBar, TextView noContent) {
        if (!progressBarLayout.isShown())
            progressBarLayout.setVisibility(View.VISIBLE);
        if (progressBar.isShown())
            progressBar.setVisibility(View.INVISIBLE);
        if (!noContent.isShown())
            noContent.setVisibility(View.VISIBLE);
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
    void updatepresent(Attendance attendance,boolean value){
        for (int i=0;i<attendanceList.size();i++){
            if (attendanceList.get(i).getFirstName().equals(attendance.getFirstName())){
                attendanceList.get(i).setIsPresent(value);
                break;
            }
        }
    }

    private class AttendanceComparator implements Comparator<Attendance> {
        @Override
        public int compare(Attendance student1, Attendance student2) {
            String student1Attendance  = student1.getFirstName();
            String student2Attendance = student2.getFirstName();
            return student1Attendance.trim().compareTo(student2Attendance.trim());
        }
    }
}

