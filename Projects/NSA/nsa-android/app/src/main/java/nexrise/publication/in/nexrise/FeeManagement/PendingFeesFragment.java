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
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.FeesManagementJsonParser;
import nexrise.publication.in.nexrise.R;
/**
 * Created by praga on 28-02-2017.
 */

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link PendingFeesFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link PendingFeesFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class PendingFeesFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    ListView listView;
    public static boolean rendered = false;
    View view;
    PendingFeesArrayAdapter arrayAdapter;
    ArrayList<FeeManagement> dueFeeList;

    private OnFragmentInteractionListener mListener;

    public PendingFeesFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment PendingFeesFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static PendingFeesFragment newInstance(String param1, String param2) {
        PendingFeesFragment fragment = new PendingFeesFragment();
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
        view = inflater.inflate(R.layout.fragment_pending_fees, container, false);
        listView = (ListView)view.findViewById(R.id.pending_fees_listview);
        customTooltip(view);
        renderData();
        rendered = true;
        return view;
    }

    public void renderData() {
        dueFeeList = FeesManagementJsonParser.dueFeeList;
        if (!dueFeeList.isEmpty()){

            arrayAdapter = new PendingFeesArrayAdapter(getActivity(),dueFeeList, "Due ");
            listView.setAdapter(arrayAdapter);
         //   int[] icons = {R.drawable.ic_sports, R.drawable.ic_events, R.drawable.ic_lab, R.drawable.ic_swimming};
            listviewClick(listView);
        }
        else {
            TextView emptyListview = (TextView)view.findViewById(R.id.no_content);
            emptyListview.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if(!rendered) {
            FeeManagementParentActivity feeManagement = (FeeManagementParentActivity) getActivity();
            feeManagement.renderData();
            rendered = true;
        }
    }

    public void customTooltip(final View view){

        final ImageView help = (ImageView)view.findViewById(R.id.help);
        help.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                TextView tooltip = (TextView)view.findViewById(R.id.textView53);
                tooltip.setText(R.string.parent_pending_fee);
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

    public void listviewClick(final ListView listview){
        listview.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                FeeManagement fees = (FeeManagement) listview.getItemAtPosition(position);
                Intent intent = new Intent(getActivity(), FeesDetailsActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable("FeesDetails", fees);
                bundle.putString("From", "Pending Fees");
                intent.putExtra("FeesDetailsBundle", bundle);
                startActivity(intent);
            }
        });
    }

    public void search(String text){
        if(arrayAdapter != null){
            if(dueFeeList.size() == 0)
                return;
            CharSequence s = text;
            Log.v("search","text"+text);
            arrayAdapter.getFilter().filter(s);
        }
    }
}
