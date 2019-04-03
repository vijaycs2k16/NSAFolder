package nexrise.publication.in.nexrise.Notifications;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Notify;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.CustomHashMap.Initiater;
import nexrise.publication.in.nexrise.CustomHashMap.OnUpdateListener;
import nexrise.publication.in.nexrise.JsonParser.NotificationJsonParser;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.PushNotification.MyReceiver;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class NotificationLogActivity extends AppCompatActivity implements Constants{
    ListView listView;
    ArrayList<Notify> allNotifications = new ArrayList<>();
    Boolean clicked = false;
    FloatingActionButton createNotification;
    FloatingActionButton moreOptions;
    FloatingActionButton myNotification;
    LinearLayout moreOptionsLayout;
    LinearLayout createNotificationLayout;
    LinearLayout myNotificationLayout;
    RelativeLayout whiteback;
    RelativeLayout headback;
    StringUtils stringUtils;
    String userRole;
    NotificationArrayAdapter adapter;
    Boolean activityVisible = true;
    Boolean dataRendered = false;
    OnUpdateListener updateListener;
    boolean canFetch = false;
    int start = 0;
    String id;
    int searchPagination = 0;
    List<GETUrlConnection> filterQueries;

    //This method has been overriden to change the font
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.notification_log);
        filterQueries = new ArrayList<>();
        listView = (ListView)findViewById(R.id.notify);
        ActionBar actionBar = getSupportActionBar();
        init();
        activityVisible = true;

        if(actionBar!= null) {
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.notifications);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
        }
        renderData();

        dataRendered = true;
        //If the user is not employee then he will not have permission to create notification so we are simply hiding the FloatingActionButton
        if(!userRole.equalsIgnoreCase(EMPLOYEE)) {
            moreOptionsLayout.setVisibility(View.INVISIBLE);
        }
        moreOptions.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                floatingActionButtonClick();
            }
        });

        final ImageView help = (ImageView)findViewById(R.id.help);
        TextView customTooltipTitle = (TextView)findViewById(R.id.study_value);
        customTooltipTitle.setText(R.string.received_notifications);

        if (userRole.equalsIgnoreCase(EMPLOYEE)) {
            stringUtils.customTooltip(NotificationLogActivity.this,help, (String) getResources().getText(R.string.emp_notify));
        } else if(userRole.equalsIgnoreCase(PARENT)) {
            stringUtils.customTooltip(NotificationLogActivity.this,help,(String) getResources().getText(R.string.parent_notifications));
        } else {
            stringUtils.customTooltip(NotificationLogActivity.this,help,"Stay Alert! Follow ups.");
        }

        updateListener = new OnUpdateListener() {
            @Override
            public void onUpdate(String classId, String sectionId, String schoolId, String userId, String featureId, int count) {
                if(featureId.equals(CREATE_NOTIFICATION) && count != 0) {
                    if(activityVisible) {
                        renderData();
                        MessageReceivingService.notificationCount.put(CREATE_NOTIFICATION, 0);
                    } else
                        dataRendered = false;
                }
            }
        };
        Initiater.getInstance().setOnUpdateListener(updateListener);
    }

    public void init() {
        stringUtils = new StringUtils();
        userRole = stringUtils.getUserRole(this);
        createNotification = (FloatingActionButton)findViewById(R.id.create_notification);
        moreOptions = (FloatingActionButton)findViewById(R.id.fab_more_oprions);
        myNotification = (FloatingActionButton)findViewById(R.id.my_notification);
        moreOptionsLayout = (LinearLayout)findViewById(R.id.more_options);
        createNotificationLayout = (LinearLayout)findViewById(R.id.create_notification_with_text);
        myNotificationLayout = (LinearLayout)findViewById(R.id.my_notification_with_text);
        whiteback = (RelativeLayout)findViewById(R.id.whiteback);
        headback = (RelativeLayout)findViewById(R.id.headingblack);
    }

    @Override
    protected void onPause() {
        super.onPause();
        activityVisible = false;
    }

    @Override
    protected void onResume() {
        super.onResume();
        activityVisible = true;
        if(!dataRendered || MyReceiver.notificationCount > 0) {
            renderData();
            MessageReceivingService.notificationCount.put(CREATE_NOTIFICATION, 0);
            dataRendered = true;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        activityVisible = false;
        Initiater.getInstance().remove(updateListener);
    }

    public void renderData() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);

        id = preferences.getString(CURRENT_USERNAME, null);
        String notificationCredential = BASE_URL + API_VERSION_ONE + NOTIFICATION + LOG + id + "?start="+start+"&length="+LENGTH;
        Log.v("url",""+notificationCredential);
        GETUrlConnection GETUrlConnection = new GETUrlConnection(this, notificationCredential,null) {
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
                    StringUtils.getInstance().checkSession(response);
                    NotificationJsonParser parser = new NotificationJsonParser();
                    allNotifications = parser.getAllNotifications(response);
                    Collections.sort(allNotifications,new UpdatedList());
                    Collections.reverse(allNotifications);
                    adapter = new NotificationArrayAdapter(NotificationLogActivity.this, allNotifications, false);
                    View view = getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                    listView.addFooterView(view);
                    listView.setAdapter(adapter);
                    listviewClick(listView, adapter);
                    canFetch = true;
                    pagination(listView, adapter,allNotifications,"allNotification");
                } catch (JSONException | NullPointerException e) {
                    TextView emptyListview = (TextView)findViewById(R.id.no_content);
                    emptyListview.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(NotificationLogActivity.this);
                }
            }
        };
        GETUrlConnection.execute();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.actionbar, menu);
        final MenuItem menuItem = menu.findItem(R.id.searchbar);
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
                search(newText);
                return true;
            }
        });
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                if(clicked)
                    floatingActionButtonClick();
                else {
                    overridePendingTransition(R.anim.right_to_left_anim, R.anim.exit_animation);
                    finish();
                }
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    public void listviewClick(final ListView listView, final NotificationArrayAdapter arrayAdapter){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Notify notification = (Notify) listView.getItemAtPosition(position);

                if(!clicked) {
                    Intent intent = new Intent(NotificationLogActivity.this, NotificationDetailsActivity.class);
                    Bundle bundle = new Bundle();
                    bundle.putSerializable(NOTIFICATION_OBJECT, notification);
                    intent.putExtra(BUNDLE, bundle);
                    intent.putExtra(FROM_ACTIVITY, "NotificationLogActivity");
                    intent.putExtra(ACTIONBAR_TITLE, "Notification details");
                    startActivity(intent);
                }
            }
        });
    }

    protected boolean removeNotification(ArrayList<Notify> notifyArrayList,String notificationId, String id) {
            for (int i = 0; i < notifyArrayList.size(); i++) {
                if (notifyArrayList.get(i).getNotificationId().equals(notificationId)) {
                    deactivateNotification(notifyArrayList.get(i).getNotificationId(), id);
                    notifyArrayList.remove(i);
                }
            }
        return true;
    }

    protected void deactivateNotification(String notificationId, String id) {
        String url = BASE_URL + API_VERSION_ONE + NOTIFICATION + id + "?notification_id=" + notificationId;
        UPDATEUrlConnection deactivate = new UPDATEUrlConnection(this, url, null, new JSONObject()) {
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    boolean success = jsonObject.getBoolean(SUCCESS);
                    if(success)
                        Toast.makeText(NotificationLogActivity.this, R.string.notification_deleted, Toast.LENGTH_SHORT).show();
                } catch (SessionExpiredException e) {
                    e.handleException(NotificationLogActivity.this);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
        deactivate.execute();
    }

    public void floatingActionButtonClick () {

        if(!clicked) {
            headback.setVisibility(View.VISIBLE);
            whiteback.setVisibility(View.VISIBLE);
            //createNotificationLayout.setVisibility(View.VISIBLE);
            createNotificationFabVisible();
            myNotificationLayout.setVisibility(View.VISIBLE);

            createNotification.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(whiteback.getVisibility() == View.VISIBLE)
                        whiteback.setVisibility(View.INVISIBLE);

                    if(headback.getVisibility() == View.VISIBLE)
                        headback.setVisibility(View.GONE);

                    if(createNotificationLayout.getVisibility() == View.VISIBLE)
                        createNotificationLayout.setVisibility(View.INVISIBLE);

                    if(myNotificationLayout.getVisibility() == View.VISIBLE)
                        myNotificationLayout.setVisibility(View.INVISIBLE);

                    clicked = false;
                    Intent intent = new Intent(NotificationLogActivity.this, CreateNotification.class);
                    Bundle bundle = new Bundle();
                    bundle.putSerializable(NOTIFICATION_OBJECT, null);
                    intent.putExtra("bundle", bundle);
                    startActivity(intent);
                }
            });

            myNotification.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(whiteback.getVisibility() == View.VISIBLE)
                        whiteback.setVisibility(View.INVISIBLE);

                    if(headback.getVisibility() == View.VISIBLE)
                        headback.setVisibility(View.GONE);

                    if(createNotificationLayout.getVisibility() == View.VISIBLE)
                        createNotificationLayout.setVisibility(View.INVISIBLE);

                    if(myNotificationLayout.getVisibility() == View.VISIBLE)
                        myNotificationLayout.setVisibility(View.INVISIBLE);
                    clicked = false;
                    Intent myNotification = new Intent(NotificationLogActivity.this, MyNotificationActivity.class);
                    startActivity(myNotification);
                }
            });
            if(whiteback.getVisibility() == View.VISIBLE)
                clicked = true;
        } else {
            clicked = false;

            whiteback.setVisibility(View.INVISIBLE);
            headback.setVisibility(View.GONE);
            //createNotificationLayout.setVisibility(View.INVISIBLE);
            createNotificationFabInvisible();
            myNotificationLayout.setVisibility(View.INVISIBLE);
        }
    }

    private void createNotificationFabVisible() {
        String permission = stringUtils.getPermission(this, "notification");
        if(permission.contains("manage") || permission.contains("manageAll"))
            createNotificationLayout.setVisibility(View.VISIBLE);
        else
            createNotificationLayout.setVisibility(View.GONE);
    }

    private void createNotificationFabInvisible() {
        String permission = stringUtils.getPermission(this, "notification");
        if(permission.contains("manage") || permission.contains("manageAll"))
            createNotificationLayout.setVisibility(View.INVISIBLE);
    }

    @Override
    public void onBackPressed() {
        if(clicked)
            floatingActionButtonClick();
        else
            finish();
    }
    public void search(String text){
        /*if(adapter != null)
            adapter.getFilter().filter(text);*/
        text = Uri.encode(text);
        Log.v("Search "," "+text);
        int paginationStart = 0;

        final ListView listView = (ListView)findViewById(R.id.notify);
        final TextView emptyListview = (TextView)findViewById(R.id.no_content);
        if(text.isEmpty()) {
            if(allNotifications.size() == 0)
                return;
            emptyListview.setVisibility(View.INVISIBLE);
            listView.setVisibility(View.VISIBLE);
            adapter = new NotificationArrayAdapter(NotificationLogActivity.this, allNotifications, false);
            listView.setAdapter(adapter);
            searchPagination = 0;
            canFetch = true;
            pagination(listView, adapter, allNotifications, "allNotification");
            return;
        }

        for (int i=0; i<filterQueries.size(); i++) {
            filterQueries.get(i).cancel(true);
            filterQueries.remove(i);
        }

        String myNotification = BASE_URL + API_VERSION_ONE + NOTIFICATION + LOG + id +"?start="+paginationStart+"&length="+LENGTH+"&keyword="+text;
        Log.v("urlll","url"+myNotification);
        GETUrlConnection myNotificationUrlConnection = new GETUrlConnection(this, myNotification,null) {
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.notification_loading);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                listView.setVisibility(View.INVISIBLE);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Notification ","activity "+response);
                progressBar.setVisibility(View.GONE);
                listView.setVisibility(View.VISIBLE);
                try {
                    new StringUtils().checkSession(response);
                    NotificationJsonParser parser = new NotificationJsonParser();
                    ArrayList<Notify> filteredNotifications = parser.getAllNotifications(response);
                    Collections.sort(filteredNotifications,new UpdatedList());
                    Collections.reverse(filteredNotifications);
                    NotificationArrayAdapter arrayAdapter = new NotificationArrayAdapter(NotificationLogActivity.this, filteredNotifications, false);
                    View view = getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                    listView.addFooterView(view);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView,arrayAdapter);
                    canFetch = true;
                    pagination(listView, arrayAdapter, filteredNotifications, "search");
                } catch (JSONException | NullPointerException e) {
                    listView.setVisibility(View.INVISIBLE);
                    emptyListview.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(NotificationLogActivity.this);
                }
            }
        };
        myNotificationUrlConnection.execute();
        filterQueries.add(myNotificationUrlConnection);

    }

    public  class UpdatedList implements Comparator<Notify>{


        @Override
        public int compare(Notify notify, Notify t1) {
            Log.v("Updated","date"+notify.getUpdatedDate());
            Date firstDate = new StringUtils().updatedateCompare(notify.getUpdatedDate());
            Date secondDate = new StringUtils().updatedateCompare(t1.getUpdatedDate());
            return firstDate.compareTo(secondDate);
        }
    }

    private void pagination(final ListView listView, final NotificationArrayAdapter adapter, final ArrayList<Notify> myNotifications, final String pagination) {

        listView.setOnScrollListener(new AbsListView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(AbsListView absListView, int i) {

            }

            @Override
            public void onScroll(AbsListView absListView, int i, int i1, int i2) {

                if(listView.getLastVisiblePosition() == listView.getAdapter().getCount()-1 && listView.getChildAt(listView.getChildCount()-1).getBottom() <= listView.getHeight() && canFetch) {
                    String notificationCredential;
                    if(pagination.contains("search")) {
                        searchPagination += LENGTH;
                        notificationCredential = BASE_URL + API_VERSION_ONE + NOTIFICATION + LOG + id + "?start="+searchPagination+"&length="+LENGTH;
                    } else {
                        start += LENGTH;
                        notificationCredential = BASE_URL + API_VERSION_ONE + NOTIFICATION + LOG + id + "?start="+start+"&length="+LENGTH;
                    }

                    Log.v("urlll","url"+myNotification);
                    GETUrlConnection myNotificationUrlConnection = new GETUrlConnection(NotificationLogActivity.this, notificationCredential,null) {
                        ProgressBar progressBar = (ProgressBar)listView.findViewById(R.id.loading_bar);
                        @Override
                        protected void onPreExecute() {
                            super.onPreExecute();
                            progressBar.setVisibility(View.VISIBLE);
                        }

                        @Override
                        protected void onPostExecute(String response) {
                            super.onPostExecute(response);
                            Log.v("Notification ","activity "+response);
                            progressBar.setVisibility(View.GONE);
                            try {
                                new StringUtils().checkSession(response);
                                ArrayList<Notify> notifications = new ArrayList<>();
                                NotificationJsonParser parser = new NotificationJsonParser();
                                notifications = parser.getAllNotifications(response);
                                Collections.sort(notifications,new UpdatedList());
                                Collections.reverse(notifications);
                                myNotifications.addAll(notifications);
                                adapter.notifyDataSetChanged();
                                canFetch = true;
                            } catch (JSONException | NullPointerException e) {
                                String message = e.getMessage();
                                canFetch = !message.contains("Empty json");
                            } catch (SessionExpiredException e) {
                                e.handleException(NotificationLogActivity.this);
                            }
                        }
                    };
                    myNotificationUrlConnection.execute();
                }
            }
        });
    }
}
