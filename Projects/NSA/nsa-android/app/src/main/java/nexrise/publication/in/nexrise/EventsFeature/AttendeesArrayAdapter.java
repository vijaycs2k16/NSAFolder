package nexrise.publication.in.nexrise.EventsFeature;

import android.content.Context;
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

import nexrise.publication.in.nexrise.BeanClass.Student;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Karthik on 4/28/2017.
 */

public class AttendeesArrayAdapter extends BaseAdapter implements Filterable{

    private Context context;
    private List<Student> studentList;
    private List<Student> filteredList;

    public AttendeesArrayAdapter(Context context, List<Student> studentList) {
        this.context = context;
        this.studentList = studentList;
        filteredList = studentList;
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

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        ViewHolder holder = new ViewHolder();
        final Student student = (Student) getItem(position);
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.fragment_attendance_history_list_layout, parent, false);
            holder.checkBox = (CheckBox) convertView.findViewById(R.id.checked_list);
            holder.studentName = (TextView)convertView.findViewById(R.id.student_name);
            holder.classSection = (TextView)convertView.findViewById(R.id.student_no);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
            holder.checkBox.setOnCheckedChangeListener(null);
        }

        holder.checkBox.setChecked(student.isChecked());
        holder.studentName.setText(student.getFirstname());
        holder.classSection.setText(student.getClassName()+ " "+student.getSection());

        holder.checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if(isChecked) {
                    student.setChecked(true);
                    filteredList.get(position).setChecked(true);
                    ((AttendeesActivity)context).renderSelectedStudents(student, "Add");
                } else {
                    student.setChecked(false);
                    filteredList.get(position).setChecked(false);
                    ((AttendeesActivity)context).renderSelectedStudents(student, "Remove");
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
            protected FilterResults performFiltering(CharSequence constraint) {
                String word = constraint.toString().toLowerCase();
                FilterResults results = new FilterResults();
                ArrayList<Student> tempList = new ArrayList<>();
                // perform your search here using the searchConstraint String.
                for (int i = 0; i < studentList.size(); i++) {
                    if (studentList.get(i).getFirstname().toLowerCase().startsWith(word)) {
                        tempList.add(studentList.get(i));
                    }/* else if (studentList.get(i).getClassName().toLowerCase().startsWith(word)) {
                        tempList.add(studentList.get(i));
                    }*/
                }
                results.count = tempList.size();
                results.values = tempList;
                return results;
            }

            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                filteredList = (ArrayList<Student>) results.values;
                notifyDataSetChanged();
            }
        };
        return filter;
    }

    private class ViewHolder {
        CheckBox checkBox;
        TextView studentName;
        TextView classSection;
    }
}
