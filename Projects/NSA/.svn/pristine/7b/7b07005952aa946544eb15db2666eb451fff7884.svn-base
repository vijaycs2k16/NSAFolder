package nexrise.publication.in.nexrise.Gallery;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.LinearLayout;

import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 15-12-2016.
 */

public class ShareWithArrayAdapter extends ArrayAdapter<String> {
    Activity context;

    public ShareWithArrayAdapter(Activity context, int resource, String[] options) {
        super(context, resource, options);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, final ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        final String options = getItem(position);
        convertView = inflater.inflate(R.layout.activity_selectoption_listview, parent, false);
        final CheckBox checkBox = (CheckBox)convertView.findViewById(R.id.checked_list);
        checkBox.setText(options);

        checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {

                assert options != null;
                if(options.equals("All") && isChecked) {
                    for (int i=0; i<parent.getChildCount(); i++) {
                        LinearLayout linearLayout = (LinearLayout)parent.getChildAt(i);
                        CheckBox selectAll = (CheckBox)linearLayout.findViewById(R.id.checked_list);
                        selectAll.setChecked(true);
                    }
                } else if (options.equals("All") && !isChecked) {
                    for (int i=0; i<parent.getChildCount(); i++) {
                        LinearLayout linearLayout = (LinearLayout)parent.getChildAt(i);
                        CheckBox selectAll = (CheckBox)linearLayout.findViewById(R.id.checked_list);
                        selectAll.setChecked(false);
                    }
                }
            }
        });
        return convertView;
    }
}
