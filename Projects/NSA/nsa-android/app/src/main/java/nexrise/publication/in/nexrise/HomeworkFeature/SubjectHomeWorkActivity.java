package nexrise.publication.in.nexrise.HomeworkFeature;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Subject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class SubjectHomeWorkActivity extends AppCompatActivity implements Constants{
    ArrayList<Subject> subjectList = new ArrayList<>();
    ArrayList<Subject> selectedList = new ArrayList<>();
    ArrayList<Subject> newSubjectList;
    ArrayList<Subject> defaultSelectedList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_subject_home_work);

        Intent intent = getIntent();
        String actionBarTitle = intent.getStringExtra("ActionBarTitle");
        selectedList = (ArrayList<Subject>) intent.getSerializableExtra("selectedList");
        defaultSelectedList = (ArrayList<Subject>) intent.getSerializableExtra("selectedList");

        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setTitle(actionBarTitle);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        if(StringUtils.subject == null) {
            String url = BASE_URL + API_VERSION_ONE + SUBJECT;
            Log.v("subject ","response "+url);
            GETUrlConnection getAssignmentTypes = new GETUrlConnection(this, url,null) {
                ProgressBar progressBar = (ProgressBar) findViewById(R.id.loading);
                TextView noContent = (TextView) findViewById(R.id.no_content);

                @Override
                protected void onPreExecute() {
                    super.onPreExecute();
                    progressBar.setVisibility(View.VISIBLE);
                }

                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    progressBar.setVisibility(View.INVISIBLE);
                    try {
                        new StringUtils().checkSession(response);
                        List<Subject> subjectList = subjectparser(response);
                        ListView listView = (ListView) findViewById(R.id.subject_type_listview);
                        SubjectArrayAdapter arrayAdapter = new SubjectArrayAdapter(SubjectHomeWorkActivity.this, R.layout.activity_attendees_layout, subjectList);
                        listView.setAdapter(arrayAdapter);
                        listViewClick(listView);
                    }  catch (SessionExpiredException e) {
                        e.handleException(SubjectHomeWorkActivity.this);
                    }catch (Exception e) {
                        e.printStackTrace();
                        noContent.setVisibility(View.VISIBLE);
                    }
                }
            };
            getAssignmentTypes.execute();
        } else {
            ObjectMapper valuesMapper = new ObjectMapper();
            valuesMapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            try {
                List<Subject> subjectList = valuesMapper.readValue(StringUtils.subject, TypeFactory.collectionType(List.class, Subject.class));
                ListView listView = (ListView) findViewById(R.id.subject_type_listview);
                SubjectArrayAdapter arrayAdapter = new SubjectArrayAdapter(SubjectHomeWorkActivity.this, R.layout.common_listview_layout, subjectList);
                listView.setAdapter(arrayAdapter);
                listViewClick(listView);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                onBackPressed();
                break;
            case R.id.tick:
                Intent intent = new Intent();
                intent.putExtra("Subject",subjectList);
                setResult(RESULT_OK, intent);
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void addSubject(Subject subject) {
        boolean canAdd = true;
        if(subjectList!= null) {
            if(subjectList.size() != 0) {
                for (int i = 0; i < subjectList.size(); i++) {
                    if (subjectList.get(i).getSubjectId().equals(subject.getSubjectId()))
                        canAdd = false;
                }
            } else {
                subjectList.add(subject);
                canAdd = false;
            }
            if(canAdd) subjectList.add(subject);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.add_homework_actionbar, menu);

        return super.onCreateOptionsMenu(menu);
    }

    public void listViewClick(final ListView listView){

        /*listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Subject subject =(Subject) listView.getItemAtPosition(position);
                Intent intent = new Intent();
                intent.putExtra("Subject",subject);
                setResult(RESULT_OK, intent);
                finish();
            }
        });*/
    }

    public void select(Subject subject, String status){
        if(status.equalsIgnoreCase("add")){
            addSubject(subject);
        } else if(status.equalsIgnoreCase("remove")){
            subjectList.remove(subject);
        }
    }

    @Override
    public void onBackPressed() {
        Intent intent = new Intent();
        intent.putExtra("Subject",defaultSelectedList);
        setResult(RESULT_OK, intent);
        finish();
    }

    public ArrayList<Subject> subjectparser(String response) throws Exception{

        newSubjectList = new ArrayList<>();
        JSONObject mainObject = new JSONObject(response);
        JSONArray dataArray = mainObject.getJSONArray(DATA);
        if(dataArray.length() !=0) {
            for (int i = 0; i < dataArray.length(); i++) {
                JSONObject subjectObject = dataArray.getJSONObject(i);
                String subjectId = subjectObject.getString("subjectId");
                String tenantId = subjectObject.getString("tenantId");
                String schoolId = subjectObject.getString("schoolId");
                String subName = subjectObject.getString("subName");
                String subDesc = subjectObject.getString("subDesc");
                String subCode = subjectObject.getString("subCode");
                String status = "";
                if(subjectObject.has("status") && subjectObject.getString("status").equalsIgnoreCase("Active"))
                   status = subjectObject.getString("status");
                else
                    continue;
                boolean checked = false;
                Subject subject = new Subject();
                subject.setSubjectId(subjectId);
                subject.setTenantId(tenantId);
                subject.setSchoolId(schoolId);
                subject.setSubName(subName);
                subject.setSubCode(subCode);
                subject.setSubDesc(subDesc);
                subject.setStatus(status);
                for (int j = 0; j < selectedList.size(); j++) {
                    if (subjectId.equalsIgnoreCase(selectedList.get(j).getSubjectId())) {
                        checked = true;
                        subjectList.add(subject);
                        break;
                    }
                }
                subject.setChecked(checked);
                newSubjectList.add(subject);
            }
        }
        return newSubjectList;
    }
}
