package nexrise.publication.in.nexrise.HomeworkFeature;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.SearchView;

import nexrise.publication.in.nexrise.BeanClass.TeacherHomeWork;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.TabsPagerAdapter;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;


public class DetailsPageActivity extends AppCompatActivity implements Constants {
    ActionBar actionBar;
    String[] tabTitle;
    TeacherHomeWork homeWorkArrayList;
    ViewPager viewPager;
    String userRole;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_details_page);
        homeWorkArrayList = (TeacherHomeWork) getIntent().getExtras().getSerializable("ListData");
        userRole = new StringUtils().getUserRole(this);
        viewPager = (ViewPager)findViewById(R.id.pager);
        setUpViewpager(viewPager);

        TabLayout tabLayout = (TabLayout)findViewById(R.id.tablayout);
        tabLayout.setupWithViewPager(viewPager);
        actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setTitle(R.string.homework);
            actionBar.setElevation(0);
        }

        if(userRole.equalsIgnoreCase(EMPLOYEE))
            //Teacher Assigment Details View
            tabTitle = new String[]{(String) getResources().getText(R.string.details),(String) getResources().getText(R.string.status)};
        else
            // Parent Assignment Details View
            tabTitle = new String[]{(String) getResources().getText(R.string.details),"Comments"};

        for(int i=0; i<tabTitle.length; i++){
            tabLayout.getTabAt(i).setText(tabTitle[i]);
        }
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                Intent intent = new Intent();
                intent.putExtra("ListFromDetailsActivity",getIntent().getSerializableExtra("ListData"));
                setResult(RESULT_OK, intent);
                onBackPressed();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.actionbar, menu);
        MenuItem menuItem = menu.findItem(R.id.searchbar);

        android.widget.SearchView searchView = (android.widget.SearchView) menuItem.getActionView();

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
                Log.v("test ","change listener "+newText);
                switch (viewPager.getCurrentItem()) {
                    case 0:
                        break;
                    case 1:
                        StatusFragment statusFragment = new StatusFragment();
                        statusFragment.search(newText);
                        break;
                    case 2:
                        break;
                }
                return true;
            }
        });
        return super.onCreateOptionsMenu(menu);
    }

    public void setUpViewpager(ViewPager viewpager){
        TabsPagerAdapter pagerAdapter = new TabsPagerAdapter(getSupportFragmentManager());
        String fromActivity = getIntent().getStringExtra("FromActivity");
        Bundle bundle = new Bundle();
        //From AddHomeWorkActivity Arraylist<String> is passed via intent
        // here the ArrayList<String> is retrieved as getSerializableExtra.
        bundle.putSerializable("SerializedList", getIntent().getSerializableExtra("ListData"));
        bundle.putString("FromActivity", fromActivity);
        if (fromActivity.equals("MainActivity")){
            bundle.putInt("Index", getIntent().getIntExtra("Index", 0));
        }
        DetailsFragment detailsFragment = new DetailsFragment();
        detailsFragment.setArguments(bundle);
        StatusFragment statusFragment = new StatusFragment();
        statusFragment.setArguments(bundle);
        /*CommentsPageFragment commentsPageFragment = new CommentsPageFragment();
        commentsPageFragment.setArguments(bundle);*/
        if(userRole.equalsIgnoreCase(EMPLOYEE)) {
            pagerAdapter.addFragment(detailsFragment, "Details");
            pagerAdapter.addFragment(statusFragment, "Status");
          //  pagerAdapter.addFragment(commentsPageFragment, "Comments");
        }
        viewpager.setAdapter(pagerAdapter);
    }
}

