package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.DueDateActivity;
import nexrise.publication.in.nexrise.ReusedActivities.DueTimeActivity;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class CreatingExam extends AppCompatActivity implements Constants {
    ArrayAdapter adaptermonth;
    Context context;
    static View textview;
    String date = " ";
    String dueDates = "";
    static  View textView;
    String dueTimes = "";
    TextView dueDate;
    TextView dueTime;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_creating_exam);

        Spinner spinner = (Spinner) findViewById(R.id.subjectspinner1);
        Spinner spinner1 = (Spinner) findViewById(R.id.classspinner1);
        ArrayAdapter<String> spinnerClassArrayAdapter = new ArrayAdapter<String>(CreatingExam.this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.Class));
        spinner1.setAdapter(spinnerClassArrayAdapter);
        ArrayAdapter<String> spinnerSubjectArrayAdapter = new ArrayAdapter<String>(CreatingExam.this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.Subjects));
        spinner.setAdapter(spinnerSubjectArrayAdapter);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dueDates = dateFormat.format(calendar.getTime());
        dueTimes = new SimpleDateFormat("HH:mm").format(calendar.getTime());


        ActionBar actionBar = getSupportActionBar();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setTitle("Add Exam");
        }

        LinearLayout dateclick = (LinearLayout) findViewById(R.id.datesclick);
        LinearLayout timeclick = (LinearLayout) findViewById(R.id.timesclick);
        dueDate = (TextView) findViewById(R.id.dateView);
        dueDate.setText(dueDates);
        dueTime = (TextView) findViewById(R.id.timeview);
        dueTime.setText(dueTimes);

        //  EditText d = (EditText) rootView.findViewById(R.id.dispaly);
        //EditText e = (EditText) rootView.findViewById(R.id.timedispaly);

        dateclick.setOnClickListener(new View.OnClickListener()
        {
            public void onClick(View v)
            {
                Intent intent = new Intent(CreatingExam.this, DueDateActivity.class);
                intent.putExtra("Activity", "CreatingExam");
                intent.putExtra(FROM, "Exam");
                startActivityForResult(intent,2);


            }

        });
        timeclick.setOnClickListener(new View.OnClickListener()
        {
            public void onClick(View v)
            {
                Intent intent = new Intent(CreatingExam.this, DueTimeActivity.class);
                intent.putExtra("Activity","CreatingExam");
                startActivityForResult(intent,3);



            }


        });

    }



    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.add_homework_actionbar, menu);
        return true;
    }



    @Override
    public View onCreateView(String name, Context context, AttributeSet attrs) {
        return super.onCreateView(name, context, attrs);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                break;
            case R.id.tick:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View rootView = inflater.inflate(R.layout.activity_creating_exam, container, false);
        LinearLayout dateclick = (LinearLayout) rootView.findViewById(R.id.datesclick);
        LinearLayout timeclick = (LinearLayout) rootView.findViewById(R.id.timesclick);
        Spinner spinner = (Spinner) rootView.findViewById(R.id.subjectspinner1);
        Spinner spinner1 = (Spinner) rootView.findViewById(R.id.classspinner1);
        dueDate = (TextView)rootView.findViewById(R.id.dateView);
        dueDate.setText(dueDates);
        dueTime = (TextView)rootView.findViewById(R.id.timeview);
        dueTime.setText(dueTimes);

        //  EditText d = (EditText) rootView.findViewById(R.id.dispaly);
        //EditText e = (EditText) rootView.findViewById(R.id.timedispaly);

        dateclick.setOnClickListener(new View.OnClickListener()
        {
            public void onClick(View v)
            {
                Intent intent = new Intent(CreatingExam.this, DueDateActivity.class);
                intent.putExtra("Activity", "CreatingExam");
                startActivityForResult(intent,2);


            }

        });
        timeclick.setOnClickListener(new View.OnClickListener()
        {
            public void onClick(View v)
            {
                Intent intent = new Intent(CreatingExam.this, DueTimeActivity.class);
                intent.putExtra("Activity","CreatingExam");
                startActivityForResult(intent,3);



            }


        });

        ArrayAdapter<String> spinnerClassArrayAdapter = new ArrayAdapter<String>(CreatingExam.this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.Class));
        spinner1.setAdapter(spinnerClassArrayAdapter);
        ArrayAdapter<String> spinnerSubjectArrayAdapter = new ArrayAdapter<String>(CreatingExam.this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.Subjects));
        spinner.setAdapter(spinnerSubjectArrayAdapter);




        return rootView;



     /*  final List<String> months = new ArrayList<String>();
        View view = inflater.inflate(R.layout.fragment_create_exam2, container, false);
        final Spinner spinner = (Spinner) view.findViewById(R.id.monthspin);
        ArrayAdapter<CharSequence> dataAdapter1 =  ArrayAdapter.createFromResource(getActivity(), R.array.Months,
                android.R.layout.simple_spinner_item);
        dataAdapter1.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        //MonthAdapter adapter1 = new MonthAdapter(getActivity(),months);

        spinner.setAdapter(dataAdapter1);
        return view;*/

        //return null;  //return inflater.inflate(R.layout.fragment_create_exam2, container, false);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        //startActivityForResult(dueTimeActivity, 3);
        if(requestCode==2) {
            if (data.getIntExtra("Date", 0) != 0) {
                dueDates = data.getIntExtra("Date", 0) + "/" + data.getIntExtra("Month", 0) + "/" + data.getIntExtra("Year", 0);
                dueDate.setText(dueDates);
            }
            Log.v("On activity ","result Due date " +data.getIntExtra("Date", 0));
            Log.v("On activity ","result Due month " +data.getIntExtra("Month", 0));
            Log.v("On activity ","result Due year " +data.getIntExtra("Year", 0));

        }
        if(requestCode==3){
            if(data.getIntExtra("Hours", 0) != 0) {
                dueTimes = data.getIntExtra("Hours", 0)+":"+data.getIntExtra("Minutes", 0);
                Log.v("Due time "," "+dueTimes);
                dueTime.setText(dueTimes);
            }
            Log.v("On activity ","result Due time "+data.getIntExtra("Hours", 0));
            Log.v("On activity ","result Due time "+data.getIntExtra("Minutes", 0));

        }
    }




}
