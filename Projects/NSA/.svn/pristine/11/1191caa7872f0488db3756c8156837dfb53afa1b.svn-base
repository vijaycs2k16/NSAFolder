package nexrise.publication.in.nexrise.EventsFeature;

import android.app.Activity;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Attendee;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Karthik on 04-May-17.
 */


public class AttendeesListArrayAdapter extends BaseAdapter implements Filterable{
    Activity context;
    private ArrayList<Attendee> filteredList;
    private ArrayList<Attendee> attendeesList;

    public AttendeesListArrayAdapter(Activity context, int resource, ArrayList<Attendee> attendeesList) {
        this.context = context;
        this.attendeesList = attendeesList;
        filteredList = attendeesList;
    }

    @Override
    public int getCount() {
        return filteredList.size();
    }

    @Override
    public Object getItem(int position) {
        return filteredList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        Attendee attendee = (Attendee) getItem(position);
        ViewHolder holder = new ViewHolder();

        if(convertView == null) {
            convertView = inflater.inflate(R.layout.attendees_list_layout, parent, false);
            holder.name = (TextView)convertView.findViewById(R.id.name);
            holder.className = (TextView)convertView.findViewById(R.id.class_name);
            holder.sectionName = (TextView)convertView.findViewById(R.id.section_name);
            holder.registered = (TextView)convertView.findViewById(R.id.registered);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }

        assert attendee != null;
        holder.name.setText(attendee.getFirstName());
        holder.className.setText(value(attendee.getClassName()));
        holder.sectionName.setText(value(attendee.getSectionName()));
        if(attendee.getRegistered() != null) {
            if(attendee.getRegistered()){
            holder.registered.setText("YES");
            holder.registered.setTextColor(Color.parseColor("#147c12"));
            }
            else{
                holder.registered.setText("NO");
            holder.registered.setTextColor(Color.parseColor("#e80619"));

            }
        } else {
            holder.registered.setText(" - ");
        }
        return convertView;
    }

    private class ViewHolder {
        TextView name;
        TextView className;
        TextView sectionName;
        TextView registered;
    }

    @Override
    public Filter getFilter() {
        Filter filter = new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence constraint) {
                FilterResults results = new FilterResults();
                if(constraint != null && constraint.length() != 0) {
                    ArrayList<Attendee> tempList = new ArrayList<>();

                    for (int i=0; i<attendeesList.size(); i++) {
                        if(attendeesList.get(i).getFirstName().toLowerCase().startsWith(constraint.toString().toLowerCase())) {
                            tempList.add(attendeesList.get(i));
                        } else if (attendeesList.get(i).getClassName().toLowerCase().startsWith(constraint.toString().toLowerCase())) {
                            tempList.add(attendeesList.get(i));
                        }
                    }
                    results.count = tempList.size();
                    results.values = tempList;
                } else {
                    results.count = attendeesList.size();
                    results.values = attendeesList;
                }
                return results;
            }

            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                filteredList = (ArrayList<Attendee>) results.values;
                notifyDataSetChanged();
            }
        };
        return  filter;
    }
    public String value(String string){
        String value = " - ";
        if(string.equals("null")){
            value = " - ";
        }else {
            value = string;
        }
        return value;
    }
}
