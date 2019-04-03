package nexrise.publication.in.nexrise.ExamFeature;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.CustomHashMap.Initiater;
import nexrise.publication.in.nexrise.CustomHashMap.OnUpdateListener;
import nexrise.publication.in.nexrise.JsonParser.TaxanomyJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.AddClassFragmentAdapter;
import nexrise.publication.in.nexrise.TimetableFeature.AddSectionFragmentAdapter;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ExamFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ExamFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ExamFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    Boolean clicked = false;
    String  sectionId;
    String classId;
    String className;
    String sectionName;
    ArrayList<Classes> section;
    StringUtils utils;
    RelativeLayout progressBarContainer;
    TextView noContent;
    ProgressBar progressBar;
    ListView listView;
    View view;
    OnUpdateListener updateListener;
    Boolean dataRendered = false;
    String userRole;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public ExamFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ExamFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ExamFragment newInstance(String param1, String param2) {
        ExamFragment fragment = new ExamFragment();
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

        updateListener = new OnUpdateListener() {
            @Override
            public void onUpdate(String classId, String sectionId, String schoolId, String userId, String featureId, int count) {
                if(featureId.equals(CREATE_EXAM) && count != 0 && getActivity()!= null) {
                    if(getUserVisibleHint())
                        renderData();
                    else
                        dataRendered = false;
                }
            }
        };
        Initiater.getInstance().setOnUpdateListener(updateListener);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.activity_exam, container, false);
        utils = new StringUtils();
        userRole = utils.getUserRole(getActivity());
        progressBarContainer = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
        noContent = (TextView)view.findViewById(R.id.no_content);
        progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
        listView = (ListView)view.findViewById(R.id.exam_list);

        progressBarContainer.setVisibility(View.VISIBLE);
        noContent.setVisibility(View.VISIBLE);

        LinearLayout linearLayout = (LinearLayout)view.findViewById(R.id.classtimtable);

        if(userRole.equalsIgnoreCase(PARENT)) {
            /*this.getLayoutInflater().inflate(R.layout.tooltip_layout, linearLayout);
            TextView textView = (TextView)findViewById(R.id.textView53);
            textView.setTextColor(getResources().getColor(R.color.colorBlack));
            textView.setText("UPCOMING EXAMS");
            textView.setGravity(Gravity.CENTER_VERTICAL);*/
            linearLayout.setVisibility(View.GONE);
            SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
            classId = preferences.getString(CLASS_ID, null);
            sectionId = preferences.getString(SECTION_ID, null);
            renderData();
            dataRendered = true;
        } else
            setupSpinner();

        return view;
    }

    private void setupSpinner() {
        LinearLayout spinners = (LinearLayout)view.findViewById(R.id.classtimtable);
        if(spinners.getVisibility() == View.INVISIBLE || spinners.getVisibility() == View.GONE)
            spinners.setVisibility(View.VISIBLE);

        if (StringUtils.taxanomy == null) {
            String url = BASE_URL + API_VERSION_ONE + TAXANOMY ;

            GETUrlConnection getClassSection = new GETUrlConnection(getActivity(), url,null) {
                @Override
                protected void onPostExecute(String response) {
                    super.onPostExecute(response);
                    try {
                        new StringUtils().checkSession(response);
                        JSONObject responseJson = new JSONObject(response);
                        JSONArray classesArray = responseJson.getJSONArray(DATA);
                        Log.v("ClassDetails",""+ response);

                        StringUtils.taxanomy = classesArray;
                        TaxanomyJsonParser classListJsonparser = new TaxanomyJsonParser();
                        StringUtils.classList = classListJsonparser.getClassDetails(classesArray);

                        Log.v("vlass List", ""+StringUtils.classList);
                        renderClassSection(StringUtils.classList);
                    } catch (JSONException | NullPointerException e) {
                        Toast.makeText(getActivity(), R.string.oops, Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(getActivity());
                    }
                }
            };
            getClassSection.execute();
        } else {
            renderClassSection(StringUtils.classList);
        }
    }

    private void renderClassSection(final List<Classes> classList) {
        final Spinner classSpinner = (Spinner)view.findViewById(R.id.classSpinner);

        final List<Classes> classesWithNone = new StringUtils().insertNoneIntoClassSectionSpinner(classList);
        AddClassFragmentAdapter adapter = new AddClassFragmentAdapter(getActivity(), classesWithNone);
        classSpinner.setAdapter(adapter);

        classSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                classId = classesWithNone.get(position).getId();
                className = classesWithNone.get(position).getLabel();
                Log.v("class_id","current "+ className);
                final Classes selectedClass = classesWithNone.get(position);
                section = selectedClass.getSections();

                Log.v("class9",""+selectedClass.getSections().toString());
                AddSectionFragmentAdapter adapter = new AddSectionFragmentAdapter(getActivity(), section);

                final Spinner sectionSpinner = (Spinner)ExamFragment.this.view.findViewById(R.id.sectionSpinner);
                sectionSpinner.setAdapter(adapter);

                sectionSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, final View view, int position, long id) {
                        sectionId = section.get(position).getId();
                        sectionName = section.get(position).getLabel();
                        Log.v("Section","Id"+sectionId);
                        String classId = selectedClass.getId();

                        if(sectionId != null)
                            renderData();
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

    private void renderData() {
        String url = BASE_URL + API_VERSION_ONE + EXAM + SCHEDULE + CLASS + classId + SECTION + sectionId;
        Log.v("EXAM"," url  "+url);
        GETUrlConnection getExamSchedule = new GETUrlConnection(getActivity(), url, null) {
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                if(progressBarContainer.getVisibility() == View.GONE)
                    progressBarContainer.setVisibility(View.VISIBLE);
                if(noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    utils.checkSession(response);
                    progressBar.setVisibility(View.INVISIBLE);
                    progressBarContainer.setVisibility(View.GONE);
                    Log.v("EXAM"," ReSPONSE "+response);
                    JSONObject json = new JSONObject(response);
                    ArrayList<Exam> examList = new ExamActivity().jsonParser(json);

                    ExamListArrayAdapter arrayAdapter = new ExamListArrayAdapter(getActivity(), 0, examList);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView);
                } catch (NullPointerException | JSONException | ParseException e) {
                    e.printStackTrace();
                    if(progressBarContainer.getVisibility() == View.GONE)
                        progressBarContainer.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getExamSchedule.execute();
    }

    public void listviewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Exam exam = (Exam) listView.getItemAtPosition(position);
                Intent intent = new Intent(getActivity(), ExamDetailsActivity.class);
                intent.putExtra("examObject", exam);
                intent.putExtra(CLASS_NAME, className);
                intent.putExtra(SECTION_NAME, sectionName);
                intent.putExtra(EXAM_NAME, exam.getExamName());
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

    @Override
    public void onResume() {
        super.onResume();
        if(!dataRendered && userRole.equalsIgnoreCase(PARENT))
            renderData();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Initiater.getInstance().remove(updateListener);
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
