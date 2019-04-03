package nexrise.publication.in.nexrise.ReusedActivities;

import android.Manifest;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.StrictMode;
import android.preference.PreferenceManager;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.DecelerateInterpolator;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.message.BasicHeader;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Activities.AlbumSelectActivity;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.BeanClass.Image;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Util.Constants;
import nexrise.publication.in.nexrise.Gallery.SelectedImagesArrayAdapter;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.TeacherTodayTimeTable;
import nexrise.publication.in.nexrise.URLConnection.FileUploadUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class AttachmentActivity extends AppCompatActivity implements nexrise.publication.in.nexrise.Constants{

    private final int CAMERA = 1;
    private final int GALLERY = 2;
    private final int DOCS = 3;
    private int ACCESS_CAMERA = 4;
    GridView imagesGrid;
    RelativeLayout progressBarLayout;
    TextView noContent;
    SelectedImagesArrayAdapter arrayAdapter = null;
    ArrayList<Image> selectedImages = new ArrayList<>();
    HashMap<String, String> uploadedImages = new HashMap<>();
    JSONArray attachmentsAry = new JSONArray();
    Spinner uploadingOptions;
    String status = null;
    String url;
    File out;
    Intent intent;
    int uploadedImagesCount = 0;
    String schoolId;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(nexrise.publication.in.nexrise.R.layout.activity_attachment);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        schoolId = preferences.getString(SCHOOL_ID, null);

        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setTitle(R.string.attachments);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        imagesGrid = (GridView)findViewById(R.id.to_upload);
        progressBarLayout = (RelativeLayout)findViewById(R.id.progress_bar);
        noContent = (TextView)findViewById(R.id.no_content);
        progressBarLayout.setVisibility(View.VISIBLE);
        noContent.setVisibility(View.VISIBLE);
        intent = getIntent();

        if(intent.hasExtra(URL))
            url = intent.getStringExtra(URL);
        else
            url = BASE_URL + API_VERSION_ONE + TIMETABLE + NOTES;

        /* when you open this activity an arrayadapter has to be set in the gridview then only we can update it in the onActivityResult
         if this activity is launched newly then a dummy adapter will be set */
        if(selectedImages != null) {
            arrayAdapter = new SelectedImagesArrayAdapter(this, R.layout.activity_selected_images_layout, selectedImages);
            orientationBasedUI(getResources().getConfiguration().orientation);
            imagesGrid.setAdapter(arrayAdapter);
        } else {
            Image image = new Image(generateRandNumber(), "", "", false);
            selectedImages.add(image);
            arrayAdapter = new SelectedImagesArrayAdapter(this, R.layout.activity_selected_images_layout, selectedImages);
            orientationBasedUI(getResources().getConfiguration().orientation);
            imagesGrid.setAdapter(arrayAdapter);
        }

        orientationBasedUI(getResources().getConfiguration().orientation);
        spinnerClickListener();
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
                if(status == null || status.equalsIgnoreCase("Upload failed")) {
                    setResult(RESULT_CANCELED);
                    finish();
                } else if(status.equalsIgnoreCase("Uploading"))
                    Toast.makeText(this, "Uploading attachments, please wait", Toast.LENGTH_SHORT).show();
                break;

            case R.id.tick:

                if(status == null || status.equalsIgnoreCase("Upload failed")) {
                    Log.v("Selected ","Images "+selectedImages.size());
                    Log.v("Selected ","uploadedImagesCount "+uploadedImagesCount);
                    for(int i=0; i<selectedImages.size(); i++)
                        uploadImagesSeperately(selectedImages.get(i), i);

                } else if(status.equalsIgnoreCase("Uploading"))
                    Toast.makeText(this, R.string.uploading_attach_wait, Toast.LENGTH_SHORT).show();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        if(status == null || status.equalsIgnoreCase("Upload failed"))
            super.onBackPressed();
        else if(status.equalsIgnoreCase("Uploading"))
            Toast.makeText(this, R.string.uploading_attach_wait, Toast.LENGTH_SHORT).show();
    }

    public void uploadImagesSeperately(Image toUpload, final int index) {
        status = "Uploading";

        final JSONArray attachmentsArray = new JSONArray();
        File file = new File(toUpload.path);
        Log.v("Media ","id "+toUpload.id);
        /*Uri uri = Uri.parse(MediaStore.Images.Media.EXTERNAL_CONTENT_URI + "/"+ toUpload.id);
        File finalFile = new File(getRealPathForImages(uri));*/
        attachmentsArray.put(file.getName());
        Log.v("File "," "+file.getAbsolutePath());
        ArrayList<Map.Entry<String, String>> jsonBody = new ArrayList<>();
        BasicHeader[] headers = null;
        if (intent.hasExtra(JSON)) {
            HashMap<String, String> json = (HashMap<String, String>) intent.getSerializableExtra(JSON);
            jsonBody = new ArrayList<>(json.entrySet());
        }
        if (intent.hasExtra(ID) && intent.hasExtra(UPLOAD_ID)) {
            String id = intent.getStringExtra(ID);
            String uploadId = intent.getStringExtra(UPLOAD_ID);
            headers = StringUtils.getInstance().fileUploadHeader(AttachmentActivity.this, id, uploadId);
        }

        FileUploadUrlConnection fileUpload = new FileUploadUrlConnection(this, url, headers, file, jsonBody) {
            ProgressBar progressBar;
            ObjectAnimator animator;
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                try {
                    RelativeLayout retryLayout = (RelativeLayout) imagesGrid.getChildAt(index).findViewById(R.id.retry_layout);
                    ImageView closebutton = (ImageView) imagesGrid.getChildAt(index).findViewById(R.id.imageView24);

                    if (closebutton != null && closebutton.getVisibility() == View.VISIBLE)
                        closebutton.setVisibility(View.GONE);
                    if (retryLayout.getVisibility() == View.VISIBLE)
                        retryLayout.setVisibility(View.GONE);
                    progressBar = (ProgressBar) imagesGrid.getChildAt(index).findViewById(R.id.upload_download);
                    progressBar.setVisibility(View.VISIBLE);
                    animator = ObjectAnimator.ofInt(progressBar, "progress", 100);
                    animator.setDuration(30000);
                    animator.setInterpolator(new DecelerateInterpolator());
                    animator.start();
                } catch (NullPointerException e) {
                    e.printStackTrace();
                }
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Upload ", "response " + response);


                try {
                    progressBar.setProgress(100);
                    animator.cancel();
                    progressBar.setVisibility(View.INVISIBLE);
                    new StringUtils().checkSession(response);
                    JSONObject jsonObject = new JSONObject(response);
                    boolean success = jsonObject.getBoolean(SUCCESS);
                    if (success) {
                        ++uploadedImagesCount;
                        Log.v("Attachment "," "+attachmentsAry);
                        getUploadedFiles(jsonObject);
                        if (uploadedImagesCount == selectedImages.size()) {
                            Toast.makeText(AttachmentActivity.this, R.string.upload_complete, Toast.LENGTH_SHORT).show();
                            TeacherTodayTimeTable.rendered = false;
                            Log.v("Attachment ","before callback "+attachmentsAry);
                            Intent callback = new Intent();
                            callback.putExtra(UPLOADED_IMAGES, uploadedImages);
                            callback.putExtra("attachmentAry", attachmentsAry.toString());
                            setResult(RESULT_OK, callback);
                            finish();
                        }
                    } else {
                        status = "Upload failed";
                        throw new JSONException("Upload failed");
                    }

                } catch (NullPointerException | JSONException e) {
                    status = "Upload failed";
                    if(imagesGrid.getChildAt(index) != null) {
                        RelativeLayout retryLayout = (RelativeLayout) imagesGrid.getChildAt(index).findViewById(R.id.retry_layout);
                        retryLayout.setVisibility(View.VISIBLE);
                        ImageView closebutton = (ImageView)imagesGrid.getChildAt(index).findViewById(R.id.imageView24);

                        if(closebutton != null)
                            closebutton.setVisibility(View.VISIBLE);
                    }
                } catch (SessionExpiredException e) {
                    e.handleException(AttachmentActivity.this);
                }
            }
        };
        fileUpload.execute();
    }

    public void getUploadedFiles(JSONObject jsonObject) throws JSONException, NullPointerException {
        if(jsonObject.has("files")) {
            JSONArray files = jsonObject.getJSONArray("files");
            for(int i=0; i<files.length(); i++) {
                JSONObject attachment = new JSONObject();
                JSONObject fileObj = files.getJSONObject(i);
                String fileUrl = fileObj.getString("key");
                String fileName = fileObj.getString("fieldname");

                uploadedImages.put(fileUrl, fileName);
                attachment.put("id", fileUrl);
                attachment.put("name", fileName);
                attachmentsAry.put(attachment);
            }
        }
    }

    public void spinnerClickListener() {

        uploadingOptions = (Spinner)findViewById(R.id.upload_options);
        int[] icons = {0, R.drawable.ic_photo_camera, R.drawable.ic_photo_gallery};
        String[] values = {(String) getResources().getText(R.string.none),(String) getResources().getText(R.string.camera), (String) getResources().getText(R.string.gallery)};

        final AddFilesSpinnerAdapter spinnerAdapter = new AddFilesSpinnerAdapter(this, icons, values);
        uploadingOptions.setAdapter(spinnerAdapter);

        uploadingOptions.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selected = (String) uploadingOptions.getItemAtPosition(position);

                if(selected.equalsIgnoreCase("Camera")) {
                    StrictMode.enableDefaults();
                    if(Build.VERSION.SDK_INT >=  Build.VERSION_CODES.M) {

                        if(ContextCompat.checkSelfPermission(AttachmentActivity.this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                            ActivityCompat.requestPermissions(AttachmentActivity.this, new String[]{Manifest.permission.CAMERA}, ACCESS_CAMERA);
                        } else {
                            openCamera();
                        }
                    } else {
                        openCamera();
                    }

                } else if(selected.equalsIgnoreCase("Gallery")) {
                    Intent selectImages = new Intent(AttachmentActivity.this, AlbumSelectActivity.class);
                    selectImages.putExtra("From", "AttachmentActivity");
                    selectImages.putExtra("AttachmentActivity", true);
                    startActivityForResult(selectImages, GALLERY);

                } else if(selected.equalsIgnoreCase("Docs")) {
                    /*Intent intent;
                    if(Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
                        intent = new Intent(Intent.ACTION_GET_CONTENT);
                        intent.setType("file*//*");
                    } else {
                        intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                        MimeTypeMap mimeType = MimeTypeMap.getSingleton();
                        String pdf = mimeType.getExtensionFromMimeType("pdf");
                        String txt = mimeType.getExtensionFromMimeType("txt");
                        String docx = mimeType.getExtensionFromMimeType("docx");
                        String[] mimeTypes = {pdf, txt, docx};
                        intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
                    }
                    startActivityForResult(intent, DOCS);*/
                    Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                    intent.setType("application/msword,application/pdf");
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    // Only the system receives the ACTION_OPEN_DOCUMENT, so no need to test.
                    startActivityForResult(intent, DOCS);
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                uploadingOptions.setSelection(0);
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(requestCode == ACCESS_CAMERA && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            openCamera();
        }
    }

    public void openCamera() {
        Intent openCamera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

        out = Environment.getExternalStorageDirectory();
        out = new File(out,"Captured Image");
        openCamera.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(out));
        startActivityForResult(openCamera, CAMERA);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        uploadingOptions.setSelection(0);
        switch (requestCode){
            case GALLERY:
                if(resultCode == RESULT_OK) {
                    progressbarLayoutVisibility();
                    ArrayList<Image> resultantImages = data.getParcelableArrayListExtra(Constants.INTENT_EXTRA_IMAGES);
                    selectedImages.addAll(resultantImages);
                    Log.v("AttachMent ","activiTy "+selectedImages.size());
                    arrayAdapter.notifyDataSetChanged();
                    orientationBasedUI(getResources().getConfiguration().orientation);
                }
                break;
            case CAMERA:
                if(resultCode == RESULT_OK) {
                    progressbarLayoutVisibility();
                    try {
                        /*(Bitmap) data.getExtras().get("data")*/
                        Bitmap capturedImage = MediaStore.Images.Media.getBitmap(
                                getContentResolver(), Uri.fromFile(out));
                        Uri tempUri = getCapturedImageUri(this, capturedImage);
                        File finalFile = new File(getRealPathForImages(tempUri));
                        Log.v("SELECTED ","image path "+finalFile.getPath());

                        Image image = new Image(generateRandNumber(), finalFile.getName(), finalFile.getPath(), true);
                        selectedImages.add(image);
                        arrayAdapter.notifyDataSetChanged();
                        orientationBasedUI(getResources().getConfiguration().orientation);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }




                }
                break;
            case DOCS:
                if(resultCode == RESULT_OK) {
                    File finalFile;
                    progressbarLayoutVisibility();
                    Uri fileuri = data.getData();
                    String docFilePath = getRealPathForDocs(this, fileuri);
                    if(docFilePath != null) {

                        finalFile = new File(docFilePath);
                    } else {
                        finalFile = new File(fileuri.getEncodedPath());
                    }

                    Log.v("Doc","File"+docFilePath);
                    Image image = new Image(generateRandNumber(), finalFile.getName(), docFilePath, true);
                    selectedImages.add(image);
                    arrayAdapter.notifyDataSetChanged();
                    orientationBasedUI(getResources().getConfiguration().orientation);
                }
                break;
        }
    }

    public void orientationBasedUI(int orientation) {
        WindowManager windowManager = (WindowManager) getApplicationContext().getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics metrics = new DisplayMetrics();
        windowManager.getDefaultDisplay().getMetrics(metrics);

        if(arrayAdapter!= null) {
            int size = orientation == Configuration.ORIENTATION_PORTRAIT ? metrics.widthPixels / 2 : metrics.widthPixels / 4;
            arrayAdapter.setLayoutParms(size);
        }
        imagesGrid.setNumColumns(orientation == Configuration.ORIENTATION_PORTRAIT ? 2 : 4);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        orientationBasedUI(newConfig.orientation);
    }

    public Uri getCapturedImageUri(Context context, Bitmap capturedImage) {

        String imageName = "NSA"+ generateRandNumber();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        capturedImage.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
        String path = MediaStore.Images.Media.insertImage(context.getContentResolver(), capturedImage, imageName, null);

        return Uri.parse(path);
    }

    public String getRealPathForImages(Uri imageUri) {
        Log.v("URI "," "+imageUri);
        Cursor cursor = getContentResolver().query(imageUri, null, null, null, null);
        Log.v("URI "," cursor "+cursor);
        assert cursor != null;
        cursor.moveToFirst();
        int index = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
        String path = cursor.getString(index);
        cursor.close();
        return path;
    }

    public String getRealPathForDocs(Context context,Uri uri) {
        String filepath = "";//default fileName
        //Uri filePathUri = uri;
        File file;
        if (uri.getScheme().toString().compareTo("content") == 0)
        {
            Cursor cursor = context.getContentResolver().query(uri, new String[] { android.provider.MediaStore.Images.ImageColumns.DATA, MediaStore.Images.Media.ORIENTATION }, null, null, null);
            int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);

            cursor.moveToFirst();

            String mImagePath = cursor.getString(column_index);
            cursor.close();
            filepath = mImagePath;

        }
        else
        if (uri.getScheme().compareTo("file") == 0)
        {
            try
            {
                file = new File(new URI(uri.toString()));
                if (file.exists())
                    filepath = file.getAbsolutePath();

            }
            catch (URISyntaxException e)
            {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        else
        {
            filepath = uri.getPath();
        }
        return filepath;
    }
    public int generateRandNumber() {
        Random randNumber = new Random(1000);
        return randNumber.nextInt();
    }

    public void progressbarLayoutVisibility() {
        if(noContent.getVisibility() == View.INVISIBLE || noContent.getVisibility() == View.GONE)
            noContent.setVisibility(View.VISIBLE);
        if(progressBarLayout.getVisibility() == View.VISIBLE || progressBarLayout.getVisibility() == View.INVISIBLE)
            progressBarLayout.setVisibility(View.GONE);
    }
}