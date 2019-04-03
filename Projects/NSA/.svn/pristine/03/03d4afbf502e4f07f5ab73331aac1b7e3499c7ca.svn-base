package nexrise.publication.in.nexrise.HomeworkFeature;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.design.widget.FloatingActionButton;
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
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.TeacherHomeWork;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.HomeworkParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

public class HomeworkActivity extends AppCompatActivity implements Constants {
    ListView listView;
    ArrayList<TeacherHomeWork> homeworkList;
    private int ADD_HOMEWORK = 11;
    HomeWorkFragmentArrayAdapter arrayAdapter;
    public static Boolean teacherHomeWorkRendered = false;
    StringUtils stringUtils;
    RelativeLayout progressbarLayout;
    ProgressBar progress;
    TextView noContent;
    int start = 0;
    boolean canFetch = false;
    int searchPagination = 0;
    String queryText = "";
    List<GETUrlConnection> filterQueries;
    MenuItem menuItem;
    android.widget.SearchView searchView;

    @Override
    protected void onCreate(final Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_homework);
        progressbarLayout = (RelativeLayout)findViewById(R.id.container);
        progress = (ProgressBar) findViewById(R.id.loading);
        noContent = (TextView) findViewById(R.id.no_content);
        stringUtils = new StringUtils();
        filterQueries = new ArrayList<>();
        listView = (ListView) findViewById(R.id.fragment_class_listview);
        LinearLayout classSectionSpinner = (LinearLayout)findViewById(R.id.class_layout);
        classSectionSpinner.setVisibility(View.GONE);
        renderData();

