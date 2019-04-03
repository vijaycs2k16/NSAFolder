package nexrise.publication.in.nexrise.EventsFeature;

import android.app.SearchManager;
import android.content.Context;
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
import android.widget.RelativeLayout;
import android.widget.SearchView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Attendee;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

public class AttendeesListActivity extends AppCompatActivity implements Constants {
    AttendeesListArrayAdapter arrayAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_attendees_list);

        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            actionBar.setTitle(R.string.attendees);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        String id = getIntent().getStringExtra("Attendees");
        String url = BASE_URL + API_VERSION_ONE + EVENTS + DETAILS + id;
        Log.v("Detail","Url"+url);
        GETUrlConnection getEvent = new GETUrlConnection(this, url,null) {
            RelativeLayout progressBarLayout = (RelativeLayout)findViewById(R.id.progress_bar);
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.loading_bar);
            TextView noContent = (TextView)findViewById(R.id.no_content);
            @Override
            protected void onPreExecute(){
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }
            @Override
            protected void onPostExecute(final String response) {
                super.onPostExecute(response);
                Log.v("Event ","details "+response);
                progressBar.setVisibility(View.INVISIBLE);
                try {
                    new StringUtils().checkSession(response);
                    progressBarLayout.setVisibility(View.GONE);
                    JSONObject responseObj = new JSONObject(response);
                    JSONObject dataObj = responseObj.getJSONObject("data");
                    ArrayList<Attendee> attendeeList = eventsParser(dataObj.getJSONArray("eventDetails"));
                    arrayAdapter = new AttendeesListArrayAdapter(AttendeesListActivity.this, 0, attendeeList);
                    ListView listView = (ListView)findViewById(R.id.attendees_listview);
                    listView.setAdapter(arrayAdapter);

                } catch (JSONException | NullPointerException  e) {
                    if (progressBarLayout.getVisibility()== View.GONE || progressBarLayout.getVisibility()==View.INVISIBLE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(AttendeesListActivity.this);
                }
            }
        };
        getEvent.execute();


    }
    private ArrayList<Attendee> eventsParser(JSONArray jsonArray) throws JSONException, NullPointerException {
        ArrayList<Attendee> eventDetails = new ArrayList<>();

        for (int i=0; i<jsonArray.length(); i++) {
            Attendee details = new Attendee();
            JSONObject eventObject = jsonArray.getJSONObject(i);
            details.setUserName(eventObject.getString("user_name"));
            details.setEvent_detail_id(eventObject.getString("event_detail_id"));
            details.setFirstName(eventObject.getString("first_name"));
            details.setClassId(eventObject.getString("class_id"));
            details.setClassName(eventObject.getString("class_name"));
            details.setSectionId(eventObject.getString("section_id"));
            details.setSectionName(eventObject.getString("section_name"));
            details.setMandatory(eventObject.getBoolean("is_mandatory"));
            details.setRegistered(Boolean.valueOf(eventObject.getString("is_registered")));
            eventDetails.add(details);
        }


        return eventDetails;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                onBackPressed();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.actionbar, menu);
        final MenuItem menuItem = menu.findItem(R.id.searchbar);
        final android.widget.SearchView searchView = (android.widget.SearchView) menuItem.getActionView();

        SearchManager searchManager = (SearchManager) getSystemService(Context.SEARCH_SERVICE);
        if (searchManager != null) {
            searchView.setSearchableInfo(searchManager.getSearchableInfo(getComponentName()));
        }
        Utility.searchViewHandler(searchView, menuItem);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                search(newText);
                return true;
            }
        });
        return super.onCreateOptionsMenu(menu);
    }
    public void search(String text){
        if(arrayAdapter != null)
            arrayAdapter.getFilter().filter(text);
    }
}
