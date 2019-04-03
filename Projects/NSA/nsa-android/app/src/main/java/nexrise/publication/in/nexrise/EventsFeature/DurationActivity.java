package nexrise.publication.in.nexrise.EventsFeature;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.TabHost;
import android.widget.TimePicker;
import android.widget.Toast;

import java.util.Date;

import nexrise.publication.in.nexrise.NavigationDrawerActivity;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class DurationActivity extends AppCompatActivity {

    String startDate = null;
    String endDate = null;
    String startDateCompare = null;
    String endDateCompare = null;
    String startTime;
    String endTime;
    String stDate;
    String enDate;
    DatePicker datePicker;
    Date date;
    Toast toast;
    StringUtils stringUtils;
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_duration);
        date = new Date();
        stringUtils = new StringUtils();
        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null) {
            actionBar.setTitle(R.string.duration);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        NavigationDrawerActivity.class.getMethods();
        buttonClick();
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                Intent intent = new Intent();
                setResult(RESULT_CANCELED, intent);
                finish();
                break;
            case R.id.tick:
               /* Date startDate = new StringUtils().dateCompare1(startDateCompare);
                Date endDate = new StringUtils().dateCompare1(endDateCompare);*/

                Date endDate = new StringUtils().dateCompare1(endDateCompare);
                Date startDate = new StringUtils().dateCompare1(startDateCompare);
                if (stDate != null && enDate != null) {
                    if (!stDate.equals(enDate) || !startTime.equals(endTime)) {
                        if (endDate.after(startDate) || startDate.equals(endDate)) {
                            Intent intent1 = new Intent();
                            intent1.putExtra("Start date", this.startDate);
                            intent1.putExtra("End date", this.endDate);
                            setResult(RESULT_OK, intent1);
                            finish();
                        } else {
                            Toast.makeText(DurationActivity.this, "Please Select Valid Date", Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Toast.makeText(DurationActivity.this, R.string.select_proper_time, Toast.LENGTH_SHORT).show();
                    }
                }else {
                    Toast.makeText(DurationActivity.this, R.string.select_date_time, Toast.LENGTH_SHORT).show();
                }
                break;
        }
        return super.onOptionsItemSelected(item);
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.add_homework_actionbar, menu);
        return super.onCreateOptionsMenu(menu);
    }

    public void buttonClick(){
        final Button start = (Button)findViewById(R.id.button5);
        final Button end = (Button)findViewById(R.id.button8);

        LayoutInflater inflater = DurationActivity.this.getLayoutInflater();
        final View view = inflater.inflate(R.layout.duration_alert_dialog, null);
        final TabHost tabHost = (TabHost)view.findViewById(R.id.tab_host);
        tabHost.setup();

        TabHost.TabSpec spec = tabHost.newTabSpec("Date");
        spec.setContent(R.id.tab1);
        spec.setIndicator("Date");
        tabHost.addTab(spec);

        TabHost.TabSpec spec1 = tabHost.newTabSpec("Time");
        spec1.setContent(R.id.tab2);
        spec1.setIndicator("Time");
        tabHost.addTab(spec1);

        final AlertDialog alertDialog = new AlertDialog.Builder(DurationActivity.this).create();
        alertDialog.setView(view);

        start.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                alertDialog.show();
                Button cancel = (Button)view.findViewById(R.id.cancel);
                Button ok = (Button)view.findViewById(R.id.ok);
                datePicker = (DatePicker)view.findViewById(R.id.datePicker);

                cancel.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        alertDialog.dismiss();
                        start.setText(R.string.select_date_time_);
                    }
                });

                ok.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        //here january is taken as index 0 so only we just adding one for all months in order to display current month
                        Date todayWithZeroTime = null;
                        int month = datePicker.getMonth() + 1 ;
                        Log.v("month","current"+month);
                        int day = datePicker.getDayOfMonth();
                        int year = datePicker.getYear();
                        stDate = String.valueOf(month)+"/"+ String.valueOf(day)+"/"+String.valueOf(year);

                        TimePicker timePicker = (TimePicker)view.findViewById(R.id.timePicker);
                        Integer hour = timePicker.getCurrentHour();
                        Integer minute = timePicker.getCurrentMinute();
                        startDate = day+"/"+month+"/"+year +" - "+hour+":"+minute;
                        startDateCompare = day+"/"+month+"/"+year;
                        Date startDate = new StringUtils().dateCompare1(startDateCompare);
                        todayWithZeroTime = stringUtils.today();
                        Log.v("StartDate",""+startDate.toString());
                        Log.v("Date",""+todayWithZeroTime);
                        if ((startDate.equals(todayWithZeroTime)) || startDate.after(todayWithZeroTime)){
                            start.setText(DurationActivity.this.startDate);
                            startTime = String.valueOf(hour)+"/"+String.valueOf(minute);
                            alertDialog.dismiss();
                        }else {
                            if (toast != null)
                                toast.cancel();
                            toast = Toast.makeText(DurationActivity.this, R.string.select_valid_date,Toast.LENGTH_SHORT);
                            toast.show();
                        }

                    }
                });
            }
        });

        end.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                alertDialog.show();
                Button cancel = (Button)view.findViewById(R.id.cancel);
                Button ok = (Button)view.findViewById(R.id.ok);

                cancel.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        start.setText(R.string.select_date_time_);
                        alertDialog.dismiss();
                    }
                });

                ok.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        DatePicker datePicker = (DatePicker)view.findViewById(R.id.datePicker);
                        //here january is taken as index 0 so only we just adding one for all months in order to display current month
                        int month = datePicker.getMonth() + 1;
                        int day = datePicker.getDayOfMonth();
                        int year = datePicker.getYear();
                        enDate = String.valueOf(month)+"/"+String.valueOf(day)+"/"+String.valueOf(year);

                        TimePicker timePicker = (TimePicker)view.findViewById(R.id.timePicker);
                        Integer hour = timePicker.getCurrentHour();
                        Integer minute = timePicker.getCurrentMinute();
                        endDate = day+"/"+month+"/"+year +" - "+hour+":"+minute;
                        endDateCompare = day+"/"+month+"/"+year;
                        Date endDate = new StringUtils().dateCompare1(endDateCompare);
                        Date today = stringUtils.today();
                        if (endDate.equals(today) || endDate.after(today)) {
                            end.setText(DurationActivity.this.endDate);
                            endTime = String.valueOf(hour) + "/" + String.valueOf(minute);
                            alertDialog.dismiss();
                        }else {
                            if (toast != null)
                                toast.cancel();
                            toast = Toast.makeText(DurationActivity.this,R.string.select_valid_date,Toast.LENGTH_SHORT);
                            toast.show();
                        }
                    }
                });

            }
        });
    }

    @Override
    public void onBackPressed() {
        Intent intent = new Intent();
        setResult(RESULT_CANCELED, intent);
        finish();
    }
}
