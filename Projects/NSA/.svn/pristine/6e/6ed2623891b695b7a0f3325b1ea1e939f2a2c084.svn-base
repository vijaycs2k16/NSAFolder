package nexrise.publication.in.nexrise.FeeManagement;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.FeeManagement;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by karthik on 13-10-2016.
 */

public class PendingFeesArrayAdapter extends BaseAdapter implements Filterable {

    private Activity context;
    private int[] icons;
    private String appendText;
    List<FeeManagement> pendingFeeList;
    List<FeeManagement> filteredList;
    PendingFeesArrayAdapter(Activity context,  List<FeeManagement> feeManagementList, String appendText) {
        this.context = context;
        this.pendingFeeList = feeManagementList;
        this.filteredList = feeManagementList;
        this.appendText = appendText;
        getFilter();
    }

    @Override
    public int getCount() {
        return filteredList.size();
    }

    @Override
    public Object getItem(int position) {
        return filteredList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        FeeManagement management = (FeeManagement) getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.fragment_pending_fees_layout, parent, false);
            holder.feeName = (TextView)convertView.findViewById(R.id.textView11);
            holder.dueDate = (TextView)convertView.findViewById(R.id.textView13);
            convertView.setTag(holder);
        }else {
            holder = (ViewHolder) convertView.getTag();
        }
        assert management!=null;
        holder.feeName.setText(management.getFeename());
        holder.dueDate.setText(appendText+" "+ new StringUtils().Dateset(management.getDueDate()));
        return convertView;
    }

    @Override
    public Filter getFilter() {
        Filter filter = new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence charSequence) {
                charSequence = charSequence.toString().toLowerCase();
                FilterResults results = new FilterResults();
                ArrayList<FeeManagement> tempList = new ArrayList<>();
                // perform your search here using the searchConstraint String.
                for (int i = 0; i < pendingFeeList.size(); i++) {
                    if (pendingFeeList.get(i).getFeename().toLowerCase().startsWith(charSequence.toString())) {
                        tempList.add(pendingFeeList.get(i));
                    } else if (pendingFeeList.get(i).getDueDate().toLowerCase().startsWith(charSequence.toString())) {
                        tempList.add(pendingFeeList.get(i));
                    }
                }
                results.count = tempList.size();
                results.values = tempList;
                return results;
            }

            @Override
            protected void publishResults(CharSequence charSequence, FilterResults filterResults) {
                filteredList = (ArrayList<FeeManagement>) filterResults.values;
                notifyDataSetChanged();
            }
        };
        return filter;
    }

    private class ViewHolder{
        TextView feeName;
        TextView dueDate;
    }
}
