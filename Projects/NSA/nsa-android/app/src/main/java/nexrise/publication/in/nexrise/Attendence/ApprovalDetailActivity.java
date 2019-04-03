package nexrise.publication.in.nexrise.Attendence;

import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ExpandableListView;
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
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import nexrise.publication.in.nexrise.BeanClass.LeaveApproval;
import nexrise.publication.in.nexrise.BeanClass.LeaveDetails;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ApprovalDetailActivity extends AppCompatActivity implements Constants {
    SharedPreferences preferences;
    LeaveApproval leaveApproval;
    boolean sms = false;
    boolean push = false;
    boolean email = false;
    CheckBox smschannel;
    CheckBox pushchannel;
    CheckBox emailchannel;
    View footer1;
    TextView employeeName;
    TextView durations;
    TextView leaveTypes;
    TextView reasons;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_approval_detail);
        preferences = PreferenceManager.getDefaultSharedPreferences(ApprovalDetailActivity.this);
        employeeName = (TextView)findViewById(R.id.employee_name);
        employeeName.setText(R.string.employee_name);
        durations = (TextView)findViewById(R.id.durations);
        durations.setText(R.string.duration_);
        leaveTypes = (TextView)findViewById(R.id.leave_types);
        leaveTypes.setText(R.string.leave_type_);
        reasons = (TextView)findViewById(R.id.reasons);
        reasons.setText(R.string.reasons_);


        leaveApproval = (LeaveApproval) getIntent().getSerializableExtra("LeaveData");
        String leaveDetail = BASE_URL + API_VERSION_ONE + LEAVES + EMP + leaveApproval.getAppliedLeaveId();
        GETUrlConnection leaveDetailCredential = new GETUrlConnection(ApprovalDetailActivity.this,leaveDetail,null){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("LEave","REsponse"+response);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject mainObject = new JSONObject(response);
                    JSONObject dataObject = mainObject.getJSONObject(DATA);
                    String leaveTypeName = dataObject.getString("leaveTypeName");
                    leaveApproval.setLeaveTypeName(leaveTypeName);
                    TextView employeeName= (TextView) findViewById(R.id.emp_name);
                    TextView duration = (TextView) findViewById(R.id.duration);
                    TextView leaveType = (TextView) findViewById(R.id.leave_type);
                    TextView reason = (TextView) findViewById(R.id.reason);
                    employeeName.setText(leaveApproval.getEmpName());
                    duration.setText(leaveApproval.getFromDate()+ " - "+leaveApproval.getToDate());
                    leaveType.setText(leaveApproval.getLeaveTypeName());
                    reason.setText(leaveApproval.getLeaveReason());
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e){
                    e.handleException(ApprovalDetailActivity.this);
                }

            }
        };
        leaveDetailCredential.execute();
        prepareData();
        channel();
        ActionBar actionBar = getSupportActionBar();
        Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
        actionBar.setBackgroundDrawable(drawable);
        actionBar.setElevation(0);
        actionBar.setDisplayHomeAsUpEnabled(true);
        actionBar.setDisplayShowHomeEnabled(true);
        actionBar.setTitle(R.string.leave_request);
    }
    public void denyclick(Button button){
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder enterDescriptionBuilder = new AlertDialog.Builder(ApprovalDetailActivity.this);
                LayoutInflater layoutInflater = getLayoutInflater();
                final View descriptionDialogView = layoutInflater.inflate(R.layout.enter_description_dialog, null);
                enterDescriptionBuilder.setView(descriptionDialogView);
                final EditText enteredText = (EditText)descriptionDialogView.findViewById(R.id.enter_descripition);
                enterDescriptionBuilder.setTitle(R.string.enter_reason);

                enterDescriptionBuilder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(final DialogInterface dialog, int which) {
                        String reason = enteredText.getText().toString();
                        buttonClick(reason,"Deny");
                    }
                });
                enterDescriptionBuilder.setNegativeButton("CANCEL", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
                enterDescriptionBuilder.show();
            }
        });

    }
    public JSONObject createJSon(String reason,String status){
        JSONObject submitted = new JSONObject();
        JSONObject notifyTo = new JSONObject();
        try {
            submitted.put("tenantId",leaveApproval.getTenantId());
            submitted.put("schoolId",leaveApproval.getSchoolId());
            submitted.put("academicYear",leaveApproval.getAcademicYear());
            submitted.put("reportingEmpId",leaveApproval.getReportingEmpId());
            submitted.put("empId",leaveApproval.getEmpId());
            submitted.put("leaveTypeId",leaveApproval.getLeaveTypeId());
            submitted.put("fromDate",leaveApproval.getFromDate());
            submitted.put("toDate",leaveApproval.getToDate());
            submitted.put("requestedDate",leaveApproval.getRequestedDate());
            submitted.put("leaveReason",reason);
            submitted.put("status",status);
            submitted.put("updatedDate",leaveApproval.getUpdatedDate());
            submitted.put("updatedBy",leaveApproval.getUpdatedBy());
            submitted.put("empName",leaveApproval.getEmpName());
            submitted.put("designation",leaveApproval.getDesignation());
            submitted.put("leaveTypeName",leaveApproval.getLeaveTypeName());
            submitted.put("leavesCount",leaveApproval.getLeavesCount());
            notifyTo.put("status","Sent");
            submitted.put("notifyTo",notifyTo);
            JSONObject notify = new JSONObject();
            if(smschannel.isChecked()) {
                sms = true;
            }
            if(pushchannel.isChecked()) {
                push = true;
            }
            if (emailchannel.isChecked()){
                email = true;
            }
            notify.put("sms", sms);
            notify.put("email", email);
            notify.put("push", push);
            submitted.put("notify", notify);

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return submitted;
    }

    public void prepareData(){
        final ArrayList<LeaveDetails> leaveDetailsArrayList = new ArrayList<>();
        String username = preferences.getString(CURRENT_USERNAME,null);
        String leaveHistoryCredential = BASE_URL + API_VERSION_ONE + LEAVES + APPROVAL + HISTORY + username ;
        String leaveHistory = null;
        String remainingLeave = null;
        GETUrlConnection leaveHistoryUrl = new GETUrlConnection(ApprovalDetailActivity.this,leaveHistoryCredential,null){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Leave History","response"+response);
            }
        };
        try {
            leaveHistory =leaveHistoryUrl.execute().get();
            new StringUtils().checkSession(leaveHistory);
            JSONObject mainObject = new JSONObject(leaveHistory);
            JSONArray dataArray = mainObject.getJSONArray(DATA);
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            ArrayList<LeaveApproval> leaveApprovalArrayList = mapper.readValue(dataArray.toString(), TypeFactory.collectionType(List.class, LeaveApproval.class));
            LeaveDetails leaveDetails = new LeaveDetails();
            leaveDetails.setName((String) getResources().getText(R.string.approved_leave));
            leaveDetails.setData(leaveApprovalArrayList);
            leaveDetailsArrayList.add(leaveDetails);

        } catch (JSONException | IOException |InterruptedException | ExecutionException |NullPointerException e) {
            e.printStackTrace();
        }catch (SessionExpiredException e){
            e.handleException(ApprovalDetailActivity.this);
        }

        String leaveRemainingCredential = BASE_URL + API_VERSION_ONE + LEAVES + EMP + REAMINING + leaveApproval.getEmpId() ;
        GETUrlConnection remainingLeaveUrl = new GETUrlConnection(ApprovalDetailActivity.this,leaveRemainingCredential,null){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
            }
        };
        try {
            remainingLeave = remainingLeaveUrl.execute().get();
            new StringUtils().checkSession(remainingLeave);
            JSONObject mainObject = new JSONObject(remainingLeave);
            JSONArray dataArray = mainObject.getJSONArray(DATA);
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            ArrayList<LeaveApproval> leaveApprovalArrayList = mapper.readValue(dataArray.toString(), TypeFactory.collectionType(List.class, LeaveApproval.class));
            LeaveDetails leaveDetails1 = new LeaveDetails();
            leaveDetails1.setName((String) getResources().getText(R.string.remaining_leaves));
            leaveDetails1.setData(leaveApprovalArrayList);
            leaveDetailsArrayList.add(leaveDetails1);
        } catch (JSONException | IOException | NullPointerException |InterruptedException |ExecutionException e) {
            e.printStackTrace();
        }catch (SessionExpiredException e){
            e.handleException(ApprovalDetailActivity.this);
        }
        listData(leaveDetailsArrayList);

    }
    public void listData(ArrayList<LeaveDetails> leaveDetailsArrayList){
        ExpandableListView expandableListView = (ExpandableListView) findViewById(R.id.fragment_status_listview);
        ApprovalDetailsAdapter approvalDetailsAdapter = new ApprovalDetailsAdapter(ApprovalDetailActivity.this,leaveDetailsArrayList);
        final View footer = ApprovalDetailActivity.this.getLayoutInflater().inflate(R.layout.button_layout_footer, expandableListView, false);

        footer1 =ApprovalDetailActivity.this.getLayoutInflater().inflate(R.layout.add_homework_listview_footer,expandableListView,false);
        expandableListView.addFooterView(footer1);
        expandableListView.addFooterView(footer);

        expandableListView.setAdapter(approvalDetailsAdapter);
        Button deny = (Button) footer.findViewById(R.id.deny);
        Button approve = (Button) footer.findViewById(R.id.approve);
        if (leaveApproval.getStatus().equalsIgnoreCase(APPROVED)) {
            approve.setText(R.string.approved);
            approve.setClickable(false);
            approve.getBackground().setColorFilter(null);
            approve.getBackground().setColorFilter(getResources().getColor(R.color.colorLightGrey), PorterDuff.Mode.MULTIPLY);
            approve.setEnabled(false);
        }
        if (leaveApproval.getStatus().equalsIgnoreCase(DENY)) {
            deny.setText(R.string.denied);
            deny.setClickable(false);
            deny.getBackground().setColorFilter(null);
            deny.getBackground().setColorFilter(getResources().getColor(R.color.colorLightGrey), PorterDuff.Mode.MULTIPLY);
            deny.setEnabled(false);
        }
        if (leaveApproval.getStatus().equalsIgnoreCase(PENDING)) {
            deny.setVisibility(View.VISIBLE);
            approve.setVisibility(View.VISIBLE);
        }

        denyclick(deny);

        approve.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                buttonClick(leaveApproval.getLeaveReason(),"Approved");

            }
        });
    }
    public void buttonClick(String reason,String status){
        String updateStatus = BASE_URL + API_VERSION_ONE + LEAVES + EMP + leaveApproval.getAppliedLeaveId();

        BasicHeader[] header = new StringUtils().headers(ApprovalDetailActivity.this,LEAVE_APPROVAL_STATUS_ID);

        UPDATEUrlConnection updateStatusUrl = new UPDATEUrlConnection(ApprovalDetailActivity.this,updateStatus,header,createJSon(reason,status)){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                if (response != null) {
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject success = new JSONObject(response);
                        boolean status = success.getBoolean(SUCCESS);
                        JSONObject dataObject = success.getJSONObject(DATA);
                        String message = dataObject.getString("message");
                        Log.v("message",""+message);
                        if (status){
                            Toast toast = Toast.makeText(ApprovalDetailActivity.this, message, Toast.LENGTH_SHORT);
                            toast.setGravity(Gravity.CENTER, 0, 380);
                            toast.show();
                            setResult(RESULT_OK);
                            finish();

                        }else {
                            Toast.makeText(ApprovalDetailActivity.this, message, Toast.LENGTH_SHORT).show();
                        }
                    } catch (JSONException |NullPointerException e) {
                        e.printStackTrace();
                    }catch (SessionExpiredException e){
                        e.handleException(ApprovalDetailActivity.this);
                    }

                } else {
                    Toast.makeText(ApprovalDetailActivity.this, R.string.leave_approval_not_updated, Toast.LENGTH_SHORT).show();
                }
            }
        };
        updateStatusUrl.execute();

    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                setResult(RESULT_CANCELED);
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }
    public void channel(){
        String featurecredential = BASE_URL + API_VERSION_ONE + FEATURE;
        BasicHeader[] header = new StringUtils().headers(ApprovalDetailActivity.this,LEAVE_APPROVAL_STATUS_ID);
        GETUrlConnection url = new GETUrlConnection(ApprovalDetailActivity.this,featurecredential,header){

            @Override
            protected void onPostExecute(String assignmentresponse) {
                super.onPostExecute(assignmentresponse);
                Log.v("feature ","featureresponse "+assignmentresponse);
                JSONObject jsonObject = null;
                try {
                    new StringUtils().checkSession(assignmentresponse);
                    jsonObject = new JSONObject(assignmentresponse);
                    JSONObject data = jsonObject.getJSONObject(DATA);
                    Boolean smsStatus = data.getBoolean("sms");
                    Boolean emailStatus =data.getBoolean("email");
                    Boolean pushStatus = data.getBoolean("push");
                    smschannel = (CheckBox) footer1.findViewById(R.id.smscheck);
                    pushchannel = (CheckBox) footer1.findViewById(R.id.pushcheck);
                    emailchannel = (CheckBox) footer1.findViewById(R.id.emailcheck);
                    if (smsStatus)
                        smschannel.setVisibility(View.VISIBLE);
                    if (pushStatus)
                        pushchannel.setVisibility(View.VISIBLE);
                    if (emailStatus)
                        emailchannel.setVisibility(View.VISIBLE);
                } catch (NullPointerException | JSONException  e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(ApprovalDetailActivity.this);
                }
            }
        };
        url.execute();
    }

}
