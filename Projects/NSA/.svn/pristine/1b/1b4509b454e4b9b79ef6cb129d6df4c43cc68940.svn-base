package nexrise.publication.in.nexrise.TimetableFeature;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import nexrise.publication.in.nexrise.BeanClass.TeacherTimeTable;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.AttachmentActivity;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

/**
 * Created by Sai Deepak on 12-Oct-16.
 */

class AddTeacherTodayArrayAdpter extends ArrayAdapter<TeacherTimeTable> implements Constants {

    Activity context;
    private String day;
    StringUtils utils;
    AddTeacherTodayArrayAdpter(Activity context, List<TeacherTimeTable> timeTableObjects, String day) {
        super(context, R.layout.listview_row, timeTableObjects);
        this.context = context;
        this.day = day;
        utils = new StringUtils();
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {

        final TeacherTimeTable timeTableObject = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();

        if(convertView == null) {
            convertView = inflater.inflate(R.layout.listview_row, parent, false);
            holder.teacherText = (TextView) convertView.findViewById(R.id.teacherRow);
            holder.subjectText = (TextView) convertView.findViewById(R.id.subjectRow);
            holder.time = (TextView) convertView.findViewById(R.id.timings);
            holder.badgeLayout = (FrameLayout)convertView.findViewById(R.id.badge_layout);
            holder.addAttachment = (LinearLayout) convertView.findViewById(R.id.time_table_linear);
            holder.badgeText =(TextView) convertView.findViewById(R.id.badge_text);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }

        assert timeTableObject != null;
        holder.teacherText.setText(timeTableObject.getClassCode() + "-" + timeTableObject.getSectionName());
        holder.subjectText.setText(timeTableObject.getSubjectName());
        holder.time.setText(utils.periodTime(timeTableObject.getPeriodStartTime())+" -\n" + utils.periodTime(timeTableObject.getPeriodEndTime()));
        holder.badgeLayout.setVisibility(View.GONE);

        if(day.equals("Today")) {

            String values = Utility.readProperty(getContext(), DISABLE_NOTES);
            if(values.contains(ACCESS_ID)) {
                holder.addAttachment.setVisibility(View.GONE);
            }else{
                holder.addAttachment.setVisibility(View.VISIBLE);
                HashMap<String, String> attachments = timeTableObject.getAttachment();
                if (!attachments.isEmpty()) {
                    holder.badgeLayout.setVisibility(View.VISIBLE);
                    holder.badgeText.setText(String.valueOf(attachments.size()));
                }
            }
            holder.addAttachment.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    HashMap<String, String> attachments = timeTableObject.getAttachment();
                    HashMap<String, String> json = jsonBody(context, timeTableObject);
                    String url = BASE_URL + API_VERSION_ONE + TIMETABLE + NOTES;

                    if(attachments.isEmpty()) {
                        String permission = utils.getPermission(context, "create_timetable");
                        if(permission.contains("manage") || permission.contains("manageAll")) {
                            Intent attachment = new Intent(context, AttachmentActivity.class);
                            attachment.putExtra("Timetable", timeTableObject);
                            attachment.putExtra("Json", json);
                            attachment.putExtra(URL, url);
                            attachment.putExtra(ID, CREATE_TIMETABLE);
                            attachment.putExtra(UPLOAD_ID, timeTableObject.getId());
                            context.startActivity(attachment);
                        } else
                            Toast.makeText(context, R.string.dont_have_permission_upload_note, Toast.LENGTH_SHORT).show();
                    } else {
                        Intent viewNotes = new Intent(context, ViewNotesActivity.class);
                        viewNotes.putExtra(UPLOADED_IMAGES, attachments);
                        viewNotes.putExtra(URL, url);
                        viewNotes.putExtra(FROM, "TimeTable");
                        viewNotes.putExtra("Json", json);
                        viewNotes.putExtra(ID, CREATE_TIMETABLE);
                        viewNotes.putExtra(PERMISSIONS, "create_timetable");
                        viewNotes.putExtra(UPLOAD_ID, timeTableObject.getId());
                        context.startActivity(viewNotes);
                    }
                }
            });
        } else {
            holder.addAttachment.setVisibility(View.GONE);
        }
        return convertView;
    }

    private HashMap<String, String> jsonBody(Context context, TeacherTimeTable teacherTimeTable) {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);

        Calendar calendar = Calendar.getInstance();
        String dayLongName = calendar.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.getDefault());
        String dayId = utils.dayId(dayLongName);

        Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String currentDay = dateFormat.format(now);

        HashMap<String, String> uploadBody = new HashMap<>();
        uploadBody.put("classId", teacherTimeTable.getClassId());
        uploadBody.put("sectionId", teacherTimeTable.getSectionId());
        uploadBody.put("periodId", teacherTimeTable.getPeriodId());
      //  uploadBody.put("subjectId", teacherTimeTable.getSubjectId());
        uploadBody.put("empId", preferences.getString(CURRENT_USERNAME, null));
        uploadBody.put("dayId", dayId);
        uploadBody.put("start", currentDay);
        uploadBody.put("tagName", teacherTimeTable.getSubjectName() + " notes");
        uploadBody.put("desc", "");
        uploadBody.put("uploadId",teacherTimeTable.getId());
        return uploadBody;
    }

    private class ViewHolder {
        TextView teacherText;
        TextView subjectText;
        TextView time;
        FrameLayout badgeLayout;
        LinearLayout addAttachment;
        TextView badgeText;
    }
}
