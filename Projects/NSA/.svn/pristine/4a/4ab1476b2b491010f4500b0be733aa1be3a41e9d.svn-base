package nexrise.publication.in.nexrise.Gallery;

import android.app.Activity;
import android.graphics.drawable.Drawable;
import android.support.annotation.LayoutRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.ImageDetails;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 8/31/17.
 */

public class GalleryGridAdapter extends ArrayAdapter<ImageDetails> implements Constants {
    Activity context;

    public GalleryGridAdapter(@NonNull Activity context, @LayoutRes int resource, ArrayList<ImageDetails> albumList) {
        super(context, resource, albumList);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        ImageDetails album = getItem(position);
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.gallery_grid_layout, parent, false);
            holder.thumbnail = (ImageView)convertView.findViewById(R.id.imageView9);
            holder.fileName = (TextView)convertView.findViewById(R.id.textView63);
            convertView.setTag(holder);
        } else
            holder =  (ViewHolder) convertView.getTag();
        Drawable loadingFailed = context.getResources().getDrawable(R.drawable.broken_image);

        assert album != null;
        Log.v("image ","type "+album.getFile_type());
        if(album.getFile_type().equals(".jpg"))
            Glide.with(context)
                    .load(album.getFile_url())
                    .centerCrop().into(holder.thumbnail);
        else if(album.getFile_type().equals("image"))
            Glide.with(context)
                    .load(album.getFile_url())
                    .centerCrop().into(holder.thumbnail);
        else if(album.getFile_type().equals(".png"))
            Glide.with(context)
                    .load(album.getFile_url())
                    .centerCrop().into(holder.thumbnail);
        else if(album.getFile_type().equals(".pdf"))
            Glide.with(context)
                    .load(album.getFile_url())
                    .placeholder(R.drawable.pdf_file_format).into(holder.thumbnail).onLoadFailed(new Exception("Loading failed"), loadingFailed);
            else if (album.getFile_type().equals(".doc"))
            Glide.with(context)
                    .load(album.getFile_url())
                    .placeholder(R.drawable.doc_file_format).into(holder.thumbnail).onLoadFailed(new Exception("Loading failed"), loadingFailed);
        else if(album.getFile_type().equals(".txt"))
            Glide.with(context)
                    .load(album.getFile_url())
                    .placeholder(R.drawable.txt_file_format).into(holder.thumbnail).onLoadFailed(new Exception("Loading failed"), loadingFailed);
        else if(album.getFile_type().equals(".xlsx"))
            Glide.with(context)
                    .load(album.getFile_url())
                    .placeholder(R.drawable.xlsx_file_format).into(holder.thumbnail).onLoadFailed(new Exception("Loading failed"), loadingFailed);
        else
            Glide.with(context)
                    .load(R.drawable.video_thumbnail)
                    .centerCrop().into(holder.thumbnail);

        holder.fileName.setText(album.getFileName());
        return convertView;
    }

    private class ViewHolder {
        ImageView thumbnail;
        TextView fileName;
    }
}
