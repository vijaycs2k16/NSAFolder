package nexrise.publication.in.nexrise.ExamFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ExamSubject;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Sai Deepak on 07-Oct-16.
 */

class ExamDetailsArrayAdapter extends ArrayAdapter<ExamSubject> {

    private Activity context;
    private List<ExamSubject> examList = new ArrayList<ExamSubject>();
    private StringUtils stringUtils = new StringUtils();

    ExamDetailsArrayAdapter(Activity context, List<ExamSubject> examList) {
        super(context, R.layout.exam_details_layout, examList);
        this.context = context;
        this.examList = examList;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {

        ExamSubject subject = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.exam_details_layout, parent, false);
        TextView date = (TextView) convertView.findViewById(R.id.date);
        TextView day = (TextView) convertView.findViewById(R.id.day);
        TextView time = (TextView) convertView.findViewById(R.id.time);
        TextView sub = (TextView) convertView.findViewById(R.id.subject);
        TextView max_marks = (TextView) convertView.findViewById(R.id.max_marks);

        assert subject != null;
        date.setText(stringUtils.monthDate(subject.getDate()));
        day.setText(subject.getDay());
        time.setText(subject.getExamStartTime() + " - " + subject.getExamEndTime());
        sub.setText(subject.getSubject_name());
        max_marks.setText(subject.getMark());

        return convertView;
    }
}
