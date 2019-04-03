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

import nexrise.publication.in.nexrise.BeanClass.Subjects;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Sai Deepak on 05-Nov-16.
 */

public class ExamSubjectsArrayAdapter extends ArrayAdapter<Subjects> {

    Activity context;
    List<Subjects> examList = new ArrayList<Subjects>();

    public ExamSubjectsArrayAdapter(Activity context, List<Subjects> examList) {
        super(context, R.layout.activity_exam_subject_list_layout, examList);
        this.context = context;
        this.examList = examList;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        Subjects examObject = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.activity_exam_subject_list_layout, parent, false);
        TextView examDate = (TextView) convertView.findViewById(R.id.exam_date);
        TextView subject = (TextView) convertView.findViewById(R.id.subect);
        TextView session = (TextView) convertView.findViewById(R.id.exam_session);

        examDate.setText(examObject.getDate());
        subject.setText(examObject.getSubjectName());
        session.setText(examObject.getSession());
        return convertView;
    }
}
