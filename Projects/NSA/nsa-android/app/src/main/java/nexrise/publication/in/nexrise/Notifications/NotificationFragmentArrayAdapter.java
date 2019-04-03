package nexrise.publication.in.nexrise.Notifications;

import android.app.Activity;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Notify;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

import static nexrise.publication.in.nexrise.Constants.DRAFT;
import static nexrise.publication.in.nexrise.Constants.SENT;

/**
 * Created by Sai Deepak on 14-Oct-16.
 */

public class NotificationFragmentArrayAdapter extends ArrayAdapter<Notify> {

    Activity context;
    ArrayList<Notify> notificationsList = new ArrayList<Notify>();
    String userType;
    boolean showStatus;

    public NotificationFragmentArrayAdapter(Activity context, ArrayList<Notify> notificationsList, boolean showStatus) {
        super(context, R.layout.fragment_notification_list_view, notificationsList);
        this.context = context;
        this.notificationsList = notificationsList;
        this.showStatus = showStatus;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        Notify notificationObject = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();

        if(convertView == null) {
            convertView = inflater.inflate(R.layout.fragment_notification_list_view, parent, false);
            holder.title = (TextView) convertView.findViewById(R.id.notification_title);
            holder.status = (TextView) convertView.findViewById(R.id.notification_status);
            holder.date = (TextView) convertView.findViewById(R.id.date);
            holder.time = (TextView) convertView.findViewById(R.id.time);
            holder.desc = (TextView) convertView.findViewById(R.id.desc);
            holder.published = (TextView) convertView.findViewById(R.id.notification_published);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }

        assert notificationObject != null;
        holder.title.setText(notificationObject.getTitle());
        if(showStatus) {
            if (notificationObject.getStatus().equalsIgnoreCase(DRAFT)) {
                holder.status.setBackgroundColor(Color.parseColor("#FFCC00"));
                holder.status.setTextColor(Color.WHITE);
                holder.status.setText(DRAFT);
            } else {
                holder.status.setBackgroundColor(Color.parseColor("#31A231"));
                holder.status.setTextColor(Color.WHITE);
                holder.status.setText(SENT);
            }
        } else {
            holder.status.setVisibility(View.INVISIBLE);
        }
        holder.desc.setText(notificationObject.getPushTemplateMessage());
        holder.published.setText(notificationObject.getUsername());
        String dates = notificationObject.getUpdatedDate();
        holder.date.setText(new StringUtils().DateFormat(dates));
        holder.time.setText(new StringUtils().TimeFormat(dates));

        return convertView;
    }

    private class ViewHolder {
            TextView title;
            TextView status;
            TextView date;
            TextView time;
            TextView desc;
            TextView published;
        }
}
