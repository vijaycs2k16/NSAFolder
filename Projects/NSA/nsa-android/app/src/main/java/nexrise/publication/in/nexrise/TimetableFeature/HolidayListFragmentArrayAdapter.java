/**
 * Created by Sai Deepak on 11-Oct-16.
 */

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

import nexrise.publication.in.nexrise.BeanClass.Holiday;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;


public class HolidayListFragmentArrayAdapter extends ArrayAdapter<Holiday> {

    Activity context;
    List<Holiday> holidayList = new ArrayList<Holiday>();

    public HolidayListFragmentArrayAdapter(Activity context, List<Holiday> holidayList) {
        super(context, R.layout.activity_holiday_list_view, holidayList);
        this.context = context;
        this.holidayList = holidayList;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        Holiday holiday = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.activity_holiday_list_view, parent, false);
        TextView sno = (TextView) convertView.findViewById(R.id.festivalno);
        TextView festival = (TextView) convertView.findViewById(R.id.festival);
        TextView monthName = (TextView) convertView.findViewById(R.id.festivalMonth);
        TextView date = (TextView) convertView.findViewById(R.id.festivalDate);
        int pos = position + 1;

        sno.setText(Integer.toString(pos));
        festival.setText(holiday.getHolidayName());
        monthName.setText(new StringUtils().Dateset(holiday.getStartDate()));
        if(holiday.getStartDate().equalsIgnoreCase(holiday.getEndDate()))
            date.setVisibility(View.GONE);
        date.setText(new StringUtils().Dateset(holiday.getEndDate()));
        return convertView;
    }
}
