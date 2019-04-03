package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.BeanClass.TeacherObject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.NavigationDrawerActivity;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * to handle interaction events.
 * Use the {@link TimeTableFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class TimeTableFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    String className = "";
    String sectionName = "";
    String teacherName = "";
    Boolean clicked = false;
    SharedPreferences preferences;
    View view;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    List<TeacherObject> list;

    public TimeTableFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment TimeTableFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static TimeTableFragment newInstance(String param1, String param2) {
        TimeTableFragment fragment = new TimeTableFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment

        view = inflater.inflate(R.layout.fragment_time_table, container, false);
        TextView myTimeTable = (TextView) view.findViewById(R.id.message_to);

        LinearLayout classTimetable = (LinearLayout) view.findViewById(R.id.class_timetable);
        LinearLayout teacherTimetable = (LinearLayout) view.findViewById(R.id.teacher_timetable);
        LinearLayout viewNotes = (LinearLayout) view.findViewById(R.id.view_notes);
        setRetainInstance(true);
        renderMyClasses(view);

        myTimeTable.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), TeacherActivity.class);
                startActivity(intent);
            }
        });
        classTimetable.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), ClassWeekActivity.class);
                intent.putExtra("className", className);
                intent.putExtra("sectionName", sectionName);
                intent.putExtra("For","classTimetable");
                startActivity(intent);
            }
        });

        teacherTimetable.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), ClassWeekActivity.class);
                intent.putExtra("teacherName", teacherName);
                intent.putExtra("For","teacherTimetable");
                startActivity(intent);
            }
        });

        viewNotes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), ViewNotesCalendarActivity.class);
                intent.putExtra("From","TeacherTimetable");
                startActivity(intent);
            }
        });

        String values = Utility.readProperty(getActivity(), DISABLE_NOTES);
        if(values.contains(ACCESS_ID)) // remove notes for Bhashyam
            viewNotes.setVisibility(View.GONE);

        final ImageView help = (ImageView)view.findViewById(R.id.time_table_help);
        new StringUtils().customTooltip(getActivity(),help, (String) getResources().getText(R.string.emp_timetable));

        return view;
    }

    public void test(View convertView, LinearLayout myClasses) {
        /*final LinearLayout myClasess = (LinearLayout) view.findViewById(R.id.class_list);
        for (int i=0; i<2; i++) {
            LayoutInflater layoutInflater = (LayoutInflater)getActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View myClassesView = layoutInflater.inflate(R.layout.myclasses_layout, null);

            TextView textView = (TextView)myClassesView.findViewById(R.id.classtimm);
            textView.setText("test "+i);
            textView.setTag("test "+i);
            textView.setOnClickListener(myClassesClickListener());
            myClasess.addView(myClassesView);
        }*/
    }

    @Override
    public void setMenuVisibility(boolean visible) {
        super.setMenuVisibility(visible);
        if(visible) {
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

    /*@Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        if(isVisibleToUser) {
            NavigationDrawerActivity parentActivity = (NavigationDrawerActivity) getActivity();
            StringUtils.notificationCount.put(CREATE_TIMETABLE, 0);
            parentActivity.setNotificationCount();
        }
    }*/

    public void renderMyClasses(final View view) {
        final LinearLayout classView = (LinearLayout) view.findViewById(R.id.myclass);
        final LinearLayout myClasess = (LinearLayout) view.findViewById(R.id.class_list);
        final ImageView imageView = (ImageView) view.findViewById(R.id.image1);
        final View line = view.findViewById(R.id.view_line);

        String teacherId = preferences.getString(CURRENT_USERNAME, null);
        String url = BASE_URL + API_VERSION_ONE + TIMETABLE + CLASS + TEACHER +"/" +teacherId;

        GETUrlConnection classesByEmployee = new GETUrlConnection(getActivity() ,url,null){
            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.progress_bar);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute(){
                super.onPreExecute();
                progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("classesByEmployee"," "+response);
                progressBar.setVisibility(View.INVISIBLE);
                try {
                    new StringUtils().checkSession(response);
                    progressBarLayout.setVisibility(View.GONE);
                    List<Classes> classesList = jsonParser(response);
                    for (int i=0; i<classesList.size(); i++) {
                        LayoutInflater layoutInflater = (LayoutInflater)getActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                        View myClassesView = layoutInflater.inflate(R.layout.myclasses_layout, null);
                        TextView textView = (TextView)myClassesView.findViewById(R.id.classtimm);
                        textView.setText(classesList.get(i).getClassName()+" - "+classesList.get(i).getSectionName());
                        textView.setTag(classesList.get(i));
                        textView.setOnClickListener(myClassesClickListener());
                        myClasess.addView(myClassesView);
                    }

                    classView.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            if(clicked){
                                myClasess.setVisibility(View.GONE);
                                imageView.setImageResource(R.drawable.ic_arrow_down_circle);
                                line.setVisibility(View.GONE);
                                clicked = false;
                            }
                            else {
                                myClasess.setVisibility(View.VISIBLE);
                                imageView.setImageResource(R.drawable.ic_arrow_up_circle);
                                line.setVisibility(View.VISIBLE);
                                clicked = true;
                            }
                        }
                    });
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                    classView.setVisibility(View.GONE);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        classesByEmployee.execute();
    }

    public List<Classes> jsonParser(String jsonString) throws JSONException {

        JSONObject json = new JSONObject(jsonString);
        JSONArray dataArray = json.getJSONArray(DATA);
        List<Classes> classesList = new ArrayList<>();
        if(dataArray.length()!= 0) {
            for (int i = 0; i < dataArray.length(); i++) {
                Classes classes = new Classes();
                JSONObject data = dataArray.getJSONObject(i);

                classes.setClassId(data.getString("classId"));
                classes.setClassName(data.getString("className"));
                classes.setSectionId(data.getString("sectionId"));
                classes.setSectionName(data.getString("sectionName"));
                classesList.add(classes);
            }
        } else {
            throw new JSONException("Empty JSONArray");
        }

        return classesList;
    }

    private View.OnClickListener myClassesClickListener() {
        return new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), ClassActivity.class);
                Classes classes = (Classes) v.getTag();
                intent.putExtra("Classes",classes);
                startActivity(intent);
            }
        };
    }
}
