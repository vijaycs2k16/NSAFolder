package nexrise.publication.in.nexrise.MMS;

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
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.MMS;
import nexrise.publication.in.nexrise.BeanClass.Student;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.Notifications.MyNotificationActivity;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class MyMMSActivity extends AppCompatActivity implements Constants{
    ListView listView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my_mms);
        listView = (ListView)findViewById(R.id.notify);
        ActionBar actionBar = getSupportActionBar();

        StringUtils stringUtils = new StringUtils();
        String userRole = stringUtils.getUserRole(this);

        if(actionBar!= null) {
            actionBar.setTitle("My MMS");
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
        }

        final ImageView help = (ImageView)findViewById(R.id.help);
        TextView customTooltipTitle = (TextView)findViewById(R.id.study_value);
        customTooltipTitle.setText("My MMS");

        if (userRole.equalsIgnoreCase(EMPLOYEE)) {
            stringUtils.customTooltip(MyMMSActivity.this,help,"Voice Notifications & annoucements for schools can created and sent to all or a group of entities. ");
        } else if(userRole.equalsIgnoreCase(PARENT)) {
            stringUtils.customTooltip(MyMMSActivity.this,help,"All important notifications sent by school are listed below.");
        } else {
            stringUtils.customTooltip(MyMMSActivity.this,help,"Stay Alert! Follow ups.");
        }
        renderData();
    }

    private void renderData() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String userId = preferences.getString(CURRENT_USERNAME, "");

        String url = BASE_URL + API_VERSION_ONE + VOICE + MESSAGES + userId;
        GETUrlConnection getAudios = new GETUrlConnection(this, url, null) {
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.notification_loading);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
                listView.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                progressBar.setVisibility(View.GONE);
                Log.v("MMS ","log "+response);
                try {
                    listView.setVisibility(View.VISIBLE);
                    ArrayList<MMS> mmsList = parseMMS(response);
                    MyMMSArrayAdapter adapter = new MyMMSArrayAdapter(MyMMSActivity.this, 0, mmsList);
                    listView.setAdapter(adapter);
                    listviewClick();
                } catch (SessionExpiredException e) {
                    e.handleException(MyMMSActivity.this);
                } catch (JSONException | NullPointerException e) {
                    listView.setVisibility(View.INVISIBLE);
                    TextView emptyListview = (TextView)findViewById(R.id.no_content);
                    emptyListview.setVisibility(View.VISIBLE);
                }
            }
        };
        getAudios.execute();
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                overridePendingTransition(R.anim.left_to_right_anim, R.anim.left_to_right_exit);
                break;
        }
        return super.onOptionsItemSelected(item);
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
            String title = "";
            String fileName = "";

            if(data.has("campaign_name"))
                title = data.getString("campaign_name");

            mms.setFileName(title);

            String downloadLink = "";
            if(data.has("download_link")) {
                downloadLink = data.getString("download_link");

                String[] linkSeperation = downloadLink.split("/");
                fileName = linkSeperation[linkSeperation.length-1];

                downloadLink = downloadLink.replaceAll("\\s", "%20");
            }

            String audioId = "";
            if(data.has("audio_uuid") && data.getString("audio_uuid") != null)
                audioId = data.getString("audio_uuid");

            mms.setAudioId(audioId);
            mms.setPublishedBy(data.getString("updated_username"));
            mms.setSchoolId(data.getString("school_id"));
            mms.setUpdatedDate(data.getString("updated_date"));
            mms.setDownloadLink(downloadLink);

            if(data.has("notified_categories"))
                mms.setNotifiedCategories(data.getString("notified_categories"));

            mms.setStatus(data.getString("status"));
            mms.setId(data.getString("notification_id"));
            mms.setTitle(title);
            mms.setFileName(fileName);

            MyNotificationActivity myNotificationActivity = new MyNotificationActivity();
            ArrayList<Student> selectedStudents = myNotificationActivity.parseStudents(data);
            mms.setStudents(selectedStudents);

            mmslist.add(mms);
        }
        return mmslist;
    }

    private void listviewClick() {

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                MMS mms = (MMS) listView.getItemAtPosition(position);
                String status = mms.getStatus();
                Log.v("status", ""+status);
                if(!status.equals(DRAFT)) {
                    String streamingUrl = AWS_BASE_URL + mms.getSchoolId() + "/" + mms.getDownloadLink();
                    new AudioPlayer().playAudio(streamingUrl, mms.getFileName(), MyMMSActivity.this.getLayoutInflater(), MyMMSActivity.this);
                } else {
                 //   if(notification.isEditPermission()) {
                        Intent intent = new Intent(MyMMSActivity.this, CreateMMSActivity.class);
                        Bundle bundle = new Bundle();
                        bundle.putSerializable(MMS_OBJECT, mms);
                        intent.putExtra(BUNDLE, bundle);
                        intent.putExtra("status", true);
                        startActivityForResult(intent, 1);
                   // } else
                     //   Toast.makeText(MyMMSActivity.this, "You don't have permission to edit this", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == 1 && resultCode == RESULT_OK) {
            renderData();
        }
    }
}
