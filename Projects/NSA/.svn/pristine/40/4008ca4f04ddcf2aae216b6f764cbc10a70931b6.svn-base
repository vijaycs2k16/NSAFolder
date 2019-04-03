package nexrise.publication.in.nexrise.ProgressReportFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ExamMarks;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 18-10-2016.
 */

public class StudentReportTableArrayAdapter extends ArrayAdapter<ExamMarks> {
    private Activity context;
    private List<ExamMarks> markList;

    public StudentReportTableArrayAdapter(Activity context, List<ExamMarks> markList) {
        super(context, R.layout.fragment_student_report_table_layout, markList);
        this.context = context;
        this.markList = markList;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        ExamMarks examMarks = getItem(position);
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.fragment_student_report_table_layout, parent, false);
            holder.subjectName = (TextView)convertView.findViewById(R.id.subject);
            holder.subjectMark = (TextView)convertView.findViewById(R.id.marks);
            convertView.setTag(holder);
        } else
            holder = (ViewHolder) convertView.getTag();
        assert examMarks != null;
        holder.subjectName.setText(examMarks.getSubjectName());
        if(!examMarks.getMarksObtained().equalsIgnoreCase("0"))
                holder.subjectMark.setText(examMarks.getMarksObtained());
            else
                holder.subjectMark.setText(" - ");
        return convertView;
    }

    private class ViewHolder {
        TextView subjectName;
        TextView subjectMark;
    }
}
