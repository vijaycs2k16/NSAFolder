package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.ClassTabsPagerAdapter;
import nexrise.publication.in.nexrise.ParentFeatures.HomeworkFeature.ParentHomeworkFragment;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ClassActivity extends AppCompatActivity implements Constants {
    StringUtils stringUtils = new StringUtils();
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
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.timetable);
        }

        ViewPager viewPager = (ViewPager) findViewById(R.id.class_activity_pager);
        setUpViewPager(viewPager);

        TabLayout tabLayout = (TabLayout) findViewById(R.id.class_activity_tablayout);
        tabLayout.setupWithViewPager(viewPager);
        String[] titles;
        if(stringUtils.getUserRole(ClassActivity.this).equalsIgnoreCase(PARENT)) {
            titles = new String[]{(String) getResources().getText(R.string.classes), (String) getResources().getText(R.string.homework), (String) getResources().getText(R.string.holiday)};
        } else {
            titles = new String[]{(String) getResources().getText(R.string.classes), (String) getResources().getText(R.string.holiday)};
        }
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
        Intent intent = getIntent();
        Bundle bundle = new Bundle();

        if(intent.hasExtra("Classes")) {
            Classes classes = (Classes) intent.getSerializableExtra("Classes");
            bundle.putSerializable("Classes", classes);
        }
        ClassTabbedFragment classTabbedFragment = new ClassTabbedFragment();
        classTabbedFragment.setArguments(bundle);

        ParentHomeworkFragment parentHomeworkFragment = new ParentHomeworkFragment();
        parentHomeworkFragment.setArguments(bundle);

       /* ExamFragment examFragment = new ExamFragment();
        examFragment.setArguments(bundle);*/

        pagerAdapter.addFragment(classTabbedFragment, "class");
        // pagerAdapter.addFragment(examFragment, "exam");
        //pagerAdapter.addFragment(eventFragment, "events");
        if(stringUtils.getUserRole(ClassActivity.this).equalsIgnoreCase(PARENT)) {
            pagerAdapter.addFragment(new ParentHomeworkFragment(), "homework");
        }
        pagerAdapter.addFragment(new HolidaysListFragment(), "holidays");
        viewPager.setAdapter(pagerAdapter);
    }
}