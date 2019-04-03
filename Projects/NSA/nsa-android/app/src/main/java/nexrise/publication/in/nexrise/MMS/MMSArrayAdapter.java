package nexrise.publication.in.nexrise.MMS;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.media.MediaPlayer;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.SeekBar;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.MMS;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by karthik on 12/7/17.
 */

public class MMSArrayAdapter extends ArrayAdapter<MMS> implements Constants {
    private Activity context;
    protected int mediaFileLengthInMilliseconds;
    boolean prepared = false;

    public MMSArrayAdapter(@NonNull Activity context, int resource, ArrayList<MMS> audios) {
        super(context, resource, audios);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        final LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        final MMS mms = getItem(position);

        if(convertView == null) {
            convertView = inflater.inflate(R.layout.mms_layout, parent, false);
            holder.audioLayout = (RelativeLayout)convertView.findViewById(R.id.audio_layout);
            holder.fileName = (TextView)convertView.findViewById(R.id.title);
            holder.publishedDate = (TextView)convertView.findViewById(R.id.date);
            holder.publishedBy = (TextView)convertView.findViewById(R.id.published_by);
            convertView.setTag(holder);
        } else
            holder = (ViewHolder)convertView.getTag();

        holder.fileName.setText(mms.getFileName());
        holder.publishedDate.setText(StringUtils.getInstance().dateSeperate(mms.getUpdatedDate()));
        holder.publishedBy.setText(mms.getPublishedBy());

        holder.audioLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(context instanceof ReceivedMMSActivity ) {
                    if(!ReceivedMMSActivity.clicked) {

                        String streamingUrl = AWS_BASE_URL + mms.getSchoolId() + "/" + mms.getDownloadLink();
                        new AudioPlayer().playAudio(streamingUrl, mms.getFileName(), inflater, context);
                    }
                } else {
                    String streamingUrl = AWS_BASE_URL + mms.getSchoolId() + "/" + mms.getDownloadLink();
                    new AudioPlayer().playAudio(streamingUrl, mms.getFileName(), inflater, context);
                }
            }
        });
        return convertView;
    }

    public void audioPlayer(String streamingUrl, String fileName, LayoutInflater inflater) {
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

        final SeekBar seekBarProgress = (SeekBar)alertDialog.findViewById(R.id.SeekBarTestPlay);
        seekBarProgress.setMax(99); // It means 100% .0-99

        try {
            mediaPlayer.setDataSource(streamingUrl);// setup song from http://www.hrupin.com/wp-content/uploads/mp3/testsong_20_sec.mp3 URL to mediaplayer data source

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

                mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                    @Override
                    public void onPrepared(MediaPlayer mediaPlayer) {
                        prepared = true;
                        mediaFileLengthInMilliseconds = mediaPlayer.getDuration(); // gets the song length in milliseconds from URL
                        String audioLength = StringUtils.getInstance().millsecondToDuration(mediaFileLengthInMilliseconds);
                        duration.setText(audioLength);

                        mediaPlayer.start();
                        primarySeekBarProgressUpdater(seekBarProgress, mediaPlayer, handler);
                    }
                });
                if(prepared) {
                    mediaFileLengthInMilliseconds = mediaPlayer.getDuration(); // gets the song length in milliseconds from URL
                    String audioLength = StringUtils.getInstance().millsecondToDuration(mediaFileLengthInMilliseconds);
                    duration.setText(audioLength);

                    mediaPlayer.start();
                    primarySeekBarProgressUpdater(seekBarProgress, mediaPlayer, handler);
                } else
                    mediaPlayer.prepareAsync();
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

    public void primarySeekBarProgressUpdater(final SeekBar seekBarProgress, final MediaPlayer mediaPlayer, final Handler handler) {
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

    private class ViewHolder {
        TextView fileName;
        TextView publishedBy;
        TextView publishedDate;
        RelativeLayout audioLayout;
    }
}
