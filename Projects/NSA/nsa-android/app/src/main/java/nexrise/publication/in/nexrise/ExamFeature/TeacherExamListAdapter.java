package nexrise.publication.in.nexrise.ExamFeature;

import android.app.Activity;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.BeanClass.ExamMarks;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.ProgressReportFeature.StudentDetailsActivity;
import nexrise.publication.in.nexrise.R;

/**
 * Created by praga on 7/18/2017.
 */

public class TeacherExamListAdapter extends BaseAdapter implements Filterable, Constants {

    Activity activity;
    ArrayList<Exam> examArrayList;
    ArrayList<Exam> filteredList;


    public TeacherExamListAdapter(Activity activity, ArrayList<Exam> examArrayList){
        this.activity = activity;
        this.examArrayList = examArrayList;
        this.filteredList = examArrayList;
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

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        Exam exam = (Exam) getItem(position);
        ViewHolder holder = new ViewHolder();
        LayoutInflater layoutInflater = activity.getLayoutInflater();

        if(convertView == null){
            convertView = layoutInflater.inflate(R.layout.student_mark_list,parent,false);
            holder.studentName = (TextView) convertView.findViewById(R.id.student_name);
            holder.graphIcon = (ImageView)convertView.findViewById(R.id.graph);
            holder.tableIcon = (ImageView)convertView.findViewById(R.id.imageView9);
            convertView.setTag(holder);
        } else
            holder = (ViewHolder) convertView.getTag();

        assert exam!=null;
        holder.studentName.setText(exam.getFirstName());
        clickListener(holder, exam);
        return convertView;
    }

    @Override
    public Filter getFilter() {

        Filter filter = new Filter() {
            @SuppressWarnings("unchecked")
            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                filteredList = (ArrayList<Exam>) results.values;
                notifyDataSetChanged();
            }

            @Override
            protected FilterResults performFiltering(CharSequence constraint) {
                constraint = constraint.toString().toLowerCase();

                FilterResults results = new FilterResults();
                ArrayList<Exam> tempList = new ArrayList<>();
                // perform your search here using the searchConstraint String.

                constraint = constraint.toString().toLowerCase();
                for (int i = 0; i < examArrayList.size(); i++) {
                    if (examArrayList.get(i).getFirstName().toLowerCase().startsWith(constraint.toString())){
                        tempList.add(examArrayList.get(i));
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
        TextView studentName;
        ImageView tableIcon;
        ImageView graphIcon;
    }

    private void clickListener(ViewHolder holder, final Exam exam) {
        holder.tableIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ArrayList<ExamMarks> marksArrayList = exam.getMarkList();
                Intent intent = new Intent(activity, StudentDetailsActivity.class);
                intent.putExtra("markList",marksArrayList);
                intent.putExtra(FIRST_NAME,exam.getFirstName());
                intent.putExtra(TOTAL_MARKS,exam.getTotalMarks());
                intent.putExtra(TOTAL_OBTAINED,exam.getTotalObtained());
                intent.putExtra(EXAM_NAME, exam.getExamName());
                intent.putExtra("Page", 0);
                activity.startActivity(intent);
            }
        });

        holder.graphIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ArrayList<ExamMarks> marksArrayList = exam.getMarkList();
                Intent intent = new Intent(activity, StudentDetailsActivity.class);
                intent.putExtra("markList",marksArrayList);
                intent.putExtra(FIRST_NAME,exam.getFirstName());
                intent.putExtra(TOTAL_MARKS,exam.getTotalMarks());
                intent.putExtra(TOTAL_OBTAINED,exam.getTotalObtained());
                intent.putExtra(EXAM_NAME, exam.getExamName());
                intent.putExtra("Page", 1);
                activity.startActivity(intent);
            }
        });
    }
}
