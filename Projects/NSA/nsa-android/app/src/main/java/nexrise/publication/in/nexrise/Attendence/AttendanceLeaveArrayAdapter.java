package nexrise.publication.in.nexrise.Attendence;

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

import nexrise.publication.in.nexrise.BeanClass.StudentAttendanceHistory;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Sai Deepak on 17-Oct-16.
 */

public class AttendanceLeaveArrayAdapter extends BaseAdapter implements Filterable {

    Activity context;
    List<StudentAttendanceHistory> studentAttendance ;
    private List<StudentAttendanceHistory> filteredList;

    public AttendanceLeaveArrayAdapter(Activity context, List<StudentAttendanceHistory> studentAttendance) {
       // super(context, R.layout.fragment_attendance_leave_list_layout, attendenceObjectList);
        this.context = context;
        this.studentAttendance = studentAttendance;
        this.filteredList = studentAttendance;
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
    public View getView(int position, View convertView, ViewGroup parent) {

        StudentAttendanceHistory studentObject = (StudentAttendanceHistory) getItem(position);
        ViewHolder holder = new ViewHolder();
        if(convertView == null) {
            LayoutInflater inflater = context.getLayoutInflater();
            convertView = inflater.inflate(R.layout.fragment_attendance_leave_list_layout, parent, false);
            holder.name = (TextView) convertView.findViewById(R.id.student_name);
            holder.classSection = (TextView) convertView.findViewById(R.id.student_no);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }
        holder.name.setText(studentObject.getFirstName());
        holder.classSection.setText(studentObject.getClassName()+ "   "+ studentObject.getSectionName());
        return convertView;
    }

    @Override
    public Filter getFilter() {

        Filter filter = new Filter() {
            @SuppressWarnings("unchecked")
            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                filteredList = (ArrayList<StudentAttendanceHistory>) results.values;
                notifyDataSetChanged();
            }

            @Override
            protected FilterResults performFiltering(CharSequence constraint) {
                constraint = constraint.toString().toLowerCase();

                FilterResults results = new FilterResults();
                ArrayList<StudentAttendanceHistory> tempList = new ArrayList<>();
                // perform your search here using the searchConstraint String.

                constraint = constraint.toString().toLowerCase();
                for (int i = 0; i < studentAttendance.size(); i++) {
                    if (studentAttendance.get(i).getFirstName().toLowerCase().startsWith(constraint.toString())){
                        tempList.add(studentAttendance.get(i));
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
        TextView classSection;
    }

}
