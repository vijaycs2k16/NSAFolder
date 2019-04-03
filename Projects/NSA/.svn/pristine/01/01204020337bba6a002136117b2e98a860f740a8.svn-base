package nexrise.publication.in.nexrise.Common;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.PushNotification.MyReceiver;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Karthik on 6/1/2017.
 */

public class SessionExpiredException extends RuntimeException implements Constants {
    private static SessionExpiredException sessionExpiredException = new SessionExpiredException();
    public static int alertDialogCount = 0;

    private SessionExpiredException() {

    }

    public static SessionExpiredException getInstance() {
        return sessionExpiredException;
    }
    @Override
    public void printStackTrace() {
        super.printStackTrace();
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }

    public void handleException(final Context context) {

        if(alertDialogCount == 0) {
            final AlertDialog.Builder alertBuilder = new AlertDialog.Builder(context)
                    .setTitle(R.string.session_expired)
                    .setMessage(R.string.session_expired_message)
                    .setPositiveButton(R.string.logout_caps, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            clearNotificationCount();
                            MessageReceivingService.newFeatureList.clear();
                            dialog.cancel();
                            dialog.dismiss();
                            DatabaseHelper helper = new DatabaseHelper(context);
                            helper.resetUser();
                            helper.resetPreferences();
                            StringUtils.getInstance().cancelAllNotification(context);
                            Intent logout = new Intent(context, LoginActivity.class);
                            logout.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                            context.startActivity(logout);
                        }
                    });
            alertBuilder.create();
            alertBuilder.setCancelable(false);
            alertBuilder.show();
            ++alertDialogCount;
        }
    }

    public void clearNotificationCount() {
        MyReceiver.notificationCount = 0;
        MessageReceivingService.notificationCount.put(DASHBOARD_FEATURE, 0);

        MessageReceivingService.notificationCount.put(ASSIGNMENT_FEATURE_ID, 0);
        MessageReceivingService.notificationCount.put(CREATE_ASSIGNMENT, 0);

        MessageReceivingService.notificationCount.put(CALENDAR_FEATURE, 0);

        MessageReceivingService.notificationCount.put(TIMETABLE_FEATURE, 0);
        MessageReceivingService.notificationCount.put(CREATE_TIMETABLE, 0);

        MessageReceivingService.notificationCount.put(EVENTS_FEATURE_ID, 0);
        MessageReceivingService.notificationCount.put(CREATE_EVENT, 0);

        MessageReceivingService.notificationCount.put(DRAWER_FRAGMENT, 0);

        MessageReceivingService.notificationCount.put(NOTIFICATION_FEATURE, 0);
        MessageReceivingService.notificationCount.put(CREATE_NOTIFICATION, 0);

        MessageReceivingService.notificationCount.put(ATTENDANCE_FEATURE, 0);
        MessageReceivingService.notificationCount.put(CREATE_ATTENDANCE, 0);

        MessageReceivingService.notificationCount.put(FEE_MANAGEMENT_FEATURE, 0);
        MessageReceivingService.notificationCount.put(CREATE_FEE_MANAGEMENT, 0);

        MessageReceivingService.notificationCount.put(PROGRESS_CARD_FEATURE, 0);

        MessageReceivingService.notificationCount.put(TRANSPORT_FEATURE, 0);

        MessageReceivingService.notificationCount.put(JOURNALS_FEATURE, 0);
        MessageReceivingService.notificationCount.put(CREATE_JOURNAL, 0);

        MessageReceivingService.notificationCount.put(PHOTO_GALLERY_FEATURE, 0);
        MessageReceivingService.notificationCount.put(CREATE_PHOTO_GALLERY, 0);

        MessageReceivingService.notificationCount.put(EXAM_FEATURE, 0);
        MessageReceivingService.notificationCount.put(CREATE_EXAM, 0);

        MessageReceivingService.notificationCount.put(HALL_OF_FAME_FEATURE_ID, 0);
        MessageReceivingService.notificationCount.put(VOICE_MMS_ID,0);
    }
}
