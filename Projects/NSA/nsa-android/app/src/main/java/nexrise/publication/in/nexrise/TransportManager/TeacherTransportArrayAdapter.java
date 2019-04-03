package nexrise.publication.in.nexrise.TransportManager;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Vehicle;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 5/30/2017.
 */

public class TeacherTransportArrayAdapter extends ArrayAdapter<Vehicle> {
    private Activity context;
    private ArrayList<Vehicle> vehicles;
    public TeacherTransportArrayAdapter(Activity context,int resource, ArrayList<Vehicle> vehicles) {
        super(context, resource, vehicles);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        Vehicle vehicle = getItem(position);
        ViewHolder holder = new ViewHolder();
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.route_layout, parent, false);
            holder.vehicleNumber = (TextView)convertView.findViewById(R.id.vehicle_number);
            holder.routeName = (TextView)convertView.findViewById(R.id.route_name);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }
        holder.vehicleNumber.setText(vehicle.getReg_no());
        holder.routeName.setText(vehicle.getRoute_name());
        return convertView;
    }

    private class ViewHolder {
        TextView routeName;
        TextView vehicleNumber;
    }
}
