package nexrise.publication.in.nexrise.Gallery;

import android.Manifest;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.webkit.MimeTypeMap;
import android.widget.Toast;

import com.amazonaws.mobileconnectors.s3.transferutility.TransferListener;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferObserver;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferState;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferUtility;

import java.io.File;
import java.io.IOException;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;


public class BaseImageActivity extends AppCompatActivity implements Constants{
    SharedPreferences preferences;
    StringUtils utils;
    Utility utility;

    public void fileDownload(String imageUrl, final String fileName) {
        checkVersionAndDirectory();
        utils = new StringUtils();
        utility = new Utility();

        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String bucketName = preferences.getString(SCHOOL_ID, null);
        TransferUtility transferUtility = utils.getTransferUtility(this);
        final String filePath = fileDownloadPath(fileName);
        File file = new File(filePath+ "/"+fileName);
        try {
            file.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
        TransferObserver observer = transferUtility.download(bucketName, imageUrl, file);

        observer.setTransferListener(new TransferListener() {
            NotificationManager notificationManager = (NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
            NotificationCompat.Builder notification = new NotificationCompat.Builder(BaseImageActivity.this).setSmallIcon(R.drawable.ic_start_download)
                   .setContentTitle(getResources().getText(R.string.downloading_));
            @Override
            public void onStateChanged(int id, TransferState state) {
                Log.v("ON ","state changed "+state);

                if(state == TransferState.FAILED) {
                    notificationManager.cancel(id);

                    notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                    notification = new NotificationCompat.Builder(BaseImageActivity.this).setSmallIcon(R.drawable.ic_download_failed)
                            .setContentTitle(getResources().getText(R.string.downloading_failed));
                    Toast.makeText(BaseImageActivity.this,R.string.download_failed,Toast.LENGTH_LONG).show();
                    notificationManager.notify(id, notification.getNotification());
                } else if(state == TransferState.IN_PROGRESS) {
                    notification.setContentText(getResources().getText(R.string.downloading_));
                    Toast.makeText(BaseImageActivity.this,R.string.downloading,Toast.LENGTH_SHORT).show();
                    notification.setProgress(100, 0, false);
                    notificationManager.notify(id, notification.getNotification());
                } else if (state == TransferState.COMPLETED) {
                    Toast.makeText(BaseImageActivity.this,R.string.download_complete,Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onProgressChanged(final int id, long bytesCurrent, long bytesTotal) {
                notification.setContentText("Downloaded "+utility.getBytes(bytesCurrent)+" of "+utility.getBytes(bytesTotal));
                notification.setProgress((int)bytesTotal, (int)bytesCurrent, false);
                notificationManager.notify(id, notification.getNotification());

                if(bytesCurrent == bytesTotal) {

                    String path = filePath + "/" + fileName;
                    Uri uri = Uri.parse(path);
                    //  sendBroadcast(new Intent(Intent.ACTION_MEDIA_MOUNTED, uri));
                    MediaScannerConnection.scanFile(BaseImageActivity.this, new String[]{path}, null, new MediaScannerConnection.OnScanCompletedListener() {
                        @Override
                        public void onScanCompleted(String path, Uri uri) {
                            Log.v("Media","scan completed "+uri);
                            PendingIntent intent = PendingIntent.getActivity(BaseImageActivity.this, 20, openFileLocation(uri, filePath, fileName), PendingIntent.FLAG_UPDATE_CURRENT);
                            notificationManager.cancel(id);
                            notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                            notification = new NotificationCompat.Builder(BaseImageActivity.this).setSmallIcon(R.drawable.ic_download_completed)
                                    .setContentTitle(getResources().getText(R.string.download_complete)).setContentIntent(intent).setAutoCancel(true);
                            notificationManager.notify(id, notification.getNotification());
                        }
                    });
                }
            }

            @Override
            public void onError(int id, Exception ex) {
                Log.v("ON ","error "+ex);
                notificationManager.cancel(id);

                notificationManager = (NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
                notification = new NotificationCompat.Builder(BaseImageActivity.this).setSmallIcon(R.drawable.ic_download_failed)
                        .setContentTitle(getResources().getText(R.string.downloading_failed));
                notificationManager.notify(id, notification.getNotification());
            }
        });
    }

    public String fileDownloadPath(String fileName) {
        String fileType = fileType(fileName);
        if(fileType.contains("Image")) {
            return preferences.getString(IMAGES_PATH, null);
        } else if(fileType.contains("File")) {
            return preferences.getString(DOCUMENTS_PATH, null);
        } else {
            return preferences.getString(VIDEO_PATH, null);
        }
    }

    void checkVersionAndDirectory() {
        if(Build.VERSION.SDK_INT >=  Build.VERSION_CODES.M){
            if(ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED)
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 25);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(grantResults.length != 0) {
            if (requestCode == 25 && grantResults[0] == PackageManager.PERMISSION_GRANTED)
                utils.createDirectory(BaseImageActivity.this);
        }
    }

    public Intent openFileLocation(Uri uri, String filePath, String fileName) {
        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_VIEW);
        String path = filePath +"/"+ fileName;
        if(uri == null)
            uri = Uri.parse(path);
        Log.v("DOWNLOADED "," "+path);

        String[] file = fileName.split("\\.");
        String extension = file[file.length-1];

        MimeTypeMap mimeTypeMap = MimeTypeMap.getSingleton();
        String mimeType = mimeTypeMap.getMimeTypeFromExtension(extension);

        intent.setDataAndType(uri, mimeType);

        return intent;
    }

    public String fileType(String fileName) {
        if(fileName.toLowerCase().endsWith("jpg") || fileName.toLowerCase().endsWith("jpeg") || fileName.toLowerCase().endsWith("png") || fileName.toLowerCase().endsWith("gif")) {
            return "Image";
        } else if(fileName.toLowerCase().endsWith("doc") || fileName.toLowerCase().endsWith("pdf") || fileName.toLowerCase().endsWith("txt") || fileName.toLowerCase().endsWith("docx") || fileName.toLowerCase().endsWith("xls") ||fileName.toLowerCase().endsWith("xlsx") ||fileName.toLowerCase().endsWith("pptx") || fileName.toLowerCase().endsWith("html") || fileName.toLowerCase().endsWith("xml") ) {
            return "File";
        } else {
            return "Video";
        }
    }
}
