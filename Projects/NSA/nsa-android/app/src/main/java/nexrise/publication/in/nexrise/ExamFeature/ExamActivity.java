package nexrise.publication.in.nexrise.ExamFeature;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
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
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

import nexrise.publication.in.nexrise.BeanClass.AttachmentDetails;
import nexrise.publication.in.nexrise.BeanClass.ClassAndSection;
import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.BeanClass.ExamSubject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.CustomHashMap.Initiater;
import nexrise.publication.in.nexrise.CustomHashMap.OnUpdateListener;
import nexrise.publication.in.nexrise.JsonParser.TaxanomyJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.AddClassFragmentAdapter;
import nexrise.publication.in.nexrise.TimetableFeature.AddSectionFragmentAdapter;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class ExamActivity extends AppCompatActivity implements Constants{
    String  sectionId;
    String classId;
    String className;
    String sectionName;
    ArrayList<Classes> section;
    StringUtils utils;
    RelativeLayout progressBarContainer;
    TextView noContent;
    ProgressBar progressBar;
    ListView listView;
    Boolean activityVisible = true;
    Boolean dataRendered = false;
    String userRole;
    OnUpdateListener updateListener;
    String markListId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exam);
        utils = new StringUtils();
        userRole = utils.getUserRole(this);
        final ActionBar actionBar = getSupportActionBar();
        progressBarContainer = (RelativeLayout)findViewById(R.id.loading_bar_container);
        noContent = (TextView)findViewById(R.id.no_content);
        progressBar = (ProgressBar)findViewById(R.id.loading_bar);
        listView = (ListView)findViewById(R.id.exam_list);

        displayNothingToShow();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(R.string.examinations);
        }

        LinearLayout linearLayout = (LinearLayout)findViewById(R.id.classtimtable);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);

        Intent intent = getIntent();
        if(intent.hasExtra(CLASS_SECTION)) {

            Spinner classSpinner = (Spinner) findViewById(R.id.classSpinner);
            Spinner sectionSpinner = (Spinner) findViewById(R.id.sectionSpinner);
            Spinner classSection = (Spinner) findViewById(R.id.class_section_spinner);

            classSpinner.setVisibility(View.GONE);
            sectionSpinner.setVisibility(View.GONE);
            classSection.setVisibility(View.VISIBLE);
            ArrayList<ClassAndSection> classAndSection = (ArrayList<ClassAndSection>) intent.getSerializableExtra(CLASS_SECTION);
            String scheduleId = intent.getStringExtra(SCHEDULE_ID);
            setUpClassSectionSpinner(classAndSection, classSection, scheduleId);

        } else {
            if (userRole.equalsIgnoreCase(PARENT)) {
                linearLayout.setVisibility(View.GONE);
                classId = preferences.getString(CLASS_ID, null);
                sectionId = preferences.getString(SECTION_ID, null);
                renderData(null);
                dataRendered = true;
            } else
                setupSpinner();
        }

        updateListener = new OnUpdateListener() {
            @Override
            public void onUpdate(String classId, String sectionId, String schoolId, String userId, String featureId, int count) {
                if(featureId.equals(CREATE_EXAM) && count != 0 ) {
                    if(activityVisible)
                        renderData(null);
                    else
                        dataRendered = false;
                }
            }
        };
        Initiater.getInstance().setOnUpdateListener(updateListener);
    }

    private void setupSpinner() {
        LinearLayout spinners = (LinearLayout)findViewById(R.id.classtimtable);
        if(spinners.getVisibility() == View.INVISIBLE || spinners.getVisibility() == View.GONE)
            spinners.setVisibility(View.VISIBLE);

        if (StringUtils.classList == null) {
            String url = BASE_URL + API_VERSION_ONE + TAXANOMY ;

            GETUrlConnection getClassSection = new GETUrlConnection(this, url,null) {
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject responseJson = new JSONObject(response);
                        JSONArray classesArray = responseJson.getJSONArray(DATA);
                        Log.v("ClassDetails",""+ response);

                        StringUtils.taxanomy = classesArray;
                        TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                        StringUtils.classList = classListJsonparser.getClassDetails(classesArray);

                        Log.v("vlass List", ""+StringUtils.classList);
                        renderClassSection(StringUtils.classList);
                    } catch (JSONException | NullPointerException e) {
                        Toast.makeText(ExamActivity.this, R.string.oops, Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(ExamActivity.this);
                    }
                }
            };
            getClassSection.execute();
        } else
            renderClassSection(StringUtils.classList);
    }

    private void setUpClassSectionSpinner(final ArrayList<ClassAndSection> classAndSections, final Spinner spinner, final String scheduleId) {
        final ClassAndSection classAndSection = new ClassAndSection();
        classAndSection.setClass_name("None");
        classAndSection.setSection_name("None");
        classAndSections.add(0, classAndSection);

        ClassSectionSpinner spinnerAdapter = new ClassSectionSpinner(this, classAndSections);
        spinner.setAdapter(spinnerAdapter);
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                classId = classAndSections.get(i).getClass_id();
                sectionId = classAndSections.get(i).getSection_id();
                className = classAndSections.get(i).getClass_name();
                sectionName = classAndSections.get(i).getSection_name();
                if(classId != null && sectionId != null)
                    renderData(scheduleId);
                else {
                    listView.setAdapter(null);
                    displayNothingToShow();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
    }

    private void renderClassSection(final List<Classes> classList) {
        final Spinner classSpinner = (Spinner) findViewById(R.id.classSpinner);

        final List<Classes> classesWithNone = new StringUtils().insertNoneIntoClassSectionSpinner(classList);
        AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(this, classesWithNone);
        classSpinner.setAdapter(adapter);

        classSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                classId = classesWithNone.get(position).getId();
                className = classesWithNone.get(position).getLabel();
                Log.v("class_id","current "+ className);
                final Classes selectedClass = classesWithNone.get(position);
                section = selectedClass.getSections();

                Log.v("class9",""+selectedClass.getSections().toString());
                AddSectionFragmentAdapter adapter = new AddSectionFragmentAdapter(ExamActivity.this, section);

                final Spinner sectionSpinner = (Spinner) findViewById(R.id.sectionSpinner);
                sectionSpinner.setAdapter(adapter);

                sectionSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, final View view, int position, long id) {
                        sectionId = section.get(position).getId();
                        sectionName = section.get(position).getLabel();
                        Log.v("Section","Id"+sectionId);
                        String classId = selectedClass.getId();

                        if(sectionId != null)
                            renderData(null);
                        else {
                            listView.setAdapter(null);
                            displayNothingToShow();
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

    private void renderData(final String scheduleId) {
        String url = BASE_URL + API_VERSION_ONE + EXAM + SCHEDULE + CLASS + classId + SECTION + sectionId;
        Log.v("Exam","url"+url);
        GETUrlConnection getExamSchedule = new GETUrlConnection(this, url, null) {
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                if(progressBarContainer.getVisibility() == View.GONE)
                    progressBarContainer.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    utils.checkSession(response);
                    progressBar.setVisibility(View.INVISIBLE);
                    progressBarContainer.setVisibility(View.GONE);
                    Log.v("EXAM"," ReSPONSE "+response);
                    JSONObject json = new JSONObject(response);
                    ArrayList<Exam> examList = jsonParser(json);

                    if(scheduleId != null) {
                        for (int i=0; i<examList.size(); i++) {
                            if (examList.get(i).getScheduleId().equals(scheduleId)) {
                                Exam exam = examList.get(i);
                                //markList(exam);
                                startActivity(exam);
                                break;
                            }
                        }
                    }
                    if(examList.size() == 0)
                        throw new JSONException("No exam schedule are available");
                    ExamListArrayAdapter arrayAdapter = new ExamListArrayAdapter(ExamActivity.this, 0, examList);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView);
                } catch (NullPointerException | JSONException | ParseException e) {
                    displayNothingToShow();
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(ExamActivity.this);
                }
            }
        };
        getExamSchedule.execute();
    }

    private void displayNothingToShow() {
        if(progressBarContainer.getVisibility() == View.GONE)
            progressBarContainer.setVisibility(View.VISIBLE);
        noContent.setVisibility(View.VISIBLE);
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
        if(userRole.equalsIgnoreCase(PARENT) && ! dataRendered)
            renderData(null);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        activityVisible = false;
        Initiater.getInstance().remove(updateListener);
    }

    public ArrayList<Exam> jsonParser(JSONObject json) throws JSONException, NullPointerException, ParseException {
        Log.v("json","object"+json);
        JSONArray examArray = json.getJSONArray(DATA);
        ArrayList<Exam> examList = new ArrayList<>();
        StringUtils utils = new StringUtils();

        if(examArray.length() == 0)
            throw new JSONException("Empty Json");
        for (int i=0; i<examArray.length(); i++) {
            JSONObject examObj = examArray.getJSONObject(i);
            int totalMarks = 0;

            String schedule = examObj.get("schedule").toString();
            JSONArray subjects;

            if(schedule.equals("null"))
                subjects = new JSONArray();
            else
                subjects = examObj.getJSONArray("schedule");

            Exam exam = new Exam();
            exam.setExamId(examObj.getString("written_exam_id"));
            exam.setScheduleId(examObj.getString("exam_schedule_id"));
            exam.setExamName(examObj.getString("written_exam_name"));
            Boolean status = examObj.getBoolean("status");
            String publishedDate = utils.examDate(examObj.getString("updated_date"));
            String[] updatedDate = publishedDate.split(",");
            exam.setPublishedDate(updatedDate[0]);

            ArrayList<ExamSubject> examSubjects = new ArrayList<>();
            if(status) {
                for (int j = 0; j < subjects.length(); j++) {
                    ExamSubject examSubject = new ExamSubject();
                    JSONObject subjectObj = subjects.getJSONObject(j);
                    String subjectName = subjectObj.getString("subject_name");
                    String startTime = subjectObj.getString("exam_start_time");
                    String endTime = subjectObj.getString("exam_end_time");
                    String mark = subjectObj.getString("mark");

                    String date = utils.dateAndMonth(startTime);
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MMM dd yyyy", Locale.ENGLISH);
                    Date date1 = simpleDateFormat.parse(startTime);
                    SimpleDateFormat day = new SimpleDateFormat("EEE", Locale.ENGLISH);

                    String date2 = day.format(date1);
                    examSubject.setSubject_name(subjectName);

                    examSubject.setDate(date);
                    examSubject.setDay(date2);
                    examSubject.setExamStartTime(utils.timeSet(startTime));
                    examSubject.setExamEndTime(utils.timeSet(endTime));
                    examSubject.setMark(mark);
                    examSubjects.add(examSubject);

                    totalMarks += Integer.valueOf(mark);
                }
                Collections.sort(examSubjects,new DatesComparator());
                exam.setSubjectsList(examSubjects);
                exam.setTotalMarks(String.valueOf(totalMarks));
                examList.add(exam);

                if(check(examObj, "portions")) {

                    JSONObject portionsObj = examObj.getJSONObject("portions");
                    String portionsDetails = portionsObj.getString("portion_details");
                    exam.setPortionsDetails(portionsDetails);
                    if(check(portionsObj, "attachments")) {
                        JSONObject attachmentsObj = portionsObj.getJSONObject("attachments");
                        if(check(attachmentsObj, "attachment")) {
                            JSONObject attachments = attachmentsObj.getJSONObject("attachment");
                            Iterator attachmentKeys = attachments.keys();
                            ArrayList<AttachmentDetails> attachmentsList = new ArrayList<>();
                            while (attachmentKeys.hasNext()) {
                                AttachmentDetails attachmentDetails = new AttachmentDetails();
                                String fileUrl = attachmentKeys.next().toString();
                                attachmentDetails.setName(fileUrl);
                                String fileName = attachments.getString(fileUrl);
                                attachmentDetails.setFileName(fileName);
                                attachmentsList.add(attachmentDetails);
                            }
                            exam.setAttachments(attachmentsList);
                        }
                    }
                }
            }
        }
        return examList;
    }

    protected boolean check(JSONObject jsonObject, String key) throws JSONException, NullPointerException {
        boolean present = false;
        if(jsonObject.has(key)) {
            Object obj = jsonObject.get(key);
            if(obj != null && !obj.toString().equals("null")) {
                present = true;
            }
        }
        return present;
    }

    public void listviewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Exam exam = (Exam) listView.getItemAtPosition(position);
                startActivity(exam);
            }
        });
    }

    private void startActivity(Exam exam) {
        Intent intent = new Intent(ExamActivity.this, ExamDetailsActivity.class);
        intent.putExtra("examObject", exam);
        intent.putExtra(CLASS_NAME, className);
        intent.putExtra(SECTION_NAME, sectionName);
        intent.putExtra(CLASS_ID,classId);
        intent.putExtra(SECTION_ID,sectionId);
        intent.putExtra(EXAM_NAME, exam.getExamName());
        startActivity(intent);
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

    private class DatesComparator implements Comparator<ExamSubject> {
        @Override
        public int compare(ExamSubject o1, ExamSubject o2) {
            Date firstDate = new StringUtils().convertStringToDate(o1.getDate());
            Date secondDate = new StringUtils().convertStringToDate(o2.getDate());
            return firstDate.compareTo(secondDate);
        }
    }
}
