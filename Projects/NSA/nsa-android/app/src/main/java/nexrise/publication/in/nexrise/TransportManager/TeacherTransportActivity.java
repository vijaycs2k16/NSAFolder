package nexrise.publication.in.nexrise.TransportManager;

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
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Stops;
import nexrise.publication.in.nexrise.BeanClass.Vehicle;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class TeacherTransportActivity extends AppCompatActivity implements Constants {
    ListView listView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_teacher_transport);
        listView = (ListView)findViewById(R.id.routes_listview);
        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(R.string.transport_management);
            actionBar.setElevation(0);
        }
        renderData();
    }

    public void renderData() {

        String url = BASE_URL + API_VERSION_ONE + ROUTE;
        GETUrlConnection getAllRoutes = new GETUrlConnection(this, url,null) {
            RelativeLayout progressBarLayout = (RelativeLayout)findViewById(R.id.progress_bar);
            ProgressBar progressBar = (ProgressBar) findViewById(R.id.loading_bar);
            TextView noContent = (TextView)findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                if(progressBarLayout.getVisibility() == View.GONE)
                    progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                progressBar.setVisibility(View.INVISIBLE);
                progressBarLayout.setVisibility(View.GONE);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject jsonObject = new JSONObject(response);
                    JSONArray data = jsonObject.getJSONArray(DATA);

                    ArrayList<Vehicle> vehicleList = vehicleParser(data);
                    TeacherTransportArrayAdapter arrayAdapter = new TeacherTransportArrayAdapter(TeacherTransportActivity.this, 0, vehicleList);
                    listView.setAdapter(arrayAdapter);
                    listviewClick();
                } catch (JSONException | NullPointerException e) {
                    if(progressBarLayout.getVisibility() == View.GONE )
                        progressBarLayout.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.INVISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(TeacherTransportActivity.this);
                }
            }
        };
        getAllRoutes.execute();
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

    private ArrayList<Vehicle> vehicleParser(JSONArray dataAry) throws JSONException, NullPointerException {
        ArrayList<Vehicle> vehicleList = new ArrayList<>();
        if(dataAry.length() == 0)
            throw new JSONException("Empty json array");
        for(int i=0; i<dataAry.length(); i++) {
            Vehicle vehicle = new Vehicle();
            JSONObject dataObj = dataAry.getJSONObject(i);
            String regNo = dataObj.getString("reg_no");
            String routeName = dataObj.getString("route_name");
            String driverId = dataObj.getString("driver_id");
            JSONObject vehicleObj = dataObj.getJSONObject("vehicle");
            boolean active = false;
            if(vehicleObj.has("active"))
                active = vehicleObj.getBoolean("active");
            vehicle.setReg_no(regNo);
            vehicle.setRoute_name(routeName);
            vehicle.setDriver_id(driverId);
            vehicle.setActive(active);

            JSONArray stops = dataObj.getJSONArray("stops");
            ArrayList<Stops> stopsList = new ArrayList<>();
            for(int j=0; j<stops.length(); j++) {
                Stops stop = new Stops();
                JSONObject stopsObj = stops.getJSONObject(j);
                String location = stopsObj.getString("location");
                stop.setLocation(location);
                stopsList.add(stop);
            }
            vehicle.setStops(stopsList);
            vehicleList.add(vehicle);
        }
        return vehicleList;
    }

    public void listviewClick() {
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Vehicle vehicle = (Vehicle)listView.getItemAtPosition(position);
                Log.v("Vehicle ","active "+vehicle.isActive());
                Intent intent = new Intent(TeacherTransportActivity.this, ParentTransportActivity.class);
                intent.putExtra(FROM, "TeacherTransportActivity");
                intent.putExtra("vehicle", vehicle);
                startActivity(intent);
            }
        });
    }
}
