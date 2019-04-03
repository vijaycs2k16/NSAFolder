package nexrise.publication.in.nexrise.ExamFeature;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.ClassTabbedFragmentAdapter;
import nexrise.publication.in.nexrise.ProgressReportFeature.BarGraphFragment;
import nexrise.publication.in.nexrise.ProgressReportFeature.OverallGraphFragment;
import nexrise.publication.in.nexrise.ProgressReportFeature.StudentReportTableFragment;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;


public class ExamDetailsActivity extends AppCompatActivity implements Constants {

    List<Integer> defaultIcons;
    List<Integer> selectedIcons;
    String userRole;
    StringUtils stringUtils;
    String actionbarTitle;
    String classId;
    String sectionId;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exam_details);

        ActionBar actionBar = getSupportActionBar();
        stringUtils = new StringUtils();
        userRole = stringUtils.getUserRole(this);
        defaultIcons = new ArrayList<>();
        defaultIcons.add(R.drawable.ic_exam1);
        defaultIcons.add(R.drawable.ic_portions_outline);
        defaultIcons.add(R.drawable.ic_result_line);
        defaultIcons.add(R.drawable.ic_progress_card_line);

        selectedIcons = new ArrayList<>();
        selectedIcons.add(R.drawable.ic_exam_solid1);
        selectedIcons.add(R.drawable.ic_portions_solid);
        selectedIcons.add(R.drawable.ic_result_solid);
        selectedIcons.add(R.drawable.ic_progress_card_selected);

        actionbarTitle = "Examinations";
        if(getIntent().hasExtra(EXAM_NAME))
            actionbarTitle = getIntent().getStringExtra(EXAM_NAME);

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(actionbarTitle);
        }

        ViewPager viewPager = (ViewPager)findViewById(R.id.class_fragment_pager);;
        setupViewPager(viewPager);
        TabLayout tabLayout = (TabLayout)findViewById(R.id.class_fragment_tablayout);
        tabLayout.setupWithViewPager(viewPager);
        String titles[]  = {(String) getResources().getText(R.string.schedule), (String) getResources().getText(R.string.portion), (String) getResources().getText(R.string.results), (String) getResources().getText(R.string.statistics)};
        int[] icon = {R.drawable.ic_exam_solid1, R.drawable.ic_portions_outline, R.drawable.ic_result_line,R.drawable.ic_progress_card_line};
        try {
            for (int i = 0; i < titles.length; i++) {
                tabLayout.getTabAt(i).setText(titles[i]);
                tabLayout.getTabAt(i).setIcon(icon[i]);
            }
            tabSelectListener(tabLayout);
        } catch (NullPointerException e){
            e.printStackTrace();
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

    private void setupViewPager(ViewPager viewPager) {
        ClassTabbedFragmentAdapter fragmentAdapter = new ClassTabbedFragmentAdapter(getSupportFragmentManager());
        ExamScheduleFragment schedule = new ExamScheduleFragment();
        Intent intent = getIntent();
        Bundle bundle = new Bundle();
        if(intent.hasExtra("examObject"))
            bundle.putSerializable("examObject", intent.getSerializableExtra("examObject"));
        if(intent.hasExtra(EXAM_NAME))
            bundle.putString(EXAM_NAME, intent.getStringExtra(EXAM_NAME));

        bundle.putString(CLASS_NAME, intent.getStringExtra(CLASS_NAME));
        bundle.putString(SECTION_NAME, intent.getStringExtra(SECTION_NAME));
        bundle.putString(CLASS_ID, intent.getStringExtra(CLASS_ID));
        classId = intent.getStringExtra(CLASS_ID);
        bundle.putString(SECTION_ID, intent.getStringExtra(SECTION_ID));
        sectionId = intent.getStringExtra(SECTION_ID);
        bundle.putString(EXAM_NAME,actionbarTitle);

        if (intent.hasExtra(SCHEDULE_ID))
            bundle.putString(SCHEDULE_ID, intent.getStringExtra(SCHEDULE_ID));

        schedule.setArguments(bundle);
        fragmentAdapter.addFragment(schedule, "Exam schedule");

        PortionsFragment portions = new PortionsFragment();
        portions.setArguments(bundle);
        fragmentAdapter.addFragment(portions, "Portions");

        StudentReportTableFragment markList = new StudentReportTableFragment();
        markList.setArguments(bundle);
        BarGraphFragment barGraphFragment = new BarGraphFragment();
        barGraphFragment.setArguments(bundle);
        TeacherExamListFragment teacherExamListFragment = new TeacherExamListFragment();
        teacherExamListFragment.setArguments(bundle);
        OverallGraphFragment overallGraphFragment = new OverallGraphFragment();
        overallGraphFragment.setArguments(bundle);

        if(userRole.equalsIgnoreCase(PARENT)){
            fragmentAdapter.addFragment(markList, "Mark list");
            fragmentAdapter.addFragment(barGraphFragment,"Bar Graph");
        } else {
            fragmentAdapter.addFragment(teacherExamListFragment,"Mark list");
            fragmentAdapter.addFragment(overallGraphFragment,"Overall Graph");
        }

        viewPager.setAdapter(fragmentAdapter);
        viewPager.setOffscreenPageLimit(4);
    }

    private void tabSelectListener(final TabLayout tabLayout) {


        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            int position;
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                position = tab.getPosition();
                tab.setIcon(selectedIcons.get(position));
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {
                position = tab.getPosition();
                tab.setIcon(defaultIcons.get(position));
            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {
                position = tab.getPosition();
                tab.setIcon(selectedIcons.get(position));
            }
        });

    }
}
