package nexrise.publication.in.nexrise;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONObject;

import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class AboutUsActivity extends AppCompatActivity implements Constants{

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about_us);
        ActionBar actionBar = getSupportActionBar();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle(R.string.about_us);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        ImageView aboutUsImg = (ImageView)findViewById(R.id.about_us_img);
        if(ACCESS_ID.equals(BHASHYAM_ACCESS_ID)) {
            aboutUsImg.setBackgroundResource(R.drawable.about_us);
            final float scale = getResources().getDisplayMetrics().density;
            int pixel = (int) (150 * scale + 0.5f);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(pixel, ViewGroup.LayoutParams.MATCH_PARENT);
            aboutUsImg.setLayoutParams(params);
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

    private class Callback extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(
                WebView view, String url) {
            return (false);
        }
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
                Log.v("about_us","about_us " +response);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject jsonObject = new JSONObject(response);
                        JSONObject data = jsonObject.getJSONObject(DATA);
                        String aboutUs = data.getString("about_us");
                        if (!aboutUs.equals("null")) {
                            String htmlText = "<html><body style=\"text-align:justify\"> %s </body></Html>";
                            WebView webview = (WebView) findViewById(R.id.about_us);
                            webview.loadData(String.format(htmlText, aboutUs), "text/html", "utf-8");
                            progressBar.setVisibility(View.INVISIBLE);
                            progressBarLayout.setVisibility(View.GONE);
                        } else {
                            throw new NullPointerException("No value for AboutUs");
                        }
                    } catch (SessionExpiredException e) {
                        e.handleException(AboutUsActivity.this);
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
}
