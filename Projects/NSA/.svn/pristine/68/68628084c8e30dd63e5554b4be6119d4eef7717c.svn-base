package nexrise.publication.in.nexrise.MMS;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.media.MediaPlayer;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.SeekBar;
import android.widget.TextView;

import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Karthik on 12/9/17.
 */

public class AudioPlayer {
    private int mediaFileLengthInMilliseconds;
    private boolean prepared = false;

    public void playAudio(String streamingUrl, String fileName, LayoutInflater inflater, final Context context) {
        prepared = false;
        final AlertDialog alertDialog = new AlertDialog.Builder(context)
                .setTitle(fileName)
                .setView(inflater.inflate(R.layout.audio_player, null)).create();
        alertDialog.show();
        final MediaPlayer mediaPlayer = new MediaPlayer();
        final Handler handler = new Handler();
        final ImageView play = (ImageView) alertDialog.findViewById(R.id.play);
        final ImageView pause = (ImageView) alertDialog.findViewById(R.id.pause);
        final TextView duration = (TextView)alertDialog.findViewById(R.id.duration);
        final ProgressBar progressBar = (ProgressBar)alertDialog.findViewById(R.id.progress);

        final SeekBar seekBarProgress = (SeekBar)alertDialog.findViewById(R.id.SeekBarTestPlay);
        seekBarProgress.setMax(99); // It means 100% .0-99

        Log.v("Streaming url ",streamingUrl);
        try {
            mediaPlayer.setDataSource(streamingUrl);

        } catch (Exception e) {
            e.printStackTrace();
        }

        seekBarProgress.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                int playPositionInMillisecconds = (mediaFileLengthInMilliseconds / 100) * seekBarProgress.getProgress();
                mediaPlayer.seekTo(playPositionInMillisecconds);
                return false;
            }
        });
        mediaPlayer.setOnBufferingUpdateListener(new MediaPlayer.OnBufferingUpdateListener() {
            @Override
            public void onBufferingUpdate(MediaPlayer mediaPlayer, int i) {
                seekBarProgress.setSecondaryProgress(i);
            }
        });

        mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
            @Override
            public void onCompletion(MediaPlayer mediaPlayer) {
                        /*play.setVisibility(View.VISIBLE);
                        pause.setVisibility(View.GONE);*/
            }
        });

        play.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                play.setVisibility(View.GONE);
                pause.setVisibility(View.VISIBLE);

                try {
                    mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                        @Override
                        public void onPrepared(MediaPlayer mediaPlayer) {
                            prepared = true;
                            progressBar.setVisibility(View.GONE);
                            pause.setVisibility(View.VISIBLE);

                            mediaFileLengthInMilliseconds = mediaPlayer.getDuration(); // gets the song length in milliseconds from URL
                            String audioLength = StringUtils.getInstance().millsecondToDuration(mediaFileLengthInMilliseconds);
                            duration.setText(audioLength);

                            mediaPlayer.start();
                            primarySeekBarProgressUpdater(seekBarProgress, mediaPlayer, handler);
                        }
                    });
                    if (prepared) {
                        mediaFileLengthInMilliseconds = mediaPlayer.getDuration(); // gets the song length in milliseconds from URL
                        String audioLength = StringUtils.getInstance().millsecondToDuration(mediaFileLengthInMilliseconds);
                        duration.setText(audioLength);

                        mediaPlayer.start();
                        primarySeekBarProgressUpdater(seekBarProgress, mediaPlayer, handler);
                    } else {
                        mediaPlayer.prepareAsync();
                        progressBar.setVisibility(View.VISIBLE);
                        pause.setVisibility(View.GONE);
                    }
                } catch (Exception e) {
                    if(progressBar.getVisibility() == View.VISIBLE) progressBar.setVisibility(View.GONE);
                    if(pause.getVisibility() == View.VISIBLE) pause.setVisibility(View.GONE);
                    play.setVisibility(View.VISIBLE);

                    e.printStackTrace();
                }
            }
        });

        pause.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                play.setVisibility(View.VISIBLE);
                pause.setVisibility(View.GONE);
                if(mediaPlayer.isPlaying()) {
                    mediaFileLengthInMilliseconds = mediaPlayer.getDuration();
                    mediaPlayer.pause();
                    primarySeekBarProgressUpdater(seekBarProgress, mediaPlayer, handler);
                }
            }
        });
        alertDialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
            @Override
            public void onDismiss(DialogInterface dialogInterface) {
                if(mediaPlayer.isPlaying()) {
                    try {
                        mediaPlayer.stop();
                        mediaPlayer.reset();
                        //mediaPlayer.release();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    private void primarySeekBarProgressUpdater(final SeekBar seekBarProgress, final MediaPlayer mediaPlayer, final Handler handler) {
        try {
            seekBarProgress.setProgress((int) (((float) mediaPlayer.getCurrentPosition() / mediaFileLengthInMilliseconds) * 100)); // This math construction give a percentage of "was playing"/"song length"
            if (mediaPlayer.isPlaying()) {
                Runnable notification = new Runnable() {
                    public void run() {
                        primarySeekBarProgressUpdater(seekBarProgress, mediaPlayer, handler);
                    }
                };
                handler.postDelayed(notification, 1000);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
