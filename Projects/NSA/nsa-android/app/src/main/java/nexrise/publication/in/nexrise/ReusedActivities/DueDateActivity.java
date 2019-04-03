package nexrise.publication.in.nexrise.ReusedActivities;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;

import com.roomorama.caldroid.CaldroidFragment;
import com.roomorama.caldroid.CaldroidListener;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class DueDateActivity extends AppCompatActivity implements Constants{

    Integer mdate;
    Integer month;
    Integer year;
    String fromActivity;
    Integer hours;
    Integer minutes;
    String display = "";
    CaldroidFragment caldroidFragment;
    String selectedDate = "";
    String fromDate = "";
    Date data;
    boolean pastDate ;
    boolean futureDate;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_due_date);
        Intent intent = getIntent();
        fromActivity = intent.getStringExtra(FROM);
        pastDate = intent.getBooleanExtra(PAST_DATE_FREEZE,true);
        futureDate = intent.getBooleanExtra(FUTURE_DATE_FREEZE,true);
        caldroidFragment = new CaldroidFragment();
        display = intent.getStringExtra("Date");
        Bundle args = new Bundle();
        args.putString(CaldroidFragment.DIALOG_TITLE, "Exams");
        caldroidFragment.setArguments(args);
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.calendar, caldroidFragment);
        transaction.commit();

        if(intent.hasExtra(PAST_DATE_FREEZE) && intent.getBooleanExtra(PAST_DATE_FREEZE,false)){
            Calendar calendar = Calendar.getInstance();
            calendar.getTime();
            caldroidFragment.setMinDate(calendar.getTime());
        }

        if(intent.hasExtra(FUTURE_DATE_FREEZE) && intent.getBooleanExtra(FUTURE_DATE_FREEZE,false)){
            Calendar calendar = Calendar.getInstance();
            calendar.getTime();
            caldroidFragment.setMaxDate(calendar.getTime());
        }

        dateClick();
        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setTitle(display);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
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

    public void dateClick(){

      caldroidFragment.setCaldroidListener(new CaldroidListener() {
          @Override
          public void onSelectDate(Date date, View view) {

              SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
              selectedDate = dateFormat.format(date);
              SimpleDateFormat dateFormat1 = new SimpleDateFormat("MMMdd,yyyy");
              String sendDate = dateFormat1.format(date);
              caldroidFragment.setSelectedDate(date);
              caldroidFragment.refreshView();
              caldroidFragment.clearSelectedDates();
              String[] strAry = selectedDate.split("-");
              mdate = Integer.parseInt(strAry[0]);
              month = Integer.parseInt(strAry[1]);
              year = Integer.parseInt(strAry[2]);
              Intent intent = new Intent();
              intent.putExtra("SelectedDate",sendDate);
              intent.putExtra("Date", mdate);
              intent.putExtra("Month", month);
              intent.putExtra("Year", year);
              intent.putExtra("Hours", hours);
              intent.putExtra("Minutes", minutes);
              setResult(RESULT_OK, intent);
              Log.v("date", mdate.toString());
              Log.v("month", month.toString());
              Log.v("year", year.toString());
              finish();
          }
      });

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == 6) {
            hours = data.getIntExtra("Hours",0);
            minutes = data.getIntExtra("Minutes",0);
            Log.v("On activity ", "result Due time " + hours);
            Log.v("On activity ", "result Due time " + minutes);
            Intent intent = new Intent();
            intent.putExtra("Date", mdate);
            intent.putExtra("Month",month);
            intent.putExtra("Year",year);
            intent.putExtra("Hours",hours);
            intent.putExtra("Minutes",minutes);
            setResult(RESULT_OK, intent);
            finish();
        }
    }
}
