package nexrise.publication.in.nexrise.Common;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.widget.CardView;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.Toast;

import com.google.android.gms.analytics.Tracker;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class LoginActivity extends BaseLoginActivity implements Constants{

    private EditText eUsername;
    private EditText ePassword;
    private Button signInBtn;
    private Button registerBtn;
    boolean userExist = false;
    int positon = 0;
    Tracker tracker;
    SharedPreferences preferences;
    SharedPreferences.Editor editor;
    HashMap<String, String> device_token = new HashMap<>();
    FrameLayout frameLayout;
    String encodedUserName;
    public static boolean login = true;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        login = true;
        new StringUtils().isNetworkConnected(this);

        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        editor = preferences.edit();
        frameLayout = (FrameLayout) findViewById(R.id.frame);
        if(LoginActivity.this.getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE)
            frameLayout.setVisibility(View.GONE);
        eUsername = (EditText) findViewById(R.id.username);
        ePassword = (EditText) findViewById(R.id.password);
        signInBtn = (Button) findViewById(R.id.signin);
        eUsername.setHint(R.string.user_name);
        ePassword.setHint(R.string.password);

        String value = Utility.readProperty(LoginActivity.this,LOGIN_BG);
        if (value.contains(ACCESS_ID)) {
            eUsername.setBackgroundResource(R.color.colorWhite);
            eUsername.setTextColor(R.color.colorBlack);
            eUsername.setHintTextColor(R.color.colorBlack);
            Drawable imgResource =  getResources().getDrawable(R.drawable.user_icon_black);
            eUsername.setCompoundDrawablesWithIntrinsicBounds(imgResource, null, null, null);
            ePassword.setBackgroundResource(R.color.colorWhite);
            ePassword.setTextColor(R.color.colorBlack);
            ePassword.setHintTextColor(R.color.colorBlack);
            Drawable imgResource2 =  getResources().getDrawable(R.drawable.passowrd_black);
            ePassword.setCompoundDrawablesWithIntrinsicBounds(imgResource2, null, null, null);
            LinearLayout background = (LinearLayout) findViewById(R.id.main);
            background.setBackgroundResource(R.drawable.narayana_login_bg);
            CardView cardView = (CardView) findViewById(R.id.card);
            cardView.setVisibility(View.INVISIBLE);
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        }

        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.hide();
        }
        signIn();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        //check config
        if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            frameLayout.setVisibility(View.GONE); //set visibility of linearLayout as Gone
        } else if(newConfig.orientation == Configuration.ORIENTATION_PORTRAIT){
            frameLayout.setVisibility(View.VISIBLE);
        }
    }

    public void signIn() {
        final RadioButton parent = (RadioButton)findViewById(R.id.parent);
        final RadioButton employeeOrStudent = (RadioButton)findViewById(R.id.emp_student);

        signInBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String username = eUsername.getText().toString().trim();
                final String password = ePassword.getText().toString();
                encodedUserName = username;

                if (username.isEmpty()) {
                    Toast toast = Toast.makeText(LoginActivity.this, R.string.enter_user_name,Toast.LENGTH_SHORT);
                    toast.setGravity(Gravity.CENTER,0,0);
                    toast.show();
                } else if (password.isEmpty()) {
                    Toast toast = Toast.makeText(LoginActivity.this, R.string.enter_password,Toast.LENGTH_SHORT);
                    toast.setGravity(Gravity.CENTER,0,0);
                    toast.show();
                } else if(!parent.isChecked() && !employeeOrStudent.isChecked()) {
                    Toast toast = Toast.makeText(LoginActivity.this,"Please select a category",Toast.LENGTH_SHORT);
                    toast.setGravity(Gravity.CENTER,0,0);
                    toast.show();
                } else {
                    SessionExpiredException.alertDialogCount = 0;
                    JSONObject credentials = new JSONObject();
                    try {
                        credentials.put("username", username);
                        credentials.put("password", password);
                        credentials.put("accessId", ACCESS_ID);
                        encodedUserName = Uri.encode(username);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    //This parent username will be used for change password for parent login who has more than one child
                    editor.putString(PARENT_USERNAME, encodedUserName).apply();

                    if (parent.isChecked())
                        handleParenLogin(credentials);
                    else {
                        // First rest call which authenticates the user and returns school_id, tenant_id, id, user_name, school_name
                        String authenticateUrl = BASE_URL + API_VERSION_ONE + AUTHENTICATE + "/" + APP;
                        POSTUrlConnection urlConnection = new POSTUrlConnection(credentials, authenticateUrl, null, LoginActivity.this) {
                            ProgressDialog dialog = new ProgressDialog(LoginActivity.this, ProgressDialog.STYLE_SPINNER);

                            @Override
                            protected void onPreExecute() {
                                super.onPreExecute();
                                dialog.setMessage(getResources().getText(R.string.authenticating));
                                dialog.setCancelable(false);
                                dialog.setCanceledOnTouchOutside(false);
                                dialog.show();
                            }

                            @Override
                            protected void onPostExecute(String response) {
                                super.onPostExecute(response);
                                try {
                                    Log.v("response ", " " + response);
                                    if(response.contains("Connection too slow"))
                                        throw new IOException();
                                    JSONObject responseObj = new JSONObject(response);
                                    JSONObject data = responseObj.getJSONObject(DATA);
                                    String currentUserId = handleToken(data, encodedUserName, true);

                                    getUserAndConfig(currentUserId);
                                    dialog.dismiss();

                                } catch (IOException e) {
                                    dialog.dismiss();
                                    Toast toast = Toast.makeText(LoginActivity.this, R.string.connection_too_slow, Toast.LENGTH_SHORT);
                                    toast.setGravity(Gravity.CENTER, 0, 0);
                                    toast.show();
                                } catch (Exception e) {
                                    e.printStackTrace();
                                    dialog.dismiss();
                                    Toast toast = Toast.makeText(LoginActivity.this, R.string.invalid_credentials, Toast.LENGTH_SHORT);
                                    toast.setGravity(Gravity.CENTER, 0, 0);
                                    toast.show();
                                }
                            }
                        };
                        if (isConnected())
                            urlConnection.execute();
                        else {
                            Toast toast = Toast.makeText(LoginActivity.this, "Please Check Internet Connection", Toast.LENGTH_SHORT);
                            toast.setGravity(Gravity.CENTER, 0, 0);
                            toast.show();
                        }
                    }
                }
            }
        });
    }

    private void handleParenLogin(JSONObject credentials) {
        final DatabaseHelper helper = new DatabaseHelper(this);

        String url = BASE_URL + API_VERSION_ONE + AUTHENTICATE + "/" + APP + "/" + PARENT;
        Log.v("Login ", " url " + url);
        POSTUrlConnection urlConnection = new POSTUrlConnection(credentials, url, null, LoginActivity.this) {
            ProgressDialog dialog = new ProgressDialog(LoginActivity.this, ProgressDialog.STYLE_SPINNER);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                dialog.setMessage(getResources().getText(R.string.authenticating));
                dialog.setCancelable(false);
                dialog.setCanceledOnTouchOutside(false);
                dialog.show();
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                String currentUserId = "";
                try {
                    Log.v("Login ", " response " + response);
                    if(response.contains("Connection too slow"))
                        throw new IOException();
                    JSONObject responseObj = new JSONObject(response);
                    dialog.dismiss();
                    Object dataObj = responseObj.get(DATA);
                    if(dataObj instanceof JSONObject) {
                        JSONObject data = responseObj.getJSONObject(DATA);
                        if (data.has("id_token"))
                            currentUserId = handleToken(data, encodedUserName, true);
                    } else if(dataObj instanceof JSONArray) {
                        JSONArray dataAry = responseObj.getJSONArray(DATA);
                        if (dataAry == null || dataAry.length() == 0)
                            throw new Exception("invalid");
                        if (editor == null) editor = PreferenceManager.getDefaultSharedPreferences(LoginActivity.this).edit();
                        StringUtils.userRole = "Parent";
                        editor.putString(USER_ROLE, "Parent").apply();

                        helper.storePreferences(dataAry.toString());
                        parseMultipleSchools(dataAry);
                        return;
                    }
                    getUserAndConfig(currentUserId);
                } catch (IOException e) {
                    dialog.dismiss();
                    Toast toast = Toast.makeText(LoginActivity.this, R.string.connection_too_slow, Toast.LENGTH_SHORT);
                    toast.setGravity(Gravity.CENTER, 0, 0);
                    toast.show();
                } catch (Exception e) {
                    e.printStackTrace();
                    dialog.dismiss();
                    Toast toast = Toast.makeText(LoginActivity.this, R.string.invalid_credentials, Toast.LENGTH_SHORT);
                    toast.setGravity(Gravity.CENTER, 0, 0);
                    toast.show();

                }
            }
        };
        if (isConnected())
            urlConnection.execute();
        else {
            Toast toast = Toast.makeText(LoginActivity.this, "Please Check Internet Connection", Toast.LENGTH_SHORT);
            toast.setGravity(Gravity.CENTER, 0, 0);
            toast.show();
        }
    }

    @Override
    public void onBackPressed() {
        // Back button click minimises the app
        Intent home = new Intent(Intent.ACTION_MAIN);
        home.addCategory(Intent.CATEGORY_HOME);
        home.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(home);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}