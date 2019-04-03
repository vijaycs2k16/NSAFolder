package nexrise.publication.in.nexrise.TimetableFeature;

import android.app.Activity;
import android.database.DataSetObserver;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SpinnerAdapter;
import android.widget.TextView;

import java.util.List;
import java.util.Map;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Sai Deepak on 04-Oct-16.
 */

public class AddClassFragmentAdapter implements SpinnerAdapter {

    Activity context;
    Map<String, ?> valueMap;
    int count;
    List<Classes> classList;

    public AddClassFragmentAdapter(Activity context, List<Classes> classList) {
        this.context = context;
        this.classList = classList;
    }

    @Override
    public View getDropDownView(int position, View convertView, ViewGroup parent) {
        Classes classes = (Classes) this.getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();

        ViewHolder holder = new ViewHolder();
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.spinner_layout, parent, false);
            holder.textView = (TextView) convertView.findViewById(R.id.classNames);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }
        assert classes != null;
        holder.textView.setText(classes.getLabel());
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
        int count = 0;
        try {
            count = classList.size();
        } catch (NullPointerException e) {
            return count;
        }
        return count;
    }

    @Override
    public Object getItem(int position) {
        return classList.get(position);
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
        Classes classes = (Classes) this.getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.spinner_layout, parent, false);

            holder.textView = (TextView) convertView.findViewById(R.id.classNames);
            convertView.setTag(holder);
        }else {
            holder = (ViewHolder) convertView.getTag();
        }
        assert classes!= null;
        holder.textView.setText(classes.getLabel());
        return convertView;
    }

    @Override
    public int getItemViewType(int position) {
        return 1;
    }

    @Override
    public int getViewTypeCount() {
        return 1;
    }

    @Override
    public boolean isEmpty() {
        return false;
    }
    private class ViewHolder{
        TextView textView;

    }
}
