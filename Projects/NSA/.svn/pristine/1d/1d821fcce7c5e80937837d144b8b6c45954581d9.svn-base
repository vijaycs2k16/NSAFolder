package nexrise.publication.in.nexrise.ProgressReportFeature;


import android.content.SharedPreferences;
import android.graphics.Color;
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
import com.jjoe64.graphview.helper.StaticLabelsFormatter;
import com.jjoe64.graphview.series.BarGraphSeries;
import com.jjoe64.graphview.series.DataPoint;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 */
public class OverallGraphFragment extends Fragment implements Constants {
    View view;
    GraphView graph;

    public OverallGraphFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment

        view = inflater.inflate(R.layout.fragment_overallgraph, container, false);
        graph = (GraphView) view.findViewById(R.id.bar_graph);

        TextView classAndSection = (TextView) view.findViewById(R.id.student_details);
        Bundle bundle = getArguments();
        String className = bundle.getString(CLASS_NAME);
        String sectionName = bundle.getString(SECTION_NAME);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String name = className + " - " + sectionName+" "+"  "+"("+preferences.getString(CURRENT_ACADEMIC_YEAR,ACADEMIC_YEAR)+")";
        classAndSection.setText(name);
        String classId = bundle.getString(CLASS_ID);
        String sectionId = bundle.getString(SECTION_ID);
        String scheduleId = "";

        if(bundle.containsKey(SCHEDULE_ID))
            scheduleId = bundle.getString(SCHEDULE_ID);
        else if (bundle.containsKey("examObject")) {
            Exam exam = (Exam) bundle.getSerializable("examObject");
            assert exam != null;
            scheduleId = exam.getScheduleId();
        }
        String examUrl = BASE_URL + API_VERSION_ONE + MARKS + scheduleId+"/" + classId +"/"+ sectionId;
        fetchMarkListId(view, examUrl);
        return view;
    }

    private void fetchMarkListId(final View view, String url) {
        Log.v("MarksList ","url "+url);
        GETUrlConnection markListId = new GETUrlConnection(getActivity(), url, null) {
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
                Log.v("MarksList","Detail"+response);
                if(response != null) {
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject jsonObject = new JSONObject(response);
                        JSONObject dataObject = jsonObject.getJSONObject(DATA);
                        JSONArray userArray = dataObject.getJSONArray("users");

                        String scheduleId = userArray.getJSONObject(0).getString("marklistId");
                        fetchOverAllMarkList(view, scheduleId);
                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    } catch (Exception e) {
                        displayNothingToShow(progressBarContainer, progressBar, noContent);
                    }
                } else
                    displayNothingToShow(progressBarContainer, progressBar, noContent);
            }
        };
        markListId.execute();
    }

    private void fetchOverAllMarkList(final View view, String markListId) {
        String url = BASE_URL + API_VERSION_ONE + MARKS + STATISTICS + markListId;
        GETUrlConnection getOverallMarkList = new GETUrlConnection(getActivity(), url, null) {
            RelativeLayout progressBarContainer = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent =(TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                if(progressBarContainer.getVisibility() == View.GONE)
                    progressBarContainer.setVisibility(View.VISIBLE);
                if(progressBar.getVisibility() == View.INVISIBLE)
                    progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                if (response != null) {
                    try {
                        new StringUtils().checkSession(response);
                        Log.v("OverAllMARK ", "list " + response);
                        progressBar.setVisibility(View.INVISIBLE);
                        progressBarContainer.setVisibility(View.GONE);
                        valuesPlot(response);

                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    } catch (Exception e) {
                        displayNothingToShow(progressBarContainer, progressBar, noContent);
                        e.printStackTrace();
                    }
                } else
                    displayNothingToShow(progressBarContainer, progressBar, noContent);
            }
        };
        getOverallMarkList.execute();
    }

    private void valuesPlot(String response) throws JSONException {
        JSONObject jsonObject = new JSONObject(response);
        JSONObject dataObject = jsonObject.getJSONObject(DATA);
        JSONArray rangesArray = dataObject.getJSONArray("ranges");
        JSONArray valuesArray = dataObject.getJSONArray("values");
        ArrayList<String> ranges = new ArrayList<>();
        ArrayList<Integer> values= new ArrayList<>();
        if(valuesArray.length() !=0) {
            if (rangesArray.length() == valuesArray.length()) {
                for (int i = 0; i < rangesArray.length(); i++) {
                    Log.v("Statistics ", "val "+valuesArray.get(i));
                    if(!valuesArray.get(i).toString().equals("0")) {
                        ranges.add((String) rangesArray.get(i));
                        values.add((Integer) valuesArray.get(i));
                    }
                }
            }

            if(values.size() == 0) {
                RelativeLayout progressBarContainer = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
                ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
                TextView noContent =(TextView)view.findViewById(R.id.no_content);
                displayNothingToShow(progressBarContainer, progressBar, noContent);
                return;
            }
            if(values.size() > 5)
                setWidth800dp();

            DataPoint[] dp = new DataPoint[ranges.size()];
            for (int i = 0; i < values.size(); i++) {
                dp[i] = new DataPoint(i, values.get(i));
            }
            BarGraphSeries<DataPoint> series = new BarGraphSeries<>(dp);
            graph.addSeries(series);
            String[] stockArr = new String[ranges.size()];
            stockArr = ranges.toArray(stockArr);
            graph.getGridLabelRenderer().setNumHorizontalLabels(stockArr.length);
            graph.getGridLabelRenderer().setGridStyle(GridLabelRenderer.GridStyle.HORIZONTAL);
            graph.getViewport().setScrollable(true);
            graph.setTitle((String) getResources().getText(R.string.overall_exam_report));
            StaticLabelsFormatter labelsFormatter = new StaticLabelsFormatter(graph);
            labelsFormatter.setHorizontalLabels(stockArr);
            graph.getGridLabelRenderer().setLabelFormatter(labelsFormatter);
            series.setSpacing(60);

            // draw values on top
            series.setDrawValuesOnTop(true);
            series.setValuesOnTopColor(Color.RED);

        } else {
            throw new JSONException("Empty Array");
        }
    }

    private void setWidth800dp() {
        ViewGroup.LayoutParams params = graph.getLayoutParams();
        // Changes the height and width to the specified *pixels*
        float dp = getActivity().getResources().getDisplayMetrics().density;
        params.width = (int)(800 * dp + 0.5f);
        graph.setLayoutParams(params);
    }

    private void displayNothingToShow(RelativeLayout progressBarContainer, ProgressBar progressBar, TextView noContent) {
        if (progressBarContainer.getVisibility() == View.GONE)
            progressBarContainer.setVisibility(View.VISIBLE);
        progressBar.setVisibility(View.INVISIBLE);
        noContent.setVisibility(View.VISIBLE);
    }
 }
