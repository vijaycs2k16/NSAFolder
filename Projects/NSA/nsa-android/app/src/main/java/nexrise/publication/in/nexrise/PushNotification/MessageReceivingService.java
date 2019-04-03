package nexrise.publication.in.nexrise.PushNotification;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Build.VERSION;
import android.os.Bundle;
import android.os.IBinder;
import android.preference.PreferenceManager;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.google.android.gms.gcm.GoogleCloudMessaging;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import me.leolin.shortcutbadger.ShortcutBadgeException;
import me.leolin.shortcutbadger.ShortcutBadger;
import nexrise.publication.in.nexrise.BeanClass.Icons;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.CustomHashMap.CustomHashMap;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;

/*
 * This service is designed to run in the background and receive messages from gcm. If the app is in the foreground
 * when a message is received, it will immediately be posted. If the app is not in the foreground, the message will be saved
 * and a notification is posted to the NotificationManager.
 */
public class MessageReceivingService extends Service implements Constants {
    private GoogleCloudMessaging gcm;
    public static SharedPreferences savedValues;
    public static String ACTION_BROADCAST = MessageReceivingService.class.getName();
    HashMap<String, String> deviceToken = new HashMap<>();
    private SharedPreferences.Editor editor;
    public static CustomHashMap<String, Integer> notificationCount = new CustomHashMap<>();
    public static LinkedHashMap<String,Icons> newFeatureList = new LinkedHashMap<String, Icons>();
    public static List<String> permissions = new ArrayList<>();
    public static List<String> bodyContent = new ArrayList<>();

    public static void sendToApp(Bundle extras, Context context){
        updateData(extras, context);
        try {
            ShortcutBadger.applyCountOrThrow(context, 0);
        } catch (ShortcutBadgeException e) {
            Log.i("SHORTCUT","BADGER EXCEPTION");
        }
    }

    public void onCreate(){
        super.onCreate();
        final String preferences = getString(R.string.preferences);
        SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(MessageReceivingService.this);
        editor = sharedPreferences.edit();
        editor.putBoolean(SERVICE_DESTROYED, false).apply();
        savedValues = getSharedPreferences(preferences, Context.MODE_PRIVATE);

        // In later versions multi_process is no longer the default
        if(VERSION.SDK_INT >  9){
            savedValues = getSharedPreferences(preferences, Context.MODE_MULTI_PROCESS);
        }
        // Let AndroidMobilePushApp know we have just initialized and there may be stored messages
        sendToApp(new Bundle(), this);
    }

    protected static void saveToLog(Bundle extras, Context context){
        SharedPreferences.Editor editor=savedValues.edit();
        String numOfMissedMessages = context.getString(R.string.num_of_missed_messages);
        int linesOfMessageCount = 0;
        for(String key : extras.keySet()){
            String line = String.format("%s=%s", key, extras.getString(key));
            editor.putString("MessageLine" + linesOfMessageCount, line);
            linesOfMessageCount++;
        }
        editor.putInt(context.getString(R.string.lines_of_message_count), linesOfMessageCount);
        editor.putInt(context.getString(R.string.lines_of_message_count), linesOfMessageCount);
        editor.putInt(numOfMissedMessages, savedValues.getInt(numOfMissedMessages, 0) + 1);
        editor.apply();
        //postNotification(new Intent(context, AndroidMobilePushApp.class), context);
    }

    private void register() {
        new AsyncTask(){
            SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(MessageReceivingService.this);
            SharedPreferences.Editor editor = preferences.edit();
            protected String doInBackground(final Object... params) {
                String token = null;

                try {
                    token = gcm.register(getString(R.string.project_number));
                    editor.putString(REGISTRATION_ID, token);
                    editor.apply();
                    Log.i("GCM registrationId", token);
                }
                catch (IOException e) {
                    Log.i("Registration Error", e.getMessage());
                }
                return token;
            }

            @Override
            protected void onPostExecute(Object o) {
                super.onPostExecute(o);
                if(deviceToken.containsKey(String.valueOf(o))) {
                    editor.putString(ENDPOINT_ARN, deviceToken.get(String.valueOf(o)));
                } else if(o!= null) {
                    SNSMobilePush snsMobilePush = new SNSMobilePush(MessageReceivingService.this);
                    snsMobilePush.execute(o.toString());
                }
            }
        }.execute(null, null, null);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        if(intent != null && intent.hasExtra(DEVICE_TOKEN)) {
            deviceToken = (HashMap<String, String>) intent.getSerializableExtra(DEVICE_TOKEN);
            gcm = GoogleCloudMessaging.getInstance(getBaseContext());
            register();
        }
        getSubMerchantId();

        return super.onStartCommand(intent, flags, startId);
    }

    public void getSubMerchantId() {
        final String schoolCredentialsURL = BASE_URL + API_VERSION_ONE + SCHOOLS;
        GETUrlConnection getSchoolCredentials = new GETUrlConnection(this, schoolCredentialsURL, null){
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    Log.v("SCHool ","details "+response);
                    JSONObject credentialsObj = new JSONObject(response);
                    JSONObject schoolCredentialsData = credentialsObj.getJSONObject(DATA);

                    if (schoolCredentialsData.has("sub_merchant_id")) {
                        String subMerchantId = schoolCredentialsData.getString("sub_merchant_id");
                        if (subMerchantId != null && !subMerchantId.isEmpty() && !subMerchantId.equals("null"))
                            editor.putString(SUB_MERCHANT_ID, subMerchantId);
                    }
                    editor.putString(PROJECT_NUMBER, schoolCredentialsData.getString("project_id"));
                    editor.putString(SERVER_API_KEY, schoolCredentialsData.getString("server_api_key"));
                    editor.apply();
                } catch (NullPointerException | JSONException e) {
                    e.printStackTrace();
                }
            }
        };
        getSchoolCredentials.execute();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        editor.putBoolean(SERVICE_DESTROYED, true).apply();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    public static void updateData(Bundle extras, Context context){
        if(extras!= null){
            Intent intent = new Intent(ACTION_BROADCAST);
            intent.putExtras(extras);
            LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
        }
    }
}