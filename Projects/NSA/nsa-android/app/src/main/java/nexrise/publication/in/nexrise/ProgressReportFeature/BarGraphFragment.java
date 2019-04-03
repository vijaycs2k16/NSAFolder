package nexrise.publication.in.nexrise.ProgressReportFeature;

import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.jjoe64.graphview.GraphView;
import com.jjoe64.graphview.GridLabelRenderer;
import com.jjoe64.graphview.ValueDependentColor;
import com.jjoe64.graphview.helper.StaticLabelsFormatter;
import com.jjoe64.graphview.series.BarGraphSeries;
import com.jjoe64.graphview.series.DataPoint;

import org.json.JSONException;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.BeanClass.ExamMarks;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.ExamMarkParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link BarGraphFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link BarGraphFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class BarGraphFragment extends Fragment implements Constants {
    TextView textView;
    GraphView graph;
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public BarGraphFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment BarGraphFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static BarGraphFragment newInstance(String param1, String param2) {
        BarGraphFragment fragment = new BarGraphFragment();
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
        View view = inflater.inflate(R.layout.fragment_bar_graph, container, false);
        graph = (GraphView) view.findViewById(R.id.bar_graph);

        Bundle bundle = getArguments();
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String userId = preferences.getString(CURRENT_USERNAME, null);

        textView = (TextView) view.findViewById(R.id.student_details);

        if(bundle.containsKey("examObject")) {
            Exam exam = (Exam) bundle.getSerializable("examObject");
            assert exam != null;
            String url = BASE_URL + API_VERSION_ONE + MARKS + USER + DETAILS + userId + "/" + exam.getScheduleId();
            Log.v("Marks"," "+url);
            textView.setText(preferences.getString(FIRST_NAME,null));
            renderData(view,url);
        } else if(bundle.containsKey("markList")){
            Log.v("List for Graph","DAta"+bundle.getSerializable("markList"));
            ArrayList<ExamMarks> examMarkList = (ArrayList<ExamMarks>) bundle.getSerializable("markList");
            textView.setText(bundle.getString(FIRST_NAME));
            graphRender(examMarkList,view);
        } else if (bundle.containsKey(SCHEDULE_ID) && bundle.containsKey(EXAM_NAME)) {
            String scheduleId = bundle.getString(SCHEDULE_ID);
            String url = BASE_URL + API_VERSION_ONE + MARKS + USER + DETAILS + userId + "/" + scheduleId;
            Log.v("Marks"," "+url);
            textView.setText(preferences.getString(FIRST_NAME,null));
            renderData(view,url);
        }
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

    private void renderData(final View view, String url) {

        GETUrlConnection getMarkList = new GETUrlConnection(getActivity(), url, null) {
            RelativeLayout progressBarContainer = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent =(TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBarContainer.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    new StringUtils().checkSession(response);
                    progressBar.setVisibility(View.INVISIBLE);
                    progressBarContainer.setVisibility(View.GONE);
                    ExamMarkParser exam = new ExamMarkParser();
                    Exam examMarks =exam.examMarksParser(response);
                    ArrayList<ExamMarks> marksList = examMarks.getMarkList();
                    graphRender(marksList,view);

                } catch (NullPointerException | JSONException e) {
                    if(progressBarContainer.getVisibility() == View.GONE)
                        progressBarContainer.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getMarkList.execute();
    }

    public void graphRender(ArrayList<ExamMarks> marksList, View view) {
        ArrayList<String> subjects = new ArrayList<>();
        ArrayList<String> marks = new ArrayList<>();
        for(int i=0;i<marksList.size();i++){

            Log.v("Subject","name"+marksList.get(i).getMarksObtained());
            if(!marksList.get(i).getMarksObtained().equalsIgnoreCase(" - ") && !marksList.get(i).getMarksObtained().equalsIgnoreCase("0")) {
                marks.add(marksList.get(i).getMarksObtained());
                subjects.add(subjectName(marksList.get(i).getSubjectName()));
            }
            /*else
                marks.add("0");*/
            Log.v("Subject","name"+marksList.get(i).getSubjectName());
        }

        if(marks.size() == 0) {
            RelativeLayout progressBarContainer = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
            TextView noContent =(TextView)view.findViewById(R.id.no_content);
            if(progressBarContainer.getVisibility() == View.GONE)
                progressBarContainer.setVisibility(View.VISIBLE);
            noContent.setVisibility(View.VISIBLE);
            return;
        }

        if(marks.size() > 10)
            setWidth800dp();

        DataPoint[] dp = new DataPoint[marks.size()];
        for(int i=0;i<marks.size();i++){
            try {
                dp[i] = new DataPoint(i, Double.parseDouble(marks.get(i)));
                Log.v("bar ", "mark " + Double.parseDouble(marks.get(i)));
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        BarGraphSeries<DataPoint> series = new BarGraphSeries<>(dp);
        graph.addSeries(series);
        /*graph.getViewport().setScalable(true);
        graph.getViewport().setScalableY(true);*/
        graph.getViewport().setScrollable(true); // enables horizontal scrolling
        graph.getViewport().setScrollableY(true);

        graph.getViewport().setYAxisBoundsManual(true);
        graph.getViewport().setMinY(0);
        graph.getViewport().setMaxY(100);
        String[] stockArr = new String[subjects.size()];
        stockArr = subjects.toArray(stockArr);
        graph.getGridLabelRenderer().setNumHorizontalLabels(stockArr.length);
        //graph.getGridLabelRenderer().setGridStyle( GridLabelRenderer.GridStyle.NONE );
        graph.getGridLabelRenderer().setGridStyle(GridLabelRenderer.GridStyle.HORIZONTAL);
        //graph.getViewport().setDrawBorder(true);
        graph.getViewport().setScrollable(true);
        if(stockArr.length > 1) {
            StaticLabelsFormatter labelsFormatter = new StaticLabelsFormatter(graph);
            labelsFormatter.setHorizontalLabels(stockArr);
            graph.getGridLabelRenderer().setLabelFormatter(labelsFormatter);
        }
        // styling
        series.setValueDependentColor(new ValueDependentColor<DataPoint>() {
            @Override
            public int get(DataPoint data) {
                return Color.rgb((int) data.getX()*255/4, (int) Math.abs(data.getY()*255/6), 100);
            }
        });
        series.setSpacing(60);

        // draw values on top
        series.setDrawValuesOnTop(true);
        series.setValuesOnTopColor(Color.RED);
    }

    private void setWidth800dp() {
        ViewGroup.LayoutParams params = graph.getLayoutParams();
        // Changes the height and width to the specified *pixels*
        float dp = getActivity().getResources().getDisplayMetrics().density;
        params.width = (int)(800 * dp + 0.5f);
        graph.setLayoutParams(params);
    }

    private String subjectName(String str){
        return str.length() < 3 ? str : str.substring(0, 3);
    }
}
