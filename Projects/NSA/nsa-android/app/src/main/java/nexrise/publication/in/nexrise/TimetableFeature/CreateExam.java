package nexrise.publication.in.nexrise.TimetableFeature;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.TextView;

import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.DueDateActivity;
import nexrise.publication.in.nexrise.ReusedActivities.DueTimeActivity;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link CreateExam#newInstance} factory method to
 * create an instance of this fragment.
 */
public class CreateExam extends Fragment {

    Spinner months;
   String months1[]={"January","Febrauary","March","April","May","June","July","August","September","October","November","December"};
    ArrayAdapter adaptermonth;
    static View textview;
    String date = " ";
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public CreateExam() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment CreateExam2.
     */
    // TODO: Rename and change types and number of parameters
    public static CreateExam newInstance(String param1, String param2) {
        CreateExam fragment = new CreateExam();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);





        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View rootView = inflater.inflate(R.layout.fragment_create_exam, container, false);
        TextView b = (TextView) rootView.findViewById(R.id.setdate);
        TextView c = (TextView) rootView.findViewById(R.id.settime);
      //  EditText d = (EditText) rootView.findViewById(R.id.dispaly);
        //EditText e = (EditText) rootView.findViewById(R.id.timedispaly);





        b.setOnClickListener(new View.OnClickListener()
        {
            public void onClick(View v)
            {
                Intent intent = new Intent(getActivity(), DueDateActivity.class);
                intent.putExtra("Activity", "CreateExam2");
                startActivityForResult(intent,6);


            }

        });
        c.setOnClickListener(new View.OnClickListener()
        {
            public void onClick(View v)
            {
                Intent intent = new Intent(getActivity(), DueTimeActivity.class);
                intent.putExtra("Activity","CreateExam2");
                startActivityForResult(intent,5);



            }


        });return rootView;



     /*  final List<String> months = new ArrayList<String>();
        View view = inflater.inflate(R.layout.fragment_create_exam2, container, false);
        final Spinner spinner = (Spinner) view.findViewById(R.id.monthspin);
        ArrayAdapter<CharSequence> dataAdapter1 =  ArrayAdapter.createFromResource(getActivity(), R.array.Months,
                android.R.layout.simple_spinner_item);
        dataAdapter1.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        //MonthAdapter adapter1 = new MonthAdapter(getActivity(),months);

        spinner.setAdapter(dataAdapter1);
        return view;*/

             //return null;  //return inflater.inflate(R.layout.fragment_create_exam2, container, false);
    }






    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        //startActivityForResult(dueTimeActivity, 3);

        TextView dueDate = (TextView) textview.findViewById(R.id.textView3);
        if(data.getIntExtra("Date", 0) != 0) {
            date = data.getIntExtra("Date", 0)+"/"+data.getIntExtra("Month", 0)+"/"+data.getIntExtra("Year", 0);
            dueDate.setText(date);
        }

        super.onActivityResult(5, resultCode, data);
     data.getStringArrayExtra("Hours");
        data.getStringArrayExtra("Minutes");


        super.onActivityResult(6,resultCode,data);
        data.getStringArrayExtra("Date");
        data.getStringArrayExtra("Month");
        data.getStringArrayExtra("Year");

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
