package nexrise.publication.in.nexrise.ExamFeature;

import android.app.Activity;
import android.database.DataSetObserver;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SpinnerAdapter;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.ClassAndSection;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Karthik on 7/27/17.
 */

class ClassSectionSpinner implements SpinnerAdapter {
    private Activity context;
    private ArrayList<ClassAndSection> classSection;

    ClassSectionSpinner(Activity context, ArrayList<ClassAndSection> classSection) {
        this.context = context;
        this.classSection = classSection;
    }
    @Override
    public View getDropDownView(int i, View view, ViewGroup viewGroup) {
        ClassAndSection classAndSection = (ClassAndSection) this.getItem(i);
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        if(view == null) {
            view = inflater.inflate(R.layout.spinner_layout, viewGroup, false);
            holder.textView = (TextView)view.findViewById(R.id.classNames);
            view.setTag(holder);
        } else
            holder = (ViewHolder) view.getTag();
        holder.textView.setText(classAndSection.getClass_name()+" - "+classAndSection.getSection_name());
        return view;
    }

    @Override
    public void registerDataSetObserver(DataSetObserver dataSetObserver) {

    }

    @Override
    public void unregisterDataSetObserver(DataSetObserver dataSetObserver) {

    }

    @Override
    public int getCount() {
        int count = 0;
        try {
            count = classSection.size();
        } catch (NullPointerException e) {
            return count;
        }
        return count;
    }

    @Override
    public Object getItem(int i) {
        return classSection.get(i);
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        ClassAndSection classAndSection = (ClassAndSection) this.getItem(i);
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        if(view == null) {
            view = inflater.inflate(R.layout.spinner_layout, viewGroup, false);
            holder.textView = (TextView)view.findViewById(R.id.classNames);
            view.setTag(holder);
        } else
            holder = (ViewHolder) view.getTag();
        holder.textView.setText(classAndSection.getClass_name()+" - "+classAndSection.getSection_name());

        return view;
    }

    @Override
    public int getItemViewType(int i) {
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
