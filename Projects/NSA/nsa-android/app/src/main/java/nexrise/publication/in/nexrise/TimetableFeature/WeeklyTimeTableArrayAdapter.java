package nexrise.publication.in.nexrise.TimetableFeature;

import android.app.Activity;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.WeekObject;
import nexrise.publication.in.nexrise.BeanClass.WeeklyTimeTable;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Sai Deepak on 11-Oct-16.
 */

public class WeeklyTimeTableArrayAdapter extends ArrayAdapter<WeeklyTimeTable> {

    Activity context;
    WeeklyTimeTableArrayAdapter(Activity context, List<WeeklyTimeTable> weeklyTimeTableList) {
        super(context, R.layout.activity_week_list_view, weeklyTimeTableList);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {

        WeeklyTimeTable weeklyTimeTable = getItem(position);
        ViewHolder holder = new ViewHolder();

        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.activity_week_list_view, parent, false);
        holder.timings = (TextView) convertView.findViewById(R.id.tableTimings);
        holder.monday = (TextView) convertView.findViewById(R.id.monday);
        holder.tue = (TextView) convertView.findViewById(R.id.tuesday);
        holder.wed = (TextView) convertView.findViewById(R.id.wednesday);
        holder.thu = (TextView) convertView.findViewById(R.id.thursday);
        holder.fri = (TextView) convertView.findViewById(R.id.friday);
        holder.sat = (TextView) convertView.findViewById(R.id.saturday);

        assert weeklyTimeTable != null;
        List<WeekObject> weekList = weeklyTimeTable.getDays();
        holder.timings.setText(new StringUtils().periodTime(weeklyTimeTable.getPeriodStartTime())+ "-" + new StringUtils().periodTime(weeklyTimeTable.getPeriodEndTime()));

        for(WeekObject weekObject : weekList) {
            String color = weekObject.getColor();

            switch (weekObject.getDayName()){
                case "Monday":
                    if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                        holder.monday.setBackgroundColor(Color.parseColor(color));
                    holder.monday.setText(weekObject.getSubEmpCode());
                    break;

                case "Tuesday":
                    if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                        holder.tue.setBackgroundColor(Color.parseColor(color));
                    holder.tue.setText(weekObject.getSubEmpCode());
                    break;

                case "Wednesday":
                    if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                        holder.wed.setBackgroundColor(Color.parseColor(color));
                    holder.wed.setText(weekObject.getSubEmpCode());
                    break;

                case "Thursday":
                    if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                        holder.thu.setBackgroundColor(Color.parseColor(color));
                    holder.thu.setText(weekObject.getSubEmpCode());
                    break;

                case "Friday":
                    if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                        holder.fri.setBackgroundColor(Color.parseColor(color));
                    holder.fri.setText(weekObject.getSubEmpCode());
                    break;
                case "Saturday":
                    if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                        holder.sat.setBackgroundColor(Color.parseColor(color));
                    holder.sat.setText(weekObject.getSubEmpCode());
                    break;
            }
        }

        return convertView;
    }

    private class ViewHolder {
        TextView timings;
        TextView monday;
        TextView tue;
        TextView wed;
        TextView thu;
        TextView fri;
        TextView sat;
    }

}
