package nexrise.publication.in.nexrise.HomeworkFeature;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Subject;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 13-03-2017.
 */

public class SubjectArrayAdapter  extends BaseAdapter {
    Activity context;
    int resource;
    private String values = " ";
    List<Subject> subjects;

    public SubjectArrayAdapter(Activity context, int resource, List<Subject> subjects) {
        this.context = context;
        this.resource = resource;
        this.subjects = subjects;
    }
    @Override
    public int getCount() {
        return subjects.size() ;
    }

    @Override
    public Object getItem(int position) {
        return subjects.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }


    @NonNull
    @Override
    public View getView(final int position, View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        final Subject subject = (Subject) getItem(position);

        if (convertView == null) {
            convertView = inflater.inflate(resource, parent, false);
            holder.homeworkType = (CheckBox) convertView.findViewById(R.id.checkBox4);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
            holder.homeworkType.setOnCheckedChangeListener(null);
        }

        assert subject != null;
            holder.homeworkType.setText(subject.getSubName());
            holder.homeworkType.setChecked(subject.isChecked());
            holder.homeworkType.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton compoundButton, boolean isChecked) {
                    SubjectHomeWorkActivity subjectHomeWorkActivity = (SubjectHomeWorkActivity) context;
                    if (isChecked) {
                        values += " " + (subject.getSubName());
                        subjectHomeWorkActivity.select(subject, "add");
                        subject.setChecked(true);
                        subjects.get(position).setChecked(true);
                    } else {
                        values = values.replace(subject.getSubName(), "");
                        subjectHomeWorkActivity.select(subject, "remove");
                        subject.setChecked(false);
                        subjects.get(position).setChecked(false);
                    }
                }
            });
            return convertView;
        }


    private class ViewHolder {
        CheckBox homeworkType;
    }
}
