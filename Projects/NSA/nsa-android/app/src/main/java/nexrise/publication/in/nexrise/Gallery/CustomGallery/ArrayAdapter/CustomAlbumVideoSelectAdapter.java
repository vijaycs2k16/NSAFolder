package nexrise.publication.in.nexrise.Gallery.CustomGallery.ArrayAdapter;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.Gallery.CustomGallery.BeanClass.Album;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 19-12-2016.
 */

public class CustomAlbumVideoSelectAdapter extends CustomGenericAdapter<Album> {

    public CustomAlbumVideoSelectAdapter(Context context, ArrayList<Album> albumList) {
        super(context, albumList);
    }
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        CustomAlbumVideoSelectAdapter.ViewHolder viewHolder;

        if (convertView == null) {
            convertView = layoutInflater.inflate(R.layout.fragment_video_select_layout, null);

            viewHolder = new CustomAlbumVideoSelectAdapter.ViewHolder();
            viewHolder.imageView = (ImageView) convertView.findViewById(R.id.image_view_album_image);
            viewHolder.textView = (TextView) convertView.findViewById(R.id.text_view_album_name);

            convertView.setTag(viewHolder);

        } else {
            viewHolder = (CustomAlbumVideoSelectAdapter.ViewHolder) convertView.getTag();
        }

        viewHolder.imageView.getLayoutParams().width = size;
        viewHolder.imageView.getLayoutParams().height = size;

        viewHolder.textView.setText(arrayList.get(position).name);
        Glide.with(context)
                .load(arrayList.get(position).cover)
                .placeholder(R.drawable.image_placeholder).centerCrop().into(viewHolder.imageView);

        return convertView;
    }

    private static class ViewHolder {
        public ImageView imageView;
        public TextView textView;
    }
}
