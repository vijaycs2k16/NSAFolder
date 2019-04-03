package nexrise.publication.in.nexrise.Fragments;

import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.TextView;

import com.michael.easydialog.EasyDialog;

import java.util.List;

import nexrise.publication.in.nexrise.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link JournalFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link JournalFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class JournalFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    View view;
    List<Bitmap> bitmapList;

    private OnFragmentInteractionListener mListener;

    public JournalFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment JournalFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static JournalFragment newInstance(String param1, String param2) {
        JournalFragment fragment = new JournalFragment();
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
        view = inflater.inflate(R.layout.activity_journal_view, container, false);
        String[] list = {"Nex Rise","Annualday Report", "Robotics","HolidaysList","Annual sports meet", "Independence day", "Republic day" };
        Integer[] icons = {R.drawable.pdf, R.drawable.pdf, R.drawable.pdf, R.drawable.pdf, R.drawable.pdf,
                R.drawable.pdf, R.drawable.pdf};

        /*ActionBar actionBar = getSupportActionBar();

        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle("Journal Managemet");
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }*/
        customTooltip();
        return view;
    }

    private void customTooltip() {
        final ImageView help = (ImageView)view.findViewById(R.id.help);
        help.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                TextView tooltip = (TextView)view.findViewById(R.id.textView53);
                tooltip.setText("Weeklies and monthlies papers for you from  your school and nexrise");
                tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                new EasyDialog(getActivity()).setLayout(view)
                        .setLocationByAttachedView(help)
                        .setGravity(EasyDialog.GRAVITY_BOTTOM)
                        .setTouchOutsideDismiss(true)
                        .setMatchParent(false)
                        .setBackgroundColor(JournalFragment.this.getResources().getColor(R.color.colorGreen))
                        .setMarginLeftAndRight(44,34)
                        .show();
            }
        });
    }

    public void gridviewClick(GridView gridView){
        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
               /* Intent intent = new Intent(getActivity(), Journals.class);
                startActivity(intent);*/
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
