package nexrise.publication.in.nexrise.Gallery;

import android.app.Activity;
import android.util.SparseArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;

import nexrise.publication.in.nexrise.R;

/**
 * Created by praga on 10/19/2016.
 */

public class GalleryImageAdapter extends BaseAdapter {

    private Activity context;
    static int[] images = {R.drawable.pic1,R.drawable.pic2,R.drawable.pic3,R.drawable.pic4,R.drawable.pic1,
            R.drawable.pic1,R.drawable.pic2,R.drawable.pic3,R.drawable.pic4,R.drawable.pic1,
            R.drawable.pic1,R.drawable.pic2,R.drawable.pic3,R.drawable.pic4,R.drawable.pic1,
            R.drawable.pic1,R.drawable.pic2,R.drawable.pic3,R.drawable.pic4,R.drawable.pic1};

    GalleryImageAdapter(Activity context) {
        this.context = context;
        //this.images = images;
    }

    public static class ViewHolder {
        @SuppressWarnings("unchecked")
        public static <T extends View> T get(View view, int id) {
            SparseArray<View> viewHolder = (SparseArray<View>) view.getTag();
            if (viewHolder == null) {
                viewHolder = new SparseArray<View>();
                view.setTag(viewHolder);
            }
            View childView = viewHolder.get(id);
            if (childView == null) {
                childView = view.findViewById(id);
                viewHolder.put(id, childView);
            }
            return (T) childView;
        }
    }

    @Override
    public int getCount() {
        return images.length;
    }

    @Override
    public Object getItem(int position) {
        return images[position];
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.gallery_grid_item, parent, false);
        }
        ImageView imageView = ViewHolder.get(convertView, R.id.image);
        imageView.setImageResource(images[position]);
        imageView.setTag(String.valueOf(images[position]));
        return convertView;
    }
}
