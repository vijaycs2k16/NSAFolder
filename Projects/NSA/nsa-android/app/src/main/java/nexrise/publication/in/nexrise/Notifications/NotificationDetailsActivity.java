package nexrise.publication.in.nexrise.Notifications;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import nexrise.publication.in.nexrise.BeanClass.ImageDetails;
import nexrise.publication.in.nexrise.BeanClass.LoginObject;
import nexrise.publication.in.nexrise.BeanClass.Notify;
import nexrise.publication.in.nexrise.Common.AttachmentPreviewActivity;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.Gallery.GalleryGridAdapter;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class NotificationDetailsActivity extends AppCompatActivity implements Constants{

    LoginObject userObject;
    TextView status;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notification_details);

        Intent intent = getIntent();
        Bundle bundle = intent.getBundleExtra(BUNDLE);
        Notify notification = (Notify) bundle.getSerializable(NOTIFICATION_OBJECT);
        String fromActivity = intent.getStringExtra(FROM_ACTIVITY);
        String actionbarTitle = intent.getStringExtra(ACTIONBAR_TITLE);

        TextView date = (TextView) findViewById(R.id.date);
        TextView time = (TextView) findViewById(R.id.time);
        TextView publisher = (TextView) findViewById(R.id.publisher);
        TextView description = (TextView) findViewById(R.id.description);
        status = (TextView) findViewById(R.id.status);
        TextView title = (TextView) findViewById(R.id.title);

        assert notification != null;
        title.setText(notification.getPushTemplateTitle());
        publisher.setText(notification.getUpdatedUsername());
        description.setText(notification.getPushTemplateMessage());
        String dates = notification.getUpdatedDate();

        date.setText(new StringUtils().Dateset(dates));
        time.setText(new StringUtils().timeSet(dates));

        if(fromActivity.equals("NotificationLogActivity")) {
            status.setVisibility(View.INVISIBLE);
        } else {
            status.setText(notification.getPriority());
            if (notification.getStatus().equals(DRAFT)) {
                status.setBackgroundColor(Color.parseColor("#FFCC00"));
                status.setTextColor(Color.WHITE);
                status.setText(DRAFT);
            } else {
                status.setBackgroundColor(Color.parseColor("#31A231"));
                status.setTextColor(Color.WHITE);
                status.setText(SENT);
            }
        }

        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);

            if(actionbarTitle != null)
                actionBar.setTitle(actionbarTitle);
        }
        handleAttachments(notification.getAttachments());
    }

    private void handleAttachments(HashMap<String, String> attachments) {
        ArrayList<ImageDetails> imageList = new ArrayList<>();
        final GridView grid = (GridView)findViewById(R.id.attachment_gridview);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String schoolId = preferences.getString(SCHOOL_ID, "");

        if(attachments != null) {
            List<Map.Entry<String, String>> images = new ArrayList<>(attachments.entrySet());

            for (int i = 0; i < images.size(); i++) {
                ImageDetails imageDetails = new ImageDetails();

                String fileUrl =  images.get(i).getKey();
                imageDetails.setFile_url(fileUrl);
                imageDetails.setFileName(images.get(i).getValue());
                String extension = fileUrl.substring(fileUrl.lastIndexOf("."));
                imageDetails.setFile_type(extension);
                imageList.add(imageDetails);
            }
            GalleryGridAdapter gridAdapter = new GalleryGridAdapter(NotificationDetailsActivity.this,R.layout.fragment_videos_grid_layout, imageList);
            grid.setAdapter(gridAdapter);

            grid.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                    ImageDetails imageDetails = (ImageDetails) grid.getItemAtPosition(i);
                    String imageUrl = imageDetails.getFile_url();
                    Intent preview = new Intent(NotificationDetailsActivity.this, AttachmentPreviewActivity.class);
                    preview.putExtra("Image", imageUrl);
                    startActivity(preview);
                }
            });
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }
}
