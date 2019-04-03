package nexrise.publication.in.nexrise.Gallery;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.SelectOptionDataProvider;
import nexrise.publication.in.nexrise.R;

/**
 * Created by praga on 01-Dec-16.
 */

public class SelectOptionAdapter extends ArrayAdapter {
    List list = new ArrayList();
    public SelectOptionAdapter(Context context, int resource) {
        super(context, resource);
    }
    static class DataHandler {
        CheckBox checkBox;
    }

    @Override
    public void add(Object object) {
        super.add(object);
        list.add(object);
    }

    @Override
    public int getCount() {
        return list.size();
    }

    @Nullable
    @Override
    public Object getItem(int position) {
        return list.get(position);
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View row;
        row = convertView;
        SelectOptionAdapter.DataHandler handler;
        if (convertView==null){
            LayoutInflater inflater = (LayoutInflater)this.getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            row = inflater.inflate(R.layout.activity_selectoption_listview,parent,false);
            handler = new SelectOptionAdapter.DataHandler();
            handler.checkBox = (CheckBox) row.findViewById(R.id.checked_list);
            row.setTag(handler);
        }
        else
        {
            handler = (SelectOptionAdapter.DataHandler) row.getTag();
        }
        SelectOptionDataProvider dataProvider;
        dataProvider = (SelectOptionDataProvider) this.getItem(position);
        handler.checkBox.setText(dataProvider.getSelectoption());



        return row;
    }
}
