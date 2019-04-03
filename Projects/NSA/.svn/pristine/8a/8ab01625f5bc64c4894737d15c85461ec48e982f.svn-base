package nexrise.publication.in.nexrise.Common;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Timer;
import java.util.TimerTask;

import nexrise.publication.in.nexrise.BeanClass.FeatureConfiguration;
import nexrise.publication.in.nexrise.BeanClass.Icons;
import nexrise.publication.in.nexrise.Config;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.FeatureConfigurationParser;
import nexrise.publication.in.nexrise.NavigationDrawerActivity;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.URLConnection.VersionCodeUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class SplashScreenActivity extends BaseLoginActivity implements Constants {

    int delay = 1500;
    SharedPreferences preferences;
    SharedPreferences.Editor editor;
    StringUtils utils;
    String userRole;
    Timer timer;
    DatabaseHelper databaseHelper;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash_screen);
        preferences = PreferenceManager.getDefaultSharedPreferences(SplashScreenActivity.this);
        editor =  preferences.edit();
        utils = new StringUtils();
        timer = new Timer();
        editor.putBoolean(DESTROYED, false).apply();
        ActionBar actionBar = getSupportActionBar();
        if(actionBar!=null){
            actionBar.hide();
        }

        Config config = new Config();
        config.getFeatureBasedIcons();
        databaseHelper = new DatabaseHelper(this);

        Thread notificationCount = new Thread(new Runnable() {
            @Override
            public void run() {

                MessageReceivingService.notificationCount.put(DASHBOARD_FEATURE, 0);
                MessageReceivingService.notificationCount.put(ASSIGNMENT_FEATURE_ID, 0);
                if(!MessageReceivingService.notificationCount.containsKey(CREATE_ASSIGNMENT))
                    MessageReceivingService.notificationCount.put(CREATE_ASSIGNMENT, 0);

                MessageReceivingService.notificationCount.put(CALENDAR_FEATURE, 0);

                MessageReceivingService.notificationCount.put(TIMETABLE_FEATURE, 0);
                if(!MessageReceivingService.notificationCount.containsKey(CREATE_TIMETABLE))
                    MessageReceivingService.notificationCount.put(CREATE_TIMETABLE, 0);

                MessageReceivingService.notificationCount.put(EVENTS_FEATURE_ID, 0);
                if(!MessageReceivingService.notificationCount.containsKey(CREATE_EVENT))
                    MessageReceivingService.notificationCount.put(CREATE_EVENT, 0);

                MessageReceivingService.notificationCount.put(DRAWER_FRAGMENT, 0);
                MessageReceivingService.notificationCount.put(NOTIFICATION_FEATURE, 0);
                if(!MessageReceivingService.notificationCount.containsKey(CREATE_NOTIFICATION))
                    MessageReceivingService.notificationCount.put(CREATE_NOTIFICATION, 0);

                MessageReceivingService.notificationCount.put(ATTENDANCE_FEATURE, 0);
                if(!MessageReceivingService.notificationCount.containsKey(CREATE_ATTENDANCE))
                    MessageReceivingService.notificationCount.put(CREATE_ATTENDANCE, 0);

                MessageReceivingService.notificationCount.put(FEE_MANAGEMENT_FEATURE, 0);
                if(!MessageReceivingService.notificationCount.containsKey(CREATE_FEE_MANAGEMENT))
                    MessageReceivingService.notificationCount.put(CREATE_FEE_MANAGEMENT, 0);

                MessageReceivingService.notificationCount.put(PROGRESS_CARD_FEATURE, 0);
                MessageReceivingService.notificationCount.put(TRANSPORT_FEATURE, 0);

                MessageReceivingService.notificationCount.put(JOURNALS_FEATURE, 0);
                if(!MessageReceivingService.notificationCount.containsKey(CREATE_JOURNAL))
                    MessageReceivingService.notificationCount.put(CREATE_JOURNAL, 0);

                MessageReceivingService.notificationCount.put(PHOTO_GALLERY_FEATURE, 0);
                if(!MessageReceivingService.notificationCount.containsKey(CREATE_PHOTO_GALLERY))
                    MessageReceivingService.notificationCount.put(CREATE_PHOTO_GALLERY, 0);

                MessageReceivingService.notificationCount.put(EXAM_FEATURE, 0);
                if(!MessageReceivingService.notificationCount.containsKey(CREATE_EXAM))
                    MessageReceivingService.notificationCount.put(CREATE_EXAM, 0);
            }
        });

        notificationCount.run();
        if(Build.VERSION.SDK_INT >=  Build.VERSION_CODES.M){
            if(ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 25);
            } else {
                utils.createDirectory(this);
                checkNetworkConnection();
            }
        } else {
            utils.createDirectory(this);
            checkNetworkConnection();
        }
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(grantResults.length > 0) {
            if (requestCode == 25 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                utils.createDirectory(this);
                checkNetworkConnection();
            } else if (requestCode == 25 && grantResults[0] == PackageManager.PERMISSION_DENIED) {
                checkNetworkConnection();
            }
        }
    }

    private void checkVersion() {
        try {
            PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), 0);
            String versionNameStr = info.versionName;
            final Double apkVersion = Double.parseDouble(versionNameStr);
            final String packageName = this.getApplicationInfo().packageName;
            VersionCodeUrlConnection newVersion = new VersionCodeUrlConnection(packageName) {
                @Override
                protected void onPostExecute(String version) {
                    super.onPostExecute(version);
                    if(version != null) {
                        Double playstoreVersion = Double.parseDouble(version);
                        if(playstoreVersion > apkVersion) {
                            handleHigherVersion(packageName);
                        } else
                            splashScreen();
                    } else
                        splashScreen();
                }
            };
            newVersion.execute();
        } catch (Exception e) {
            e.printStackTrace();
            splashScreen();
        }
    }

    private void checkNetworkConnection() {
        if(isConnected())
            checkVersion();
        else {
            showToast("Please check the Internet Connection");
            //  Toast.makeText(this,"Please check the Internet Connection",Toast.LENGTH_LONG).show();
            if(Build.VERSION.SDK_INT >=  Build.VERSION_CODES.LOLLIPOP){
                ConnectivityManager cm = (ConnectivityManager)getSystemService(CONNECTIVITY_SERVICE);
                cm.addDefaultNetworkActiveListener(new ConnectivityManager.OnNetworkActiveListener() {
                    @Override
                    public void onNetworkActive() {
                        checkVersion();
                    }
                });
            } else {

                final Handler handler = new Handler();
                TimerTask timerTask = new TimerTask() {
                    @Override
                    public void run() {
                        handler.post(new Runnable() {
                            @Override
                            public void run() {
                                Log.v("NEtwork ","connection timer");
                                if(isConnected()) {
                                    checkVersion();
                                    timer.cancel();
                                }
                            }
                        });
                    }
                };
                timer.schedule(timerTask,1000, 2500);
            }
        }
    }

    private void handleHigherVersion(final String packageName) {
        AlertDialog alertDialog = new AlertDialog.Builder(this).setCancelable(false)
                .setTitle(R.string.update_available).setMessage(R.string.new_version_update_message)
                .setPositiveButton(R.string.ok_caps, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Intent viewIntent = new Intent("android.intent.action.VIEW",
                                Uri.parse("https://play.google.com/store/apps/details?id="+packageName));
                        startActivity(viewIntent);
                    }
                }).create();
        alertDialog.show();
    }

    public void splashScreen(){
        final SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        final String sessionToken = preferences.getString(SESSION_TOKEN, null);

        try {
            if (sessionToken != null) {
                userRole = preferences.getString(USER_ROLE, null);
                final boolean serviceDestroyed = preferences.getBoolean(SERVICE_DESTROYED, false);
                Log.v("SErvice ","Destroyed "+serviceDestroyed);
                String url = BASE_URL + API_VERSION_ONE + AUTHENTICATE + VALIDATE_SESSION;
                final GETUrlConnection validateSession = new GETUrlConnection(SplashScreenActivity.this, url,null) {
                    @Override
                    protected void onPostExecute(String response) {
                        super.onPostExecute(response);
                        try {
                            utils.checkSession(response);
                            JSONObject responseObj = new JSONObject(response);
                            Log.v("splash validate ","response "+response);
                            boolean validSession = responseObj.getJSONObject("data").getJSONObject("status").getBoolean("validSession");
                            if(validSession) {

                                String configUrl = BASE_URL + API_VERSION_ONE + FEATURE + APP + "/" + ACTIVE;
                                GETUrlConnection getConfig = new GETUrlConnection(SplashScreenActivity.this, configUrl,null){
                                    @Override
                                    protected void onPostExecute(String response) {
                                        super.onPostExecute(response);
                                        Log.v("splash","response "+response);
                                        ArrayList<FeatureConfiguration> configurationList = new ArrayList<FeatureConfiguration>();
                                        try {
                                            FeatureConfigurationParser featureConfigurationParser = new FeatureConfigurationParser();
                                            configurationList = featureConfigurationParser.configJsonParser(response);
                                            LinkedHashMap<String,Icons> featureList = Config.featureBasedIcons;
                                            for(int i=0;i<configurationList.size();i++){
                                                String featureId = configurationList.get(i).getFeatureId();
                                                if (configurationList.get(i).getStatus()) {
                                                    Log.v("FEature ","featureId "+featureId);
                                                    Icons icons = featureList.get(featureId);
                                                    MessageReceivingService.newFeatureList.put(featureId, icons);
                                                }
                                            }
                                            if(serviceDestroyed) {
                                                Intent messageReceivingService = new Intent(SplashScreenActivity.this, MessageReceivingService.class);
                                                startService(messageReceivingService);
                                            }

                                            if (userRole.equalsIgnoreCase(EMPLOYEE)) {
                                                Intent intent = new Intent(SplashScreenActivity.this, NavigationDrawerActivity.class);
                                                startActivity(intent);
                                            } else {
                                                /*Intent intent = new Intent(SplashScreenActivity.this, ParentLogin.class);
                                                intent.putExtra(FROM_ACTIVITY, "SplashScreenActivity");
                                                startActivity(intent);*/
                                                if (userRole.equalsIgnoreCase(PARENT)) {
                                                    Cursor cursor = databaseHelper.getPreferenceValues();
                                                    if (cursor.getCount() > 0) {
                                                        cursor.moveToFirst();
                                                        String json = cursor.getString(cursor.getColumnIndex(databaseHelper.VALUE));
                                                        JSONArray dataAry = new JSONArray(json);
                                                        parseMultipleSchools(dataAry);
                                                        cursor.close();
                                                    } else {
                                                        Intent intent = new Intent(SplashScreenActivity.this, NavigationDrawerActivity.class);
                                                        startActivity(intent);
                                                    }
                                                }
                                            }
                                        } catch (Exception e) {
                                            openLoginScreen();
                                        }
                                    }
                                };
                                getConfig.execute();
                            } else {
                                openLoginScreen();
                            }
                        } catch (JSONException | NullPointerException | SessionExpiredException e) {
                            openLoginScreen();
                        }
                    }
                };
                validateSession.execute();
            } else {
                throw new NullPointerException("Session token is null");
            }
        } catch (NullPointerException e) {
            Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    openLoginScreen();
                }
            }, delay);
        }
    }

    public void openLoginScreen() {
        Intent intent = new Intent(SplashScreenActivity.this, LoginActivity.class);
        startActivity(intent);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        editor.putBoolean(DESTROYED, true).apply();
        timer.cancel();
    }
}