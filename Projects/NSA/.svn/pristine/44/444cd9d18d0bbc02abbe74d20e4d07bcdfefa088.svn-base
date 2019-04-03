package nexrise.publication.in.nexrise.ExamFeature;

import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.Locale;

import nexrise.publication.in.nexrise.BeanClass.AttachmentDetails;
import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.BeanClass.ExamSubject;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ExamScheduleFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ExamScheduleFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ExamScheduleFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    RelativeLayout progressBarContainer;
    ProgressBar progressBar;
    TextView noContent;
    ListView listView;
    StringUtils utils;
    TextView classSection;

    private OnFragmentInteractionListener mListener;

    public ExamScheduleFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ExamScheduleFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ExamScheduleFragment newInstance(String param1, String param2) {
        ExamScheduleFragment fragment = new ExamScheduleFragment();
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
        View view = inflater.inflate(R.layout.fragment_exam_schedule, container, false);
        utils = new StringUtils();
        progressBarContainer = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
        progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
        noContent = (TextView)view.findViewById(R.id.no_content);
        listView = (ListView) view.findViewById(R.id.exam_details);
        Bundle bundle = getArguments();
        classSection = (TextView)view.findViewById(R.id.class_section);

        if (bundle.containsKey("examObject")) {
            Exam exam = (Exam) bundle.getSerializable("examObject");
            assert exam != null;
            renderData(exam, inflater);
        } else if(bundle.containsKey(SCHEDULE_ID)) {
            String scheduleId = bundle.getString(SCHEDULE_ID);
            fetchData(scheduleId, inflater);
        }
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());

        if(utils.getUserRole(getActivity()).equalsIgnoreCase(EMPLOYEE) && bundle.containsKey(CLASS_NAME) && bundle.containsKey(SECTION_NAME)) {
            String className = bundle.getString(CLASS_NAME);
            String sectionName = bundle.getString(SECTION_NAME);
            classSection.setText(className + " - " + sectionName+" "+"  "+"("+preferences.getString(CURRENT_ACADEMIC_YEAR,ACADEMIC_YEAR)+")");
        } else if(utils.getUserRole(getActivity()).equalsIgnoreCase(PARENT)) {
            String username = preferences.getString(FIRST_NAME, null);
            classSection.setText(username);
        }
        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
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

    private void fetchData(String scheduleId, final LayoutInflater inflater) {
        String url = BASE_URL + API_VERSION_ONE + EXAM + SCHEDULE + scheduleId;
        Log.v("Exam ","schedule url "+url);
        GETUrlConnection getSchedule = new GETUrlConnection(getActivity(), url, null) {
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBarContainer.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
                if(noContent.getVisibility()== View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    progressBar.setVisibility(View.INVISIBLE);
                    progressBarContainer.setVisibility(View.GONE);
                    utils.checkSession(response);
                    Log.v("EXAM"," ReSPONSE "+response);
                    Exam exam = scheduleParser(response);
                    ArrayList<ExamSubject> subjects = exam.getSubjectsList();
                    Collections.sort(subjects,new DatesComparator());
                    exam.setSubjectsList(subjects);
                    renderData(exam, inflater);
                } catch (NullPointerException | JSONException | ParseException e) {
                    if(progressBarContainer.getVisibility() == View.GONE)
                        progressBarContainer.setVisibility(View.VISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getSchedule.execute();
    }

    private void renderData(Exam exam, LayoutInflater inflater) {
        try {
            progressBarContainer.setVisibility(View.GONE);
            assert exam != null;
            ArrayList<ExamSubject> examSubject = exam.getSubjectsList();
            if(examSubject.size() == 0) {
                throw new JSONException("Empty list");
            }

            View footerView = inflater.inflate(R.layout.total_marks, listView, false);
            listView.addFooterView(footerView);
            TextView totalMarks = (TextView)listView.findViewById(R.id.total_mark);
            totalMarks.setText(exam.getTotalMarks());
            ExamDetailsArrayAdapter arrayAdapter = new ExamDetailsArrayAdapter(getActivity(), examSubject);
            listView.setAdapter(arrayAdapter);
        } catch (NullPointerException | JSONException e) {
            if(progressBarContainer.getVisibility() == View.GONE)
                progressBarContainer.setVisibility(View.VISIBLE);
            noContent.setVisibility(View.VISIBLE);
            classSection.setVisibility(View.GONE);
        }
    }

    protected Exam scheduleParser(String response) throws JSONException, NullPointerException, ParseException {
        JSONObject json = new JSONObject(response);
        JSONObject examObj = json.getJSONObject(DATA);
        StringUtils utils = new StringUtils();
        ExamActivity examActivity = new ExamActivity();

        int totalMarks = 0;
        JSONArray subjects = examObj.getJSONArray("schedule");
        Exam exam = new Exam();
        exam.setExamId(examObj.getString("written_exam_id"));
        exam.setScheduleId(examObj.getString("exam_schedule_id"));
        exam.setExamName(examObj.getString("written_exam_name"));
        Boolean status = examObj.getBoolean("status");

        String publishedDate = utils.examDate(examObj.getString("updated_date"));
        String[] updatedDate = publishedDate.split(",");
        exam.setPublishedDate(updatedDate[0]);

        ArrayList<ExamSubject> examSubjects = new ArrayList<>();
        if(status) {
            for (int j = 0; j < subjects.length(); j++) {
                ExamSubject examSubject = new ExamSubject();
                JSONObject subjectObj = subjects.getJSONObject(j);
                String subjectName = subjectObj.getString("subject_name");
                String startTime = subjectObj.getString("exam_start_time");
                String endTime = subjectObj.getString("exam_end_time");
                String mark = subjectObj.getString("mark");

                String date = utils.dateAndMonth(startTime);
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MMM dd yyyy", Locale.ENGLISH);
                Date date1 = simpleDateFormat.parse(startTime);
                SimpleDateFormat day = new SimpleDateFormat("EEE", Locale.ENGLISH);

                String date2 = day.format(date1);
                examSubject.setSubject_name(subjectName);

                examSubject.setDate(date);
                examSubject.setDay(date2);
                examSubject.setExamStartTime(utils.timeSet(startTime));
                examSubject.setExamEndTime(utils.timeSet(endTime));
                examSubject.setMark(mark);
                examSubjects.add(examSubject);

                totalMarks += Integer.valueOf(mark);
            }
            exam.setSubjectsList(examSubjects);
            exam.setTotalMarks(String.valueOf(totalMarks));

            if(examActivity.check(examObj, "portions")) {
                JSONObject portionsObj = examObj.getJSONObject("portions");
                if(portionsObj.length() > 0) {
                    String portionsDetails = portionsObj.getString("portion_details");
                    exam.setPortionsDetails(portionsDetails);
                    if (examActivity.check(portionsObj, "attachments")) {
                        JSONObject attachmentsObj = portionsObj.getJSONObject("attachments");
                        if (examActivity.check(attachmentsObj, "attachment")) {
                            JSONObject attachments = attachmentsObj.getJSONObject("attachment");
                            Iterator attachmentKeys = attachments.keys();
                            ArrayList<AttachmentDetails> attachmentsList = new ArrayList<>();
                            while (attachmentKeys.hasNext()) {
                                AttachmentDetails attachmentDetails = new AttachmentDetails();
                                String fileUrl = attachmentKeys.next().toString();
                                attachmentDetails.setName(fileUrl);
                                String fileName = attachments.getString(fileUrl);
                                attachmentDetails.setFileName(fileName);
                                attachmentsList.add(attachmentDetails);
                            }
                            exam.setAttachments(attachmentsList);
                        }
                    }
                }
            }
        } else
            throw new JSONException("Exam not published");

        return exam;
    }
    private class DatesComparator implements Comparator<ExamSubject> {
        @Override
        public int compare(ExamSubject o1, ExamSubject o2) {
            Date firstDate = new StringUtils().convertStringToDate(o1.getDate());
            Date secondDate = new StringUtils().convertStringToDate(o2.getDate());
            return firstDate.compareTo(secondDate);
        }
    }
}
