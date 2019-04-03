package nexrise.publication.in.nexrise.EventsFeature;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.BeanClass.Devicetoken;
import nexrise.publication.in.nexrise.BeanClass.Language;
import nexrise.publication.in.nexrise.BeanClass.Student;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.StudentsParser;
import nexrise.publication.in.nexrise.JsonParser.TaxanomyJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.AddClassFragmentAdapter;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class AttendeesActivity extends AppCompatActivity implements Constants {
    ArrayList<String> stringArrayList;
    ArrayList<Classes> section;
    String  sectionId;
    String classid;
    String className;
    String sectionName;
    ListView selectedList;
    ListView studentsListview;
    AttendeesArrayAdapter selectedArrayAdapter;
    ArrayList<Student> students;
    AttendeesArrayAdapter studentsArrayAdapter;
    boolean toBeSelectedClicked = true;
    boolean selectedClicked = true;
    TextView selectedCount;
    List<Student> studentList;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_attendees);
        ActionBar actionBar = getSupportActionBar();
        this.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);
        selectedList = (ListView)findViewById(R.id.selected_list);
        studentsListview = (ListView)findViewById(R.id.students_list);

        students = new ArrayList<>();
        selectedArrayAdapter = new AttendeesArrayAdapter(this, students);
        selectedList.setAdapter(selectedArrayAdapter);

        if(actionBar!= null) {
            actionBar.setTitle(R.string.students);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        Intent intent = getIntent();
        if(intent.hasExtra("Selected students")) {
            ArrayList<Student> selectedStudents = (ArrayList<Student>) intent.getSerializableExtra("Selected students");
            for (int i = 0; i < selectedStudents.size(); i++) {
                renderSelectedStudents(selectedStudents.get(i), "Add");
            }
        }

        if (StringUtils.taxanomy == null){
            String Class = BASE_URL + API_VERSION_ONE + TAXANOMY ;

            GETUrlConnection url = new GETUrlConnection(this, Class,null) {
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    Log.v("Attendees","response"+response);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject responseJson = new JSONObject(response);
                        JSONArray classesArray = responseJson.getJSONArray(DATA);
                        StringUtils.taxanomy = classesArray;
                        TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                        StringUtils.classList = classListJsonparser.getClassDetails(classesArray);
                        setUpClassSpinner(StringUtils.classList);
                        listviewVisibility();
                    } catch (JSONException | NullPointerException e) {
                        Toast.makeText(AttendeesActivity.this, R.string.oops, Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(AttendeesActivity.this);
                    }
                }
            };
            url.execute();
        } else {
            try {
                TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                StringUtils.classList = classListJsonparser.getClassDetails(StringUtils.taxanomy);
                setUpClassSpinner(StringUtils.classList);
                Log.v("else ","student list "+StringUtils.classList);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            listviewVisibility();
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                Log.v("selected","student count"+selectedList.getCount());
                selectedClicked = false;
                Intent intent1 = new Intent();
                setResult(RESULT_CANCELED, intent1);
                onBackPressed();
                //finish();
                break;
            case R.id.tick:
                Intent intent = new Intent();
                try {
                    intent.putExtra("SelectedList", students);
                    JSONArray attendeesArray = formAttendeesJson();
                    intent.putExtra("AttendeesArray", attendeesArray.toString());
                    Log.v("selected"," "+attendeesArray.toString());
                    setResult(RESULT_OK, intent);
                } catch (JSONException e) {
                    setResult(RESULT_CANCELED, intent);
                }
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.add_homework_actionbar, menu);

        return super.onCreateOptionsMenu(menu);
    }

    private void setUpClassSpinner(final List<Classes> classList) {
        final Spinner classes = (Spinner) findViewById(R.id.classSpinner);
        final TextView classSection = (TextView)findViewById(R.id.class_section);

        final List<Classes> classWithNone = new StringUtils().insertNoneIntoClassSectionSpinner(classList);
        AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(AttendeesActivity.this, classWithNone);
        classes.setAdapter(adapter);

        classes.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                classid = classWithNone.get(position).getId();
                className = classWithNone.get(position).getLabel();

                Log.v("class_id","current "+classid);
                final Classes selectedClass = classWithNone.get(position);
                section = selectedClass.getSections();
                Log.v("class9",""+selectedClass.getSections());
                AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(AttendeesActivity.this, section);
                final Spinner sections = (Spinner) findViewById(R.id.sectionSpinner);
                sections.setAdapter(adapter);
                sections.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                        sectionId = section.get(position).getId();
                        sectionName = section.get(position).getLabel();
                        if (sectionId != null) {
                            classSection.setText(className + "   " + sectionName);
                            renderStudents(classid, sectionId);
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

    private void renderStudents(String classId, String sectionId) {

        JSONObject elasticSearchQuery = new JSONObject();
        JSONArray classesAry = new JSONArray();
        JSONArray sectionArray = new JSONArray();
        JSONObject classesObj = new JSONObject();

        try {
            classesObj.put("id", classId);
            sectionArray.put(sectionId);
            classesObj.put("section", sectionArray);
            classesAry.put(classesObj);
            elasticSearchQuery.putOpt("classes", classesAry);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        Log.v("ES Query", " " + elasticSearchQuery);
        String url = BASE_URL + API_VERSION_ONE + ES + STUDENT+ "/" + CLASSES;
        Log.v("attendees","Url"+url);
        final LinearLayout listviews = (LinearLayout)findViewById(R.id.listviews);
        POSTUrlConnection getUsersByClassAndSections = new POSTUrlConnection(elasticSearchQuery, url, null, this) {
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.loading_bar);
            TextView noContent = (TextView)findViewById(R.id.no_content);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
                listviews.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("ES values", " " + response);
                try {
                    new StringUtils().checkSession(response);
                    progressBar.setVisibility(View.INVISIBLE);
                    listviews.setVisibility(View.VISIBLE);
                    studentList = new StudentsParser().parseStudents(response);
                    studentsArrayAdapter = new AttendeesArrayAdapter(AttendeesActivity.this, studentList);
                    studentsListview.setAdapter(studentsArrayAdapter);
                    EditText searchBox = (EditText)findViewById(R.id.search);
                    search(searchBox);
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                    noContent.setVisibility(View.VISIBLE);
                    if(listviews.getVisibility() == View.VISIBLE)
                        listviews.setVisibility(View.INVISIBLE);
                }catch (SessionExpiredException e) {
                    e.handleException(AttendeesActivity.this);
                }
            }
        };
        getUsersByClassAndSections.execute();
    }

    public void renderSelectedStudents(Student selectedStudent, String action) {
        if(action.equalsIgnoreCase("Add")) {
            if (students.size() == 0) {
                students.add(selectedStudent);
                Log.v("add"," "+selectedStudent.getId());
            }
            else {
                for (int i = 0; i < students.size(); i++) {
                    if (selectedStudent.getId().equals(students.get(i).getId())) {
                        break;
                       // Toast.makeText(AttendeesActivity.this, "This Student Already Added", Toast.LENGTH_SHORT).show();
                    }
                    if(i == students.size() - 1)
                        students.add(selectedStudent);
                }
            }
        }
        else if(action.equalsIgnoreCase("Remove")) {
            for(int j = 0; j < students.size(); j++) {
                if (selectedStudent.getId().equals(students.get(j).getId())) {
                    students.remove(j);
                    break;
                }
            }
        }
        selectedArrayAdapter.notifyDataSetChanged();
        selectedCount = (TextView)findViewById(R.id.count);
        selectedCount.setText(String.valueOf(students.size()));
    }

    private void listviewVisibility() {
        LinearLayout toBeSelected = (LinearLayout)findViewById(R.id.to_be_selected);
        final ImageView toBeSelectedArrow = (ImageView)findViewById(R.id.image1);
        LinearLayout selected = (LinearLayout)findViewById(R.id.selected);
        final ImageView selectedArrow = (ImageView)findViewById(R.id.image2);

        // After rendering the data to the listview (both studentsListview, selectedList) the default visibility will be VISIBLE
        toBeSelected.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(toBeSelectedClicked) {
                    studentsListview.setVisibility(View.GONE);
                    selectedList.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
                    toBeSelectedClicked = false;
                    toBeSelectedArrow.setImageResource(R.drawable.ic_arrow_down_circle);
                } else {
                    studentsListview.setVisibility(View.VISIBLE);
                    LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                    layoutParams.weight = 1;
                    selectedList.setLayoutParams(layoutParams);
                    toBeSelectedClicked = true;
                    toBeSelectedArrow.setImageResource(R.drawable.ic_arrow_up_circle);
                }
            }
        });

        selected.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(selectedClicked) {
                    selectedList.setVisibility(View.INVISIBLE);
                    selectedClicked = false;
                    selectedArrow.setImageResource(R.drawable.ic_arrow_down_circle);
                } else {
                    selectedList.setVisibility(View.VISIBLE);
                    selectedClicked = true;
                    selectedArrow.setImageResource(R.drawable.ic_arrow_up_circle);
                }
            }
        });
    }

    public JSONArray formAttendeesJson() throws JSONException, NullPointerException {
        JSONArray attendeesArray = new JSONArray();

        for (int i=0; i<students.size(); i++) {
            JSONArray classesAry = new JSONArray();
            JSONArray languageAry = new JSONArray();
            JSONArray devicetokenAry = new JSONArray();

            JSONObject attendees = new JSONObject();
            Student student = students.get(i);
            attendees.put("id", student.getId());
            attendees.put("userName", student.getUsername());
            attendees.put("tenantId", student.getTenantId());
            attendees.put("schoolId", student.getSchoolId());
            attendees.put("schoolName", student.getSchoolName());
            attendees.put("userType", student.getUserType());
            attendees.put("userCode", student.getUserCode());
            attendees.put("shortName", student.getShortName());
            attendees.put("dateOfJoining", student.getDateOfJoining());
            Log.v("detail","D.O.J"+student.getDateOfJoining());
            attendees.put("firstName", student.getFirstname());
            attendees.put("primaryPhone", student.getPrimaryPhone());
            attendees.put("emailAddress", student.getEmailAddress());

            JSONObject classdetails = new JSONObject();
            classdetails.put("class_id",student.getClassId());
            classdetails.put("class_name",student.getClassName());
            classdetails.put("class_code",student.getClassCode());
            classdetails.put("section_id",student.getSectionId());
            classdetails.put("section_name",student.getSection());
            classdetails.put("section_code",student.getSection_code());
            classesAry.put(classdetails);
            attendees.put("classes",classesAry);

            ArrayList<Language> languages = student.getLanguages();
            for(int k=0;k<languages.size();k++){
                JSONObject languagedetails = new JSONObject();
                Language language = languages.get(k);
                languagedetails.put("language_id",language.getLanguage_id());
                languagedetails.put("language_name",language.getLanguage_name());
                languagedetails.put("language_type",language.getLanguage_type());
                languageAry.put(languagedetails);
            }
            attendees.put("languages",languageAry);
            attendees.put("admissionNo",student.getAdmissionNo());
            ArrayList<Devicetoken> devicetokens = student.getDevicetokens();
            for (int l=0;l<devicetokens.size();l++){
                JSONObject devicetokendetails = new JSONObject();
                Devicetoken devicetoken = devicetokens.get(l);
                devicetokendetails.put("registration_id",devicetoken.getRegistration_id());
                devicetokendetails.put("endpoint_arn",devicetoken.getEndpoint_arn());
                devicetokenAry.put(devicetokendetails);
            }
            attendees.put("deviceToken",devicetokenAry);
            attendees.put("suggestStudent",student.getUsername()+"("+student.getClassName()+"-"+student.getSection()+")");
            attendees.put("active",student.isActive());
            attendeesArray.put(attendees);
        }
        Log.v("event","array"+attendeesArray);
        return attendeesArray;
    }

    private void search(EditText searchBox) {
        searchBox.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

                studentsArrayAdapter.getFilter().filter(s);
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
    }
}