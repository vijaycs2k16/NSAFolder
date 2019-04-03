package nexrise.publication.in.nexrise.Fragments;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.michael.easydialog.EasyDialog;

import org.json.JSONObject;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ProgressReport;
import nexrise.publication.in.nexrise.JsonFormation.ProgressReportJsonFormation;
import nexrise.publication.in.nexrise.JsonParser.ProgressReportJsonParser;
import nexrise.publication.in.nexrise.ProgressReportFeature.ProgressReportArrayAdapter;
import nexrise.publication.in.nexrise.ProgressReportFeature.ProgressResultsActivity;
import nexrise.publication.in.nexrise.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ProgressReportFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ProgressReportFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ProgressReportFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    View view;

    private OnFragmentInteractionListener mListener;

    public ProgressReportFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ProgressReportFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ProgressReportFragment newInstance(String param1, String param2) {
        ProgressReportFragment fragment = new ProgressReportFragment();
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
        view = inflater.inflate(R.layout.activity_progress_report, container, false);
        /*ActionBar actionBar = getSupportActionBar();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setElevation(0);
            actionBar.setTitle("Progress report");
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
        }*/

        ListView listView = (ListView)view.findViewById(R.id.progress_report_listview);
        ProgressReportJsonFormation jsonFormation = new ProgressReportJsonFormation();
        JSONObject jsonObject = jsonFormation.formJson();
        Log.v("Progress "," "+jsonObject);
        ProgressReportJsonParser parser = new ProgressReportJsonParser();
        List<ProgressReport> progressReportList = parser.parse(jsonObject);
        ProgressReportArrayAdapter arrayAdapter = new ProgressReportArrayAdapter(getActivity(), progressReportList);
        listView.setAdapter(arrayAdapter);


        listviewClick(listView);
        customTooltip(listView);
        return view;
    }

    private void customTooltip(final ListView listView) {
        final ImageView help = (ImageView)view.findViewById(R.id.help);

        help.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                TextView tooltip = (TextView) view.findViewById(R.id.textView53);
                tooltip.setText(R.string.progress_report);
                tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                new EasyDialog(getActivity()).setLayout(view)
                        .setLocationByAttachedView(help)
                        .setGravity(EasyDialog.GRAVITY_BOTTOM)
                        /*.setAnimationTranslationShow(EasyDialog.DIRECTION_X, 1000, -600, 100, -50, 50, 0)
                        .setAnimationAlphaShow(1000, 0.3f, 1.0f)
                        .setAnimationTranslationDismiss(EasyDialog.DIRECTION_X, 500, -50, 800)
                        .setAnimationAlphaDismiss(500, 1.0f, 0.0f)*/
                        .setTouchOutsideDismiss(true)
                        .setMatchParent(false)
                        .setBackgroundColor(getActivity().getResources().getColor(R.color.colorGreen))
                        .setMarginLeftAndRight(44, 34)
                        .show();
            }
        });
    }
    private void listviewClick(final ListView listView) {
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                ProgressReport progressReport = (ProgressReport)listView.getItemAtPosition(position);
                Intent intent = new Intent(getActivity(), ProgressResultsActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable("Progress report", progressReport);
                if(progressReport.getTest().equals("Formative assessment 1")){
                    intent.putExtra("Selection",2);
                    intent.putExtra("bundle",bundle);
                    startActivity(intent);
                }
                else if(progressReport.getTest().equals("Formative assessment 2")){
                    intent.putExtra("Selection",3);
                    intent.putExtra("bundle",bundle);
                    startActivity(intent);
                } else if (progressReport.getTest().equals("Summative assessment 1")){
                    intent.putExtra("Selection",4);
                    intent.putExtra("bundle",bundle);
                    startActivity(intent);
                }

            }
        });
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
