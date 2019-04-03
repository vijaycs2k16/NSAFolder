package nexrise.publication.in.nexrise.Gallery;

import android.app.Activity;
import android.support.annotation.LayoutRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.VideoView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.AlbumDetails;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 8/29/17.
 */

public class VideosGridAdapter extends ArrayAdapter<AlbumDetails> implements Constants {
    private Activity context;

    public VideosGridAdapter(@NonNull Activity context, @LayoutRes int resource, ArrayList<AlbumDetails> albumDetailsList) {
        super(context, resource, albumDetailsList);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(R.layout.video_grid_layout, parent, false);
        AlbumDetails albumDetails = getItem(position);
        VideoView videoView = (VideoView)convertView.findViewById(R.id.imageView9);
        videoView.setVideoPath(albumDetails.getImages().get(0));
      //  videoView.start();

        return convertView;
    }
}
