package nexrise.publication.in.nexrise.TimetableFeature;

import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;

import com.roomorama.caldroid.CaldroidFragment;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

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
 * {@link HolidaysListFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link HolidaysListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class HolidaysListFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    CaldroidFragment caldroidFragment;
    View view;

    private OnFragmentInteractionListener mListener;

    public HolidaysListFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment HolidaysListFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static HolidaysListFragment newInstance(String param1, String param2) {
        HolidaysListFragment fragment = new HolidaysListFragment();
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

        view = inflater.inflate(R.layout.fragment_holidays_list, container, false);
        final ImageButton grid = (ImageButton) view.findViewById(R.id.holidayListButton);
        final ImageButton list = (ImageButton) view.findViewById(R.id.holidayGridButton);

        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        transaction.replace(R.id.holidays_table_layout, new HolidaysListviewFragment(), "HolidaysListView");
        transaction.commit();
        final int appColor = getResources().getColor(R.color.appColor);
        final int colorWhite = getResources().getColor(R.color.colorWhite);

        list.setColorFilter(appColor);
        grid.setColorFilter(colorWhite);
        list.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FragmentTransaction transaction = getFragmentManager().beginTransaction();
                transaction.replace(R.id.holidays_table_layout, new HolidaysListviewFragment(), "HolidaysListView");
                transaction.commit();
                grid.setColorFilter(colorWhite);
                list.setColorFilter(appColor);
            }
        });

        grid.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                list.setColorFilter(colorWhite);
                grid.setColorFilter(appColor);
                caldroidFragment = new CaldroidFragment();
                Bundle args = new Bundle();
                args.putString(CaldroidFragment.DIALOG_TITLE, "Exams");
                caldroidFragment.setArguments(args);
                FragmentTransaction transaction = getFragmentManager().beginTransaction();
                transaction.replace(R.id.holidays_table_layout, caldroidFragment).addToBackStack("Calendar");
                transaction.commit();
                renderData();
            }
        });

        return  view;

    }
    protected void renderData() {
        final String holidays = BASE_URL + API_VERSION_ONE + HOLIDAYS + SCHOOLS;
        GETUrlConnection GETUrlConnection = new GETUrlConnection(getActivity(),holidays,null){

            @Override
            protected void onPostExecute(String response){
                super.onPostExecute(response);
                Log.v("holidays","Holidays " +response);
                try {
                    new StringUtils().checkSession(response);
                    HolidayJsonParser holidayJsonParser = new HolidayJsonParser();
                    List<Holiday> holidayList = holidayJsonParser.jsonParser(response);
                    holidayDate((ArrayList<Holiday>) holidayList);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }
        };
        GETUrlConnection.execute();
    }
    public void holidayDate(ArrayList<Holiday> holidays){
        HashMap<Date, Drawable> map = new HashMap<Date, Drawable>();
        Drawable absent = getResources().getDrawable(R.color.holidayColor);
        Drawable currentDay = getResources().getDrawable(R.color.buttonColor);
        StringUtils dateFormatter = StringUtils.getInstance();
        Date date = new Date();
        map.put(date, currentDay);

        ArrayList<Date> dates = new ArrayList<>();
        Set<Date> map1 = new HashSet<>();
        for (int i = 0; i < holidays.size(); i++) {
            try {
                Date fromdate = new SimpleDateFormat("MMM dd yyyy", Locale.ENGLISH).parse(dateFormatter.Dateset(holidays.get(i).getStartDate()));
                Log.v("Fromdate", "dsa" + holidays.get(i).getStartDate());
                Date todate = new SimpleDateFormat("MMM dd yyyy", Locale.ENGLISH).parse(dateFormatter.Dateset(holidays.get(i).getEndDate()));
                Calendar start = Calendar.getInstance();
                start.setTime(fromdate);
                Calendar end = Calendar.getInstance();
                end.setTime(todate);

                while(!start.after(end)) {
                    dates.add(start.getTime());
                    Log.v("Range ","dates "+start.getTime());
                    dates.add(start.getTime());
                    start.add(Calendar.DATE, 1);
                }
                map1.addAll(dates);
                dates.clear();
                dates.addAll(map1);


            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        for (int j=0;j<dates.size();j++){
            map.put(dates.get(j),absent);
        }
        caldroidFragment.setBackgroundDrawableForDates(map);
        caldroidFragment.refreshView();
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
}
