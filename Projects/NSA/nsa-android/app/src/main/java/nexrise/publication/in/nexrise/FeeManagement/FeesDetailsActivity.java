package nexrise.publication.in.nexrise.FeeManagement;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ListView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.FeeManagement;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;
/**
 * Created by praga on 28-02-2017.
 */
public class FeesDetailsActivity extends AppCompatActivity implements Constants {
    int amount = 0;
    int refunds = 0;
    String feedisount;
    final int PAYMENT_GATEWAY = 45;
    String feeId;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fees_details);
        Intent intent = getIntent();
        Bundle bundle = intent.getBundleExtra("FeesDetailsBundle");
        String from = bundle.getString("From");

        FeeManagement feeManagement = (FeeManagement)bundle.getSerializable("FeesDetails");
        feeId = feeManagement.getFeeAssignmentDetailId();
        ArrayList<String> stringArrayList = new ArrayList<String>();
        StringBuilder commaSepValueBuilder = new StringBuilder();
        for ( int i=0;i<feeManagement.getFeetype().size();i++) {
            commaSepValueBuilder.append(feeManagement.getFeetype().get(i).getName());
            if ( i != feeManagement.getFeetype().size()-1) {
                commaSepValueBuilder.append(",");
            }
            refunds = refunds + ((Integer.valueOf(feeManagement.getFeetype().get(i).getAmount()) *(feeManagement.getFeetype().get(i).getRefundable()))/100);
            /*refunding = refunds - 100;*/
        }
        stringArrayList.add(commaSepValueBuilder.toString());
        stringArrayList.add(feeManagement.getClassname());
        stringArrayList.add(feeManagement.getSectionname());
        stringArrayList.add(new StringUtils().Dateset(feeManagement.getDueDate()));
        stringArrayList.add(feeManagement.getTotalAmount());
        for ( int j=0;j<feeManagement.getScholarship().size();j++) {
            amount = amount + Integer.valueOf(feeManagement.getScholarship().get(j).getAmount());
        }

        String amounts = String.valueOf(amount);
        if (!amounts.equalsIgnoreCase("0") && !amounts.equalsIgnoreCase("null"))
            stringArrayList.add(String.valueOf(amount));
        if (feeManagement.getFeeDiscountAmount().equalsIgnoreCase("null")){
            feedisount = "0";
        } else {
            feedisount = feeManagement.getFeeDiscountAmount();
        }

        if (!feedisount.equalsIgnoreCase("0") && feedisount != null)
            stringArrayList.add(feedisount);
        stringArrayList.add(String.valueOf(refunds));
        if (feeManagement.getPaidAmount() != null && !feeManagement.getPaidAmount().equalsIgnoreCase("0"))
            stringArrayList.add(feeManagement.getPaidAmount());
        if (feeManagement.getNetamount() != null && feeManagement.getPaidAmount() != null) {
            String netAmount = feeManagement.getNetamount();
            String paidAmount = feeManagement.getPaidAmount();
            int payableAmount = Integer.parseInt(netAmount) - Integer.parseInt(paidAmount);
            stringArrayList.add(String.valueOf(payableAmount));
        }
        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle(from);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        ArrayList<String> ary = new ArrayList<String>();
        ary.add((String) getResources().getText(R.string.fee_type));
        ary.add((String) getResources().getText(R.string.std));
        ary.add((String) getResources().getText(R.string.section));
        ary.add((String) getResources().getText(R.string.due_date));
        if (from.equals("Pending Fees"))
            ary.add("Net Amount");
        else
            ary.add("Paid Amount");
        if (!amounts.equalsIgnoreCase("0") && !amounts.equalsIgnoreCase("null"))
            ary.add((String) getResources().getText(R.string.scholarship));
        if (!feedisount.equalsIgnoreCase("0") && feedisount != null)
            ary.add((String) getResources().getText(R.string.fee_discount));
        ary.add((String) getResources().getText(R.string.refund_amount));
        if (feeManagement.getPaidAmount() != null && !feeManagement.getPaidAmount().equalsIgnoreCase("0"))
            ary.add("Paid Amount");
        if (from.equals("Pending Fees"))
            ary.add("Payable Amount");

        //String[] ary = {(String) getResources().getText(R.string.fee_type), (String) getResources().getText(R.string.std), (String) getResources().getText(R.string.section), (String) getResources().getText(R.string.due_date),(String) getResources().getText(R.string.scholarship),(String) getResources().getText(R.string.fee_discount),(String) getResources().getText(R.string.amount),(String) getResources().getText(R.string.refund_amount, "Paid Amount")};
        FeesDetailsArrayAdapter arrayAdapter = new FeesDetailsArrayAdapter(this, ary, stringArrayList);
        ListView listView = (ListView)findViewById(R.id.fees_details_listview);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);

        if (from != null && from.equals("Pending Fees")) {
            if (preferences.contains(SUB_MERCHANT_ID)) {
                View payButtonLayout = this.getLayoutInflater().inflate(R.layout.pay_button, listView, false);
                listView.addFooterView(payButtonLayout);
                makePayment();
            }
        }
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

    public void makePayment() {
        Button pay = (Button)findViewById(R.id.pay);

        pay.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent paymentGateway = new Intent(FeesDetailsActivity.this, WebviewActivity.class);
                paymentGateway.putExtra("FeeId", feeId);
                startActivityForResult(paymentGateway, PAYMENT_GATEWAY);
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case PAYMENT_GATEWAY:
                if(resultCode == RESULT_OK) {
                    Intent intent = new Intent();
                    setResult(RESULT_OK, intent);
                    finish();
                }
                break;
        }
    }
}
