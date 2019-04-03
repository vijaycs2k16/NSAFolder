package nexrise.publication.in.nexrise.TimetableFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ExamList;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Sai Deepak on 13-Oct-16.
 */

public class TeacherExamFragmentArrayAdapter extends ArrayAdapter<ExamList> {

    Activity context;
    List<ExamList> examList = new ArrayList<ExamList>();

    public TeacherExamFragmentArrayAdapter(Activity context, List<ExamList> examList) {
        super(context, R.layout.fragment_teacher_exam_list_view, examList);
        this.context = context;
        this.examList = examList;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        ExamList examObject = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.fragment_teacher_exam_list_view, parent, false);
        TextView sno = (TextView) convertView.findViewById(R.id.examNo);
        TextView examName = (TextView) convertView.findViewById(R.id.examName);
        TextView monthName = (TextView) convertView.findViewById(R.id.monthName);
       // TextView className = (TextView) convertView.findViewById(R.id.className);
        TextView dates = (TextView) convertView.findViewById(R.id.exam_dates);
        /*TextView rno = (TextView) convertView.findViewById(R.id.rno);*/
        int pos = position + 1;

        sno.setText(Integer.toString(pos));

        examName.setText(examObject.getExamName());
        monthName.setText(examObject.getMonth());
        //className.setText(examObject.getClassName());
        dates.setText(examObject.getSchedule());

        return convertView;
    }


}
