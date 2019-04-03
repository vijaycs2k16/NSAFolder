package nexrise.publication.in.nexrise.HallOfFame;

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
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.HallOfFame;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class HallOfFameActivity extends AppCompatActivity implements Constants{

    ArrayList<HallOfFame> hallOfFameList;
    ListView listView;
    String userRole;
    HallOfFameArrayAdapter arrayAdapter;
    StringUtils stringUtils = new StringUtils();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hall_of_fame);
        userRole = PreferenceManager.getDefaultSharedPreferences(this).getString(USER_ROLE,null);
        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null) {
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.hall_of_fame);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
        }
        if (userRole.equalsIgnoreCase(EMPLOYEE))
            renderData();
        else
            parentData();
    }

    private void parentData() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(HallOfFameActivity.this);
        String username = preferences.getString(CURRENT_USERNAME,null);
        final String parentHallOfFame = BASE_URL + API_VERSION_ONE + HALL_OF_FAME + "/" +PARENT + "/" + username;
        GETUrlConnection getUrlConnection = new GETUrlConnection(HallOfFameActivity.this,parentHallOfFame,null) {
            ProgressBar progressBar = (ProgressBar) findViewById(R.id.loading_bar);
            TextView noContent = (TextView) findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
                if (noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("hallOfFame","parent"+response);
                progressBar.setVisibility(View.GONE);
                try {
                    stringUtils.checkSession(response);
                    hallOfFameList = hallOfFameParse(response);
                    if (hallOfFameList.size()==0)
                        throw new JSONException("Empty Data");
                    listView = (ListView) findViewById(R.id.hallOfFame_list_view);
                    arrayAdapter = new HallOfFameArrayAdapter(HallOfFameActivity.this,R.layout.hall_of_fame_layout,hallOfFameList);
                    listView.setAdapter(arrayAdapter);
                } catch (JSONException | NullPointerException e) {
                    noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(HallOfFameActivity.this);
                }
            }
        };
        getUrlConnection.execute();
    }

    public void renderData() {
        final String hallOfFame = BASE_URL + API_VERSION_ONE + HALL_OF_FAME + "/" + PUBLISH;
        GETUrlConnection getUrlConnection = new GETUrlConnection(HallOfFameActivity.this,hallOfFame,null) {
            ProgressBar progressBar = (ProgressBar) findViewById(R.id.loading_bar);
            TextView noContent = (TextView) findViewById(R.id.no_content);
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
                Log.v("HallOf","Fame"+response);
                progressBar.setVisibility(View.GONE);
                try {
                    stringUtils.checkSession(response);
                    hallOfFameList = hallOfFameParse(response);
                    if (hallOfFameList.size()==0)
                        throw new JSONException("Empty Data");
                    listView = (ListView) findViewById(R.id.hallOfFame_list_view);
                    arrayAdapter = new HallOfFameArrayAdapter(HallOfFameActivity.this,R.layout.hall_of_fame_layout,hallOfFameList);
                    listView.setAdapter(arrayAdapter);
                    listViewClick(listView);
                } catch (JSONException | NullPointerException e) {
                    noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(HallOfFameActivity.this);
                }
            }
        };
        getUrlConnection.execute();
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

    private void listViewClick(final ListView listView) {
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                HallOfFame hallOfFameData = (HallOfFame) listView.getItemAtPosition(position);
                    Intent intent = new Intent(HallOfFameActivity.this, HallOfFameDetailsActivity.class);
                    Bundle bundle = new Bundle();
                    bundle.putSerializable(NOTIFICATION_OBJECT, hallOfFameData);
                    intent.putExtra(BUNDLE, bundle);
                    startActivity(intent);

            }
        });
    }


    public ArrayList<HallOfFame> hallOfFameParse(String response)throws JSONException, NullPointerException{
        ArrayList<HallOfFame> hallOfFameData = new ArrayList<HallOfFame>();
        JSONObject jsonObject = new JSONObject(response);
        JSONArray data = jsonObject.getJSONArray(DATA);
        for (int i= 0;i<data.length();i++){
            JSONObject object = data.getJSONObject(i);
            String id = "";
            int students = 0;
            if(object.has("id"))
                id = object.getString("id");
            else if(object.has("hall_of_fame_id"))
                id = object.getString("hall_of_fame_id");

            String awardName = object.getString("award_name");
            String dateOfIssue = object.getString("date_of_issue");
            if (object.has("number_of_students"))
                students = object.getInt("number_of_students");
            String description = object.getString("description");

            HallOfFame hallOfFame = new HallOfFame();
            hallOfFame.setId(id);
            hallOfFame.setAward_name(awardName);
            hallOfFame.setDate_of_issue(dateOfIssue);
            hallOfFame.setNumber_of_students(students);
            if (!description.isEmpty() && description != null && !description.equalsIgnoreCase("null"))
                hallOfFame.setDescription(description);
            else
                hallOfFame.setDescription("-");
            hallOfFameData.add(hallOfFame);
        }
        return hallOfFameData;
    }
}
