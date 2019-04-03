package nexrise.publication.in.nexrise.ParentFeatures.HomeworkFeature;

import android.content.Context;
import android.content.Intent;
import android.graphics.Point;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ParentHomeWork;
import nexrise.publication.in.nexrise.BeanClass.Subject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.HomeworkFeature.DetailsFragmentArrayAdapter;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.ViewNotesActivity;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class ParentDetailsActivity extends AppCompatActivity implements Constants{

    int index = 0;
    ParentHomeWork homeWorkList;
    Point p;
    String priority;
    ArrayList<String> homeworkarray;
    StringUtils stringUtils;

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_parent_details);
        ListView listView = (ListView) findViewById(R.id.details_listview);
        final Intent intent = getIntent();
        /*String jsonString = preferences.getString("parentJson",null);*/
        index = intent.getExtras().getInt("Index");
        stringUtils = new StringUtils();
        homeWorkList = (ParentHomeWork) intent.getSerializableExtra("ListData");
        StringUtils.assignmentId = homeWorkList.getAssignmentId();

        List<String> key = new ArrayList<String>();
        key.add((String) getResources().getText(R.string.title));
        key.add((String) getResources().getText(R.string.classes));
        key.add((String) getResources().getText(R.string.section));
        key.add((String) getResources().getText(R.string.subject));
        key.add((String) getResources().getText(R.string.due_date));
        key.add((String) getResources().getText(R.string.employee));
        //key.add("Priority");
        /*if (homeWorkList.getAssignmentDesc() != null && !homeWorkList.getAssignmentDesc().isEmpty() && !homeWorkList.getAssignmentDesc().equals("null"))
            key.add("Description");*/
        homeworkarray = new ArrayList<String>();
        homeworkarray.add(homeWorkList.getAssignmentName());
        homeworkarray.add(homeWorkList.getClassName());
        homeworkarray.add(homeWorkList.getSectionName());
        ArrayList<Subject> selectedSubjectList = new ArrayList<>();
        selectedSubjectList = homeWorkList.getSubjectArrayList();
        String subjectNames = "";
        if(selectedSubjectList.size() !=0) {
            for (int i = 0; i < (selectedSubjectList.size() - 1); i++)
                subjectNames += selectedSubjectList.get(i).getSubName() + ",";
            subjectNames += selectedSubjectList.get(selectedSubjectList.size() - 1).getSubName() + ".";
        }
        homeworkarray.add(subjectNames);
        String dueDate = stringUtils.Dateset(homeWorkList.getDueDate());

        homeworkarray.add(dueDate);
        homeworkarray.add(homeWorkList.getUpdatedUserName());
        //homeworkarray.add(new StringUtils().setPriority(homeWorkList.getPriority()));
        if (homeWorkList.getAssignmentDesc() != null && !homeWorkList.getAssignmentDesc().isEmpty() && !homeWorkList.getAssignmentDesc().equals("null")) {
            final View footer = ParentDetailsActivity.this.getLayoutInflater().inflate(R.layout.description_footer, listView, false);
            listView.addFooterView(footer);
            TextView description = (TextView) footer.findViewById(R.id.desc);
            description.setText(String.valueOf(homeWorkList.getAssignmentDesc()));
        }

        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.homework_details);
        }


        if(homeWorkList.getAttachments()!= null && !homeWorkList.getAttachments().isEmpty()) {
            final View footerView = ParentDetailsActivity.this.getLayoutInflater().inflate(R.layout.attachment_footer, listView, false);
            listView.addFooterView(footerView);
            TextView attachNumber = (TextView) footerView.findViewById(R.id.attach_value);
            attachNumber.setText(String.valueOf(homeWorkList.getAttachments().size()));
            footerView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent attach = new Intent(ParentDetailsActivity.this, ViewNotesActivity.class);
                    HashMap<String, String> attachments = new HashMap<String, String>();
                    for (int i = 0; i < homeWorkList.getAttachments().size(); i++) {
                        String imageUrl = homeWorkList.getAttachments().get(i).getId();
                        String fileName = homeWorkList.getAttachments().get(i).getFileName();
                        attachments.put(imageUrl, fileName);
                    }
                    attach.putExtra("Files", attachments);
                    attach.putExtra(FROM, "ParentDetails");
                    startActivity(attach);
                }
            });
        }

        final View footer = ParentDetailsActivity.this.getLayoutInflater().inflate(R.layout.completed_button,listView,false);
        listView.addFooterView(footer);
        /*Button informStatus = (Button) findViewById(R.id.deny);
        informStatus.setText("Inform Status");
        ((GradientDrawable)informStatus.getBackground()).setColor(color);
        informStatus.setVisibility(View.INVISIBLE); */

        final Button finish = (Button) findViewById(R.id.completed);
        try {
            completedButton(dueDate, finish);
        } catch (Exception e) {
            e.printStackTrace();
        }
        /*LinearLayout buttonvisibility = (LinearLayout) findViewById(R.id.buttonvisibility);
        buttonvisibility.setVisibility(View.VISIBLE);*/
        if (homeWorkList.getIsSubmitted().equalsIgnoreCase("Submitted")){
            finish.setVisibility(View.GONE);
        }
        DetailsFragmentArrayAdapter arrayAdapter = new DetailsFragmentArrayAdapter(ParentDetailsActivity.this, key, homeworkarray);
        listView.setAdapter(arrayAdapter);

        /*informStatus.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent parentCommentActivity = new Intent(ParentDetailsActivity.this,ParentCommentActivity.class);
                parentCommentActivity.putExtra("Assignment",homeWorkList);
                startActivity(parentCommentActivity);
                overridePendingTransition(R.anim.left_to_right_anim, R.anim.exit_animation);
            }
        });*/
    }

    private void completedButton(String dueDate, Button finish) throws Exception {
        finish.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                JSONObject submitted = new JSONObject();
                try {
                    submitted.put("isSubmitted", "true");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                String submitstatus = BASE_URL + API_VERSION_ONE + ASSIGNMENT + DETAILS + STATUS + "/" + homeWorkList.getId()+"?assignment_id="+ homeWorkList.getAssignmentId();
                UPDATEUrlConnection urlConnection = new UPDATEUrlConnection(ParentDetailsActivity.this, submitstatus, null, submitted) {
                    @Override
                    protected void onPostExecute(String success) {
                        super.onPostExecute(success);
                        Log.v("submit","status"+success);
                        try {
                            if (success != null) {
                                stringUtils.checkSession(success);
                                Toast.makeText(ParentDetailsActivity.this, R.string.homework_submited, Toast.LENGTH_LONG).show();
                                Intent parentHomeworkFragment = new Intent();
                                parentHomeworkFragment.putExtra("Assignment ID", homeWorkList.getId());
                                setResult(RESULT_OK, parentHomeworkFragment);
                                finish();
                            }else {
                                Toast.makeText(ParentDetailsActivity.this, R.string.homework_not_submited, Toast.LENGTH_LONG).show();
                            }
                        } catch (SessionExpiredException e) {
                            e.handleException(ParentDetailsActivity.this);
                        }
                    }
                };
                urlConnection.execute();
            }
        });

        Date completeDate = stringUtils.convertStringToDate(dueDate);
        String completes = stringUtils.dateAndMonth(completeDate.toString());
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);

        Date today = calendar.getTime();

        String todays = stringUtils.dateAndMonth(today.toString());

        if(!completes.equals(todays) && completeDate.before(today)) {
            finish.setClickable(false);
            finish.getBackground().setColorFilter(null);
            finish.getBackground().setColorFilter(getResources().getColor(R.color.colorLightGrey), PorterDuff.Mode.MULTIPLY);
            finish.setEnabled(false);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        StringUtils.assignmentId = "";
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
