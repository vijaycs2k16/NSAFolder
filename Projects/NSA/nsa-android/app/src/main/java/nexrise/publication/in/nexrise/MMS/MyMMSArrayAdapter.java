package nexrise.publication.in.nexrise.MMS;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.MMS;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Karthik on 12/10/17.
 */

public class MyMMSArrayAdapter extends ArrayAdapter<MMS> implements Constants{
    private Activity context;
    protected int mediaFileLengthInMilliseconds;
    boolean prepared = false;

    public MyMMSArrayAdapter(@NonNull Activity context, int resource, ArrayList<MMS> audios) {
        super(context, resource, audios);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        final LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        final MMS mms = getItem(position);

        if(convertView == null) {
            convertView = inflater.inflate(R.layout.mms_layout, parent, false);
            holder.audioLayout = (RelativeLayout)convertView.findViewById(R.id.audio_layout);
            holder.title = (TextView)convertView.findViewById(R.id.title);
            holder.publishedDate = (TextView)convertView.findViewById(R.id.date);
            holder.publishedBy = (TextView)convertView.findViewById(R.id.published_by);
            holder.status = (TextView)convertView.findViewById(R.id.status);
            convertView.setTag(holder);
        } else
            holder = (ViewHolder)convertView.getTag();

        holder.status.setVisibility(View.VISIBLE);
        holder.title.setText(mms.getTitle());
        holder.publishedDate.setText(StringUtils.getInstance().dateSeperate(mms.getUpdatedDate()));
        holder.publishedBy.setText(mms.getPublishedBy());

        String status = mms.getStatus();
        if(status != null && status.equals(SENT)) {
            int color = context.getResources().getColor(R.color.green);
            holder.status.setBackgroundColor(color);
            holder.status.setText(status);
        } else {
            int color = context.getResources().getColor(R.color.yellow);
            holder.status.setBackgroundColor(color);
            holder.status.setText(status);
        }

        return convertView;
    }

    private class ViewHolder {
        TextView title;
        TextView publishedBy;
        TextView publishedDate;
        RelativeLayout audioLayout;
        TextView status;
    }
}
