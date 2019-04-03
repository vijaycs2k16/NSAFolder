package nexrise.publication.in.nexrise.ReusedActivities;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 06-04-2017.
 */

public class AddFilesSpinnerAdapter extends BaseAdapter {
    private int[] icons;
    private String[] values;
    private Activity context;

    AddFilesSpinnerAdapter(Activity context, int[] icons, String[] values) {
        this.context = context;
        this.icons = icons;
        this.values = values;
    }
    @Override
    public int getCount() {
        return values.length;
    }

    @Override
    public Object getItem(int position) {
        return values[position];
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        String value = (String)getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.image_with_text, parent, false);

        ImageView icon = (ImageView)convertView.findViewById(R.id.imageView26);
        icon.setImageResource(icons[position]);

        TextView textView1 = (TextView)convertView.findViewById(R.id.textView5);
        textView1.setText(value);

        return convertView;
    }
}
