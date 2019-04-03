package nexrise.publication.in.nexrise.Gallery;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Album;
import nexrise.publication.in.nexrise.BeanClass.AlbumDetails;
import nexrise.publication.in.nexrise.BeanClass.ImageDetails;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.BeanClass.Image;
import nexrise.publication.in.nexrise.R;

public class ImagesActivity extends AppCompatActivity implements Constants {
    ArrayList<ImageDetails> imageDetailsList;
    ArrayList<Image> images;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_images);
        Intent intent = getIntent();
        imageDetailsList = new ArrayList<>();
        String title = intent.getStringExtra(ACTIONBAR_TITLE);
        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle(title);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
        renderData(intent);
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
    private void renderData(Intent intent) {
        AlbumDetails albumDetails = (AlbumDetails) intent.getSerializableExtra("Album");
        if(imageDetailsList == null)
            imageDetailsList = new ArrayList<>();

        for (int i=0; i<albumDetails.getAlbums().size(); i++) {
            ImageDetails imageDetails = new ImageDetails();
            Album album = albumDetails.getAlbums().get(i);

            imageDetails.setFileName(album.getFileName());
            imageDetails.setFile_type(album.getFileFormat());
            imageDetails.setFile_url(album.getFileUrl());
            imageDetails.setAlbum_id(albumDetails.getAlbum_id());
            imageDetailsList.add(imageDetails);
        }
        GalleryGridAdapter gridAdapter = new GalleryGridAdapter(ImagesActivity.this,R.layout.fragment_videos_grid_layout, imageDetailsList);
        GridView gridView = (GridView) findViewById(R.id.video_gridview);
        gridView.setAdapter(gridAdapter);
        gridviewClick(gridView);
    }

    /*private void renderData(Intent intent) {
        String albumId = intent.getStringExtra("AlbumId");
        String galleryUrl = BASE_URL + API_VERSION_ONE + GALLERY + DETAILS + albumId ;
        GETUrlConnection galleryCredential = new GETUrlConnection(ImagesActivity.this,galleryUrl,null){
            RelativeLayout progressBarLayout = (RelativeLayout)findViewById(R.id.loading_bar_container);
            ProgressBar progressBar = (ProgressBar)findViewById(R.id.loading_bar);
            TextView noContent = (TextView)findViewById(R.id.no_content);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Gallery","Response"+response);
                progressBarLayout.setVisibility(GONE);
                progressBar.setVisibility(GONE);
                try {
                    new StringUtils().checkSession(response);
                    imageDetailsList = imageServer(response);
                    GridView gridView = (GridView) findViewById(R.id.video_gridview);
                    ViewImageGridAdapter gridAdapter = new ViewImageGridAdapter(ImagesActivity.this,R.layout.fragment_videos_grid_layout, imageDetailsList);
                    gridView.setAdapter(gridAdapter);
                    gridviewClick(gridView);
                } catch (JSONException | NullPointerException e) {
                    if(progressBarLayout.getVisibility() == GONE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(ImagesActivity.this);
                }
            }
        };
        galleryCredential.execute();
    }*/

    public ArrayList<ImageDetails> imageServer(String response) throws JSONException , NullPointerException{
        ArrayList<ImageDetails> albumList = new ArrayList<>();

        JSONObject mainObject = new JSONObject(response);
        JSONArray dataArray = mainObject.getJSONArray(DATA);
        if(dataArray.length() == 0)
            throw new JSONException("Empty Json");

        for (int i=0;i<dataArray.length();i++) {
            ImageDetails albumDetails = new ImageDetails();

            JSONObject dataObject = dataArray.getJSONObject(i);
            String file_type = dataObject.getString("file_type");
            String file_url = dataObject.getString("file_url");
            albumDetails.setFile_type(file_type);
            albumDetails.setFile_url(file_url);
            String[] fileName = file_url.split("/");
            albumDetails.setFileName(fileName[fileName.length-1]);
            albumList.add(albumDetails);
        }

        return albumList;
    }

    public void gridviewClick(final GridView gridView) {
        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                ImageDetails imageDetails = (ImageDetails) gridView.getItemAtPosition(position);
                String albumId = imageDetails.getAlbum_id();
                Log.v("Album","Id"+albumId);
                Intent intent = new Intent();
                if(imageDetails.getFile_type().equalsIgnoreCase("image")) {
                    intent = new Intent(ImagesActivity.this, FullImageActivity.class);
                    intent.putExtra("ImagePosition", position);
                    intent.putExtra("Images", imageDetailsList);
                    intent.putParcelableArrayListExtra(nexrise.publication.in.nexrise.Gallery.CustomGallery.Util.Constants.INTENT_EXTRA_IMAGES, images);
                } else {
                    intent = new Intent(Intent.ACTION_VIEW);
                    intent.setData(Uri.parse(imageDetails.getFile_url()));
                }
                startActivity(intent);
            }
        });
    }
    @Override
    public void onResume() {
        super.onResume();
    }

}
