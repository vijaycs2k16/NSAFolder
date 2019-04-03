package nexrise.publication.in.nexrise.EventsFeature;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.SearchView;
import android.widget.TextView;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.PastEventObject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class PastEventsActivity extends AppCompatActivity implements Constants {

    PastEventsArrayAdapter arrayAdapter;
    ArrayList<PastEventObject> pastEventObjects;
    ArrayList<PastEventObject> pastEventsList = new ArrayList<PastEventObject>();
    Boolean date = false;
    String pastEvencredential;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_past_events);
        final String from = getIntent().getStringExtra("selected");
        date = getIntent().getBooleanExtra("Date",false);
        if (date){
            pastEvencredential = BASE_URL + API_VERSION_ONE + EVENTS + from;
        } else {
            pastEvencredential = BASE_URL + API_VERSION_ONE + EVENTS + PAST;
            Log.v("Past",""+pastEvencredential);
        }
        Log.v("past",""+pastEvencredential);
        GETUrlConnection pastEventUrl = new GETUrlConnection(PastEventsActivity.this,pastEvencredential,null){
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
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("response","past"+response);
                progressBar.setVisibility(View.INVISIBLE);

                progressBarLayout.setVisibility(View.GONE);
                Log.v("attendanceData","response"+ response);
                JSONObject jsonObject = null;

                try {
                    new StringUtils().checkSession(response);
                    jsonObject = new JSONObject(response);
                    JSONArray data = jsonObject.getJSONArray(DATA);
                    if (data.length() != 0) {
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                        pastEventObjects = mapper.readValue(data.toString(), TypeFactory.collectionType(List.class, PastEventObject.class));
                       // generateData(pastEventObjects);
                        Collections.sort(pastEventObjects,new DateComparator());
                        if (date)
                            pastEventsList = datelist(pastEventObjects);
                        else
                            pastEventsList = generateData(pastEventObjects);

                        final ListView listView = (ListView)findViewById(R.id.past_events_listview);
                        arrayAdapter = new PastEventsArrayAdapter(PastEventsActivity.this, pastEventsList);
                        listView.setAdapter(arrayAdapter);
                        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                            @Override
                            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                                PastEventObject pastEventObject = (PastEventObject) listView.getItemAtPosition(position);
                                Intent intent = new Intent(PastEventsActivity.this,EventDetailsActivity.class);
                                if (date){
                                    intent.putExtra("Actionbar title", "Event Details");
                                    intent.putExtra("From", "Event List");
                                } else {
                                    intent.putExtra("Actionbar title", PAST_EVENT_DETAILS);
                                    intent.putExtra("From", "pastEvent");
                                }
                                intent.putExtra("PastObject",pastEventObject);
                                startActivity(intent);
                            }
                        });

                    } else
                        throw new JSONException("Data Array Empty");
                } catch (JSONException |IOException | NullPointerException e) {
                    if (progressBarLayout.getVisibility()== View.GONE || progressBarLayout.getVisibility()==View.INVISIBLE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(PastEventsActivity.this);
                }
            }
        };
        pastEventUrl.execute();
        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            if (date)
                actionBar.setTitle(R.string.event_list);
            else
                actionBar.setTitle(R.string.event_list);

            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
    }

    public  ArrayList<PastEventObject>  generateData(ArrayList<PastEventObject> pastEventObjects) {
        String tagName = new StringUtils().monthSet(pastEventObjects.get(0).getStartDate());
        pastEventObjects.get(0).setTagName(tagName);
        for (int i = 1; i < pastEventObjects.size(); i++) {
            PastEventObject pastEventObject = pastEventObjects.get(i);

            if (new StringUtils().monthSet(pastEventObject.getEndDate()).equals(tagName)) {
                pastEventObject.setTagName("null");
            } else {
                tagName = new StringUtils().monthSet(pastEventObject.getStartDate());
                pastEventObject.setTagName(tagName);
            }
        }
        return pastEventObjects;
    }

    public  ArrayList<PastEventObject>  datelist(ArrayList<PastEventObject> pastEventObjects) {
        String tagName = new StringUtils().monthSet(pastEventObjects.get(0).getEndDate());
        pastEventObjects.get(0).setTagName(tagName);
        for (int i = 1; i < pastEventObjects.size(); i++) {
            PastEventObject pastEventObject = pastEventObjects.get(i);
                pastEventObject.setTagName("null");
        }
        return pastEventObjects;

    }

    public class DateComparator implements Comparator<PastEventObject>{

        @Override
        public int compare(PastEventObject o1, PastEventObject o2) {
            Date firstDate = new StringUtils().convertStringToDate(new StringUtils().Dateset(o1.getEndDate()));
            Date secondDate = new StringUtils().convertStringToDate(new StringUtils().Dateset(o2.getEndDate()));
            return firstDate.compareTo(secondDate);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.actionbar, menu);
        final MenuItem menuItem = menu.findItem(R.id.searchbar);
        final android.widget.SearchView searchView = (android.widget.SearchView) menuItem.getActionView();
        SearchManager searchManager = (SearchManager)getSystemService(Context.SEARCH_SERVICE);
        if(searchManager != null) {
            searchView.setSearchableInfo(searchManager.getSearchableInfo(getComponentName()));
        }
        Utility.searchViewHandler(searchView,menuItem);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                if(arrayAdapter != null)
                    arrayAdapter.getFilter().filter(newText);
                return true;
            }
        });
        return super.onCreateOptionsMenu(menu);
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
