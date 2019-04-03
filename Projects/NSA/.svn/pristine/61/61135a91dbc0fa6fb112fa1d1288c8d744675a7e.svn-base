package nexrise.publication.in.nexrise.MMS;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.MMS;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class AudioGalleryActivity extends AppCompatActivity implements Constants {

    ListView listView;
    MMS mms = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.notification_log);
        listView = (ListView)findViewById(R.id.notify);
        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            actionBar.setElevation(0);
            actionBar.setTitle("Audio Gallery");
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
        }

        final ImageView help = (ImageView)findViewById(R.id.help);
        TextView customTooltipTitle = (TextView)findViewById(R.id.study_value);
        customTooltipTitle.setText("Audio Gallery");
        StringUtils stringUtils = new StringUtils();
        stringUtils.customTooltip(AudioGalleryActivity.this,help,"Schools can upload their audio in web and it can be viewed here");

        LinearLayout moreOptions = (LinearLayout)findViewById(R.id.more_options);
        moreOptions.setVisibility(View.INVISIBLE);
        renderData();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.add_homework_actionbar, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                overridePendingTransition(R.anim.left_to_right_anim, R.anim.left_to_right_exit);
                break;
            case R.id.tick:
                if(mms != null && mms.getStatus() != null) {
                    if(mms.getStatus().toLowerCase().contains("approved")) {
                        Intent callback = new Intent();

                        callback.putExtra("AudioFilePath", mms.getDownloadLink());
                        callback.putExtra("AudioFileName", mms.getFileName());
                        callback.putExtra("AudioId", mms.getAudioId());
                        setResult(RESULT_OK, callback);
                        finish();
                    } else
                        Toast.makeText(this, "Please select an approved audio ", Toast.LENGTH_SHORT).show();
                } else
                    Toast.makeText(this, "Status unknown ", Toast.LENGTH_SHORT).show();
        }
        return super.onOptionsItemSelected(item);
    }

    private void renderData() {
        String url = BASE_URL + API_VERSION_ONE + VOICE + DEVICE + AUDIOS;
        GETUrlConnection getAudios = new GETUrlConnection(this, url, null) {
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.notification_loading);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                progressBar.setVisibility(View.GONE);
                Log.v("MMS ","log "+response);
                try {
                    ArrayList<MMS> mmsList = parseMMS(response);
                    AudioGalleryArrayAdapter adapter = new AudioGalleryArrayAdapter(AudioGalleryActivity.this, mmsList);
                    listView.setAdapter(adapter);
                } catch (SessionExpiredException e) {
                    e.handleException(AudioGalleryActivity.this);
                } catch (JSONException | NullPointerException e) {
                    TextView emptyListview = (TextView)findViewById(R.id.no_content);
                    emptyListview.setVisibility(View.VISIBLE);
                }
            }
        };
        getAudios.execute();
    }

    public ArrayList<MMS> parseMMS(String response) throws JSONException, NullPointerException {
        JSONObject responseJson = new JSONObject(response);
        JSONArray dataAry = responseJson.getJSONArray(DATA);
        if(dataAry.length() == 0)
            throw new JSONException("Empty JSON");

        ArrayList<MMS> mmslist = new ArrayList<>();

        for (int i=0; i<dataAry.length(); i++) {
            JSONObject data = dataAry.getJSONObject(i);
            MMS mms = new MMS();
            mms.setFileName(data.getString("name"));
            mms.setAudioId(data.getString("audio_id"));
            mms.setPublishedBy(data.getString("updated_username"));
            mms.setSchoolId(data.getString("school_id"));
            mms.setUpdatedDate(data.getString("updated_date"));

            if(data.has("status"))
                mms.setStatus(data.getString("status"));

            String downloadLink = data.getString("download_link").replaceAll("\\s", "%20");
            mms.setDownloadLink(downloadLink);
            mmslist.add(mms);
        }
        return mmslist;
    }

    public void selectedObject(MMS mms) {
        this.mms = mms;
    }
}
