package nexrise.publication.in.nexrise.MMS;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.RadioButton;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.MMS;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 12/9/17.
 */

public class AudioGalleryArrayAdapter extends BaseAdapter implements Constants {
    private Activity context;
    private ArrayList<MMS> audios;
    private RadioButton selected = null;
    private int selectedPosition = -1;

    public AudioGalleryArrayAdapter(@NonNull Activity context, ArrayList<MMS> audios) {
        this.context = context;
        this.audios = audios;
    }

    @Override
    public int getCount() {
        return audios.size();
    }

    @Override
    public Object getItem(int i) {
        return audios.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        final LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        final MMS mms = (MMS)getItem(position);
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.audio_gallery_layout, parent, false);
            holder.audioLayout = (RelativeLayout)convertView.findViewById(R.id.audio_layout);
            holder.fileName = (TextView)convertView.findViewById(R.id.title);
            holder.publishedDate = (TextView)convertView.findViewById(R.id.date);
            holder.publishedBy = (TextView)convertView.findViewById(R.id.published_by);
            holder.radioButton = (RadioButton)convertView.findViewById(R.id.recorded_checkbox);
            holder.status = (TextView)convertView.findViewById(R.id.status);

            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        holder.fileName.setText(mms.getFileName());
        holder.publishedDate.setText(mms.getUpdatedDate());
        holder.publishedBy.setText(mms.getPublishedBy());

        if(mms.getStatus() != null) {
            String status = mms.getStatus();
            if(status.toLowerCase().contains("initiated")) {
                int color = context.getResources().getColor(R.color.orange);
                holder.status.setBackgroundColor(color);
                holder.status.setText("Initiated");
            } else if(status.toLowerCase().contains("approved")) {
                int color = context.getResources().getColor(R.color.green);
                holder.status.setBackgroundColor(color);
                holder.status.setText("Approved");
            } else if(status.toLowerCase().contains("rejected")) {
                int color = context.getResources().getColor(R.color.colorRed);
                holder.status.setBackgroundColor(color);
                holder.status.setText("Rejected");
            }
        }
        final AudioGalleryActivity audioGallery = (AudioGalleryActivity) context;

        /*if(position == getCount() -1) {
            if (selected == null) {
                holder.radioButton.setChecked(true);
                selected = holder.radioButton;
                audioGallery.selectedObject(mms);
            }
        }*/
        holder.radioButton.setChecked(position == selectedPosition);
        holder.radioButton.setTag(position);
        final ViewHolder finalHolder = holder;
        holder.radioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

               /* if (selected != null) {
                    selected.setChecked(false);
                }
                finalHolder.radioButton.setChecked(true);
                selected = finalHolder.radioButton;*/
                itemCheckChanged(view);
                audioGallery.selectedObject(mms);
            }
        });

        holder.audioLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String streamingUrl = AWS_BASE_URL + mms.getSchoolId() + "/"+ mms.getDownloadLink();
                new AudioPlayer().playAudio(streamingUrl, mms.getFileName(), inflater, context);
            }
        });
        return convertView;
    }

    private void itemCheckChanged(View v) {
        selectedPosition = (Integer) v.getTag();
        notifyDataSetChanged();
    }

    private class ViewHolder {
        TextView fileName;
        TextView publishedBy;
        TextView publishedDate;
        TextView status;
        RelativeLayout audioLayout;
        RadioButton radioButton;
    }
}
