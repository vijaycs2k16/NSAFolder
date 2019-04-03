package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.content.res.ResourcesCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.Toast;

import com.roomorama.caldroid.CaldroidFragment;
import com.roomorama.caldroid.CaldroidListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.TaxanomyJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class ViewNotesCalendarActivity extends AppCompatActivity implements Constants {
    CaldroidFragment caldroidFragment;
    ArrayList<Classes> section;
    String  sectionId;
    String classid;
    Date fromdate;
    Drawable attachmentIcon;
    Spinner spinner;
    Spinner spinner1;
    boolean render = true;

    @Override
    protected void onCreate(final Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_notes_calendar);
        spinner = (Spinner) findViewById(R.id.classspin);
        spinner1 = (Spinner) findViewById(R.id.section_spin);

        if (ViewNotesCalendarActivity.this.getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT){
            attachmentIcon = ResourcesCompat.getDrawable(getResources(), R.drawable.caldroid_attachment,null);
        } else if(ViewNotesCalendarActivity.this.getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE) {
            /*caldroidFragment.clearSelectedDates();
            Calendar c = Calendar.getInstance();
            int year = c.get(Calendar.YEAR);
            int month = c.get(Calendar.MONTH);
            calendarDate(month, year);*/
            attachmentIcon = getResources().getDrawable(R.color.eventColor);
        }

        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setTitle(R.string.class_notes);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
        }

        LinearLayout spinnerLayout = (LinearLayout) findViewById(R.id.class_layout);
        String fromActivity = getIntent().getStringExtra(FROM);
        if (fromActivity.equals("ParentTimetable")){
            spinnerLayout.setVisibility(View.GONE);
            classid = getIntent().getStringExtra("classId");
            sectionId = getIntent().getStringExtra("sectionId");
            Calendar c = Calendar.getInstance();
            int year = c.get(Calendar.YEAR);
            int month = c.get(Calendar.MONTH);
            calendarDate(month,year);
        }else {
            String Class = BASE_URL + API_VERSION_ONE + TAXANOMY ;
            GETUrlConnection url = new GETUrlConnection(this, Class,null) {
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject responseJson = new JSONObject(response);
                        JSONArray classesArray = responseJson.getJSONArray(DATA);
                        Log.v("ClassDetails", "" + response);
                        TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                        StringUtils.classList = classListJsonparser.getClassDetails(classesArray);
                        setUpClassSpinner(StringUtils.classList);
                        if (savedInstanceState != null) {
                            Log.v("selected","class"+savedInstanceState.getInt("classSpinner"));
                            spinner.setSelection(savedInstanceState.getInt("classSpinner", 0));
                            spinner1.setSelection(savedInstanceState.getInt("sectionspinner", 0));
                            // do this for each of your text views
                        }
                    } catch (JSONException | NullPointerException e) {
                        e.printStackTrace();
                        Toast.makeText(ViewNotesCalendarActivity.this, R.string.oops, Toast.LENGTH_SHORT).show();
                    } catch (SessionExpiredException e) {
                        e.handleException(ViewNotesCalendarActivity.this);
                    }
                }
            };
            url.execute();
        }
        setCaldroidFragment();

        final CaldroidListener listener = new CaldroidListener() {
            @Override
            public void onSelectDate(Date date, View view) {
                // Do something
            }

            @Override
            public void onCaldroidViewCreated() {
                // Supply your own adapter to weekdayGridView (SUN, MON, etc)
                caldroidFragment.setEnableSwipe(false);
                Button leftButton = caldroidFragment.getLeftArrowButton();
                Button rightButton = caldroidFragment.getRightArrowButton();
                leftButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        render = false;
                        clearBackground();
                        Log.v("Clicked","Left Arrow");
                        caldroidFragment.prevMonth();
                        calendarDate(caldroidFragment.getMonth()-1,caldroidFragment.getYear());
                    }

                });
                rightButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        render = false;
                        clearBackground();
                        Log.v("Clicked","Right Arrow");
                        caldroidFragment.nextMonth();
                        calendarDate(caldroidFragment.getMonth()-1,caldroidFragment.getYear());
                    }
                });
                // Do customization here
            }
        };
        caldroidFragment.setCaldroidListener(listener);
    }

    private void setUpClassSpinner(final List<Classes> classList) {
        spinner = (Spinner) findViewById(R.id.classspin);
        final List<Classes> classesWithNone = new StringUtils().insertNoneIntoClassSectionSpinner(classList);
        AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(ViewNotesCalendarActivity.this, classesWithNone);
        spinner.setAdapter(adapter);
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                clearBackground();
                classid = classesWithNone.get(position).getId();
                Log.v("class_id","current "+classid);
                Classes selectedClass = classesWithNone.get(position);
                section = selectedClass.getSections();
                Log.v("class9",""+selectedClass.getSections());
                AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(ViewNotesCalendarActivity.this, section);

                spinner1.setAdapter(adapter);
                spinner1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                        sectionId = section.get(position).getId();
                        if (sectionId != null) {
                            Calendar c = Calendar.getInstance();
                            int year = c.get(Calendar.YEAR);
                            int month = c.get(Calendar.MONTH);
                            calendarDate(month, year);
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

    public void calendarDate(int month,int year){
        String  url = BASE_URL + API_VERSION_ONE + TIMETABLE + NOTES + MONTH;
        POSTUrlConnection urlConnection = new POSTUrlConnection(dateObject(month,year),url, null, ViewNotesCalendarActivity.this){
            @Override
            protected void onPostExecute(String s) {
                super.onPostExecute(s);
                Log.v("responsedate",""+s);
                try {
                    new StringUtils().checkSession(s);
                    ArrayList<String> date = dateList(s);
                    eventDate(date);
                } catch (NullPointerException e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e){
                    e.handleException(ViewNotesCalendarActivity.this);
                }
            }
        };
        urlConnection.execute();
    }

    public void eventDate(ArrayList<String> event){
        //Drawable absent = getResources().getDrawable(R.color.eventColor);
        if(event.size() !=0) {
            notesPlot(event);
        } else {
            if(!render){
                notesPlot(event);
            } else {
                setCaldroidFragment();
            }
        }
    }

    public  void notesPlot(ArrayList<String> event){
        caldroidFragment.refreshView();
        HashMap<Date, Drawable> map = new HashMap<Date, Drawable>();
       
        for (int i = 0; i < event.size(); i++) {
            try {
                fromdate = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH).parse(event.get(i));
                Log.v("Fromdate", "dsa" + fromdate.toString());
                map.put(fromdate, attachmentIcon);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        caldroidFragment.setBackgroundDrawableForDates(map);
        caldroidFragment.refreshView();
        dateClick();
    }
    public ArrayList<String> dateList(String s){
        ArrayList<String> dates = new ArrayList<>();
        try {
            JSONObject jsonObject = new JSONObject(s);
            JSONArray jsonArray = jsonObject.getJSONArray(DATA);
            if(jsonArray.length() != 0) {
                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject dateObject = jsonArray.getJSONObject(i);
                    String day_date = dateObject.getString("dayDate");
                    JSONArray array = dateObject.getJSONArray("notesUrl");
                    if (array.length() != 0)
                        dates.add(day_date);
                }
            }
        } catch (JSONException | NullPointerException e){
            e.printStackTrace();
        }
        return dates;
    }

    public void dateClick() {
        caldroidFragment.setCaldroidListener(new CaldroidListener() {
            @Override
            public void onSelectDate(Date date, View view) {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                String selectedDate = dateFormat.format(date);
                caldroidFragment.setSelectedDate(date);
                caldroidFragment.refreshView();
                caldroidFragment.clearSelectedDates();

                Log.v("selected","Date "+ selectedDate);
                DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
                Date date1 = null;
                try {
                    date1 = formatter.parse(selectedDate);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(date1);
                int dayId = calendar.get(Calendar.DAY_OF_WEEK) - 1;
                Log.v("Day","id"+dayId);
                Intent intent = new Intent(ViewNotesCalendarActivity.this,ViewNotesActivity.class);
                intent.putExtra("Calendar", true);
                intent.putExtra("selected",selectedDate);
                intent.putExtra("classId",classid);
                intent.putExtra("sectionId",sectionId);
                intent.putExtra("dayId",String.valueOf(dayId));
                startActivity(intent);
            }
        });
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                Intent intent = new Intent();
                setResult(RESULT_CANCELED, intent);
                onBackPressed();
        }
        return super.onOptionsItemSelected(item);
    }
    public void setCaldroidFragment () {
        caldroidFragment = new CaldroidFragment();
        Bundle args = new Bundle();
        args.putString(CaldroidFragment.DIALOG_TITLE, "Exams");
        caldroidFragment.setArguments(args);
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.calendar, caldroidFragment);
        transaction.commit();
    }

    @Override
    public void onBackPressed() {
        Intent intent = new Intent();
        setResult(RESULT_CANCELED, intent);
        finish();
    }
    public JSONObject dateObject(int month,int year){
        JSONObject object = new JSONObject();
        try {
            object.put("classId",classid);
            object.put("sectionId",sectionId);
            object.put("monthNo",month);
            object.put("yearNo",year);
        }catch (JSONException e){
            e.printStackTrace();
        }
        Log.v("JSon","Array"+object);
        return object;
    }

    public void clearBackground(){
        if(fromdate!=null)
            caldroidFragment.clearBackgroundDrawableForDate(fromdate);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Log.v("config","change "+newConfig);
        if(ViewNotesCalendarActivity.this.getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE) {
            attachmentIcon = getResources().getDrawable(R.color.eventColor);
            Log.v("Landscape","change "+newConfig);
        } else if (ViewNotesCalendarActivity.this.getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT){
            attachmentIcon = ResourcesCompat.getDrawable(getResources(), R.drawable.caldroid_attachment,null);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putInt("classSpinner", spinner.getSelectedItemPosition());
        Log.v("Class","selected"+spinner.getSelectedItemPosition());
        outState.putInt("sectionspinner",spinner1.getSelectedItemPosition());
        // do this for each or your Spinner
        // You might consider using Bundle.putStringArray() instead
    }
    /*public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            //RelativeLayout relativeLayout = (RelativeLayout) findViewById(R.id.calendar);
            this.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        }
    }*/
}