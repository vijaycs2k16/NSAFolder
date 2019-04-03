package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONException;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.BeanClass.TimeTableObject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.TodayTimeTableParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link TomorrowTimeTableFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link TomorrowTimeTableFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class TomorrowTimeTableFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    SharedPreferences preferences;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private String dayLongName;
    private List<TimeTableObject> timeTable;

    private OnFragmentInteractionListener mListener;

    public TomorrowTimeTableFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment TomorrowTimeTableFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static TomorrowTimeTableFragment newInstance(String param1, String param2) {
        TomorrowTimeTableFragment fragment = new TomorrowTimeTableFragment();
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
        final View view = inflater.inflate(R.layout.fragment_tomorrow_time_table, container, false);
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String classId = preferences.getString(CLASS_ID,null);
        String sectionId = preferences.getString(SECTION_ID,null);
        Bundle bundle = getArguments();
        Calendar calendar = Calendar.getInstance();
        if(getArguments().containsKey("Classes")) {
            Log.v("Classes ","Contains ");
            Classes classes = (Classes) bundle.getSerializable("Classes");
            classId = classes.getClassId();
            sectionId = classes.getSectionId();
        }
        calendar.add(Calendar.DAY_OF_WEEK,1);
        dayLongName = calendar.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.getDefault());
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String tommorowDate = df.format(calendar.getTime()).toString();
        Log.v("dayLong","Name"+dayLongName);
        TextView todayDate = (TextView) view.findViewById(R.id.tomDate);
        todayDate.setText(dayLongName +System.getProperty("line.separator"));
        String dayId = new StringUtils().dayId(dayLongName);
        Log.v("day","ID"+dayId);
        if(getArguments().containsKey("Classes")) {
            Log.v("Classes ","Contains ");
            Classes classes = (Classes) bundle.getSerializable("Classes");
            classId = classes.getClassId();
            sectionId = classes.getSectionId();
        }
        String tomorrowtimetableurl = BASE_URL + API_VERSION_ONE + TIMETABLE + CLASS +classId +SECTION+sectionId+ "/"+ dayId +"?date="+tommorowDate;
        Log.v("tommorow","url"+tomorrowtimetableurl);
        GETUrlConnection url = new GETUrlConnection(getActivity(),tomorrowtimetableurl,null){
            RelativeLayout progressBarLayout = (RelativeLayout) view.findViewById(R.id.progress_bar);
            ProgressBar progressBar = (ProgressBar) view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView) view.findViewById(R.id.no_content);

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
                Log.v("tomorrow","timetable" +response);
                progressBar.setVisibility(View.INVISIBLE);
                try {
                    new StringUtils().checkSession(response);
                    progressBarLayout.setVisibility(View.GONE);
                    TodayTimeTableParser todayTimeTableParser = new TodayTimeTableParser();
                    timeTable = todayTimeTableParser.getTimeTable(response);
                    ListView listView = (ListView) view.findViewById(R.id.listview1);
                    AddTodayTimeTableArrayAdapter  adapter = new AddTodayTimeTableArrayAdapter(getActivity(),timeTable,"Tomorrow");
                    listView.setAdapter(adapter);
                } catch (NullPointerException | JSONException e){
                    e.printStackTrace();
                    if(progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() ==View.INVISIBLE)
                    progressBarLayout.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        url.execute();

        return view;
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
