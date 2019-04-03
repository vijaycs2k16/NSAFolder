package nexrise.publication.in.nexrise.Attendence;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.SearchView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.LeaveApproval;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class LeaveApprovalActivity extends AppCompatActivity implements Constants {
    LeaveApprovalArrayAdapter approvalArrayAdapter;
    SharedPreferences preferences;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_leave_approval);
        preferences = PreferenceManager.getDefaultSharedPreferences(LeaveApprovalActivity.this);
        renderView();
        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(R.string.leave_approval);
        }
    }
    public void  listViewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                LeaveApproval leaveData = (LeaveApproval) listView.getItemAtPosition(position);
                Intent intent = new Intent(LeaveApprovalActivity.this, ApprovalDetailActivity.class);
                intent.putExtra("LeaveData",leaveData);
                startActivityForResult(intent,100);
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == 100 && resultCode == RESULT_OK)
            renderView();
    }

    public void renderView(){
        String username = preferences.getString(CURRENT_USERNAME,null);
        String leaveApprovalCredential = BASE_URL + API_VERSION_ONE + LEAVES + EMP + REQUESTED + username;
        GETUrlConnection getUrlConnection = new GETUrlConnection(LeaveApprovalActivity.this,leaveApprovalCredential,null){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("response "," leave"+response);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject mainObject = new JSONObject(response);
                    JSONArray dataArray = mainObject.getJSONArray(DATA);
                    ArrayList<LeaveApproval> leaveApprovalArrayList = leaveApprovalParser(dataArray) ;
                    final ListView listView = (ListView) findViewById(R.id.listview);
                    approvalArrayAdapter = new LeaveApprovalArrayAdapter(LeaveApprovalActivity.this,leaveApprovalArrayList);
                    listView.setAdapter(approvalArrayAdapter);
                    listViewClick(listView);

                } catch (JSONException | NullPointerException  e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(LeaveApprovalActivity.this);
                }
            }
        };
        getUrlConnection.execute();
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
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.actionbar, menu);
        MenuItem menuItem = menu.findItem(R.id.searchbar);
        android.widget.SearchView searchView = (android.widget.SearchView)menuItem.getActionView();
        SearchManager searchManager = (SearchManager)getSystemService(Context.SEARCH_SERVICE);
        if(searchManager != null) {
            searchView.setSearchableInfo(searchManager.getSearchableInfo(getComponentName()));
        }
        Utility.searchViewHandler(searchView, menuItem);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                approvalArrayAdapter.getFilter().filter(newText);
                return true;
            }
        });

        return super.onCreateOptionsMenu(menu);
    }
    public ArrayList<LeaveApproval> leaveApprovalParser(JSONArray dataArray) throws JSONException {
        ArrayList<LeaveApproval> leaveApprovalArrayList = new ArrayList<>();
        for(int i=0;i<dataArray.length();i++){
            JSONObject dataObject = dataArray.getJSONObject(i);
            String appliedLeaveId = dataObject.getString("appliedLeaveId");
            String tenantId = dataObject.getString("tenantId");
            String schoolId = dataObject.getString("schoolId");
            String academicYear = dataObject.getString("academicYear");
            String reportingEmpId = dataObject.getString("reportingEmpId");
            String empId = dataObject.getString("empId");
            String leaveTypeId = dataObject.getString("leaveTypeId");
            String fromDate = dataObject.getString("fromDate");
            String toDate = dataObject.getString("toDate");
            int leavesCount = dataObject.getInt("leavesCount");
            String leaveReason = dataObject.getString("leaveReason");
            String status = dataObject.getString("status");
            String requestedDate = dataObject.getString("requestedDate");
            String updatedDate = dataObject.getString("updatedDate");
            String updatedBy = dataObject.getString("updatedBy");
            String empName = dataObject.getString("empName");
            String designation = dataObject.getString("designation");
            LeaveApproval leaveApproval = new LeaveApproval();
            if(!status.equalsIgnoreCase(CANCELLED)){
                leaveApproval.setAppliedLeaveId(appliedLeaveId);
                leaveApproval.setTenantId(tenantId);
                leaveApproval.setSchoolId(schoolId);
                leaveApproval.setAcademicYear(academicYear);
                leaveApproval.setReportingEmpId(reportingEmpId);
                leaveApproval.setEmpId(empId);
                leaveApproval.setLeaveTypeId(leaveTypeId);
                leaveApproval.setFromDate(fromDate);
                leaveApproval.setToDate(toDate);
                leaveApproval.setStatus(status);
                leaveApproval.setLeavesCount(leavesCount);
                leaveApproval.setRequestedDate(requestedDate);
                leaveApproval.setUpdatedBy(updatedBy);
                leaveApproval.setUpdatedDate(updatedDate);
                leaveApproval.setEmpName(empName);
                leaveApproval.setLeaveReason(leaveReason);
                leaveApproval.setDesignation(designation);
                leaveApprovalArrayList.add(leaveApproval);
            }
        }
        return leaveApprovalArrayList;
    }
}