        android.support.v7.app.ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setTitle(R.string.homework);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
        }
        floatingActionButtonClick();
        final ImageView help = (ImageView) findViewById(R.id.help);
        stringUtils.customTooltip(HomeworkActivity.this, help, (String) getResources().getText(R.string.emp_homework));
        teacherHomeWorkRendered = true;
    }

    public void floatingActionButtonClick() {
        FloatingActionButton floatingActionButton = (FloatingActionButton) findViewById(R.id.floating_action_button);
        String permission = stringUtils.getPermission(HomeworkActivity.this, "create_assignments");
        if (permission.contains("manage") || permission.contains("manageAll")) {
            floatingActionButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(HomeworkActivity.this, AddHomeWorkActivity.class);
                    intent.putExtra("FromActivity", "Floating");
                    HomeworkActivity.this.startActivityForResult(intent, ADD_HOMEWORK);
                }
            });
        } else {
            floatingActionButton.setVisibility(View.GONE);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if(searchView != null && menuItem != null) {
            queryText = "";
            searchView.setQuery("", false);
            searchView.clearFocus();
            menuItem.collapseActionView();
        }

        if (!teacherHomeWorkRendered) {
            if(queryText.isEmpty())
               renderData();
            else
                search(queryText);
            teacherHomeWorkRendered = true;
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.actionbar, menu);
        menuItem = menu.findItem(R.id.searchbar);
        searchView = (android.widget.SearchView) menuItem.getActionView();

        SearchManager searchManager = (SearchManager) getSystemService(Context.SEARCH_SERVICE);
        if (searchManager != null) {
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
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    public void listviewClick(final ListView listView) {

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                int pos = listView.getPositionForView(view);
                TeacherHomeWork selectedData = (TeacherHomeWork) listView.getItemAtPosition(position);

                if (selectedData.getStatus().equalsIgnoreCase("Published")) {
                    Intent intent = new Intent(HomeworkActivity.this, DetailsPageActivity.class);
                    intent.putExtra("FromActivity", "MainActivity");
                    intent.putExtra("Index", pos);
                    Log.v("selected", "data" + selectedData);
                    intent.putExtra("ListData", selectedData);
                    startActivity(intent);
                } else {
                    if (selectedData.isEditPermissions()) {
                        Intent intent = new Intent(HomeworkActivity.this, AddHomeWorkActivity.class);
                        intent.putExtra("FromActivity", "MainActivity");
                        intent.putExtra("ListData", selectedData);
                        startActivity(intent);
                    } else {
                        Toast.makeText(HomeworkActivity.this, "You don't have permission to edit this", Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });
    }

    public void search(String text) {
        text = Uri.encode(text);
        Log.v("Search "," "+text);
        int paginationStart = 0;

        final TextView emptyListview = (TextView)findViewById(R.id.no_content);
        final RelativeLayout progressbarLayout = (RelativeLayout)findViewById(R.id.container);

        if(text.isEmpty()) {
            if(homeworkList.size() == 0)
                return;
            emptyListview.setVisibility(View.INVISIBLE);
            progressbarLayout.setVisibility(View.GONE);
            listView.setVisibility(View.VISIBLE);
            arrayAdapter = new HomeWorkFragmentArrayAdapter(HomeworkActivity.this, homeworkList);
            listView.setAdapter(arrayAdapter);
            searchPagination = 0;
            canFetch = true;
            pagination(listView, homeworkList, arrayAdapter, "AllHomeworks");
            return;
        }

        for (int i=0; i<filterQueries.size(); i++) {
            filterQueries.get(i).cancel(true);
            filterQueries.remove(i);
        }

        final String assignmentCredential = BASE_URL + API_VERSION_ONE + ASSIGNMENT + "?start=" + paginationStart + "&length=" + LENGTH + "&keyword="+text;
        GETUrlConnection fetchHomeworks = new GETUrlConnection(HomeworkActivity.this, assignmentCredential, null) {

            ProgressBar progress = (ProgressBar) findViewById(R.id.loading);
            TextView noContent = (TextView) findViewById(R.id.no_content);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressbarLayout.setVisibility(View.VISIBLE);
                progress.setVisibility(View.VISIBLE);
                if (noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String assignmentresponse) {
                super.onPostExecute(assignmentresponse);
                progress.setVisibility(View.GONE);
                progressbarLayout.setVisibility(View.GONE);
                JSONObject jsonObject = null;
                Log.v("Assignment ","response "+assignmentresponse);
                try {
                    stringUtils.checkSession(assignmentresponse);
                    HomeworkParser homeworkParser = new HomeworkParser();
                    ArrayList<TeacherHomeWork> filteredHomeworks = homeworkParser.weekDataParser(assignmentresponse, null);
                    if(filteredHomeworks.size() == 0)
                        throw new JSONException("Empty JSON");

                    listView = (ListView) findViewById(R.id.fragment_class_listview);
                    HomeWorkFragmentArrayAdapter adapter = new HomeWorkFragmentArrayAdapter(HomeworkActivity.this, filteredHomeworks);
                    View view = getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                    listView.addFooterView(view);
                    listView.setAdapter(adapter);
                    listviewClick(listView);
                    canFetch = true;
                    pagination(listView, filteredHomeworks, adapter, "Search");
                } catch (NullPointerException | JSONException  e) {
                    e.printStackTrace();
                    if(progressbarLayout.getVisibility() == View.GONE)
                        progressbarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(HomeworkActivity.this);
                }
            }
        };
        fetchHomeworks.execute();
        filterQueries.add(fetchHomeworks);
    }

    public void renderData() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(HomeworkActivity.this);
        String username = preferences.getString(CURRENT_USERNAME, null);
        final String assignmentCredential = BASE_URL + API_VERSION_ONE + ASSIGNMENT + "?start="+start+"&length="+LENGTH;

        GETUrlConnection GETUrlConnection = new GETUrlConnection(HomeworkActivity.this, assignmentCredential, null) {
            RelativeLayout progressbarLayout = (RelativeLayout)findViewById(R.id.container);
            ProgressBar progress = (ProgressBar) findViewById(R.id.loading);
            TextView noContent = (TextView) findViewById(R.id.no_content);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressbarLayout.setVisibility(View.VISIBLE);
                progress.setVisibility(View.VISIBLE);
                if (noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String assignmentresponse) {
                super.onPostExecute(assignmentresponse);
                progress.setVisibility(View.GONE);
                progressbarLayout.setVisibility(View.GONE);
                JSONObject jsonObject = null;
                try {
                    stringUtils.checkSession(assignmentresponse);
                    HomeworkParser homeworkParser = new HomeworkParser();
                    homeworkList = homeworkParser.weekDataParser(assignmentresponse, null);
                    if(homeworkList.size() == 0)
                        throw new JSONException("Empty JSON");

                    listView = (ListView) findViewById(R.id.fragment_class_listview);
                    arrayAdapter = new HomeWorkFragmentArrayAdapter(HomeworkActivity.this, homeworkList);
                    View view = getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                    listView.addFooterView(view);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView);
                    canFetch = true;
                    pagination(listView, homeworkList, arrayAdapter, "AllHomeworks");
                } catch (NullPointerException | JSONException  e) {
                    e.printStackTrace();
                    if(progressbarLayout.getVisibility() == View.GONE)
                        progressbarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                    canFetch = false;
                } catch (SessionExpiredException e) {
                    e.handleException(HomeworkActivity.this);
                }
            }
        };
        GETUrlConnection.execute();
    }

    private void pagination(final ListView listView, final ArrayList<TeacherHomeWork> teacherHomeworkList, final HomeWorkFragmentArrayAdapter adapter, final String type) {
        listView.setOnScrollListener(new AbsListView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(AbsListView absListView, int i) {

            }

            @Override
            public void onScroll(AbsListView absListView, int i, int i1, int i2) {
                if(listView.getLastVisiblePosition() == listView.getAdapter().getCount()-1 && listView.getChildAt(listView.getChildCount()-1).getBottom() <= listView.getHeight() && canFetch) {
                    if(teacherHomeworkList.size() < LENGTH)
                        return;

                    String homeworkUrl = "";
                    if(type.equalsIgnoreCase("AllHomeworks")) {
                        start += LENGTH;
                        homeworkUrl = BASE_URL + API_VERSION_ONE + ASSIGNMENT + "?start=" + start + "&length=" + LENGTH;
                    } else {
                        searchPagination += LENGTH;
                        homeworkUrl = BASE_URL + API_VERSION_ONE + ASSIGNMENT + "?start=" + searchPagination + "&length=" + LENGTH;
                    }

                    GETUrlConnection homeworkUrlConnection = new GETUrlConnection(HomeworkActivity.this, homeworkUrl,null) {
                        ProgressBar progressBar = (ProgressBar)listView.findViewById(R.id.loading_bar);
                        @Override
                        protected void onPreExecute() {
                            super.onPreExecute();
                            progressBar.setVisibility(View.VISIBLE);
                            canFetch = false;
                        }

                        @Override
                        protected void onPostExecute(String response) {
                            super.onPostExecute(response);
                            Log.v("Notification ","activity "+response);
                            progressBar.setVisibility(View.GONE);
                            try {
                                stringUtils.checkSession(response);
                                HomeworkParser homeworkParser = new HomeworkParser();
                                ArrayList<TeacherHomeWork> homeWorks = homeworkParser.weekDataParser(response, null);
                                if(homeWorks.size() == 0)
                                    throw new JSONException("Empty Json");
                                teacherHomeworkList.addAll(homeWorks);
                                adapter.notifyDataSetChanged();
                                canFetch = true;
                            } catch (JSONException | NullPointerException e) {
                                e.printStackTrace();
                                canFetch = false;
                            } catch (SessionExpiredException e) {
                                e.handleException(HomeworkActivity.this);
                            }
                        }
                    };
                    homeworkUrlConnection.execute();
                }
            }
        });
    }
}
