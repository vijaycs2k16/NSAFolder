package nexrise.publication.in.nexrise.ParentFeatures.Attendance;

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
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.StatusAttendance;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.ParentStatusParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class StatusAttendanceActivity extends AppCompatActivity implements Constants {
    ArrayList<StatusAttendance> statusList;
    SharedPreferences preferences;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_status_attendance);

        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        Intent intent = getIntent();
        String studentName = intent.getExtras().getString("studentName");
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(StatusAttendanceActivity.this);
        String username = preferences.getString(CURRENT_USERNAME,null);
        TextView textView = (TextView)findViewById(R.id.student_name);
        textView.setText(studentName);
        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(R.string.absent_days);
        }
        setUpViewPager();
    }

    private void setUpViewPager() {
        String username = preferences.getString(CURRENT_USERNAME,null);
        String leaveStatus = BASE_URL + API_VERSION_ONE + ATTENDANCE + DETAILS + MOBILE + USER + username;
        Log.v("url", "attendance " + leaveStatus);
        GETUrlConnection GETUrlConnection = new GETUrlConnection(StatusAttendanceActivity.this, leaveStatus, null) {
            ProgressBar progressBar = (ProgressBar) findViewById(R.id.loading_bar);
            TextView no_content = (TextView) findViewById(R.id.no_content);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("student ", "attendance" + response);
                try {
                    StringUtils.getInstance().checkSession(response);
                    ParentStatusParser parentStatusParser = new ParentStatusParser();
                    parentStatusParser.getParentAttendaceList(response);
                    statusList = parentStatusParser.absentList;
                    ListView listView = (ListView) findViewById(R.id.absent_list);
                    StatusAttedanceArrayAdapter adapter = new StatusAttedanceArrayAdapter(StatusAttendanceActivity.this, statusList);
                    listView.setAdapter(adapter);
                }catch (SessionExpiredException e) {
                  e.handleException(StatusAttendanceActivity.this);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
        GETUrlConnection.execute();
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
}