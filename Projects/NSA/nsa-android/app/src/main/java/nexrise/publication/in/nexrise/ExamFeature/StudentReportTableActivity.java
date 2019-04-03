package nexrise.publication.in.nexrise.ExamFeature;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.ListView;
import android.widget.TextView;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ExamMarks;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.ProgressReportFeature.StudentReportTableArrayAdapter;
import nexrise.publication.in.nexrise.R;


public class StudentReportTableActivity extends AppCompatActivity implements Constants {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_report_table);

        final ActionBar actionBar = getSupportActionBar();
        ListView listView = (ListView)findViewById(R.id.student_report_table_listview);
        Intent intent = getIntent();
        List<ExamMarks> marksList = (List<ExamMarks>) intent.getSerializableExtra("markList");
        String firstname = intent.getStringExtra(FIRST_NAME);
        String totalObtained = intent.getStringExtra(TOTAL_OBTAINED);

        TextView className = (TextView)findViewById(R.id.exam_name);
        className.setText(intent.getStringExtra(EXAM_NAME));
        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(firstname);
        }
        StudentReportTableArrayAdapter arrayAdapter = new StudentReportTableArrayAdapter(StudentReportTableActivity.this, marksList);
        listView.setAdapter(arrayAdapter);
        View footer = getLayoutInflater().inflate(R.layout.student_total,listView,false);
        listView.addFooterView(footer);
        TextView totalmark = (TextView) footer.findViewById(R.id.total_mark);
        totalmark.setText(totalObtained);
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
