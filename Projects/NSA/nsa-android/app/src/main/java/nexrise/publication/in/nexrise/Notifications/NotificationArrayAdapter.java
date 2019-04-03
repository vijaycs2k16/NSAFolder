package nexrise.publication.in.nexrise.Notifications;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.RelativeLayout;
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

class NotificationArrayAdapter extends BaseAdapter {

    private Activity context;
    private ArrayList<Notify> notificationsList;
    String userType;
    private boolean showStatus;
    ViewHolder holder;
    ArrayList<Notify> tempList;

    NotificationArrayAdapter(Activity context, ArrayList<Notify> notificationsList, boolean showStatus) {
        this.context = context;
        this.notificationsList = notificationsList;
        this.showStatus = showStatus;
    }
    @Override
    public int getCount() {
        return notificationsList.size() ;
    }

    @Override
    public Object getItem(int position) {
        return notificationsList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }


    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        Notify notificationObject = (Notify) getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();

        holder = new ViewHolder();

        if(convertView == null) {
            convertView = inflater.inflate(R.layout.fragment_notification_list_view, parent, false);
            holder.title = (TextView) convertView.findViewById(R.id.notification_title);
            holder.status = (TextView) convertView.findViewById(R.id.notification_status);
            holder.date = (TextView) convertView.findViewById(R.id.date);
            holder.time = (TextView) convertView.findViewById(R.id.time);
            holder.desc = (TextView) convertView.findViewById(R.id.desc);
            holder.published = (TextView) convertView.findViewById(R.id.notification_published);
            holder.attachmentIndication = (RelativeLayout) convertView.findViewById(R.id.attachments_indication);
            holder.attachmentCount = (TextView)convertView.findViewById(R.id.attachment_count);
            holder.closeButton = (ImageView)convertView.findViewById(R.id.close);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }

        assert notificationObject != null;
        holder.title.setText(notificationObject.getTitle());
        if(!notificationObject.getTitle().equalsIgnoreCase("null")){
            holder.title.setText(notificationObject.getTitle());
        } else {
            holder.title.setText(notificationObject.getPushTemplateTitle());
        }
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
            holder.closeButton.setVisibility(View.GONE);
        } else {
            holder.status.setVisibility(View.INVISIBLE);
            holder.closeButton.setVisibility(View.VISIBLE);
            holder.closeButton.getTag(position);
            closeButtonListener(holder.closeButton, notificationObject.getNotificationId(), notificationObject.getId(),position);

        }

        if(notificationObject.getAttachments() != null && notificationObject.getAttachments().size() != 0) {
            holder.attachmentIndication.setVisibility(View.VISIBLE);
            holder.attachmentCount.setText(notificationObject.getAttachments().size()+ "- Attachment(s)");
        } else
            holder.attachmentIndication.setVisibility(View.INVISIBLE);

        holder.desc.setText(notificationObject.getPushTemplateMessage());
        holder.published.setText(notificationObject.getUpdatedUsername());
        String dates = notificationObject.getUpdatedDate();
        holder.date.setText(new StringUtils().Dateset(dates));
        holder.time.setText(new StringUtils().timeSet(dates));
        return convertView;
    }

    private void closeButtonListener(ImageView closeButton, final String notificationId, final String id, final int position) {
        if(context instanceof NotificationLogActivity) {

            closeButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    final NotificationLogActivity notificationLogActivity = (NotificationLogActivity)context;
                    if(!notificationLogActivity.clicked) {
                        final AlertDialog builder = new AlertDialog.Builder(context).setMessage("Do you want to delete the notification").setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                               boolean data =  notificationLogActivity.removeNotification(notificationsList,notificationId, id);
                                if(data)
                                notifyDataSetChanged();

                                dialogInterface.dismiss();
                            }
                        }).setNegativeButton("CANCEL", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                dialogInterface.dismiss();
                            }
                        }).create();
                        builder.show();
                    }
                }
            });
        }
    }

    private class ViewHolder {
        TextView title;
        TextView status;
        TextView date;
        TextView time;
        TextView desc;
        TextView published;
        ImageView closeButton;
        RelativeLayout attachmentIndication;
        TextView attachmentCount;
    }
}
