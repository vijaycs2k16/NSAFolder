package nexrise.publication.in.nexrise.EventsFeature;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.widget.TextView;

import nexrise.publication.in.nexrise.BeanClass.PastEventObject;
import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class PastEventDetailActivity extends AppCompatActivity {


    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_past_event_detail);
        Intent intent = getIntent();
        Bundle bundle = intent.getBundleExtra("bundle");
        PastEventObject pastEventObject = (PastEventObject) bundle.getSerializable("PastObject");
        TextView eventTitle = (TextView) findViewById(R.id.event_title);
        TextView startTime = (TextView) findViewById(R.id.start_time);
        TextView endTime = (TextView) findViewById(R.id.end_time);
        TextView category = (TextView) findViewById(R.id.category);
        TextView teacherName = (TextView) findViewById(R.id.teacher_name);
        TextView description = (TextView) findViewById(R.id.event_description);
        eventTitle.setText(pastEventObject.getEventName());
        startTime.setText(pastEventObject.getStartDate());
        endTime.setText(pastEventObject.getEndDate());
        category.setText(pastEventObject.getEventTypeName());
        teacherName.setText(pastEventObject.getUpdatedUserName());
        description.setText(pastEventObject.getEventDesc());

        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.past_events);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
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
}
