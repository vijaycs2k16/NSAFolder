package nexrise.publication.in.nexrise.ProgressReportFeature;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.ExamMarks;
import nexrise.publication.in.nexrise.BeanClass.ProgressResult;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.TabsPagerAdapter;
import nexrise.publication.in.nexrise.R;

public class StudentDetailsActivity extends AppCompatActivity implements Constants {
    Bundle bundle;
    ProgressResult progressResult;
    Intent intent;
    ArrayList<ExamMarks> marksList;
    String firstName;
    String totalObtained;
    String totalMarks;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_details);

        ActionBar actionBar = getSupportActionBar();

        intent = getIntent();

        marksList = (ArrayList<ExamMarks>) intent.getSerializableExtra("markList");
        String examName = intent.getStringExtra(EXAM_NAME);

        firstName = intent.getStringExtra(FIRST_NAME);
        totalObtained = intent.getStringExtra(TOTAL_OBTAINED);
        totalMarks = intent.getStringExtra(TOTAL_MARKS);
        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setElevation(0);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle(examName);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        ViewPager vpPager = (ViewPager) findViewById(R.id.pager);
        setUpViewPager(vpPager);

        TabLayout tabLayout = (TabLayout)findViewById(R.id.tablayout);
        tabLayout.setupWithViewPager(vpPager);

        String[] tabTitle = {(String) getResources().getText(R.string.report),(String) getResources().getText(R.string.statistics)};
        for(int i=0; i<tabTitle.length; i++){
            tabLayout.getTabAt(i).setText(tabTitle[i]);
        }

        if(intent.hasExtra("Page")) {
            int currentPage = intent.getIntExtra("Page", 0);
            vpPager.setCurrentItem(currentPage);
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

    public void setUpViewPager(ViewPager viewPager){
        TabsPagerAdapter pagerAdapter = new TabsPagerAdapter(getSupportFragmentManager());

        StudentReportTableFragment markList = new StudentReportTableFragment();
        Bundle bundle1 = new Bundle();
        bundle1.putSerializable("markList", marksList);
        bundle1.putString(FIRST_NAME,firstName);
        bundle1.putString(TOTAL_OBTAINED,totalObtained);
        bundle1.putString(TOTAL_MARKS,totalMarks);

        markList.setArguments(bundle1);
        BarGraphFragment barGraphFragment = new BarGraphFragment();
        barGraphFragment.setArguments(bundle1);

        pagerAdapter.addFragment(markList, "Table");
        pagerAdapter.addFragment(barGraphFragment, "Graph");

        viewPager.setAdapter(pagerAdapter);
    }
}
