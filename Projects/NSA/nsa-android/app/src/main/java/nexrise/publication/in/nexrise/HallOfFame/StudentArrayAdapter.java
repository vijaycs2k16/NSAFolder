package nexrise.publication.in.nexrise.HallOfFame;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Attendee;
import nexrise.publication.in.nexrise.R;

/**
 * Created by rsury on 14-09-2017.
 */

public class StudentArrayAdapter extends ArrayAdapter<Attendee> implements Filterable{
    List<Attendee> hallOfFame;
    Activity context;
    private List<Attendee> filteredList;


    public StudentArrayAdapter(Context context, int resource, ArrayList<Attendee> list) {
        super(context, resource,list);
        this.context = (Activity) context;
        this.hallOfFame = list;
        this.filteredList = list;
        getFilter();
    }

    @Override
    public int getCount() {
        return filteredList.size();
    }

    @Override
    public Attendee getItem(int position) {
        return filteredList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    private class ViewHolder {
        TextView name;
        TextView classSection;
        ImageView arrow;
    }

    @NonNull
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        Attendee attendee = (Attendee) getItem(position);
        ViewHolder holder = new ViewHolder();
        if (convertView == null) {
            LayoutInflater inflater = context.getLayoutInflater();
            convertView = inflater.inflate(R.layout.fragment_attendance_leave_list_layout, parent, false);
            holder.name = (TextView) convertView.findViewById(R.id.student_name);
            holder.classSection = (TextView) convertView.findViewById(R.id.student_no);
            holder.arrow = (ImageView) convertView.findViewById(R.id.image_arrow);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }
        holder.arrow.setVisibility(View.GONE);
        holder.name.setText(attendee.getFirstName());
        holder.classSection.setText(attendee.getClassName()+ "   "+ attendee.getSectionName());
        return convertView;
    }

    @Override
    public Filter getFilter() {

        final Filter filter = new Filter() {
            @SuppressWarnings("unchecked")
            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                    filteredList = (ArrayList<Attendee>) results.values;
                    notifyDataSetChanged();
            }

            @Override
            protected FilterResults performFiltering(CharSequence constraint) {
                constraint = constraint.toString().toLowerCase();

                FilterResults results = new FilterResults();
                ArrayList<Attendee> tempList = new ArrayList<>();
                // perform your search here using the searchConstraint String.

                constraint = constraint.toString().toLowerCase();
                for (int i = 0; i < hallOfFame.size(); i++) {
                    if (hallOfFame.get(i).getFirstName().toLowerCase().startsWith(constraint.toString())){
                        tempList.add(hallOfFame.get(i));
                    }

                }
                results.count = tempList.size();
                results.values = tempList;
                return results;
            }
        };
        return filter;
    }

}
