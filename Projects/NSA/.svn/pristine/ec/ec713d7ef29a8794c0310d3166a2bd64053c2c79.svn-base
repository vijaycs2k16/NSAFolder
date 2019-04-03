package nexrise.publication.in.nexrise.ProgressReportFeature;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.michael.easydialog.EasyDialog;

import org.json.JSONObject;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ProgressReport;
import nexrise.publication.in.nexrise.JsonFormation.ProgressReportJsonFormation;
import nexrise.publication.in.nexrise.JsonParser.ProgressReportJsonParser;
import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ProgressReportActivity extends AppCompatActivity {

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_progress_report);

        ActionBar actionBar = getSupportActionBar();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.progress_report_title);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        ListView listView = (ListView)findViewById(R.id.progress_report_listview);
        ProgressReportJsonFormation jsonFormation = new ProgressReportJsonFormation();
        JSONObject jsonObject = jsonFormation.formJson();
        Log.v("Progress "," "+jsonObject);
        ProgressReportJsonParser parser = new ProgressReportJsonParser();
        List<ProgressReport> progressReportList = parser.parse(jsonObject);
        ProgressReportArrayAdapter arrayAdapter = new ProgressReportArrayAdapter(this, progressReportList);
        listView.setAdapter(arrayAdapter);


        listviewClick(listView);
        customTooltip(listView);
    }

    public void customTooltip(final ListView listview){


        final ImageView help = (ImageView)findViewById(R.id.help);

        help.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                View view = ProgressReportActivity.this.getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                TextView tooltip = (TextView) view.findViewById(R.id.textView53);
                tooltip.setText(R.string.progress_report);
                tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                new EasyDialog(ProgressReportActivity.this).setLayout(view)
                        .setLocationByAttachedView(help)
                        .setGravity(EasyDialog.GRAVITY_BOTTOM)
                        /*.setAnimationTranslationShow(EasyDialog.DIRECTION_X, 1000, -600, 100, -50, 50, 0)
                        .setAnimationAlphaShow(1000, 0.3f, 1.0f)
                        .setAnimationTranslationDismiss(EasyDialog.DIRECTION_X, 500, -50, 800)
                        .setAnimationAlphaDismiss(500, 1.0f, 0.0f)*/
                        .setTouchOutsideDismiss(true)
                        .setMatchParent(false)
                        .setBackgroundColor(ProgressReportActivity.this.getResources().getColor(R.color.colorGreen))
                        .setMarginLeftAndRight(44, 34)
                        .show();
            }
        });
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

    public void listviewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                ProgressReport progressReport = (ProgressReport) listView.getItemAtPosition(position);
                Intent intent = new Intent(ProgressReportActivity.this, ProgressResultsActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable("Progress report", progressReport);
                if(progressReport.getTest().equals("Formative assessment 1")){
                    intent.putExtra("Selection",2);
                    intent.putExtra("bundle",bundle);
                    startActivity(intent);
                }
                else if(progressReport.getTest().equals("Formative assessment 2")){
                    intent.putExtra("Selection",3);
                    intent.putExtra("bundle",bundle);
                    startActivity(intent);
                } else if (progressReport.getTest().equals("Summative assessment 1")){
                    intent.putExtra("Selection",4);
                    intent.putExtra("bundle",bundle);
                    startActivity(intent);
                }

            }
        });
    }
}
