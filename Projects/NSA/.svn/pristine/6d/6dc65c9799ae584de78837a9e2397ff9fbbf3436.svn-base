
package nexrise.publication.in.nexrise.Notifications;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
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
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Devicetoken;
import nexrise.publication.in.nexrise.BeanClass.Language;
import nexrise.publication.in.nexrise.BeanClass.LoginObject;
import nexrise.publication.in.nexrise.BeanClass.Notify;
import nexrise.publication.in.nexrise.BeanClass.Student;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class MyNotificationActivity extends AppCompatActivity implements Constants{
    ListView listView;
    LoginObject userObject;
    NotificationArrayAdapter adapter;
    NotificationLogActivity notificationLogActivity;
    ArrayList<Notify> allNotifications;
    boolean canFetch = false;
    int start = 0;
    int searchPagination = 0;
    List<GETUrlConnection> filterQueries;
    private String queryText = "";
    private boolean canRefresh = false;
    MenuItem menuItem;
    android.widget.SearchView searchView;

    //This method has been overriden to change the font
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.notification_log);
        overridePendingTransition(R.anim.right_to_left_anim, R.anim.exit_animation);
        filterQueries = new ArrayList<>();
        allNotifications = new ArrayList<>();
        notificationLogActivity = new NotificationLogActivity();

        ActionBar actionBar = getSupportActionBar();
        renderListview();

        ImageView help = (ImageView)findViewById(R.id.help);
        TextView customTooltipTitle = (TextView)findViewById(R.id.study_value);
        customTooltipTitle.setText(R.string.created_notify);
        new StringUtils().customTooltip(this, help, (String) getResources().getText(R.string.emp_notify_sent));
        if(actionBar!= null) {
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.all_notifications);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
        }

        LinearLayout moreOptions = (LinearLayout)findViewById(R.id.more_options);
        moreOptions.setVisibility(View.INVISIBLE);
    }

    void renderListview() {
        final ListView listView = (ListView)findViewById(R.id.notify);

        String myNotification = BASE_URL + API_VERSION_ONE + SMS + NOTIFICATIONS+"?start="+start+"&length="+LENGTH;
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
                listView.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.GONE);
                try {
                    new StringUtils().checkSession(response);
                    allNotifications = parseNotifications(response);
                    Collections.sort(allNotifications,new UpdatedList());
                    Collections.reverse(allNotifications);
                    adapter = new NotificationArrayAdapter(MyNotificationActivity.this, allNotifications, true);
                    View view = getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                    listView.addFooterView(view);
                    listView.setAdapter(adapter);
                    listviewClick(listView);
                    canFetch = true;
                    pagination(listView, adapter, allNotifications, "allNotification");
                } catch (JSONException | NullPointerException e) {
                    listView.setVisibility(View.INVISIBLE);
                    TextView emptyListview = (TextView)findViewById(R.id.no_content);
                    emptyListview.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(MyNotificationActivity.this);
                }
            }
        };
        myNotificationUrlConnection.execute();
    }

    public ArrayList<Notify> parseNotifications (String  jsonString) throws JSONException {

        ArrayList<Notify> notificationList = new ArrayList<Notify>();

        JSONObject notificationObject = new JSONObject(jsonString);
        JSONArray jsonArray = notificationObject.getJSONArray(DATA);

        if(jsonArray.length() != 0 ) {
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject finalobj = jsonArray.getJSONObject(i);

                String notificationId = finalobj.getString("notification_id");
                String username = finalobj.getString("sender_id");
                String academic_year = finalobj.getString("academic_year");
                String updatedDate = finalobj.getString("updated_date");
                String pushTemplateMessage = " ";
                if(finalobj.has("feature_id")) {
                    String featureId = finalobj.getString("feature_id");
                    if(featureId.equals(VOICE_MMS_ID))
                        continue;
                }
                if (finalobj.has("push_template_message"))
                    pushTemplateMessage = finalobj.getString("push_template_message");
                String pushTemplateTitle = " ";
                if (finalobj.has("push_template_title"))
                    pushTemplateTitle = finalobj.getString("push_template_title");
                String updatedUsername = finalobj.getString("updated_username");
                String title = finalobj.getString("title");
                String priority = finalobj.getString("priority");
                String status = finalobj.getString("status");
                String phoneNo = String.valueOf(finalobj.get("notified_mobile_numbers"));
                String finalPhoneNo = getArrayStringToString(phoneNo);
                String templateId = finalobj.getString("template_id");
                String createdDate = finalobj.getString("updated_date");
                String notified_categories = finalobj.getString("notified_categories");
                boolean editPermission = finalobj.getBoolean("editPermissions");

                ArrayList<Student> studentArrayList = parseStudents(finalobj);

                Log.v("Student ","ArraLIST siZe"+studentArrayList.size());
                Notify notify = new Notify(notificationId, "", username, academic_year, updatedDate, pushTemplateMessage, status, username, pushTemplateTitle, title, priority,createdDate, finalPhoneNo, templateId,  updatedUsername, notified_categories);
                notify.setEditPermission(editPermission);
                notify.setStudents(studentArrayList);

                Log.v("ATTACHMENTS ","ARy "+finalobj.getJSONArray("attachments"));
                if(finalobj.has("attachments")) {
                    JSONArray attachmentsAry = finalobj.getJSONArray("attachments");
                    HashMap<String, String> files = new HashMap<>();

                    for (int j=0; j<attachmentsAry.length(); j++) {
                        JSONObject attachmentObj = attachmentsAry.getJSONObject(j);
                        files.put(attachmentObj.getString("id"), attachmentObj.getString("name"));
                        notify.setAttachments(files);
                    }
                }
                notificationList.add(notify);
            }
        } else {
            throw new JSONException("Empty json");
        }
        return notificationList;
    }

    public ArrayList<Student> parseStudents(JSONObject finalobj) throws NullPointerException, JSONException {
        ArrayList<Student> studentArrayList = new ArrayList<>();

        if (finalobj.has("notified_students")) {
            String notified_students = finalobj.getString("notified_students");
            if (!notified_students.equals("null")) {
                JSONArray array = new JSONArray(notified_students);
                if (array.length() != 0) {
                    Log.v("array ","list "+array);
                    for (int j = 0; j < array.length(); j++) {
                        JSONObject jsonObject = array.getJSONObject(j);
                        Log.v("JSONOBJECT", "student" + jsonObject);
                        String id = jsonObject.getString("id");
                        String userName = jsonObject.getString("userName");
                        String tenantId = jsonObject.getString("tenantId");
                        String userType = " ";
                        if (jsonObject.has("userType"))
                            userType = jsonObject.getString("userType");
                        String userCode = " ";
                        if (jsonObject.has("userCode"))
                            userCode = jsonObject.getString("userCode");
                        String firstName = jsonObject.getString("firstName");
                        String primaryPhone = jsonObject.getString("primaryPhone");

                        JSONArray classArray = jsonObject.getJSONArray("classes");

                        JSONArray languageArray = null;
                        if (jsonObject.has("languages"))
                            languageArray = jsonObject.getJSONArray("languages");
                        ArrayList<Language> languages = new ArrayList<>();
                        if (languageArray!=null) {
                            for (int l = 0; l < languageArray.length(); l++) {
                                Language language = new Language();
                                JSONObject languageObject = languageArray.getJSONObject(l);
                                String languageId = languageObject.getString("language_id");
                                String languageName = languageObject.getString("language_name");
                                String languageType = languageObject.getString("language_type");
                                language.setLanguage_id(languageId);
                                language.setLanguage_name(languageName);
                                language.setLanguage_type(languageType);
                                languages.add(language);
                            }
                        }
                        String admissionNo = " ";
                        if (jsonObject.has("admissionNo"))
                            admissionNo = jsonObject.getString("admissionNo");

                        ArrayList<Devicetoken> devicetokens = new ArrayList<>();
                        if (jsonObject.has("deviceToken")) {
                            JSONArray deviceArray = jsonObject.getJSONArray("deviceToken");
                            for (int m = 0; m < deviceArray.length(); m++) {
                                Devicetoken devicetoken = new Devicetoken();
                                JSONObject deviceObject = deviceArray.getJSONObject(m);
                                String registrationId = deviceObject.getString("registration_id");
                                String endPointArn = deviceObject.getString("endpoint_arn");
                                devicetoken.setRegistration_id(registrationId);
                                devicetoken.setEndpoint_arn(endPointArn);
                                devicetokens.add(devicetoken);
                            }
                        }
                        boolean active = true;
                        if (jsonObject.has("active"))
                            active = jsonObject.getBoolean("active");

                        Student student = new Student();
                        student.setId(id);
                        student.setUsername(userName);
                        student.setTenantId(tenantId);
                        student.setUserType(userType);
                        student.setUserCode(userCode);
                        student.setFirstname(firstName);
                        student.setPrimaryPhone(primaryPhone);
                        student.setAdmissionNo(admissionNo);
                        student.setActive(active);
                        student.setDevicetokens(devicetokens);
                        student.setLanguages(languages);
                        if (classArray != null && classArray.length() != 0) {
                            JSONObject classObject = classArray.getJSONObject(0);
                            String classId = classObject.getString("class_id");
                            String className = classObject.getString("class_name");
                            String sectionName = classObject.getString("section_name");
                            String sectionId = classObject.getString("section_id");
                            student.setSectionId(sectionId);
                            student.setClassId(classId);
                            student.setClassName(className);
                            student.setSection(sectionName);
                            student.setChecked(true);
                        }
                        studentArrayList.add(student);
                    }
                }
            }
        }
        return studentArrayList;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.actionbar, menu);
        menuItem = menu.findItem(R.id.searchbar);
        searchView = (android.widget.SearchView) menuItem.getActionView();

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
                queryText = newText;
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
                finish();
                overridePendingTransition(R.anim.left_to_right_anim, R.anim.left_to_right_exit);
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    public void listviewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Notify notification = (Notify) listView.getItemAtPosition(position);
                String status = notification.getStatus();
                Log.v("status", ""+status);
                if(!status.equals(DRAFT)) {
                    Intent intent = new Intent(MyNotificationActivity.this, NotificationDetailsActivity.class);
                    Bundle bundle = new Bundle();
                    bundle.putSerializable(NOTIFICATION_OBJECT, notification);
                    intent.putExtra(BUNDLE,bundle);
                    intent.putExtra(FROM_ACTIVITY,"MyNotificationActivity");
                    intent.putExtra(ACTIONBAR_TITLE, "My Notification");
                    startActivity(intent);
                } else {
                    if(notification.isEditPermission()) {
                        Intent intent = new Intent(MyNotificationActivity.this, CreateNotification.class);
                        Bundle bundle = new Bundle();
                        bundle.putSerializable(NOTIFICATION_OBJECT, notification);
                        intent.putExtra(BUNDLE, bundle);
                        intent.putExtra(FROM_ACTIVITY, "MyNotificationActivity");
                        intent.putExtra(ACTIONBAR_TITLE, "My Notification");
                        intent.putExtra("status", true);
                        startActivityForResult(intent, 1);
                    } else
                        Toast.makeText(MyNotificationActivity.this, "You don't have permission to edit this", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void pagination(final ListView listView, final NotificationArrayAdapter adapter, final ArrayList<Notify> myNotifications, final String pagination) {

        listView.setOnScrollListener(new AbsListView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(AbsListView absListView, int i) {
            }

            @Override
            public void onScroll(AbsListView absListView, int firstVisibleItem, int visibleItemCount, int totalItemCount) {

                if(listView.getLastVisiblePosition() == listView.getAdapter().getCount()-1 && listView.getChildAt(listView.getChildCount()-1).getBottom() <= listView.getHeight() && canFetch) {
                    String myNotification = "";
                    if (myNotifications.size() < LENGTH)
                        return;
                    if(pagination.contains("search")) {
                        searchPagination += LENGTH;
                        myNotification = BASE_URL + API_VERSION_ONE + SMS + NOTIFICATIONS+"?start="+searchPagination+"&length="+LENGTH;
                    } else {
                        start += LENGTH;
                        myNotification = BASE_URL + API_VERSION_ONE + SMS + NOTIFICATIONS+"?start="+start+"&length="+LENGTH;
                    }

                    Log.v("searchPagination"," "+searchPagination);
                    Log.v("searchPagination ", "start "+start);
                    GETUrlConnection myNotificationUrlConnection = new GETUrlConnection(MyNotificationActivity.this, myNotification,null) {
                        ProgressBar progressBar = (ProgressBar)listView.findViewById(R.id.loading_bar);
                        @Override
                        protected void onPreExecute() {
                            super.onPreExecute();
                            canFetch = false;
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
                                notifications = parseNotifications(response);
                                Collections.sort(notifications,new UpdatedList());
                                Collections.reverse(notifications);
                                myNotifications.addAll(notifications);
                                adapter.notifyDataSetChanged();
                                canFetch = true;
                            } catch (JSONException | NullPointerException e) {
                                String message = e.getMessage();
                                if(message.contains("Empty json")) {
                                    canFetch = false;
                                    if(pagination.contains("search")&& searchPagination != 0)
                                        searchPagination -= LENGTH;
                                    else if(pagination.contains("allNotification") && start != 0)
                                        start -= LENGTH;
                                }
                            } catch (SessionExpiredException e) {
                                e.handleException(MyNotificationActivity.this);
                            }
                        }
                    };
                    myNotificationUrlConnection.execute();
                }
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == 1 && resultCode == RESULT_OK) {
            if(searchView != null && menuItem != null) {
                queryText = "";
                searchView.setQuery("", false);
                searchView.clearFocus();
                menuItem.collapseActionView();
            }

            if(!queryText.isEmpty()) {
                canRefresh = true;
                search(queryText);
            } else
                renderListview();
        } else if(requestCode == 1 && resultCode == RESULT_CANCELED && data != null && data.hasExtra("Attachments")) {
            adapter.notifyDataSetChanged();
            Notify notificationObj = (Notify) data.getSerializableExtra("Attachments");
            if(allNotifications == null) return;

            for (int i=0; i<allNotifications.size(); i++) {
                if(allNotifications.get(i).getNotificationId().equals(notificationObj.getNotificationId()) )
                    allNotifications.get(i).setAttachments(notificationObj.getAttachments());
            }
            adapter.notifyDataSetChanged();
        }
    }

    public String getArrayStringToString(String array) {
        String firstReplace = array.replace('[', ' ');
        String secondReplace = firstReplace.replace(']', ' ');
        return  secondReplace.replaceAll("\"", " ");
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
            if(canRefresh) {
                renderListview();
                return;
            }
            if(allNotifications.size() == 0)
                return;
            emptyListview.setVisibility(View.INVISIBLE);
            listView.setVisibility(View.VISIBLE);
            adapter = new NotificationArrayAdapter(MyNotificationActivity.this, allNotifications, true);
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

        String myNotification = BASE_URL + API_VERSION_ONE + SMS + NOTIFICATIONS+"?start="+paginationStart+"&length="+LENGTH+"&keyword="+text;
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
                    ArrayList<Notify> filteredNotifications = parseNotifications(response);
                    Collections.sort(filteredNotifications,new UpdatedList());
                    Collections.reverse(filteredNotifications);
                    NotificationArrayAdapter arrayAdapter = new NotificationArrayAdapter(MyNotificationActivity.this, filteredNotifications, true);
                    View view = getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                    listView.addFooterView(view);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView);
                    canFetch = true;
                    pagination(listView, arrayAdapter, filteredNotifications, "search");
                } catch (JSONException | NullPointerException e) {
                    listView.setVisibility(View.INVISIBLE);
                    emptyListview.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(MyNotificationActivity.this);
                }
            }
        };
        myNotificationUrlConnection.execute();
        filterQueries.add(myNotificationUrlConnection);

    }

    public  class UpdatedList implements Comparator<Notify> {

        @Override
        public int compare(Notify notify, Notify notify1) {
            Log.v("Updated","date"+notify.getUpdatedDate());
            Date firstDate = new StringUtils().updatedateCompare(notify.getUpdatedDate());
            Date secondDate = new StringUtils().updatedateCompare(notify1.getUpdatedDate());
            return firstDate.compareTo(secondDate);
        }
    }
}
