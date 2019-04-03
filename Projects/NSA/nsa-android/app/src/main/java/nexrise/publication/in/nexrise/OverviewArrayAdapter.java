package nexrise.publication.in.nexrise;

import android.app.Activity;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Calendar;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Karthik on 6/28/2017.
 */

class OverviewArrayAdapter extends ArrayAdapter<Calendar> {
    private Activity context;
    private List<Calendar> calendarList;

    OverviewArrayAdapter(Activity context, int resource, List<Calendar> calendarList) {
        super(context, resource, calendarList);
        this.context = context;
        this.calendarList = calendarList;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.overview_list_layout, parent, false);
            holder.title = (TextView)convertView.findViewById(R.id.title);
            holder.date = (TextView)convertView.findViewById(R.id.date);
            holder.cardColor = (ImageView)convertView.findViewById(R.id.card_color);
            holder.rightArrow = (ImageView)convertView.findViewById(R.id.right_arrow);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }
        Calendar schoolActivities = getItem(position);
        StringUtils stringUtils = StringUtils.getInstance();
        assert schoolActivities != null;
        if(schoolActivities.getId() != null)
            holder.rightArrow.setVisibility(View.VISIBLE);
        else if(schoolActivities.getScheduleId() != null && schoolActivities.getClassId() != null && schoolActivities.getClassName() != null && schoolActivities.getClasses() != null && schoolActivities.getClasses().size() != 0)
            holder.rightArrow.setVisibility(View.VISIBLE);
        else
            holder.rightArrow.setVisibility(View.INVISIBLE);

        String title = schoolActivities.getTitle();
        if(schoolActivities.getSubjectName() != null)
            holder.title.setText(title+ " - "+schoolActivities.getSubjectName());
        else
            holder.title.setText(title);

        String startDate = stringUtils.dobFormat(stringUtils.dateSeperate(schoolActivities.getStartDate()));
        String endDate = stringUtils.dobFormat(stringUtils.dateSeperate(schoolActivities.getEndDate()));
        if(startDate.equals(endDate))
            holder.date.setText(startDate);
        else
            holder.date.setText(startDate+" - "+ endDate);
        holder.cardColor.setBackgroundColor(Color.parseColor(schoolActivities.getColor()));
        return convertView;
    }

    private class ViewHolder {
        TextView title;
        TextView date;
        ImageView cardColor;
        ImageView rightArrow;
    }
}
