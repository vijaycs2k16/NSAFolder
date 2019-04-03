package nexrise.publication.in.nexrise.Gallery;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.Gallery.CustomGallery.BeanClass.Image;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.AttachmentActivity;

/**
 * Created by karthik on 16-12-2016.
 */

public class SelectedImagesArrayAdapter extends ArrayAdapter<Image> {
    Activity context;
    private ArrayList<Image> selectedImaages;
    private int resource;
    private int size;

    public SelectedImagesArrayAdapter(Activity context, int resource, ArrayList<Image> selectedImages) {
        super(context, resource, selectedImages);
        this.context = context;
        this.resource = resource;
        this.selectedImaages = selectedImages;
    }

    @NonNull
    @Override
    public View getView(final int position, View convertView, @NonNull ViewGroup parent) {

        ViewHolder holder;
        if(convertView == null) {
            holder = new ViewHolder();
            LayoutInflater inflater = context.getLayoutInflater();
            convertView = inflater.inflate(resource, parent, false);
            holder.imageView = (ImageView)convertView.findViewById(R.id.imageView19);
            holder.imageName = (TextView)convertView.findViewById(R.id.textView7);
            holder.closeButton = (ImageView)convertView.findViewById(R.id.imageView24);
            holder.retryUpload = (RelativeLayout)convertView.findViewById(R.id.retry_layout);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }

        final Image imagePath = getItem(position);
        assert imagePath != null;
        if(!imagePath.path.isEmpty()) {
            String name = imagePath.name.toLowerCase();
            Log.v("Image","Name"+name);

            if(name.endsWith(".txt") || name.endsWith(".pdf") || name.endsWith(".docx") || name.endsWith(".docs")) {
                holder.imageView.setImageResource(R.drawable.pdf);
            } else {
                Bitmap decodedPath = BitmapFactory.decodeFile(imagePath.path);
                holder.imageView.setImageBitmap(decodedPath);
            }
            holder.imageName.setText(imagePath.name);

            holder.closeButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    selectedImaages.remove(position);
                    notifyDataSetChanged();
                }
            });

            if(context instanceof AttachmentActivity)
                holder.retryUpload.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        AttachmentActivity uploadImage = (AttachmentActivity)context;
                        uploadImage.uploadImagesSeperately(imagePath, position);
                    }
                });
        }

        holder.imageView.getLayoutParams().width = size;
        holder.imageView.getLayoutParams().height = size;
        Log.v("Layout ", "parms " + size);
        return convertView;
    }

    private class ViewHolder {
        ImageView imageView;
        TextView imageName;
        ImageView closeButton;
        RelativeLayout retryUpload;
    }

    public void setLayoutParms(int size) {
        this.size = size;
    }
}
