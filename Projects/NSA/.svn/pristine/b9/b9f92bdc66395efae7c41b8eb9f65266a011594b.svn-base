package nexrise.publication.in.nexrise.ParentFeatures.HomeworkFeature;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.SearchView;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ParentHomeWork;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.CustomHashMap.Initiater;
import nexrise.publication.in.nexrise.CustomHashMap.OnUpdateListener;
import nexrise.publication.in.nexrise.JsonParser.ParentHomeworkParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

public class ParentHomeworkActivity extends AppCompatActivity implements Constants {
    ParentHomeWorkArrayAdapter arrayAdapter;
    ArrayList<ParentHomeWork> homeworkList;
    StringUtils stringUtils;
    OnUpdateListener updateListener;
    Boolean activityVisible = true;
    Boolean homeworkRendered = false;
    boolean canFetch = false;
    int start = 0;
    int searchPagination = 0;
    List<GETUrlConnection> filterQueries;
    String username;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_parent_homework);
        activityVisible = true;
        final ImageView help = (ImageView) findViewById(R.id.help);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(ParentHomeworkActivity.this);
        username = preferences.getString(CURRENT_USERNAME,null);
        filterQueries = new ArrayList<>();
        android.support.v7.app.ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null) {
            actionBar.setTitle(R.string.homework);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
        }

        stringUtils = new StringUtils();
        String userRole = stringUtils.getUserRole(ParentHomeworkActivity.this);

        if (userRole.equalsIgnoreCase(PARENT)) {
            stringUtils.customTooltip(ParentHomeworkActivity.this,help, (String) getResources().getText(R.string.parent_homework));
        } else {
            stringUtils.customTooltip(ParentHomeworkActivity.this,help,"Homework due for you! Enjoy your evening! ");
        }
        renderData();
        homeworkRendered = true;
        updateListener = new OnUpdateListener() {
            @Override
            public void onUpdate(String classId, String sectionId, String schoolId, String userId, String featureId, int count) {
                if(featureId.equals(CREATE_ASSIGNMENT) && count != 0) {
                    if(activityVisible)
                        renderData();
                    else
                        homeworkRendered = false;
                }
            }
        };
        Initiater.getInstance().setOnUpdateListener(updateListener);
    }

    public void renderData() {
        final ListView listView = (ListView) findViewById(R.id.fragment_class_listview);
        String assignmentCredential = BASE_URL + API_VERSION_ONE + ASSIGNMENT + USER + DETAILS + username+"?start="+start+"&length="+ LENGTH;
        Log.v("assignment","credential"+assignmentCredential);
        GETUrlConnection GETUrlConnection = new GETUrlConnection(ParentHomeworkActivity.this, assignmentCredential,null) {
            ProgressBar progressBar = (ProgressBar) findViewById(R.id.notification_loading);
            TextView noContent = (TextView) findViewById(R.id.no_content);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("assignment", "assignmentresponse" + response);
                progressBar.setVisibility(View.GONE);
                JSONObject jsonObject = null;
                if (response != null) {
                    try {
                        stringUtils.checkSession(response);
                        ParentHomeworkParser parentHomeworkParser = new ParentHomeworkParser();
                        homeworkList = parentHomeworkParser.weekDataParser(response, null);
                        Collections.sort(homeworkList,new UpdatedList());
                        Collections.reverse(homeworkList);
                        if (homeworkList.size()==0)
                            throw new JSONException("Empty Data");

                        arrayAdapter = new ParentHomeWorkArrayAdapter(ParentHomeworkActivity.this, homeworkList);
                        View view = getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                        listView.addFooterView(view);
                        listView.setAdapter(arrayAdapter);
                        listviewClick(listView);
                        canFetch = true;
                        pagination(listView, arrayAdapter, homeworkList, "allHomework");
                        listviewClick(listView);

                    } catch (JSONException | NullPointerException e) {
                        noContent.setVisibility(View.VISIBLE);
                        canFetch = false;
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(ParentHomeworkActivity.this);
                    }
                } else {
                    noContent.setVisibility(View.VISIBLE);
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
        Utility.searchViewHandler(searchView,menuItem);
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
        switch (item.getItemId()){
            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    public void listviewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent;
                int pos =  listView.getPositionForView(view);
                ParentHomeWork selectedData = (ParentHomeWork) listView.getItemAtPosition(position);
                Log.v("Position "," "+pos);
                intent = new Intent(ParentHomeworkActivity.this, ParentDetailsActivity.class);
                intent.putExtra("FromActivity","MainActivity");
                intent.putExtra("Index",pos);
                intent.putExtra("ListData",selectedData);
                startActivityForResult(intent, 5);
            }
        });
    }

    private void pagination(final ListView listView, final ParentHomeWorkArrayAdapter adapter, final ArrayList<ParentHomeWork> parentHomeWorks, final String pagination) {

        listView.setOnScrollListener(new AbsListView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(AbsListView absListView, int i) {
            }

            @Override
            public void onScroll(AbsListView absListView, int firstVisibleItem, int visibleItemCount, int totalItemCount) {

                if(listView.getLastVisiblePosition() == listView.getAdapter().getCount()-1 && listView.getChildAt(listView.getChildCount()-1).getBottom() <= listView.getHeight() && canFetch) {
                    String parentHomework = "";
                    if (parentHomeWorks.size() < LENGTH)
                        return;
                    if(pagination.contains("search")) {
                        searchPagination += LENGTH;
                        parentHomework = BASE_URL + API_VERSION_ONE + ASSIGNMENT + USER + DETAILS + username+"?start="+searchPagination+"&length="+LENGTH;
                    } else {
                        start += LENGTH;
                        parentHomework = BASE_URL + API_VERSION_ONE + ASSIGNMENT + USER + DETAILS + username+"?start="+start+"&length="+LENGTH;
                    }

                    Log.v("searchPagination"," "+searchPagination);
                    Log.v("searchPagination ", "start "+start);
                    GETUrlConnection myNotificationUrlConnection = new GETUrlConnection(ParentHomeworkActivity.this, parentHomework,null) {
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
                            progressBar.setVisibility(View.GONE);
                            try {
                                new StringUtils().checkSession(response);
                                ArrayList<ParentHomeWork> parentHomeWorkArrayList = new ArrayList<>();
                                ParentHomeworkParser parentHomeworkParser = new ParentHomeworkParser();
                                parentHomeWorkArrayList = parentHomeworkParser.weekDataParser(response,null);
                                Collections.sort(parentHomeWorkArrayList,new UpdatedList());
                                Collections.reverse(parentHomeWorkArrayList);
                                if(parentHomeWorkArrayList.size() == 0)
                                    throw new JSONException("Empty json");
                                parentHomeWorks.addAll(parentHomeWorkArrayList);
                                adapter.notifyDataSetChanged();
                                canFetch = true;
                            } catch (JSONException | NullPointerException e) {
                                String message = e.getMessage();
                                if(message.contains("Empty json")) {
                                    canFetch = false;
                                    if(pagination.contains("search")&& searchPagination != 0)
                                        searchPagination -= LENGTH;
                                    else if(pagination.contains("allHomework") && start != 0)
                                        start -= LENGTH;
                                }
                            } catch (SessionExpiredException e) {
                                e.handleException(ParentHomeworkActivity.this);
                            }
                        }
                    };
                    myNotificationUrlConnection.execute();
                }
            }
        });
    }

    @Override
    public void onPause() {
        super.onPause();
        activityVisible = false;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        activityVisible = false;
        Initiater.getInstance().remove(updateListener);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if(!homeworkRendered)
            renderData();
        homeworkRendered = true;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == 5 && resultCode == RESULT_OK) {
            for (int i=0; i<homeworkList.size(); i++) {
                String id = data.getStringExtra("Assignment ID");
                if(homeworkList.get(i).getId().equals(id)) {
                    homeworkList.get(i).setIsSubmitted("Submitted");
                    arrayAdapter.notifyDataSetChanged();
                }
            }
        }
    }
    public void search(String text){
        /*if(adapter != null)
            adapter.getFilter().filter(text);*/
        text = Uri.encode(text);
        Log.v("Search "," "+text);
        int paginationStart = 0;

        final ListView listView = (ListView)findViewById(R.id.fragment_class_listview);
        final TextView emptyListview = (TextView)findViewById(R.id.no_content);
        if(text.isEmpty()) {
            if(homeworkList.size() == 0)
                return;
            emptyListview.setVisibility(View.INVISIBLE);
            listView.setVisibility(View.VISIBLE);
            arrayAdapter = new ParentHomeWorkArrayAdapter(ParentHomeworkActivity.this, homeworkList);
            listView.setAdapter(arrayAdapter);
            searchPagination = 0;
            canFetch = true;
            pagination(listView, arrayAdapter, homeworkList, "allHomework");
            return;
        }

        for (int i=0; i<filterQueries.size(); i++) {
            filterQueries.get(i).cancel(true);
            filterQueries.remove(i);
        }

        String parentHomeWork = BASE_URL + API_VERSION_ONE + ASSIGNMENT + USER + DETAILS + username+"?start="+paginationStart+"&length="+LENGTH+"&keyword="+text;
        Log.v("urlll","url"+parentHomeWork);
        GETUrlConnection ParentHomeWorkUrlConnection = new GETUrlConnection(this, parentHomeWork,null) {
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
                    ParentHomeworkParser parentHomeworkParser = new ParentHomeworkParser();
                    ArrayList<ParentHomeWork> filteredParentHomeWork = parentHomeworkParser.weekDataParser(response,null);
                    Collections.sort(filteredParentHomeWork,new UpdatedList());
                    Collections.reverse(filteredParentHomeWork);
                    ParentHomeWorkArrayAdapter arrayAdapter = new ParentHomeWorkArrayAdapter(ParentHomeworkActivity.this, filteredParentHomeWork);
                    View view = getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                    listView.addFooterView(view);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView);
                    canFetch = true;
                    pagination(listView, arrayAdapter, filteredParentHomeWork, "search");
                } catch (JSONException | NullPointerException e) {
                    listView.setVisibility(View.INVISIBLE);
                    emptyListview.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(ParentHomeworkActivity.this);
                }
            }
        };
        ParentHomeWorkUrlConnection.execute();
        filterQueries.add(ParentHomeWorkUrlConnection);

    }

    public  class UpdatedList implements Comparator<ParentHomeWork> {

        @Override
        public int compare(ParentHomeWork parentHomeWork, ParentHomeWork parentHomeWork1) {
            Date firstDate = new StringUtils().updatedateCompare(parentHomeWork.getDueDate());
            Date secondDate = new StringUtils().updatedateCompare(parentHomeWork1.getDueDate());
            return firstDate.compareTo(secondDate);
        }
    }
}
