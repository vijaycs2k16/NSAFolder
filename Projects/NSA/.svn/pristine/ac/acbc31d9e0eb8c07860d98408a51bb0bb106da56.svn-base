package nexrise.publication.in.nexrise.TimetableFeature;

import android.app.Activity;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.AlbumDetails;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 07-11-2016.
 */

public class ViewNotesGridAdapter extends ArrayAdapter<AlbumDetails> implements Constants {

    private Activity context;
    private List<AlbumDetails> list;
    private int resource;
    SharedPreferences preferences;
    String imageUrl;
    private String fileType;

    //This adapter has been used in view notes as well as photo fragment
    public ViewNotesGridAdapter(Activity context, int resource,  List<AlbumDetails> list, String fileType){
        super(context, resource, list);
        this.resource = resource;
        this.context = context;
        preferences = PreferenceManager.getDefaultSharedPreferences(context);
        this.list = list;
        this.fileType = fileType;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        try {
            LayoutInflater inflater = context.getLayoutInflater();
            ViewHolder holder = new ViewHolder();
            if (convertView == null) {
                convertView = inflater.inflate(resource, parent, false);
                holder.imageName = (TextView) convertView.findViewById(R.id.textView63);
                holder.icon = (ImageView) convertView.findViewById(R.id.imageView9);
                convertView.setTag(holder);
            } else
                holder = (ViewHolder) convertView.getTag();

            final AlbumDetails albumDetails = getItem(position);

            if (fileType.equals("image")) {

                if (albumDetails.getAlbums().size() > 0) {
                    Glide.with(context)
                            .load(albumDetails.getAlbums().get(0).getFileUrl())
                            .centerCrop().into(holder.icon);
                } else {
                    Glide.with(context)
                            .load(R.drawable.pic1)
                            .centerCrop().into(holder.icon);
                }

            } else {
                Glide.with(context)
                        .load(R.drawable.video_thumbnail)
                        .centerCrop().into(holder.icon);
            }

            holder.imageName.setText(albumDetails.getName());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return convertView;
    }

    private class ViewHolder {
        TextView imageName;
        ImageView icon;
    }
}
