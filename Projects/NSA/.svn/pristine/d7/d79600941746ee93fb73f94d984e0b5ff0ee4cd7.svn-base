package nexrise.publication.in.nexrise.Attendence;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

import nexrise.publication.in.nexrise.R;

/**
 * Created by praga on 11-Apr-17.
 */

public class OverallAttendanceArrayAdapter extends ArrayAdapter<String> {
    Activity context;
    List<String> name;
    List<String> date;

    public OverallAttendanceArrayAdapter(Activity context, List<String> name, List<String> date) {
        super(context, R.layout.activity_attendance_overall_list_layout, name);
        this.name = name;
        this.date = date;
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.activity_attendance_overall_list_layout, parent, false);
        TextView no = (TextView) convertView.findViewById(R.id.attendance_no);
        TextView aname = (TextView) convertView.findViewById(R.id.absent_name);
        TextView adate = (TextView) convertView.findViewById(R.id.absent_month);
        int pos = position + 1;

        no.setText(Integer.toString(pos));
        aname.setText(name.get(position));
        adate.setText(date.get(position));

        return convertView;
    }
}
