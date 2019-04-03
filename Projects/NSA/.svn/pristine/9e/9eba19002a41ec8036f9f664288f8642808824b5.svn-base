package nexrise.publication.in.nexrise.HomeworkFeature;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.AssignmentStatus;
import nexrise.publication.in.nexrise.BeanClass.Student;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 26-Sep-16.
 */

public class StatusFragmentArrayAdapter extends BaseExpandableListAdapter implements Filterable{
    private Activity context;
    private List<AssignmentStatus> listData;
    private List<AssignmentStatus> filteredData;

    private int[] icons = new int[]{R.drawable.ic_total, R.drawable.ic_completed, R.drawable.ic_not_completed,R.drawable.ic_not_completed2};

    public StatusFragmentArrayAdapter(Activity context, List<AssignmentStatus> listData){
        this.context = context;
        this.listData = new ArrayList<AssignmentStatus>();
        this.listData.addAll(listData);
        filteredData = new ArrayList<AssignmentStatus>();
        filteredData.addAll(listData);
    }
    @Override
    public int getGroupCount() {
        return filteredData.size();
    }

    @Override
    public int getChildrenCount(int groupPosition) {
        int childCount = 0;
        try {
            childCount = filteredData.get(groupPosition).getStudentsList().size();
        }
        catch (NullPointerException e) {
            return childCount;
        }
        return childCount;
    }

    @Override
    public Object getGroup(int groupPosition) {
        return filteredData.get(groupPosition);
    }

    @Override
    public Object getChild(int groupPosition, int childPosition) {
        return filteredData.get(groupPosition).getStudentsList().get(childPosition);
    }

    @Override
    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return childPosition;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }

    @Override
    public View getGroupView(int groupPosition, boolean isExpanded, View convertView, ViewGroup parent) {
        AssignmentStatus dataheader = (AssignmentStatus)getGroup(groupPosition);
        if(convertView == null){
            LayoutInflater inflater = (LayoutInflater)this.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.fragment_status_list_group, parent, false);
        }
        TextView textView = (TextView)convertView.findViewById(R.id.listgroup_textview);
        textView.setText(dataheader.getHeaderName());

        ImageView imageView = (ImageView)convertView.findViewById(R.id.list_group_expand_icon);
        ImageView icon = (ImageView)convertView.findViewById(R.id.list_group_icon);
        try {
            icon.setImageResource(icons[groupPosition]);
        } catch(ArrayIndexOutOfBoundsException e) {
            icon.setImageResource(icons[3]);
        }

        Log.v("Group ","position "+getChildrenCount(groupPosition));
        if(isExpanded && getChildrenCount(groupPosition) != 0) {
            imageView.setImageResource(R.drawable.ic_arrow_up_circle);
        } else if (getChildrenCount(groupPosition) != 0) {
            imageView.setImageResource(R.drawable.ic_arrow_down_circle);
        } else {
            imageView.setImageDrawable(null);
        }
        return convertView;
    }

    @Override
    public View getChildView(int groupPosition, int childPosition, boolean isLastChild, View convertView, ViewGroup parent) {
        Student dataMember = (Student)getChild(groupPosition, childPosition);
        if(convertView == null){
            LayoutInflater inflater = (LayoutInflater)this.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.fragment_status_list_item, null);
        }
        TextView textView = (TextView)convertView.findViewById(R.id.status_left_textview);
        LinearLayout layout = (LinearLayout)convertView.findViewById(R.id.list_item_linear_layout);
        LinearLayout badgeLayout = (LinearLayout)convertView.findViewById(R.id.badge_layout);
        TextView badgeText = (TextView)convertView.findViewById(R.id.badge_text);

        textView.setText(dataMember.getFirstname());

        return convertView;
    }

    @Override
    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }

    @Override
    public Filter getFilter() {
        Filter filter = new Filter() {

            @Override
            protected FilterResults performFiltering(CharSequence constraint) {

                constraint = constraint.toString().toLowerCase();
                FilterResults filteredResults = new FilterResults();

                if(constraint.length() != 0) {
                    ArrayList<AssignmentStatus> tempData = new ArrayList<>();
                    for (int i = 0; i < listData.size(); i++) {
                        ArrayList<Student> studentList = listData.get(i).getStudentsList();
                        ArrayList<Student> tempList =   new ArrayList<>();

                        for (int j=0; j<studentList.size(); j++) {
                            if(studentList.get(j).getFirstname().toLowerCase().startsWith(constraint.toString())) {
                                tempList.add(studentList.get(j));
                            }
                        }

                        if(tempList.size() > 0) {
                            AssignmentStatus assignmentStatus = new AssignmentStatus(listData.get(i).getHeaderName(), tempList);
                            tempData.add(assignmentStatus);
                        }
                    }
                    filteredResults.count = tempData.size();
                    filteredResults.values = tempData;
                } else {
                    filteredResults.count = listData.size();
                    filteredResults.values = listData;
                }
                return filteredResults;
            }

            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                filteredData = (ArrayList<AssignmentStatus>) results.values;
                 notifyDataSetChanged();
            }
        };
        return filter;
    }

}
