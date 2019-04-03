package nexrise.publication.in.nexrise.Fragments;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TransportManager.TransportMapActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ParentTransportFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ParentTransportFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ParentTransportFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    StringUtils stringUtils;
    String userRole;
    TextView driverName;
    TextView driverNo;
    Boolean live = false;
    View view;

    private OnFragmentInteractionListener mListener;

    public ParentTransportFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ParentTransportFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ParentTransportFragment newInstance(String param1, String param2) {
        ParentTransportFragment fragment = new ParentTransportFragment();
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
        view = inflater.inflate(R.layout.activity_parent_transport, container, false);
        stringUtils = new StringUtils();
        userRole = stringUtils.getUserRole(getActivity());
        renderDataFromREST();
        return view;
    }

    public void renderDataFromREST() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String userId = preferences.getString(CURRENT_USERNAME, null);
        final String name = preferences.getString(FIRST_NAME, null);
        TextView studentName = (TextView)view.findViewById(R.id.student_name);
        studentName.setText(value(name));
        customTooltip();

        String url = BASE_URL + API_VERSION_ONE + VEHICLEALLOCATION + STUDENT + "/" + userId;
        GETUrlConnection getUserVehicle = new GETUrlConnection(getActivity(), url,null) {
            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);
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
                try {
                    stringUtils.checkSession(response);
                    Log.v("Transport ","resposne "+response);
                    JSONObject jsonObject = new JSONObject(response);
                    boolean success = jsonObject.getBoolean(SUCCESS);
                    if(success) {
                        progressBar.setVisibility(View.INVISIBLE);
                        progressBarLayout.setVisibility(View.GONE);
                        JSONObject data = jsonObject.getJSONObject(DATA);
                        final String regNo = data.getString("reg_no");
                        String pickupLocationStr = data.getString("pickup_location");
                        JSONObject pickupLocation = new JSONObject(pickupLocationStr);
                        JSONObject vehicle = data.getJSONObject("vehicle");
                        if(vehicle.has("active"))
                            live = vehicle.getBoolean("active");
                        JSONObject route = data.getJSONObject("route");
                        String routeName =route.getString("route_name");
                        JSONObject driver = data.getJSONObject("driver");
                        String driverNames = driver.getString("driver_name");
                        String driverPhone = driver.getString("driver_phone");

                        TextView routeDetails = (TextView)view.findViewById(R.id.route_details);
                        TextView driverName = (TextView)view.findViewById(R.id.driver_name);
                        TextView driverNo = (TextView)view.findViewById(R.id.ph_no);

                        TextView routName = (TextView)view.findViewById(R.id.route_name);
                        TextView regNum = (TextView)view.findViewById(R.id.vehicle_number);

                        routeDetails.setText(pickupLocation.getString("location"));
                        driverName.setText(value(driverNames));
                        driverNo.setText(value(driverPhone));
                        regNum.setText(value(regNo));
                        routName.setText(value(routeName));

                        ImageView location = (ImageView)view.findViewById(R.id.location);
                        location.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                if (live) {
                                    Intent intent = new Intent(getActivity(), TransportMapActivity.class);
                                    intent.putExtra("Vehicle", regNo);
                                    startActivity(intent);
                                }else {
                                    Toast.makeText(getActivity(),R.string.vehicle_not_active,Toast.LENGTH_SHORT).show();
                                }
                            }
                        });

                    } else
                        noContent.setVisibility(View.VISIBLE);
                } catch (JSONException | NullPointerException e) {
                    if(progressBarLayout.getVisibility() == View.GONE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getUserVehicle.execute();
    }

    private void fetchDriverDetails(String driverId) {
        String url = BASE_URL + API_VERSION_ONE + DRIVER + driverId;
        GETUrlConnection driverDetails = new GETUrlConnection(getActivity(), url, null) {
            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.progress_bar);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
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
                progressBar.setVisibility(View.GONE);
                progressBarLayout.setVisibility(View.GONE);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject jsonObject = new JSONObject(response);
                    JSONObject data = jsonObject.getJSONObject(DATA);
                    String driver_name = data.getString("driver_name");
                    String driver_no = data.getString("driver_phone");
                    driverNo.setText(driver_no);
                    driverName.setText(driver_name);
                } catch (JSONException | NullPointerException e) {
                    driverNo.setText(" - ");
                    driverName.setText(" - ");
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        driverDetails.execute();
    }

    public void customTooltip(){

        final ImageView help = (ImageView)view.findViewById(R.id.help);
        if (userRole.equalsIgnoreCase(TEACHER)) {
            stringUtils.customTooltip(getActivity(),help, (String) getResources().getText(R.string.teacher_transport));

        } else if(userRole.equalsIgnoreCase(PARENT)){
            stringUtils.customTooltip(getActivity(),help,(String) getResources().getText(R.string.parent_transport));

        } else {
            stringUtils.customTooltip(getActivity(),help,(String) getResources().getText(R.string.emp_transport));
        }
    }

    public String value(String string){
        String value = " - ";
        if(string.equals("null")){
            value = " - ";
        } else {
            value = string;
        }
        return value;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
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
