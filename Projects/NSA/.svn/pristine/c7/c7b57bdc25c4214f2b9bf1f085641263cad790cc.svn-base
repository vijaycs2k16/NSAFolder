package nexrise.publication.in.nexrise.FeeManagement;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;

import com.michael.easydialog.EasyDialog;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.FeeDefaulters;
import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class FeeDefaultersActivity extends AppCompatActivity {
    ArrayList<FeeDefaulters> feeDefaultersList = new ArrayList<>();
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fee_defaulters);


        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.fee_management);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }


        final Spinner spinner = (Spinner)findViewById(R.id.classspin);
        final Spinner spinner1 = (Spinner)findViewById(R.id.section_spin);
        ArrayAdapter<String> spinnerCategoryArrayAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.Class));
        spinner.setAdapter(spinnerCategoryArrayAdapter);
        ArrayAdapter<String> spinnerCategoryArrayAdapter1 = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.Section));
        spinner1.setAdapter(spinnerCategoryArrayAdapter1);
        ListView listView = (ListView)findViewById(R.id.fee_defaulters_listview);
        listviewClick(listView);
        customTooltip(listView);
    }

    public void customTooltip(ListView listView){

        final ImageView help = (ImageView)findViewById(R.id.help);

        help.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                View view = FeeDefaultersActivity.this.getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                TextView tooltip = (TextView)view.findViewById(R.id.textView53);
                tooltip.setText(R.string.fee_notify);
                tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                new EasyDialog(FeeDefaultersActivity.this).setLayout(view)
                        .setLocationByAttachedView(help)
                        .setGravity(EasyDialog.GRAVITY_BOTTOM)
                        /*.setAnimationTranslationShow(EasyDialog.DIRECTION_X, 1000, -600, 100, -50, 50, 0)
                        .setAnimationAlphaShow(1000, 0.3f, 1.0f)
                        .setAnimationTranslationDismiss(EasyDialog.DIRECTION_X, 500, -50, 800)
                        .setAnimationAlphaDismiss(500, 1.0f, 0.0f)*/
                        .setTouchOutsideDismiss(true)
                        .setMatchParent(false)
                        .setBackgroundColor(FeeDefaultersActivity.this.getResources().getColor(R.color.colorGreen))
                        .setMarginLeftAndRight(44,34)
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
                FeeDefaulters feeDefaulters = (FeeDefaulters)listView.getItemAtPosition(position);
                Intent intent = new Intent(FeeDefaultersActivity.this, FeeDefaultersDetailsActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable("FeeDefaulters",feeDefaulters);
                intent.putExtra("bundle",bundle);
                startActivity(intent);
            }
        });
    }
}
