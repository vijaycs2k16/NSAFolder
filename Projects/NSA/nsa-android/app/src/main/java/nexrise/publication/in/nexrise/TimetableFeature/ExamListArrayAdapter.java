package nexrise.publication.in.nexrise.TimetableFeature;

import android.app.Activity;
import android.support.annotation.LayoutRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Karthik on 7/7/17.
 */

public class ExamListArrayAdapter extends ArrayAdapter<Exam> {
    Activity context;

    public ExamListArrayAdapter(@NonNull Activity context, @LayoutRes int resource, ArrayList<Exam> examsList) {
        super(context, resource, examsList);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        Exam exam = getItem(position);
        ViewHolder holder = new ViewHolder();
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.exam_list_layout, parent, false);
            holder.examName = (TextView)convertView.findViewById(R.id.exam_name);
            holder.publishedDate = (TextView)convertView.findViewById(R.id.exam_date);
            convertView.setTag(holder);
        } else
            holder = (ViewHolder) convertView.getTag();

        assert exam != null;
        holder.examName.setText(exam.getExamName());
        holder.publishedDate.setText("Published date - "+exam.getPublishedDate());
        return convertView;
    }

    private class ViewHolder {
        TextView examName;
        TextView publishedDate;
    }
}
