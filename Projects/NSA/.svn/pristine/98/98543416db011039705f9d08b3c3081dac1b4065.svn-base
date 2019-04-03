package nexrise.publication.in.nexrise.MMS;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.SystemClock;
import android.preference.PreferenceManager;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.support.annotation.NonNull;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.Chronometer;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.message.BasicHeader;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import nexrise.publication.in.nexrise.Common.BaseActivity;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.FileUploadUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class AudioAttachmentActivity extends BaseActivity implements Constants{
    private final String DISABLED_RED = "#E8BAC2";
    private final String RED = "#D75A4A";
    private final String DISABLED_GREY = "#CCD3D9";
    private final String GREY = "#5C5C5C";
    final int BROWSE_FILES = 1;
    ImageView record;
    ImageView stopRecording;
    ImageView play;
    ImageView pause;
    TextView playbackTime;
    String audioFilePath = "";
    String audioFileName = "";
    boolean prepared = false;
    MediaPlayer mediaPlayer = new MediaPlayer();
    String uuid = "";
    FileUploadUrlConnection fileUpload = null;
    FileUploadUrlConnection fileUploadToDb = null;

    MediaRecorder mediaRecorder = new MediaRecorder();
    private VisualizerView visualizerView;
    private Handler handler = new Handler();

    SeekBar seekBar;
    RelativeLayout recordingIndication;
    Chronometer chronometer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_audio_attachment);

        visualizerView = (VisualizerView)findViewById(R.id.visualizer);
        record = (ImageView)findViewById(R.id.record);
        stopRecording = (ImageView)findViewById(R.id.stop);
        play = (ImageView)findViewById(R.id.play);
        pause = (ImageView)findViewById(R.id.pause);
        playbackTime = (TextView)findViewById(R.id.playback_time);

        handler.post(updater);

        uuid = getIntent().getStringExtra(UPLOAD_ID);
        if(getIntent().hasExtra("File name")) audioFileName = getIntent().getStringExtra("File name");

        final SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);

        handleBrowseFiles();
        disablePlay();
        disableStop();

        ActionBar actionBar = getSupportActionBar();
        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle("Audio");
        }

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED && checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED && checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                record.setEnabled(true);
                StringUtils.getInstance().createDirectory(this);
            } else {
                String[] perm = {Manifest.permission.RECORD_AUDIO, Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE};
                requestPermissions(perm, 10);
            }
        } else {
            record.setEnabled(true);
            StringUtils.getInstance().createDirectory(this);
        }

        recordingIndication = (RelativeLayout)findViewById(R.id.recording_indication);
        recordingIndication.setVisibility(View.INVISIBLE);

        seekBar = (SeekBar)findViewById(R.id.media_seekbar);
        seekBar.setMax(99);

        chronometer = (Chronometer)findViewById(R.id.timer);

        final MMSArrayAdapter arrayAdapter = new MMSArrayAdapter(this, 0, null);

        record.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String audioPath = preferences.getString(AUDIO_PATH, "");

                if(audioFileName.isEmpty()) {
                    enterFileName();
                    /*if(audioFileName.isEmpty())
                        return;
                    else
                        recordAudio();
                    Calendar calendar = Calendar.getInstance();
                    int milliseconds = calendar.get(Calendar.MILLISECOND);
                    audioFileName = audioFileName + ".aac";
                    audioFilePath = audioPath + "/" + audioFileName;*/
                } else
                    recordAudio();
                  //  audioFilePath = audioPath + "/" + audioFileName;


            }
        });

        play.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    pauseVisible();
                    mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                        @Override
                        public void onPrepared(MediaPlayer mediaPlayer) {
                            prepared = true;
                            mediaPlayer.start();
                            arrayAdapter.mediaFileLengthInMilliseconds = mediaPlayer.getDuration();
                            String audioLength = StringUtils.getInstance().millsecondToDuration(mediaPlayer.getDuration());
                            playbackTime.setText(audioLength);

                            arrayAdapter.primarySeekBarProgressUpdater(seekBar, mediaPlayer, new Handler());
                        }
                    });
                    if(prepared) {
                        mediaPlayer.start();
                        arrayAdapter.mediaFileLengthInMilliseconds = mediaPlayer.getDuration();
                        String audioLength = StringUtils.getInstance().millsecondToDuration(mediaPlayer.getDuration());
                        playbackTime.setText(audioLength);

                        arrayAdapter.primarySeekBarProgressUpdater(seekBar, mediaPlayer, new Handler());
                    } else
                        mediaPlayer.prepareAsync();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        pause.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                pauseGone();
                mediaPlayer.pause();
            }
        });

        stopRecording.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    mediaRecorder.stop();
                    chronometer.stop();
                    recordingIndication.setVisibility(View.INVISIBLE);
                    seekBar.setVisibility(View.VISIBLE);

                    enableRecord();
                    enablePlay();
                    disableStop();
                    playbackTimeInvisible();

                    mediaPlayer = new MediaPlayer();
                    mediaPlayer.setDataSource(audioFilePath);

                    mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                        @Override
                        public void onCompletion(MediaPlayer mediaPlayer) {
                            seekBar.setProgress(0);
                            pauseGone();
                        }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        seekBar.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                int playPositionInMillisecconds = (arrayAdapter.mediaFileLengthInMilliseconds / 100) * seekBar.getProgress();
                mediaPlayer.seekTo(playPositionInMillisecconds);
                return false;
            }
        });

    }

    private void recordAudio() {
        if(seekBar.getVisibility() == View.VISIBLE) seekBar.setVisibility(View.GONE);
        playbackTimeInvisible();

        visualizerView.beginningIndex = 0;
        visualizerView.insertIdx = 0;

        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.DEFAULT);
        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);

        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
        mediaRecorder.setOutputFile(audioFilePath);

        try {
            enableStop();
            disableRecord();
            disablePlay();

            mediaRecorder.prepare();
            mediaRecorder.start();

            recordingIndication.setVisibility(View.VISIBLE);
            chronometer.setBase(SystemClock.elapsedRealtime());
            chronometer.start();

            if(mediaPlayer.isPlaying()) {
                mediaPlayer.stop();
            }

        } catch (Exception e) {
            Toast.makeText(AudioAttachmentActivity.this, "Could not record audio", Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }
        try {
            mediaPlayer.reset();
            prepared = false;
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    private void enterFileName() {
        AlertDialog.Builder enterDescriptionBuilder = new AlertDialog.Builder(AudioAttachmentActivity.this);
        LayoutInflater layoutInflater = getLayoutInflater();
        final View descriptionDialogView = layoutInflater.inflate(R.layout.enter_description_dialog, null);
        enterDescriptionBuilder.setView(descriptionDialogView);
        enterDescriptionBuilder.setTitle("Enter File Name");

        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        final String audioPath = preferences.getString(AUDIO_PATH, "");

        enterDescriptionBuilder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(final DialogInterface dialog, int which) {
                EditText enteredText = (EditText)descriptionDialogView.findViewById(R.id.enter_descripition);
                dialog.dismiss();

                if(enteredText.getText().toString().trim().isEmpty())
                    return;

                audioFileName = enteredText.getText().toString().trim();
                audioFileName = audioFileName + ".mp3";
                audioFilePath = audioPath + "/" + audioFileName;
                recordAudio();
            }
        });

        enterDescriptionBuilder.setNegativeButton("CANCEL", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        enterDescriptionBuilder.show();

    }

    private void handleBrowseFiles() {
        Button browseFiles = (Button)findViewById(R.id.browse);
        browseFiles.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Audio.Media.EXTERNAL_CONTENT_URI);
                startActivityForResult(i,BROWSE_FILES);
            }
        });
    }

    final Runnable updater = new Runnable() {
        public void run() {
            handler.postDelayed(this, 10);
            int maxAmplitude = mediaRecorder.getMaxAmplitude();
            if (maxAmplitude != 0) {
                visualizerView.addAmplitude(maxAmplitude);
            }
        }
    };

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.actionbar_with_send_button, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                setResult(RESULT_CANCELED);
                finish();
                overridePendingTransition(R.anim.left_to_right_anim, R.anim.left_to_right_exit);
                break;
            case R.id.send:
                uploadAudio();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void uploadAudio() {
        final ProgressDialog progressDialog = new ProgressDialog(this);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        progressDialog.setMessage("Uploading audio");
        progressDialog.setCancelable(false);
        progressDialog.setCanceledOnTouchOutside(false);

        String url = BASE_URL + API_VERSION_ONE + UPLOAD + "/";
        HashMap<String, String> uploadBody = new HashMap<String, String>();
        uploadBody.put("uploadId", uuid);
        final File file = new File(audioFilePath);
        ArrayList<Map.Entry<String, String>> jsonBody = new ArrayList<>(uploadBody.entrySet());

        if(!audioFilePath.isEmpty()) {
            BasicHeader[] headers = StringUtils.getInstance().fileUploadHeader(AudioAttachmentActivity.this, VOICE_MMS_ID, uuid);
            fileUpload = new FileUploadUrlConnection(this, url, headers, file, jsonBody) {
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    try {
                        progressDialog.setProgress(50);
                        HashMap<String, String> payload = handleResponse(response);
                                /*Intent intent = handleResponse(response, progressDialog);
                                setResult(RESULT_OK, intent);
                                finish();*/
                        File uploadFile = new File(audioFilePath);
                        ArrayList<Map.Entry<String, String>> uploadJson = new ArrayList<>(payload.entrySet());
                        String url = BASE_URL + API_VERSION_ONE + VOICE + AUDIO + UPLOAD;
                        fileUploadToDb = new FileUploadUrlConnection(AudioAttachmentActivity.this, url, null, uploadFile, uploadJson) {
                            @Override
                            protected void onPostExecute(String s) {
                                super.onPostExecute(s);
                                try {
                                    Log.v("Upload ",s);
                                    JSONObject responseObj = new JSONObject(s);
                                    progressDialog.setProgress(99);
                                    boolean success = responseObj.getBoolean(SUCCESS);
                                    if(success) {
                                        progressDialog.dismiss();
                                        finish();
                                    }
                                } catch (JSONException | NullPointerException e) {
                                    progressDialog.dismiss();
                                    Toast.makeText(AudioAttachmentActivity.this, "File uploading failed", Toast.LENGTH_SHORT).show();
                                    e.printStackTrace();
                                }
                            }
                        };
                        fileUploadToDb.execute();
                    } catch (Exception e) {
                        progressDialog.dismiss();
                        Toast.makeText(AudioAttachmentActivity.this, "File uploading failed", Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    }
                }
            }; fileUpload.execute();
        } else
            Toast.makeText(AudioAttachmentActivity.this, "Please record an audio to upload", Toast.LENGTH_SHORT).show();

        progressDialog.setButton(DialogInterface.BUTTON_NEGATIVE, "Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                if(fileUpload != null) fileUpload.cancel(true);
                if(fileUploadToDb != null) fileUploadToDb.cancel(true);
            }
        });

        if(!audioFilePath.isEmpty()) {
            if(isConnected())
                progressDialog.show();
            else
                Toast.makeText(this, "Please check you internet connection", Toast.LENGTH_SHORT).show();
        }
    }

    private HashMap<String, String> handleResponse(String response) {
        HashMap<String , String> payload = new HashMap<>();
        try {
            JSONObject jsonObject = new JSONObject(response);
            boolean success = jsonObject.getBoolean(SUCCESS);
            if(success) {
                JSONArray files = jsonObject.getJSONArray("files");
                String fileUrl = "";
                String fileName = "";
                for(int i=0; i<files.length(); i++) {
                    JSONObject attachment = new JSONObject();
                    JSONObject fileObj = files.getJSONObject(i);
                    fileUrl = fileObj.getString("key");
                    fileName = fileObj.getString("fieldname");
                    payload.put("download_link", fileUrl);
                    payload.put("file_name", fileName);
                }
                return payload;
            } else {
                Toast.makeText(this, "File uploading failed", Toast.LENGTH_SHORT).show();
            }
        } catch (JSONException | NullPointerException e) {
            e.printStackTrace();
        }
        return payload;
    }

    public Intent handleResponse(String response, ProgressDialog progressDialog) {
        Intent callback = new Intent();

        try {
            JSONObject jsonObject = new JSONObject(response);
            boolean success = jsonObject.getBoolean(SUCCESS);
            if(success) {
                JSONArray files = jsonObject.getJSONArray("files");
                String fileUrl = "";
                String fileName = "";
                for(int i=0; i<files.length(); i++) {
                    JSONObject attachment = new JSONObject();
                    JSONObject fileObj = files.getJSONObject(i);
                    fileUrl = fileObj.getString("key");
                    fileName = fileObj.getString("fieldname");
                }
                if(progressDialog.isShowing()) progressDialog.dismiss();

                callback.putExtra("AudioFilePath", audioFilePath);
                callback.putExtra("AudioFileName", audioFileName);
                callback.putExtra("download_link", fileUrl);
                callback.putExtra("file_name", fileName);

                return callback;
            } else {
                if(progressDialog.isShowing()) progressDialog.dismiss();
                Toast.makeText(this, "File uploading failed", Toast.LENGTH_SHORT).show();
            }
        } catch (JSONException | NullPointerException e) {
            if (progressDialog.isShowing()) progressDialog.dismiss();
            e.printStackTrace();
        }
        return callback;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(grantResults.length > 0) {
            int count = 0;
            for (int i=0; i<grantResults.length; i++) {
                if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                    if(permissions[i].equals(Manifest.permission.WRITE_EXTERNAL_STORAGE))
                        StringUtils.getInstance().createDirectory(this);
                    ++count;
                }
            }

            if (grantResults.length == count) {
                record.setEnabled(true);

            } else {
                disableRecord();
                Toast.makeText(this, "Please allow permission to enable this functionality", Toast.LENGTH_LONG).show();
            }
        } else
            disableRecord();

    }

    private void enablePlay() {
        play.setEnabled(true);
        play.getDrawable().setColorFilter(Color.parseColor(GREY), PorterDuff.Mode.SRC_IN);
    }

    private void disablePlay() {
        play.setEnabled(false);
        play.getDrawable().setColorFilter(Color.parseColor(DISABLED_GREY), PorterDuff.Mode.SRC_IN);
    }

    private void enableRecord() {
        record.setEnabled(true);
        record.getDrawable().setColorFilter(Color.parseColor(RED), PorterDuff.Mode.SRC_IN);
    }

    private void disableRecord() {
        record.setEnabled(false);
        record.getDrawable().setColorFilter(Color.parseColor(DISABLED_RED), PorterDuff.Mode.SRC_IN);
    }

    private void enableStop() {
        stopRecording.setEnabled(true);
        stopRecording.getDrawable().setColorFilter(Color.parseColor(GREY), PorterDuff.Mode.SRC_IN);
    }

    private void disableStop() {
        stopRecording.setEnabled(false);
        stopRecording.getDrawable().setColorFilter(Color.parseColor(DISABLED_GREY), PorterDuff.Mode.SRC_IN);
    }

    private void pauseVisible() {
        play.setVisibility(View.GONE);
        pause.setVisibility(View.VISIBLE);
    }

    private void pauseGone() {
        play.setVisibility(View.VISIBLE);
        pause.setVisibility(View.GONE);
    }

    private void playbackTimeInvisible() {
        playbackTime.setText("");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        handler.removeCallbacks(updater);
    }

    private String getFileName(Uri fileUri) {
        String uriString = fileUri.toString();
        File file = new File(uriString);
        String fileName = "";
        if(uriString.startsWith("content://")) {
            Cursor cursor = null;
            try {
                cursor = this.getContentResolver().query(fileUri, null, null, null, null);
                if(cursor != null && cursor.moveToFirst()) {
                    fileName = cursor.getString(cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME));
                }
            } finally {
                if(cursor != null) cursor.close();
            }
        } else if(uriString.startsWith("file://"))
            fileName = file.getName();

        return fileName;
    }

    private String getAudioFilePath(Uri uri) {
        String uriString = uri.toString();
        File file = new File(uriString);
        String fileUrl = "";

        Cursor cursor = null;
        try {
            cursor = this.getContentResolver().query(uri, null, null, null, null);
            if(cursor != null && cursor.moveToFirst()) {
                fileUrl = cursor.getString(cursor.getColumnIndex(MediaStore.Audio.Media.DATA));
            }
        } finally {
            if(cursor != null) cursor.close();
        }

        return fileUrl;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case BROWSE_FILES:
                if (resultCode == RESULT_OK && data != null) {
                    Uri uri = data.getData();
                    String fileName = getFileName(uri);

                    if (uri != null) {
                        audioFilePath = getAudioFilePath(uri);
                        uploadAudio();
                    } else
                        Toast.makeText(this, "Could not upload audio", Toast.LENGTH_SHORT).show();

                    Log.v("URI ", ":" + uri);
                    Log.v("URI filename", ":" + fileName);

                }
                break;
        }
    }
}
