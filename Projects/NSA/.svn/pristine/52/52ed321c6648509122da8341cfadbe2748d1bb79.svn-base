package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TableLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.BeanClass.WeekTeacherObject;
import nexrise.publication.in.nexrise.BeanClass.WeeklyTimeTable;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.TaxanomyJsonParser;
import nexrise.publication.in.nexrise.JsonParser.WeekTeacherJsonParser;
import nexrise.publication.in.nexrise.JsonParser.WeeklyTimeTableParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;


public class ClassWeekActivity extends AppCompatActivity implements Constants{
    String  sectionId;
    String classId;
    ArrayList<Classes> section;
    private ArrayList<WeeklyTimeTable> weektimeTableList;
    ListView listView;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent intent = getIntent();
        String className = intent.getStringExtra("className");
        String sectionName = intent.getStringExtra("sectionName");
        String forTimetable = intent.getStringExtra("For");

        if (forTimetable.equals("classTimetable")) {
            setContentView(R.layout.fragment_weekly_time_table);
            setupSpinner();
        } else {
            setContentView(R.layout.teachers_timetable);
            setupTeacherListSpinner();
        }
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        TextView textView = (TextView) findViewById(R.id.week_heading);
        textView.setText("Academic Year"+"("+preferences.getString(CURRENT_ACADEMIC_YEAR,ACADEMIC_YEAR)+")");

        listView = (ListView) findViewById(R.id.tableListView);

