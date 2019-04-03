package nexrise.publication.in.nexrise.FeeManagement;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.FeeManagement;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class FeeDefaultersDetailsActivity extends AppCompatActivity {
    int amount = 0;
    String feetype;
    String feedisount;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fee_defaulters_details);
        ArrayList<String> stringList = new ArrayList<String>();
        Intent intent = getIntent();
        Bundle bundle = intent.getBundleExtra("bundle");
        FeeManagement feeDefaulters = (FeeManagement) bundle.getSerializable("FeeDefaulters");
        StringBuilder commaSepValueBuilder = new StringBuilder();
        for ( int i=0;i<feeDefaulters.getFeetype().size();i++) {
            commaSepValueBuilder.append(feeDefaulters.getFeetype().get(i).getName());
            if ( i != feeDefaulters.getFeetype().size()-1) {
                commaSepValueBuilder.append(",");
            }
        }
        stringList.add(commaSepValueBuilder.toString());

        Log.v("feetype","value "+feetype);
        stringList.add(new StringUtils().Dateset(feeDefaulters.getDueDate()));
        stringList.add(feeDefaulters.getTotalAmount());
        for ( int j=0;j<feeDefaulters.getScholarship().size();j++) {
            amount = amount + Integer.valueOf(feeDefaulters.getScholarship().get(j).getAmount());
        }
        String amounts = String.valueOf(amount);
        if (!amounts.equalsIgnoreCase("0") && !amounts.equalsIgnoreCase("null"))
            stringList.add(String.valueOf(amount));

        if (feeDefaulters.getFeeDiscountAmount().equalsIgnoreCase("null")){
            feedisount = "0";
        }else {
            feedisount = feeDefaulters.getFeeDiscountAmount();
        }

        if (!feedisount.equalsIgnoreCase("0") && feedisount != null)
            stringList.add(feedisount);
        if (feeDefaulters.getPaidAmount() != null && !feeDefaulters.getPaidAmount().equalsIgnoreCase("0"))
            stringList.add(feeDefaulters.getPaidAmount());
        if (feeDefaulters.getNetamount() != null && feeDefaulters.getPaidAmount() != null) {
            String netAmount = feeDefaulters.getNetamount();
            String paidAmount = feeDefaulters.getPaidAmount();
            int payableAmount = Integer.parseInt(netAmount) - Integer.parseInt(paidAmount);
            stringList.add(String.valueOf(payableAmount));
        }

        TextView textView = (TextView)findViewById(R.id.textView19);
        textView.setText(feeDefaulters.getClassname()+"      "+feeDefaulters.getSectionname());

        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle(feeDefaulters.getfirstName());
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        ArrayList<String> ary = new ArrayList<String>();
        ary.add((String) getResources().getText(R.string.fee_type));
        ary.add((String) getResources().getText(R.string.last_date));
        ary.add("Net Amount");
        if (!amounts.equalsIgnoreCase("0") && !amounts.equalsIgnoreCase("null"))
            ary.add((String) getResources().getText(R.string.scholarship));
        if (!feedisount.equalsIgnoreCase("0") && feedisount != null)
            ary.add((String) getResources().getText(R.string.fee_discount));
        if (feeDefaulters.getPaidAmount() != null && !feeDefaulters.getPaidAmount().equalsIgnoreCase("0"))
            ary.add("Paid Amount");
        ary.add("Payable Amount");

        //String[] strings = {(String) getResources().getText(R.string.fee_type),(String) getResources().getText(R.string.last_date),(String) getResources().getText(R.string.scholarship),(String) getResources().getText(R.string.fee_discount),(String) getResources().getText(R.string.amount)};
        FeesDetailsArrayAdapter arrayAdapter = new FeesDetailsArrayAdapter(this, ary, stringList);
        Log.v("String List"," list  "+stringList);
        ListView listView = (ListView)findViewById(R.id.fee_defaulters_details_listview);
        listView.setAdapter(arrayAdapter);
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
