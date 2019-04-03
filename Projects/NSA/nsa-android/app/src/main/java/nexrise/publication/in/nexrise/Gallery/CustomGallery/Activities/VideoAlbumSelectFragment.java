package nexrise.publication.in.nexrise.Gallery.CustomGallery.Activities;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.database.ContentObserver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.Process;
import android.provider.MediaStore;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.ActionBar;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.ProgressBar;
import android.widget.TextView;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;

import nexrise.publication.in.nexrise.BeanClass.LoginObject;
import nexrise.publication.in.nexrise.Gallery.CreateVideoActivity;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.ArrayAdapter.CustomAlbumVideoSelectAdapter;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.BeanClass.Album;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Util.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

import static nexrise.publication.in.nexrise.Constants.EMPLOYEE;

public class VideoAlbumSelectFragment extends HelperFragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private ArrayList<Album> albums;

    private TextView errorDisplay;

    private ProgressBar progressBar;
    FloatingActionButton floatingActionButton;
    private GridView gridView;
    private CustomAlbumVideoSelectAdapter adapter;

    private ActionBar actionBar;

    private ContentObserver observer;
    private Handler handler;
    private Thread thread;

    private final String[] projection = new String[]{
            MediaStore.Video.Media.BUCKET_ID,
            MediaStore.Video.Media.BUCKET_DISPLAY_NAME,
            MediaStore.Video.Media.DATA };

    public VideoAlbumSelectFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment VideoAlbumSelectFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static VideoAlbumSelectFragment newInstance(String param1, String param2) {
        VideoAlbumSelectFragment fragment = new VideoAlbumSelectFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }

        Constants.limit = getArguments().getInt(Constants.INTENT_EXTRA_LIMIT, Constants.DEFAULT_LIMIT);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view =  inflater.inflate(R.layout.fragment_video_select, container, false);
        progressBar = (ProgressBar)view.findViewById(R.id.progress_bar_album_select);
        gridView = (GridView)view. findViewById(R.id.grid_view_album_select);
        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent = new Intent(getActivity().getApplicationContext(), VideoSelectActivity.class);
                intent.putExtra(Constants.INTENT_EXTRA_ALBUM, albums.get(position).name);
                intent.putExtra("From","VideoAlbumSelectFragment");
                startActivityForResult(intent, Constants.REQUEST_CODE);
                Log.v("Album ","name "+albums.get(position).name);
            }
        });
        errorDisplay = (TextView)view.findViewById(R.id.text_view_error);
        floatingActionButton = (FloatingActionButton) view.findViewById(R.id.floating);
        floatingActionButton.setVisibility(View.GONE);
        floatingActionButtonClick(view);

        return view;
    }

    @Override
    public void onStart() {
        super.onStart();

        handler = new Handler() {
            @Override
            public void handleMessage(Message msg) {
                switch (msg.what) {
                    case Constants.PERMISSION_GRANTED: {
                        loadAlbums();
                        break;
                    }

                    case Constants.FETCH_STARTED: {
                        progressBar.setVisibility(View.VISIBLE);
                        gridView.setVisibility(View.INVISIBLE);
                        break;
                    }

                    case Constants.FETCH_COMPLETED: {
                        if(albums.size() == 0) {
                            errorDisplay.setVisibility(View.VISIBLE);
                            errorDisplay.setText("Nothing to show");
                        }
                        if (adapter == null) {
                            adapter = new CustomAlbumVideoSelectAdapter(getActivity().getApplicationContext(), albums);
                            gridView.setAdapter(adapter);
                            Log.v("Albums ","size videos "+albums.size());
                            progressBar.setVisibility(View.INVISIBLE);
                            gridView.setVisibility(View.VISIBLE);
                            orientationBasedUI(getResources().getConfiguration().orientation);

                        } else {
                            adapter.notifyDataSetChanged();
                        }
                        break;
                    }

                    case Constants.ERROR: {
                        progressBar.setVisibility(View.INVISIBLE);
                        errorDisplay.setVisibility(View.VISIBLE);
                        break;
                    }

                    default: {
                        super.handleMessage(msg);
                    }
                }
            }
        };
        observer = new ContentObserver(handler) {
            @Override
            public void onChange(boolean selfChange, Uri uri) {
                loadAlbums();
            }
        };
        getActivity().getContentResolver().registerContentObserver(MediaStore. Video.Media.EXTERNAL_CONTENT_URI, false, observer);

        checkPermission();
    }

    @Override
    public void onStop() {
        super.onStop();

        stopThread();

        getActivity().getContentResolver().unregisterContentObserver(observer);
        observer = null;

        if (handler != null) {
            handler.removeCallbacksAndMessages(null);
            handler = null;
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        if (actionBar != null) {
            actionBar.setHomeAsUpIndicator(null);
        }
        albums = null;
        if (adapter != null) {
            adapter.releaseResources();
        }
        gridView.setOnItemClickListener(null);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        orientationBasedUI(newConfig.orientation);
    }

    private void orientationBasedUI(int orientation) {
        final WindowManager windowManager = (WindowManager) getActivity().getApplicationContext().getSystemService(Context.WINDOW_SERVICE);
        final DisplayMetrics metrics = new DisplayMetrics();
        windowManager.getDefaultDisplay().getMetrics(metrics);

        if (adapter != null) {
            int size = orientation == Configuration.ORIENTATION_PORTRAIT ? metrics.widthPixels / 2 : metrics.widthPixels / 4;
            adapter.setLayoutParams(size);
        }
        gridView.setNumColumns(orientation == Configuration.ORIENTATION_PORTRAIT ? 2 : 4);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

    }
    public void floatingActionButtonClick(final View view) {

        Bundle bundle = this.getArguments();
        LoginObject userObject = (LoginObject) bundle.getSerializable("userObject");
        if(StringUtils.userRole.equalsIgnoreCase(EMPLOYEE)){
            floatingActionButton.setVisibility(View.VISIBLE);
        }else if(!StringUtils.userRole.equalsIgnoreCase(EMPLOYEE)) {
            floatingActionButton.setVisibility(View.GONE);
        }

        floatingActionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), CreateVideoActivity.class);
                startActivity(intent);

            }
        });
    }

    private void loadAlbums() {
        startThread(new VideoAlbumSelectFragment.AlbumLoaderRunnable());
    }

    private class AlbumLoaderRunnable implements Runnable {
        @Override
        public void run() {
            android.os.Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);

            if (adapter == null) {
                sendMessage(Constants.FETCH_STARTED);
            }

            Cursor cursor = getActivity().getApplicationContext().getContentResolver()
                    .query(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, projection,
                            MediaStore.Video.Thumbnails.DATA +" like ?", new String[]{"%/"+"NexSchoolApp/Videos"+"/%"}, null);
            if (cursor == null) {
                sendMessage(Constants.ERROR);
                return;
            }

            ArrayList<Album> temp = new ArrayList<>(cursor.getCount());
            HashSet<Long> albumSet = new HashSet<>();
            File file;
            if (cursor.moveToLast()) {
                do {
                    if (Thread.interrupted()) {
                        return;
                    }

                    long albumId = cursor.getLong(cursor.getColumnIndex(projection[0]));
                    String album = cursor.getString(cursor.getColumnIndex(projection[1]));
                    String image = cursor.getString(cursor.getColumnIndex(projection[2]));

                    if (!albumSet.contains(albumId)) {
                        /*
                        It may happen that some image file paths are still present in cache,
                        though image file does not exist. These last as long as media
                        scanner is not run again. To avoid get such image file paths, check
                        if image file exists.
                         */
                        file = new File(image);
                        if (file.exists()) {
                            temp.add(new Album(album, image));
                            albumSet.add(albumId);
                        }
                    }

                } while (cursor.moveToPrevious());
            }
            cursor.close();

            if (albums == null) {
                albums = new ArrayList<>();
            }
            albums.clear();
            albums.addAll(temp);

            sendMessage(Constants.FETCH_COMPLETED);
        }
    }

    private void startThread(Runnable runnable) {
        stopThread();
        thread = new Thread(runnable);
        thread.start();
    }

    private void stopThread() {
        if (thread == null || !thread.isAlive()) {
            return;
        }

        thread.interrupt();
        try {
            thread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void sendMessage(int what) {
        if (handler == null) {
            return;
        }

        Message message = handler.obtainMessage();
        message.what = what;
        message.sendToTarget();
    }

    @Override
    protected void permissionGranted() {
        Message message = handler.obtainMessage();
        message.what = Constants.PERMISSION_GRANTED;
        message.sendToTarget();
    }

    @Override
    protected void hideViews() {
        progressBar.setVisibility(View.INVISIBLE);
        gridView.setVisibility(View.INVISIBLE);
    }
}
