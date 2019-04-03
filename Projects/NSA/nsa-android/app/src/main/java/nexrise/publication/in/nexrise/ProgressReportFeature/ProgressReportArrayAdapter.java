package nexrise.publication.in.nexrise.ProgressReportFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ProgressReport;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 17-10-2016.
 */

public class ProgressReportArrayAdapter extends ArrayAdapter<ProgressReport> {
    private Activity context;
    private int fa1Count = 0;
    private int fa2Counter = 0;
    private int sa1Counter = 0;
    private int upcount = 0;
    public ProgressReportArrayAdapter(Activity context, List<ProgressReport> progressReportList) {
        super(context, R.layout.activity_progress_report_layout, progressReportList);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ProgressReport progressReport = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.activity_progress_report_layout, parent, false);

        TextView tag = (TextView)convertView.findViewById(R.id.events_progress_report_tag);
        TextView test = (TextView)convertView.findViewById(R.id.progress_report_name);
        TextView duration = (TextView)convertView.findViewById(R.id.progress_report_duration);
        TextView classes = (TextView)convertView.findViewById(R.id.progress_report_description);
        TextView duration2 = (TextView)convertView.findViewById(R.id.progress_report_duration2);

        Log.v("Tag "," "+progressReport.getTag());
        if(progressReport.getTag().equals("Completed exams")){
            if(progressReport.getTest().equals("Formative assessment 1")) {
                if (fa1Count == 0) {
                    ++fa1Count;
                    tag.setVisibility(View.VISIBLE);
                    tag.setText(progressReport.getTag());
                    test.setVisibility(View.VISIBLE);
                    test.setText(progressReport.getTest());
                    duration.setVisibility(View.VISIBLE);
                    duration.setText(progressReport.getDuration());
                }
                classes.setText("Overall pass percentage \n" +progressReport.getClassName()+" "+progressReport.getSection()+
                        " - "+progressReport.getPassPercent());

            }else if(progressReport.getTest().equals("Formative assessment 2")){
                if (fa2Counter == 0) {
                    ++fa2Counter;
                    test.setVisibility(View.VISIBLE);
                    test.setText(progressReport.getTest());
                    duration.setVisibility(View.VISIBLE);
                    duration.setText(progressReport.getDuration());
                }
                classes.setText("Overall pass percentage \n" +progressReport.getClassName()+" "+progressReport.getSection()+
                        " - "+progressReport.getPassPercent());
            } else if(progressReport.getTest().equals("Summative assessment 1")){
                if(sa1Counter == 0){
                    ++sa1Counter;
                    test.setVisibility(View.VISIBLE);
                    test.setText(progressReport.getTest());
                    duration.setVisibility(View.VISIBLE);
                    duration.setText(progressReport.getDuration());
                }
                classes.setText("Overall pass percentage \n" +progressReport.getClassName()+" "+progressReport.getSection()+
                        " - "+progressReport.getPassPercent());
            }
        } else if(progressReport.getTag().equals("Upcoming exams")){
            if(upcount == 0){
                tag.setVisibility(View.VISIBLE);
                tag.setText(progressReport.getTag());
                ++upcount;
            }
            duration2.setVisibility(View.VISIBLE);
            duration2.setText(progressReport.getDuration());
            classes.setText(progressReport.getTest());
        }


        return convertView;
    }
}
