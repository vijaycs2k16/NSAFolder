package nexrise.publication.in.nexrise.HomeworkFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by karthik on 07-10-2016.
 */

class DrawerFragmentArrayAdapter extends BaseAdapter {
    Activity context;
    private ArrayList<Integer> icons;
    private List<Map.Entry<String, String>> moreOptions;
    private ArrayList<String> featureName;

    DrawerFragmentArrayAdapter(Activity context, List<Map.Entry<String, String>> moreOptions, ArrayList<Integer> icons,ArrayList<String> featureName) {
        this.context = context;
        this.icons = icons;
        this.moreOptions = moreOptions;
        this.featureName = featureName;
    }

    @Override
    public int getCount() {
        return moreOptions.size();
    }

    @Override
    public Object getItem(int position) {
        return moreOptions.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        Map.Entry<String, String> options = (Map.Entry<String, String>)getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.fragment_drawer_listview_layout, parent, false);
        TextView textView = (TextView) convertView.findViewById(R.id.draw_textview);
        ImageView imageView = (ImageView)convertView.findViewById(R.id.draw_imageview);
        imageView.setImageResource(icons.get(position));
        imageView.setColorFilter(context.getResources().getColor(R.color.appColor));
        textView.setText( featureName.get(position));

        Log.v("Sub:: ","Feature "+options.getValue());
        Integer count = StringUtils.getInstance().getNotificationCount(context, options.getValue());

        FrameLayout countLayout = (FrameLayout)convertView.findViewById(R.id.drawer_badge_layout);
        if(count != 0) {
            countLayout.setVisibility(View.VISIBLE);
            TextView displayCount = (TextView)convertView.findViewById(R.id.badge_text);
            displayCount.setText(String.valueOf(count));
        } else
            countLayout.setVisibility(View.INVISIBLE);

        return convertView;
    }
}
