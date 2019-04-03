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
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.michael.easydialog.EasyDialog;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.BeanClass.FeeManagement;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.FeeManagement.FeeDefaultersArrayAdapter;
import nexrise.publication.in.nexrise.FeeManagement.FeeDefaultersDetailsActivity;
import nexrise.publication.in.nexrise.JsonParser.FeesManagementJsonParser;
import nexrise.publication.in.nexrise.JsonParser.TaxanomyJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.AddClassFragmentAdapter;
import nexrise.publication.in.nexrise.TimetableFeature.AddSectionFragmentAdapter;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link FeeManagementEmployeeFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link FeeManagementEmployeeFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class FeeManagementEmployeeFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    View view;
    ArrayList<FeeManagement> dueFeeList;
    ArrayList<Classes> classList;
    ArrayList<Classes> section;
    ListView listView;
    String  sectionId;
    String classid;
    String notesClassId;
    String notesSectionId;
    String fromDate = "";
    String toDate = "";
    EditText reason;
    TextView from;
    TextView to;

    private OnFragmentInteractionListener mListener;

    public FeeManagementEmployeeFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment FeeManagementEmployeeFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static FeeManagementEmployeeFragment newInstance(String param1, String param2) {
        FeeManagementEmployeeFragment fragment = new FeeManagementEmployeeFragment();
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
        view = inflater.inflate(R.layout.fragment_fee, container, false);
        String Class = BASE_URL + API_VERSION_ONE + TAXANOMY ;
        TextView textView = (TextView)view.findViewById(R.id.study_value);

        textView.setText(R.string.fee_defaulters);
        GETUrlConnection url = new GETUrlConnection(getActivity(), Class,null) {
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    new StringUtils().checkSession(response);
                    JSONObject responseJson = new JSONObject(response);
                    JSONArray classesArray = responseJson.getJSONArray("data");
                    Log.v("ClassDetails", "" + response);
                    TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                    StringUtils.classList = classListJsonparser.getClassDetails(classesArray);
                    Log.v("vlass List", "" + classList);
                    setUpClassSpinner(StringUtils.classList);
                } catch (JSONException |NullPointerException e) {
                    e.printStackTrace();
                    Toast.makeText(getActivity(), R.string.oops, Toast.LENGTH_SHORT).show();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        url.execute();
        customTooltip(listView);
        return view;
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        //startActivityForResult(dueTimeActivity, 3);
        if (requestCode == 2 || requestCode == 4) {
            if (data.getIntExtra("Date", 0) != 0) {
                fromDate = data.getIntExtra("Date", 0) + "/" + data.getIntExtra("Month", 0) + "/" + data.getIntExtra("Year", 0);
                from.setText(new StringUtils().DisplayDate(fromDate));
            }
            Log.v("On activity ", "result Due date " + data.getIntExtra("Date", 0));
            Log.v("On activity ", "result Due month " + data.getIntExtra("Month", 0));
            Log.v("On activity ", "result Due year " + data.getIntExtra("Year", 0));
        }

        if (requestCode == 3 || requestCode == 5) {
            if (data.getIntExtra("Date", 0) != 0) {
                toDate = data.getIntExtra("Date", 0) + "/" + data.getIntExtra("Month", 0) + "/" + data.getIntExtra("Year", 0);
                to.setText(new StringUtils().DisplayDate(toDate));
            }
            Log.v("On activity ", "result Due date " + data.getIntExtra("Date", 0));
            Log.v("On activity ", "result Due month " + data.getIntExtra("Month", 0));
            Log.v("On activity ", "result Due year " + data.getIntExtra("Year", 0));
        }
    }

    private void customTooltip(ListView listView) {
        final ImageView help = (ImageView)view.findViewById(R.id.help);
        help.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                View view =getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                TextView tooltip = (TextView)view.findViewById(R.id.textView53);
                tooltip.setText(R.string.fee_notify);

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

    private void setUpClassSpinner(final List<Classes> classList) {
        final Spinner spinner = (Spinner)view.findViewById(R.id.classspin);

        AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(getActivity(), classList);
        spinner.setAdapter(adapter);

        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                classid = classList.get(position).getId();
                Log.v("class_id","current "+classid);
                Classes selectedClass = classList.get(position);
                section = selectedClass.getSections();
                Log.v("class9",""+selectedClass.getSections());
                AddSectionFragmentAdapter adapter1 = new AddSectionFragmentAdapter(getActivity(), section);
                final Spinner spinner1 = (Spinner)view.findViewById(R.id.section_spin);
                spinner1.setAdapter(adapter1);
                    spinner1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, final View view, int position, long id) {
                        sectionId = section.get(position).getId();
                        Log.v("section_id","current"+sectionId);
                        String feecrendential = BASE_URL + API_VERSION_ONE + FEE + DETAILS + classid + "/" + sectionId ;
                        GETUrlConnection GETUrlConnection = new GETUrlConnection(getActivity(), feecrendential,null) {
                            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.progress_bar);
                            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
                            TextView noContent = (TextView)view.findViewById(R.id.no_content);

                            @Override
                            protected void onPreExecute() {
                                super.onPreExecute();
                                progressBarLayout.setVisibility(View.VISIBLE);
                                progressBar.setVisibility(View.VISIBLE);
                                if(noContent.getVisibility() == View.VISIBLE)
                                    noContent.setVisibility(View.INVISIBLE);
                            }

                            @Override
                            protected void onPostExecute(String response) {
                                super.onPostExecute(response);
                                Log.v("RESPONSE "," "+response);
                                progressBar.setVisibility(View.INVISIBLE);
                                try {
                                    new StringUtils().checkSession(response);
                                    progressBarLayout.setVisibility(View.GONE);
                                    Log.v("TeacherFee",""+ response);
                                    FeesManagementJsonParser feesManagementJsonParser = new FeesManagementJsonParser();
                                    feesManagementJsonParser.getFeeDetails(response);
                                    listView = (ListView)view.findViewById(R.id.fee_defaulters_listview);
                                    dueFeeList = FeesManagementJsonParser.dueFeeList;
                                    FeeDefaultersArrayAdapter arrayAdapter = new FeeDefaultersArrayAdapter(getActivity(), dueFeeList);
                                    listView.setAdapter(arrayAdapter);
                                    listviewClick(listView);

                                } catch (JSONException  | NullPointerException e ) {
                                    e.printStackTrace();
                                    if (progressBarLayout.getVisibility() == View.GONE || progressBarLayout.getVisibility() ==View.INVISIBLE)
                                        progressBarLayout.setVisibility(View.VISIBLE);
                                    noContent.setVisibility(View.VISIBLE);
                                } catch (SessionExpiredException e) {
                                    e.handleException(getActivity());
                                }
                            }
                        };
                        GETUrlConnection.execute();
                        Log.v("Spinner "," "+sectionId);
                    }

                    @Override
                    public void onNothingSelected(AdapterView<?> parent) {
                    }
                });
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
    }

    private void listviewClick(final ListView listView) {
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                FeeManagement feeDefaulters = (FeeManagement) listView.getItemAtPosition(position);
                Intent intent = new Intent(getActivity(), FeeDefaultersDetailsActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable("FeeDefaulters",feeDefaulters);
                intent.putExtra("bundle",bundle);
                startActivity(intent);
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
