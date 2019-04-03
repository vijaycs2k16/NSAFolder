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
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.SearchView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.BeanClass.TeacherHomeWork;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.HomeworkParser;
import nexrise.publication.in.nexrise.JsonParser.TaxanomyJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.AddClassFragmentAdapter;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;


public class AdminHomeworkActivity extends AppCompatActivity implements Constants {
    ListView listView;
    private int ADD_HOMEWORK = 11;
    public static Boolean teacherHomeWorkRendered = false;
    StringUtils stringUtils;
    RelativeLayout progressbarLayout;
    ProgressBar progress;
    TextView noContent;
    Spinner spinner;
    Spinner spinner1;
    String  sectionId;
    String classid;
    ArrayList<Classes> section;
    boolean canFetch = false;
    int start = 0;
    int searchPagination = 0;
    List<GETUrlConnection> filterQueries;
    List<POSTUrlConnection> filterQueriesPost;
    private String queryText = "";
    private boolean canRefresh = false;
    ArrayList<TeacherHomeWork> allHomeworkList;
    ArrayList<TeacherHomeWork> homeworkList;
    android.widget.SearchView searchView;
    MenuItem menuItem;

    @Override
    protected void onCreate(final Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_homework);
        progressbarLayout = (RelativeLayout)findViewById(R.id.container);
        progress = (ProgressBar) findViewById(R.id.loading);
        noContent = (TextView) findViewById(R.id.no_content);
        stringUtils = new StringUtils();
        spinner = (Spinner) findViewById(R.id.classspin);
        spinner1 = (Spinner) findViewById(R.id.section_spin);
        filterQueries = new ArrayList<>();
        filterQueriesPost = new ArrayList<>();
        listView = (ListView) findViewById(R.id.fragment_class_listview);
        renderSpinner();

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
        stringUtils.customTooltip(AdminHomeworkActivity.this, help, (String) getResources().getText(R.string.emp_homework));
        //renderData();
        teacherHomeWorkRendered = true;
    }

    private void renderSpinner() {
        if(StringUtils.classList == null) {
            String Class = BASE_URL + API_VERSION_ONE + TAXANOMY;
            GETUrlConnection url = new GETUrlConnection(this, Class, null) {
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject responseJson = new JSONObject(response);
                        JSONArray classesArray = responseJson.getJSONArray(DATA);
                        TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                        StringUtils.classList = classListJsonparser.getClassDetails(classesArray);
                        setUpClassSpinner(StringUtils.classList);
                    } catch (JSONException | NullPointerException e) {
                        e.printStackTrace();
                        Toast.makeText(AdminHomeworkActivity.this, R.string.oops, Toast.LENGTH_SHORT).show();
                    } catch (SessionExpiredException e) {
                        e.handleException(AdminHomeworkActivity.this);
                    }
                }
            };
            url.execute();
        } else
            setUpClassSpinner(StringUtils.classList);
    }

    private void setUpClassSpinner(ArrayList<Classes> classList) {
        spinner = (Spinner) findViewById(R.id.classspin);
        final List<Classes> classesWithNone = new StringUtils().insertNoneIntoClassSectionSpinner(classList);
        AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(AdminHomeworkActivity.this, classesWithNone);
        spinner.setAdapter(adapter);
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                classid = classesWithNone.get(position).getId();
                Classes selectedClass = classesWithNone.get(position);
                section = selectedClass.getSections();
                AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(AdminHomeworkActivity.this, section);
                spinner1.setAdapter(adapter);
                spinner1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                        sectionId = section.get(position).getId();
                        if (sectionId != null) {
                            start = 0;
                            classSectionBasedHomeworks(classid, sectionId);
                        } else {
                            renderData();
                            //  displayNothingToShow();
                        }
                    }
                    @Override
                    public void onNothingSelected(AdapterView<?> parent) {
                    }
                });
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
    }

    private void classSectionBasedHomeworks(String classid, String sectionId) {
        final String url = BASE_URL + API_VERSION_ONE + ASSIGNMENT + DETAILS + "?start="+start+"&length="+LENGTH;
        POSTUrlConnection postUrlConnection = new POSTUrlConnection(dateObject(classid,sectionId),url,null,AdminHomeworkActivity.this){

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressbarLayout.setVisibility(View.VISIBLE);
                progress.setVisibility(View.VISIBLE);
                if (noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                progress.setVisibility(View.GONE);
                progressbarLayout.setVisibility(View.GONE);
                Log.v("post "," section "+response);
                try {
                    stringUtils.checkSession(response);
                    HomeworkParser homeworkParser = new HomeworkParser();
                    homeworkList = homeworkParser.weekDataParser(response, null);
                    Collections.sort(homeworkList,new UpdatedList());
                    Collections.reverse(homeworkList);
                    if(homeworkList.size() == 0)
                        throw new JSONException("Empty JSON");

                    HomeWorkFragmentArrayAdapter arrayAdapter = new HomeWorkFragmentArrayAdapter(AdminHomeworkActivity.this,homeworkList);
                    View view = getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                    listView.addFooterView(view);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView);
                    canFetch = true;
                    paginationWithFilter(listView, homeworkList, arrayAdapter, "AllHomeworks");
                } catch (NullPointerException | JSONException  e) {
                    displayNothingToShow();
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(AdminHomeworkActivity.this);
                }
            }
        };
        postUrlConnection.execute();
    }

    private void displayNothingToShow() {
        if(progressbarLayout.getVisibility() == View.GONE)
            progressbarLayout.setVisibility(View.VISIBLE);
        noContent.setVisibility(View.VISIBLE);
    }

    public void floatingActionButtonClick() {
        FloatingActionButton floatingActionButton = (FloatingActionButton) findViewById(R.id.floating_action_button);
        String permission = stringUtils.getPermission(AdminHomeworkActivity.this, "create_assignments");
        if (permission.contains("manage") || permission.contains("manageAll")) {
            floatingActionButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(AdminHomeworkActivity.this, AddHomeWorkActivity.class);
                    intent.putExtra("FromActivity", "Floating");
                    AdminHomeworkActivity.this.startActivityForResult(intent, ADD_HOMEWORK);
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
            if(queryText.isEmpty()) {
                if (spinner != null &&  spinner1 != null) {
                    spinner.setSelection(0);
                    renderData();
                } else
                    renderSpinner();
            } else {
                if (spinner != null &&  spinner1 != null) {
                    spinner.setSelection(0);
                    renderData();
                } else
                    renderSpinner();
                invalidateOptionsMenu();
            }
            teacherHomeWorkRendered = true;
        }
    }
    public JSONObject dateObject(String classid,String sectionId){
        JSONObject object = new JSONObject();
        try {
            object.put("classId",classid);
            object.put("sectionId",sectionId);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return object;
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

    public void renderData() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(AdminHomeworkActivity.this);
        String username = preferences.getString(CURRENT_USERNAME, null);
        final String assignmentCredential = BASE_URL + API_VERSION_ONE + ASSIGNMENT + "?start=" + start + "&length=" + LENGTH;

        GETUrlConnection GETUrlConnection = new GETUrlConnection(AdminHomeworkActivity.this, assignmentCredential, null) {
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
                try {
                    stringUtils.checkSession(assignmentresponse);
                    HomeworkParser homeworkParser = new HomeworkParser();
                    allHomeworkList = homeworkParser.weekDataParser(assignmentresponse, null);
                    if(allHomeworkList.size() == 0)
                        throw new JSONException("Empty JSON");

                    listView = (ListView) findViewById(R.id.fragment_class_listview);
                    HomeWorkFragmentArrayAdapter arrayAdapter = new HomeWorkFragmentArrayAdapter(AdminHomeworkActivity.this, allHomeworkList);
                    View view = getLayoutInflater().inflate(R.layout.progress_bar, listView, false);
                    listView.addFooterView(view);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView);
                    canFetch = true;
                    paginationWithoutFilter(listView, allHomeworkList, arrayAdapter, "AllHomeworks");
                } catch (NullPointerException | JSONException  e) {
                    e.printStackTrace();
                    canFetch = false;
                    if(progressbarLayout.getVisibility() == View.GONE)
                        progressbarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(AdminHomeworkActivity.this);
                }
            }
        };
        GETUrlConnection.execute();
    }

    // When the user selects the class and section in the spinner. This pagination will be triggered
    private void paginationWithFilter(final ListView listView, final ArrayList<TeacherHomeWork> teacherHomeworkList, final HomeWorkFragmentArrayAdapter adapter, final String type) {
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
                        homeworkUrl = BASE_URL + API_VERSION_ONE + ASSIGNMENT + DETAILS + "?start=" + start + "&length=" + LENGTH;
                    } else { // This block will be executed for the type ahead search
                        searchPagination += LENGTH;
                        homeworkUrl = BASE_URL + API_VERSION_ONE + ASSIGNMENT + DETAILS + "?start=" + searchPagination + "&length=" + LENGTH;
                    }

                    POSTUrlConnection homeworkUrlConnection = new POSTUrlConnection(dateObject(classid,sectionId),homeworkUrl,null,AdminHomeworkActivity.this) {
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
                                Collections.sort(homeWorks,new UpdatedList());
                                Collections.reverse(homeWorks);
                                teacherHomeworkList.addAll(homeWorks);
                                adapter.notifyDataSetChanged();
                                canFetch = true;
                            } catch (JSONException | NullPointerException e) {
                                e.printStackTrace();
                              /*  String message = e.getMessage();
                                if(message.contains("Empty json"))*/
                                canFetch = false;
                            } catch (SessionExpiredException e) {
                                e.handleException(AdminHomeworkActivity.this);
                            }
                        }
                    };
                    homeworkUrlConnection.execute();
                }
            }
        });
    }

    //This pagination triggeres when the user didn't select any class and section i.e class and section spinner will be none in the UI
    private void paginationWithoutFilter(final ListView listView, final ArrayList<TeacherHomeWork> teacherHomeworkList, final HomeWorkFragmentArrayAdapter adapter, final String type) {
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

                    GETUrlConnection homeworkUrlConnection = new GETUrlConnection(AdminHomeworkActivity.this, homeworkUrl,null) {
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
                                Collections.sort(homeWorks,new UpdatedList());
                                Collections.reverse(homeWorks);
                                teacherHomeworkList.addAll(homeWorks);
                                adapter.notifyDataSetChanged();
                                canFetch = true;
                            } catch (JSONException | NullPointerException e) {
                                e.printStackTrace();
                              /*  String message = e.getMessage();
                                if(message.contains("Empty json"))*/
                                canFetch = false;
                            } catch (SessionExpiredException e) {
                                e.handleException(AdminHomeworkActivity.this);
                            }
                        }
                    };
                    homeworkUrlConnection.execute();
                }
            }
        });
    }

    public void listviewClick(final ListView listView) {

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                int pos = listView.getPositionForView(view);
                TeacherHomeWork selectedData = (TeacherHomeWork) listView.getItemAtPosition(position);

                if (selectedData.getStatus().equalsIgnoreCase("Published")) {
                    Intent intent = new Intent(AdminHomeworkActivity.this, DetailsPageActivity.class);
                    intent.putExtra("FromActivity", "MainActivity");
                    intent.putExtra("Index", pos);
                    Log.v("selected", "data" + selectedData);
                    intent.putExtra("ListData", selectedData);
                    startActivity(intent);
                } else {
                    if (selectedData.isEditPermissions()) {
                        Intent intent = new Intent(AdminHomeworkActivity.this, AddHomeWorkActivity.class);
                        intent.putExtra("FromActivity", "MainActivity");
                        intent.putExtra("ListData", selectedData);
                        startActivity(intent);
                    } else {
                        Toast.makeText(AdminHomeworkActivity.this, R.string.no_permission_edit, Toast.LENGTH_SHORT).show();
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

        if(text.isEmpty() && (classid == null || sectionId == null)) {
            if(allHomeworkList.size() == 0)
                return;
            emptyListview.setVisibility(View.INVISIBLE);
            progressbarLayout.setVisibility(View.GONE);
            listView.setVisibility(View.VISIBLE);
            HomeWorkFragmentArrayAdapter arrayAdapter = new HomeWorkFragmentArrayAdapter(AdminHomeworkActivity.this, allHomeworkList);
            listView.setAdapter(arrayAdapter);
            searchPagination = 0;
            canFetch = true;
            paginationWithoutFilter(listView, allHomeworkList, arrayAdapter, "AllHomeworks");
            return;
        } else if (text.isEmpty() && classid != null && sectionId != null) {
            if(homeworkList.size() == 0)
                return;
            emptyListview.setVisibility(View.INVISIBLE);
            progressbarLayout.setVisibility(View.GONE);
            listView.setVisibility(View.VISIBLE);
            HomeWorkFragmentArrayAdapter arrayAdapter = new HomeWorkFragmentArrayAdapter(AdminHomeworkActivity.this, homeworkList);
            listView.setAdapter(arrayAdapter);
            searchPagination = 0;
            canFetch = true;
            paginationWithFilter(listView, homeworkList, arrayAdapter, "AllHomeworks");
            return;
        }

        if(classid == null && sectionId == null) {
            // This will cancel all the previous requests and execute the last request
            for (int i=0; i<filterQueries.size(); i++) {
                filterQueries.get(i).cancel(true);
                filterQueries.remove(i);
            }
            final String assignmentCredential = BASE_URL + API_VERSION_ONE + ASSIGNMENT + "?start=" + paginationStart + "&length=" + LENGTH + "&keyword=" +text;

            GETUrlConnection getAllHomeworks = new GETUrlConnection(AdminHomeworkActivity.this, assignmentCredential, null) {
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
                    try {
                        stringUtils.checkSession(assignmentresponse);
                        HomeworkParser homeworkParser = new HomeworkParser();
                        ArrayList<TeacherHomeWork> filteredHomeworkList = homeworkParser.weekDataParser(assignmentresponse, null);
                        if(filteredHomeworkList.size() == 0)
                            throw new JSONException("Empty JSON");

                        listView = (ListView) findViewById(R.id.fragment_class_listview);
                        HomeWorkFragmentArrayAdapter arrayAdapter = new HomeWorkFragmentArrayAdapter(AdminHomeworkActivity.this, filteredHomeworkList);
                        listView.setAdapter(arrayAdapter);
                        listviewClick(listView);
                        canFetch = true;
                        paginationWithoutFilter(listView, filteredHomeworkList, arrayAdapter, "Search");
                    } catch (NullPointerException | JSONException  e) {
                        if(progressbarLayout.getVisibility() == View.GONE)
                            progressbarLayout.setVisibility(View.VISIBLE);
                        noContent.setVisibility(View.VISIBLE);
                    } catch (SessionExpiredException e) {
                        e.handleException(AdminHomeworkActivity.this);
                    }
                }
            };
            getAllHomeworks.execute();
            filterQueries.add(getAllHomeworks);
        } else {
            // This will cancel all the previous requests and execute the last request
            for (int i=0; i<filterQueriesPost.size(); i++) {
                filterQueriesPost.get(i).cancel(true);
                filterQueriesPost.remove(i);
            }
            String homeworkUrl = BASE_URL + API_VERSION_ONE + ASSIGNMENT  + DETAILS + "?start=" + paginationStart + "&length=" + LENGTH + "&keyword=" +text;
            POSTUrlConnection homeworkUrlConnection = new POSTUrlConnection(dateObject(classid,sectionId),homeworkUrl,null,AdminHomeworkActivity.this) {
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
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    Log.v("Notification ","activity "+response);
                    progress.setVisibility(View.GONE);
                    progressbarLayout.setVisibility(View.GONE);
                    try {
                        stringUtils.checkSession(response);
                        HomeworkParser homeworkParser = new HomeworkParser();
                        ArrayList<TeacherHomeWork> filteredHomeworkList = homeworkParser.weekDataParser(response, null);
                        if(filteredHomeworkList.size() == 0)
                            throw new JSONException("Empty Json");
                        Collections.sort(filteredHomeworkList,new UpdatedList());
                        Collections.reverse(filteredHomeworkList);
                        HomeWorkFragmentArrayAdapter arrayAdapter = new HomeWorkFragmentArrayAdapter(AdminHomeworkActivity.this, filteredHomeworkList);
                        listView.setAdapter(arrayAdapter);
                        listviewClick(listView);
                        canFetch = true;
                        paginationWithFilter(listView, filteredHomeworkList, arrayAdapter, "Search");
                    } catch (JSONException | NullPointerException e) {
                        if(progressbarLayout.getVisibility() == View.GONE)
                            progressbarLayout.setVisibility(View.VISIBLE);
                        noContent.setVisibility(View.VISIBLE);
                    } catch (SessionExpiredException e) {
                        e.handleException(AdminHomeworkActivity.this);
                    }
                }
            };
            homeworkUrlConnection.execute();
            filterQueriesPost.add(homeworkUrlConnection);
        }
    }

    private class UpdatedList implements Comparator<TeacherHomeWork> {

        @Override
        public int compare(TeacherHomeWork teacherHomeWork, TeacherHomeWork t1) {
            Date firstDate = new StringUtils().updatedateCompare(teacherHomeWork.getUpdatedDate());
            Date secondDate = new StringUtils().updatedateCompare(t1.getUpdatedDate());
            return firstDate.compareTo(secondDate);
        }
    }
}
