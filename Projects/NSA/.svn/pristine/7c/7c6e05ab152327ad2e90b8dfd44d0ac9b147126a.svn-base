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

import nexrise.publication.in.nexrise.R;

/**
 * Created by praga on 10/4/2016.
 */

public class TeacherSpinnerAdapter implements SpinnerAdapter {

    Activity context;
    private List<Map.Entry<String, String>> teacherList;

    public TeacherSpinnerAdapter(Activity context, List<Map.Entry<String, String>> teacherList) {
        this.context = context;
        this.teacherList = teacherList;
    }

    @Override
    public View getDropDownView(int position, View convertView, ViewGroup parent) {
        Map.Entry<String, String> teacher = (Map.Entry<String, String>)getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.spinner_layout, parent, false);
        TextView textView = (TextView)convertView.findViewById(R.id.classNames);
        textView.setText(teacher.getValue());

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
        return this.teacherList.size();
    }

    @Override
    public Object getItem(int position) {
        return this.teacherList.get(position);
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
        Map.Entry<String, String> teacher = (Map.Entry<String, String>)getItem(position);
        ViewHolder holder = new ViewHolder();
        if(convertView == null) {
            LayoutInflater inflater = context.getLayoutInflater();
            convertView = inflater.inflate(R.layout.spinner_layout, parent, false);
            holder.teacherName = (TextView)convertView.findViewById(R.id.classNames);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }
        holder.teacherName.setText(teacher.getValue());

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
        TextView teacherName;
    }
}
