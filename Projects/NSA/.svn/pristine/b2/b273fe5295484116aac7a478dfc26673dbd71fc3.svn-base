package nexrise.publication.in.nexrise.Gallery;

import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.design.widget.CoordinatorLayout;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Album;
import nexrise.publication.in.nexrise.BeanClass.AlbumDetails;
import nexrise.publication.in.nexrise.Common.BaseActivity;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.ClassTabbedFragmentAdapter;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class AlbumsActivity extends BaseActivity implements Constants {
    SharedPreferences preferences;
    ArrayList<AlbumDetails> photosList;
    ArrayList<AlbumDetails> videosList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_albums);
        photosList = new ArrayList<>();
        videosList = new ArrayList<>();

        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null) {
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.albums);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        renderData();
    }

    private void renderData() {
        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String galleryUrl = BASE_URL + API_VERSION_ONE + GALLERY +"?category&orderBy=desc";
        Log.v("gallary","url "+galleryUrl);
        GETUrlConnection galleryCredential = new GETUrlConnection(this, galleryUrl,null){
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.loading_bar);
            TextView noContent = (TextView)findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Album","response"+response);
                progressBar.setVisibility(View.INVISIBLE);
                try {
                    new StringUtils().checkSession(response);
                    albumParser(response);
                    renderTab();
                } catch (NullPointerException | JSONException e) {
                    e.printStackTrace();
                    progressBar.setVisibility(View.INVISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(AlbumsActivity.this);
                }
            }
        };

        if(isConnected())
            galleryCredential.execute();
        else
            Toast.makeText(this, R.string.internet_connection_check, Toast.LENGTH_SHORT).show();
    }

    public void albumParser(String response) throws JSONException, NullPointerException {

        JSONObject mainObject = new JSONObject(response);
        String schoolId = preferences.getString(SCHOOL_ID,null);
        JSONArray dataArray = mainObject.getJSONArray(DATA);
        if(dataArray.length() == 0 )
            throw new JSONException("Empty Data");
        for (int i = 0; i < dataArray.length(); i++) {
            AlbumDetails photoAlbumDetails = new AlbumDetails();
            AlbumDetails videoAlbumDetails = new AlbumDetails();
            JSONObject dataObject = dataArray.getJSONObject(i);
            String album_id = dataObject.getString("album_id");
            String name = dataObject.getString("name");
            photoAlbumDetails.setAlbum_id(album_id);
            photoAlbumDetails.setName(name);

            videoAlbumDetails.setAlbum_id(album_id);
            videoAlbumDetails.setName(name);

            Object albumDetailsObj = dataObject.get("albumDetails");
            if(albumDetailsObj instanceof JSONArray) {
                JSONArray albumDetailsArray = dataObject.getJSONArray("albumDetails");
                ArrayList<Album> photoGalleryFiles = new ArrayList<>();
                ArrayList<Album> videoGalleryFiles = new ArrayList<>();

                for (int j = 0; j < albumDetailsArray.length(); j++) {
                    JSONObject albumDetailsObject = albumDetailsArray.getJSONObject(j);
                    Album album = new Album();
                    String fileType = albumDetailsObject.getString("file_type");
                    String mimeType = albumDetailsObject.getString("mimetype");
                    String fileName = albumDetailsObject.getString("file_name");
                    String file_url = "";
                    if (fileType.equals("video")) {
                        file_url = VIDEO_BASE_URL + albumDetailsObject.getString("file_url");
                        Log.v("video","url "+file_url);
                    }
                    else if (fileType.equals("image"))
                        file_url = AWS_BASE_URL + schoolId + "/" + albumDetailsObject.getString("file_url");

                    album.setFileFormat(fileType);
                    album.setMimeType(mimeType);
                    album.setFileName(fileName);
                    album.setFileUrl(file_url);

                    if (fileType.equals("video"))
                        videoGalleryFiles.add(album);
                    else if (fileType.equals("image"))
                        photoGalleryFiles.add(album);

                }

                if (photoGalleryFiles.size() != 0) {
                    photoAlbumDetails.setAlbums(photoGalleryFiles);
                    photosList.add(photoAlbumDetails);
                }
                if (videoGalleryFiles.size() != 0) {
                    videoAlbumDetails.setAlbums(videoGalleryFiles);
                    videosList.add(videoAlbumDetails);
                }
            }
        }
    }

    private void renderTab() {
        try {
            CoordinatorLayout coordinatorLayout = (CoordinatorLayout)findViewById(R.id.photos_videos);
            coordinatorLayout.setVisibility(View.VISIBLE);
            ViewPager viewPager = (ViewPager) findViewById(R.id.pager);
            setUpViewPager(viewPager);

            TabLayout tabLayout = (TabLayout) findViewById(R.id.tablayout);
            tabLayout.setupWithViewPager(viewPager);

            String[] titles = {(String) getResources().getText(R.string.photos), (String) getResources().getText(R.string.videos)};
            for (int i = 0; i < titles.length; i++)
                tabLayout.getTabAt(i).setText(titles[i]);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void setUpViewPager(ViewPager viewPager) {
        if(photosList == null)
            photosList = new ArrayList<>();
        if(videosList == null)
            videosList = new ArrayList<>();

        PhotoFragment photoFragment = new PhotoFragment();
        Bundle photos = new Bundle();
        photos.putSerializable("Photos", photosList);
        photoFragment.setArguments(photos);

        VideoFragment videoFragment = new VideoFragment();
        Bundle videos = new Bundle();
        videos.putSerializable("Videos", videosList);
        videoFragment.setArguments(videos);

        ClassTabbedFragmentAdapter fragmentAdapter = new ClassTabbedFragmentAdapter(getSupportFragmentManager());
        fragmentAdapter.addFragment(photoFragment, "Photos");
        fragmentAdapter.addFragment(videoFragment, "Videos");
        viewPager.setAdapter(fragmentAdapter);
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

    @Override
    public void onResume() {
        super.onResume();
    }
}
