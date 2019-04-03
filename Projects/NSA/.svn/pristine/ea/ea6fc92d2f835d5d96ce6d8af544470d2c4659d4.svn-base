package nexrise.publication.in.nexrise.ParentFeatures.Attendance;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Locale;

import nexrise.publication.in.nexrise.BeanClass.StatusAttendance;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Sai Deepak on 27-Oct-16.
 */

public class StatusAttedanceArrayAdapter extends ArrayAdapter<StatusAttendance> {

    private Activity context;

    StatusAttedanceArrayAdapter(Activity context, ArrayList<StatusAttendance> date) {
        super(context, R.layout.activity_attendance_status_list_layout , date);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        StatusAttendance status = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();


        if(convertView == null) {
             convertView = inflater.inflate(R.layout.activity_attendance_status_list_layout, parent, false);
             holder.no = (TextView) convertView.findViewById(R.id.attendance_no);
             holder.adate = (TextView) convertView.findViewById(R.id.absent_month);
             holder.aday = (TextView) convertView.findViewById(R.id.absent_day);

            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }
        int pos = position + 1;
        holder.no.setText(Integer.toString(pos));
        assert status != null;
        Log.v("date","foramt"+status.getRecordedDate());
        String dates = new StringUtils().Dateset(status.getAttendanceDate());
        holder.adate.setText(dates);


        DateFormat df = new SimpleDateFormat("MMM dd yyyy");
        Calendar cal  = Calendar.getInstance();
        try {
            cal.setTime(df.parse(dates));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String dayLongName = cal.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.getDefault());
        Log.v("Day","name"+dayLongName);
        holder.aday.setText(dayLongName);

        return convertView;
    }
    private class ViewHolder {
        TextView no;
        TextView adate;
        TextView aday;

    }
}
