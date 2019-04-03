package nexrise.publication.in.nexrise.Gallery;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.GridView;
import android.widget.LinearLayout;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.Gallery.CustomGallery.Activities.AlbumSelectActivity;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.BeanClass.Image;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Util.Constants;
import nexrise.publication.in.nexrise.R;

public class SelectedImagesActivity extends AppCompatActivity implements nexrise.publication.in.nexrise.Constants{

    static ArrayList<Image> filteredImages = new ArrayList<>();
    SelectedImagesArrayAdapter arrayAdapter;
    GridView gridView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_selected_images);
        String[] selectedimage = getIntent().getStringArrayExtra("SelectedImages");
        filteredImages =  getIntent().getParcelableArrayListExtra(Constants.INTENT_EXTRA_IMAGES);
        Log.v("Verification ",""+filteredImages);

        // The above string[] selectedImages will contain null values, in order to filter the null values the below iteration is done.
        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setTitle(R.string.selected_image);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        arrayAdapter = new SelectedImagesArrayAdapter(this, R.layout.activity_selected_images_layout, filteredImages);
        gridView = (GridView)findViewById(R.id.selected_image_grid);
        gridView.setAdapter(arrayAdapter);

        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, final int position, long id) {
                /*ImageView closeButton = (ImageView)view.findViewById(R.id.imageView24);
                closeButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Image removedImage = filteredImages.remove(position);
                    //    arrayAdapter.remove(removedImage);
                        arrayAdapter.notifyDataSetChanged();
                    }
                });*/
            }
        });
        buttonClick();
        orientationBasedUI(getResources().getConfiguration().orientation);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        orientationBasedUI(newConfig.orientation);
    }

    public void orientationBasedUI(int orientation) {
        WindowManager windowManager = (WindowManager) getApplicationContext().getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics metrics = new DisplayMetrics();
        windowManager.getDefaultDisplay().getMetrics(metrics);

        if(arrayAdapter!= null) {
            int size = orientation == Configuration.ORIENTATION_PORTRAIT ? metrics.widthPixels / 2 : metrics.widthPixels / 4;
            arrayAdapter.setLayoutParms(size);
        }
        gridView.setNumColumns(orientation == Configuration.ORIENTATION_PORTRAIT ? 2 : 4);
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if(requestCode == 15 && resultCode == RESULT_OK) {
            ArrayList<Image> selectedImages = data.getParcelableArrayListExtra("SelectedImages");

           for(int i=0;i<selectedImages.size();i++){
               filteredImages.add(selectedImages.get(i));
            }
            arrayAdapter.notifyDataSetChanged();
        } else if(requestCode == 100 && resultCode == RESULT_OK && data != null) {
            List<Image> images = new ArrayList<Image>();
            images = data.getParcelableArrayListExtra(Constants.INTENT_EXTRA_IMAGES);
            filteredImages.addAll(images);
            arrayAdapter.notifyDataSetChanged();
        }
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
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


    public void buttonClick(){
        LinearLayout addEditPhotos = (LinearLayout)findViewById(R.id.add_edit_photos);
        addEditPhotos.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(SelectedImagesActivity.this,AlbumSelectActivity.class);
                intent.putExtra("From","SelectedImagesActivity");
                startActivityForResult(intent,100);
            }
        });

       Button save = (Button)findViewById(R.id.save);
       save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent createAlbumCallback = new Intent();
                createAlbumCallback.putParcelableArrayListExtra(Constants.INTENT_EXTRA_IMAGES, filteredImages);

               /* List<File> files = new ArrayList<File>();
                for (int i=0; i<filteredImages.size(); i++) {
                    File file = new File(filteredImages.get(i).path);
                    files.add(file);
                    try {
                        File path = new File("/storage/sdcard0/Pictures/MEMES/");
                        File created = File.createTempFile("nsa",".jpg", path);

                        FileReader fileReader = new FileReader(file);
                        FileWriter writer = new FileWriter(created);
                        int read = fileReader.read();
                        while(read != -1) {
                            writer.write((char)read);
                            read = fileReader.read();
                        }

                        Log.v("TEMP ",created.getAbsolutePath());
                        Log.v("FILE Path",filteredImages.get(i).path);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }*/
                setResult(RESULT_OK, createAlbumCallback);
                finish();
                /*
                String url = BASE_URL + API_VERSION_ONE + TIMETABLE + "attachments";
                FileUploadUrlConnection fileUpload = new FileUploadUrlConnection(SelectedImagesActivity.this, url, files) {
                    ProgressDialog progressDialog = new ProgressDialog(SelectedImagesActivity.this, ProgressDialog.STYLE_SPINNER);

                    @Override
                    protected void onPreExecute() {
                        super.onPreExecute();
                        progressDialog.setMessage("Uploading photos");
                        progressDialog.show();
                    }

                    @Override
                    protected void onPostExecute(String response) {
                        super.onPostExecute(response);
                        progressDialog.dismiss();
                        Log.v("FILE ","UPLOAD "+response);
                    }
                };
                fileUpload.execute();*/
            }
        });
    }
}
