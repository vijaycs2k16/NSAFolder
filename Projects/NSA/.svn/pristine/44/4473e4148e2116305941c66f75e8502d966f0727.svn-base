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
import android.util.Log;
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
import android.widget.VideoView;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

import nexrise.publication.in.nexrise.Gallery.CustomGallery.Activities.VideoAlbumSelectActivity;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.BeanClass.Image;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Util.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.DueDateActivity;

import static nexrise.publication.in.nexrise.R.array.albums;

public class CreateVideoActivity extends AppCompatActivity {

    String dueDates = "";
    TextView textView;
    ArrayList<Image> videos;
    String albumNameString;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_video);

        LinearLayout linearLayout = (LinearLayout) findViewById(R.id.uploadclick);
        LinearLayout linearLayout1= (LinearLayout) findViewById(R.id.sharewithclick);
        LinearLayout linearLayout2 = (LinearLayout)findViewById(R.id.dateclick);
        Spinner spinner=(Spinner)findViewById(R.id.albumspin);
        textView = (TextView)findViewById(R.id.publishdatedatetext);
        ArrayAdapter<String> spinnerCategoryArrayAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(albums));
        spinner.setAdapter(spinnerCategoryArrayAdapter);

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dueDates = dateFormat.format(calendar.getTime());
        textView.setText(dueDates);
        linearLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CreateVideoActivity.this, VideoAlbumSelectActivity.class);
                intent.putExtra(Constants.INTENT_EXTRA_ALBUM, albums);
                startActivityForResult(intent, Constants.REQUEST_CODE);
            }
        });
        linearLayout1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CreateVideoActivity.this, ShareWithActivity.class);
                startActivity(intent);
            }
        });
        linearLayout2.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(CreateVideoActivity.this, DueDateActivity.class);
                intent.putExtra("Activity", "CreateAlbumActivity");
                startActivityForResult(intent, 2);


            }

        });



        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle("Upload Video");
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 2 ) {
            if (data.getIntExtra("Date", 0) != 0) {
                dueDates = data.getIntExtra("Date", 0) + "/" + data.getIntExtra("Month", 0) + "/" + data.getIntExtra("Year", 0);
                textView.setText(dueDates);
            }
            Log.v("On activity ", "result Due date " + data.getIntExtra("Date", 0));
            Log.v("On activity ", "result Due month " + data.getIntExtra("Month", 0));
            Log.v("On activity ", "result Due year " + data.getIntExtra("Year", 0));

        } else if(requestCode == Constants.REQUEST_CODE && resultCode == RESULT_OK) {
            videos= data.getParcelableArrayListExtra(Constants.INTENT_EXTRA_IMAGES);
            int imagesSize = videos.size();
            TextView textView = (TextView)findViewById(R.id.create_video);
            textView.setText(String.valueOf(imagesSize));
            VideoView videoView = (VideoView)findViewById(R.id.video);
            videoView.setVideoPath(videos.get(0).path);
            videoView.start();
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
                EditText albumName = (EditText)findViewById(R.id.video_album_name);
                albumNameString = String.valueOf(albumName.getText());
                if(albumNameString!= null && !albumNameString.isEmpty()) {
                    new CreateVideoAlbum(this).execute();

                   /* Intent intent = new Intent();
                    intent.putExtra("AlbumName", albumNameString);
                    setResult(RESULT_OK, intent);
                    finish();*/
                } else {
                    Toast toast = Toast.makeText(CreateVideoActivity.this, "Enter album name", Toast.LENGTH_LONG);
                    toast.setGravity(Gravity.CENTER_VERTICAL, 0, 120);
                    toast.show();
                }
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private class CreateVideoAlbum extends AsyncTask<String, Boolean, String> {
        ProgressDialog dialog;
        Activity context;

        CreateVideoAlbum(Activity context) {
            this.context = context;
        }

        @Override
        protected void onPreExecute() {
            dialog = new ProgressDialog(CreateVideoActivity.this);
            dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
            dialog.setMessage("Creating video album");
            dialog.setCanceledOnTouchOutside(false);
            dialog.show();
        }

        @Override
        protected String doInBackground(String... params) {
            File folder = new File(Environment.getExternalStoragePublicDirectory("NexSchoolApp"), "Videos");
            boolean folderCreated = folder.mkdirs();
            File createAlbum = new File(folder, albumNameString);
            createAlbum.mkdir();

            for (int i=0; i<videos.size(); i++) {
                File createImage = new File(createAlbum, videos.get(i).name);
                File sourceImage = new File(videos.get(i).path);
                try {
                    boolean created = createImage.createNewFile();
                    copyToFile(sourceImage, createImage);
                    addToGallery(videos.get(i).name, createImage.toString());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return null;
        }

        @Override
        protected void onPostExecute(String s) {
            dialog.dismiss();
            Intent intent = new Intent();
            intent.putExtra("AlbumName", albumNameString);
            context.setResult(RESULT_OK, intent);
            context.finish();
        }
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
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void addToGallery(String title, String filePath) {
        ContentValues values = new ContentValues();
        values.put(MediaStore.Video.Media.TITLE, title);
        values.put(MediaStore.Video.Media.DATE_ADDED, System.currentTimeMillis());
        values.put(MediaStore.Video.Media.DATA, filePath);
        getApplicationContext().getContentResolver().insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, values);
    }
}
