package nexrise.publication.in.nexrise.ProgressReportFeature;

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
 * Created by karthik on 18-10-2016.
 */

public class ProgressResultArrayAdapter extends ArrayAdapter<ProgressResult> {
    private Activity context;

    public ProgressResultArrayAdapter(Activity context, List<ProgressResult> progressResultList) {
        super(context, R.layout.activity_progress_results_layout, progressResultList);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ProgressResult progressResult = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.activity_progress_results_layout, parent, false);
        TextView textView = (TextView)convertView.findViewById(R.id.textView22);
        textView.setText(progressResult.getName());
        return convertView;
    }
}
