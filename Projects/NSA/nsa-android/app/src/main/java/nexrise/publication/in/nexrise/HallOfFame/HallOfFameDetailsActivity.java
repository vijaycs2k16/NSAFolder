package nexrise.publication.in.nexrise.HallOfFame;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import nexrise.publication.in.nexrise.BeanClass.Attendee;
import nexrise.publication.in.nexrise.BeanClass.HallOfFame;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


public class HallOfFameDetailsActivity extends AppCompatActivity implements Constants{
    ListView listView;
    String userRole;
    ArrayList<Attendee> hallOfFameList;
    StudentArrayAdapter arrayAdapter;
    StringUtils utils = new StringUtils();
    ProgressBar progressBar;
    TextView noContent;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hall_of_fame_details);
        userRole = PreferenceManager.getDefaultSharedPreferences(this).getString(USER_ROLE,null);
        Intent intent = getIntent();
        Bundle bundle = intent.getBundleExtra(BUNDLE);
        HallOfFame hallOfFame = (HallOfFame) bundle.getSerializable(NOTIFICATION_OBJECT);
        ActionBar actionBar = getSupportActionBar();
        String hallOfFameId = hallOfFame.getId();
        TextView award = (TextView) findViewById(R.id.award_name);
        TextView date = (TextView) findViewById(R.id.date_of_issue);
        TextView desc = (TextView) findViewById(R.id.descrip);
        EditText text = (EditText) findViewById(R.id.text);
        progressBar = (ProgressBar) findViewById(R.id.loading_bar);
        noContent = (TextView) findViewById(R.id.no_content);


        award.setText(hallOfFame.getAward_name());
        date.setText(hallOfFame.getDate_of_issue());
        desc.setText(hallOfFame.getDescription());

        if(actionBar!= null) {
            actionBar.setElevation(0);
            actionBar.setTitle(hallOfFame.getAward_name());
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
        }
        if (userRole.equalsIgnoreCase(EMPLOYEE))
            renderData(hallOfFameId);
        else
            text.setVisibility(View.GONE);
    }

    public void renderData(String hallOfFameId) {

        final String studentList = BASE_URL + API_VERSION_ONE + HALL_OF_FAME + "/" +DETAILS + hallOfFameId ;
        GETUrlConnection getUrlConnection = new GETUrlConnection(HallOfFameDetailsActivity.this,studentList,null) {

            @Override
            protected void onPreExecute(){
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
                if (noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("students","FameList"+response);
                progressBar.setVisibility(View.GONE);
                try {
                    utils.checkSession(response);
                    hallOfFameList = hallOfFameDetailParse(response);
                    listView = (ListView) findViewById(R.id.award_student_list);
                    arrayAdapter = new StudentArrayAdapter(HallOfFameDetailsActivity.this,R.layout.fragment_attendance_leave_list_layout,hallOfFameList);
                    Collections.sort(hallOfFameList, new StudentComparator());
                    listView.setAdapter(arrayAdapter);
                } catch (JSONException | NullPointerException e) {
                    noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(HallOfFameDetailsActivity.this);
                }
            }
        };
        getUrlConnection.execute();
        final EditText editText = (EditText)findViewById(R.id.text);
        editText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                try {
                    s = editText.getText().toString().toLowerCase();
                    arrayAdapter.getFilter().filter(s);
                    Log.v("hallOfFame","count "+arrayAdapter.getCount());
                    if (arrayAdapter.getCount() == 0)
                        noContent.setVisibility(View.VISIBLE);
                    else
                        noContent.setVisibility(View.INVISIBLE);
                } catch (NullPointerException e){
					noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
    }

   public ArrayList<Attendee> hallOfFameDetailParse(String response)throws JSONException, NullPointerException{
        ArrayList<Attendee> hallOfFameData = new ArrayList<Attendee>();
        JSONObject jsonObject = new JSONObject(response);
        JSONArray data = jsonObject.getJSONArray(DATA);
        for (int i= 0;i<data.length();i++){
            JSONObject object = data.getJSONObject(i);
            String name = object.getString("first_name");
            String className = object.getString("class_name");
            String sectionName = object.getString("section_name");

            Attendee students = new Attendee();
            students.setFirstName(name);
            students.setClassName(className);
            students.setSectionName(sectionName);
            hallOfFameData.add(students);
        }
        return hallOfFameData;
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

    public class StudentComparator implements Comparator<Attendee> {
        @Override
        public int compare(Attendee student1, Attendee student2) {
            String student1Name = student1.getFirstName();
            String student2Name = student2.getFirstName();
            return student1Name.trim().compareTo(student2Name.trim());
        }
    }
}
