package nexrise.publication.in.nexrise.Common;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import nexrise.publication.in.nexrise.R;

/**
 * Created by user on 23-Sep-16.
 */

public class CommonArrayAdapter extends ArrayAdapter<String> {

    private Activity context;
    private int resource;

    public CommonArrayAdapter(Activity context, int resource, String[] moreOptions) {
        super(context, resource, moreOptions);
        this.context = context;
        this.resource = resource;
    }

    private class ViewHolder{
        TextView textView;
    }
    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder = new ViewHolder();
        String options = getItem(position);

            LayoutInflater inflater = context.getLayoutInflater();
            convertView = inflater.inflate(resource, parent, false);
            TextView textView = (TextView) convertView.findViewById(R.id.drawer_textview);

            textView.setText(options);
        return convertView;
    }
}
