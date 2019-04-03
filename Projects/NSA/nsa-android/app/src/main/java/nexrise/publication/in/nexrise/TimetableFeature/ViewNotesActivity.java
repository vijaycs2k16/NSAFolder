package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import nexrise.publication.in.nexrise.Common.AttachmentPreviewActivity;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.AttachmentActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class ViewNotesActivity extends AppCompatActivity implements Constants {

    String[] list;
    final int ATTACHMENT = 10;
    final int CALLBACK_WITH_JSON = 15;
    Intent intent;
    RelativeLayout progressBarLayout;
    ProgressBar progressBar;
    TextView noContent;
    HashMap<String, String> attachmentObjects = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_notes);
        ActionBar actionBar = getSupportActionBar();
        progressBarLayout = (RelativeLayout) findViewById(R.id.progress_bar);
        progressBar = (ProgressBar)findViewById(R.id.loading_bar);
        noContent = (TextView) findViewById(R.id.no_content);
        noContent.setVisibility(View.VISIBLE);
        intent = getIntent();

        String title = "Notes";
        if(intent.hasExtra(ACTIONBAR_TITLE))
            title = intent.getStringExtra(ACTIONBAR_TITLE);

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.notes);
        }

        String id = intent.hasExtra(UPLOAD_ID) ? intent.getStringExtra(UPLOAD_ID) : "";

        final GridView gridView = (GridView)findViewById(R.id.gridview);

        if (intent.hasExtra(UPLOADED_IMAGES)) {
            HashMap<String, String> attachments = (HashMap<String, String>) intent.getSerializableExtra(UPLOADED_IMAGES);
            List<Map.Entry<String, String>> attachmentList = new ArrayList<>(attachments.entrySet());
            AttachmentsArrayAdapter gridAdapter = new AttachmentsArrayAdapter(this, attachmentList, id);
            
            gridView.setAdapter(gridAdapter);
            gridViewClick(gridView);
            if(noContent.getVisibility() == View.VISIBLE)
                noContent.setVisibility(View.INVISIBLE);
        } else if (intent.hasExtra("Calendar")) {
            String classId = intent.getStringExtra("classId");
            String sectionId = intent.getStringExtra("sectionId");
            String selectedDate = intent.getStringExtra("selected");
            String dayId = intent.getStringExtra("dayId");
            String notesCredential = BASE_URL + API_VERSION_ONE + TIMETABLE + NOTES + classId + "/" + sectionId + "/" + dayId + "?date=" + selectedDate;
            GETUrlConnection notesUrl = new GETUrlConnection(ViewNotesActivity.this, notesCredential,null) {

                @Override
                protected void onPreExecute() {
                    super.onPreExecute();
                    progressBarLayout.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.VISIBLE);
                    if(noContent.getVisibility() == View.VISIBLE)
                        noContent.setVisibility(View.INVISIBLE);
                }
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    Log.v("view ","notes  "+response);
                    progressBar.setVisibility(View.INVISIBLE);
                    try {
                        StringUtils utils = new StringUtils();
                        utils.checkSession(response);
                        progressBarLayout.setVisibility(View.GONE);
                        HashMap<String, String> attachments = attachmentParser(response);
                        List<Map.Entry<String, String>> attachmentList = new ArrayList<>(attachments.entrySet());
                        if (!attachmentList.isEmpty() && attachmentList.size() != 0) {
                            AttachmentsArrayAdapter gridAdapter = new AttachmentsArrayAdapter(ViewNotesActivity.this, attachmentList, "");
                            gridView.setAdapter(gridAdapter);
                            gridViewClick(gridView);
                        } else
                            throw new JSONException("Empty Json");
                    } catch (JSONException | NullPointerException e) {
                        if(progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() == View.INVISIBLE)
                            progressBarLayout.setVisibility(View.VISIBLE);
                        if(noContent.getVisibility() == View.INVISIBLE || noContent.getVisibility() == View.GONE)
                            noContent.setVisibility(View.VISIBLE);
                    } catch (SessionExpiredException e) {
                        e.handleException(ViewNotesActivity.this);
                    }
                }
            };
            notesUrl.execute();
        } else if(intent.hasExtra("Files")){
            HashMap<String, String> attachments = (HashMap<String, String>) intent.getSerializableExtra("Files");
            List<Map.Entry<String, String>> attachmentList = new ArrayList<>(attachments.entrySet());
            AttachmentsArrayAdapter gridAdapter = new AttachmentsArrayAdapter(ViewNotesActivity.this, attachmentList, "");
            gridView.setAdapter(gridAdapter);
            gridViewClick(gridView);
            if(noContent.getVisibility() == View.VISIBLE)
                noContent.setVisibility(View.INVISIBLE);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        StringUtils utils = new StringUtils();
        String permission = "";
        if(intent.hasExtra(PERMISSIONS))
            permission = utils.getPermission(this, intent.getStringExtra(PERMISSIONS));
        if(intent.hasExtra(JSON)) {
            if(permission.isEmpty() || (permission.contains("manage") || permission.contains("manageAll")))
                getMenuInflater().inflate(R.menu.upload_images, menu);
        }
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                Intent backPress = new Intent();

                if(attachmentObjects != null)  backPress.putExtra("AttachmentObject", attachmentObjects);

                setResult(RESULT_CANCELED, backPress);
                finish();
                break;
            case R.id.upload:
                Intent uploadAttachment = new Intent(this, AttachmentActivity.class);
                if(intent.hasExtra(ID) && intent.hasExtra(UPLOAD_ID) && intent.hasExtra(URL)) {
                    uploadAttachment.putExtra(URL, intent.getStringExtra(URL));
                    uploadAttachment.putExtra(JSON, intent.getSerializableExtra(JSON));
                    uploadAttachment.putExtra(HEADER, intent.getStringExtra(HEADER));
                    uploadAttachment.putExtra(ID, intent.getStringExtra(ID));
                    uploadAttachment.putExtra(UPLOAD_ID, intent.getStringExtra(UPLOAD_ID));

                    if(intent.hasExtra(FROM) && intent.getStringExtra(FROM).equals("TimeTable"))
                        startActivityForResult(uploadAttachment, ATTACHMENT);
                    else
                        startActivityForResult(uploadAttachment, CALLBACK_WITH_JSON);
                }
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    public void removeAttachments(Map.Entry<String, String> attachmentObj) {
        if(intent == null) intent = getIntent();

        if(!intent.hasExtra(UPLOADED_IMAGES)) return;
        attachmentObjects = (HashMap<String, String>) intent.getSerializableExtra(UPLOADED_IMAGES);
        attachmentObjects.remove(attachmentObj.getKey());
        Log.v("Attachment Obj ","size "+attachmentObjects.size());
    }

    public void gridViewClick(final GridView gridView){
        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Map.Entry<String, String> item = (Map.Entry<String, String>)gridView.getItemAtPosition(position);
                String imageUrl = item.getKey();
                Intent preview = new Intent(ViewNotesActivity.this, AttachmentPreviewActivity.class);
                preview.putExtra("Image", imageUrl);
                startActivity(preview);
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode){
            case ATTACHMENT:
                if(resultCode == RESULT_OK) {
                    finish();
                    TeacherTodayTimeTable.rendered = false;
                }
                break;
            case CALLBACK_WITH_JSON:
                if(resultCode == RESULT_OK) {
                    Intent intent = new Intent();
                    intent.putExtra(UPLOADED_IMAGES, data.getSerializableExtra(UPLOADED_IMAGES));
                    intent.putExtra("attachmentAry", data.getStringExtra("attachmentAry"));
                    setResult(RESULT_OK, intent);
                    finish();
                }
                break;
        }
    }

    public HashMap<String, String> attachmentParser(String response) throws JSONException {
        JSONObject json = new JSONObject(response);
        JSONArray dataArray = json.getJSONArray(DATA);
        HashMap<String, String> attachments = new HashMap<>();
        if(dataArray.length() > 0 ) {
            for (int i = 0; i < dataArray.length(); i++) {
                JSONObject data = dataArray.getJSONObject(i);
                JSONObject attachmentObj = data.getJSONObject("attachments");
                JSONObject attachment = attachmentObj.getJSONObject("attachment");
                Iterator iterator = attachment.keys();
                while (iterator.hasNext()) {
                    String key = iterator.next().toString();
                    attachments.put(key, attachment.getString(key));
                }
            }
        } else {
            throw new JSONException("Empty Json array");
        }
        return attachments;
    }
}