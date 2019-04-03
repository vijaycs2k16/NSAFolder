package nexrise.publication.in.nexrise.EventsFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Event;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by karthik on 13-10-2016.
 */
class EventsFeatureArrayAdapter extends BaseAdapter implements Filterable{
    private Activity context;
    private List<Event> eventsFeatureList;
    private List<Event> filteredList;
    private EventsFilter eventsFilter;
    private Fragment fragment;
    StringUtils stringUtils = StringUtils.getInstance();

    EventsFeatureArrayAdapter(Activity context, List<Event> eventsFeatureList, Fragment fragment) {
        this.context = context;
        this.eventsFeatureList = eventsFeatureList;
        this.filteredList = eventsFeatureList;
        this.fragment = fragment;
        getFilter();
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
        ViewHolder holder = new ViewHolder();

        Event event = (Event) getItem(position);
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.fragment_events_feature_layout, parent, false);
            holder.tag = (TextView)convertView.findViewById(R.id.events_feature_tag);
            holder.title = (TextView)convertView.findViewById(R.id.events_feature_name);
            holder.description = (TextView)convertView.findViewById(R.id.events_feature_description);
            holder.date = (TextView)convertView.findViewById(R.id.events_feature_date);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }

        assert event != null;
        if(event.getTag() != null){
            holder.tag.setVisibility(View.VISIBLE);
            holder.tag.setText(event.getTag());
        } else {
            holder.tag.setVisibility(View.GONE);
        }

        holder.title.setText(event.getName());
        holder.date.setText(stringUtils.Dateset(event.getStartDate())+" - "+ stringUtils.time12HrFormat(event.getStartTime()));
        holder.description.setText(event.getDescription());
        return convertView;
    }

    @NonNull
    @Override
    public Filter getFilter() {
        if(eventsFilter == null){
            eventsFilter = new EventsFilter();
        }
        return eventsFilter;
    }

    private class ViewHolder {
        TextView tag;
        TextView title;
        TextView description;
        TextView date;
    }

    private class EventsFilter extends Filter{

        @Override
        protected FilterResults performFiltering(CharSequence constraint) {
            FilterResults filterResults = new FilterResults();
            if(constraint!= null && constraint.length()!=0) {
                ArrayList<Event> tempList = new ArrayList<>();

                for (int i=0 ; i<eventsFeatureList.size(); i++) {
                    if (eventsFeatureList.get(i).getName().toLowerCase().startsWith(constraint.toString())) {
                        tempList.add(eventsFeatureList.get(i));
                    } else if (eventsFeatureList.get(i).getDescription().toLowerCase().startsWith(constraint.toString().toLowerCase())) {
                        tempList.add(eventsFeatureList.get(i));
                    }
                }
                filterResults.count = tempList.size();
                filterResults.values = tempList;
            } else {
                filterResults.count = eventsFeatureList.size();
                filterResults.values = eventsFeatureList;
            }
            return filterResults;
        }

        @SuppressWarnings("unchecked")
        @Override
        protected void publishResults(CharSequence constraint, FilterResults results) {
            filteredList = (ArrayList<Event>) results.values;
            if (filteredList.size() == 0 && fragment instanceof EventsFeatureListFragment) {
                ((EventsFeatureListFragment) fragment).displayNothingToShow();
            }
            notifyDataSetChanged();
        }
    }
}
