package nexrise.publication.in.nexrise.ParentFeatures.HomeworkFeature;

import android.app.Activity;
import android.graphics.Color;
import android.support.annotation.NonNull;
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

import nexrise.publication.in.nexrise.BeanClass.ParentHomeWork;
import nexrise.publication.in.nexrise.BeanClass.Subject;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Sai Deepak on 25-Oct-16.
 */

class ParentHomeWorkArrayAdapter extends BaseAdapter implements Constants,Filterable{

    private Activity context;
    private List<ParentHomeWork> homeworkList = new ArrayList<ParentHomeWork>();
    private List<ParentHomeWork> filteredList;

    ParentHomeWorkArrayAdapter(Activity context, List<ParentHomeWork> homeworkList) {
        this.context = context;
        this.homeworkList = homeworkList;
        this.filteredList = homeworkList;
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

        ParentHomeWork homework = (ParentHomeWork) getItem(position);
        ViewHolder holder = new ViewHolder();

        if(convertView == null) {
            LayoutInflater inflater = context.getLayoutInflater();
            convertView = inflater.inflate(R.layout.fragment_parent_homework_list_layout, parent, false);

            holder.assignmentDescription = (TextView) convertView.findViewById(R.id.description);
            holder.assignmentName = (TextView) convertView.findViewById(R.id.assignment_name);
            //holder.priority = (TextView) convertView.findViewById(R.id.textView8);
            //holder.prioritystatus = (ImageView) convertView.findViewById(R.id.priority_value);
            holder.dueDate = (TextView) convertView.findViewById(R.id.due_date_value);
            holder.status = (TextView) convertView.findViewById(R.id.status);
            holder.attachment = (LinearLayout) convertView.findViewById(R.id.attaching);
            holder.attachNumber = (TextView) convertView.findViewById(R.id.attachment_number);
            holder.tag = (TextView)convertView.findViewById(R.id.tag);
            convertView.setTag(holder);
        } else
            holder = (ViewHolder) convertView.getTag();

        assert homework != null;
        ArrayList<Subject> selectedSubjectList = new ArrayList<>();
        selectedSubjectList = homework.getSubjectArrayList();
        String subjectNames = "";
        if(selectedSubjectList.size() !=0) {
            for (int i = 0; i < (selectedSubjectList.size() - 1); i++)
                subjectNames += selectedSubjectList.get(i).getSubName() + ",";
            subjectNames += selectedSubjectList.get(selectedSubjectList.size() - 1).getSubName() + ".";
        }
        holder.assignmentName.setText(subjectNames+" - "+"Type :"+homework.getAssignmentTypeName());

        if(homework.getTag() != null) {
            holder.tag.setVisibility(View.VISIBLE);
            holder.tag.setText(homework.getTag());
        } else
            holder.tag.setVisibility(View.GONE);

        if(homework.getAttachments()!=null && !homework.getAttachments().isEmpty()) {
            String suffix = homework.getAttachments().size() == 1 ? " - Attachment": " - Attachments";
            holder.attachment.setVisibility(View.VISIBLE);
            holder.attachNumber.setText(homework.getAttachments().size()+ suffix);
        } else
            holder.attachment.setVisibility(View.GONE);

        holder.assignmentDescription.setText(homework.getAssignmentName());
        holder.dueDate.setText( new StringUtils().Dateset("Due: "+homework.getDueDate()));
        /*switch (homework.getPriority()) {
            case 3 :
                holder.prioritystatus.setColorFilter(context.getResources().getColor(R.color.lightyellow));
                holder.priority.setText("Low Priority");
                break;
            case 2 :
                holder.prioritystatus.setColorFilter(context.getResources().getColor(R.color.orange));
                holder.priority.setText("Medium Priority");
                break;
            case 1:
                holder.prioritystatus.setColorFilter(context.getResources().getColor(R.color.colorRed));
                holder.priority.setText("High Priority");
                break;
        }*/

        if (homework.getIsSubmitted().equalsIgnoreCase("Submitted")) {
            holder.status.setText(R.string.completed_small);
            holder.status.setBackgroundColor(Color.parseColor("#31A231"));
            holder.status.setTextColor(Color.WHITE);

        } else {
            holder.status.setText(R.string.incomplete);
            holder.status.setBackgroundColor(Color.parseColor("#FF0000"));
            holder.status.setTextColor(Color.WHITE);
        }
        return convertView;
    }

    @Override
    public Filter getFilter() {
        Filter filter = new Filter() {

            @SuppressWarnings("unchecked")
            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                filteredList = (ArrayList<ParentHomeWork>) results.values;
                notifyDataSetChanged();
            }
            @Override
            protected FilterResults performFiltering(CharSequence constraint) {
                constraint = constraint.toString().toLowerCase();
                FilterResults results = new FilterResults();
                ArrayList<ParentHomeWork> tempList = new ArrayList<>();
                // perform your search here using the searchConstraint String.
                    for (int i = 0; i < homeworkList.size(); i++) {
                        if (homeworkList.get(i).getAssignmentName().toLowerCase().contains(constraint.toString())) {
                            tempList.add(homeworkList.get(i));
                        } else if (homeworkList.get(i).getSubjectName().toLowerCase().contains(constraint.toString())) {
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

    private class ViewHolder {
        TextView assignmentDescription;
        TextView priority;
        ImageView prioritystatus;
        TextView dueDate;
        TextView assignmentName;
        TextView status;
        LinearLayout attachment;
        TextView attachNumber;
        TextView tag;
    }
}
