package nexrise.publication.in.nexrise.ParentFeatures.ParentLogin;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.util.Log;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.LinkedHashMap;

import nexrise.publication.in.nexrise.BeanClass.FeatureConfiguration;
import nexrise.publication.in.nexrise.BeanClass.Icons;
import nexrise.publication.in.nexrise.BeanClass.User;
import nexrise.publication.in.nexrise.Common.BaseLoginActivity;
import nexrise.publication.in.nexrise.Common.DatabaseHelper;
import nexrise.publication.in.nexrise.Common.LoginActivity;
import nexrise.publication.in.nexrise.Config;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.CustomHashMap.Initiater;
import nexrise.publication.in.nexrise.CustomHashMap.OnUpdateListener;
import nexrise.publication.in.nexrise.JsonParser.FeatureConfigurationParser;
import nexrise.publication.in.nexrise.NavigationDrawerActivity;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ParentLogin extends BaseLoginActivity implements Constants{

    private String fromActivity = "";
    ListView listView;
    ParentLoginArrayAdapter arrayAdapter;
    OnUpdateListener updateListener;
    Boolean activityVisible = true;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_parent_login);
        listView = (ListView)findViewById(R.id.parent_login_listview);
        activityVisible = true;
        LoginActivity.login = false;

        Intent intent = getIntent();
        if(intent.hasExtra(FROM_ACTIVITY))
            fromActivity = intent.getStringExtra(FROM_ACTIVITY);

        ActionBar actionBar = getSupportActionBar();
        if (actionBar!=null) {
            actionBar.setTitle(R.string.welcome);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            if(fromActivity.equals("MultipleSchoolsActivity")) {
                actionBar.setDisplayHomeAsUpEnabled(true);
                actionBar.setDisplayShowHomeEnabled(true);
            }
        }

        if(intent.hasExtra(MULTIPLE_USERS)) {
            ArrayList<User> users = (ArrayList<User>) intent.getSerializableExtra(MULTIPLE_USERS);
            arrayAdapter = new ParentLoginArrayAdapter(this, 0, users);
            listView.setAdapter(arrayAdapter);
            listViewClickHandler(listView, users);
        } else {
            SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
            final String studentName = preferences.getString(FIRST_NAME, null);
            User user = new User();
            user.setFirstName(studentName);
            ArrayList<User> users = new ArrayList<>();
            users.add(user);
            arrayAdapter = new ParentLoginArrayAdapter(this, 0, users);
            listView.setAdapter(arrayAdapter);
            listViewClickHandler(listView, users);
        }

        updateListener = new OnUpdateListener() {
            @Override
            public void onUpdate(String classId, String sectionId, String schoolId, String userId, String featureId, int count) {

                if(activityVisible && listView != null && arrayAdapter != null) {
                    listView.invalidate();
                    arrayAdapter.notifyDataSetChanged();
                }
            }
        };
        Initiater.getInstance().setOnUpdateListener(updateListener);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        switch (id) {
            case android.R.id.home:
                onBackPressed();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void listViewClickHandler(final ListView listView, ArrayList<User> users) {
        final DatabaseHelper helper = new DatabaseHelper(this);
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                User user = (User)listView.getItemAtPosition(i);

                Cursor cursor = helper.getUser(user.getUsername());
                Cursor configCursor = helper.getConfig(user.getSchoolId());
                if (cursor.getCount() > 0) {
                    saveFromDBToPrefs(cursor);

                    if(configCursor.getCount() != 0) {
                        try {
                            configCursor.moveToFirst();
                            String config = configCursor.getString(configCursor.getColumnIndex(helper.VALUE));
                            ArrayList<FeatureConfiguration> configurationList = new FeatureConfigurationParser().configJsonParser(config);
                            LinkedHashMap<String, Icons> featureList = initiateConfig(Config.featureBasedIcons);
                            MessageReceivingService.newFeatureList.clear();
                            for (int j = 0; j < configurationList.size(); j++) {
                                String featureId = configurationList.get(j).getFeatureId();
                                if (configurationList.get(i).getStatus()) {
                                    Log.v("FEature ", "featureId " + featureId);
                                    Icons icons = featureList.get(featureId);
                                    MessageReceivingService.newFeatureList.put(featureId, icons);
                                }
                            }

                            Intent student = new Intent(ParentLogin.this, NavigationDrawerActivity.class);
                            startActivity(student);
                        } catch (JSONException | NullPointerException e) {
                            e.printStackTrace();
                            getUserConfig(user);
                        }
                    } else {
                        getUserConfig(user);
                    }
                } else {
                   /* Intent student = new Intent(ParentLogin.this, NavigationDrawerActivity.class);
                    startActivity(student);*/
                    authorize(user);
                }
                configCursor.close();
                cursor.close();

                for (int j=0; j<listView.getAdapter().getCount(); j++) {
                    User anotherUser = (User)listView.getAdapter().getItem(j);
                    if(!user.getUserId().equals(anotherUser.getUserId())) {
                        Log.v("SIBLINGS "," "+anotherUser.getUsername());
                        authorizeSibilings(anotherUser);
                    }
                }
            }
        });
    }

    private void getUserConfig(User user) {
        final ProgressDialog dialog = new ProgressDialog(ParentLogin.this, ProgressDialog.STYLE_SPINNER);

        try {
            new Handler().post(new Runnable() {
                @Override
                public void run() {
                    dialog.setMessage(getResources().getText(R.string.authorizing));
                    dialog.show();
                }
            });

            getUserAndConfig(user.getUserId());

            new Handler().post(new Runnable() {
                @Override
                public void run() {
                    dialog.dismiss();
                }
            });
            Intent student = new Intent(ParentLogin.this, NavigationDrawerActivity.class);
            startActivity(student);

        } catch (Exception e) {
            e.printStackTrace();
            new Handler().post(new Runnable() {
                @Override
                public void run() {
                    dialog.dismiss();
                }
            });
            showToast((String) getResources().getText(R.string.logout_filed));
        }
    }

    private void authorize(User user) {
        JSONObject body = getJsonBody(user.getUsername());
        final String encodedUserName = Uri.encode(user.getUsername());

        if (body == null)
            return;
        String authorizeUrl = BASE_URL + API_VERSION_ONE + AUTHENTICATE + "/" +APP + "/" + AUTHORIZE;
        POSTUrlConnection authorize = new POSTUrlConnection(body, authorizeUrl, new StringUtils().getHeadersWithoutSession(ParentLogin.this), ParentLogin.this) {
            ProgressDialog dialog = new ProgressDialog(ParentLogin.this, ProgressDialog.STYLE_SPINNER);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                dialog.setMessage(getResources().getText(R.string.authorizing));
                dialog.setCancelable(false);
                dialog.setCanceledOnTouchOutside(false);
                new Handler().post(new Runnable() {
                    @Override
                    public void run() {
                        dialog.show();
                    }
                });
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    JSONObject responseObj = new JSONObject(response);
                    JSONObject data = responseObj.getJSONObject(DATA);
                    String currentUserId = handleToken(data, encodedUserName, true);
                    getUserAndConfig(currentUserId);

                    new Handler().post(new Runnable() {
                        @Override
                        public void run() {
                            dialog.dismiss();
                        }
                    });
                } catch (Exception e) {
                    new Handler().post(new Runnable() {
                        @Override
                        public void run() {
                            dialog.dismiss();
                            Toast toast = Toast.makeText(ParentLogin.this, R.string.unable_to_login, Toast.LENGTH_SHORT);
                            toast.setGravity(Gravity.CENTER, 0, 0);
                            toast.show();
                        }
                    });
                    e.printStackTrace();
                }
                Log.v("PARENT ","login "+response);
            }
        };
        authorize.execute();
    }

    @Override
    protected void onPause() {
        super.onPause();
        activityVisible = false;
    }

    @Override
    protected void onResume() {
        super.onResume();
        activityVisible = true;
        if(listView != null && arrayAdapter != null) {
            arrayAdapter.notifyDataSetChanged();
            listView.invalidate();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        activityVisible = false;
        Initiater.getInstance().remove(updateListener);
    }

    @Override
    public void onBackPressed() {
        if(fromActivity.equals("MultipleSchoolsActivity"))
            super.onBackPressed();
        else {
            Intent home = new Intent(Intent.ACTION_MAIN);
            home.addCategory(Intent.CATEGORY_HOME);
            home.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(home);
        }
    }
}