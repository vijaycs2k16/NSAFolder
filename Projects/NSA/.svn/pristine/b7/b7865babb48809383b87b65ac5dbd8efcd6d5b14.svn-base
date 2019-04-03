package nexrise.publication.in.nexrise.Attendence;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.message.BasicHeader;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import nexrise.publication.in.nexrise.BeanClass.LeaveApproval;
import nexrise.publication.in.nexrise.BeanClass.LeaveType;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.DueDateActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ApplyLeaveActivity extends AppCompatActivity implements Constants {

    Context context;
    static View textview;
    String fromDate = "";
    String toDate = "";
    EditText reason;
    TextView from;
    TextView to;
    boolean updatable = false;
    SharedPreferences preferences;
    String leaveTypeId;
    String leaveTypeeName;
    LeaveApproval leaveApproval;
    Button update;
    Toast toast;
    Button cancel;
    String updateCredential;
    BasicHeader[] header;
    String userRole;
    StringUtils stringUtils;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getIntent().hasExtra("Updatable")){
            updatable = getIntent().getBooleanExtra("Updatable",false);
            leaveApproval = (LeaveApproval) getIntent().getSerializableExtra("LeaveData");
        }
        setContentView(R.layout.activity_apply_leave);
        reason = (EditText) findViewById(R.id.reasontext);
        reason.setHint(R.string.type_here);
        preferences = PreferenceManager.getDefaultSharedPreferences(ApplyLeaveActivity.this);
        stringUtils = new StringUtils();
        TextView textView = (TextView)findViewById(R.id.Reason);
        String channel = "Reason";
        String colored = " *";
        SpannableStringBuilder builder = new SpannableStringBuilder();
        builder.append(channel);
        int start = builder.length();
        builder.append(colored);
        int end = builder.length();
        builder.setSpan(new ForegroundColorSpan(Color.RED), start, end,
                Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        textView.setText(builder);
        Button save = (Button) findViewById(R.id.approval);
        LinearLayout buttons = (LinearLayout) findViewById(R.id.buttons);

        update = (Button) findViewById(R.id.update);
        cancel = (Button) findViewById(R.id.cancel);
        LinearLayout linearLayout = (LinearLayout) findViewById(R.id.leave_type_layout);
        final Spinner leavetype = (Spinner) findViewById(R.id.typespin);
        userRole = stringUtils.getUserRole(this);
        if (updatable){
            linearLayout.setVisibility(View.VISIBLE);
            save.setVisibility(View.GONE);
            buttons.setVisibility(View.VISIBLE);
        } else {
            if (userRole.equalsIgnoreCase(PARENT)) {
                save.setText(R.string.done);
            } else if (userRole.equalsIgnoreCase(EMPLOYEE)) {
                linearLayout.setVisibility(View.VISIBLE);
                TextView leaveTypes = (TextView) findViewById(R.id.event_category);
                leaveTypes.setText(R.string.leave_type);
                save.setText(R.string.submit_for_approval);
            }
        }
        String username = preferences.getString(CURRENT_USERNAME, null);
        String leaveTypeCredential = BASE_URL + API_VERSION_ONE + LEAVE_ASSIGN + EMPLOYEE_URL + username;
        GETUrlConnection leavtypeUrl = new GETUrlConnection(ApplyLeaveActivity.this, leaveTypeCredential,null) {
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("applyy", "response" + response);
                try {
                    stringUtils.checkSession(response);
                    JSONObject jsonObject = new JSONObject(response);
                    JSONArray dataArray = jsonObject.getJSONArray(DATA);
                    ArrayList<LeaveType> leaveTypeList = new ArrayList<>();
                    for (int i = 0; i < dataArray.length(); i++) {
                        JSONObject dataObject = dataArray.getJSONObject(i);
                        String leave_type_name = dataObject.getString("leave_type_name");
                        String leave_type_id = dataObject.getString("leave_type_id");
                        String reporting_emp_id = dataObject.getString("reporting_emp_id");
                        String reporting_emp_username = dataObject.getString("reporting_emp_username");
                        LeaveType leaveType = new LeaveType();
                        leaveType.setLeave_type_id(leave_type_id);
                        leaveType.setLeave_type_name(leave_type_name);
                        leaveType.setReporting_emp_id(reporting_emp_id);
                        leaveType.setReporting_emp_username(reporting_emp_username);
                        leaveTypeList.add(leaveType);
                    }
                    leaveTypeSpinner(leaveTypeList, leavetype);
                } catch(JSONException | NullPointerException e){
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(ApplyLeaveActivity.this);
                }
            }
        };
        leavtypeUrl.execute();

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM dd yyyy", Locale.ENGLISH);
        fromDate = dateFormat.format(calendar.getTime());
        toDate = dateFormat.format(calendar.getTime());
        from = (TextView) findViewById(R.id.fromdatetext);
        from.setText(R.string.from);
        to = (TextView) findViewById(R.id.todatetext);
        to.setText(R.string.to);
        Log.v("From ","Date "+fromDate);
        Log.v("To ","Date "+toDate);
        if (updatable){
            from.setText(leaveApproval.getFromDate());
            to.setText(leaveApproval.getToDate());
            reason.setText(leaveApproval.getLeaveReason());
        } else {
            from.setText(fromDate);
            to.setText(toDate);
        }

        final ImageButton fromDateButton = (ImageButton)findViewById(R.id.fromdatebutton);
        final ImageButton toDateButton = (ImageButton)findViewById(R.id.todatebutton);
        ActionBar actionBar = getSupportActionBar();

        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            if (updatable){
                actionBar.setTitle(R.string.applied_leave);
                buttonClick();
            } else {
                actionBar.setTitle(R.string.apply_leave);
            }
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
        }
        LinearLayout fromclick = (LinearLayout) findViewById(R.id.fromclick);
        LinearLayout toclick = (LinearLayout) findViewById(R.id.toclick);

        fromclick.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(ApplyLeaveActivity.this, DueDateActivity.class);
                intent.putExtra(PAST_DATE_FREEZE,true);
                intent.putExtra("Date","From Date");
                startActivityForResult(intent, 2);
            }

        });
        fromDateButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ApplyLeaveActivity.this, DueDateActivity.class);
                intent.putExtra(PAST_DATE_FREEZE,true);
                intent.putExtra("Date","From Date");
                startActivityForResult(intent, 2);

            }
        });
        toclick.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(ApplyLeaveActivity.this, DueDateActivity.class);
                intent.putExtra(PAST_DATE_FREEZE,true);
                intent.putExtra("Date","To Date");
                startActivityForResult(intent, 3);
            }
        });
        toDateButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ApplyLeaveActivity.this, DueDateActivity.class);
                intent.putExtra(PAST_DATE_FREEZE,true);
                intent.putExtra("Date","To Date");
                startActivityForResult(intent, 3);
            }
        });

        save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!userRole.equalsIgnoreCase(EMPLOYEE)) {
                    String draftUrl = BASE_URL + API_VERSION_ONE + ATTENDANCE + LEAVE;
                    BasicHeader[] headers = stringUtils.headers(ApplyLeaveActivity.this, ATTENDANCE_FEATURE);
                    validate(draftUrl,headers);
                } else {
                    String draftUrl = BASE_URL + API_VERSION_ONE + LEAVES + "emp";
                    BasicHeader[] headers = stringUtils.headers(ApplyLeaveActivity.this,APPLY_LEAVE);
                    if (leaveTypeId != null){
                        validate(draftUrl,headers);
                    } else {
                        Toast.makeText(ApplyLeaveActivity.this, R.string.please_select_leave_type,Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });
    }
    public void validate(String draftUrl,BasicHeader[] headers ){
        Date fromDate = stringUtils.dateCompare(from.getText().toString());
        Date todate = stringUtils.dateCompare(to.getText().toString());
        if (todate.after(fromDate) || (fromDate.equals(todate))) {
            if (!reason.getText().toString().equals("")) {
                POSTUrlConnection urlConnection = new POSTUrlConnection(createJson(), draftUrl, headers, ApplyLeaveActivity.this) {
                    @Override
                    protected void onPostExecute(String response) {
                        super.onPostExecute(response);
                        Log.v("update", " leave" + response);
                        if (response != null) {
                            try {
                                stringUtils.checkSession(response);
                                JSONObject success = new JSONObject(response);
                                boolean status = success.getBoolean(SUCCESS);
                                JSONObject dataObject = success.getJSONObject(DATA);
                                String message = dataObject.getString("message");
                                Log.v("message", "" + message);
                                if (status) {
                                    toast = Toast.makeText(ApplyLeaveActivity.this, message, Toast.LENGTH_LONG);
                                    toast.setGravity(Gravity.CENTER, 0, 380);
                                    toast.show();
                                    LeaveHistory.render = true;
                                    finish();

                                } else {
                                    toast = Toast.makeText(ApplyLeaveActivity.this, message, Toast.LENGTH_LONG);
                                    toast.setGravity(Gravity.CENTER,0,380);
                                    toast.show();

                                }
                            } catch (JSONException |NullPointerException e) {
                                e.printStackTrace();
                            }catch (SessionExpiredException e){
                                e.handleException(ApplyLeaveActivity.this);
                            }

                        } else {
                            if (toast!= null)
                                toast.cancel();
                            toast = Toast.makeText(ApplyLeaveActivity.this, R.string.leave_approval_not_updated, Toast.LENGTH_LONG);
                            toast.show();
                        }

                    }
                };
                urlConnection.execute();
            } else {
                Toast.makeText(ApplyLeaveActivity.this, R.string.fill_mandatory_fields, Toast.LENGTH_LONG).show();
            }

        } else {
            Toast.makeText(ApplyLeaveActivity.this, R.string.select_valid_date, Toast.LENGTH_SHORT).show();
        }
    }

    public void buttonClick(){

        updateCredential = BASE_URL + API_VERSION_ONE + LEAVES + EMP + leaveApproval.getAppliedLeaveId();
        header = stringUtils.headers(ApplyLeaveActivity.this,APPLY_LEAVE);
        update.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Date fromDate = stringUtils.dateCompare(from.getText().toString());
                Date todate = stringUtils.dateCompare(to.getText().toString());
                if (todate.after(fromDate) || (fromDate.equals(todate))) {
                    String status = "Pending";
                    String reasoning = reason.getText().toString();
                    Log.v("Reason ", "data " + reasoning);
                    UPDATEUrlConnection updateStatusUrl = new UPDATEUrlConnection(ApplyLeaveActivity.this, updateCredential, header, updateJSon(reasoning, status, from.getText().toString(), to.getText().toString())) {
                        @Override
                        protected void onPostExecute(String response) {
                            super.onPostExecute(response);
                            Log.v("status", "response" + response);
                            if (response != null) {
                                try {
                                    stringUtils.checkSession(response);
                                    JSONObject success = new JSONObject(response);
                                    boolean status = success.getBoolean(SUCCESS);
                                    JSONObject dataObject = success.getJSONObject(DATA);
                                    String message = dataObject.getString("message");
                                    Log.v("message", "" + message);
                                    if (status) {
                                        if (toast != null)
                                            toast.cancel();
                                        toast = Toast.makeText(ApplyLeaveActivity.this, message, Toast.LENGTH_SHORT);
                                        toast.setGravity(Gravity.CENTER, 0, 380);
                                        toast.show();
                                        LeaveHistory.render = true;
                                        finish();

                                    } else {
                                        if (toast != null)
                                            toast.cancel();
                                        toast = Toast.makeText(ApplyLeaveActivity.this, message, Toast.LENGTH_SHORT);
                                        toast.show();
                                    }
                                } catch (JSONException | NullPointerException e) {
                                    e.printStackTrace();
                                } catch (SessionExpiredException e) {
                                    e.handleException(ApplyLeaveActivity.this);
                                }

                            } else {
                                Toast.makeText(ApplyLeaveActivity.this, "You have exhausted all leaves of this type", Toast.LENGTH_SHORT).show();
                            }
                        }
                    };
                    updateStatusUrl.execute();

                } else {
                    Toast.makeText(ApplyLeaveActivity.this, R.string.select_valid_date, Toast.LENGTH_SHORT).show();
                }
            }
        });
        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String status = "Cancelled";
                String reasoning = reason.getText().toString();
                Log.v("Reason ","data "+reasoning);
                UPDATEUrlConnection updateStatusUrl = new UPDATEUrlConnection(ApplyLeaveActivity.this,updateCredential,header,updateJSon(reasoning,status,from.getText().toString(),to.getText().toString())){
                    @Override
                    protected void onPostExecute(String response) {
                        super.onPostExecute(response);
                        Log.v("status","response"+ response);
                        if (response != null) {
                            try {
                                stringUtils.checkSession(response);
                                JSONObject success = new JSONObject(response);
                                boolean status = success.getBoolean(SUCCESS);
                                JSONObject dataObject = success.getJSONObject(DATA);
                                String message = dataObject.getString("message");
                                Log.v("message",""+message);
                                if (status){
                                    toast = Toast.makeText(ApplyLeaveActivity.this, message, Toast.LENGTH_SHORT);
                                    toast.setGravity(Gravity.CENTER, 0, 380);
                                    toast.show();
                                    LeaveHistory.render = true;
                                    finish();
                                }else {
                                    if (toast != null)
                                        toast.cancel();
                                    toast = Toast.makeText(ApplyLeaveActivity.this, message, Toast.LENGTH_SHORT);
                                    toast.show();
                                }
                            } catch (JSONException |NullPointerException e) {
                                e.printStackTrace();
                            } catch (SessionExpiredException e){
                                e.handleException(ApplyLeaveActivity.this);
                            }

                        } else {
                            Toast.makeText(ApplyLeaveActivity.this, R.string.leave_approval_not_updated, Toast.LENGTH_SHORT).show();
                        }
                    }
                };
                updateStatusUrl.execute();
            }
        });
    }

    public JSONObject updateJSon(String reason,String status,String fromDate,String toDate){
        JSONObject submitted = new JSONObject();
        JSONObject notifyTo = new JSONObject();
        try {
            submitted.put("appliedLeaveId",leaveApproval.getAppliedLeaveId());
            submitted.put("tenantId",leaveApproval.getTenantId());
            submitted.put("schoolId",leaveApproval.getSchoolId());
            submitted.put("academicYear",leaveApproval.getAcademicYear());
            submitted.put("reportingEmpId",leaveApproval.getReportingEmpId());
            submitted.put("empId",leaveApproval.getEmpId());
            submitted.put("leaveTypeId",leaveTypeId);
            submitted.put("fromDate",fromDate);
            submitted.put("toDate",toDate);
            submitted.put("requestedDate",leaveApproval.getRequestedDate());
            submitted.put("leaveReason",reason);
            submitted.put("status",status);
            submitted.put("updatedDate",leaveApproval.getUpdatedDate());
            submitted.put("updatedBy",leaveApproval.getUpdatedBy());
            submitted.put("empName",leaveApproval.getEmpName());
            //submitted.put("designation",leaveTypeId);
            submitted.put("leaveTypeName",leaveTypeeName);
            submitted.put("leavesCount",leaveApproval.getLeavesCount());
            notifyTo.put("status","Sent");
            submitted.put("notifyTo",notifyTo);

            JSONObject notify = new JSONObject();
            notify.put("sms", false);
            notify.put("email", false);
            notify.put("push", false);
            submitted.put("notify", notify);

        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.v("Updated","Json"+submitted.toString());
        return submitted;
    }

    public JSONObject createJson(){
        JSONObject leaveObject = new JSONObject();
        JSONObject notifyTo = new JSONObject();
        JSONObject notify = new JSONObject();
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(ApplyLeaveActivity.this);
        String username = preferences.getString(CURRENT_USERNAME,null);
        Log.v("username",""+username);
        String firstname = preferences.getString(FIRST_NAME,null);
        if(!userRole.equalsIgnoreCase(EMPLOYEE)) {
            try {
                leaveObject.put("userName", username);
                leaveObject.put("reason", reason.getText().toString());
                leaveObject.put("fromDate", from.getText().toString());
                leaveObject.put("toDate", to.getText().toString());
                leaveObject.put("userType", userRole);
                leaveObject.put("updatedBy", username);
                Log.v("leave ","object "+leaveObject);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {
            try {
                leaveObject.put("status","Pending");
                leaveObject.put("leaveTypeId",leaveTypeId);
                leaveObject.put("empId",username);
                leaveObject.put("empFirstName",firstname);
                notifyTo.put("status","Sent");
                leaveObject.put("notifyTo",notifyTo);
                notify.put("sms",false);
                notify.put("email",false);
                notify.put("push",false);
                leaveObject.put("notify",notify);
                leaveObject.put("leaveReason",reason.getText().toString());
                leaveObject.put("fromDate",from.getText().toString());
                leaveObject.put("toDate",to.getText().toString());
                leaveObject.put("leaveTypeName","");
                leaveObject.put("date","");
            }catch (JSONException e){
                e.printStackTrace();
            }
        }
        Log.v("leave ","object "+leaveObject);
        return leaveObject;
    }

    public void leaveTypeSpinner(ArrayList<LeaveType> leaveTypeList, final Spinner leavetype){
        LeaveType leave = new LeaveType();
        leave.setLeave_type_name("None");
        leaveTypeList.add(0,leave);
        LeaveTypeAdapter leaveTypeAdapter = new LeaveTypeAdapter(ApplyLeaveActivity.this,leaveTypeList);
        leavetype.setAdapter(leaveTypeAdapter);
        if(updatable) {
            int pos = getMatchedIndex(leaveTypeList, leaveApproval);
            leavetype.setSelection(pos);
            leaveApproval.getLeaveTypeId();
            Log.v("leaveType","id "+leaveApproval.getLeaveTypeId());
        }
        leavetype.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                LeaveType leaveType = (LeaveType) leavetype.getItemAtPosition(position);
                leaveTypeId = leaveType.getLeave_type_id();
                leaveTypeeName = leaveType.getLeave_type_name();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 2 || requestCode == 4) {
            if (data.getIntExtra("Date", 0) != 0) {
                fromDate = data.getIntExtra("Date", 0) + "/" + data.getIntExtra("Month", 0) + "/" + data.getIntExtra("Year", 0);
                from.setText(stringUtils.DisplayDate(fromDate));
            }
            Log.v("On activity ", "result Due date " + data.getIntExtra("Date", 0));
            Log.v("On activity ", "result Due month " + data.getIntExtra("Month", 0));
            Log.v("On activity ", "result Due year " + data.getIntExtra("Year", 0));
        }

        if (requestCode == 3 || requestCode == 5) {
            if (data.getIntExtra("Date", 0) != 0) {
                toDate = data.getIntExtra("Date", 0) + "/" + data.getIntExtra("Month", 0) + "/" + data.getIntExtra("Year", 0);
                to.setText(stringUtils.DisplayDate(toDate));
            }
            Log.v("On activity ", "result Due date " + data.getIntExtra("Date", 0));
            Log.v("On activity ", "result Due month " + data.getIntExtra("Month", 0));
            Log.v("On activity ", "result Due year " + data.getIntExtra("Year", 0));
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }
    public int getMatchedIndex(List<LeaveType> leaveTypes, LeaveApproval leaveApproval) {
        int index = 0;
        for (LeaveType template : leaveTypes) {
            if (template.getLeave_type_id() != null && template.getLeave_type_id().equals(leaveApproval.getLeaveTypeId())) {
                index = leaveTypes.indexOf(template);
            }
        }
        Log.v("indexxxx", " value" + index);
        return index;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (toast != null)
            toast.cancel();
    }

}