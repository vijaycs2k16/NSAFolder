package nexrise.publication.in.nexrise.Gallery;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.ContentValues;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

import nexrise.publication.in.nexrise.Gallery.CustomGallery.Activities.AlbumSelectActivity;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.BeanClass.Image;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Util.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.DueDateActivity;

public class CreateAlbumActivity extends AppCompatActivity {

    String dueDates = "";
    TextView textView;
    ArrayList<Image> images;
    ArrayList<String> photonumber;
    String albumNameString;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_album);

        LinearLayout uploadPhoto = (LinearLayout) findViewById(R.id.uploadclick);
        LinearLayout shareWith= (LinearLayout) findViewById(R.id.sharewithclick);
        LinearLayout publishingDate = (LinearLayout)findViewById(R.id.dateclick);
        Spinner spinner=(Spinner)findViewById(R.id.albumspin);
        textView = (TextView)findViewById(R.id.publishdatedatetext);
        ArrayAdapter<String> spinnerCategoryArrayAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.albums));
        spinner.setAdapter(spinnerCategoryArrayAdapter);

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dueDates = dateFormat.format(calendar.getTime());
        textView.setText(dueDates);

        uploadPhoto.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CreateAlbumActivity.this, AlbumSelectActivity.class);
                intent.putExtra(Constants.INTENT_EXTRA_LIMIT, 10);
                intent.putExtra("From","CreateAlbumActivity");
                startActivityForResult(intent, Constants.REQUEST_CODE);

            }
        });
        shareWith.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CreateAlbumActivity.this, ShareWithActivity.class);
                startActivity(intent);
            }
        });
        publishingDate.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(CreateAlbumActivity.this, DueDateActivity.class);
                intent.putExtra("Activity", "CreateAlbumActivity");
                startActivityForResult(intent, 2);
            }

        });

        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle("Create Album");
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        //startActivityForResult(dueTimeActivity, 3);
        if (requestCode == 2) {
            if (data.getIntExtra("Date", 0) != 0) {
                dueDates = data.getIntExtra("Date", 0) + "/" + data.getIntExtra("Month", 0) + "/" + data.getIntExtra("Year", 0);
                textView.setText(dueDates);
            }

        } else if (requestCode == 10 && resultCode == RESULT_OK) {
            String[] selectedImages = data.getStringArrayExtra("SelectedImages");

            Intent verifySelectedImage = new Intent(this, SelectedImagesActivity.class);
            verifySelectedImage.putExtra("SelectedImages", selectedImages);
            startActivityForResult(verifySelectedImage, 11);

        } else if (requestCode == 11 && resultCode == RESULT_OK) {
            TextView photosCountTextview = (TextView) findViewById(R.id.photos_count);
            photosCountTextview.setText(String.valueOf(data.getShortArrayExtra("Photoset")));

        } else if (requestCode == Constants.REQUEST_CODE && resultCode == RESULT_OK && data != null) {

            images = data.getParcelableArrayListExtra(Constants.INTENT_EXTRA_IMAGES);

            TextView photosCountTextview = (TextView) findViewById(R.id.photos_count);
            photosCountTextview.setText(String.valueOf(images.size()));
        }
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.add_homework_actionbar, menu);
        return true;
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                finish();
                break;
            case R.id.tick:
                EditText albumName = (EditText)findViewById(R.id.album_name);
                albumNameString = String.valueOf(albumName.getText());

                if(images != null) {
                    if (albumNameString != null && !albumNameString.isEmpty()) {
                        new CreatePhotoAlbum(this).execute();

                    } else {
                        Toast toast = Toast.makeText(CreateAlbumActivity.this, "Enter album name", Toast.LENGTH_LONG);
                        toast.setGravity(Gravity.CENTER_VERTICAL, 0, 120);
                        toast.show();
                    }
                } else {
                    Toast toast = Toast.makeText(CreateAlbumActivity.this, "Select photos to upload", Toast.LENGTH_LONG);
                    toast.setGravity(Gravity.CENTER_VERTICAL, 0, 120);
                    toast.show();
                }

                break;
        }
        return super.onOptionsItemSelected(item);
    }

    public void copyToFile(File source, File destination) {
        try {
            FileChannel sourceStream = new FileInputStream(source).getChannel();
            FileChannel destinationStream = new FileOutputStream(destination).getChannel();
            destinationStream.transferFrom(sourceStream, 0, sourceStream.size());
            if (sourceStream != null) {
                sourceStream.close();
            }
            if(destinationStream != null) {
                destinationStream.close();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void addToGallery(String title, String filePath) {
        ContentValues values = new ContentValues();
        values.put(MediaStore.Images.Media.TITLE, title);
        values.put(MediaStore.Images.Media.DATE_ADDED, System.currentTimeMillis());
        values.put(MediaStore.Images.Media.DATA, filePath);
        getApplicationContext().getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
    }

    private class CreatePhotoAlbum extends AsyncTask<String, String, String> {
        ProgressDialog loading;
        Activity context;

        CreatePhotoAlbum(Activity context) {
            this.context = context;
        }
        @Override
        protected void onPreExecute() {
            loading = new ProgressDialog(CreateAlbumActivity.this);
            loading.setMessage("Creating photo album");
            loading.setProgressStyle(ProgressDialog.STYLE_SPINNER);
            loading.setCanceledOnTouchOutside(false);
            loading.show();
        }

        @Override
        protected String doInBackground(String... params) {
            File folder = new File(Environment.getExternalStoragePublicDirectory("NexSchoolApp"), "Images");
            boolean folderCreated = folder.mkdirs();
            File createAlbum = new File(folder, albumNameString);
            createAlbum.mkdir();

            for (int i=0; i<images.size(); i++) {
                File createImage = new File(createAlbum, images.get(i).name);
                File sourceImage = new File(images.get(i).path);
                copyToFile(sourceImage, createImage);
                addToGallery(images.get(i).name, createImage.toString());
            }
/*
            LruCache<String, Bitmap> lru = new LruCache<String, Bitmap>(1024*1024);
            Bitmap bitmap = BitmapFactory.decodeFile(images.get(0).path);
            lru.put("Image",bitmap);*/

            return null;
        }

        @Override
        protected void onPostExecute(String s) {
            loading.dismiss();
            Intent intent = new Intent();
            intent.putExtra("AlbumName",albumNameString);
            context.setResult(RESULT_OK, intent);
            context.finish();
        }
    }
}
