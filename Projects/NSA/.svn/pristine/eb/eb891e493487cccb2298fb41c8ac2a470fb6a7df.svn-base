package nexrise.publication.in.nexrise.FeeManagement;

import android.app.SearchManager;
import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ProgressBar;

import org.json.JSONException;

import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.TabsPagerAdapter;
import nexrise.publication.in.nexrise.JsonParser.FeesManagementJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

import static nexrise.publication.in.nexrise.Constants.API_VERSION_ONE;
import static nexrise.publication.in.nexrise.Constants.ASSIGN;
import static nexrise.publication.in.nexrise.Constants.BASE_URL;
import static nexrise.publication.in.nexrise.Constants.FEE;
import static nexrise.publication.in.nexrise.Constants.USERS;

public class FeeManagementActivity extends AppCompatActivity {

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fee_management);

        String feecrendential = BASE_URL + API_VERSION_ONE + FEE + ASSIGN + USERS ;
        GETUrlConnection GETUrlConnection = new GETUrlConnection(FeeManagementActivity.this, feecrendential,null) {
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.notification_loading);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                progressBar.setVisibility(View.GONE);
                try {
                    new StringUtils().checkSession(response);
                    Log.v("feeresponse","FeeManagement"+ response);

                    FeesManagementJsonParser feesManagementJsonParser = new FeesManagementJsonParser();
                    feesManagementJsonParser.getFeeDetails(response);
                    ViewPager vpPager = (ViewPager) findViewById(R.id.pager);
                    setUpViewPager(vpPager);

                    TabLayout tabLayout = (TabLayout) findViewById(R.id.tablayout);
                    tabLayout.setupWithViewPager(vpPager);

                    String[] tabTitle = {(String) getResources().getText(R.string.pending_fee),(String) getResources().getText(R.string.fee_history)};
                    for(int i=0; i<tabTitle.length; i++){
                        tabLayout.getTabAt(i).setText(tabTitle[i]);
                    }
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(FeeManagementActivity.this);
                }
            }
        };
        GETUrlConnection.execute();


        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.fee_management);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

    }

    @Override
    protected void onResume() {
        super.onResume();

        ViewPager vpPager = (ViewPager) findViewById(R.id.pager);
        setUpViewPager(vpPager);

        TabLayout tabLayout = (TabLayout)findViewById(R.id.tablayout);
        tabLayout.setupWithViewPager(vpPager);

        String[] tabTitle = {(String) getResources().getText(R.string.pending_fee),(String) getResources().getText(R.string.fee_history)};
        for(int i=0; i<tabTitle.length; i++){
            tabLayout.getTabAt(i).setText(tabTitle[i]);
        }

        /*EventsFeatureJsonFormation jsonFormation = new EventsFeatureJsonFormation();
        JSONObject jsonObject = jsonFormation.formJson();
        EventsFeatureJsonParser parser = new EventsFeatureJsonParser();
        List<EventsFeature> eventsFeatureList = parser.parse(jsonObject);*/

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
        searchView.setIconifiedByDefault(false);
        return super.onCreateOptionsMenu(menu);
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
        pagerAdapter.addFragment(new PendingFeesFragment(), "Pending Fees");
        pagerAdapter.addFragment(new FeeHistoryFragment(), "Fee History");

        viewPager.setAdapter(pagerAdapter);
    }
}
