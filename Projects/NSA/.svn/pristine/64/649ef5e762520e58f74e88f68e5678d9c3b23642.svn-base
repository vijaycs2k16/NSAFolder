package nexrise.publication.in.nexrise.Attendence;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.LeaveApproval;
import nexrise.publication.in.nexrise.BeanClass.LeaveDetails;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;

/**
 * Created by praga on 24-May-17.
 */

public class ApprovalDetailsAdapter extends BaseExpandableListAdapter implements Constants {
    private Activity context;
    private List<LeaveDetails> listData;

    public ApprovalDetailsAdapter(Activity context, List<LeaveDetails> listData) {
        this.context = context;
        this.listData = listData;
    }

    @Override
    public Object getChild(int groupPosition, int childPosition) {
        return listData.get(groupPosition).getData().get(childPosition);
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return childPosition;
    }

    @Override
    public View getChildView(int groupPosition, int childPosition, boolean isLastChild,
                             View convertView, ViewGroup parent) {

        LeaveApproval dataMember = (LeaveApproval) getChild(groupPosition, childPosition);

        if(convertView == null){
            LayoutInflater inflater = (LayoutInflater)this.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.approval_history_list, null);
        }
        ImageView imageView = (ImageView) convertView.findViewById(R.id.not_complete);
        TextView textView = (TextView)convertView.findViewById(R.id.text1);
        TextView badgeText = (TextView)convertView.findViewById(R.id.text2);

        if(dataMember.getRemainingLeaves() != null && !dataMember.getRemainingLeaves().isEmpty()) {
            textView.setText(dataMember.getLeaveTypeName());
            badgeText.setText(dataMember.getRemainingLeaves());
            badgeText.setTextColor(Color.BLACK);
            imageView.setVisibility(View.INVISIBLE);

        } else {
            if (dataMember.getStatus().equalsIgnoreCase(DENY)) {
                badgeText.setText(R.string.denied);
                badgeText.setTextColor(Color.RED);
                imageView.setVisibility(View.INVISIBLE);
            } else if (dataMember.getStatus().equalsIgnoreCase(APPROVED)){
                imageView.setVisibility(View.INVISIBLE);
                badgeText.setText(R.string.approved);
                badgeText.setTextColor(Color.GREEN);
            }else if (dataMember.getStatus().equalsIgnoreCase(CANCELLED)){
                badgeText.setText(R.string.cancelled);
                badgeText.setTextColor(Color.RED);
                imageView.setVisibility(View.INVISIBLE);
            }else {
                badgeText.setText(R.string.pending);
                badgeText.setTextColor(Color.BLACK);
                imageView.setImageResource(R.drawable.ic_arrow_right);
                imageView.setVisibility(View.VISIBLE);
            }
            textView.setText(dataMember.getFromDate() + " - " + dataMember.getToDate());

        }

        return convertView;
    }

    @Override
    public int getChildrenCount(int groupPosition) {

        int childCount = 0;
        try {
            childCount = listData.get(groupPosition).getData().size();
        }
        catch (NullPointerException e) {
            return childCount;
        }
        return childCount;

    }

    @Override
    public Object getGroup(int groupPosition) {
        return listData.get(groupPosition);
    }

    @Override
    public int getGroupCount() {
        return listData.size();
    }

    @Override
    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    @Override
    public View getGroupView(int groupPosition, boolean isLastChild, View convertView,
                             ViewGroup parent) {
        LeaveDetails leaveDetails = (LeaveDetails)getGroup(groupPosition);

        if(convertView == null){
            LayoutInflater inflater = (LayoutInflater)this.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.fragment_status_list_group, parent, false);
        }
        LinearLayout linearLayout = (LinearLayout) convertView.findViewById(R.id.layout_header);
        linearLayout.setBackgroundColor(Color.parseColor("#dfdfdf"));
        ImageView imageView1 = (ImageView) convertView.findViewById(R.id.list_group_icon);
        imageView1.setVisibility(View.GONE);
        TextView textView = (TextView)convertView.findViewById(R.id.listgroup_textview);
        textView.setText(leaveDetails.getName());

        ImageView imageView = (ImageView)convertView.findViewById(R.id.list_group_expand_icon);

        Log.v("Group ","position "+getChildrenCount(groupPosition));
        if(isLastChild && getChildrenCount(groupPosition) != 0) {
            imageView.setImageResource(R.drawable.ic_arrow_up_circle);
        } else if (getChildrenCount(groupPosition) != 0) {
            imageView.setImageResource(R.drawable.ic_arrow_down_circle);
        } else {
            imageView.setImageDrawable(null);
        }
        return convertView;
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }

    @Override
    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }
}