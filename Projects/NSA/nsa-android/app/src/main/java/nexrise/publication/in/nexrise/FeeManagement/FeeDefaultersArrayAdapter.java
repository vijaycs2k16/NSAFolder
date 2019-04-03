package nexrise.publication.in.nexrise.FeeManagement;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.FeeManagement;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by karthik on 16-10-2016.
 */

public class FeeDefaultersArrayAdapter extends ArrayAdapter<FeeManagement>{

    private Activity context;
    public FeeDefaultersArrayAdapter(Activity context, List<FeeManagement> feeDefaultersList) {
        super(context, R.layout.fragment_pending_fees_layout, feeDefaultersList);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        FeeManagement feeDefaulters = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.fragment_pending_fees_layout, parent, false);
            holder.feeDefaulterName = (TextView) convertView.findViewById(R.id.textView11);
            holder.feeDefaulterDate = (TextView) convertView.findViewById(R.id.textView13);
            convertView.setTag(holder);
        }else {
            holder = (ViewHolder) convertView.getTag();
        }
        assert feeDefaulters!= null;
        holder.feeDefaulterName.setText(feeDefaulters.getfirstName());
        holder.feeDefaulterDate.setText("Overdue "+ new StringUtils().Dateset(feeDefaulters.getDueDate()));

        return convertView;
    }
    private class ViewHolder{
        TextView feeDefaulterName;
        TextView feeDefaulterDate;
    }
}
