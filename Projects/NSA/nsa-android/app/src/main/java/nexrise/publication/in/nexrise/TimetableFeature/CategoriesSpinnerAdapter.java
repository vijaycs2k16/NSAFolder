package nexrise.publication.in.nexrise.TimetableFeature;

import android.app.Activity;
import android.database.DataSetObserver;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SpinnerAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import nexrise.publication.in.nexrise.BeanClass.Template;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Sai Deepak on 04-Oct-16.
 */

public class CategoriesSpinnerAdapter implements SpinnerAdapter {

    Activity context;
    Map<String, ?> valueMap;
    int count;
    List<Template> templates = new ArrayList<Template>();

    public CategoriesSpinnerAdapter(Activity context,List<Template> templates) {
        this.context = context;
        this.templates = templates;
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
        holder.textView.setText(templates.get(position).getTitle());
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
        return this.templates.size();
    }

    @Override
    public Object getItem(int position) {
        return this.templates.get(position);
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
        holder.textView.setText(templates.get(position).getTitle());
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
