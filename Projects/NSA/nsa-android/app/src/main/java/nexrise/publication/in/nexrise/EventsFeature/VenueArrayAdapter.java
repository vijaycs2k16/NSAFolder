package nexrise.publication.in.nexrise.EventsFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.support.v4.app.FragmentActivity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Venue;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 14-10-2016.
 */

class VenueArrayAdapter extends BaseAdapter {

    private Activity context;
    private String values = " ";
    private int resource;
    ArrayList<Venue> venueList;

    VenueArrayAdapter(FragmentActivity activity, int fragment_our_school_location, ArrayList<Venue> venueList) {
        this.context = activity;
        this.resource = fragment_our_school_location;
        this.venueList = venueList;
    }


    @Override
    public int getCount() {
        return venueList.size();
    }

    @Override
    public Object getItem(int position) {
        return venueList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @NonNull
    @Override
    public View getView(final int position, View convertView, @NonNull final ViewGroup parent) {
        final Venue venue = (Venue) getItem(position);
        ViewHolder holder = new ViewHolder();

        LayoutInflater inflater = context.getLayoutInflater();
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.activity_attendees_layout, parent, false);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
            holder.checkBox.setOnCheckedChangeListener(null);
        }

        holder.checkBox = (CheckBox)convertView.findViewById(R.id.checkBox4);
        assert venue != null;
        holder.checkBox.setText(venue.getVenue_type_name());
        holder.checkBox.setChecked(venue.isChecked());

        holder.checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                LocationActivity locationActivity = (LocationActivity) context;

                if (isChecked) {
                    values+= " "+(venue.getVenue_type_name());
                    locationActivity.ourSchoolLocation(venue, "add");
                    venue.setChecked(true);
                    venueList.get(position).setChecked(true);
                } else {
                    values = values.replace(venue.getVenue_type_name(),"");
                    locationActivity.ourSchoolLocation(venue, "remove");
                    venue.setChecked(false);
                    venueList.get(position).setChecked(false);
                }
            }
        });
        return convertView;
    }

    private class ViewHolder {
        CheckBox checkBox;
    }
}