package nexrise.publication.in.nexrise.FeeManagement;

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

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.FeeManagement;
import nexrise.publication.in.nexrise.JsonParser.FeesManagementJsonParser;
import nexrise.publication.in.nexrise.R;
/**
 * Created by praga on 28-02-2017.
 */

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link FeeHistoryFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link FeeHistoryFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class FeeHistoryFragment extends Fragment {
    // TODO: Rename parameter argum.ents, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    PendingFeesArrayAdapter arrayAdapter;
    ArrayList<FeeManagement> paidfeelist;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public FeeHistoryFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment FeeHistoryFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static FeeHistoryFragment newInstance(String param1, String param2) {
        FeeHistoryFragment fragment = new FeeHistoryFragment();
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
        View view = inflater.inflate(R.layout.fragment_fee_history, container, false);
        customTooltip(view);

        ListView listView = (ListView)view.findViewById(R.id.fee_history_listview);

         paidfeelist = FeesManagementJsonParser.paidFeeList;
        Log.v("paid List",""+paidfeelist);
        if(!paidfeelist.isEmpty()){

            arrayAdapter = new PendingFeesArrayAdapter(getActivity(), paidfeelist, "Paid ");
            listView.setAdapter(arrayAdapter);
            listviewClick(listView);

        }else {
            TextView emptyListview = (TextView)view.findViewById(R.id.no_content);
            emptyListview.setVisibility(View.VISIBLE);
        }
            return view;
    }
    public void customTooltip(final View view){

        final ImageView help = (ImageView) view.findViewById(R.id.help);
        help.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                TextView tooltip = (TextView)view.findViewById(R.id.textView53);
                tooltip.setText(R.string.parent_fee_history);
                tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                new EasyDialog(getActivity()).setLayout(view)
                        .setLocationByAttachedView(help)
                        .setGravity(EasyDialog.GRAVITY_BOTTOM)
                        .setTouchOutsideDismiss(true)
                        .setMatchParent(false)
                        .setBackgroundColor(getActivity().getResources().getColor(R.color.colorGreen))
                        .setMarginLeftAndRight(44,34)
                        .show();
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
    public void listviewClick(final ListView listView){

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                FeeManagement fees = (FeeManagement) listView.getItemAtPosition(position);
                Intent intent = new Intent(getActivity(), FeesDetailsActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable("FeesDetails", fees);
                bundle.putString("From", "Fee History");
                intent.putExtra("FeesDetailsBundle", bundle);
                startActivity(intent);
            }
        });
    }

    public void search(String text){
        if(arrayAdapter != null){
            if(paidfeelist.size() == 0)
                return;
            CharSequence s = text;
            Log.v("search","text"+text);
            arrayAdapter.getFilter().filter(s);
        }
    }
}
