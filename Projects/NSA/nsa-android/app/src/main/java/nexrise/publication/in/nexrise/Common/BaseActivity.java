package nexrise.publication.in.nexrise.Common;

import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;
import android.widget.Toast;

import nexrise.publication.in.nexrise.Constants;

public class BaseActivity extends AppCompatActivity implements Constants{

    public boolean isConnected() {
        ConnectivityManager cm = (ConnectivityManager)getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo ni = cm.getActiveNetworkInfo();
        boolean status = true;
        if (ni == null)
            // There are no active networks.
            status = false;

        return status;
    }

    public void showToast(String message) {
        try {
            Toast toast = Toast.makeText(this, message, Toast.LENGTH_SHORT);

            if(toast.getView() != null) {
                if (toast.getView().isShown())
                    toast.cancel();
                else
                    toast.show();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void networkUnAvailability(TextView textView) {
        if(textView != null)
            textView.setText("No Network Available");
    }

    public String getActiveUserId() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        return preferences.getString(CURRENT_USERNAME, null);
    }

    public void saveFromDBToPrefs(Cursor cursor) {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        SharedPreferences.Editor editor = preferences.edit();
        DatabaseHelper helper = new DatabaseHelper(this);
        while (cursor.moveToNext()) {
            editor.putString(SESSION_TOKEN, cursor.getString(cursor.getColumnIndex(helper.SESSION_TOKEN)));
            editor.putString(FIRST_NAME, cursor.getString(cursor.getColumnIndex(helper.FIRST_NAME)));
            editor.putString(CURRENT_USERNAME, cursor.getString(cursor.getColumnIndex(helper.USER_NAME)));
            editor.putString(CURRENT_USER_ID, cursor.getString(cursor.getColumnIndex(helper.USER_ID)));
            editor.putString(SCHOOL_ID, cursor.getString(cursor.getColumnIndex(helper.SCHOOL_ID)));
            editor.putString(TENANT_ID, ACCESS_ID);
            editor.putString(PERMISSIONS, cursor.getString(cursor.getColumnIndex(helper.PERMISSIONS)));

            editor.putString(CLASS_ID, cursor.getString(cursor.getColumnIndex(helper.CLASS_ID)));
            editor.putString(SECTION_ID, cursor.getString(cursor.getColumnIndex(helper.SECTION_ID)));
            editor.putString(CLASS_NAME, cursor.getString(cursor.getColumnIndex(helper.CLASS_NAME)));
            editor.putString(SECTION_NAME, cursor.getString(cursor.getColumnIndex(helper.SECTION_NAME)));
            editor.apply();
        }
        cursor.close();
    }
}
