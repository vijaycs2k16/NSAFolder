package nexrise.publication.in.nexrise;

import android.app.ProgressDialog;
import android.app.SearchManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;
import android.support.design.widget.NavigationView;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v4.view.GravityCompat;
import android.support.v4.view.ViewPager;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import me.leolin.shortcutbadger.ShortcutBadgeException;
import me.leolin.shortcutbadger.ShortcutBadger;
import nexrise.publication.in.nexrise.BeanClass.Icons;
import nexrise.publication.in.nexrise.BeanClass.ParentProfile;
import nexrise.publication.in.nexrise.Common.DatabaseHelper;
import nexrise.publication.in.nexrise.Common.LoginActivity;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Common.SplashScreenActivity;
import nexrise.publication.in.nexrise.CustomHashMap.Initiater;
import nexrise.publication.in.nexrise.Dashboard.DashboardFragment;
import nexrise.publication.in.nexrise.EventsFeature.EventsFeatureFragment;
import nexrise.publication.in.nexrise.EventsFeature.EventsFeatureListFragment;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.TabsPagerAdapter;
import nexrise.publication.in.nexrise.HomeworkFeature.DrawerFragment;
import nexrise.publication.in.nexrise.HomeworkFeature.HomeWorkFragment;
import nexrise.publication.in.nexrise.JsonParser.ParentProfileJsonParser;
import nexrise.publication.in.nexrise.Notifications.NotificationLogActivity;
import nexrise.publication.in.nexrise.ParentFeatures.HomeworkFeature.ParentHomeworkFragment;
import nexrise.publication.in.nexrise.Profile.ProfileActivity;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.PushNotification.MyReceiver;
import nexrise.publication.in.nexrise.URLConnection.DELETEUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.RoundedImageView;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class NavigationDrawerActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener, Constants {
    List<Integer> defaultIcons = new ArrayList<>() ;
    ActionBar actionBar;
    int tabPosition = 0;
    ViewPager vpPager;
    TabLayout.Tab tab;
    public static Boolean inBackground = true;
    SharedPreferences preferences;
    ArrayList<String> subFeatureIdList = new ArrayList<>();
    ArrayList<String> contentDescription = new ArrayList<>();
    ArrayList<Map.Entry<String,Icons>> featureList;
    final ArrayList<Integer> icons = new ArrayList<>();
    TabLayout tabLayout;
    int count = 0;
    RoundedImageView profilepic;
    ParentProfile parentProfile = new ParentProfile();
    final ArrayList<String> titles = new ArrayList<>();
    StringUtils stringUtils = new StringUtils();
    final int PROFILE_PIC = 10;

    //This method has been overriden to change the font
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_navigation_drawer);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        LinkedHashMap<String,Icons> stringIconsLinkedHashMap =  MessageReceivingService.newFeatureList;
        Log.v("Icons "," feature "+stringIconsLinkedHashMap);
        featureList = new ArrayList<>(stringIconsLinkedHashMap.entrySet());

        // If the feature list is empty there is no point of loading this Activity, because there won't be any icons in the viewpager
        // So this Activity is re-directed to SplashScreenActivity and everything starts from the beginning

        if(featureList.size() == 0) {
            Intent loadFromBegining = new Intent(NavigationDrawerActivity.this, SplashScreenActivity.class);
            loadFromBegining.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(loadFromBegining);
        }

        if (featureList.size()>5){
            for(int i=0;i<4;i++){
                String subFeatureId = featureList.get(i).getValue().getSubFeatureId();
                int iconsDefault = featureList.get(i).getValue().getMenuIcon();
                int iconsSelected = featureList.get(i).getValue().getMenuIconSelected();
                String featureName = featureList.get(i).getValue().getFeatureName();
                defaultIcons.add(iconsDefault);
                icons.add(iconsSelected);
                titles.add(featureName);
                contentDescription.add(subFeatureId);
            }
            defaultIcons.add(R.drawable.ic_more_menu);
            icons.add(R.drawable.ic_more_menu_selected);
            titles.add((String) getResources().getText(R.string.more_option));
            contentDescription.add("0");
        } else {
            for(int i=0;i<featureList.size();i++){
                String subFeatureId = featureList.get(i).getValue().getSubFeatureId();
                int iconsDefault = featureList.get(i).getValue().getMenuIcon();
                int iconsSelected =  featureList.get(i).getValue().getMenuIconSelected();
                String featureName = featureList.get(i).getValue().getFeatureName();
                Log.v("FEature ","subFeatureId "+subFeatureId);
                defaultIcons.add(iconsDefault);
                icons.add(iconsSelected);
                titles.add(featureName);
                contentDescription.add(subFeatureId);
            }
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);
        Menu menu =navigationView.getMenu();
            MenuItem target = menu.findItem(R.id.feedback);
        if(stringUtils.getUserRole(NavigationDrawerActivity.this).equalsIgnoreCase(EMPLOYEE))
            target.setVisible(false);
        LayoutInflater layoutInflater = getLayoutInflater();
        final View headerView = navigationView.getHeaderView(0);

        View view = layoutInflater.inflate(R.layout.nav_header_navigation_drawer, null);
        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        profilepic = (RoundedImageView) headerView.findViewById(R.id.civProfilePic);
        Glide.with(NavigationDrawerActivity.this)
                .load(R.drawable.user)
                .asBitmap()
                .into(profilepic);
        if(stringUtils.getUserRole(NavigationDrawerActivity.this).equalsIgnoreCase(PARENT))
            showProfilePic();
        //add profile pic here
        String firstName = preferences.getString(FIRST_NAME, null);
        TextView headerTextview = (TextView) headerView.findViewById(R.id.nav_header_textview);
        headerTextview.setText(firstName);

        actionBar = getSupportActionBar();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
        }

        vpPager = (ViewPager) findViewById(R.id.nav_view_pager);
        setUpViewPager(vpPager);
        AtomicInteger integer = new AtomicInteger(1);
        int s = integer.get();
        vpPager.setId(s);
        int position = getIntent().getIntExtra("Tab position",0);

        tabLayout = (TabLayout)findViewById(R.id.nav_tablayout);
        tabLayout.setupWithViewPager(vpPager);

        for(int i=0; i<tabLayout.getTabCount(); i++) {
            tab = tabLayout.getTabAt(i);
            tab.setContentDescription(contentDescription.get(i));
            FrameLayout frameLayout = (FrameLayout) LayoutInflater.from(this).inflate(R.layout.tab_layout, tabLayout, false);
            ImageView img = (ImageView)frameLayout.findViewById(R.id.tab_layout_imageview);
            img.setImageResource(defaultIcons.get(i));

            assert tab != null;
            tab.setCustomView(frameLayout);
            tab.setText(R.string.homework);
        }
        if (position != 0){
            vpPager.setCurrentItem(position);
            tabPosition = position;
        }
        //  tabLayout.getTabAt(0).getCustomView().findViewById(R.id.tab_layout_frame).setBackgroundResource(R.drawable.border);
        if(MyReceiver.notificationCount != 0)
            setNotificationCount();

        tabSelectedListener(tabLayout,vpPager, tabPosition);
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        }
        try {
            String userRole = stringUtils.getUserRole(NavigationDrawerActivity.this);
            if(userRole.equalsIgnoreCase(PARENT)){
                if (LoginActivity.login)
                    minimizeApplication();
                else
                    super.onBackPressed();
            } else {
                int currentTabPosition = tabLayout.getSelectedTabPosition();
                String contentDesc = String.valueOf(tabLayout.getTabAt(currentTabPosition).getContentDescription());
                if (currentTabPosition != 0 && contentDesc.equals(CREATE_EVENT)) {
                    TabsPagerAdapter tabsPagerAdapter = (TabsPagerAdapter)vpPager.getAdapter();
                    Fragment fragment = tabsPagerAdapter.getItem(vpPager.getCurrentItem());
                    if(fragment instanceof EventsFeatureFragment && EventsFeatureFragment.clicked) {
                        EventsFeatureFragment eventsFeatureFragment = (EventsFeatureFragment)fragment;
                        eventsFeatureFragment.floatingActionButtonTeacher();
                    } else {
                        minimizeApplication();
                    }
                } else {
                    minimizeApplication();
                }
            }
        } catch (NullPointerException e) {
            e.getMessage();
        }
    }

    public void minimizeApplication() {
        Intent home = new Intent(Intent.ACTION_MAIN);
        home.addCategory(Intent.CATEGORY_HOME);
        home.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(home);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.search_notification_actionbar, menu);
        final MenuItem menuItem = menu.findItem(R.id.searchbar);

        MenuItem notification = menu.findItem(R.id.testAction);
        notification.setIcon(buildCounterDrawable(count, R.drawable.notification_bell));

        final android.widget.SearchView searchView = (android.widget.SearchView) menuItem.getActionView();

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
                TabsPagerAdapter tabsPagerAdapter = (TabsPagerAdapter)vpPager.getAdapter();
                if(vpPager.getCurrentItem() < tabsPagerAdapter.getCount()) {
                    Fragment fragment = tabsPagerAdapter.getItem(vpPager.getCurrentItem());
                    if (fragment instanceof EventsFeatureFragment) {
                        EventsFeatureListFragment eventsListFragment = (EventsFeatureListFragment) fragment.getFragmentManager().findFragmentByTag("EventsFeatureListFragment");
                        if (eventsListFragment != null && eventsListFragment.isVisible())
                            eventsListFragment.search(newText);
                    } else if (fragment instanceof HomeWorkFragment) {
                        HomeWorkFragment homeWorkFragment = (HomeWorkFragment) fragment;
                        if (homeWorkFragment != null && homeWorkFragment.isVisible())
                            homeWorkFragment.search(newText);
                    } else if (fragment instanceof ParentHomeworkFragment) {
                        ParentHomeworkFragment parentHomeworkFragment = (ParentHomeworkFragment) fragment;
                        if (parentHomeworkFragment != null && parentHomeworkFragment.isVisible())
                            parentHomeworkFragment.search(newText);
                    }
                }
                return true;
            }
        });

        notification.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                try {
                    Integer notificationCount = StringUtils.getInstance().getNotificationCount(NavigationDrawerActivity.this, CREATE_NOTIFICATION);
                    count = 0;
                    if (notificationCount > 0) {
                        MyReceiver.notificationCount = MyReceiver.notificationCount - notificationCount;
                        StringUtils.getInstance().reduceNotificationCount(NavigationDrawerActivity.this, CREATE_NOTIFICATION);
                        stringUtils.cancelAllNotification(NavigationDrawerActivity.this);
                    }
                    invalidateOptionsMenu();
                    Intent intent = new Intent(NavigationDrawerActivity.this, NotificationLogActivity.class);
                    startActivity(intent);
                } catch (NullPointerException e) {
                    e.printStackTrace();
                }
                return false;
            }
        });
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    protected void onResume() {
        super.onResume();
        inBackground = false;
        try {
            ShortcutBadger.applyCountOrThrow(this,0);
        } catch (ShortcutBadgeException e) {
            Log.i("SHORTCUT","BADGER EXCEPTION");
        }

        setNotificationCount();

        LocalBroadcastManager.getInstance(this).registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                setNotificationCount();
            }
        }, new IntentFilter(MessageReceivingService.ACTION_BROADCAST));
    }

    public void setNotificationCount() {
        try {
            for (int i = 0; i < tabLayout.getTabCount(); i++) {
                TabLayout.Tab getTab = tabLayout.getTabAt(i);
                assert getTab != null;

                View tabView = getTab.getCustomView();
                String featureId = String.valueOf(getTab.getContentDescription());
                if (featureId != null) {
                    Integer count = StringUtils.getInstance().getNotificationCount(this, featureId);

                    assert tabView != null;
                    if (count != 0) {
                        RelativeLayout relativeLayout = (RelativeLayout) tabView.findViewById(R.id.notify_nav_icons);
                        relativeLayout.setVisibility(View.VISIBLE);
                        TextView notificationCount = (TextView) tabView.findViewById(R.id.notification_count);
                        notificationCount.setText(String.valueOf(count));
                    } else {
                        RelativeLayout relativeLayout = (RelativeLayout) tabView.findViewById(R.id.notify_nav_icons);
                        relativeLayout.setVisibility(View.GONE);
                    }
                }
            }
            //This is to set the notification count in the bell icon
            count = StringUtils.getInstance().getNotificationCount(this, CREATE_NOTIFICATION);
            Log.v("NOTIficaTion ", " count " + count);
            if(count != 0)
                refreshDashboard();
            invalidateOptionsMenu();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void refreshDashboard() throws Exception {
        int selectedTabPosition = tabLayout.getSelectedTabPosition();
        if(selectedTabPosition == 0) {
            TabsPagerAdapter tabsPagerAdapter = (TabsPagerAdapter)vpPager.getAdapter();
            Fragment fragment = tabsPagerAdapter.getItem(vpPager.getCurrentItem());
            if(fragment instanceof DashboardFragment) {
                DashboardFragment drawerFragment = (DashboardFragment) fragment;
                drawerFragment.renderData();
            }
        }
    }

    public void setUpViewPager(ViewPager vpPager) {
        TabsPagerAdapter adapter = new TabsPagerAdapter(getSupportFragmentManager());
        Config configFragment = new Config();
        LinkedHashMap<String,Fragment> fragmentList = configFragment.setFragmentList(this);
        if(featureList.size() > 5){
            for(int i=0; i<4; i++){
                String featureId = featureList.get(i).getKey();
                Fragment fragment = fragmentList.get(featureId);
                adapter.addFragment(fragment, fragment.getClass().getName());
            }
            ArrayList<String> drawerList = new ArrayList<>();
            for (int j=4; j<featureList.size(); j++){
                drawerList.add(featureList.get(j).getKey());
                Log.v("Feature","Key"+featureList.get(j).getKey());
            }
            DrawerFragment drawerFragment = new DrawerFragment();
            Bundle bundle = new Bundle();
            bundle.putSerializable("FeatureList", drawerList);
            drawerFragment.setArguments(bundle);

            adapter.addFragment(drawerFragment,"Five");
        } else {
            for(int i=0;i<featureList.size();i++){
                String featureId = featureList.get(i).getKey();
                Fragment fragment = fragmentList.get(featureId);
                adapter.addFragment(fragmentList.get(featureId),fragment.getClass().getName());
            }
        }

        vpPager.setAdapter(adapter);
    }

    public void tabSelectedListener(final TabLayout tabLayout, final ViewPager viewPager, int position){
        TabLayout.Tab tab = tabLayout.getTabAt(position);
        if (tab!= null) {
            ImageView imageView = (ImageView) tab.getCustomView().findViewById(R.id.tab_layout_imageview);
            imageView.setImageResource(icons.get(position));
        }
        if(actionBar!=null && titles.size() != 0){
            actionBar.setTitle(titles.get(position));
            actionBar.invalidateOptionsMenu();
        }

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                try {
                    int tabPosition = tab.getPosition();
                    Integer notificationCount = StringUtils.getInstance().getNotificationCount(NavigationDrawerActivity.this, contentDescription.get(tabPosition));

                    if (notificationCount > 0) {
                        MyReceiver.notificationCount = MyReceiver.notificationCount - notificationCount;
                     //   MessageReceivingService.notificationCount.put(contentDescription.get(tabPosition), 0);
                        StringUtils.getInstance().reduceNotificationCount(NavigationDrawerActivity.this, contentDescription.get(tabPosition));
                        Log.v("notification ", "count " + MyReceiver.notificationCount);
                        stringUtils.cancelAllNotification(NavigationDrawerActivity.this);
                    }
                    viewPager.setCurrentItem(tabPosition);
                    if (tab.getCustomView() != null) {
                        ImageView imageView = (ImageView) tab.getCustomView().findViewById(R.id.tab_layout_imageview);
                        imageView.setImageResource(icons.get(tab.getPosition()));
                        RelativeLayout relativeLayout = (RelativeLayout)tab.getCustomView().findViewById(R.id.notify_nav_icons);
                        relativeLayout.setVisibility(View.GONE);
                    }
                    if (actionBar != null) {
                        actionBar.setTitle(titles.get(tab.getPosition()));
                        actionBar.invalidateOptionsMenu();
                    }
                } catch(NullPointerException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {
                try {
                  //  viewPager.setCurrentItem(tab.getPosition());
                    if (tab.getCustomView() != null) {
                        ImageView imageView = (ImageView) tab.getCustomView().findViewById(R.id.tab_layout_imageview);
                        imageView.setImageResource(defaultIcons.get(tab.getPosition()));
                    }
                } catch (NullPointerException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {
                try {
                    int tabPosition = tab.getPosition();
                    Integer notificationCount = StringUtils.getInstance().getNotificationCount(NavigationDrawerActivity.this, contentDescription.get(tabPosition));

                    if (notificationCount > 0) {
                        MyReceiver.notificationCount = MyReceiver.notificationCount - notificationCount;
                     //   MessageReceivingService.notificationCount.put(contentDescription.get(tabPosition), 0);
                        StringUtils.getInstance().reduceNotificationCount(NavigationDrawerActivity.this, contentDescription.get(tabPosition));
                        stringUtils.cancelAllNotification(NavigationDrawerActivity.this);
                    }
                    viewPager.setCurrentItem(tabPosition);
                    if (tab.getCustomView() != null) {
                        ImageView imageView = (ImageView) tab.getCustomView().findViewById(R.id.tab_layout_imageview);
                        imageView.setImageResource(icons.get(tabPosition));
                        RelativeLayout relativeLayout = (RelativeLayout)tab.getCustomView().findViewById(R.id.notify_nav_icons);
                        relativeLayout.setVisibility(View.GONE);
                    }
                    if (actionBar != null) {
                        actionBar.setTitle(titles.get(tabPosition));
                        actionBar.invalidateOptionsMenu();
                    }
                } catch (NullPointerException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if(id == R.id.nav_profile){
            if(parentProfile != null && stringUtils.getUserRole(NavigationDrawerActivity.this).equalsIgnoreCase(PARENT)) {
                Intent intent = new Intent(NavigationDrawerActivity.this, ParentProfileActivity.class);
                intent.putExtra("ParentProfile", parentProfile);
                startActivityForResult(intent, PROFILE_PIC);
            } else if(stringUtils.getUserRole(NavigationDrawerActivity.this).equalsIgnoreCase(EMPLOYEE)){
                Intent intent = new Intent(NavigationDrawerActivity.this, ProfileActivity.class);
                startActivity(intent);
            }

        } else if (id == R.id.nav_aboutus) {
            Intent t = new Intent(this, AboutUsActivity.class);
            startActivity(t);

        } else if (id == R.id.nav_contactus) {
            Intent m = new Intent(this, ContactUsActivity.class);
            startActivity(m);

        } else if (id == R.id.nav_logout) {
            drawer.closeDrawer(GravityCompat.START);
            final DatabaseHelper helper = new DatabaseHelper(this);
            String registrationId = preferences.getString(REGISTRATION_ID,null);

            Cursor allUsers = helper.getAllUser();
            if(allUsers.getCount() > 1) {
                String logoutUrl = BASE_URL + API_VERSION_ONE + AUTHENTICATE + "/" + PARENT;
                try {
                    JSONObject object = new JSONObject();
                    JSONArray usersAry = new JSONArray();
                    while (allUsers.moveToNext()) {
                        String userId = allUsers.getString(allUsers.getColumnIndex(helper.USER_ID));
                        String sessionToken = allUsers.getString(allUsers.getColumnIndex(helper.SESSION_TOKEN));
                        JSONObject userObj = new JSONObject();
                        userObj.put("username", userId);
                        userObj.put("sessionId", sessionToken);
                        usersAry.put(userObj);
                    }
                    object.put("registrationId", registrationId);
                    object.putOpt("users", usersAry);
                    Log.v("Logout ","object "+object);
                    logout(logoutUrl, object);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            } else {
                final String logoutCredential = BASE_URL + API_VERSION_ONE + AUTHENTICATE + "/";
                String userName= preferences.getString(CURRENT_USERNAME,null);
                String userId = preferences.getString(CURRENT_USER_ID,null);
                String endpoint = preferences.getString(ENDPOINT_ARN,null);
                Log.v("End Point","Arn"+endpoint);
                JSONObject object =new JSONObject();
                try {
                    object.put("id",userId);
                    object.put("username",userName);
                    object.put("registrationId",registrationId);
                    object.put("endpointARN",endpoint);
                    Log.v("Logout ","object "+object);
                    logout(logoutCredential, object);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

        } else if(id == R.id.feedback){
            Intent intent = new Intent(this,FeedbackActivity.class);
            startActivity(intent);
        }
        return true;
    }

    private Drawable buildCounterDrawable(int count, int backgroundImageId) {
        LayoutInflater inflater = LayoutInflater.from(this);
        View view = inflater.inflate(R.layout.notification_badge, null);
        //`  view.setBackgroundResource(backgroundImageId);

        if (count == 0) {
            View counterTextPanel = view.findViewById(R.id.counterValuePanel);
            counterTextPanel.setVisibility(View.GONE);
        } else {
            TextView textView = (TextView) view.findViewById(R.id.count);
            textView.setText("" + count);
        }

        view.measure(
                View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED),
                View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
        view.layout(0, 0, view.getMeasuredWidth(), view.getMeasuredHeight());

        view.setDrawingCacheEnabled(true);
        view.setDrawingCacheQuality(View.DRAWING_CACHE_QUALITY_HIGH);
        Bitmap bitmap = Bitmap.createBitmap(view.getDrawingCache());
        view.setDrawingCacheEnabled(false);

        return new BitmapDrawable(getResources(), bitmap);
    }

    @Override
    protected void onPause() {
        super.onPause();
        inBackground = true;
    }

    @Override
    protected void onStop() {
        super.onStop();
        inBackground = true;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        inBackground = true;
    }

    public void showProfilePic(){
        String username = preferences.getString(CURRENT_USERNAME,null);
        String profileUrl = BASE_URL + API_VERSION_ONE + STUDENT +"/"+ username;
        GETUrlConnection profileCredential = new GETUrlConnection(this,profileUrl,null){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Profile "," Response"+response);
                if(response != null) {
                    try {
                        ParentProfileJsonParser jsonParser = new ParentProfileJsonParser();
                        parentProfile = jsonParser.parse(response);
                        String schoolId = preferences.getString(SCHOOL_ID, null);
                        if(!parentProfile.getProfile_picture().equals("null")){
                            String image = AWS_BASE_URL + schoolId + "/" + parentProfile.getProfile_picture();
                            Glide.with(NavigationDrawerActivity.this)
                                    .load(image)
                                    .asBitmap()
                                    .into(profilepic);
                        }
                    } catch (IllegalArgumentException | JSONException  | NullPointerException e){
                        e.printStackTrace();
                        parentProfile = new ParentProfile();
                    } catch (SessionExpiredException e){
                        e.handleException(NavigationDrawerActivity.this);
                    }

                    profilepic.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            String userRole = stringUtils.getUserRole(NavigationDrawerActivity.this);
                            try {
                                if (userRole.equalsIgnoreCase(PARENT)) {
                                    Intent intent = new Intent(NavigationDrawerActivity.this, ParentProfileActivity.class);
                                    intent.putExtra("ParentProfile", parentProfile);
                                    startActivityForResult(intent, PROFILE_PIC);
                                } else {
                                    Intent intent = new Intent(NavigationDrawerActivity.this, ProfileActivity.class);
                                    startActivity(intent);
                                }
                            } catch (NullPointerException e) {
                                e.printStackTrace();
                            }
                        }
                    });
                }
            }
        };
        profileCredential.execute();
    }

    private void logout(String logoutUrl, JSONObject json) {
        DELETEUrlConnection deleteUrlConnection =  new DELETEUrlConnection(NavigationDrawerActivity.this,logoutUrl, json, null){
            ProgressDialog dialog = new ProgressDialog(NavigationDrawerActivity.this,ProgressDialog.STYLE_SPINNER);
            protected void onPreExecute(){
                super.onPreExecute();
                dialog.setMessage(getResources().getText(R.string.logging_out));
                dialog.setCancelable(false);
                dialog.setCanceledOnTouchOutside(false);
                dialog.show();
            }

            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("logout", "response  " + response);
                dialog.dismiss();
                try {
                    new StringUtils().checkSession(response);
                    JSONObject mainObject = new JSONObject(response);
                    if(mainObject.getBoolean(SUCCESS)) {

                        SessionExpiredException.getInstance().clearNotificationCount();
                        preferences.edit().putString(SESSION_TOKEN, null).apply();
                        MessageReceivingService.newFeatureList.clear();
                        Initiater.getInstance().clearListener();
                        DatabaseHelper helper = new DatabaseHelper(NavigationDrawerActivity.this);
                        helper.resetPreferences();
                        helper.resetNotificationCount();
                        helper.resetUser();
                        preferences.edit().clear().apply();
                        StringUtils.getInstance().cancelAllNotification(NavigationDrawerActivity.this);
                        Intent logout = new Intent(NavigationDrawerActivity.this, LoginActivity.class);
                        logout.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(logout);
                    } else {
                        Toast toast = Toast.makeText(NavigationDrawerActivity.this,R.string.logout_filed,Toast.LENGTH_SHORT);
                        toast.setGravity(Gravity.CENTER_VERTICAL,0,130);
                        toast.show();
                    }
                } catch (JSONException |NullPointerException e) {
                    Toast.makeText(NavigationDrawerActivity.this,R.string.unable_to_logout,Toast.LENGTH_SHORT).show();
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    SessionExpiredException.getInstance().clearNotificationCount();
                    MessageReceivingService.newFeatureList.clear();
                    Intent logout = new Intent(NavigationDrawerActivity.this, LoginActivity.class);
                    logout.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(logout);
                }
            }
        };
        deleteUrlConnection.execute();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == PROFILE_PIC && resultCode == RESULT_OK)
            showProfilePic();
    }
}
