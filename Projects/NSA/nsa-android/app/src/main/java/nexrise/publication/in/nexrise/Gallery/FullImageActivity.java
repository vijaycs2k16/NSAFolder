package nexrise.publication.in.nexrise.Gallery;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.davemorrissey.labs.subscaleview.ImageSource;
import com.davemorrissey.labs.subscaleview.SubsamplingScaleImageView;

import java.util.ArrayList;
import java.util.List;

import butterknife.ButterKnife;
import butterknife.InjectView;
import nexrise.publication.in.nexrise.BeanClass.ImageDetails;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.BeanClass.Image;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Util.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

public class FullImageActivity extends BaseImageActivity implements nexrise.publication.in.nexrise.Constants{
    public static final String TAG = "GalleryActivity";
    public static final String INTENT_EXTRA_IMAGES ="images" ;

    // public static final String EXTRA_NAME = "images";

    List<Image> images = new ArrayList<Image>();
    private GalleryPagerAdapter adapter;
    int imagePosition;
    ArrayList<ImageDetails> imagesList;
    String schoolId;
    StringUtils utils;
    SharedPreferences preferences;
    Utility utility;

    @InjectView(R.id.pager) ViewPager pager;
    @InjectView(R.id.thumbnails) LinearLayout thumbnails;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_full_image);
        ButterKnife.inject(this);
        utils = new StringUtils();
        utility = new Utility();

        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        images = getIntent().getParcelableArrayListExtra(Constants.INTENT_EXTRA_IMAGES);
     // images = (ArrayList<Image>) getIntent().getParcelableExtra(Constants.INTENT_EXTRA_IMAGES);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        schoolId = preferences.getString(SCHOOL_ID, null);
        Intent intent = getIntent();
        if(intent.hasExtra("Images")) {
            imagesList = (ArrayList<ImageDetails>)intent.getSerializableExtra("Images");
            imagePosition = intent.getIntExtra("ImagePosition",imagePosition);
            adapter = new GalleryPagerAdapter(this);
            pager.setAdapter(adapter);
            pager.setOffscreenPageLimit(6);
            pager.setCurrentItem(imagePosition);
            // how many images to load into memory
        }

        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle("Photo");
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
    }

    class GalleryPagerAdapter extends PagerAdapter {

        Context _context;
        LayoutInflater _inflater;

        public GalleryPagerAdapter(Context context) {
            _context = context;
            _inflater = (LayoutInflater) _context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        }

        @Override
        public int getCount() {
            return imagesList.size();
        }

        @Override
        public boolean isViewFromObject(View view, Object object) {
            return view == object;
        }
        @Override
        public Object instantiateItem(ViewGroup container, final int position) {

            final View itemView = _inflater.inflate(R.layout.pager_gallery_item, container, false);
            container.addView(itemView);


            // Get the border size to show around each image
            int borderSize = thumbnails.getPaddingTop();

            // Get the size of the actual thumbnail image
            int thumbnailSize = ((FrameLayout.LayoutParams)
                    pager.getLayoutParams()).bottomMargin - (borderSize*2);

            // Set the thumbnail layout parameters. Adjust as required
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(thumbnailSize, thumbnailSize);
            params.setMargins(0, 0, borderSize, 0);

            // You could also set like so to remove borders
            //ViewGroup.LayoutParams params = new ViewGroup.LayoutParams(
            //        ViewGroup.LayoutParams.WRAP_CONTENT,
            //        ViewGroup.LayoutParams.WRAP_CONTENT);

            final ImageView thumbView = new ImageView(_context);

            thumbView.setScaleType(ImageView.ScaleType.CENTER_CROP);
            thumbView.setLayoutParams(params);


            final int finalPosition = position;
            thumbView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.d(TAG, "Thumbnail clicked");
                    Log.v("File name "," "+imagesList.get(position).getFile_url());
                    // Set the pager position when thumbnail clicked
                    pager.setCurrentItem(position);
                }
            });
            thumbnails.addView(thumbView);

            final SubsamplingScaleImageView imageView =
                    (SubsamplingScaleImageView) itemView.findViewById(R.id.image);

            // Asynchronously load the image and set the thumbnail and pager view

            String completeUrl = "";
            if(imagesList.get(position).getFile_url().contains(AWS_BASE_URL + schoolId + "/"))
                completeUrl = imagesList.get(position).getFile_url();
            else
                completeUrl = AWS_BASE_URL + schoolId + "/" + imagesList.get(position).getFile_url();

            Log.v("FIle ","url "+completeUrl);
            Glide.with(_context)
                    .load(completeUrl)
                    .asBitmap()
                    .into(new SimpleTarget<Bitmap>() {
                        @Override
                        public void onResourceReady(Bitmap bitmap, GlideAnimation anim) {
                            imageView.setImage(ImageSource.bitmap(bitmap));
                            thumbView.setImageBitmap(bitmap);
                        }
                    });

            return itemView;
        }

        @Override
        public void destroyItem(ViewGroup container, int position, Object object) {
            container.removeView((LinearLayout) object);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.download_actionbar, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case R.id.download:
                try {
                    ImageDetails imageDetails = imagesList.get(pager.getCurrentItem());
                    String imageUrl =  imageDetails.getFile_url();

                    if(imageUrl.contains(AWS_BASE_URL + schoolId + "/"))
                        imageUrl = imageUrl.replace(AWS_BASE_URL + schoolId + "/", "");

                    fileDownload(imageUrl, imageDetails.getFileName());
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }
}
