package nexrise.publication.in.nexrise.HomeworkFeature;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import nexrise.publication.in.nexrise.Attendence.AttendenceActivity;
import nexrise.publication.in.nexrise.BeanClass.Icons;
import nexrise.publication.in.nexrise.Config;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.CustomHashMap.Initiater;
import nexrise.publication.in.nexrise.CustomHashMap.OnUpdateListener;
import nexrise.publication.in.nexrise.EventsFeature.EventsFeatureActivity;
import nexrise.publication.in.nexrise.ExamFeature.ExamActivity;
import nexrise.publication.in.nexrise.FeeManagement.FeeManagementEmployeeActivity;
import nexrise.publication.in.nexrise.FeeManagement.FeeManagementParentActivity;
import nexrise.publication.in.nexrise.Gallery.AlbumsActivity;
import nexrise.publication.in.nexrise.HallOfFame.HallOfFameActivity;
import nexrise.publication.in.nexrise.MMS.ReceivedMMSActivity;
import nexrise.publication.in.nexrise.ParentFeatures.Attendance.ParentAttendanceActivity;
import nexrise.publication.in.nexrise.ParentFeatures.HomeworkFeature.ParentHomeworkActivity;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TransportManager.ParentTransportActivity;
import nexrise.publication.in.nexrise.TransportManager.TeacherTransportActivity;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link DrawerFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link DrawerFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class DrawerFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    SharedPreferences preferences;
    ArrayList<String> featureList;
    ArrayList<String> featureNames;
    ArrayList<Integer> iconList;
    ArrayList<String> subFeatureId;
    List<Map.Entry<String, String>> moreOptions;
    String userRole;
    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    ListView listView;
    View view;
    private static boolean rendered = false;
    OnUpdateListener updateListener;

    private OnFragmentInteractionListener mListener;

    public DrawerFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment DrawerFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static DrawerFragment newInstance(String param1, String param2) {
        DrawerFragment fragment = new DrawerFragment();
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
        featureNames = new ArrayList<>();
        iconList = new ArrayList<>();
        subFeatureId = new ArrayList<>();
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());

        Initiater initiater = Initiater.getInstance();
        updateListener = new OnUpdateListener() {
            @Override
            public void onUpdate(String classId, String sectionId, String schoolId, String userId, String featureId, int count) {
                try {
                    if (count != 0) {
                        if(StringUtils.getInstance().notificationForActiveUser(getActivity(), classId, sectionId, schoolId, userId)) {
                            if (getUserVisibleHint())
                                renderData();
                            else
                                rendered = false;

                            StringUtils.getInstance().cancelAllNotification(getActivity());
                        }
                    }
                } catch (NullPointerException e) {
                    e.getMessage();
                }
            }
        };
        initiater.setOnUpdateListener(updateListener);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment

        View view = inflater.inflate(R.layout.fragment_drawer, container, false);
        listView = (ListView) view.findViewById(R.id.drawer_listview);
        userRole = new StringUtils().getUserRole(getActivity());
        renderData();
        rendered = true;
        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    public void renderData() {
        try {
            Bundle bundle = getArguments();
            featureList = (ArrayList<String>) bundle.getSerializable("FeatureList");

            LinkedHashMap<String, String> options = new LinkedHashMap<>(); // FeatureId and sub featureId
            LinkedHashMap<String, Icons> congigList = Config.featureBasedIcons;
            for (int i = 0; i < featureList.size(); i++) {
                String featureId = featureList.get(i);
                Icons icons = congigList.get(featureId);
                iconList.add(icons.getMenuIconSelected());
                featureNames.add(icons.getFeatureName());
                subFeatureId.add(icons.getSubFeatureId());
                options.put(featureId, icons.getSubFeatureId());
            }

            moreOptions = new ArrayList<>(options.entrySet());
            DrawerFragmentArrayAdapter arrayAdapter = new DrawerFragmentArrayAdapter(getActivity(), moreOptions, iconList, featureNames);
            if (listView != null) {
                listView.setAdapter(arrayAdapter);
                listviewClickHandler(listView, arrayAdapter);
            }
        } catch (NullPointerException e) {
            e.printStackTrace();
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

    @Override
    public void onResume() {
        super.onResume();
        if(!rendered) {
            renderData();
            rendered = true;
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Initiater.getInstance().remove(updateListener);
    }

    public void listviewClickHandler(final ListView listView, final DrawerFragmentArrayAdapter arrayAdapter){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Map.Entry<String, String> options = (Map.Entry<String, String>)listView.getItemAtPosition(position);

                switch (options.getKey()) {
                    case FEE_MANAGEMENT_FEATURE:
                        cancelNotification(options.getValue(), arrayAdapter);
                        if(userRole.equalsIgnoreCase(PARENT)) {
                            Intent feeManagement = new Intent(getActivity(), FeeManagementParentActivity.class);
                            startActivity(feeManagement);
                        } else if(userRole.equalsIgnoreCase(EMPLOYEE)) {
                            Intent intent = new Intent(getActivity(), FeeManagementEmployeeActivity.class);
                            startActivity(intent);
                        }
                        break;

                    case ATTENDANCE_FEATURE:
                        cancelNotification(options.getValue(), arrayAdapter);
                        if (userRole.equalsIgnoreCase(EMPLOYEE)) {
                            Intent attendance = new Intent(getActivity(), AttendenceActivity.class);
                            getActivity().startActivity(attendance);
                            break;
                        } else {
                            Intent attendance = new Intent(getActivity(), ParentAttendanceActivity.class);
                            getActivity().startActivity(attendance);
                            break;
                        }

                    case TRANSPORT_FEATURE:
                        cancelNotification(options.getValue(), arrayAdapter);
                        if (userRole.equalsIgnoreCase(EMPLOYEE)) {
                            Intent transport = new Intent(getActivity(), TeacherTransportActivity.class);
                            getActivity().startActivity(transport);
                        } else {
                            Intent transport = new Intent(getActivity(), ParentTransportActivity.class);
                            transport.putExtra(FROM, "DrawerFragment");
                            transport.putExtra("studentName", preferences.getString(FIRST_NAME,null));
                            transport.putExtra("className", preferences.getString(CLASS_NAME,null));
                            getActivity().startActivity(transport);
                        }
                        break;
                    case EVENTS_FEATURE:
                        cancelNotification(options.getValue(), arrayAdapter);
                        Intent events = new Intent(getActivity(), EventsFeatureActivity.class);
                        startActivity(events);
                        break;

                    case PHOTO_GALLERY_FEATURE:
                        cancelNotification(options.getValue(), arrayAdapter);
                        Intent gallery = new Intent(getActivity(), AlbumsActivity.class);
                        getActivity().startActivity(gallery);
                        break;
                    case ASSIGNMENT_FEATURE:
                        cancelNotification(options.getValue(), arrayAdapter);
                        if (userRole.equalsIgnoreCase(EMPLOYEE)) {
                            String permission = new StringUtils().getPermission(getActivity(), "create_assignments");
                            if (permission.contains("viewAll") || permission.contains("manageAll")) {
                                Intent homework = new Intent(getActivity(), AdminHomeworkActivity.class);
                                getActivity().startActivity(homework);
                            } else {
                                Intent homework = new Intent(getActivity(), HomeworkActivity.class);
                                getActivity().startActivity(homework);
                            }
                        } else {
                            Intent homework = new Intent(getActivity(), ParentHomeworkActivity.class);
                            getActivity().startActivity(homework);
                        }
                        break;
                    case EXAM_FEATURE:
                        cancelNotification(options.getValue(), arrayAdapter);
                        Intent feeManagement = new Intent(getActivity(), ExamActivity.class);
                        startActivity(feeManagement);
                        break;
                    case HALL_OF_FAME_FEATURE_ID:
                        cancelNotification(options.getValue(), arrayAdapter);
                        Intent hallOfFame = new Intent(getActivity(), HallOfFameActivity.class);
                        startActivity(hallOfFame);
                        break;
                    case VOICE_MMS_ID:
                        cancelNotification(options.getValue(), arrayAdapter);
                        Intent voiceMms = new Intent(getActivity(), ReceivedMMSActivity.class);
                        startActivity(voiceMms);
                        break;
                }
            }
        });
    }

    private void cancelNotification(String featureid, DrawerFragmentArrayAdapter arrayAdapter) {
        try {
            if (StringUtils.getInstance().getNotificationCount(getActivity(), featureid) != 0) {
               // MyReceiver.notificationCount = MyReceiver.notificationCount - MessageReceivingService.notificationCount.get(featureid);
                StringUtils.getInstance().cancelAllNotification(getActivity());
                StringUtils.getInstance().reduceNotificationCount(getActivity(), featureid);

             //   MessageReceivingService.notificationCount.put(featureid, 0);
                arrayAdapter.notifyDataSetInvalidated();
                listView.invalidate();
            }
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
    }
}

