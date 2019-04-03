package nexrise.publication.in.nexrise.EventsFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ProgressResult;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 19-10-2016.
 */

public class OverallReportTableArrayAdapter extends ArrayAdapter<ProgressResult> {
    private Activity context;
    String[] exam1 ={"FA1","FA2","SA1"};
    public OverallReportTableArrayAdapter(Activity context, List<ProgressResult> progressResultList) {
        super(context, R.layout.fragment_overall_report_table_layout, progressResultList);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ProgressResult progressResult = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.fragment_overall_report_table_layout, parent, false);
        TextView exam = (TextView)convertView.findViewById(R.id.exam);
        TextView english = (TextView)convertView.findViewById(R.id.english);
        TextView tamil = (TextView)convertView.findViewById(R.id.tamil);
        TextView maths = (TextView)convertView.findViewById(R.id.maths);
        TextView science = (TextView)convertView.findViewById(R.id.science);
        TextView social = (TextView)convertView.findViewById(R.id.social);

        if(progressResult.getExam().equals("Formative assessment 1 - FA1")) {
            exam.setText("FA1");
        } else if (progressResult.getExam().equals("Formative assessment 2 - FA2")){
            exam.setText("FA2");
        } else if (progressResult.getExam().equals("Summative assessment 1 - SA1")){
            exam.setText("SA1");
        }else {
            exam.setText(exam1[position]);
        }
        english.setText(progressResult.getEnglish());
        tamil.setText(progressResult.getTamil());
        maths.setText(progressResult.getMaths());
        science.setText(progressResult.getScience());
        social.setText(progressResult.getSocial());


        return convertView;
    }
}
