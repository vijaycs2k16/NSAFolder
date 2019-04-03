package nexrise.publication.in.nexrise.FeeManagement;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.BeanClass.FeeManagement;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.FeesManagementJsonParser;
import nexrise.publication.in.nexrise.JsonParser.TaxanomyJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.AddClassFragmentAdapter;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class FeeManagementEmployeeActivity extends AppCompatActivity implements Constants{
    View view;
    ArrayList<FeeManagement> dueFeeList;
    ArrayList<Classes> classList;
    ArrayList<Classes> section;
    ListView listView;
    String  sectionId;
    String classid;
    String notesClassId;
    String notesSectionId;
    String fromDate = "";
    String toDate = "";
    EditText reason;
    TextView from;
    TextView to;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
       setContentView(R.layout.fragment_fee);
        String Class = BASE_URL + API_VERSION_ONE + TAXANOMY ;
        Intent intent = getIntent();
        TextView textView = (TextView) findViewById(R.id.study_value);
            textView.setText(R.string.fee_defaulters);
            GETUrlConnection url = new GETUrlConnection(this, Class,null) {
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject responseJson = new JSONObject(response);
                        JSONArray classesArray = responseJson.getJSONArray("data");
                        Log.v("ClassDetails", "" + response);
                        TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                        StringUtils.classList = classListJsonparser.getClassDetails(classesArray);
                        Log.v("vlass List", "" + classList);
                        setUpClassSpinner(StringUtils.classList);
                    } catch (JSONException |NullPointerException e) {
                        e.printStackTrace();
                        Toast.makeText(FeeManagementEmployeeActivity.this, R.string.oops, Toast.LENGTH_SHORT).show();
                    } catch (SessionExpiredException e) {
                        e.handleException(FeeManagementEmployeeActivity.this);
                    }
                }
            };
            url.execute();
        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.fee_management);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        final ImageView help = (ImageView)findViewById(R.id.help);
        new StringUtils().customTooltip(FeeManagementEmployeeActivity.this,help, (String) getResources().getText(R.string.emp_fee));
    }

    private void setUpClassSpinner(final List<Classes> classList) {
        final Spinner spinner = (Spinner) findViewById(R.id.classspin);

        final List<Classes> classesWithNone = new StringUtils().insertNoneIntoClassSectionSpinner(classList);
        AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(FeeManagementEmployeeActivity.this, classesWithNone);
        spinner.setAdapter(adapter);

        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                classid = classesWithNone.get(position).getId();
                Log.v("class_id","current "+classid);
                final Classes selectedClass = classesWithNone.get(position);
                section = selectedClass.getSections();
                Log.v("class9",""+selectedClass.getSections());
                AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(FeeManagementEmployeeActivity.this, section);
                final Spinner spinner1 = (Spinner) findViewById(R.id.section_spin);
                spinner1.setAdapter(adapter);
                spinner1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                        sectionId = section.get(position).getId();
                        Log.v("section_id", "current" + sectionId);
                        if (sectionId != null) {
                            String feecrendential = BASE_URL + API_VERSION_ONE + FEE + DETAILS + classid + "/" + sectionId;
                            Log.v("teacher Fee", "Url" + feecrendential);
                            GETUrlConnection GETUrlConnection = new GETUrlConnection(FeeManagementEmployeeActivity.this, feecrendential,null) {
                                RelativeLayout progressBarLayout = (RelativeLayout) findViewById(R.id.progress_bar);
                                ProgressBar progressBar = (ProgressBar) findViewById(R.id.loading_bar);
                                TextView noContent = (TextView) findViewById(R.id.no_content);
                                @Override
                                protected void onPreExecute() {
                                    super.onPreExecute();
                                    progressBarLayout.setVisibility(View.VISIBLE);
                                    progressBar.setVisibility(View.VISIBLE);
                                    if (noContent.getVisibility() == View.VISIBLE)
                                        noContent.setVisibility(View.INVISIBLE);
                                }

                                @Override
                                protected void onPostExecute(String response) {
                                    super.onPostExecute(response);
                                    Log.v("RESPONSE ", " " + response);
                                    progressBar.setVisibility(View.INVISIBLE);
                                    try {
                                        new StringUtils().checkSession(response);
                                        progressBarLayout.setVisibility(View.GONE);
                                        Log.v("TeacherFee", "" + response);
                                        FeesManagementJsonParser feesManagementJsonParser = new FeesManagementJsonParser();
                                        feesManagementJsonParser.getFeeDetails(response);
                                        listView = (ListView) findViewById(R.id.fee_defaulters_listview);
                                        dueFeeList = FeesManagementJsonParser.dueFeeList;
                                        if(dueFeeList.size() == 0)
                                            throw new JSONException("Empty data");
                                        Collections.sort(dueFeeList, new feeComparator());
                                        FeeDefaultersArrayAdapter arrayAdapter = new FeeDefaultersArrayAdapter(FeeManagementEmployeeActivity.this, dueFeeList);
                                        listView.setAdapter(arrayAdapter);
                                        listviewClick(listView);

                                    } catch (JSONException | NullPointerException e) {
                                        e.printStackTrace();
                                        if (progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() == View.INVISIBLE)
                                            progressBarLayout.setVisibility(View.VISIBLE);
                                        noContent.setVisibility(View.VISIBLE);
                                    } catch (SessionExpiredException e) {
                                        e.handleException(FeeManagementEmployeeActivity.this);
                                    }
                                }
                            };
                            GETUrlConnection.execute();
                            Log.v("Spinner ", " " + sectionId);
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
    private class feeComparator implements Comparator<FeeManagement>{

        @Override
        public int compare(FeeManagement o1, FeeManagement o2) {
            return o1.getfirstName().trim().compareTo(o2.getfirstName().trim());
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        //startActivityForResult(dueTimeActivity, 3);
        if (requestCode == 2 || requestCode == 4) {
            if (data.getIntExtra("Date", 0) != 0) {
                fromDate = data.getIntExtra("Date", 0) + "/" + data.getIntExtra("Month", 0) + "/" + data.getIntExtra("Year", 0);
                from.setText(new StringUtils().DisplayDate(fromDate));
            }
            Log.v("On activity ", "result Due date " + data.getIntExtra("Date", 0));
            Log.v("On activity ", "result Due month " + data.getIntExtra("Month", 0));
            Log.v("On activity ", "result Due year " + data.getIntExtra("Year", 0));
        }

        if (requestCode == 3 || requestCode == 5) {
            if (data.getIntExtra("Date", 0) != 0) {
                toDate = data.getIntExtra("Date", 0) + "/" + data.getIntExtra("Month", 0) + "/" + data.getIntExtra("Year", 0);
                to.setText(new StringUtils().DisplayDate(toDate));
            }
            Log.v("On activity ", "result Due date " + data.getIntExtra("Date", 0));
            Log.v("On activity ", "result Due month " + data.getIntExtra("Month", 0));
            Log.v("On activity ", "result Due year " + data.getIntExtra("Year", 0));
        }
    }

    public void listviewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                FeeManagement feeDefaulters = (FeeManagement) listView.getItemAtPosition(position);
                Intent intent = new Intent(FeeManagementEmployeeActivity.this, FeeDefaultersDetailsActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable("FeeDefaulters",feeDefaulters);
                intent.putExtra("bundle",bundle);
                startActivity(intent);
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
}
