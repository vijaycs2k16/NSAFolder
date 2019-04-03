package nexrise.publication.in.nexrise.ParentFeatures.Attendance;

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
import android.widget.ProgressBar;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.Attendence.ApplyLeaveActivity;
import nexrise.publication.in.nexrise.Attendence.LeaveStatusFragment;
import nexrise.publication.in.nexrise.Attendence.OverviewFragment;
import nexrise.publication.in.nexrise.BeanClass.StatusAttendance;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.ClassTabsPagerAdapter;
import nexrise.publication.in.nexrise.JsonParser.ParentAttendanceParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ParentAttendanceActivity extends AppCompatActivity implements Constants {

    String studentName = null;
    ArrayList<StatusAttendance> statusList;
    SharedPreferences preferences;
    StringUtils stringUtils;
    String userRole;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_parent_attendance);
        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        studentName = preferences.getString(FIRST_NAME,null);
        stringUtils = new StringUtils();
        userRole = stringUtils.getUserRole(this);
        ActionBar actionBar = getSupportActionBar();
        ViewPager viewPager = (ViewPager) findViewById(R.id.class_activity_pager);
        //setUpViewPager(viewPager);
        setUpNewViewPagers(viewPager);

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(R.string.attendance_management);
            actionBar.setElevation(0);
        }

        FloatingActionButton actionButton = (FloatingActionButton) findViewById(R.id.fab_events_feature);
        if(userRole.equalsIgnoreCase(PARENT)) {
            actionButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(ParentAttendanceActivity.this, ApplyLeaveActivity.class);
                    startActivity(intent);
                }
            });
        } else {
            actionButton.setVisibility(View.GONE);
        }
    }

    private void setUpNewViewPagers(final ViewPager viewPager) {
        final ClassTabsPagerAdapter pagerAdapter = new ClassTabsPagerAdapter(getSupportFragmentManager());
        Bundle bundle = new Bundle();
        bundle.putString("studentName", studentName);
        OverviewFragment overviewFragment = new OverviewFragment();
        overviewFragment.setArguments(bundle);
        LeaveStatusFragment leaveStatusFragment = new LeaveStatusFragment();
        leaveStatusFragment.setArguments(bundle);
        pagerAdapter.addFragment(overviewFragment, "Overview");
        pagerAdapter.addFragment(leaveStatusFragment, "Status");
        viewPager.setAdapter(pagerAdapter);
        TabLayout tabLayout = (TabLayout)ParentAttendanceActivity.this.findViewById(R.id.class_activity_tablayout);
        tabLayout.setupWithViewPager(viewPager);
        String[] titles = {(String) getResources().getText(R.string.overview), (String) getResources().getText(R.string.status)};
        for (int i = 0; i < titles.length; i++) {
            tabLayout.getTabAt(i).setText(titles[i]);
        }
    }

    public void setUpViewPager(final ViewPager viewPager) {
        final ClassTabsPagerAdapter pagerAdapter = new ClassTabsPagerAdapter(getSupportFragmentManager());
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String username = preferences.getString(CURRENT_USERNAME,null);
        String feecrendential = BASE_URL + API_VERSION_ONE + ATTENDANCE + DETAILS + MOBILE +USER + username;
        Log.v("url","attendance "+feecrendential);
        GETUrlConnection GETUrlConnection = new GETUrlConnection(ParentAttendanceActivity.this, feecrendential,null) {
            ProgressBar progressBar = (ProgressBar) findViewById(R.id.loading_bar);
            TextView no_content = (TextView) findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("student ", "attendance" +response);
                if (response != null) {
                    progressBar.setVisibility(View.INVISIBLE);
                    try {
                        stringUtils.checkSession(response);
                        if (userRole.equalsIgnoreCase(EMPLOYEE)) {
                            ParentAttendanceParser parentAttendanceParser = new ParentAttendanceParser();
                            parentAttendanceParser.getParentAttendaceList(response);
                        }
                        Bundle bundle = new Bundle();
                        bundle.putString("studentName", studentName);
                        OverviewFragment overviewFragment = new OverviewFragment();
                        overviewFragment.setArguments(bundle);
                        LeaveStatusFragment leaveStatusFragment = new LeaveStatusFragment();
                        leaveStatusFragment.setArguments(bundle);
                        pagerAdapter.addFragment(overviewFragment, "Overview");
                        pagerAdapter.addFragment(leaveStatusFragment, "Status");
                        viewPager.setAdapter(pagerAdapter);
                        TabLayout tabLayout = (TabLayout)ParentAttendanceActivity.this.findViewById(R.id.class_activity_tablayout);
                        tabLayout.setupWithViewPager(viewPager);
                        String[] titles = {(String) getResources().getText(R.string.overview), (String) getResources().getText(R.string.status)};
                        for (int i = 0; i < titles.length; i++) {
                            tabLayout.getTabAt(i).setText(titles[i]);
                        }
                    }catch (SessionExpiredException e) {
                        e.handleException(ParentAttendanceActivity.this);
                    }catch (Exception e) {
                        e.printStackTrace();
                        progressBar.setVisibility(View.GONE);
                        no_content.setVisibility(View.VISIBLE);
                    }
                } else {
                    progressBar.setVisibility(View.GONE);
                    no_content.setVisibility(View.VISIBLE);
                }
            }
        };
        GETUrlConnection.execute();
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
        finish();
    }
}
