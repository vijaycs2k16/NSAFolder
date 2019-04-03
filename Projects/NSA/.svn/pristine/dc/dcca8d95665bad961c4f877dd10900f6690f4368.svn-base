package nexrise.publication.in.nexrise.HomeworkFeature;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.HomeworkType;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class HomeworkTypeActivity extends AppCompatActivity implements Constants{
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_homework_type);

        Intent intent = getIntent();
        String actionBarTitle = intent.getStringExtra("ActionBarTitle");

        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setTitle(actionBarTitle);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        if(intent.hasExtra("HomeworkType") && intent.getSerializableExtra("HomeworkType") != null) {
            ArrayList<HomeworkType> homeworkTypeList = (ArrayList<HomeworkType>)intent.getSerializableExtra("HomeworkType");
            renderListView(homeworkTypeList);
        } else
            fetchData();
    }

    private void fetchData() {
        String url = BASE_URL + API_VERSION_ONE + ASSIGNMENT + TYPES;
        GETUrlConnection getAssignmentTypes = new GETUrlConnection(this, url,null) {
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.loading);
            TextView noContent = (TextView)findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Assignment ","type "+response);
                progressBar.setVisibility(View.INVISIBLE);
                if(response != null) {
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject assignmentTypes = new JSONObject(response);
                        JSONArray data = assignmentTypes.getJSONArray("data");
                        if(data.length() == 0 )
                            throw new JSONException("Empty Json");
                        ObjectMapper valuesMapper = new ObjectMapper();
                        valuesMapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                        List<HomeworkType> homeworkTypeList = valuesMapper.readValue(data.toString(), TypeFactory.collectionType(List.class, HomeworkType.class));
                        renderListView(homeworkTypeList);
                    } catch (JSONException | NullPointerException | IOException e) {
                        e.printStackTrace();
                        noContent.setVisibility(View.VISIBLE);
                    } catch (SessionExpiredException e) {
                        e.handleException(HomeworkTypeActivity.this);
                    }
                } else
                    noContent.setVisibility(View.VISIBLE);
            }
        };
        getAssignmentTypes.execute();
    }

    private void renderListView(List<HomeworkType> homeworkTypeList) {
        ListView listView = (ListView)findViewById(R.id.homework_type_listview);
        HomeworkTypeArrayAdapter arrayAdapter = new HomeworkTypeArrayAdapter(HomeworkTypeActivity.this, R.layout.common_listview_layout, homeworkTypeList);
        listView.setAdapter(arrayAdapter);
        listViewClick(listView);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                Intent intent = new Intent();
                setResult(RESULT_CANCELED, intent);
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    public void listViewClick(final ListView listView){

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                HomeworkType type =(HomeworkType) listView.getItemAtPosition(position);
                Intent intent = new Intent();
                intent.putExtra("Type",type);
                setResult(RESULT_OK, intent);
                Log.v("List ","view "+type);
                finish();
            }
        });
    }

    @Override
    public void onBackPressed() {
        Intent intent = new Intent();
        setResult(RESULT_CANCELED, intent);
        finish();
    }
}
