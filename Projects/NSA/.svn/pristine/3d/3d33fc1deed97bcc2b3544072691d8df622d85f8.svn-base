package nexrise.publication.in.nexrise;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONObject;

import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ContactUsActivity extends AppCompatActivity implements Constants {
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact_us);
        ActionBar actionBar = getSupportActionBar();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle(R.string.contact_us);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        renderData();
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

    private void renderData() {
        String schoolCredentialsURL = BASE_URL + API_VERSION_ONE + SCHOOLS;
        GETUrlConnection getSchoolCredentials = new GETUrlConnection(this, schoolCredentialsURL, null) {
            RelativeLayout progressBarLayout = (RelativeLayout)findViewById(R.id.loading_bar_container);
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.loading_bar);
            TextView noContent = (TextView)findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    new StringUtils().checkSession(response);
                    progressBar.setVisibility(View.INVISIBLE);
                    progressBarLayout.setVisibility(View.GONE);
                    Log.v("CONTACT ","US "+response);
                    JSONObject jsonObject = new JSONObject(response);
                    JSONObject data = jsonObject.getJSONObject(DATA);
                    String aboutUs = data.getString("contact_us");
                    String latitude = data.getString("latitude");
                    String longitude = data.getString("longitude");
                    plotMap(latitude, longitude);
                    if (!aboutUs.equals("null")) {
                        String htmlText = "<html><body> %s </body></Html>";
                        WebView webview = (WebView) findViewById(R.id.contact_us);
                        webview.loadData(String.format(htmlText, aboutUs), "text/html", "utf-8");
                    } else {
                        throw new NullPointerException("No value for ContactUs");
                    }
                } catch (SessionExpiredException e) {
                    e.handleException(ContactUsActivity.this);
                } catch (Exception e) {
                    e.printStackTrace();
                    progressBarLayout.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.INVISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                }
            }
        };
        getSchoolCredentials.execute();
    }

    private void plotMap(final String latitude, final String longitude) {
        MapFragment mapFragment = (MapFragment)this.getFragmentManager().findFragmentById(R.id.contact_us_map);

        if(latitude != null && !latitude.equals("null") && longitude != null && !longitude.equals("null")) {
            mapFragment.getMapAsync(new OnMapReadyCallback() {
                @Override
                public void onMapReady(GoogleMap googleMap) {
                    Double lat = Double.valueOf(latitude);
                    Double lng = Double.valueOf(longitude);
                    LatLng source = new LatLng(lat, lng);
                    googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(source, 15));
                    googleMap.addMarker(new MarkerOptions().position(source).title(SCHOOL_NAME));
                }
            });
        } else {
            LinearLayout mapLinear = (LinearLayout)findViewById(R.id.linear);
            WebView webView = (WebView)findViewById(R.id.contact_us);

            mapLinear.setVisibility(View.GONE);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
            webView.setLayoutParams(params);
        }
    }
}
