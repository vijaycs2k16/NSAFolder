package nexrise.publication.in.nexrise.ProgressReportFeature;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.ListView;

import org.json.JSONObject;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ProgressResult;
import nexrise.publication.in.nexrise.JsonFormation.ProgressReportJsonFormation;
import nexrise.publication.in.nexrise.JsonParser.ProgressResultJsonParser;
import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class GradeActivity extends AppCompatActivity {

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_grade);
        ActionBar actionBar = getSupportActionBar();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setElevation(0);
            actionBar.setTitle("Progress report");
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }


        ProgressReportJsonFormation jsonFormation = new ProgressReportJsonFormation();
        JSONObject progressJson = jsonFormation.formJson();
        ProgressResultJsonParser parser = new ProgressResultJsonParser();
        String exam = getIntent().getStringExtra("Exam");
        List<ProgressResult> progressResultList;
        ListView listView = (ListView)findViewById(R.id.activity_grade_listview);

        if(!exam.equals("Overall")) {
             progressResultList = parser.parse(progressJson, exam);

            ProgressResultArrayAdapter progressArrayAdapter = new ProgressResultArrayAdapter(this, progressResultList);
            listView.setAdapter(progressArrayAdapter);
            listviewClick(listView);
        }
        else{
            progressResultList = parser.parse(progressJson, "Formative assessment 1");
            ProgressResultArrayAdapter progressArrayAdapter = new ProgressResultArrayAdapter(this, progressResultList);
            listView.setAdapter(progressArrayAdapter);
            overallListViewClick(listView);
        }

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

    public void listviewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                final ProgressResult progressResult = (ProgressResult) listView.getItemAtPosition(position);
                ImageView table = (ImageView)view.findViewById(R.id.table);
                table.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(GradeActivity.this, StudentDetailsActivity.class);
                        Bundle bundle = new Bundle();
                        bundle.putSerializable("ProgressResult", progressResult);
                        intent.putExtra("bundle",bundle);
                        startActivity(intent);
                    }
                });
                ImageView chart = (ImageView)view.findViewById(R.id.chart);
                chart.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(GradeActivity.this, StudentDetailsActivity.class);
                        Bundle bundle = new Bundle();
                        bundle.putSerializable("ProgressResult", progressResult);
                        intent.putExtra("bundle",bundle);
                        intent.putExtra("Page",1);
                        startActivity(intent);
                    }
                });
            }
        });
    }

    public void overallListViewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                final ProgressResult progressResult = (ProgressResult) listView.getItemAtPosition(position);
                ImageView table = (ImageView)view.findViewById(R.id.table);
                table.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(GradeActivity.this, OverallReportActivity.class);
                        intent.putExtra("Name",progressResult.getName());
                        startActivity(intent);
                    }
                });
                ImageView chart = (ImageView)view.findViewById(R.id.chart);
                chart.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(GradeActivity.this, OverallReportActivity.class);
                        intent.putExtra("Name",progressResult.getName());
                        intent.putExtra("Page",1);
                        startActivity(intent);
                    }
                });
            }
        });
    }
}
