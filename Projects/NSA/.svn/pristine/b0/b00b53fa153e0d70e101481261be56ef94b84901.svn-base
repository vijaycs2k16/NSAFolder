package nexrise.publication.in.nexrise.ProgressReportFeature.ParentStudentLogin;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import com.michael.easydialog.EasyDialog;

import org.json.JSONObject;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.LoginObject;
import nexrise.publication.in.nexrise.BeanClass.ProgressResult;
import nexrise.publication.in.nexrise.JsonFormation.ProgressReportJsonFormation;
import nexrise.publication.in.nexrise.JsonParser.ProgressResultJsonParser;
import nexrise.publication.in.nexrise.ProgressReportFeature.BarGraphFragment;
import nexrise.publication.in.nexrise.ProgressReportFeature.OverallReportActivity;
import nexrise.publication.in.nexrise.ProgressReportFeature.StudentReportTableFragment;
import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

import static nexrise.publication.in.nexrise.Constants.PARENT;
import static nexrise.publication.in.nexrise.Constants.STUDENT;

public class StudentDetailsActivity extends AppCompatActivity {
    private String examName;
    private List<ProgressResult> progressResultList;
    private ProgressResult progressResult;
    int selection = 2;
    LoginObject userObject;
    Spinner spinner;
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_details2);
        Intent intent = getIntent();
        userObject = (LoginObject) intent.getExtras().getSerializable("userObject");

        ActionBar actionBar = getSupportActionBar();
        progressResult = (ProgressResult)getIntent().getSerializableExtra("ProgressResult");
        String studentName = getIntent().getStringExtra("studentName");
        Log.v("Student name ","parent login "+studentName);
        if(actionBar!= null){
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setElevation(0);
            actionBar.setTitle("Progress report");
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        StudentReportTableFragment studentReportTableFragment = new StudentReportTableFragment();
        Bundle bundle = new Bundle();

        bundle.putSerializable("Results",getIntent().getSerializableExtra("ProgressResult"));
        studentReportTableFragment.setArguments(bundle);

        TextView textView = (TextView)findViewById(R.id.textView42);
        textView.setText(progressResult.getClassname()+"th "+progressResult.getSection());

        String[] exams = {"Select exam","FA1","FA2", "SA1"};
        spinner = (Spinner)findViewById(R.id.spinner);
        ArrayAdapter<String> arrayAdapter = new ArrayAdapter<String>(this, R.layout.support_simple_spinner_dropdown_item, exams);
        spinner.setAdapter(arrayAdapter);
        spinner.setSelection(selection);

        spinnerClickListener(spinner);

        TextView progressReport = (TextView)findViewById(R.id.progress_report_name);
        if(studentName!= null){
            progressReport.setText(studentName);
        }else {
            progressReport.setText("Ashmitha prakash");
        }
        imageButtonClick();
        //customTooltip();
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

    @Override
    protected void onResume() {
        super.onResume();

        spinner.setSelection(selection);
    }

    public void spinnerClickListener(final Spinner spinner){
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String exam = spinner.getItemAtPosition(position).toString();

                if(exam.equals("FA1")){
                    examName = "Formative assessment 1";
                }
                else if(exam.equals("FA2")){
                    examName = "Formative assessment 2";
                } else if (exam.equals("SA1")){
                    examName = "Summative assessment 1";
                }
                Intent intent = getIntent();
                if(exam.equals("Overall")) {

                    Intent overallReportActivity = new Intent(StudentDetailsActivity.this, OverallReportActivity.class);
                    overallReportActivity.putExtra("studentName",intent.getStringExtra("studentName"));
                    overallReportActivity.putExtra("className",intent.getStringExtra("className"));
                    overallReportActivity.putExtra("Name",progressResult.getName());
                    startActivity(overallReportActivity);

                }
                else if(!exam.equals("Select exam")) {
                    selection = position;
                    ProgressReportJsonFormation jsonFormation = new ProgressReportJsonFormation();
                    JSONObject progressJson = jsonFormation.formJson();
                    ProgressResultJsonParser parser = new ProgressResultJsonParser();
                    progressResultList = parser.parse(progressJson, examName);

                    Bundle bundle = new Bundle();
                    bundle.putSerializable("ProgressResult",progressResultList.get(0));
                    bundle.putString("studentName",intent.getStringExtra("studentName"));
                    bundle.putString("className",intent.getStringExtra("className"));
                    StudentReportTableFragment studentReportTableFragment = new StudentReportTableFragment();
                    studentReportTableFragment.setArguments(bundle);

                    FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                    transaction.replace(R.id.student_details_frame, studentReportTableFragment);
                    transaction.commit();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
    }

    public void imageButtonClick() {
        final ImageButton tableView = (ImageButton) findViewById(R.id.table_view);
        final ImageButton graphView = (ImageButton) findViewById(R.id.graph_view);

        tableView.setColorFilter(Color.parseColor("#FF2794bf"));
        graphView.setColorFilter(Color.parseColor("#FFFFFFFF"));

        tableView.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
            @Override
            public void onClick(View v) {
                Bundle bundle = new Bundle();
                bundle.putSerializable("ProgressResult",progressResultList.get(0));
                StudentReportTableFragment studentReportTableFragment = new StudentReportTableFragment();
                studentReportTableFragment.setArguments(bundle);

                FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.student_details_frame, studentReportTableFragment);
                transaction.commit();

                tableView.setColorFilter(Color.parseColor("#FF2794bf"));
                graphView.setColorFilter(Color.parseColor("#FFFFFFFF"));

            }
        });

        graphView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Bundle bundle = new Bundle();
                bundle.putSerializable("ProgressResult",progressResultList.get(0));
                // From activity is passed to hide the textview which displays the student name, class and section because
                // parent/student displays the student name in actionbar itself not in the seperate textview
                bundle.putString("fromActivity","ParentStudentLogin");
                BarGraphFragment barGraphFragment = new BarGraphFragment();
                barGraphFragment.setArguments(bundle);

                FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.student_details_frame, barGraphFragment);
                transaction.commit();

                tableView.setColorFilter(Color.parseColor("#FFFFFFFF"));
                graphView.setColorFilter(Color.parseColor("#FF2794bf"));

            }
        });
    }

    public void customTooltip(){
        Intent intent = getIntent();
        userObject = (LoginObject) intent.getExtras().getSerializable("userObject");
        final ImageView help = (ImageView)findViewById(R.id.help);
        if(userObject.getUserType().equals(PARENT)){

            help.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    View view = StudentDetailsActivity.this.getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                    TextView tooltip = (TextView)view.findViewById(R.id.textView53);
                    tooltip.setText("View your child’s academic progress card with graph statistics");
                    tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                    new EasyDialog(StudentDetailsActivity.this).setLayout(view)
                            .setLocationByAttachedView(help)
                            .setGravity(EasyDialog.GRAVITY_BOTTOM)
                        /*.setAnimationTranslationShow(EasyDialog.DIRECTION_X, 1000, -600, 100, -50, 50, 0)
                        .setAnimationAlphaShow(1000, 0.3f, 1.0f)
                        .setAnimationTranslationDismiss(EasyDialog.DIRECTION_X, 500, -50, 800)
                        .setAnimationAlphaDismiss(500, 1.0f, 0.0f)*/
                            .setTouchOutsideDismiss(true)
                            .setMatchParent(false)
                            .setBackgroundColor(StudentDetailsActivity.this.getResources().getColor(R.color.colorGreen))
                            .setMarginLeftAndRight(44,34)
                            .show();
                }
            });
        }else if (userObject.getUserType().equals(STUDENT)){
            help.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    View view = StudentDetailsActivity.this.getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                    TextView tooltip = (TextView)view.findViewById(R.id.textView53);
                    tooltip.setText("Good Job! Your progress report. ");
                    tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                    new EasyDialog(StudentDetailsActivity.this).setLayout(view)
                            .setLocationByAttachedView(help)
                            .setGravity(EasyDialog.GRAVITY_BOTTOM)
                        /*.setAnimationTranslationShow(EasyDialog.DIRECTION_X, 1000, -600, 100, -50, 50, 0)
                        .setAnimationAlphaShow(1000, 0.3f, 1.0f)
                        .setAnimationTranslationDismiss(EasyDialog.DIRECTION_X, 500, -50, 800)
                        .setAnimationAlphaDismiss(500, 1.0f, 0.0f)*/
                            .setTouchOutsideDismiss(true)
                            .setMatchParent(false)
                            .setBackgroundColor(StudentDetailsActivity.this.getResources().getColor(R.color.colorGreen))
                            .setMarginLeftAndRight(44,34)
                            .show();
                }
            });
        }



    }

}
