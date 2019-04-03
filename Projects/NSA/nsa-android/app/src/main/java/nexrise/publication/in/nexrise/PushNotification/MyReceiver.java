package nexrise.publication.in.nexrise.PushNotification;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.ExecutionException;

import nexrise.publication.in.nexrise.BeanClass.User;
import nexrise.publication.in.nexrise.Common.DatabaseHelper;
import nexrise.publication.in.nexrise.Common.SplashScreenActivity;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.NavigationDrawerActivity;
import nexrise.publication.in.nexrise.ParentFeatures.ParentLogin.MultipleSchoolsActivity;
import nexrise.publication.in.nexrise.ParentFeatures.ParentLogin.ParentLogin;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.BitmapDecoded;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class MyReceiver extends BroadcastReceiver implements Constants {

    public static int notificationCount = 0;
    SharedPreferences preferences;
    public MyReceiver() {

    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.v("Check ","OnReceive "+intent);
        preferences = PreferenceManager.getDefaultSharedPreferences(context);
        //  dbHelper = new DatabaseHelper(context);
        if(intent!=null){
            Bundle extras = intent.getExtras();
            Set<String> keys = extras.keySet();
            Iterator iterator = keys.iterator();

            while (iterator.hasNext()) {
                String val = iterator.next().toString();
                Log.v("KEYData ",val+" "+ extras.get(val));
            }

            if(NavigationDrawerActivity.inBackground) {
                if(updateNotificationCount(extras,context, intent)) {
                    ++notificationCount;
                    showNotification(extras, context, intent);
                }
            } else {
                // The activity will be in foreground
                // showNotification(extras, context, intent);
                if(updateNotificationCount(extras,context,intent)) {
                    ++notificationCount;
                    showNotification(extras, context, intent);
                    MessageReceivingService.sendToApp(extras, context);
                }
            }
        }
    }

    public boolean updateNotificationCount(Bundle extras,Context context, Intent notificationIntent) {
        boolean status = false;
        if(notificationIntent.hasExtra("featureId")) {
            String featureId = notificationIntent.getExtras().getString("featureId");
            assert featureId != null;
            if(featureId.equals(EXAM_MARK))
                featureId = CREATE_EXAM;
            String userRole = StringUtils.getInstance().getUserRole(context);
            if(userRole != null && userRole.equalsIgnoreCase(EMPLOYEE) && notificationIntent.hasExtra("schoolId")) {
                String schoolId = notificationIntent.getExtras().getString("schoolId");
                status = incrementNotificationCount(extras,context, null, featureId, schoolId);
            } else if(notificationIntent.hasExtra("schoolId") && notificationIntent.hasExtra("classes")) {
                String schoolId = notificationIntent.getExtras().getString("schoolId");
                String classes = notificationIntent.getExtras().getString("classes");
                status = incrementNotificationCount(extras,context, classes, featureId, schoolId);
            }
            if(MessageReceivingService.notificationCount.containsKey(featureId)) {
                MessageReceivingService.notificationCount.put(featureId, MessageReceivingService.notificationCount.get(featureId) + 1);
            } else
                MessageReceivingService.notificationCount.put(featureId, 1);
        }
        return status;
    }

    public void showNotification(Bundle extras, Context context, Intent notificationIntent) {
        final NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        try {
            String message = extras.getString("data");
            String title = extras.getString("gcm.notification.title");
            String body = extras.getString("gcm.notification.body");

            NotificationCompat.BigPictureStyle bigPicStyle = null;

            if(notificationCount <= 1 && notificationIntent.hasExtra("attachments") && !notificationIntent.getStringExtra("attachments").isEmpty()) {
                bigPicStyle = getStyle(notificationIntent);
                body = "Click here to show the preview of image";
            }

            String userRole = StringUtils.getInstance().getUserRole(context);
            Intent intent;
            if (preferences.getBoolean(DESTROYED, false)) {
                intent = new Intent(context, SplashScreenActivity.class);
                intent.putExtra(FROM_ACTIVITY, "Receiver");
            } else {
                if (userRole.equalsIgnoreCase(EMPLOYEE)) {
                    intent = new Intent(context, NavigationDrawerActivity.class);
                    intent.putExtra(FROM_ACTIVITY, "Receiver");
                } else {
                    intent = handleParentLogin(context);

                }
            }
            //  intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            final PendingIntent pendingIntent = PendingIntent.getActivity(context, 10, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            Bitmap largeIcon = BitmapFactory.decodeResource(context.getResources(), R.mipmap.ic_launcher);
            if (notificationCount <= 1) {
                final Notification notification = new NotificationCompat.Builder(context).setSmallIcon(R.mipmap.ic_launcher).setLargeIcon(largeIcon)
                        .setContentTitle(title)
                        .setContentText(body)
                        .setContentIntent(pendingIntent)
                        .setAutoCancel(true).setGroup("Notifications")
                        .setStyle(bigPicStyle)
                        .getNotification();
                notification.defaults = Notification.DEFAULT_SOUND;
                mNotificationManager.notify(0, notification);
            } else {
                String appName = getAppname(context);
                final Notification notification = new NotificationCompat.Builder(context).setSmallIcon(R.mipmap.ic_launcher).setLargeIcon(largeIcon)
                        .setContentTitle(appName)
                        .setContentText(notificationCount + " Notifications")
                        .setContentIntent(pendingIntent)
                        .setAutoCancel(true).setGroup("Notifications")
                        .getNotification();
                notification.defaults = Notification.DEFAULT_SOUND;
                mNotificationManager.notify(0, notification);
            }
        } catch (NullPointerException | JSONException e) {
            e.printStackTrace();
        }
    }

    private NotificationCompat.BigPictureStyle getStyle(Intent notificationIntent) {

        String schoolId = notificationIntent.getStringExtra("schoolId");
        String file = notificationIntent.getStringExtra("attachments");
        String fileUrl = AWS_BASE_URL + schoolId + "/" + Uri.encode(file);
        Log.v("FILE ","url "+fileUrl);
        Bitmap bitmap = null;
        try {
            bitmap = new BitmapDecoded(fileUrl).execute().get();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        NotificationCompat.BigPictureStyle notificationStyle = new NotificationCompat.BigPictureStyle();
        notificationStyle.setSummaryText(notificationIntent.getStringExtra("gcm.notification.body"));

        notificationStyle.bigPicture(bitmap);
        return notificationStyle;
    }

    private Intent handleParentLogin(Context context) throws JSONException, NullPointerException {
        DatabaseHelper helper = new DatabaseHelper(context);
        Cursor cursor = helper.getPreferenceValues();
        Intent intent;
        if(cursor.getCount() > 0) {
            cursor.moveToFirst();
            String json = cursor.getString(cursor.getColumnIndex(helper.VALUE));
            JSONArray dataAry = new JSONArray(json);
            intent = parseMultipleSchools(dataAry, context);
        } else {
            intent = new Intent(context, NavigationDrawerActivity.class);
            intent.putExtra(FROM_ACTIVITY, "Receiver");
        }

        return intent;
    }

    private Intent parseMultipleSchools(JSONArray dataAry, Context context) throws JSONException, NullPointerException{
        HashMap<String, ArrayList<User>> multipleUsers = new HashMap<>();
        Intent intent;
        for(int i=0; i<dataAry.length(); i++) {
            JSONObject data = dataAry.getJSONObject(i);
            String schoolId = data.getString("school_id");
            String schoolName = data.getString("school_name");
            String userId = data.getString("user_id");
            String firstName = data.getString("first_name");
            String username = data.getString("user_name");

            User user = new User();
            user.setSchoolId(schoolId);
            user.setFirstName(firstName);
            user.setSchoolName(schoolName);
            user.setUserId(userId);
            user.setUsername(username);

            String key = schoolId + " "+schoolName;
            if(multipleUsers.containsKey(key)) {
                ArrayList<User> users = multipleUsers.get(key);
                users.add(user);
            } else {
                ArrayList<User> users = new ArrayList<>();
                users.add(user);
                multipleUsers.put(key, users);
            }
        }

        if(multipleUsers.size() > 1) {
            intent = new Intent(context, MultipleSchoolsActivity.class);
            intent.putExtra(MULTIPLE_USERS, multipleUsers);
        } else {
            intent = new Intent(context, ParentLogin.class);
            ArrayList<User> usersList = new ArrayList<>();
            for (ArrayList<User> user: multipleUsers.values())
                usersList.addAll(user);

            intent.putExtra(MULTIPLE_USERS, usersList);
            intent.putExtra(FROM_ACTIVITY, "LoginActivity");
        }
        return intent;
    }

    private boolean incrementNotificationCount(Bundle extras,Context context, String classes, String featureId, String schoolId) {
        boolean status = false;
        try {
            DatabaseHelper helper = new DatabaseHelper(context);
            String title = extras.getString("gcm.notification.title");
            String body = extras.getString("gcm.notification.body") + title;
            if (classes != null) {
                if(!MessageReceivingService.bodyContent.contains(body)) {
                    MessageReceivingService.bodyContent.add(body);

                JSONArray classesAry = new JSONArray(classes);
                for (int i = 0; i < classesAry.length(); i++) {
                    String classObj = classesAry.getJSONObject(i).toString();
                    Log.v("Class", "Data" + classObj);
                    Cursor cursor = helper.getClassSectionAndUser(featureId);
                    while (cursor.moveToNext()) {
                        String classId = cursor.getString(cursor.getColumnIndex(helper.CLASS_ID));
                        String sectionId = cursor.getString(cursor.getColumnIndex(helper.SECTION_ID));
                        String userId = cursor.getString(cursor.getColumnIndex(helper.USER_ID));

                        if (featureId.equals(CREATE_FEE_MANAGEMENT) && classObj.contains(classId)) {
                            status = true;
                            helper.incrementNotificationCount(classId, sectionId, featureId, schoolId, userId);
                        } else if (classObj.contains(classId) && classObj.contains(sectionId)) {
                            status = true;
                            helper.incrementNotificationCount(classId, sectionId, featureId, schoolId, userId);
                        }
                    }
                }
            }
        } else {
                SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
                String userId = preferences.getString(CURRENT_USERNAME, null);
                helper.incrementNotificationCount("NIL", "NIL", featureId, schoolId, userId);
                status = true;
                //  helper.incrementNotificationCountEmployee(featureId, schoolId, userId);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return status;
    }

    public String getAppname(Context context) {
        PackageManager packageManager = context.getPackageManager();
        ApplicationInfo applicationInfo = null;
        try {
            applicationInfo = packageManager.getApplicationInfo(context.getApplicationInfo().packageName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return (String)(applicationInfo != null ? packageManager.getApplicationLabel(applicationInfo): "");
    }
}