package nexrise.publication.in.nexrise.ParentFeatures.TimeTableFeature;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.Timer;
import java.util.TimerTask;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.NavigationDrawerActivity;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.ClassActivity;
import nexrise.publication.in.nexrise.TimetableFeature.ViewNotesCalendarActivity;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ParentTimeTable.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ParentTimeTable#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ParentTimeTable extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    SharedPreferences preferences;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    Timer timer;
    StringUtils stringUtils;
    private OnFragmentInteractionListener mListener;

    public ParentTimeTable() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ParentTimeTable.
     */
    // TODO: Rename and change types and number of parameters
    public static ParentTimeTable newInstance(String param1, String param2) {
        ParentTimeTable fragment = new ParentTimeTable();
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
        View view = inflater.inflate(R.layout.fragment_parent_time_table, container, false);
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        stringUtils = new StringUtils();
        String userRole = stringUtils.getUserRole(getActivity());

        final String className = preferences.getString(CLASS_NAME,null);
        final String sectionName = preferences.getString(SECTION_NAME,null);
        final String firstName = preferences.getString(FIRST_NAME,null);

        final LinearLayout student1 = (LinearLayout) view.findViewById(R.id.student1);
        TextView name = (TextView) view.findViewById(R.id.my_name);
        name.setText(firstName + System.getProperty("line.separator") + className + "-" + sectionName);
        LinearLayout notes = (LinearLayout) view.findViewById(R.id.view_notes);

        final RelativeLayout student = (RelativeLayout)view.findViewById(R.id.notify_nav_icons);
        final RelativeLayout viewNotes = (RelativeLayout)view.findViewById(R.id.notify_nav_icons1);
        final TextView timetable = (TextView)view.findViewById(R.id.notification_count);
        final TextView notesCount = (TextView)view.findViewById(R.id.notification_count1);

        student1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //click function to view Time table of Student
                student.setVisibility(View.INVISIBLE);
                Intent intent = new Intent(getActivity(), ClassActivity.class);
                intent.putExtra("className", className);
                startActivity(intent);
            }
        });

       notes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                viewNotes.setVisibility(View.INVISIBLE);
                Intent intent = new Intent(getActivity(), ViewNotesCalendarActivity.class);
                intent.putExtra(FROM,"ParentTimetable");
                intent.putExtra("classId",preferences.getString(CLASS_ID,null));
                intent.putExtra("sectionId",preferences.getString(SECTION_ID,null));
                startActivity(intent);
            }
        });
        String values = Utility.readProperty(getActivity(), DISABLE_NOTES);
        if(values.contains(ACCESS_ID)) // remove notes for Bhashyam
            notes.setVisibility(View.GONE);

        final Handler handler = new Handler();
        timer = new Timer();
        setRetainInstance(true);

        /*TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Integer notificationCount = MessageReceivingService.notificationCount.get(CREATE_TIMETABLE);
                            if (notificationCount != 0) {
                                student.setVisibility(View.VISIBLE);
                                viewNotes.setVisibility(View.VISIBLE);
                                timetable.setText(String.valueOf(notificationCount));
                                notesCount.setText(String.valueOf(notificationCount));

                                MessageReceivingService.notificationCount.put(CREATE_TIMETABLE, 0);
                            }
                        } catch (NullPointerException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        };
        timer.schedule(timerTask, 200, 3500);*/

        final ImageView help = (ImageView) view.findViewById(R.id.help);
        if (userRole.equalsIgnoreCase(PARENT)){
            stringUtils.customTooltip(getActivity(),help, (String) getResources().getText(R.string.parent_timtable));
        } else {
            stringUtils.customTooltip(getActivity(),help,"Your timetable, exams, events and holidays!");
        }
        return view;
    }

    @Override
    public void setMenuVisibility(boolean menuVisible) {
        super.setMenuVisibility(menuVisible);
        if(menuVisible) {
            final NavigationDrawerActivity parentActivity = (NavigationDrawerActivity) getActivity();

            if(parentActivity != null) {
                MessageReceivingService.notificationCount.put(CREATE_TIMETABLE, 0);
                parentActivity.setNotificationCount();
            } else {
                Timer timer = new Timer();
                final TimerTask timerTask = new TimerTask() {
                    @Override
                    public void run() {
                        Log.v("Timer "," ");
                        if(parentActivity != null) {
                            MessageReceivingService.notificationCount.put(CREATE_TIMETABLE, 0);
                            parentActivity.setNotificationCount();
                            this.cancel();
                        }
                    }
                };
                timer.schedule(timerTask, 100);
                timerTask.run();
            }
        }
    }


    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
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

