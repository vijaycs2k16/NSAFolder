package nexrise.publication.in.nexrise.Gallery;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;

import nexrise.publication.in.nexrise.BeanClass.LoginObject;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.TabsPagerAdapter;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Activities.AlbumSelectFragment;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Activities.VideoAlbumSelectFragment;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Util.Constants;
import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class GalleryView extends AppCompatActivity {

    LoginObject userObject;
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_gallery_view);

        Intent intent = getIntent();
        userObject = (LoginObject) intent.getSerializableExtra("userObject");
        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.gallery);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        ViewPager vpPager = (ViewPager) findViewById(R.id.pager);
        setUpViewPager(vpPager);

        TabLayout tabLayout = (TabLayout)findViewById(R.id.tablayout);
        tabLayout.setupWithViewPager(vpPager);

        String[] tabTitle = {(String) getResources().getText(R.string.photos),(String) getResources().getText(R.string.videos)};
        for(int i=0; i<tabTitle.length; i++){
            tabLayout.getTabAt(i).setText(tabTitle[i]);
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    public void setUpViewPager(ViewPager viewPager){
        TabsPagerAdapter pagerAdapter = new TabsPagerAdapter(getSupportFragmentManager());
        AlbumSelectFragment albumSelectFragment = new AlbumSelectFragment();

        Bundle bundle = new Bundle();
        bundle.putInt(Constants.INTENT_EXTRA_LIMIT, 5);
        bundle.putSerializable("userObject",userObject);
        albumSelectFragment.setArguments(bundle);

        VideoAlbumSelectFragment videoAlbumSelectFragment = new VideoAlbumSelectFragment();
        videoAlbumSelectFragment.setArguments(bundle);

        pagerAdapter.addFragment(albumSelectFragment, "Photo");
        pagerAdapter.addFragment(videoAlbumSelectFragment, "Video");
        viewPager.setAdapter(pagerAdapter);
    }
}
