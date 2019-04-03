package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.BeanClass.ExamSubject;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;


public class ExamDetailsActivity extends AppCompatActivity implements Constants {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exam_details);
        ActionBar actionBar = getSupportActionBar();
        StringUtils utils = new StringUtils();
        Intent intent = getIntent();
        TextView classSection = (TextView)findViewById(R.id.class_section);



        if(utils.getUserRole(this).equalsIgnoreCase(EMPLOYEE)) {
            String className = intent.getStringExtra(CLASS_NAME);
            String sectionName = intent.getStringExtra(SECTION_NAME);
            classSection.setText(className + " - " + sectionName+" "+"  "+ ACADEMIC_YEAR);
        } else
            classSection.setVisibility(View.GONE);

        Exam exam = (Exam)intent.getSerializableExtra("examObject");
        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(exam.getExamName());
        }
        ArrayList<ExamSubject> examSubject = exam.getSubjectsList();
        ListView listView = (ListView)findViewById(R.id.exam_details);
        ExamDetailsArrayAdapter arrayAdapter = new ExamDetailsArrayAdapter(this, examSubject);
        listView.setAdapter(arrayAdapter);
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
}
