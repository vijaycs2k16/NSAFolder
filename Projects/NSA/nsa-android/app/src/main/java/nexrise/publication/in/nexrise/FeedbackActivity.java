package nexrise.publication.in.nexrise;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class FeedbackActivity extends AppCompatActivity implements Constants {
    SharedPreferences preferences;
    StringUtils stringUtils = new StringUtils();
    EditText feedback;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        preferences = PreferenceManager.getDefaultSharedPreferences(FeedbackActivity.this);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_feedback);
        Button button = (Button) findViewById(R.id.button);
        feedback = (EditText) findViewById(R.id.feedback);
            button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (!feedback.getText().toString().isEmpty()) {
                        String url = BASE_URL + API_VERSION_ONE + FEEDBACK;
                        POSTUrlConnection postUrlConnection = new POSTUrlConnection(CreateJson(feedback.getText().toString()), url, stringUtils.getHeaders(FeedbackActivity.this), FeedbackActivity.this) {
                            ProgressDialog dialog = new ProgressDialog(FeedbackActivity.this, ProgressDialog.STYLE_SPINNER);
                            @Override
                            protected void onPreExecute() {
                                super.onPreExecute();
                                dialog.setMessage(getResources().getText(R.string.sending_feedback));
                                dialog.setCancelable(false);
                                dialog.setCanceledOnTouchOutside(false);
                                dialog.show();
                            }
                            @Override
                            protected void onPostExecute(String response) {
                                super.onPostExecute(response);
                                if(response != null) {
                                    dialog.dismiss();
                                    try {
                                        stringUtils.checkSession(response);
                                        JSONObject jsonObject = new JSONObject(response);
                                        Boolean success = jsonObject.getBoolean(SUCCESS);
                                        if (success) {
                                            JSONObject dataObject = jsonObject.getJSONObject(DATA);
                                            String message = dataObject.getString("message");
                                            Toast toast = Toast.makeText(FeedbackActivity.this, message, Toast.LENGTH_SHORT);
                                            toast.setGravity(Gravity.CENTER_VERTICAL, 0, 180);
                                            toast.show();
                                            finish();
                                        } else {
                                            JSONObject dataObject = jsonObject.getJSONObject(DATA);
                                            String message = dataObject.getString("message");
                                            Toast toast = Toast.makeText(FeedbackActivity.this, message, Toast.LENGTH_SHORT);
                                            toast.setGravity(Gravity.CENTER_VERTICAL, 0, 180);
                                            toast.show();
                                        }
                                    } catch (SessionExpiredException e) {
                                        e.handleException(FeedbackActivity.this);
                                    } catch (Exception e){
                                        e.printStackTrace();
                                    }
                                } else {
                                    Toast toast = Toast.makeText(FeedbackActivity.this, R.string.feedback_not_sent, Toast.LENGTH_SHORT);
                                    toast.setGravity(Gravity.CENTER_VERTICAL, 0, 180);
                                    toast.show();
                                }
                            }
                        };
                        postUrlConnection.execute();
                    }else {
                        Toast toast = Toast.makeText(FeedbackActivity.this, R.string.please_write_feedback, Toast.LENGTH_SHORT);
                        toast.setGravity(Gravity.CENTER_VERTICAL, 0, 180);
                        toast.show();
                    }
                }
            });


        ActionBar actionBar = getSupportActionBar();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle(R.string.suggestions);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

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
    public JSONObject CreateJson(String feedback){
        JSONObject mainObject = new JSONObject();
        try {
            mainObject.put("feedback_desc",feedback);
            mainObject.put("class_name",preferences.getString(CLASS_NAME,null));
            mainObject.put("section_name",preferences.getString(SECTION_NAME,null));
            mainObject.put("class_id",preferences.getString(CLASS_ID,null));
            mainObject.put("first_name",preferences.getString(FIRST_NAME,null));
            mainObject.put("section_id",preferences.getString(SECTION_ID,null));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.v("JSon","Object"+mainObject);
        return mainObject;
    }

}
