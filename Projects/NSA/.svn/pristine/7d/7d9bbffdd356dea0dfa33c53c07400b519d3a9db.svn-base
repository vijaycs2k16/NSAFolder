package nexrise.publication.in.nexrise.TimetableFeature;

import android.app.Activity;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.WeekTeacherObject;
import nexrise.publication.in.nexrise.BeanClass.WeeklyTeacherTimeTable;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Sai Deepak on 12-Oct-16.
 */

public class WeeklyTeacherTimeArrayAdapter extends ArrayAdapter<WeekTeacherObject> implements Constants {

    Activity context;
    List<WeekTeacherObject> weeklyTimeTableList = new ArrayList<WeekTeacherObject>();

    public WeeklyTeacherTimeArrayAdapter(Activity context, List<WeekTeacherObject> weeklyTimeTableList) {
        super(context, R.layout.activity_week_list_view, weeklyTimeTableList);
        this.context = context;
        this.weeklyTimeTableList = weeklyTimeTableList;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {

        WeekTeacherObject weeklyTimeTable = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.activity_week_list_view, parent, false);
        TextView timings = (TextView) convertView.findViewById(R.id.tableTimings);
        TextView monday = (TextView) convertView.findViewById(R.id.monday);
        TextView tue = (TextView) convertView.findViewById(R.id.tuesday);
        TextView wed = (TextView) convertView.findViewById(R.id.wednesday);
        TextView thu = (TextView) convertView.findViewById(R.id.thursday);
        TextView fri = (TextView) convertView.findViewById(R.id.friday);
        TextView sat = (TextView) convertView.findViewById(R.id.saturday);
        List<WeeklyTeacherTimeTable> weekList = weeklyTimeTable.getDays();
        timings.setText(new StringUtils().periodTime(weeklyTimeTable.getPeriodStartTime())+ " - "+new StringUtils().periodTime(weeklyTimeTable.getPeriodEndTime()));
        String color = null;

        for(WeeklyTeacherTimeTable weekObject : weekList) {
            Log.v("Color "," "+weekObject.getColor());
            switch (weekObject.getDayName()){

                case "Monday":

                    if(!weekObject.getSubjectCode().equals("-")) {
                        color = weekObject.getColor();
                        if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                            monday.setBackgroundColor(Color.parseColor(color));
                        monday.setText(weekObject.getSubjectCode() + System.getProperty("line.separator") + weekObject.getClassCode() + "-" + weekObject.getSectionCode());
                    } else {
                        monday.setText("-");
                    }
                    break;
                case "Tuesday":

                    if(!weekObject.getSubjectCode().equals("-")) {
                        color = weekObject.getColor();
                        if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                            tue.setBackgroundColor(Color.parseColor(color));
                        tue.setText(weekObject.getSubjectCode() + System.getProperty("line.separator") + weekObject.getClassCode() + "-" + weekObject.getSectionCode());
                    } else {
                        tue.setText("-");
                    }
                    break;
                case "Wednesday":

                    if(!weekObject.getSubjectCode().equals("-")) {
                        color = weekObject.getColor();
                        if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                            wed.setBackgroundColor(Color.parseColor(color));
                        wed.setText(weekObject.getSubjectCode() + System.getProperty("line.separator") + weekObject.getClassCode() + "-" + weekObject.getSectionCode());
                    } else {
                        wed.setText("-");
                    }
                    break;

                case "Thursday":

                    if(!weekObject.getSubjectCode().equals("-")) {
                        color = weekObject.getColor();
                        if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                            thu.setBackgroundColor(Color.parseColor(color));
                        thu.setText(weekObject.getSubjectCode() + System.getProperty("line.separator") + weekObject.getClassCode() + "-" + weekObject.getSectionCode());
                    } else {
                        thu.setText("-");
                    }
                    break;

                case "Friday":

                    if(!weekObject.getSubjectCode().equals("-")) {
                        color = weekObject.getColor();
                        if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                            fri.setBackgroundColor(Color.parseColor(color));
                        fri.setText(weekObject.getSubjectCode() + System.getProperty("line.separator") + weekObject.getClassCode() + "-" + weekObject.getSectionCode());
                    } else {
                        fri.setText("-");
                    }
                    break;

                case "Saturday":

                    if(!weekObject.getSubjectCode().equals("-")) {
                        color = weekObject.getColor();
                        if(color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                            fri.setBackgroundColor(Color.parseColor(color));
                        sat.setText(weekObject.getSubjectCode() + System.getProperty("line.separator") + weekObject.getClassCode() + "-" + weekObject.getSectionCode());
                    } else {
                        sat.setText("-");
                    }
            }
        }
        return convertView;
    }
}
