package nexrise.publication.in.nexrise.Attendence;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import nexrise.publication.in.nexrise.BeanClass.LeaveApproval;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.ClassTabsPagerAdapter;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;


public class AttendanceActivityFragment extends AppCompatActivity implements Constants{

    String leaveTaken;
    Set<Date> map;
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_attendance_fragment);

        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setTitle(R.string.my_leave);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setElevation(0);
        }
        ViewPager viewPager = (ViewPager) findViewById(R.id.class_activity_pager);
        setUpViewPager(viewPager);

        FloatingActionButton actionButton = (FloatingActionButton) findViewById(R.id.fab_events_feature);
        actionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AttendanceActivityFragment.this, ApplyLeaveActivity.class);
                startActivity(intent);
            }
        });
    }

    public void setUpViewPager(final ViewPager viewPager) {
        final ClassTabsPagerAdapter pagerAdapter = new ClassTabsPagerAdapter(getSupportFragmentManager());
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String username = preferences.getString(CURRENT_USERNAME,null);
        Log.v("user","first"+username);
        String leavesApplied = BASE_URL + API_VERSION_ONE + LEAVES + EMP + APPLY + username;
        GETUrlConnection leavesAppliedUrl = new GETUrlConnection(AttendanceActivityFragment.this,leavesApplied,null);
        ArrayList<Date> dates1 = new ArrayList<>();
        ArrayList<LeaveApproval> leaveApprovalArrayList = new ArrayList<>();
        try {
            Log.v("leave","leave"+leavesAppliedUrl);
            leaveTaken =leavesAppliedUrl.execute().get();
            new StringUtils().checkSession(leaveTaken);
            JSONObject mainObject = new JSONObject(leaveTaken);
            JSONArray dataArray = mainObject.getJSONArray(DATA);
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            leaveApprovalArrayList = mapper.readValue(dataArray.toString(), TypeFactory.collectionType(List.class, LeaveApproval.class));
            ArrayList<Date> dates = new ArrayList<>();
            map = new HashSet<>();
            Integer color = R.color.colorRed;
            for(int i=0; i<leaveApprovalArrayList.size(); i++){
                LeaveApproval leaveApproval = leaveApprovalArrayList.get(i);
                String fromDate = leaveApproval.getFromDate();
                String toDate = leaveApproval.getToDate();
                Log.v("From","date"+fromDate);
                Log.v("To ","date"+toDate);
                SimpleDateFormat formatter = new SimpleDateFormat("MMM dd yyyy");
                Date startDate = formatter.parse(fromDate);
                Date endDate = formatter.parse(toDate);
                Calendar start = Calendar.getInstance();
                start.setTime(startDate);
                Calendar end = Calendar.getInstance();
                end.setTime(endDate);

                while(!start.after(end)) {
                    dates.add(start.getTime());
                    Log.v("Range ","dates "+start.getTime());
                    dates1.add(start.getTime());
                    start.add(Calendar.DATE, 1);
                }
                map.addAll(dates1);
                dates1.clear();
                dates1.addAll(map);
                Log.v("DAtes","Size"+dates.size());
            }

        } catch (SessionExpiredException e) {
            e.handleException(AttendanceActivityFragment.this);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Bundle bundle = new Bundle();
        bundle.putSerializable("map",  dates1);
        bundle.putSerializable("status", leaveApprovalArrayList);
        OverviewFragment overviewFragment = new OverviewFragment();
        overviewFragment.setArguments(bundle);
        LeaveHistory leaveHistory = new LeaveHistory();
        leaveHistory.setArguments(bundle);
        pagerAdapter.addFragment(overviewFragment, "Overview");
        pagerAdapter.addFragment(leaveHistory, "Status");
        viewPager.setAdapter(pagerAdapter);
        TabLayout tabLayout = (TabLayout)AttendanceActivityFragment.this.findViewById(R.id.class_activity_tablayout);
        tabLayout.setupWithViewPager(viewPager);

        String[] titles = {(String) getResources().getText(R.string.overview), (String) getResources().getText(R.string.status)};
        for (int i = 0; i < titles.length; i++) {
            tabLayout.getTabAt(i).setText(titles[i]);
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

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }
}
