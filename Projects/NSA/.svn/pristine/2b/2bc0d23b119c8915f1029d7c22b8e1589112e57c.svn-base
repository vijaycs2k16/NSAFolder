package nexrise.publication.in.nexrise.ParentFeatures.ParentLogin;

import android.app.Activity;
import android.support.annotation.LayoutRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.User;
import nexrise.publication.in.nexrise.Common.DatabaseHelper;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Karthik on 9/25/17.
 */

public class ParentLoginArrayAdapter extends ArrayAdapter<User> {
    private Activity context;
    private DatabaseHelper helper;

    public ParentLoginArrayAdapter(@NonNull Activity context, @LayoutRes int resource, ArrayList<User> usersList) {
        super(context, resource, usersList);
        this.context = context;
        helper = new DatabaseHelper(context);
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        convertView = context.getLayoutInflater().inflate(R.layout.parent_login_layout, parent, false);
        User user = getItem(position);
        TextView studentName = (TextView)convertView.findViewById(R.id.message_to);
        assert user != null;
        studentName.setText(user.getFirstName());
        RelativeLayout notificationBadge = (RelativeLayout)convertView.findViewById(R.id.notification_badge);
        TextView notificationCount = (TextView)convertView.findViewById(R.id.notification_count);

        int count = helper.notificationCountSumWithUserId(user.getSchoolId(), user.getUsername());
        if(count != 0) {
            notificationBadge.setVisibility(View.VISIBLE);
            notificationCount.setText(String.valueOf(count));
        }
        return convertView;
    }
}
