package nexrise.publication.in.nexrise;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.annotation.RequiresApi;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;

import nexrise.publication.in.nexrise.BeanClass.Subjects;
import nexrise.publication.in.nexrise.ReusedActivities.AttachmentActivity;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

import static nexrise.publication.in.nexrise.Constants.EMPLOYEE;

public class UploadActivity extends AppCompatActivity {
    SharedPreferences preferences;
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_upload);

        Subjects subjects = (Subjects) getIntent().getExtras().getSerializable("subjects");

        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setTitle(subjects.getSubjectName() + " - Upload portions");
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        final LinearLayout linearLayout = (LinearLayout)findViewById(R.id.upload_activity_linear);
        ImageButton plusButton = (ImageButton)findViewById(R.id.image7);
        Button upload = (Button) findViewById(R.id.upload_button);
        EditText editText = (EditText) findViewById(R.id.monthlyname1);

        if(StringUtils.userRole.equals(EMPLOYEE)){
            editText.setVisibility(View.VISIBLE);
            upload.setVisibility(View.VISIBLE);
            plusButton.setVisibility(View.VISIBLE);
            upload.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(UploadActivity.this, AttachmentActivity.class);
                    startActivity(intent);
                }
            });

            plusButton.setOnClickListener(new View.OnClickListener() {
                @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
                @Override
                public void onClick(View v) {
                    final LinearLayout additionalLayout = new LinearLayout(UploadActivity.this);
                    LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

                    EditText editText = new EditText(UploadActivity.this);
                    additionalLayout.setBackgroundColor(Color.parseColor("#FFFFFF"));
                    additionalLayout.setLayoutParams(params);
                    additionalLayout.setWeightSum(3.0f);
                    editText.setTextSize(15);

                    LinearLayout.LayoutParams edittextParam = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 2.42f);
                    edittextParam.setMargins(0, 15, 0, 0);
                    editText.setLayoutParams(edittextParam);
                    editText.setBackgroundResource(R.drawable.border);

                    ImageButton minusButton = new ImageButton(UploadActivity.this);
                    LinearLayout.LayoutParams minusButtonParam = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 0.55f);
                    minusButtonParam.setMargins(10,10,0,0);
                    minusButton.setBackgroundColor(Color.parseColor("#2794bf"));
                    minusButton.setImageResource(R.drawable.minus_symbol);
                    minusButton.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
                    minusButton.setLayoutParams(minusButtonParam);

                    additionalLayout.addView(editText);
                    additionalLayout.addView(minusButton);
                    linearLayout.addView(additionalLayout);

                    minusButton.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            linearLayout.removeView(additionalLayout);
                        }
                    });
                }
            });

        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }
}
