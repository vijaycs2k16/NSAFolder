package nexrise.publication.in.nexrise.Attendence;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class OverallAttendanceActivity extends AppCompatActivity {

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_overall_attendance);

        List<String> name1 = new ArrayList<String>();
        name1.add("Akshara D");
        name1.add("Akhila R");
        name1.add("Avyesh R");
        name1.add( "Emila C");
        name1.add("Ganesh B");
        name1.add("Girish S");
        name1.add("Karthik K");
        name1.add("Pragadish B");
        name1.add("Deepak D");
        name1.add("Guhan D");

        List<String> date = new ArrayList<String>();
        date.add("October 12th");
        date.add("October 12th");
        date.add("October 13th");
        date.add("October 14th");
        date.add("October 15th");
        date.add("October 13th");
        date.add("October 15th");
        date.add("October 14th");
        date.add("October 12th");
        date.add("October 11th");

        ListView listView = (ListView) findViewById(R.id.absent_list);
        OverallAttendanceArrayAdapter adapter = new OverallAttendanceArrayAdapter(OverallAttendanceActivity.this, name1, date);
        listView.setAdapter(adapter);

        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setElevation(0);
            actionBar.setTitle("Absentees List");
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
