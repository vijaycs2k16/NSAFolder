package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;

import nexrise.publication.in.nexrise.FragmentPagerAdapter.ClassTabsPagerAdapter;
import nexrise.publication.in.nexrise.HomeworkFeature.HomeWorkFragment;
import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

/**
 * Created by Sai Deepak on 12-Oct-16.
 */

public class TeacherActivity extends AppCompatActivity {

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_class);

        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(R.string.my_timetable);
            actionBar.setElevation(0);
        }
        ViewPager viewPager = (ViewPager) findViewById(R.id.class_activity_pager);
        setUpViewPager(viewPager);

        TabLayout tabLayout = (TabLayout) findViewById(R.id.class_activity_tablayout);
        tabLayout.setupWithViewPager(viewPager);

        String[] titles = {(String) getResources().getText(R.string.classes),(String) getResources().getText(R.string.homework)};
        for (int i = 0; i < titles.length; i++) {
            tabLayout.getTabAt(i).setText(titles[i]);
        }
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
        //TeacherExamFragment teacherExamFragment = new TeacherExamFragment();
        pagerAdapter.addFragment(new TeacherClassTabbedFragment(), "class");
        pagerAdapter.addFragment(new HomeWorkFragment(), "homework");
        viewPager.setAdapter(pagerAdapter);
    }
}
