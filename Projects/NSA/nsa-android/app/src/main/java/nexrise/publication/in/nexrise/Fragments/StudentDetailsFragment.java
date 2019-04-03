package nexrise.publication.in.nexrise.Fragments;

import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import com.michael.easydialog.EasyDialog;

import org.json.JSONObject;

import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ProgressResult;
import nexrise.publication.in.nexrise.JsonFormation.ProgressReportJsonFormation;
import nexrise.publication.in.nexrise.JsonParser.ProgressResultJsonParser;
import nexrise.publication.in.nexrise.ProgressReportFeature.BarGraphFragment;
import nexrise.publication.in.nexrise.ProgressReportFeature.OverallReportActivity;
import nexrise.publication.in.nexrise.ProgressReportFeature.StudentReportTableFragment;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;

import static nexrise.publication.in.nexrise.Constants.PARENT;
import static nexrise.publication.in.nexrise.Constants.STUDENT;


public class StudentDetailsFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    View view;
    int selection = 2;
    Spinner spinner;
    private String examName;
    private List<ProgressResult> progressResultList;
    private ProgressResult progressResult;
    String studentName;

    private OnFragmentInteractionListener mListener;

    public StudentDetailsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment StudentDetailsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static StudentDetailsFragment newInstance(String param1, String param2) {
        StudentDetailsFragment fragment = new StudentDetailsFragment();
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
        view = inflater.inflate(R.layout.activity_student_details2, container, false);
        /*ActionBar actionBar = getSupportActionBar();
        progressResult = (ProgressResult)getIntent().getSerializableExtra("ProgressResult");
        String studentName = getIntent().getStringExtra("studentName");
        Log.v("Student name ","parent login "+studentName);
        if(actionBar!= null){
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeButtonEnabled(true);
            actionBar.setElevation(0);
            actionBar.setTitle("Progress report");
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);*/

        StudentReportTableFragment studentReportTableFragment = new StudentReportTableFragment();
        Bundle bundle = new Bundle();

        bundle.putSerializable("Results", getArguments().getSerializable("ProgressResult"));
        studentReportTableFragment.setArguments(bundle);

        TextView textView = (TextView) view.findViewById(R.id.textView42);
        textView.setText(progressResult.getClassname() + "th " + progressResult.getSection());

        String[] exams = {"Select exam", "Overall", "FA1", "FA2", "SA1"};
        spinner = (Spinner) view.findViewById(R.id.spinner);
        ArrayAdapter<String> arrayAdapter = new ArrayAdapter<String>(getActivity(), R.layout.support_simple_spinner_dropdown_item, exams);
        spinner.setAdapter(arrayAdapter);
        spinner.setSelection(selection);

        spinnerClickListener(spinner);

        TextView progressReport = (TextView)view.findViewById(R.id.progress_report_name);
        if (studentName != null) {
            progressReport.setText(studentName);
        } else {
            progressReport.setText("Ashmitha prakash");
        }
        imageButtonClick();
        customTooltip();
        return view;
    }
    @Override
    public void onResume(){
        super.onResume();
        spinner.setSelection(selection);
    }



    private void customTooltip() {
        final ImageView help = (ImageView)view.findViewById(R.id.help);
        if(StringUtils.userRole.equalsIgnoreCase(PARENT)){

            help.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                    TextView tooltip = (TextView)view.findViewById(R.id.textView53);
                    tooltip.setText("View your child’s academic progress card with graph statistics");
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
                            .setMarginLeftAndRight(44,34)
                            .show();
                }
            });
        }else if (StringUtils.userRole.equalsIgnoreCase(STUDENT)){
            help.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                    TextView tooltip = (TextView)view.findViewById(R.id.textView53);
                    tooltip.setText("Good Job! Your progress report. ");
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
                            .setMarginLeftAndRight(44,34)
                            .show();
                }
            });
        }
    }

    private void imageButtonClick() {
        final ImageButton tableView = (ImageButton)view.findViewById(R.id.table_view);
        final ImageButton graphView = (ImageButton)view.findViewById(R.id.graph_view);

        tableView.setColorFilter(Color.parseColor("#FF2794bf"));
        graphView.setColorFilter(Color.parseColor("#FFFFFFFF"));

        tableView.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
            @Override
            public void onClick(View v) {
                Bundle bundle = new Bundle();
                bundle.putSerializable("ProgressResult",progressResultList.get(0));
                StudentReportTableFragment studentReportTableFragment = new StudentReportTableFragment();
                studentReportTableFragment.setArguments(bundle);

                FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.student_details_frame, studentReportTableFragment);
                transaction.commit();

                tableView.setColorFilter(Color.parseColor("#FF2794bf"));
                graphView.setColorFilter(Color.parseColor("#FFFFFFFF"));

            }
        });

        graphView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Bundle bundle = new Bundle();
                bundle.putSerializable("ProgressResult",progressResultList.get(0));
                // From activity is passed to hide the textview which displays the student name, class and section because
                // parent/student displays the student name in actionbar itself not in the seperate textview
                bundle.putString("fromActivity","ParentStudentLogin");
                BarGraphFragment barGraphFragment = new BarGraphFragment();
                barGraphFragment.setArguments(bundle);

                FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.student_details_frame, barGraphFragment);
                transaction.commit();

                tableView.setColorFilter(Color.parseColor("#FFFFFFFF"));
                graphView.setColorFilter(Color.parseColor("#FF2794bf"));

            }
        });
    }

    private void spinnerClickListener(final Spinner spinner) {
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String exam = spinner.getItemAtPosition(position).toString();

                if(exam.equals("FA1")){
                    examName = "Formative assessment 1";
                }
                else if(exam.equals("FA2")){
                    examName = "Formative assessment 2";
                } else if (exam.equals("SA1")){
                    examName = "Summative assessment 1";
                }
                Bundle intent = getArguments();
                if(exam.equals("Overall")) {

                    Intent overallReportActivity = new Intent(getActivity(), OverallReportActivity.class);
                    overallReportActivity.putExtra("studentName",getArguments().getString("studentName"));
                    overallReportActivity.putExtra("className",getArguments().getString("className"));
                    overallReportActivity.putExtra("Name",progressResult.getName());
                    startActivity(overallReportActivity);

                }
                else if(!exam.equals("Select exam")) {
                    selection = position;
                    ProgressReportJsonFormation jsonFormation = new ProgressReportJsonFormation();
                    JSONObject progressJson = jsonFormation.formJson();
                    ProgressResultJsonParser parser = new ProgressResultJsonParser();
                    progressResultList = parser.parse(progressJson, examName);

                    Bundle bundle = new Bundle();
                    bundle.putSerializable("ProgressResult",progressResultList.get(0));
                    bundle.putString("studentName",getArguments().getString("studentName"));
                    bundle.putString("className",getArguments().getString("className"));
                    StudentReportTableFragment studentReportTableFragment = new StudentReportTableFragment();
                    studentReportTableFragment.setArguments(bundle);

                    FragmentTransaction transaction =getActivity().getSupportFragmentManager().beginTransaction();
                    transaction.replace(R.id.student_details_frame, studentReportTableFragment);
                    transaction.commit();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

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
