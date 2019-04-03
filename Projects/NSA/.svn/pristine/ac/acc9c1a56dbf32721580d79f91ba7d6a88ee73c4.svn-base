package nexrise.publication.in.nexrise.HallOfFame;


import android.app.Activity;
import android.content.Context;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.HallOfFame;
import nexrise.publication.in.nexrise.R;

import static nexrise.publication.in.nexrise.Constants.EMPLOYEE;
import static nexrise.publication.in.nexrise.Constants.USER_ROLE;

/**
 * Created by rsury on 11-09-2017.
 */

public class HallOfFameArrayAdapter extends ArrayAdapter<HallOfFame>{
    List<HallOfFame> hallOfFame;
    Activity context;
    String userRole;

    public HallOfFameArrayAdapter(Context context, int resource,ArrayList<HallOfFame> list) {
        super(context, resource,list);
        this.context = (Activity) context;
        this.hallOfFame = list;
    }

    public class ViewHolder {
        TextView award;
        TextView students;
        TextView date;
        TextView category;
    }

    @NonNull
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        ViewHolder holder = new ViewHolder();
        HallOfFame hallOfFame = getItem(position);

        if (convertView == null) {
            LayoutInflater inflater = context.getLayoutInflater();
            convertView = inflater.inflate(R.layout.hall_of_fame_layout, parent, false);
            holder.award = (TextView) convertView.findViewById(R.id.award);
            holder.date = (TextView) convertView.findViewById(R.id.date_issue);
            holder.students = (TextView) convertView.findViewById(R.id.no_of_students);
            holder.category = (TextView) convertView.findViewById(R.id.category);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }
        userRole = PreferenceManager.getDefaultSharedPreferences(context).getString(USER_ROLE,null);
            holder.award.setText(hallOfFame.getAward_name());
            holder.date.setText(hallOfFame.getDate_of_issue());
        if (!userRole.equalsIgnoreCase(EMPLOYEE)) {
            holder.category.setText(R.string.category);
            holder.students.setText(hallOfFame.getDescription());
        } else {
            String student = String.valueOf(hallOfFame.getNumber_of_students());
            holder.students.setText(student);
        }
        return convertView;
    }
}
