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

import nexrise.publication.in.nexrise.BeanClass.EventObject;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Sai Deepak on 08-Oct-16.
 */

public class EventFragmentArrayAdapter extends ArrayAdapter<EventObject> {

    Activity context;
    List<EventObject> eventList = new ArrayList<EventObject>();

    public EventFragmentArrayAdapter(Activity context, List<EventObject> eventList) {
        super(context, R.layout.fragment_event, eventList);
        this.context = context;
        this.eventList = eventList;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        EventObject eventObject = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.fragment_event, parent, false);
        TextView sno = (TextView) convertView.findViewById(R.id.eventno);
        TextView eventName = (TextView) convertView.findViewById(R.id.eventTypeName);
        TextView monthName = (TextView) convertView.findViewById(R.id.eventMonth);
        TextView date = (TextView) convertView.findViewById(R.id.eventDate);
        TextView place = (TextView) convertView.findViewById(R.id.eventPlace);
        int pos = position + 1;

        sno.setText(Integer.toString(pos));
        eventName.setText(eventObject.getEventName());
        monthName.setText(eventObject.getEventMonth());
        date.setText(eventObject.getEventDate());
        place.setText(eventObject.getEventPlace());
        return convertView;
    }



}
