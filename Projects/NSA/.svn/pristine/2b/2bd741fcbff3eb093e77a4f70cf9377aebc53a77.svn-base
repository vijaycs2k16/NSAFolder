package nexrise.publication.in.nexrise.MMS;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.UUID;

import nexrise.publication.in.nexrise.BeanClass.MMS;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class ReceivedMMSActivity extends AppCompatActivity implements Constants{
    ListView listView;
    public static Boolean clicked = false;
    FloatingActionButton createMMS;
    FloatingActionButton moreOptions;
    FloatingActionButton createdMMS;
    FloatingActionButton uploadAudio;
    LinearLayout moreOptionsLayout;
    LinearLayout createMMSLayout;
    LinearLayout uploadAudioLayout;
    LinearLayout myMMSLayout;
    RelativeLayout whiteback;
    RelativeLayout headback;
    StringUtils stringUtils;
    String userRole;
    Boolean activityVisible = true;
    Boolean dataRendered = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_received_mms);
        listView = (ListView)findViewById(R.id.notify);
        ActionBar actionBar = getSupportActionBar();
        clicked = false;
        init();
        activityVisible = true;

        if(actionBar!= null) {
            actionBar.setTitle("MMS");
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
        }
        renderData();

        dataRendered = true;
        //If the user is not employee then he will not have permission to create notification so we are simply hiding the FloatingActionButton
        if(!userRole.equalsIgnoreCase(EMPLOYEE)) {
            moreOptionsLayout.setVisibility(View.INVISIBLE);
        }
        moreOptions.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                floatingActionButtonClick();
            }
        });
        final ImageView help = (ImageView)findViewById(R.id.help);
        TextView customTooltipTitle = (TextView)findViewById(R.id.study_value);
        customTooltipTitle.setText("RECEIVED MMS");

        if (userRole.equalsIgnoreCase(EMPLOYEE)) {
            stringUtils.customTooltip(ReceivedMMSActivity.this,help,"Voice Notifications & annoucements for schools can created and sent to all or a group of entities. You can view voice messages created by you under \"My MMS\"");
        } else if(userRole.equalsIgnoreCase(PARENT)) {
            stringUtils.customTooltip(ReceivedMMSActivity.this,help,"All important voice notifications sent by school are listed below.");
        } else {
            stringUtils.customTooltip(ReceivedMMSActivity.this,help,"Stay Alert! Follow ups.");
        }

    }

    public void init() {
        stringUtils = new StringUtils();
        userRole = stringUtils.getUserRole(this);
        createMMS = (FloatingActionButton)findViewById(R.id.create_notification);
        moreOptions = (FloatingActionButton)findViewById(R.id.fab_more_oprions);
        createdMMS = (FloatingActionButton)findViewById(R.id.my_notification);
        uploadAudio = (FloatingActionButton)findViewById(R.id.upload_audio);
        moreOptionsLayout = (LinearLayout)findViewById(R.id.more_options);
        createMMSLayout = (LinearLayout)findViewById(R.id.create_notification_with_text);
        uploadAudioLayout = (LinearLayout)findViewById(R.id.upload_audio_with_text);
        myMMSLayout = (LinearLayout)findViewById(R.id.my_notification_with_text);
        whiteback = (RelativeLayout)findViewById(R.id.whiteback);
        headback = (RelativeLayout)findViewById(R.id.headingblack);

        TextView fab1 = (TextView)findViewById(R.id.fab1);
        fab1.setText("My MMS");

        TextView fab2 = (TextView)findViewById(R.id.fab2);
        fab2.setText("Create MMS");

    }

    @Override
    protected void onPause() {
        super.onPause();
        activityVisible = false;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                if(clicked)
                    floatingActionButtonClick();
                else {
                    overridePendingTransition(R.anim.right_to_left_anim, R.anim.exit_animation);
                    finish();
                }
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void renderData() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String userId = preferences.getString(CURRENT_USERNAME, "");

        String url = BASE_URL + API_VERSION_ONE + VOICE + LOG + userId;
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
                    MMSArrayAdapter adapter = new MMSArrayAdapter(ReceivedMMSActivity.this, 0, mmsList);
                    listView.setAdapter(adapter);
                } catch (SessionExpiredException e) {
                    e.handleException(ReceivedMMSActivity.this);
                } catch (JSONException | NullPointerException e) {
                    TextView emptyListview = (TextView)findViewById(R.id.no_content);
                    emptyListview.setVisibility(View.VISIBLE);
                }
            }
        };
        getAudios.execute();
    }

    public void floatingActionButtonClick () {

        if(!clicked) {
            headback.setVisibility(View.VISIBLE);
            whiteback.setVisibility(View.VISIBLE);
            //createNotificationLayout.setVisibility(View.VISIBLE);
            createMMSFabVisible();
            myMMSLayout.setVisibility(View.VISIBLE);

            createMMS.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(whiteback.getVisibility() == View.VISIBLE)
                        whiteback.setVisibility(View.INVISIBLE);

                    if(headback.getVisibility() == View.VISIBLE)
                        headback.setVisibility(View.GONE);

                    if(createMMSLayout.getVisibility() == View.VISIBLE)
                        createMMSLayout.setVisibility(View.INVISIBLE);

                    if(myMMSLayout.getVisibility() == View.VISIBLE)
                        myMMSLayout.setVisibility(View.INVISIBLE);

                    if(uploadAudioLayout.getVisibility() == View.VISIBLE)
                        uploadAudioLayout.setVisibility(View.INVISIBLE);
                    clicked = false;
                    Intent intent = new Intent(ReceivedMMSActivity.this, CreateMMSActivity.class);
                    Bundle bundle = new Bundle();
                    bundle.putSerializable(MMS_OBJECT, null);
                    intent.putExtra("bundle", bundle);
                    startActivity(intent);
                }
            });

            createdMMS.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(whiteback.getVisibility() == View.VISIBLE)
                        whiteback.setVisibility(View.INVISIBLE);

                    if(headback.getVisibility() == View.VISIBLE)
                        headback.setVisibility(View.GONE);

                    if(createMMSLayout.getVisibility() == View.VISIBLE)
                        createMMSLayout.setVisibility(View.INVISIBLE);

                    if(myMMSLayout.getVisibility() == View.VISIBLE)
                        myMMSLayout.setVisibility(View.INVISIBLE);

                    if(uploadAudioLayout.getVisibility() == View.VISIBLE)
                        uploadAudioLayout.setVisibility(View.INVISIBLE);
                    clicked = false;
                    Intent myNotification = new Intent(ReceivedMMSActivity.this, MyMMSActivity.class);
                    startActivity(myNotification);
                }
            });

            uploadAudio.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if(whiteback.getVisibility() == View.VISIBLE)
                        whiteback.setVisibility(View.INVISIBLE);

                    if(headback.getVisibility() == View.VISIBLE)
                        headback.setVisibility(View.GONE);

                    if(createMMSLayout.getVisibility() == View.VISIBLE)
                        createMMSLayout.setVisibility(View.INVISIBLE);

                    if(myMMSLayout.getVisibility() == View.VISIBLE)
                        myMMSLayout.setVisibility(View.INVISIBLE);

                    if(uploadAudioLayout.getVisibility() == View.VISIBLE)
                        uploadAudioLayout.setVisibility(View.INVISIBLE);
                    clicked = false;
                    Intent uploadAudio = new Intent(ReceivedMMSActivity.this, AudioAttachmentActivity.class);
                    String uploadId = UUID.randomUUID().toString();
                    uploadAudio.putExtra(UPLOAD_ID, uploadId);
                    startActivity(uploadAudio);
                }
            });

            if(whiteback.getVisibility() == View.VISIBLE)
                clicked = true;
        } else {
            clicked = false;

            whiteback.setVisibility(View.INVISIBLE);
            headback.setVisibility(View.GONE);
            //createNotificationLayout.setVisibility(View.INVISIBLE);
            createMMSFabInvisible();
            myMMSLayout.setVisibility(View.INVISIBLE);
        }
    }

    private void createMMSFabVisible() {
        String permission = stringUtils.getPermission(this, "voice_sms");
        if(permission.contains("manage") || permission.contains("manageAll")) {
            createMMSLayout.setVisibility(View.VISIBLE);
            uploadAudioLayout.setVisibility(View.VISIBLE);
        } else {
            createMMSLayout.setVisibility(View.GONE);
            uploadAudioLayout.setVisibility(View.GONE);
        }
    }

    private void createMMSFabInvisible() {
        String permission = stringUtils.getPermission(this, "voice_sms");
        if(permission.contains("manage") || permission.contains("manageAll")) {
            createMMSLayout.setVisibility(View.INVISIBLE);
            uploadAudioLayout.setVisibility(View.INVISIBLE);
        }
    }

    @Override
    public void onBackPressed() {
        if(clicked)
            floatingActionButtonClick();
        else
            finish();
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
            mms.setFileName(data.getString("title"));
            mms.setAudioId(data.getString("id"));
            mms.setPublishedBy(data.getString("updated_username"));
            mms.setSchoolId(data.getString("school_id"));
            mms.setUpdatedDate(data.getString("updated_date"));
            String downloadLink = data.getString("message");
            downloadLink = downloadLink.replaceAll("\\s", "%20");
            mms.setDownloadLink(downloadLink);
            mmslist.add(mms);
        }
        return mmslist;
    }
}
