package nexrise.publication.in.nexrise.TransportManager;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PolylineOptions;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Timer;
import java.util.TimerTask;

import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class TransportMapActivity extends AppCompatActivity implements OnMapReadyCallback, Constants {
    PolylineOptions polyLine;
    int vehicle = 0;
    Timer timer = new Timer();
    Marker marker;
    String regNo = null;
    Intent intent;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_teacher_transport_map);

        MapFragment mapFragment = (MapFragment) this.getFragmentManager().findFragmentById(R.id.mapFragment);
        mapFragment.getMapAsync(this);
        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.location);
        }
        intent = getIntent();
        if(intent.hasExtra("Vehicle"))
            regNo = intent.getStringExtra("Vehicle");
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

    @Override
    public void onMapReady(GoogleMap googleMap) {
        polyLine = new PolylineOptions();

        if(regNo != null)
            addMarker(googleMap);
        else if (intent.hasExtra("Latitude")) {
            Double latitude = intent.getDoubleExtra("Latitude", 0);
            Double longitude = intent.getDoubleExtra("Longitude", 0);
            String address = intent.getStringExtra("Address");
            addMarker(latitude, longitude, address, googleMap);
        }
    }

    public void addMarker(Double latitude, Double longitude, String address, final GoogleMap googleMap) {
        LatLng latLng = new LatLng(latitude, longitude);
        googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(latLng, 12));
        MarkerOptions markerOptions = new MarkerOptions();
        markerOptions.position(latLng);
        googleMap.addMarker(markerOptions).setTitle(address);
    }

    public void addMarker(final GoogleMap googleMap) { // This method is used for tracking a vehicle
        //String url = "http://192.168.0.107:9090/vehicleinfo/" + vehicle;
        String url = BASE_URL + API_VERSION_ONE + TRACKING + regNo;
        GETUrlConnection trackVehicle = new GETUrlConnection(TransportMapActivity.this, url,null) {
            ProgressDialog progressDialog = new ProgressDialog(TransportMapActivity.this);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressDialog.setMessage(getResources().getText(R.string.fetching_vehicle_info));
                progressDialog.setCancelable(false);
                progressDialog.setCanceledOnTouchOutside(false);
                progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
                progressDialog.show();
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Transport ", " timer "+ response);
                try {
                    progressDialog.dismiss();
                    new StringUtils().checkSession(response);
                    JSONObject json = new JSONObject(response);
                    JSONObject data = json.getJSONObject(DATA);
                    String lattitude = data.getString("latitude");
                    String longitude = data.getString("longitude");
                    Double lat = Double.parseDouble(lattitude);
                    Double lng = Double.parseDouble(longitude);
                    LatLng latLng = new LatLng(lat, lng);

                    googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(latLng, 12));
                    MarkerOptions markerOptions = new MarkerOptions();
                    markerOptions.position(latLng);
                    marker = googleMap.addMarker(markerOptions);
                    googleMap.addPolyline(polyLine);
                    liveTracking(googleMap);
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                    Toast.makeText(TransportMapActivity.this, R.string.cant_fetch_vehicle_info, Toast.LENGTH_SHORT).show();
                } catch (SessionExpiredException e) {
                    e.handleException(TransportMapActivity.this);
                }
            }
        };
        trackVehicle.execute();
    }

    public void liveTracking(final GoogleMap googleMap) {
        final android.os.Handler handler = new android.os.Handler();
        final TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                       //String url = "http://192.168.0.107:9090/vehicleinfo/" + vehicle;
                        String url = BASE_URL + API_VERSION_ONE + TRACKING + regNo;
                       /* if (vehicle < 74) {*/
                            GETUrlConnection trackVehicle = new GETUrlConnection(TransportMapActivity.this, url,null) {
                                @Override
                                protected void onPostExecute(String response) {
                                    super.onPostExecute(response);
                                    Log.v("Transport ", " timer "+ response);
                                    try {
                                        if (response != null) {
                                            new StringUtils().checkSession(response);
                                            JSONObject json = new JSONObject(response);
                                            JSONObject data = json.getJSONObject(DATA);
                                            if (!data.isNull("latitude") && !data.isNull("longitude")) {
                                                String lattitude = data.getString("latitude");
                                                String longitude = data.getString("longitude");
                                                Double lat = Double.parseDouble(lattitude);
                                                Double lng = Double.parseDouble(longitude);
                                                LatLng latLng = new LatLng(lat, lng);

                                                polyLine.add(latLng);
                                                polyLine.width(5);
                                                polyLine.color(Color.GRAY);
                                                polyLine.geodesic(true);
                                                marker.setPosition(latLng);
                                                googleMap.addPolyline(polyLine);
                                                timer.purge();
                                            }
                                        }
                                    } catch (JSONException | NullPointerException e) {
                                        timer.cancel();
                                        e.printStackTrace();
                                    } catch (SessionExpiredException e) {
                                        timer.cancel();
                                        e.handleException(TransportMapActivity.this);
                                    }
                                }
                            };
                        trackVehicle.execute();
                    /*} else {
                            timer.cancel();
                            Toast.makeText(TransportMapActivity.this, "Fetching completed", Toast.LENGTH_SHORT).show();
                        }*/
                    }
                });
            }
        };
        timer.schedule(timerTask, 2000, 5000);
        timerTask.run();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        timer.cancel();
    }
}
