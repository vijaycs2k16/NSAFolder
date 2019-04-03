package nexrise.publication.in.nexrise.HomeworkFeature;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Conversation;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by karthik on 17-03-2017.
 */

public class AllCommentsArrayAdapter extends BaseAdapter {

    Activity context;
    List<ArrayList<Conversation>> conversationList;

    public AllCommentsArrayAdapter(Activity context, List<ArrayList<Conversation>> conversationList) {
        this.context = context;
        this.conversationList = conversationList;
    }

    @Override
    public int getCount() {
        return conversationList.size();
    }

    @Override
    public Object getItem(int position) {
        return conversationList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder = new ViewHolder();
        List<Conversation> conversations = conversationList.get(position);

        if(convertView == null) {
            LayoutInflater inflater = context.getLayoutInflater();
            convertView = inflater.inflate(R.layout.fragment_comment_page_layout, parent, false);
            holder.admissionNo = (TextView)convertView.findViewById(R.id.student_id);
            holder.username = (TextView)convertView.findViewById(R.id.student_name);
            holder.message = (TextView)convertView.findViewById(R.id.comments);
            holder.date = (TextView)convertView.findViewById(R.id.posted_time);
            holder.className = (TextView)convertView.findViewById(R.id.class_name);
            holder.sectionName = (TextView)convertView.findViewById(R.id.section_name);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }
        // Get the last message
        Conversation conversation = conversations.get(conversations.size()-1);

        holder.admissionNo.setText(conversations.get(0).getAdmission_no());
        holder.username.setText(conversations.get(0).getName());
        holder.message.setText(conversation.getMessage());
        holder.date.setText(new StringUtils().timeSet(conversation.getMessage_date()));
        if(conversations.get(position).getClass_name()!= null && conversations.get(position).getSection_name() != null) {
            holder.className.setText(conversations.get(position).getClass_name());
            holder.sectionName.setText(conversations.get(position).getSection_name());
        }
        return convertView;
    }

    private class ViewHolder {
        TextView admissionNo;
        TextView username;
        TextView message;
        TextView date;
        TextView className;
        TextView sectionName;
    }
}
