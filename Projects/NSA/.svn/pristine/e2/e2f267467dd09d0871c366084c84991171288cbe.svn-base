package nexrise.publication.in.nexrise.ProgressReportFeature;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;

import nexrise.publication.in.nexrise.FragmentPagerAdapter.ClassTabsPagerAdapter;
import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class OverallReportActivity extends AppCompatActivity {
    String studentName;
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_overall_report);

        ActionBar actionBar = getSupportActionBar();
        studentName = getIntent().getStringExtra("studentName");
        Log.v("Student name ","parent login "+studentName);
        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setElevation(0);
            if(studentName!= null) {
                actionBar.setTitle("Overall report - "+studentName);
            } else {
                actionBar.setTitle("Overall report - Ashmitha prakash");
            }
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        ViewPager viewPager = (ViewPager) findViewById(R.id.class_activity_pager);
        setUpViewPager(viewPager);

        TabLayout tabLayout = (TabLayout) findViewById(R.id.class_activity_tablayout);
        tabLayout.setupWithViewPager(viewPager);

        String[] titles = {"Table", "Graph"};
        for (int i = 0; i < titles.length; i++) {
            tabLayout.getTabAt(i).setText(titles[i]);
        }

        int page = getIntent().getIntExtra("Page",0);
        if(page != 0){
            viewPager.setCurrentItem(page);
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

    public void setUpViewPager(ViewPager viewPager) {
        ClassTabsPagerAdapter pagerAdapter = new ClassTabsPagerAdapter(getSupportFragmentManager());
        OverallReportTableFragment overallReportTableFragment = new OverallReportTableFragment();
        Bundle bundle = new Bundle();

        if(studentName != null){
            if(studentName.equals("Arnab Mukrjee") || studentName.equals("Ashmita Prakash")){

                bundle.putString("studentName",getIntent().getStringExtra("Name"));
            }
            else{
                bundle.putString("studentName",getIntent().getStringExtra("studentName"));
            }
        }
        overallReportTableFragment.setArguments(bundle);

        OverallReportGraphFragment overallReportGraphFragment = new OverallReportGraphFragment();
        overallReportGraphFragment.setArguments(bundle);

        pagerAdapter.addFragment(overallReportTableFragment, "Table");
        pagerAdapter.addFragment(overallReportGraphFragment, "Graph");

        viewPager.setAdapter(pagerAdapter);
    }
}
