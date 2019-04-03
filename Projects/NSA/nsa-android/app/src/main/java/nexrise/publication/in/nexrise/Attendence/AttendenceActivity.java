package nexrise.publication.in.nexrise.Attendence;

import android.content.Context;
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
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.JsonParser.TaxanomyJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.AddClassFragmentAdapter;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

import static nexrise.publication.in.nexrise.Constants.API_VERSION_ONE;
import static nexrise.publication.in.nexrise.Constants.BASE_URL;
import static nexrise.publication.in.nexrise.Constants.CURRENT_USERNAME;
import static nexrise.publication.in.nexrise.Constants.EMP;
import static nexrise.publication.in.nexrise.Constants.LEAVES;
import static nexrise.publication.in.nexrise.Constants.REQUESTED;
import static nexrise.publication.in.nexrise.Constants.TAXANOMY;

public class AttendenceActivity extends AppCompatActivity {

    ArrayList<Classes> section;
    String  sectionId;
    String classid;
    String className;
    String sectionName;
    SharedPreferences preferences;
    Toast toast;
    TextView attendance;
    TextView recordClass;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_attendence);
        preferences = PreferenceManager.getDefaultSharedPreferences(AttendenceActivity.this);
        attendance = (TextView)findViewById(R.id.study_value);
        attendance.setText(R.string.attendance);
        recordClass = (TextView)findViewById(R.id.record_class_attendence);
        recordClass.setText(R.string.record_class_attendance);


        if (StringUtils.classList == null) {
            String Class = BASE_URL + API_VERSION_ONE + TAXANOMY ;

            GETUrlConnection url = new GETUrlConnection(this, Class, null) {
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject responseJson = new JSONObject(response);
                        JSONArray classesArray = responseJson.getJSONArray(DATA);
                        Log.v("ClassDetails"," " + response);
                        StringUtils.taxanomy = classesArray;
                        TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                        StringUtils.classList = classListJsonparser.getClassDetails(classesArray);
                        Log.v("vlass List", ""+StringUtils.classList);
                        setUpClassSpinner(StringUtils.classList);
                    } catch (JSONException | NullPointerException e) {
                        Toast.makeText(AttendenceActivity.this, R.string.oops, Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(AttendenceActivity.this);
                    }
                }
            };
            url.execute();
        } else {
            setUpClassSpinner(StringUtils.classList);
        }

        TextView cdate = (TextView) findViewById(R.id.classtime);
        TextView myLeaves = (TextView) findViewById(R.id.leaves);
        myLeaves.setText(R.string.my_leave);
        LinearLayout myleaveLayout = (LinearLayout) findViewById(R.id.myleave_layout);

        Button submitButton = (Button) findViewById(R.id.attendance_submit_button);
        getClassAttendance(submitButton);
       // setUpSpinner(classList);

        Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy");
        String date = dateFormat.format(now);
        cdate.setText(date);

        ActionBar actionBar = getSupportActionBar();
        renderView();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(R.string.attendance_management);
        }

        myleaveLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AttendenceActivity.this, AttendanceActivityFragment.class);
                startActivity(intent);
            }
        });

        final ImageView help = (ImageView)findViewById(R.id.help);
        new StringUtils().customTooltip(AttendenceActivity.this,help, (String) getResources().getText(R.string.emp_attendance));
    }

    private void setUpClassSpinner(final List<Classes> classList) {
        final Spinner spinner = (Spinner) findViewById(R.id.classspin);

        final List<Classes> classesWithNone = new StringUtils().insertNoneIntoClassSectionSpinner(classList);
        AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(AttendenceActivity.this, classesWithNone);
        spinner.setAdapter(adapter);

        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                classid = classesWithNone.get(position).getId();
                className =classesWithNone.get(position).getLabel();

                Log.v("class_id","current "+classid);
                Classes selectedClass = classesWithNone.get(position);
                section = selectedClass.getSections();
                Log.v("class9",""+selectedClass.getSections());
                AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(AttendenceActivity.this, section);
                final Spinner spinner1 = (Spinner) findViewById(R.id.sectionspin);
                spinner1.setAdapter(adapter);
                spinner1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                        sectionId = section.get(position).getId();
                        sectionName = section.get(position).getLabel();
                        Log.v("section_id","current"+sectionId);
                        Log.v("Spinner "," "+sectionId);
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

    @Override
    protected void onPause() {
        super.onPause();
        if (toast!= null)
        toast.cancel();
    }

    private void getClassAttendance(Button submitButton) {
        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (sectionId != null) {
                    Intent intent = new Intent(AttendenceActivity.this, AttendanceHistoryActivity.class);
                    intent.putExtra("classId", classid);
                    intent.putExtra("sectionId", sectionId);
                    intent.putExtra("className", className);
                    intent.putExtra("sectionName", sectionName);
                    startActivity(intent);
                }else {
                    if (toast != null)
                        toast.cancel();
                    toast = Toast.makeText(AttendenceActivity.this, R.string.please_select_class, Toast.LENGTH_SHORT);
                    toast.show();
                }
            }

        });
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
    public void renderView() {
            String username = preferences.getString(CURRENT_USERNAME, null);
            String leaveApprovalCredential = BASE_URL + API_VERSION_ONE + LEAVES + EMP + REQUESTED + username;
            GETUrlConnection getUrlConnection = new GETUrlConnection(AttendenceActivity.this, leaveApprovalCredential,null) {
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    Log.v("response ", " leave" + response);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject mainObject = new JSONObject(response);
                        JSONArray dataArray = mainObject.getJSONArray(DATA);
                        if (dataArray.length() != 0) {
                            LinearLayout approvalLayout = (LinearLayout) findViewById(R.id.approval_layout);
                            TextView leaveApproval =  (TextView) findViewById(R.id.leave_approval);
                            leaveApproval.setText(R.string.leave_approval);
                            approvalLayout.setVisibility(View.VISIBLE);
                            approvalLayout.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    Intent intent = new Intent(AttendenceActivity.this, LeaveApprovalActivity.class);
                                    startActivity(intent);
                                }
                            });
                        }
                    } catch (JSONException | NullPointerException e) {
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(AttendenceActivity.this);
                    }
                }
            };
            getUrlConnection.execute();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (toast!=null)
        toast.cancel();
    }
}
