package nexrise.publication.in.nexrise.Gallery;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.Environment;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;

import dev.dworks.libs.astickyheader.SimpleSectionedGridAdapter;
import dev.dworks.libs.astickyheader.ui.PinnedSectionGridView;
import dev.dworks.libs.astickyheader.ui.SquareImageView;
import nexrise.publication.in.nexrise.R;

public class GalleryActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.gallery);

        String[] headers = {"Today","Yesterday", "Last week","March"};
        Integer[] positions = {0, 5, 10, 15};

        ArrayList<SimpleSectionedGridAdapter.Section> section = new ArrayList<>();
        GalleryImageAdapter imageAdapter = new GalleryImageAdapter(this);
        final PinnedSectionGridView gridView = (PinnedSectionGridView)findViewById(R.id.grid);
        for (int i=0; i<positions.length; i++){
            section.add(new SimpleSectionedGridAdapter.Section(positions[i], headers[i]));
        }
        final SimpleSectionedGridAdapter gridAdapter = new SimpleSectionedGridAdapter(this, imageAdapter, R.layout.gallery_header
                        , R.id.header_layout, R.id.header);
        gridAdapter.setGridView(gridView);
        gridAdapter.setSections(section.toArray(new SimpleSectionedGridAdapter.Section[]{}));
        gridView.setAdapter(gridAdapter);

        File file = new File(Environment.getExternalStorageDirectory(), "test.jpg");
        try {
            file.createNewFile();
            Log.v("directory "," "+Environment.getExternalStorageDirectory());
            Bitmap bitmap = ((BitmapDrawable)getResources().getDrawable(R.drawable.pic1)).getBitmap();
            FileOutputStream outputStream = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
            outputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                SquareImageView imageView = (SquareImageView)view.findViewById(R.id.image);
                Bitmap bitmap = ((BitmapDrawable)imageView.getDrawable()).getBitmap();
                ByteArrayOutputStream stream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, stream);
                byte[] byteArray = stream.toByteArray();
                Log.v("Byte ary ","length "+byteArray.length);
                setfullimageActivity();


            }
        });

        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle("Photos and Videos");
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
    }
    public void setfullimageActivity(){
        ArrayList<Integer> images = new ArrayList<Integer>();
        images.add(R.drawable.pic1);
        images.add(R.drawable.pic2);
        images.add(R.drawable.pic3);
        images.add(R.drawable.pic4);
        images.add(R.drawable.pic1);
        images.add(R.drawable.pic2);
        Intent intent = new Intent(getApplicationContext(),FullImageActivity.class);
        intent.putIntegerArrayListExtra(FullImageActivity.INTENT_EXTRA_IMAGES,images);
        startActivity(intent);
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
}
