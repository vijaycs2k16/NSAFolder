package nexrise.publication.in.nexrise.TimetableFeature;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Holiday;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.HolidayJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link HolidaysListviewFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link HolidaysListviewFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class HolidaysListviewFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public HolidaysListviewFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment HolidaysListviewFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static HolidaysListviewFragment newInstance(String param1, String param2) {
        HolidaysListviewFragment fragment = new HolidaysListviewFragment();
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
        View view  = inflater.inflate(R.layout.fragment_holidays_listview, container, false);
        renderData(view);
        return view;
    }

    protected void renderData(final View view) {
        final String holidays = BASE_URL + API_VERSION_ONE + HOLIDAYS + SCHOOLS;
        Log.v("holiday ","url "+holidays);
        GETUrlConnection GETUrlConnection = new GETUrlConnection(getActivity(),holidays,null){
            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.progress_bar);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);

            @Override
            protected void onPreExecute(){
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE )
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response){
                super.onPostExecute(response);
                Log.v("holidays","Holidays " +response);
                progressBar.setVisibility(View.INVISIBLE);
                try {
                    new StringUtils().checkSession(response);
                    progressBarLayout.setVisibility(View.GONE);
                    HolidayJsonParser holidayJsonParser = new HolidayJsonParser();
                    List<Holiday> holidayList = holidayJsonParser.jsonParser(response);
                    ListView listView = (ListView)view.findViewById(R.id.holidaysListView);
                    Collections.sort(holidayList, new HolidayComparator());
                    HolidayListFragmentArrayAdapter adapter = new HolidayListFragmentArrayAdapter(getActivity(),holidayList);
                    listView.setAdapter(adapter);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                } catch (Exception e) {
                    e.printStackTrace();
                    if (progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() == View.INVISIBLE)
                        progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                }
            }
        };
        GETUrlConnection.execute();
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

    public class HolidayComparator implements Comparator<Holiday> {
        public int compare(Holiday firstDate, Holiday secondDate) {
            StringUtils utils = new StringUtils();
            Date firstDate1 = utils.updatedateCompare(firstDate.getStartDate());
            Date secondDagte1 = utils.updatedateCompare(secondDate.getStartDate());
            return firstDate1.compareTo(secondDagte1);
        }
    }

}
