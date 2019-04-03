package nexrise.publication.in.nexrise.ExamFeature;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.support.v7.widget.CardView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONException;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;

import nexrise.publication.in.nexrise.BeanClass.AttachmentDetails;
import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.ViewNotesActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link PortionsFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link PortionsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class PortionsFragment extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    RelativeLayout progressBarContainer;
    TextView noContent;
    WebView portions;
    TextView classSection;
    TextView attachmentCount;
    CardView cardView;
    ProgressBar progressBar;
    StringUtils utils;
    ImageView help;

    private OnFragmentInteractionListener mListener;

    public PortionsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment PortionsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static PortionsFragment newInstance(String param1, String param2) {
        PortionsFragment fragment = new PortionsFragment();
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
        View view = inflater.inflate(R.layout.fragment_portions, container, false);

        portions = (WebView)view.findViewById(R.id.portions);
        classSection = (TextView)view.findViewById(R.id.exam_name);
        attachmentCount = (TextView)view.findViewById(R.id.no_of_files);
        cardView = (CardView)view.findViewById(R.id.attachment_layout);
        progressBarContainer = (RelativeLayout)view.findViewById(R.id.loading_bar_container);
        noContent = (TextView)view.findViewById(R.id.no_content);
        progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
        utils = new StringUtils();
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());

        Bundle bundle = getArguments();
        if(utils.getUserRole(getActivity()).equalsIgnoreCase(EMPLOYEE) && bundle.containsKey(CLASS_NAME) && bundle.containsKey(SECTION_NAME)) {
            String className = bundle.getString(CLASS_NAME);
            String sectionName = bundle.getString(SECTION_NAME);
            classSection.setText(className + " - " + sectionName+" "+"  "+"("+preferences.getString(CURRENT_ACADEMIC_YEAR,ACADEMIC_YEAR)+")");
        } else if(utils.getUserRole(getActivity()).equalsIgnoreCase(PARENT)) {
            String username = preferences.getString(FIRST_NAME, null);
            classSection.setText(username);
        }

        if (bundle.containsKey("examObject")) {
            Exam exam = (Exam) bundle.getSerializable("examObject");
            renderData(exam);
        } else if(bundle.containsKey(SCHEDULE_ID)) {
            String scheduleId = bundle.getString(SCHEDULE_ID);
            fetchData(scheduleId);
        } else
            displayNothingToShow();

        customTooltip(view);
        return view;
    }

    private void customTooltip(View view) {
        help = (ImageView)view.findViewById(R.id.info);
        utils.customTooltip(getActivity(),help, (String) getResources().getText(R.string.portions));
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

    private void fetchData(String scheduleId) {
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
                    Exam exam = new ExamScheduleFragment().scheduleParser(response);
                    renderData(exam);
                } catch (NullPointerException | JSONException | ParseException e) {
                    displayNothingToShow();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getSchedule.execute();
    }

    private void renderData(Exam exam) {
        String portionDetails = exam.getPortionsDetails();
        if (portionDetails != null && !portionDetails.isEmpty() && !portionDetails.equals("null")) {
            String htmlText = "<html><body style=\"text-align:justify\"> %s </body></Html>";
            portionDetails = portionDetails.replaceAll("\n","<br/>");
            portionDetails = portionDetails.replaceAll("\t","&nbsp;&nbsp;&nbsp;&nbsp;");
            portions.loadData(String.format(htmlText, portionDetails), "text/html; charset=UTF-8", null);
        } else
            portions.setVisibility(View.GONE);

        ArrayList<AttachmentDetails> attachmentDetails = exam.getAttachments();
        if (attachmentDetails != null && attachmentDetails.size() != 0) {
            attachmentCount.setText(attachmentDetails.size() + " files");
            HashMap<String, String> attachments = new HashMap<>();
            for (int i=0; i<attachmentDetails.size(); i++) {
                attachments.put(attachmentDetails.get(i).getName(), attachmentDetails.get(i).getFileName());
            }
            attachmentHandler(attachments);
        } else
            cardView.setVisibility(View.GONE);

        if(portions.getVisibility() == View.GONE && cardView.getVisibility() == View.GONE)
            displayNothingToShow();
    }

    private void displayNothingToShow() {
        if(progressBarContainer.getVisibility() == View.GONE)
            progressBarContainer.setVisibility(View.VISIBLE);
        noContent.setVisibility(View.VISIBLE);
    }

    private void attachmentHandler(final HashMap<String, String> attachments) {
        if(cardView != null) {
            cardView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent intent = new Intent(getActivity(), ViewNotesActivity.class);
                    intent.putExtra(UPLOADED_IMAGES, attachments);
                    startActivity(intent);
                }
            });
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
