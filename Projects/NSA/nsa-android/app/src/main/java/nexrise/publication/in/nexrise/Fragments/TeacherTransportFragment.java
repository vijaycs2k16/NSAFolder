package nexrise.publication.in.nexrise.Fragments;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Stops;
import nexrise.publication.in.nexrise.BeanClass.Vehicle;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TransportManager.ParentTransportActivity;
import nexrise.publication.in.nexrise.TransportManager.TeacherTransportArrayAdapter;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link TeacherTransportFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link TeacherTransportFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class TeacherTransportFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    ListView listView;
    View view;

    private OnFragmentInteractionListener mListener;

    public TeacherTransportFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment TeacherTransportFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static TeacherTransportFragment newInstance(String param1, String param2) {
        TeacherTransportFragment fragment = new TeacherTransportFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.activity_teacher_transport, container, false);
        listView = (ListView)view.findViewById(R.id.routes_listview);

        renderData();
        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    public void renderData() {

        String url = BASE_URL + API_VERSION_ONE + ROUTE;
        GETUrlConnection getAllRoutes = new GETUrlConnection(getActivity(), url,null) {
            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.progress_bar);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                if(progressBarLayout.getVisibility() == View.GONE)
                    progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);

                progressBar.setVisibility(View.INVISIBLE);
                progressBarLayout.setVisibility(View.GONE);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject jsonObject = new JSONObject(response);
                    JSONArray data = jsonObject.getJSONArray(DATA);

                    ArrayList<Vehicle> vehicleList = vehicleParser(data);
                    TeacherTransportArrayAdapter arrayAdapter = new TeacherTransportArrayAdapter(getActivity(), 0, vehicleList);
                    listView.setAdapter(arrayAdapter);
                    listviewClick();
                } catch (JSONException | NullPointerException e) {
                    if(progressBarLayout.getVisibility() == View.GONE )
                        progressBarLayout.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.INVISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getAllRoutes.execute();
    }

    private ArrayList<Vehicle> vehicleParser(JSONArray dataAry) throws JSONException, NullPointerException {
        ArrayList<Vehicle> vehicleList = new ArrayList<>();
        if(dataAry.length() == 0)
            throw new JSONException("Empty json array");
        for(int i=0; i<dataAry.length(); i++) {
            Vehicle vehicle = new Vehicle();
            JSONObject dataObj = dataAry.getJSONObject(i);
            String regNo = dataObj.getString("reg_no");
            String routeName = dataObj.getString("route_name");
            String driverId = dataObj.getString("driver_id");
            JSONObject vehicleObj = dataObj.getJSONObject("vehicle");
            boolean active = false;
            if(vehicleObj.has("active"))
                active = vehicleObj.getBoolean("active");
            vehicle.setReg_no(regNo);
            vehicle.setRoute_name(routeName);
            vehicle.setDriver_id(driverId);
            vehicle.setActive(active);

            JSONArray stops = dataObj.getJSONArray("stops");
            ArrayList<Stops> stopsList = new ArrayList<>();
            for(int j=0; j<stops.length(); j++) {
                Stops stop = new Stops();
                JSONObject stopsObj = stops.getJSONObject(j);
                String location = stopsObj.getString("location");
                stop.setLocation(location);
                stopsList.add(stop);
            }
            vehicle.setStops(stopsList);
            vehicleList.add(vehicle);
        }
        return vehicleList;
    }

    public void listviewClick() {
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Vehicle vehicle = (Vehicle)listView.getItemAtPosition(position);
                Log.v("Vehicle ","active "+vehicle.isActive());
                Intent intent = new Intent(getActivity(), ParentTransportActivity.class);
                intent.putExtra(FROM, "TeacherTransportActivity");
                intent.putExtra("vehicle", vehicle);
                startActivity(intent);
            }
        });
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
}
