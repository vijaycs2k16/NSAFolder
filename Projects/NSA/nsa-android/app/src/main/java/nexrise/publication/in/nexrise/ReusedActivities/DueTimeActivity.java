package nexrise.publication.in.nexrise.ReusedActivities;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TimePicker;

import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class DueTimeActivity extends AppCompatActivity {
    int hour ;
    int minute ;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_due_time);
        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setTitle(R.string.due_time);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        selectTime();
        clickHandler();
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                Intent intent = new Intent();
                setResult(RESULT_CANCELED, intent);
                onBackPressed();
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        Intent intent = new Intent();
        setResult(RESULT_CANCELED, intent);
        finish();
    }

    public void selectTime(){
        TimePicker timePicker = (TimePicker)findViewById(R.id.timepicker);
        hour = timePicker.getCurrentHour();
        minute = timePicker.getCurrentMinute();
        timePicker.setOnTimeChangedListener(new TimePicker.OnTimeChangedListener() {
            @Override
            public void onTimeChanged(TimePicker view, int hourOfDay, int minute) {
                hour = hourOfDay;
                DueTimeActivity.this.minute = minute;
            }
        });
    }

    public void clickHandler(){
        Button okButton = (Button)findViewById(R.id.due_time_ok_btn);
        okButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent();
                intent.putExtra("Hours",hour);
                intent.putExtra("Minutes",minute);
                setResult(RESULT_OK, intent);
                finish();
            }
        });

        Button cancelButton = (Button)findViewById(R.id.due_time_cancel_btn);
        cancelButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent();
                setResult(RESULT_CANCELED, intent);
                onBackPressed();
            }
        });
    }
}
