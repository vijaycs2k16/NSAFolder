package nexrise.publication.in.nexrise.ProgressReportFeature;

import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.jjoe64.graphview.GraphView;
import com.jjoe64.graphview.helper.StaticLabelsFormatter;
import com.jjoe64.graphview.series.DataPoint;
import com.jjoe64.graphview.series.LineGraphSeries;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ProgressResult;
import nexrise.publication.in.nexrise.JsonFormation.ProgressReportJsonFormation;
import nexrise.publication.in.nexrise.JsonParser.ProgressResultJsonParser;
import nexrise.publication.in.nexrise.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OverallReportGraphFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link OverallReportGraphFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class OverallReportGraphFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    List<Integer> integers = new ArrayList<>();
    private OnFragmentInteractionListener mListener;

    public OverallReportGraphFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment OverallReportGraphFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static OverallReportGraphFragment newInstance(String param1, String param2) {
        OverallReportGraphFragment fragment = new OverallReportGraphFragment();
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
        View view = inflater.inflate(R.layout.fragment_overall_report_graph, container, false);
        setupGraphView(view);

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


    public List<Integer> dataPointsGenerator(String[] subjects){

        List<Integer> list = new ArrayList<>();
        int mark;

        for(int i=0; i<subjects.length; i++){
            switch (subjects[i]){
                case "A1":
                    mark = 8;
                    list.add(mark);
                    break;
                case "A2":
                    mark = 7;
                    list.add(mark);
                    break;
                case "B1":
                    mark = 6;
                    list.add(mark);
                    break;
                case "B2":
                    mark = 5;
                    list.add(mark);
                    break;
                case "C1":
                    mark = 4;
                    list.add(mark);
                    break;
                case "C2":
                    mark = 3;
                    list.add(mark);
                    break;
                case "D":
                    mark = 2;
                    list.add(mark);
                    break;
                case "E":
                    mark = 1;
                    list.add(mark);
                    break;
            }
        }

        return list;
    }

    public void setupGraphView(View view){
        String name = getArguments().getString("studentName");
        ProgressReportJsonFormation jsonFormation = new ProgressReportJsonFormation();
        JSONObject progressJson = jsonFormation.formJson();
        ProgressResultJsonParser parser = new ProgressResultJsonParser();
        Log.v("OVerall ","parent login "+name);
        List<ProgressResult> progressResultList = parser.parse(progressJson, "overall",name);

        integers = dataPointsGenerator(new String[]{progressResultList.get(0).getEnglish(), progressResultList.get(1).getEnglish(),
                    progressResultList.get(2).getEnglish()});
        GraphView graphView = (GraphView)view.findViewById(R.id.line_graph);
        LineGraphSeries<DataPoint> english = new LineGraphSeries<>(new DataPoint[]{
                new DataPoint(1, integers.get(0)),
                new DataPoint(2, integers.get(1)),
                new DataPoint(3, integers.get(2)),
        });

        integers = dataPointsGenerator(new String[]{progressResultList.get(0).getTamil(),progressResultList.get(1).getTamil(),
                    progressResultList.get(2).getTamil()});
        LineGraphSeries<DataPoint> tamil = new LineGraphSeries<>(new DataPoint[]{
                new DataPoint(1, integers.get(0)),
                new DataPoint(2, integers.get(1)),
                new DataPoint(3, integers.get(2)),
        });

        integers = dataPointsGenerator(new String[]{progressResultList.get(0).getMaths(),progressResultList.get(1).getMaths(),
                 progressResultList.get(2).getMaths()});
        LineGraphSeries<DataPoint> maths = new LineGraphSeries<>(new DataPoint[]{
                new DataPoint(1, integers.get(0)),
                new DataPoint(2, integers.get(1)),
                new DataPoint(3, integers.get(2)),
        });

        integers = dataPointsGenerator(new String[]{progressResultList.get(0).getScience(),progressResultList.get(1).getScience()
                ,progressResultList.get(2).getScience()});
        LineGraphSeries<DataPoint> science = new LineGraphSeries<>(new DataPoint[]{
                new DataPoint(1, integers.get(0)),
                new DataPoint(2, integers.get(1)),
                new DataPoint(3, integers.get(2)),
        });

        integers = dataPointsGenerator(new String[]{progressResultList.get(0).getSocial(),progressResultList.get(1).getSocial(),
                progressResultList.get(2).getSocial()});
        LineGraphSeries<DataPoint> social = new LineGraphSeries<>(new DataPoint[]{
                new DataPoint(1, integers.get(0)),
                new DataPoint(2, integers.get(1)),
                new DataPoint(3, integers.get(2)),
        });

        english.setColor(Color.parseColor("#31A231"));
        tamil.setColor(Color.parseColor("#004cff"));
        maths.setColor(Color.parseColor("#f99811"));
        science.setColor(Color.parseColor("#FF0000"));
        social.setColor(Color.parseColor("#000000"));

        graphView.getViewport().setXAxisBoundsManual(true);
        graphView.getViewport().setYAxisBoundsManual(true);

        graphView.getViewport().setMinX(1);
        graphView.getViewport().setMaxX(3);

        graphView.getViewport().setMinY(1);
        graphView.getViewport().setMaxY(8);

        String[] horizontal = {"FA 1","FA 2", "SA 1"};
        String[] vertical = {"E","D","C2","C1","B2","B1","A2","A1"};

        StaticLabelsFormatter labelsFormatter = new StaticLabelsFormatter(graphView);
        labelsFormatter.setHorizontalLabels(horizontal);
        labelsFormatter.setVerticalLabels(vertical);
        graphView.getGridLabelRenderer().setLabelFormatter(labelsFormatter);

        graphView.addSeries(english);
        graphView.addSeries(tamil);
        graphView.addSeries(maths);
        graphView.addSeries(science);
        graphView.addSeries(social);
    }
}
