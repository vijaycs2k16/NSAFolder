package nexrise.publication.in.nexrise.ProgressReportFeature;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import org.json.JSONObject;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ProgressResult;
import nexrise.publication.in.nexrise.EventsFeature.OverallReportTableArrayAdapter;
import nexrise.publication.in.nexrise.JsonFormation.ProgressReportJsonFormation;
import nexrise.publication.in.nexrise.JsonParser.ProgressResultJsonParser;
import nexrise.publication.in.nexrise.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OverallReportTableFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link OverallReportTableFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class OverallReportTableFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public OverallReportTableFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment OverallReportTableFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static OverallReportTableFragment newInstance(String param1, String param2) {
        OverallReportTableFragment fragment = new OverallReportTableFragment();
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
        View view = inflater.inflate(R.layout.fragment_overall_report_table, container, false);
        String name = getArguments().getString("studentName");
        ProgressReportJsonFormation jsonFormation = new ProgressReportJsonFormation();
        JSONObject progressJson = jsonFormation.formJson();
        ProgressResultJsonParser parser = new ProgressResultJsonParser();
        List<ProgressResult> progressResultList = parser.parse(progressJson, "overall",name);

        ListView listView = (ListView)view.findViewById(R.id.tableListView);
        OverallReportTableArrayAdapter arrayAdapter = new OverallReportTableArrayAdapter(getActivity(), progressResultList);
        listView.setAdapter(arrayAdapter);

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
