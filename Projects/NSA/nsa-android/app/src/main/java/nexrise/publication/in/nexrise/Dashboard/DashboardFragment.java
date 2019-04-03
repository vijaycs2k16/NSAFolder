package nexrise.publication.in.nexrise.Dashboard;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import com.daimajia.slider.library.SliderLayout;
import com.daimajia.slider.library.SliderTypes.BaseSliderView;
import com.daimajia.slider.library.SliderTypes.TextSliderView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Timer;
import java.util.TimerTask;

import nexrise.publication.in.nexrise.BeanClass.Notify;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.Gallery.AlbumsActivity;
import nexrise.publication.in.nexrise.HomeworkFeature.AdminHomeworkActivity;
import nexrise.publication.in.nexrise.HomeworkFeature.HomeworkActivity;
import nexrise.publication.in.nexrise.Notifications.NotificationLogActivity;
import nexrise.publication.in.nexrise.ParentFeatures.HomeworkFeature.ParentHomeworkActivity;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TransportManager.ParentTransportActivity;
import nexrise.publication.in.nexrise.TransportManager.TeacherTransportActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link DashboardFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class DashboardFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    Timer timer;
    Timer timer1;
    TextView first;
    TextView second;
    TextView third;
    TextView fourth;
    TextView fifth;
    TextView sixth;
    TextView seventh;
    TextView eighth;
    ArrayList<TextView> textViews;
    ArrayList<Notify> allNotifications = null;
    LinearLayout homework;
    LinearLayout albums;
    LinearLayout transport;
    String userRole;
    SharedPreferences preferences;
    String[] imageUrl;
    SliderLayout sliderLayout;
    String schoolId;
    StringUtils stringUtils;

    private OnFragmentInteractionListener mListener;

    public DashboardFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment DashboardFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static DashboardFragment newInstance(String param1, String param2) {
        DashboardFragment fragment = new DashboardFragment();
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
        final View view = inflater.inflate(R.layout.fragment_dashboard, container, false);
        textViews = new ArrayList<>();
        sliderLayout = (SliderLayout) view.findViewById(R.id.slider_layout);
        sliderLayout.clearFocus();
        userRole = new StringUtils().getUserRole(getActivity());
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        schoolId = preferences.getString(SCHOOL_ID,null);

        init(view);
        dashboardImage();

        renderData();
        footerClickHandler(view);
        handleScroll(view);
        return view;
    }

    private void dashboardImage() {
        sliderLayout.setPresetTransformer(SliderLayout.Transformer.Accordion);
        sliderLayout.setPresetIndicator(SliderLayout.PresetIndicators.Center_Bottom);
        sliderLayout.setDuration(3000);
        sliderLayout.startAutoCycle();

        final String schoolCredentialsURL = BASE_URL + API_VERSION_ONE + SCHOOLS;
        final String baseUrl = AWS_BASE_URL + schoolId + "/";
        GETUrlConnection getSchoolCredentials = new GETUrlConnection(getActivity(), schoolCredentialsURL, null) {
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    Log.v("SCHool ","details "+response);
                    JSONObject credentialsObj = new JSONObject(response);
                    JSONObject schoolCredentialsData = credentialsObj.getJSONObject(DATA);

                    if (schoolCredentialsData.has("image_url")) {
                        String images = schoolCredentialsData.getString("image_url");
                        if (images != null) {
                            JSONArray array = new JSONArray(images);
                            if (array.length() != 0) {
                                Log.v("image1 ", "url" + array);
                                for (int i = 0; i < array.length(); i++) {
                                    JSONObject object = array.getJSONObject(i);
                                    String imageId = object.getString("id");
                                    //String imageName = object.getString("name");
                                    String completeUrl = baseUrl + Uri.encode(imageId);
                                    Log.v("image1 ", "url" + completeUrl);

                                    TextSliderView textSliderView = new TextSliderView(getActivity());
                                    textSliderView.image(completeUrl)
                                            .setScaleType(BaseSliderView.ScaleType.CenterCrop)
                                            .setScaleType(BaseSliderView.ScaleType.CenterCrop);
                                    sliderLayout.addSlider(textSliderView);

                                }
                            }
                        } else {
                            defaultImages();
                        }
                    } else {
                        defaultImages();
                    }
                } catch (NullPointerException | JSONException e) {
                    e.printStackTrace();
                    defaultImages();
                }
            }
        };
        getSchoolCredentials.execute();
    }

    private void defaultImages() {
        int[] images = new int[]{R.drawable.logo1};

        for (int i = 0; i < images.length; i++) {
            TextSliderView textSliderView = new TextSliderView(getActivity());
            textSliderView.image(images[i])
                    .setScaleType(BaseSliderView.ScaleType.FitCenterCrop)
                    .setScaleType(BaseSliderView.ScaleType.FitCenterCrop);
            sliderLayout.addSlider(textSliderView);
        }
    }

    private void footerClickHandler(View view) {
        homework = (LinearLayout)view.findViewById(R.id.first_footer);
        albums = (LinearLayout)view.findViewById(R.id.second_footer);
        transport = (LinearLayout)view.findViewById(R.id.third_footer);
        String value = Utility.readProperty(getActivity(), DISABLE_SHORTCUT);
        if (value.contains(ACCESS_ID)){
            LinearLayout linearLayout = (LinearLayout)view.findViewById(R.id.footer);
            linearLayout.setWeightSum(2);
            transport.setVisibility(View.GONE);
        } else if (value.contains(schoolId)){
            LinearLayout linearLayout = (LinearLayout)view.findViewById(R.id.footer);
            linearLayout.setWeightSum(2);
            transport.setVisibility(View.GONE);
        }

        homework.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
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
                    Intent parentHomework = new Intent(getActivity(), ParentHomeworkActivity.class);
                    getActivity().startActivity(parentHomework);
                }
            }
        });

        albums.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                    Intent albums = new Intent(getActivity(), AlbumsActivity.class);
                    getActivity().startActivity(albums);
            }
        });

        transport.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (userRole.equalsIgnoreCase(EMPLOYEE)) {
                    Intent teacherTransport = new Intent(getActivity(), TeacherTransportActivity.class);
                    getActivity().startActivity(teacherTransport);
                } else {
                    Intent parentTransport = new Intent(getActivity(), ParentTransportActivity.class);
                    getActivity().startActivity(parentTransport);
                }
            }
        });
    }

    private void init(View view) {

        first = (TextView) view.findViewById(R.id.textView54);
        first.setTag("1");
        second = (TextView) view.findViewById(R.id.textView55);
        second.setTag("2");
        third = (TextView) view.findViewById(R.id.textView57);
        third.setTag("3");
        fourth = (TextView) view.findViewById(R.id.textView56);
        fourth.setTag("4");
        fifth = (TextView) view.findViewById(R.id.textView58);
        fifth.setTag("5");
        sixth = (TextView) view.findViewById(R.id.textView61);
        sixth.setTag("6");
        seventh = (TextView) view.findViewById(R.id.textView62);
        seventh.setTag("7");
        eighth = (TextView) view.findViewById(R.id.textView59);
        eighth.setTag("8");

        textViews.add(first);
        textViews.add(second);
        textViews.add(third);
        textViews.add(fourth);
        textViews.add(fifth);
        textViews.add(sixth);
        textViews.add(seventh);
        textViews.add(eighth);
    }

    private void handleScroll(View view) {
        try {
            final ScrollView scrollView = (ScrollView) view.findViewById(R.id.dashboard_scroll);
            final RelativeLayout footer = (RelativeLayout) view.findViewById(R.id.layout_new);

            scrollView.setOnTouchListener(new View.OnTouchListener() {
                @Override
                public boolean onTouch(View view, MotionEvent motionEvent) {
                    if (scrollView.getScrollY() > 14) {
                        if (footer.getVisibility() == VISIBLE) {
                            footer.startAnimation(AnimationUtils.loadAnimation(getActivity(), R.anim.slide_down));
                            footer.setVisibility(View.GONE);
                        }
                    } else {
                        if (footer.getVisibility() == GONE) {
                            footer.startAnimation(AnimationUtils.loadAnimation(getActivity(), R.anim.slide_up));
                            footer.setVisibility(View.VISIBLE);
                        }
                    }
                    return false;
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void renderData() {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String id = preferences.getString(CURRENT_USERNAME, null);
        String NotificationCredential = BASE_URL + API_VERSION_ONE + NOTIFICATION + LOG + id;
        Log.v("Dashboard ","url "+NotificationCredential);
        GETUrlConnection GETUrlConnection = new GETUrlConnection(getActivity(), NotificationCredential, null) {

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                for (int i = 0; i < textViews.size(); i++)
                    setMessageText(textViews.get(i), (String) getResources().getText(R.string.loading));
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    Log.v("Dashboard ", " " + response);
                    new StringUtils().checkSession(response);

                    allNotifications = notificationParser(response);
                    NotificationLogActivity notificationLog = new NotificationLogActivity();
                    NotificationLogActivity.UpdatedList updatedList = notificationLog.new UpdatedList();
                    Collections.sort(allNotifications, updatedList);
                    Collections.reverse(allNotifications);

                    for (int i = 0; i < textViews.size(); i++) {
                        try {
                            String tag = String.valueOf(textViews.get(i).getTag());
                            if (tag.equals("4") || tag.equals("5") || tag.equals("6") || tag.equals("7")) {
                                String message = allNotifications.get(i).getTemplateId() == null ? allNotifications.get(i).getTitle() : allNotifications.get(i).getPushTemplateTitle();
                                setMessageText(textViews.get(i), message);
                            } else {
                                String message = allNotifications.get(i).getPushTemplateMessage();
                                setMessageText(textViews.get(i), message);
                            }
                        } catch (IndexOutOfBoundsException e) {
                            setMessageText(textViews.get(i), (String) getResources().getText(R.string.no_notifications));
                            e.printStackTrace();
                        }
                    }
                } catch (JSONException | NullPointerException e) {
                    setErrorText((String) getResources().getText(R.string.no_notifications));
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        GETUrlConnection.execute();
    }

    private void setMessageText(TextView textView, String text) {
        textView.setText(text);
    }

    private void setErrorText(String text) {
        for (int i = 0; i < textViews.size(); i++)
            textViews.get(i).setText(text);
    }

    private void dashboardFlip(final View view) {
        final Handler handler = new Handler();
        TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Animation animation = AnimationUtils.loadAnimation(getActivity(), R.anim.to_top_flip);
                            LinearLayout linearLayout = (LinearLayout) view.findViewById(R.id.linear_layout1);
                            linearLayout.setAnimation(animation);
                            linearLayout.startAnimation(animation);
                        } catch (NullPointerException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        };
        timer.schedule(timerTask, 2000, 10500);

        TimerTask timerTask1 = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Animation animation = AnimationUtils.loadAnimation(getActivity(), R.anim.to_middle);
                            LinearLayout linearLayout = (LinearLayout) view.findViewById(R.id.linear_layout2);
                            linearLayout.setAnimation(animation);
                            linearLayout.startAnimation(animation);
                        } catch (NullPointerException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        };
        timer1.schedule(timerTask1, 1000, 9500);

        TimerTask timerTask2 = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Animation animation = AnimationUtils.loadAnimation(getActivity(), R.anim.from_top_flip);
                            LinearLayout linearLayout = (LinearLayout) view.findViewById(R.id.linear_layout3);
                            linearLayout.setAnimation(animation);
                            linearLayout.startAnimation(animation);
                        } catch (NullPointerException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        };
        timer1.schedule(timerTask2, 1500, 10000);
    }

    private ArrayList<Notify> notificationParser(String jsonString) throws JSONException, NullPointerException {
        ArrayList<Notify> notificationList = new ArrayList<Notify>();

        JSONObject jsonObject = new JSONObject(jsonString);
        JSONArray jsonArray = jsonObject.getJSONArray(DATA);
        if (jsonArray.length() != 0) {
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject finalobj = jsonArray.getJSONObject(i);
                String notificationId = finalobj.getString("notification_id");
                String id = finalobj.getString("id");
                String pushTemplateMessage = finalobj.getString("push_template_message");
                String pushTemplateTitle = "";
                if (finalobj.has("push_template_title"))
                    pushTemplateTitle = finalobj.getString("push_template_title");
                String title = finalobj.getString("title");
                String updatedDate = finalobj.getString("updated_date");

                Notify notify = new Notify(notificationId,id, null, null, updatedDate, pushTemplateMessage, null, null, pushTemplateTitle, title, null, null, null, null, null, null);
                notificationList.add(notify);
            }
        } else {
            throw new JSONException("Empty json");
        }
        return notificationList;
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
        try {
            timer.cancel();
            timer1.cancel();
        } catch (NullPointerException e) {
            e.getMessage();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        try {
            timer = new Timer();
            timer1 = new Timer();
            View view = getView();
            if(allNotifications != null && view != null)
                dashboardFlip(view);
        } catch (NullPointerException e) {
            e.getMessage();
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            timer.cancel();
            timer1.cancel();
        } catch (NullPointerException e) {
            e.getMessage();
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
    }

    @Override
    public void onDetach() {
        super.onDetach();
        try {
            timer.cancel();
            timer1.cancel();
        } catch (NullPointerException e) {
            e.getMessage();
        }
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
