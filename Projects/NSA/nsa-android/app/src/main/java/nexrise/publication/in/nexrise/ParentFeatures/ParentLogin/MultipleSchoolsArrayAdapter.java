package nexrise.publication.in.nexrise.ParentFeatures.ParentLogin;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.Common.DatabaseHelper;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Karthik on 9/25/17.
 */

public class MultipleSchoolsArrayAdapter extends ArrayAdapter<String>{
    private Activity context;
    private DatabaseHelper helper;
    public MultipleSchoolsArrayAdapter(@NonNull Activity context, ArrayList<String> schoolNames) {
        super(context, R.layout.parent_login_layout, schoolNames);
        this.context = context;
        helper = new DatabaseHelper(context);
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        String schoolName = getItem(position);
        convertView = context.getLayoutInflater().inflate(R.layout.parent_login_layout, parent, false);
        TextView textView = (TextView)convertView.findViewById(R.id.message_to);

        int count = 0;
        if(schoolName != null) {
            String[] words = schoolName.split("\\s");
            String schoolId = words[0];
            count = helper.getSumOfNotificationCount(schoolId);
            textView.setText(words[1]);
        }
        RelativeLayout notificationBadge = (RelativeLayout)convertView.findViewById(R.id.notification_badge);
        TextView notificationCount = (TextView)convertView.findViewById(R.id.notification_count);

        if(count != 0) {
            notificationBadge.setVisibility(View.VISIBLE);
            notificationCount.setText(String.valueOf(count));
        }
        return convertView;
    }
}