        View rootView = listView.getRootView();
        rootView.setBackgroundColor(Color.parseColor("#dfdfdf"));

        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setElevation(0);
            if(forTimetable.equals("classTimetable")) {
                actionBar.setTitle(R.string.class_timetable);
            } else {
                actionBar.setTitle(R.string.employee_timetable);
            }
        }
    }

    private void setupSpinner() {
        LinearLayout spinners = (LinearLayout)findViewById(R.id.classtimtable);
        if(spinners.getVisibility() == View.INVISIBLE || spinners.getVisibility() == View.GONE) {
            spinners.setVisibility(View.VISIBLE);
        }
        if (StringUtils.taxanomy == null){
            String url = BASE_URL + API_VERSION_ONE + TAXANOMY ;

            GETUrlConnection getClassSection = new GETUrlConnection(ClassWeekActivity.this, url,null) {
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject responseJson = new JSONObject(response);
                        JSONArray classesArray = responseJson.getJSONArray(DATA);

                        StringUtils.taxanomy = classesArray;
                        TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                        StringUtils.classList = classListJsonparser.getClassDetails(classesArray);

                        renderClassSection(StringUtils.classList);
                    } catch (JSONException | NullPointerException e) {
                        Toast.makeText(ClassWeekActivity.this, R.string.oops, Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(ClassWeekActivity.this);
                    }
                }
            };
            getClassSection.execute();
        } else {
            renderClassSection(StringUtils.classList);
        }
    }

    private void renderClassSection(final List<Classes> classList) {
        final Spinner classSpinner = (Spinner) findViewById(R.id.classSpinner);

        final List<Classes> classesWithNone = new StringUtils().insertNoneIntoClassSectionSpinner(classList);
        AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(ClassWeekActivity.this, classesWithNone);
        classSpinner.setAdapter(adapter);

        classSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                classId = classesWithNone.get(position).getId();
                final Classes selectedClass = classesWithNone.get(position);
                section = selectedClass.getSections();

                AddSectionFragmentAdapter adapter = new AddSectionFragmentAdapter(ClassWeekActivity.this, section);

                final Spinner sectionSpinner = (Spinner) findViewById(R.id.sectionSpinner);
                sectionSpinner.setAdapter(adapter);

                sectionSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, final View view, int position, long id) {
                        sectionId = section.get(position).getId();
                        String classId = selectedClass.getId();
                        Calendar calendar = Calendar.getInstance();
                        String weekId = String.valueOf(calendar.get(Calendar.WEEK_OF_YEAR));
                        if(sectionId != null) {
                            String url = BASE_URL + API_VERSION_ONE + TIMETABLE + CLASS + classId + SECTION + sectionId + "?weekNo=" + weekId;
                            renderListview(url,CLASS);
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

    public void renderListview(String url,final String user) {
        final RelativeLayout progressBarLayout = (RelativeLayout)findViewById(R.id.progress_bar);
        final ProgressBar progressBar = (ProgressBar)progressBarLayout.findViewById(R.id.loading_bar);
        final TextView noContent = (TextView)progressBarLayout.findViewById(R.id.no_content);
        GETUrlConnection weekTimetable = new GETUrlConnection(ClassWeekActivity.this ,url,null){

            @Override
            protected void onPreExecute(){
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("weekly","response"+response);
                progressBar.setVisibility(View.INVISIBLE);

                try {
                    new StringUtils().checkSession(response);
                    progressBarLayout.setVisibility(View.GONE);
                    TableLayout timeTableLayout = (TableLayout)findViewById(R.id.week_timetable_layout);
                    if(timeTableLayout.getVisibility() == View.INVISIBLE || timeTableLayout.getVisibility() == View.GONE)
                        timeTableLayout.setVisibility(View.VISIBLE);
                    if(user.equals(EMPLOYEE)) {
                        WeekTeacherJsonParser weekTeacherJsonParser = new WeekTeacherJsonParser();
                        ArrayList<WeekTeacherObject> weektimeTableList = weekTeacherJsonParser.getWeektimeTableList(response);
                        WeeklyTeacherTimeArrayAdapter adapter = new WeeklyTeacherTimeArrayAdapter(ClassWeekActivity.this, weektimeTableList);
                        listView.setAdapter(adapter);
                    } else {
                        WeeklyTimeTableParser weeklyTimeTableParser = new WeeklyTimeTableParser();
                        weektimeTableList = weeklyTimeTableParser.getWeektimeTableList(response, ClassWeekActivity.this);
                        WeeklyTimeTableArrayAdapter adapter = new WeeklyTimeTableArrayAdapter(ClassWeekActivity.this, weektimeTableList);
                        listView.setAdapter(adapter);
                    }

                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                    if (progressBarLayout.getVisibility()==View.GONE || progressBarLayout.getVisibility()==View.INVISIBLE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(ClassWeekActivity.this);
                }
            }
        };
        weekTimetable.execute();
    }


    public void setupTeacherListSpinner() {

        final RelativeLayout progressBarLayout = (RelativeLayout)findViewById(R.id.teacher_list_loading);
        final ProgressBar progressBar = (ProgressBar)findViewById(R.id.loading_bar);
        final TextView noContent = (TextView)findViewById(R.id.no_content);

        String url = BASE_URL +API_VERSION_ONE + USER + EMPLOYEES + DETAILS;
        GETUrlConnection getAllTeachers = new GETUrlConnection(this, url,null) {
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("employee Details","spinner" +response);
                progressBar.setVisibility(View.INVISIBLE);
                try {
                    new StringUtils().checkSession(response);
                    progressBarLayout.setVisibility(View.GONE);
                    HashMap<String,String> teachers = jsonparser(response);
                    List<Map.Entry<String, String>> teachersEntry = new ArrayList<Map.Entry<String, String>>(teachers.entrySet());
                    Spinner teachersSpinner = (Spinner)findViewById(R.id.teachers_list);
                    Collections.sort(teachersEntry,new NameComparator());
                    HashMap<String,String> none = jsonparser(response);
                    none.put(null,"None");
                    List<Map.Entry<String,String>> entries =new ArrayList<Map.Entry<String, String>>(none.entrySet());
                    teachersEntry.add(0,entries.get(0));
                    TeacherSpinnerAdapter spinnerAdapter = new TeacherSpinnerAdapter(ClassWeekActivity.this, teachersEntry);
                    teachersSpinner.setAdapter(spinnerAdapter);
                    teachersSpinner.setSelection(0);
                    teacherSpinnerClickListener(teachersSpinner, spinnerAdapter);
                } catch ( NullPointerException e) {
                    e.printStackTrace();
                    if (progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() == View.INVISIBLE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(ClassWeekActivity.this);
                }
            }
        };
        getAllTeachers.execute();
    }

    protected  HashMap<String,String> jsonparser(String response){
        HashMap<String,String> teachers = new HashMap<String, String>();

        try {
            JSONObject mainObject = new JSONObject(response);
            JSONArray data = mainObject.getJSONArray(DATA);
            for(int i=0; i<data.length();i++) {
                JSONObject teacher = data.getJSONObject(i);
                String employeeUserName = teacher.getString("user_name");
                String employeeName = teacher.getString("first_name");
                teachers.put(employeeUserName, employeeName);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return teachers;
    }

    public void teacherSpinnerClickListener(final Spinner teacherList, final TeacherSpinnerAdapter spinnerAdapter) {

        teacherList.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {

                Map.Entry<String, String> entrySet = (Map.Entry<String, String>) spinnerAdapter.getItem(position);
                String employeeUserId = entrySet.getKey();
                Calendar calendar = Calendar.getInstance();
                String weekId = String.valueOf(calendar.get(Calendar.WEEK_OF_YEAR));
                employeeUserId = Uri.encode(employeeUserId);
                if(employeeUserId != null) {
                    String url = BASE_URL + API_VERSION_ONE + TIMETABLE + EMP + employeeUserId + "?weekNo=" + weekId;
                    renderListview(url,EMPLOYEE);
                }
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
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
   public class NameComparator implements Comparator<Map.Entry<String, String>> {
        public int compare(Map.Entry<String, String> teacher1, Map.Entry<String, String> teacher2) {
            return teacher1.getValue().trim().compareTo(teacher2.getValue().trim());
        }
    }

}
