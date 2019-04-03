package nexrise.publication.in.nexrise;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import nexrise.publication.in.nexrise.Common.BaseActivity;
import nexrise.publication.in.nexrise.Common.DatabaseHelper;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class PasswordChangeActivity extends BaseActivity implements Constants {
    EditText oldPassword;
    EditText newPassword;
    EditText confirmPassword;
    SharedPreferences sharedPreferences;
    DatabaseHelper databaseHelper;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_password_change);
        Button button = (Button) findViewById(R.id.button);
        sharedPreferences = PreferenceManager.getDefaultSharedPreferences(PasswordChangeActivity.this);
        String currentUser = sharedPreferences.getString(USER_ROLE,null);
        databaseHelper = new DatabaseHelper(this);

        oldPassword = (EditText) findViewById(R.id.oldpassword);
        newPassword = (EditText) findViewById(R.id.newpassword);
        confirmPassword = (EditText) findViewById(R.id.confirmpassword);
        TextView hint =  (TextView) findViewById(R.id.notehint);
        String note = "Note ";
        String emp = ": Changing password here will be applicable only for the Employee Login.";
        String parent = ": Changing password here will be applicable only for the Parent Login (with mobile number as username).";
        String student = ": Changing password here will be applicable only for this student.";

        if (currentUser.equalsIgnoreCase(EMPLOYEE)) {
            String totalString = note + emp;
            Spannable spanText = new SpannableString(totalString);
            spanText.setSpan(new ForegroundColorSpan(getResources()
                    .getColor(R.color.colorRed)), 0, note.length(), 0);
            hint.setText(spanText);
        } else {
            Cursor cursor = databaseHelper.getPreferenceValues();
            if (cursor.getCount() > 0) {
                String totalString2 = note + parent;
                Spannable spanText2 = new SpannableString(totalString2);
                spanText2.setSpan(new ForegroundColorSpan(getResources()
                        .getColor(R.color.colorRed)), 0, note.length(), 0);
                hint.setText(spanText2);
            }
            else {
                String totalString3 = note + student;
                Spannable spanText3 = new SpannableString(totalString3);
                spanText3.setSpan(new ForegroundColorSpan(getResources()
                        .getColor(R.color.colorRed)), 0, note.length(), 0);
                hint.setText(spanText3);
            }
        }
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String old = oldPassword.getText().toString();
                String newPwd = newPassword.getText().toString();
                String confirm = confirmPassword.getText().toString();

                if (!old.isEmpty() && !newPwd.isEmpty() && !confirm.isEmpty()) {
                    if (!old.equals(newPwd)) {
                        if (newPwd.equals(confirm)) {
                            DatabaseHelper helper = new DatabaseHelper(PasswordChangeActivity.this);
                            Cursor cursor = helper.getAllUser();
                            if(cursor.getCount() > 1) {
                                String changePwdUrl = BASE_URL + API_VERSION_ONE + AUTHENTICATE +"/"+ PARENT + CHANGE_PASSWORD;
                                JSONObject jsonObject = new JSONObject();
                                try {
                                    SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(PasswordChangeActivity.this);
                                    String username = preferences.getString(PARENT_USERNAME, null);
                                    jsonObject.put("username", username);
                                    jsonObject.put("oldPassword",old);
                                    jsonObject.put("newPassword",newPwd);
                                    jsonObject.put("confirmNewPassword",confirm);
                                    changePassword(changePwdUrl, jsonObject);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }

                            } else {
                                final JSONObject passwordObject = new JSONObject();
                                try {
                                    passwordObject.put("oldPassword",old);
                                    passwordObject.put("newPassword",newPwd);
                                    passwordObject.put("confirmNewPassword",confirm);
                                    final String passwordCredential = BASE_URL + API_VERSION_ONE + AUTHENTICATE + CHANGE_PASSWORD;
                                    changePassword(passwordCredential, passwordObject);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            }

                        } else
                            showToast((String) getResources().getText(R.string.new_confirm_pass));
                    } else
                        showToast((String) getResources().getText(R.string.old_new_pass));
                } else
                    showToast((String) getResources().getText(R.string.enter_pass_cahnge));

            }
        });

        ActionBar actionBar = getSupportActionBar();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle(R.string.change_password);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
    }

    private void changePassword(String url, JSONObject updateJson) {
        UPDATEUrlConnection passwordUrl = new UPDATEUrlConnection(PasswordChangeActivity.this, url,null, updateJson) {
            ProgressDialog progressDialog = new ProgressDialog(PasswordChangeActivity.this);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressDialog.setMessage("Changing Password...");
                progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
                progressDialog.setCancelable(false);
                progressDialog.setCanceledOnTouchOutside(false);
                progressDialog.show();
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Password","response"+response);
                if (response != null) {
                    try {
						new StringUtils().checkSession(response);
                        if(response.contains("Connection too slow"))
                            throw new IOException();
                        JSONObject responseObj = new JSONObject(response);
                        boolean success = responseObj.getBoolean(SUCCESS);
                        JSONObject dataObject = responseObj.getJSONObject(DATA);
                        String message = dataObject.getString("message");
                        
                        Toast toast = Toast.makeText(PasswordChangeActivity.this, message, Toast.LENGTH_SHORT);
                        toast.setGravity(Gravity.CENTER_VERTICAL, 0, 130);
                        toast.show();

                        if(success) finish();
                    } catch (SessionExpiredException e) {
						progressDialog.dismiss();
                        e.handleException(PasswordChangeActivity.this);
                    } catch (IOException e) {
                        progressDialog.dismiss();
                        Toast toast = Toast.makeText(PasswordChangeActivity.this, R.string.connection_too_slow, Toast.LENGTH_SHORT);
                        toast.setGravity(Gravity.CENTER, 0, 0);
                        toast.show();
                    } catch (JSONException | NullPointerException e) {
                        progressDialog.dismiss();
                        e.getMessage();
                    } 
                } else {
                    progressDialog.dismiss();
                    showToast((String) getResources().getText(R.string.pass_not_changed));
                }
            }
        };

        if(isConnected())
            passwordUrl.execute();
        else
            showToast((String) getResources().getText(R.string.please_check_internet_connection));
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
