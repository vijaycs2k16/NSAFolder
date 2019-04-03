package nexrise.publication.in.nexrise.TimetableFeature;

import android.app.Activity;
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

import java.util.HashMap;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.TimeTableObject;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

/**
 * Created by Sai Deepak on 06-Oct-16.
 */

class AddTodayTimeTableArrayAdapter extends ArrayAdapter<TimeTableObject> implements Constants {

    Activity context;
    private String day;
    private String userRole;
    private String username;
    private String permission;

    AddTodayTimeTableArrayAdapter(Activity context, List<TimeTableObject> timeTableObjects, String day) {
        super(context, R.layout.listview_row, timeTableObjects);
        this.context = context;
        this.day = day;
        StringUtils utils = new StringUtils();
        userRole = utils.getUserRole(context);
        permission = utils.getPermission(context, "create_timetable");
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
        username = preferences.getString(FIRST_NAME, null);
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        final TimeTableObject timeTableObject = getItem(position);
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.listview_row, parent, false);
            holder.teacherText = (TextView) convertView.findViewById(R.id.teacherRow);
            holder.subjectText = (TextView) convertView.findViewById(R.id.subjectRow);
            holder.time = (TextView) convertView.findViewById(R.id.timings);
            holder.attachment = (LinearLayout)convertView.findViewById(R.id.time_table_linear);
            holder.badge = (FrameLayout)convertView.findViewById(R.id.badge_layout);
            holder.attachmentCount = (TextView)convertView.findViewById(R.id.badge_text);
            convertView.setTag(holder);
        } else
            holder = (ViewHolder)convertView.getTag();

        assert timeTableObject != null;
        holder.teacherText.setText(timeTableObject.getEmployeeName());
        holder.subjectText.setText(timeTableObject.getSubjectName());
        holder.time.setText(new StringUtils().periodTime(timeTableObject.getPeriodStartTime()) + " - \n" + new StringUtils().periodTime(timeTableObject.getPeriodEndTime()));

        final HashMap<String, String> attachments = timeTableObject.getAttachments();
        String values = Utility.readProperty(getContext(), DISABLE_NOTES);
        if (values.contains(ACCESS_ID))
            removeNotes(holder);
        else {
            if (userRole.equalsIgnoreCase(PARENT))
                parentClickHandler(attachments, holder);
            else if (userRole.equalsIgnoreCase(EMPLOYEE))
                employeeClickHandler(attachments, holder, timeTableObject);
        }
        return convertView;
    }

    private class ViewHolder {
        TextView teacherText;
        TextView subjectText;
        TextView time;
        LinearLayout attachment;
        FrameLayout badge;
        TextView attachmentCount;
    }
    private void parentClickHandler(final HashMap<String, String> attachments, ViewHolder holder) {
        if(day.equals("Today") && !attachments.isEmpty()) {
                holder.attachment.setVisibility(View.VISIBLE);
                holder.badge.setVisibility(View.VISIBLE);
                holder.attachmentCount.setText(String.valueOf(attachments.size()));
                holder.attachment.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent viewNotes = new Intent(context, ViewNotesActivity.class);
                        viewNotes.putExtra(UPLOADED_IMAGES, attachments);
                        context.startActivity(viewNotes);
                    }
                });
        } else if(day.equals("Today") && attachments.isEmpty()) {
            holder.attachment.setVisibility(View.INVISIBLE);
            holder.badge.setVisibility(View.INVISIBLE);
        } else {
            holder.attachment.setVisibility(View.GONE);
            holder.badge.setVisibility(View.GONE);
        }
    }

    private void employeeClickHandler(final HashMap<String, String> attachments, ViewHolder holder, TimeTableObject timeTableObject) {
        if(day.equals("Today") && !attachments.isEmpty()) {
                holder.attachment.setVisibility(View.VISIBLE);
                holder.badge.setVisibility(View.VISIBLE);
                holder.attachmentCount.setText(String.valueOf(attachments.size()));
                if (permission.contains("view") && username.equalsIgnoreCase(timeTableObject.getEmployeeName())) {
                    holder.attachment.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            Intent viewNotes = new Intent(context, ViewNotesActivity.class);
                            viewNotes.putExtra(UPLOADED_IMAGES, attachments);
                            context.startActivity(viewNotes);
                        }
                    });
                } else if (permission.contains("viewAll") && permission.contains("manage") || permission.contains("manageAll")) {
                    holder.attachment.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            Intent viewNotes = new Intent(context, ViewNotesActivity.class);
                            viewNotes.putExtra(UPLOADED_IMAGES, attachments);
                            context.startActivity(viewNotes);
                        }
                    });
                } else
                    Toast.makeText(context, R.string.dont_have_permission_access, Toast.LENGTH_SHORT).show();
        } else if(day.equals("Today") && attachments.isEmpty()) {
            holder.attachment.setVisibility(View.INVISIBLE);
            holder.badge.setVisibility(View.INVISIBLE);
        } else {
            holder.attachment.setVisibility(View.GONE);
            holder.badge.setVisibility(View.GONE);
        }
    }
    private void removeNotes(ViewHolder holder) {
        holder.attachment.setVisibility(View.GONE);
        holder.badge.setVisibility(View.GONE);
        holder.attachmentCount.setVisibility(View.GONE);
    }
}
