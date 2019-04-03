package nexrise.publication.in.nexrise.EventsFeature;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.places.Place;
import com.google.android.gms.location.places.ui.PlaceAutocompleteFragment;
import com.google.android.gms.location.places.ui.PlaceSelectionListener;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import java.io.IOException;
import java.util.List;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link MapsFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link MapsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class MapsFragment extends Fragment implements OnMapReadyCallback,Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private GoogleMap googleMap;
    final int LOCATION = 10;

    private OnFragmentInteractionListener mListener;

    public MapsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment MapsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static MapsFragment newInstance(String param1, String param2) {
        MapsFragment fragment = new MapsFragment();
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
        View view = inflater.inflate(R.layout.fragment_maps, container, false);
        MapFragment mapFragment = (MapFragment) getActivity().getFragmentManager().findFragmentById(R.id.mapFragment);
        mapFragment.getMapAsync(this);

        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onMapReady(final GoogleMap googleMap) {

     /*   googleMap.setMapType(GoogleMap.MAP_TYPE_NORMAL);
        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(new
                LatLng(49.39,-124.83), 20));
        googleMap.addMarker(new MarkerOptions().position(new LatLng(49.39,-124.83)));*/
        LatLng source = new LatLng(LATITUDE,LONGITUDE);
        this.googleMap = googleMap;
        googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(source, 12));
        googleMap.addMarker(new MarkerOptions().position(source).title(SCHOOL_NAME));
        if(Build.VERSION.SDK_INT >=  Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.v("permission ", "not granted");
                ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, LOCATION);
            } else {
                autoCompleteTextview();
            }
        } else {
            autoCompleteTextview();
        }

        /*googleMap.setMyLocationEnabled(true);
        Bundle bundle = this.getArguments() ;
        if(bundle!= null ) {
            String activity = bundle.getString("Activity");
            if (activity.equals("TransportMapActivity")) {
                LatLng destination = new LatLng(13.069019, 80.168297);
                googleMap.addPolyline(new PolylineOptions().add(
                        source,
                        new LatLng(13.066552, 80.232633),
                        new LatLng(13.074361, 80.221307),
                        new LatLng(13.071025, 80.182889),
                        new LatLng(13.073366, 80.174992),
                        new LatLng(13.077045, 80.171216),
                        new LatLng(13.076293, 80.167697),
                        destination).width(5).color(Color.RED)
                );
                googleMap.addMarker(new MarkerOptions().position(destination).title("DABC Mithilam Apartments"));
            }
        }*/

        PlaceAutocompleteFragment autocompleteFragment = (PlaceAutocompleteFragment)getActivity().getFragmentManager().findFragmentById(R.id.autoCompleteTextView);
        autocompleteFragment.setOnPlaceSelectedListener(new PlaceSelectionListener() {
            @Override
            public void onPlaceSelected(Place place) {
                googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(place.getLatLng(), 15));
                googleMap.addMarker(new MarkerOptions().title((String) place.getName()).position(place.getLatLng()));
                LatLng latLng = place.getLatLng();
            }

            @Override
            public void onError(Status status) {

            }
        });
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

    public void autoCompleteTextview() {
        PlaceAutocompleteFragment autocompleteFragment = (PlaceAutocompleteFragment)getActivity().getFragmentManager().findFragmentById(R.id.autoCompleteTextView);
        autocompleteFragment.setOnPlaceSelectedListener(new PlaceSelectionListener() {
            @Override
            public void onPlaceSelected(Place place) {
                googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(place.getLatLng(), 12));
                googleMap.clear();
                googleMap.addMarker(new MarkerOptions().title((String) place.getName()).position(place.getLatLng()));
            }

            @Override
            public void onError(Status status) {
            }
        });

        googleMap.setOnMapClickListener(new GoogleMap.OnMapClickListener() {
            @Override
            public void onMapClick(LatLng latLng) {
                googleMap.addMarker(new MarkerOptions().title(getAddress(latLng)).position(latLng));
            }
        });

        googleMap.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                LocationActivity location = (LocationActivity)getActivity();
                location.mapLocation(marker.getPosition());
                Toast.makeText(location, R.string.location_selected, Toast.LENGTH_SHORT).show();
                return false;
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(requestCode == LOCATION && (grantResults[0] == PackageManager.PERMISSION_GRANTED  && grantResults[1] == PackageManager.PERMISSION_GRANTED)) {
            autoCompleteTextview();
        }
    }

    public String getAddress(LatLng latLng) {
        String words = "";
        int length;
        Double lattitude = latLng.latitude;
        Double longitude = latLng.longitude;
        Geocoder geocoder = new Geocoder(getActivity());
        try {
            List<Address> addresses = geocoder.getFromLocation(lattitude, longitude, 2);
            if(addresses.size()>1){

                length = addresses.size() - 1;
            } else {
                length = addresses.size();
            }
            for (int i=0; i<length; i++) {
                for (int j = 0; j < addresses.get(i).getMaxAddressLineIndex(); j++) {
                    Log.v("Address ", " " + addresses.get(i).getAddressLine(j));
                    words = words + addresses.get(i).getAddressLine(j);
                    Log.v("Words"," "+words);
                }
            }
        } catch (IOException | NullPointerException e) {
            e.printStackTrace();
        }
        Log.v("Latlng "," "+latLng.latitude);
        Log.v("Latlng "," "+latLng.longitude);
        return words;
    }
}
