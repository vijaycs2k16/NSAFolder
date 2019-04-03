package nexrise.publication.in.nexrise.HomeworkFeature;

import android.app.Activity;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Subject;
import nexrise.publication.in.nexrise.BeanClass.TeacherHomeWork;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by user on 23-Sep-16.
 */

class HomeWorkFragmentArrayAdapter extends BaseAdapter implements Filterable {

    Activity context;
    private List<TeacherHomeWork> homeworkList;
    private List<TeacherHomeWork> filteredList;

    HomeWorkFragmentArrayAdapter(Activity context, List<TeacherHomeWork> homeworkList) {
        this.context = context;
        this.homeworkList = homeworkList;
        this.filteredList = homeworkList;
        getFilter();
    }

    @Override
    public Filter getFilter() {
        Filter filter = new Filter() {

            @SuppressWarnings("unchecked")
            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                filteredList = (ArrayList<TeacherHomeWork>) results.values;
                notifyDataSetChanged();
            }
            @Override
            protected FilterResults performFiltering(CharSequence constraint) {
                constraint = constraint.toString().toLowerCase();
                FilterResults results = new FilterResults();
                ArrayList<TeacherHomeWork> tempList = new ArrayList<>();
                // perform your search here using the searchConstraint String.
                for (int i = 0; i < homeworkList.size(); i++) {
                    if (homeworkList.get(i).getAssignmentName().toLowerCase().startsWith(constraint.toString())) {
                        tempList.add(homeworkList.get(i));
                    } else if (homeworkList.get(i).getSubjectName().toLowerCase().startsWith(constraint.toString())) {
                        tempList.add(homeworkList.get(i));
                    }
                }
                results.count = tempList.size();
                results.values = tempList;
                return results;
            }
        };
        return filter;
    }

    public class ViewHolder{
        TextView textView;
        TextView textView4;
        TextView priority;
        TextView assignmentName;
        ImageView prioritystatus;
        LinearLayout attaching;
        TextView status;
        TextView attachmentNumber;
        TextView tag;
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
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        ViewHolder holder = new ViewHolder();
        final TeacherHomeWork homework = (TeacherHomeWork) getItem(position);

        if(convertView == null) {
            LayoutInflater inflater = context.getLayoutInflater();

            convertView = inflater.inflate(R.layout.fragment_homework_layout, parent, false);
            holder.textView = (TextView)convertView.findViewById(R.id.description);
            holder.textView4 = (TextView)convertView.findViewById(R.id.due_date_value);
            holder.assignmentName = (TextView)convertView.findViewById(R.id.assignment_name);
            //holder.priority = (TextView) convertView.findViewById(R.id.textView8);
            //holder.prioritystatus = (ImageView) convertView.findViewById(R.id.priority_value);
            holder.attaching = (LinearLayout)convertView.findViewById(R.id.attachment);
            holder.status = (TextView) convertView.findViewById(R.id.status);
            holder.attachmentNumber = (TextView) convertView.findViewById(R.id.attachment_number);
            holder.tag = (TextView)convertView.findViewById(R.id.tag);
            convertView.setTag(holder);
        } else
            holder = (ViewHolder)convertView.getTag();

        if(homework.getTag() != null) {
            holder.tag.setVisibility(View.VISIBLE);
            holder.tag.setText(homework.getTag());
        } else
            holder.tag.setVisibility(View.GONE);

        String subjects = getSubjects(homework);
        holder.assignmentName.setText(subjects+" - "+"Type: "+homework.getAssignmentTypeName());
        if (homework.getAttachments()!= null && !homework.getAttachments().isEmpty()) {
            holder.attaching.setVisibility(View.VISIBLE);
            if (homework.getAttachments().size() == 1){
                holder.attachmentNumber.setText(homework.getAttachments().size()+"-"+" Attachment");
            } else {
                holder.attachmentNumber.setText(homework.getAttachments().size()+"-"+" Attachments");
            }
        } else
            holder.attaching.setVisibility(View.GONE);

        holder.textView.setText(homework.getAssignmentName());
        holder.textView4.setText("Due: "+new StringUtils().Dateset(homework.getDueDate()));
        if(homework.getStatus().equalsIgnoreCase("published")) {
            holder.status.setText(homework.getStatus());
            holder.status.setBackgroundColor(Color.parseColor("#31A231"));
            holder.status.setTextColor(Color.WHITE);
        } else {
            holder.status.setText(homework.getStatus());
            holder.status.setBackgroundColor(Color.parseColor("#FFCC00"));
            holder.status.setTextColor(Color.WHITE);
        }
        /*switch (homework.getPriority()){
            case 3 :
                holder.prioritystatus.setColorFilter(context.getResources().getColor(R.color.lightyellow));
                holder.priority.setText("Low");
                break;
            case 2 :
                holder.prioritystatus.setColorFilter(context.getResources().getColor(R.color.orange));
                holder.priority.setText("Medium");
                break;
            case 1:
                holder.prioritystatus.setColorFilter(context.getResources().getColor(R.color.colorRed));
                holder.priority.setText("High");
                break;
            default:
                break;
        }*/
        return convertView;
    }

    private String getSubjects(TeacherHomeWork homeWork) {
        ArrayList<Subject> subjects = homeWork.getSubjects();
        StringBuilder builder = new StringBuilder();
        for (int i=0; i<subjects.size(); i++) {
            String subjectName = subjects.get(i).getSubName();
            builder.append(subjectName).append(",");
        }
        if(builder.length() > 1) {
            builder.setLength(builder.length() - 1);
            Log.v("Subjects ", " " + builder.toString());

        }
        return builder.toString();
    }
}
