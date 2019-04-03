package nexrise.publication.in.nexrise.Gallery;

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

import nexrise.publication.in.nexrise.BeanClass.ImageDetails;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;

/**
 * Created by praga on 29-Jun-17.
 */

public class ViewImageGridAdapter extends ArrayAdapter<ImageDetails> implements Constants {
    private Activity context;
    private List<ImageDetails> list;
    private int resource;
    SharedPreferences preferences;
    private String schoolId;
    String imageUrl;
    //This adapter has been used in view notes as well as photo fragment
    public ViewImageGridAdapter(Activity context, int resource,  List<ImageDetails> list){
        super(context, resource, list);
        this.resource = resource;
        this.context = context;
        preferences = PreferenceManager.getDefaultSharedPreferences(context);
        schoolId = preferences.getString(SCHOOL_ID, null);
        this.list = list;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        convertView = inflater.inflate(resource, parent, false);
        ImageDetails albumDetails = getItem(position);
        String image = AWS_BASE_URL + schoolId + "/" +albumDetails.getFile_url();
        ImageView icon = (ImageView)convertView.findViewById(R.id.imageView9);
        Glide.with(context)
                .load(image)
                .centerCrop().into(icon);
        TextView imageName = (TextView)convertView.findViewById(R.id.textView63);
        imageName.setText(albumDetails.getFileName());
        return convertView;
    }
}
