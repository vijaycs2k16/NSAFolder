package nexrise.publication.in.nexrise.Attendence;

import android.app.Activity;
import android.database.DataSetObserver;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SpinnerAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.EventType;
import nexrise.publication.in.nexrise.R;

/**
 * Created by praga on 26-Apr-17.
 */

public class EventTypeAdapter implements SpinnerAdapter{
    Activity context;
    private List<EventType> eventTypes = new ArrayList<EventType>();

    public EventTypeAdapter(Activity context,List<EventType> eventTypes) {
        this.context = context;
        this.eventTypes = eventTypes;
    }

    @Override
    public View getDropDownView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder = new ViewHolder();
        if (convertView == null) {
            LayoutInflater inflater = context.getLayoutInflater();
            convertView = inflater.inflate(R.layout.spinner_layout, parent, false);
            holder.textView = (TextView) convertView.findViewById(R.id.classNames);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }
        holder.textView.setText(eventTypes.get(position).getEvent_type_name());
        return convertView;
    }

    @Override
    public void registerDataSetObserver(DataSetObserver observer) {
    }

    @Override
    public void unregisterDataSetObserver(DataSetObserver observer) {
    }

    @Override
    public int getCount() {
        return this.eventTypes.size();
    }

    @Override
    public Object getItem(int position) {
        return this.eventTypes.get(position);
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder = new ViewHolder();
        if (convertView == null) {
            LayoutInflater inflater = context.getLayoutInflater();
            convertView = inflater.inflate(R.layout.spinner_layout, parent, false);
            holder.textView = (TextView) convertView.findViewById(R.id.classNames);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }
        holder.textView.setText(eventTypes.get(position).getEvent_type_name());
        return convertView;
    }

    @Override
    public int getItemViewType(int position) {
        return 0;
    }

    @Override
    public int getViewTypeCount() {
        return 1;
    }

    @Override
    public boolean isEmpty() {
        return false;
    }

    private class ViewHolder {
        TextView textView;
    }

}
