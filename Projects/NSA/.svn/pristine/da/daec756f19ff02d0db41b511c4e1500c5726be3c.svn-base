package nexrise.publication.in.nexrise.Attendence;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.LeaveApproval;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by praga on 24-May-17.
 */

public class LeaveApprovalArrayAdapter extends BaseAdapter implements Filterable {
    Activity context;
    private List<LeaveApproval> leaveApprovalList;
    private List<LeaveApproval> filteredList;
    public LeaveApprovalArrayAdapter(Activity context, List<LeaveApproval> leaveApprovalList) {
        this.context = context;
        this.leaveApprovalList = leaveApprovalList;
        this.filteredList = leaveApprovalList;
    }



    private class ViewHolder{
        TextView teacherName;
        TextView leaveType;
        TextView appliedDate;
        TextView duration;
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
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        ViewHolder holder = new ViewHolder();
        LeaveApproval leaveApproval = (LeaveApproval) getItem(position);
        if (convertView == null) {
            LayoutInflater inflater = context.getLayoutInflater();
            convertView = inflater.inflate(R.layout.leave_approval_list, parent, false);
            holder.teacherName = (TextView) convertView.findViewById(R.id.teacher_name);
            holder.leaveType = (TextView) convertView.findViewById(R.id.leave_type);
            holder.appliedDate = (TextView) convertView.findViewById(R.id.applied_date);
            holder.duration = (TextView) convertView.findViewById(R.id.duration);
            convertView.setTag(holder);
        }else {
            holder = (ViewHolder)convertView.getTag();
        }
        assert leaveApproval != null;
        holder.teacherName.setText(leaveApproval.getEmpName());
        holder.leaveType.setText(leaveApproval.getLeaveTypeName());
        holder.appliedDate.setText(new StringUtils().Dateset(leaveApproval.getUpdatedDate()));
        holder.duration.setText(leaveApproval.getFromDate()+" - " + leaveApproval.getToDate());
        return convertView;
    }
    @Override
    public Filter getFilter() {
        Filter filter = new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence constraint) {
                FilterResults results = new FilterResults();
                if(constraint != null && constraint.length() != 0) {
                    ArrayList<LeaveApproval> tempList = new ArrayList<>();

                    for (int i=0; i<leaveApprovalList.size(); i++) {
                        if(leaveApprovalList.get(i).getEmpName().toLowerCase().startsWith(constraint.toString().toLowerCase())) {
                            tempList.add(leaveApprovalList.get(i));
                        } else if (leaveApprovalList.get(i).getUpdatedDate().toLowerCase().startsWith(constraint.toString().toLowerCase())) {
                            tempList.add(leaveApprovalList.get(i));
                        }
                    }
                    results.count = tempList.size();
                    results.values = tempList;
                } else {
                    results.count = leaveApprovalList.size();
                    results.values = leaveApprovalList;
                }
                return results;
            }

            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                filteredList = (ArrayList<LeaveApproval>) results.values;
                notifyDataSetChanged();
            }
        };
        return  filter;
    }

}
