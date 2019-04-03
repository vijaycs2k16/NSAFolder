package nexrise.publication.in.nexrise.TransportManager;

import android.app.ProgressDialog;
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
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.message.BasicHeader;
import org.json.JSONException;
import org.json.JSONObject;

import nexrise.publication.in.nexrise.BeanClass.Vehicle;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ParentTransportActivity extends AppCompatActivity implements Constants{
    StringUtils stringUtils;
    String userRole;
    TextView driverName;
    TextView driverNo;
    Boolean live = false;
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_parent_transport);
        ActionBar actionBar = getSupportActionBar();
        stringUtils = new StringUtils();
        userRole = stringUtils.getUserRole(this);

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(R.string.transport_management);
            actionBar.setElevation(0);
        }

        Intent intent = getIntent();
        String fromActivity = intent.getStringExtra(FROM);

        if(intent.hasExtra(FROM) && fromActivity.equalsIgnoreCase("TeacherTransportActivity")) {
            Vehicle vehicle = (Vehicle) intent.getSerializableExtra("vehicle");
            renderDataFromBean(vehicle);
        } else
            renderDataFromREST();
    }

    public void renderDataFromBean(final Vehicle vehicle) {
        TextView routeDetails = (TextView)findViewById(R.id.route_details);
        driverName = (TextView)findViewById(R.id.driver_name);
        driverNo = (TextView)findViewById(R.id.ph_no);
        TextView routeNo = (TextView)findViewById(R.id.vehicle_number);
        TextView routeName = (TextView)findViewById(R.id.route_name);
        TextView studentName = (TextView)findViewById(R.id.student_name);

        StringBuilder builder = new StringBuilder();
        if (vehicle.getStops() != null) {
            for (int i = 0; i < vehicle.getStops().size(); i++) {
                builder.append(vehicle.getStops().get(i).getLocation()).append(" ");
            }
        }
        final String vehicleNo = vehicle.getReg_no();
        routeDetails.setText(builder.toString());
        routeNo.setText(vehicle.getReg_no());
        routeName.setText(vehicle.getRoute_name());
        studentName.setVisibility(View.GONE);
        fetchDriverDetails(vehicle.getDriver_id());

        ImageView location = (ImageView) findViewById(R.id.location);
            location.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(vehicle.isActive()) {
                        Intent intent = new Intent(ParentTransportActivity.this, TransportMapActivity.class);
                        intent.putExtra("Vehicle", vehicleNo);
                        startActivity(intent);
                    } else
                        Toast.makeText(ParentTransportActivity.this, R.string.vehicle_not_active, Toast.LENGTH_SHORT).show();
                }
            });
        customTooltip();
    }

    public void renderDataFromREST() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String userId = preferences.getString(CURRENT_USERNAME, null);
        final String name = preferences.getString(FIRST_NAME, null);

        String url = BASE_URL + API_VERSION_ONE + VEHICLEALLOCATION + STUDENT + "/" + userId;
        BasicHeader[] headers = stringUtils.fileUploadHeader(this,TRANSPORT_FEATURE,"");
        GETUrlConnection getUserVehicle = new GETUrlConnection(this, url,headers) {
            RelativeLayout progressBarLayout = (RelativeLayout)findViewById(R.id.loading_bar_container);
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.loading_bar);
            TextView noContent = (TextView)findViewById(R.id.no_content);
            ProgressDialog progressDialog = new ProgressDialog(ParentTransportActivity.this);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                if (response != null) {
                    try {
                        progressDialog.dismiss();
                        stringUtils.checkSession(response);
                        Log.v("Transport ", "resposne " + response);
                        JSONObject jsonObject = new JSONObject(response);
                        boolean success = jsonObject.getBoolean(SUCCESS);
                        if (success) {
                            JSONObject data = jsonObject.getJSONObject(DATA);
                            final String regNo = data.getString("reg_no");
                            String pickupLocationStr = data.getString("pickup_location");
                            JSONObject pickupLocation = new JSONObject(pickupLocationStr);
                            JSONObject vehicle = data.getJSONObject("vehicle");
                            if (vehicle.has("active"))
                                live = vehicle.getBoolean("active");
                            JSONObject route = data.getJSONObject("route");
                            String routeName = route.getString("route_name");
                            JSONObject driver = data.getJSONObject("driver");
                            String driverNames = driver.getString("driver_name");
                            String driverPhone = driver.getString("driver_phone");

                            setContentView(R.layout.activity_parent_transport);
                            TextView routeDetails = (TextView) findViewById(R.id.route_details);
                            TextView driverName = (TextView) findViewById(R.id.driver_name);
                            TextView driverNo = (TextView) findViewById(R.id.ph_no);
                            TextView studentName = (TextView) findViewById(R.id.student_name);
                            TextView routName = (TextView) findViewById(R.id.route_name);
                            TextView regNum = (TextView) findViewById(R.id.vehicle_number);

                            studentName.setText(value(name));
                            routeDetails.setText(pickupLocation.getString("location"));
                            driverName.setText(value(driverNames));
                            driverNo.setText(value(driverPhone));
                            regNum.setText(value(regNo));
                            routName.setText(value(routeName));

                            ImageView location = (ImageView) findViewById(R.id.location);
                            location.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    if (live) {
                                        Intent intent = new Intent(ParentTransportActivity.this, TransportMapActivity.class);
                                        intent.putExtra("Vehicle", regNo);
                                        startActivity(intent);
                                    } else {
                                        Toast.makeText(ParentTransportActivity.this, R.string.vehicle_not_active, Toast.LENGTH_SHORT).show();
                                    }
                                }
                            });
                            customTooltip();
                        } else {
                            noContent.setVisibility(View.VISIBLE);
                        }
                    } catch (SessionExpiredException e) {
                        e.handleException(ParentTransportActivity.this);
                    } catch (Exception e) {
                        if (progressBarLayout.getVisibility() == View.GONE)
                            progressBarLayout.setVisibility(View.VISIBLE);
                        noContent.setVisibility(View.VISIBLE);
                    }
                }
            }
        };
        getUserVehicle.execute();
    }

    private void fetchDriverDetails(String driverId) {
        String url = BASE_URL + API_VERSION_ONE + DRIVER + driverId;
        GETUrlConnection driverDetails = new GETUrlConnection(this, url, null) {
            RelativeLayout progressBarLayout = (RelativeLayout)findViewById(R.id.progress_bar);
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.loading_bar);
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
                progressBar.setVisibility(View.GONE);
                progressBarLayout.setVisibility(View.GONE);
                try {
                    stringUtils.checkSession(response);
                    JSONObject jsonObject = new JSONObject(response);
                    JSONObject data = jsonObject.getJSONObject(DATA);
                    String driver_name = data.getString("driver_name");
                    String driver_no = data.getString("driver_phone");
                    driverNo.setText(driver_no);
                    driverName.setText(driver_name);
                } catch (JSONException | NullPointerException e) {
                    driverNo.setText(" - ");
                    driverName.setText(" - ");
                } catch (SessionExpiredException e) {
                    e.handleException(ParentTransportActivity.this);
                }
            }
        };
        driverDetails.execute();
    }

    public void customTooltip(){

        final ImageView help = (ImageView)findViewById(R.id.help);
        if (userRole.equalsIgnoreCase(TEACHER)) {
            stringUtils.customTooltip(this,help,(String) getResources().getText(R.string.teacher_transport));

        } else if(userRole.equalsIgnoreCase(PARENT)){
            stringUtils.customTooltip(this,help, (String) getResources().getText(R.string.parent_transport));

        } else {
            stringUtils.customTooltip(this,help,(String) getResources().getText(R.string.emp_transport));
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
    public String value(String string){
        String value = " - ";
        if(string.equals("null")){
            value = " - ";
        } else {
            value = string;
        }
        return value;
    }

}
