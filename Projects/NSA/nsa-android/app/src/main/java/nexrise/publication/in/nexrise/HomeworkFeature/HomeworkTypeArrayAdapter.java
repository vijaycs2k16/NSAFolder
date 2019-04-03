package nexrise.publication.in.nexrise.HomeworkFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.HomeworkType;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 13-03-2017.
 */

public class HomeworkTypeArrayAdapter extends ArrayAdapter<HomeworkType> {
    Activity context;
    int resource;
    public HomeworkTypeArrayAdapter(Activity context, int resource, List<HomeworkType> homeworkTypes) {
        super(context, resource, homeworkTypes);
        this.context = context;
        this.resource = resource;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        HomeworkType homeworkType = getItem(position);

        if(convertView == null) {
           convertView =  inflater.inflate(resource, parent, false);
            holder.homeworkType = (TextView)convertView.findViewById(R.id.drawer_textview);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder)convertView.getTag();
        }

        assert homeworkType != null;
        holder.homeworkType.setText(homeworkType.getName());
        return convertView;
    }

    private class ViewHolder {
        TextView homeworkType;
    }
}
