package nexrise.publication.in.nexrise.ProgressReportFeature;

import android.app.Activity;
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
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TableLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.BeanClass.ProgressResult;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonFormation.ProgressReportJsonFormation;
import nexrise.publication.in.nexrise.JsonParser.ProgressResultJsonParser;
import nexrise.publication.in.nexrise.JsonParser.TaxanomyJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.AddClassFragmentAdapter;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ProgressResultsActivity extends AppCompatActivity implements Constants{
    ArrayList<Classes> section;


    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_progress_results);
        ActionBar actionBar = getSupportActionBar();


        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String jsonString = preferences.getString("classList", null);
        String Class = BASE_URL + API_VERSION_ONE + TAXANOMY ;
        GETUrlConnection url = new GETUrlConnection(this, Class,null) {
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    JSONObject responseJson = new JSONObject(response);
                    JSONArray classesArray = responseJson.getJSONArray("data");
                    Log.v("ClassDetails", "" + response);
                    TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                    StringUtils.classList = classListJsonparser.getClassDetails(classesArray);
                    setUpClassSpinner(StringUtils.classList);
                } catch (JSONException e) {
                    e.printStackTrace();
                    Toast.makeText(ProgressResultsActivity.this, "OOPS! something went wrong", Toast.LENGTH_SHORT).show();
                }
            }
        };
        url.execute();
        setUpSpinner();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle("Progress report");
            actionBar.setElevation(0);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }


    }
    private void setUpClassSpinner(final List<Classes> classList) {
        final Spinner spinner = (Spinner) findViewById(R.id.classSpinner);

        AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(ProgressResultsActivity.this, classList);
        spinner.setAdapter(adapter);

        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                Classes selectedClass = classList.get(position);
                section = selectedClass.getSections();
                Log.v("class9",""+selectedClass.getSections());
                AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(ProgressResultsActivity.this, section);
                final Spinner spinner1 = (Spinner) findViewById(R.id.sectionSpinner);
                spinner1.setAdapter(adapter);
                spinner1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {

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

    private void setUpSpinner() {
        String[] exams = {"Select exam","Overall", "Formative assessment 1", "Formative assessment 2", "Summative assessment 1"};
        final Spinner examSpinner = (Spinner) findViewById(R.id.spinner5);
        final Activity test = this;

        TableLayout tableLayout = (TableLayout)findViewById(R.id.progress_result_table_layout);
        tableLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ProgressResultsActivity.this, GradeActivity.class);
                String spinnerExamName = examSpinner.getSelectedItem().toString();
                Log.v("Current ",spinnerExamName);
                intent.putExtra("Exam",spinnerExamName);
                startActivity(intent);
            }
        });


        final ArrayAdapter<String> arrayAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, exams);
        arrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        examSpinner.setAdapter(arrayAdapter);
        examSpinner.setSelection(getIntent().getIntExtra("Selection", 0));

        examSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String exam = examSpinner.getItemAtPosition(position).toString();
                Log.v("exam ",exam);
                if(exam.equals("Overall")) {

                    ProgressReportJsonFormation jsonFormation = new ProgressReportJsonFormation();
                    JSONObject progressJson = jsonFormation.formJson();
                    ProgressResultJsonParser parser = new ProgressResultJsonParser();
                    List<ProgressResult> progressResultList = parser.parse(progressJson, "Formative assessment 2");

                    ListView listView = (ListView)findViewById(R.id.progress_result_listview);
                    ProgressResultArrayAdapter progressArrayAdapter = new ProgressResultArrayAdapter(ProgressResultsActivity.this, progressResultList);
                    listView.setAdapter(progressArrayAdapter);

                    TextView examName = (TextView)findViewById(R.id.textView20);
                    TextView duration = (TextView)findViewById(R.id.duration);

                    examName.setText("Overall pass percentage" +progressResultList.get(0).getPassPercent());
                    duration.setText(progressResultList.get(0).getDuration());

                    overallListViewClick(listView);

                }
                else if(!exam.equals("Select exam")){

                    ProgressReportJsonFormation jsonFormation = new ProgressReportJsonFormation();
                    JSONObject progressJson = jsonFormation.formJson();
                    ProgressResultJsonParser parser = new ProgressResultJsonParser();
                    List<ProgressResult> progressResultList = parser.parse(progressJson, exam);

                    ListView listView = (ListView)findViewById(R.id.progress_result_listview);
                    ProgressResultArrayAdapter progressArrayAdapter = new ProgressResultArrayAdapter(ProgressResultsActivity.this, progressResultList);
                    listView.setAdapter(progressArrayAdapter);

                    TextView examName = (TextView)findViewById(R.id.textView20);
                    TextView duration = (TextView)findViewById(R.id.duration);

                    examName.setText("Pass percentage" +progressResultList.get(0).getPassPercent());
                    duration.setText(progressResultList.get(0).getDuration());

                    listviewClick(listView);
                }
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {

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

    public void listviewClick(final ListView listView){

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                final ProgressResult progressResult = (ProgressResult) listView.getItemAtPosition(position);
                ImageView table = (ImageView)view.findViewById(R.id.table);
                table.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(ProgressResultsActivity.this, StudentDetailsActivity.class);
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
                        Intent intent = new Intent(ProgressResultsActivity.this, StudentDetailsActivity.class);
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
                        Intent intent = new Intent(ProgressResultsActivity.this, OverallReportActivity.class);
                        intent.putExtra("studentName",progressResult.getName());
                        startActivity(intent);
                    }
                });
                ImageView chart = (ImageView)view.findViewById(R.id.chart);
                chart.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(ProgressResultsActivity.this, OverallReportActivity.class);
                        intent.putExtra("studentName",progressResult.getName());
                        intent.putExtra("Page",1);
                        startActivity(intent);
                    }
                });
            }
        });
    }
}
