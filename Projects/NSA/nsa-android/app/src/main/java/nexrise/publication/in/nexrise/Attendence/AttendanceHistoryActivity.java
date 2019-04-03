package nexrise.publication.in.nexrise.Attendence;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;

import nexrise.publication.in.nexrise.FragmentPagerAdapter.ClassTabsPagerAdapter;
import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class AttendanceHistoryActivity extends AppCompatActivity {

    String classId;
    String sectionId;
    String className;
    String sectionName;

    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_attendance_histoty);

        Intent intent = getIntent();
        classId = intent.getStringExtra("classId");
        sectionId = intent.getStringExtra("sectionId");
        className = intent.getStringExtra("className");
        sectionName = intent.getStringExtra("sectionName");

        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setElevation(0);
            actionBar.setTitle(className +"-"+sectionName);
        }

        ViewPager viewPager = (ViewPager) findViewById(R.id.pager);
        setUpViewPager(viewPager);

        TabLayout tabLayout = (TabLayout) findViewById(R.id.tablayout);
        tabLayout.setupWithViewPager(viewPager);

        String[] titles = {(String) getResources().getText(R.string.record),(String) getResources().getText(R.string.att_history),(String) getResources().getText(R.string.oveall_history)};
        for (int i = 0; i < titles.length; i++) {
            tabLayout.getTabAt(i).setText(titles[i]);
        }
    }


    @Override
    protected void onResume() {
        super.onResume();

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    public void setUpViewPager(ViewPager viewPager) {
        ClassTabsPagerAdapter pagerAdapter = new ClassTabsPagerAdapter(getSupportFragmentManager());
        Bundle bundle = new Bundle();
        bundle.putString("classId", classId);
        bundle.putString("sectionId", sectionId);
        bundle.putString("className",className);
        bundle.putString("sectionName",sectionName);

        AttendanceRecordFragment recordAttendance =new AttendanceRecordFragment();
        recordAttendance.setArguments(bundle);
        AttendanceLeaveHistoryFragment leaveHistory = new AttendanceLeaveHistoryFragment();
        leaveHistory.setArguments(bundle);
        OverallAttendanceFragment overallAttendanceFragment = new OverallAttendanceFragment();
        overallAttendanceFragment.setArguments(bundle);

        pagerAdapter.addFragment(recordAttendance, "Record");
        pagerAdapter.addFragment(leaveHistory , "Attendance History");
        pagerAdapter.addFragment(overallAttendanceFragment,"overall");
        viewPager.setAdapter(pagerAdapter);
        viewPager.setOffscreenPageLimit(2);
    }
}
