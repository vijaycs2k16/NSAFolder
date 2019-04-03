package nexrise.publication.in.nexrise.EventsFeature;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Venue;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OurSchoolLocationFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link OurSchoolLocationFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class OurSchoolLocationFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    View view;
    ArrayList<Venue> selectedVenue = new ArrayList<>();

    private OnFragmentInteractionListener mListener;

    public OurSchoolLocationFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment OurSchoolLocationFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static OurSchoolLocationFragment newInstance(String param1, String param2) {
        OurSchoolLocationFragment fragment = new OurSchoolLocationFragment();
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
        view = inflater.inflate(R.layout.fragment_our_school_location, container, false);
        selectedVenue = (ArrayList<Venue>) getArguments().getSerializable("Selected location");
        renderData();
        return view;
    }

    public void renderData(){
        final String venues = BASE_URL + API_VERSION_ONE + EVENTS + VENUES;
        GETUrlConnection getUrlConnection = new GETUrlConnection(getActivity(),venues,null){
            ProgressBar progress = (ProgressBar)view.findViewById(R.id.loading);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progress.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response){
                super.onPostExecute(response);
                Log.v("venue","venue"+response);
                progress.setVisibility(View.GONE);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject venueObject = new JSONObject(response);
                    JSONArray data = venueObject.getJSONArray(DATA);

                    ArrayList<Venue> venueList = venueParser(data);

                    ListView listView = (ListView)view.findViewById(R.id.school_location_listview);
                    VenueArrayAdapter arrayAdapter = new VenueArrayAdapter(getActivity(),R.layout.fragment_our_school_location, venueList);
                    listView.setAdapter(arrayAdapter);

                } catch (NullPointerException | JSONException  e) {
                    e.printStackTrace();
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getUrlConnection.execute();
    }


    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
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

    public ArrayList<Venue> venueParser(JSONArray data) throws JSONException, NullPointerException {
        ArrayList<Venue> venues = new ArrayList<>();

        if (data.length() >= 1) {
            for (int i = 0; i < data.length(); i++) {
                JSONObject dataObject = data.getJSONObject(i);
                String venueTypeId = dataObject.getString("venue_type_id");
                String venueTypeName = dataObject.getString("venue_type_name");
                String location = dataObject.getString("location");
                String tenantId = dataObject.getString("tenant_id");
                String schoolId = dataObject.getString("school_id");
                String updatedDate = dataObject.getString("updated_date");
                String updatedBy = dataObject.getString("updated_by");
                String updatedUsername = dataObject.getString("updated_username");
                boolean checked = false;

                Venue venue = new Venue();
                venue.setLocation(location);
                venue.setSchool_id(schoolId);
                venue.setTenant_id(tenantId);
                venue.setUpdated_by(updatedBy);
                venue.setUpdated_userd_name(updatedUsername);
                venue.setUpdated_date(updatedDate);
                venue.setVenue_type_id(venueTypeId);
                venue.setVenue_type_name(venueTypeName);

                for (int j = 0; j < selectedVenue.size(); j++) {
                    if (venueTypeId.equals(selectedVenue.get(j).getVenue_type_id())) {
                        checked = true;
                        break;
                    }
                }
                venue.setChecked(checked);
                venues.add(venue);
                Log.v("venue ","ori "+venues);
            }
            return venues;
        } else {
            throw new JSONException("Empty json array");
        }
    }
}
