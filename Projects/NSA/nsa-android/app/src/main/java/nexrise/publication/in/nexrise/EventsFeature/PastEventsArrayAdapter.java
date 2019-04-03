package nexrise.publication.in.nexrise.EventsFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.PastEventObject;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by karthik on 15-10-2016.
 */

public class PastEventsArrayAdapter extends BaseAdapter implements Filterable{
    private Activity context;
    PastEventsFilter pastEventsFilter;
    private List<PastEventObject> pastEventsList;
    private List<PastEventObject> filterdList;

    public PastEventsArrayAdapter(Activity context, List<PastEventObject> pastEventsList) {

        this.context = context;
        this.pastEventsList = pastEventsList;
        this.filterdList = pastEventsList;
        getFilter();
    }

    @Override
    public int getCount() {
        return filterdList.size();
    }

    @Override
    public Object getItem(int position) {
        return filterdList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.activity_past_events_layout, parent, false);

        PastEventObject pastEvents = (PastEventObject) getItem(position);
        TextView tag = (TextView)convertView.findViewById(R.id.past_events_tag);
        TextView event = (TextView)convertView.findViewById(R.id.textView17);
        TextView date = (TextView)convertView.findViewById(R.id.textView18);

        if(!pastEvents.getTagName().equals("null")){
            tag.setVisibility(View.VISIBLE);
            tag.setText(pastEvents.getTagName());
        }
        StringUtils stringUtils = StringUtils.getInstance();
        event.setText(pastEvents.getEventName());
        date.setText(stringUtils.Dateset(pastEvents.getStartDate())+"\n"+ stringUtils.time12HrFormat(pastEvents.getStartTime()));
        return convertView;
    }

    @NonNull
    @Override
    public Filter getFilter() {
        if(pastEventsFilter == null){
            pastEventsFilter = new PastEventsFilter();
        }
        return pastEventsFilter;
    }

    private class PastEventsFilter extends Filter {

        @Override
        protected FilterResults performFiltering(CharSequence constraint) {
            FilterResults filterResults = new FilterResults();

            if(constraint!= null && constraint.length()!= 0){
                List<PastEventObject> tempList = new ArrayList<>();

                for (int i=0; i<pastEventsList.size(); i++){
                    if(pastEventsList.get(i).getEventName().toLowerCase().contains(constraint.toString().toLowerCase())){
                        tempList.add(pastEventsList.get(i));
                    }
                }
                filterResults.count = tempList.size();
                filterResults.values = tempList;
            } else {
                filterResults.count = pastEventsList.size();
                filterResults.values = pastEventsList;
            }

            return filterResults;
        }

        @SuppressWarnings("unchecked")
        @Override
        protected void publishResults(CharSequence constraint, FilterResults results) {
            filterdList = (ArrayList<PastEventObject>)results.values;
            notifyDataSetChanged();
        }
    }
}
