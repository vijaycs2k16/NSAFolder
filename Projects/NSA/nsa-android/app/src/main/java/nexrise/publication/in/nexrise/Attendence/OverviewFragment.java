package nexrise.publication.in.nexrise.Attendence;

import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.roomorama.caldroid.CaldroidFragment;
import com.roomorama.caldroid.CaldroidListener;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

import nexrise.publication.in.nexrise.BeanClass.Holiday;
import nexrise.publication.in.nexrise.BeanClass.LeaveApproval;
import nexrise.publication.in.nexrise.BeanClass.StatusAttendance;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.ParentAttendanceParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OverviewFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link OverviewFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class OverviewFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    View view;
    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    String userRole;
    SharedPreferences preferences;
    ArrayList<StatusAttendance> absentList;
    ArrayList<StatusAttendance> presentList;
    ArrayList<Holiday> holidayList;
    Bundle bundle;
    StringUtils stringUtils;
    StringUtils utils;
    CaldroidFragment caldroidFragment;

    private OnFragmentInteractionListener mListener;

    public OverviewFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment OverviewFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static OverviewFragment newInstance(String param1, String param2) {
        OverviewFragment fragment = new OverviewFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.calendar_fragment, container, false);
        HashMap<Date, Drawable> map = new HashMap<Date, Drawable>();
        utils = new StringUtils();

        Drawable absent = getResources().getDrawable(R.color.colorRed);
        Drawable present = getResources().getDrawable(R.color.present);
        bundle = this.getArguments();
        stringUtils = new StringUtils();
        Calendar calendar = Calendar.getInstance();
        final int month = calendar.get(Calendar.MONTH);
        final int year = calendar.get(Calendar.YEAR);
        userRole = stringUtils.getUserRole(getActivity());
        if (!userRole.equalsIgnoreCase(EMPLOYEE)) {
            renderData(view, month, year, caldroidFragment);
        } else {
            Drawable approvedLeaveColor = getResources().getDrawable(R.color.present);
            Drawable declinedLeaveColor = getResources().getDrawable(R.color.colorRed);
            TextView absentText = (TextView)view.findViewById(R.id.absent);
            TextView presentText = (TextView)view.findViewById(R.id.present);
            absentText.setText(R.string.declined_leave);
            presentText.setText(R.string.approved_leave);

            ArrayList<LeaveApproval> status = new ArrayList<>();
            status = (ArrayList<LeaveApproval>) bundle.getSerializable("status");
            for (int i =0; i <status.size(); i++){
                LeaveApproval date= status.get(i);
                String startDate = date.getFromDate();
                String endDate = date.getToDate();
                String leaveStatus = date.getStatus();
                Date fromDate = stringUtils.dateCompare(stringUtils.dateSeperate(startDate));
                Date toDate = stringUtils.dateCompare(stringUtils.dateSeperate(endDate));
                if (fromDate != null && toDate != null) {
                    if (fromDate.equals(toDate)) {
                        if (leaveStatus.equalsIgnoreCase("Approved"))
                            map.put(fromDate, approvedLeaveColor);
                        else
                            map.put(fromDate, declinedLeaveColor);
                    } else {
                        Calendar leaveStartDate = Calendar.getInstance();
                        leaveStartDate.setTime(fromDate);
                        Calendar leaveEndDate = Calendar.getInstance();
                        leaveEndDate.setTime(toDate);

                        while (!leaveStartDate.after(leaveEndDate)) {
                            if (leaveStatus.equalsIgnoreCase("Approved")) {
                                map.put(leaveStartDate.getTime(), approvedLeaveColor);
                                leaveStartDate.add(Calendar.DATE, 1);
                            } else {
                                map.put(leaveStartDate.getTime(), declinedLeaveColor);
                                leaveStartDate.add(Calendar.DATE, 1);
                            }
                        }
                    }
                }
            }
        }

        caldroidFragment = new CaldroidFragment();
        Bundle args = new Bundle();
        assert absentList != null;

        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        caldroidFragment.setBackgroundDrawableForDates(map);
        caldroidFragment.setArguments(args);
        transaction.replace(R.id.calendarabs, caldroidFragment).addToBackStack("Calendar");
        transaction.commit();
        TextView student = (TextView) view.findViewById(R.id.studentname);
        student.setText(preferences.getString(FIRST_NAME, null));
        customTooltip(view);

        if (!userRole.equalsIgnoreCase(EMPLOYEE)) {
            final CaldroidListener listener = new CaldroidListener() {
                @Override
                public void onCaldroidViewCreated() {
                    super.onCaldroidViewCreated();
                    caldroidFragment.setEnableSwipe(false);
                    Button leftArrow = caldroidFragment.getLeftArrowButton();
                    Button rightArrow = caldroidFragment.getRightArrowButton();
                    renderData(view, month, year, caldroidFragment);
                    leftArrow.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            caldroidFragment.prevMonth();
                            renderData(view, caldroidFragment.getMonth() - 1, caldroidFragment.getYear(), caldroidFragment);
                            Log.v("Current ", "Moonth " + caldroidFragment.getMonth());
                            Log.v("Current ", "Year " + caldroidFragment.getYear());
                        }
                    });
                    rightArrow.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            caldroidFragment.nextMonth();
                            renderData(view, caldroidFragment.getMonth() - 1, caldroidFragment.getYear(), caldroidFragment);
                            Log.v("Current ", "Moonth " + caldroidFragment.getMonth());
                            Log.v("Current ", "Year " + caldroidFragment.getYear());
                        }
                    });
                }

                @Override
                public void onSelectDate(Date date, View dateView) {
                }
            };
            caldroidFragment.setCaldroidListener(listener);
        }
        return view;
    }

    private void renderData(final View view, int month, int year, final CaldroidFragment caldroidFragment) {
        String username = preferences.getString(CURRENT_USERNAME,null);
        String url = BASE_URL + API_VERSION_ONE + ATTENDANCE + DETAILS + MONTH +username +"?monthNo="+ month + "&year=" + year;
        GETUrlConnection getUrlConnection = new GETUrlConnection(getActivity(),url,null){

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("attendance responce", "new " + response);
                try {
                    stringUtils.checkSession(response);
                    ParentAttendanceParser parentAttendanceParser = new ParentAttendanceParser();
                    parentAttendanceParser.getParentAttendaceList(response);
                    HashMap<Date, Drawable> map = new HashMap<Date, Drawable>();
                    LinearLayout holidaysLayout = (LinearLayout)view.findViewById(R.id.holidays_Layout);
                    holidaysLayout.setVisibility(View.VISIBLE);
                    Drawable absent = getResources().getDrawable(R.color.colorRed);
                    Drawable present = getResources().getDrawable(R.color.present);
                    Drawable holidays = getResources().getDrawable(R.color.holidayColors);
                    TextView absentText = (TextView)view.findViewById(R.id.absent);
                    TextView presentText = (TextView)view.findViewById(R.id.present);
                    absentText.setText(R.string.absent);
                    presentText.setText(R.string.present);
                    absentList = ParentAttendanceParser.absentList;
                    presentList = ParentAttendanceParser.presentList;
                    holidayList = ParentAttendanceParser.holidayList;
                    Log.v("list of","absent paresent holi"+absentList+presentList+holidayList);
                    if (holidayList != null){
                        for (int k = 0; k < holidayList.size(); k++) {
                            try {
                                Date startdate = new SimpleDateFormat("MMM dd yyyy", Locale.ENGLISH).parse(stringUtils.Dateset(holidayList.get(k).getStartDate()));
                                Date endDate = new SimpleDateFormat("MMM dd yyyy", Locale.ENGLISH).parse(stringUtils.Dateset(holidayList.get(k).getEndDate()));
                                if(startdate.equals(endDate)) {
                                    map.put(startdate, holidays);
                                } else {
                                    Calendar holidayStartDate = Calendar.getInstance();
                                    holidayStartDate.setTime(startdate);
                                    Calendar holidayEndDate = Calendar.getInstance();
                                    holidayEndDate.setTime(endDate);

                                    while (!holidayStartDate.after(holidayEndDate)) {
                                        map.put(holidayStartDate.getTime(), holidays);
                                        holidayStartDate.add(Calendar.DATE, 1);
                                    }
                                }
                                //map.put(date, holidays);
                                Log.v("holidays","holidays"+holidays);
                            } catch (ParseException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                    if(absentList != null && absentList.size() !=0) {
                        for (int i = 0; i < absentList.size(); i++) {
                            try {
                                Date date = new SimpleDateFormat("MMM dd yyyy", Locale.ENGLISH).parse(stringUtils.Dateset(absentList.get(i).getAttendanceDate()));
                                map.put(date, absent);
                                Log.v("absent","absent"+absent);
                            } catch (ParseException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                    if(presentList != null && presentList.size() !=0){
                        for (int j = 0; j < presentList.size(); j++) {
                            try {
                                Date date = new SimpleDateFormat("MMM dd yyyy", Locale.ENGLISH).parse(stringUtils.Dateset(presentList.get(j).getAttendanceDate()));
                                map.put(date, present);
                                Log.v("present","present"+present);
                            } catch (ParseException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                    caldroidFragment.setBackgroundDrawableForDates(map);
                    caldroidFragment.refreshView();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                } catch (Exception e) {
                    e.printStackTrace();
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

    public void customTooltip(View view){

        final ImageView help = (ImageView)view.findViewById(R.id.help);
        if(userRole.equalsIgnoreCase(PARENT)){
            stringUtils.customTooltip(getActivity(),help, (String) getResources().getText(R.string.parent_attendance));
        } else {
            stringUtils.customTooltip(getActivity(),help,(String) getResources().getText(R.string.emp_att_history));
        }
    }
}