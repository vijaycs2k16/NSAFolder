package nexrise.publication.in.nexrise.HomeworkFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.R;

/**
 * Created by user on 26-Sep-16.
 */

public class DetailsFragmentArrayAdapter extends ArrayAdapter<String> {
    Activity context;
    private List<String> key;
    private ArrayList<String> value;
    public DetailsFragmentArrayAdapter(Activity context, List<String> key, ArrayList<String> value) {
        super(context, R.layout.fragment_details_listview_layout, key);
        this.context = context;
        this.key = key;
        this.value = value;
    }

    public class ViewHolder{
        TextView textView1;
        TextView textView2;
    }
    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {

        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.fragment_details_listview_layout, parent, false);
        TextView textView = (TextView)convertView.findViewById(R.id.details_left_textview);
        TextView textView1 = (TextView)convertView.findViewById(R.id.details_right_textview);

        textView.setText(key.get(position));
        textView1.setText(value.get(position));

        return convertView;
    }
}
