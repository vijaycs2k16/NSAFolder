package nexrise.publication.in.nexrise.Attendence;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Attendance;
import nexrise.publication.in.nexrise.R;

/**
 * Created by praga on 17-Mar-17.
 */

public class AttendanceArrayAdapter extends BaseAdapter implements Filterable  {

    Activity context;
    private List<Attendance> attendenceObjectList;
    private List<Attendance> filteredList;

    AttendanceArrayAdapter(Activity context, List<Attendance> attendenceObjectList) {

        this.context = context;
        this.attendenceObjectList = attendenceObjectList;
        filteredList = attendenceObjectList;
        getFilter();
    }

    @Override
    public int getCount() {
        return filteredList.size() ;
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
    public View getView(final int position, View convertView, @NonNull ViewGroup parent) {

        final Attendance studentObject = (Attendance) getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder =  new ViewHolder();
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.fragment_attendance_history_list_layout, parent, false);
            holder.name = (TextView) convertView.findViewById(R.id.student_name);
            holder.rno = (TextView) convertView.findViewById(R.id.student_no);
            holder.checkBox = (CheckBox) convertView.findViewById(R.id.checked_list);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
            holder.checkBox.setOnCheckedChangeListener(null);
        }
        assert studentObject!= null;
        holder.name.setText(studentObject.getFirstName());
        holder.rno.setText(studentObject.getUserName());
        holder.checkBox.setChecked(studentObject.getPresent());
        holder.checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if(!isChecked ) {
                    studentObject.setIsPresent(false);
                    filteredList.get(position).setIsPresent(false);
                } else {
                    studentObject.setIsPresent(true);
                    filteredList.get(position).setIsPresent(true);
                }
            }
        });
        return convertView;
    }

    @Override
    public Filter getFilter() {

        Filter filter = new Filter() {

            @SuppressWarnings("unchecked")
            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                filteredList = (ArrayList<Attendance>) results.values;
                notifyDataSetChanged();
            }
            @Override
            protected FilterResults performFiltering(CharSequence constraint) {
                constraint = constraint.toString().toLowerCase();
                FilterResults results = new FilterResults();
                ArrayList<Attendance> tempList = new ArrayList<>();
                // perform your search here using the searchConstraint String.
                for (int i = 0; i < attendenceObjectList.size(); i++) {
                    if (attendenceObjectList.get(i).getFirstName().toLowerCase().startsWith(constraint.toString())) {
                        tempList.add(attendenceObjectList.get(i));
                    } else if (attendenceObjectList.get(i).getUserName().toLowerCase().startsWith(constraint.toString())) {
                        tempList.add(attendenceObjectList.get(i));
                    }
                }
                results.count = tempList.size();
                results.values = tempList;
                return results;
            }
        };
        return filter;
    }

    private class ViewHolder {
        TextView name;
        TextView rno;
        CheckBox checkBox;
    }
}