package nexrise.publication.in.nexrise.FeeManagement;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.R;


/**
 * Created by karthik on 13-10-2016.
 */

public class FeesDetailsArrayAdapter extends ArrayAdapter<String> {
    private  Activity context;
    private ArrayList<String> stringArrayList;
    //private String[] ary;
    private ArrayList<String> ary;

    public FeesDetailsArrayAdapter(Activity context,ArrayList<String> ary,  ArrayList<String> stringArrayList) {
        super(context, R.layout.activity_fees_details_layout, stringArrayList);
        this.context = context;
        this.stringArrayList = stringArrayList;
        this.ary = ary;
    }
    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.activity_fees_details_layout, parent, false);
            holder.feeDetailName = (TextView) convertView.findViewById(R.id.textView14);
            holder.feeDetailValue = (TextView) convertView.findViewById(R.id.textView15);
          /* if (ary[position].equals("Parents contact information")) {
                holder.feeDetailValue.setVisibility(View.GONE);
            } else {
                holder.feeDetailValue.setVisibility(View.VISIBLE);
            }*/
            convertView.setTag(holder);
        }else {
            holder = (ViewHolder) convertView.getTag();
        }
        assert stringArrayList!= null;
        holder.feeDetailName.setText(ary.get(position));
        holder.feeDetailValue.setText(stringArrayList.get(position));
        return convertView;
    }
    private class ViewHolder{
        TextView feeDetailName;
        TextView feeDetailValue;
    }
}
