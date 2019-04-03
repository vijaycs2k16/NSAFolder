package nexrise.publication.in.nexrise.Attendence;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.support.v7.app.AlertDialog;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;
import android.widget.TextView;
import android.widget.Toast;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;

import nexrise.publication.in.nexrise.BeanClass.LeaveApproval;
import nexrise.publication.in.nexrise.BeanClass.LeaveDetails;
import nexrise.publication.in.nexrise.BeanClass.LeaveStatus;
import nexrise.publication.in.nexrise.BeanClass.Student;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link LeaveHistory.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link LeaveHistory#newInstance} factory method to
 * create an instance of this fragment.
 */
public class LeaveHistory extends Fragment implements Constants{
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    SharedPreferences preferences;
    public static boolean render = false;
    String username;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    List<String> listDataHeader;
    HashMap<String, List<Student>> listDataChild = new HashMap<>();
    LeaveStatus leavestatus;
    String leaveApplied;
    String leaveTaken;
    String reamainingLeave;
    View view;

    private OnFragmentInteractionListener mListener;

    public LeaveHistory() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment LeaveHistory.
     */
    // TODO: Rename and change types and number of parameters
    public static LeaveHistory newInstance(String param1, String param2) {
        LeaveHistory fragment = new LeaveHistory();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        username = preferences.getString(CURRENT_USERNAME,null);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (render)
            prepareData(view);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment

        view = inflater.inflate(R.layout.fragment_leave_history, container, false);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String username = preferences.getString(CURRENT_USERNAME,null);
        prepareData(view);
        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }
    public void prepareData(final View view){
        final ArrayList<LeaveDetails> leaveDetailsArrayList = new ArrayList<>();

        String leavesTaken = BASE_URL + API_VERSION_ONE + LEAVES + EMP + APPLY + username;
        GETUrlConnection leavesTakenUrl = new GETUrlConnection(getActivity(),leavesTaken,null);
        try {
            leaveApplied =leavesTakenUrl.execute().get();
            new StringUtils().checkSession(leaveApplied);
            JSONObject mainObject = new JSONObject(leaveApplied);
            JSONArray dataArray = mainObject.getJSONArray(DATA);
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            ArrayList<LeaveApproval> leaveApprovalArrayList = mapper.readValue(dataArray.toString(), TypeFactory.collectionType(List.class, LeaveApproval.class));
            LeaveDetails leaveDetails1 = new LeaveDetails();
            leaveDetails1.setName((String) getResources().getText(R.string.leave_applied));
            leaveDetails1.setData(leaveApprovalArrayList);
            leaveDetailsArrayList.add(leaveDetails1);

        } catch (JSONException | IOException | NullPointerException |InterruptedException | ExecutionException e) {
            e.printStackTrace();
        } catch (SessionExpiredException e) {
            e.handleException(getActivity());
        }
        String leavesApplied = BASE_URL + API_VERSION_ONE + LEAVES + EMP + TAKEN + username;
        GETUrlConnection leavesAppliedUrl = new GETUrlConnection(getActivity(),leavesApplied,null);

        try {
            leaveTaken =leavesAppliedUrl.execute().get();
            new StringUtils().checkSession(leavesTaken);
            JSONObject mainObject = new JSONObject(leaveTaken);
            JSONArray dataArray = mainObject.getJSONArray(DATA);
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            ArrayList<LeaveApproval> leaveApprovalArrayList = mapper.readValue(dataArray.toString(), TypeFactory.collectionType(List.class, LeaveApproval.class));
            LeaveDetails leaveDetails = new LeaveDetails();
            leaveDetails.setName((String) getResources().getText(R.string.leave_taken));
            leaveDetails.setData(leaveApprovalArrayList);
            leaveDetailsArrayList.add(leaveDetails);

        } catch (JSONException | IOException | NullPointerException |InterruptedException | ExecutionException e) {
            e.printStackTrace();
        } catch (SessionExpiredException e) {
            e.handleException(getActivity());
        }

        String remainingLeaves = BASE_URL + API_VERSION_ONE + LEAVES + EMP + REAMINING + username;
        GETUrlConnection remainingLeaveUrl = new GETUrlConnection(getActivity(),remainingLeaves,null);
        try {
            reamainingLeave =remainingLeaveUrl.execute().get();
            new StringUtils().checkSession(remainingLeaves);
            JSONObject mainObject = new JSONObject(reamainingLeave);
            JSONArray dataArray = mainObject.getJSONArray(DATA);
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            ArrayList<LeaveApproval> leaveApprovalArrayList = mapper.readValue(dataArray.toString(), TypeFactory.collectionType(List.class, LeaveApproval.class));
            LeaveDetails leaveDetails2 = new LeaveDetails();
            leaveDetails2.setName((String) getResources().getText(R.string.remaining_leaves));
            leaveDetails2.setData(leaveApprovalArrayList);
            leaveDetailsArrayList.add(leaveDetails2);

        } catch (JSONException | IOException | NullPointerException |InterruptedException | ExecutionException e) {
            e.printStackTrace();
        } catch (SessionExpiredException e) {
            e.handleException(getActivity());
        }
        listData(leaveDetailsArrayList,view);
    }

    public void listData(ArrayList<LeaveDetails> leaveDetailsArrayList,final View view){
        ExpandableListView expandableListView = (ExpandableListView) view.findViewById(R.id.fragment_status_listview);
        ApprovalDetailsAdapter approvalDetailsAdapter = new ApprovalDetailsAdapter(getActivity(),leaveDetailsArrayList);
        expandableListView.setAdapter(approvalDetailsAdapter);
        listviewClick(expandableListView);
    }

    public void listviewClick(final ExpandableListView expandableListView){

        expandableListView.setOnChildClickListener(new ExpandableListView.OnChildClickListener() {
            @Override
            public boolean onChildClick(ExpandableListView parent, View v, int groupPosition, int childPosition, long id) {
                Object listviewItem = expandableListView.getItemAtPosition(groupPosition);
                if(!(listviewItem instanceof LeaveDetails))
                    return false;
                try {
                    LeaveDetails leaveDetails = (LeaveDetails) listviewItem;
                    if (!leaveDetails.getName().equalsIgnoreCase("Remainig Leaves")) {
                        LeaveApproval leaveApproval = leaveDetails.getData().get(childPosition);
                        if (leaveApproval.getStatus().equalsIgnoreCase("Deny")) {
                            AlertDialog.Builder enterDescriptionBuilder = new AlertDialog.Builder(getActivity());
                            LayoutInflater layoutInflater = getLayoutInflater(null);
                            final View descriptionDialogView = layoutInflater.inflate(R.layout.description_show_dialog, null);
                            enterDescriptionBuilder.setView(descriptionDialogView);
                            TextView dialog_text = (TextView) descriptionDialogView.findViewById(R.id.dialog_text);
                            dialog_text.setText(leaveApproval.getLeaveReason());
                            enterDescriptionBuilder.setTitle(R.string.leave_denied);
                            enterDescriptionBuilder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(final DialogInterface dialog, int which) {
                                    dialog.dismiss();
                                }
                            });
                            enterDescriptionBuilder.show();
                        } else if (leaveApproval.getStatus().equalsIgnoreCase(PENDING)) {
                            Intent intent = new Intent(getActivity(), ApplyLeaveActivity.class);
                            intent.putExtra("LeaveData", leaveApproval);
                            intent.putExtra("Updatable", true);
                            startActivity(intent);
                        } else if (leaveApproval.getStatus().equalsIgnoreCase(CANCELLED)) {
                            Toast.makeText(getActivity(), R.string.leave_cancelled, Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(getActivity(), R.string.leave_approved, Toast.LENGTH_SHORT).show();
                        }
                    }
                } catch (IndexOutOfBoundsException e) {
                    return false;
                }
                return false;
            }
        });
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

    }

    @Override
    public void onDetach() {
        super.onDetach();

    }

    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }

}
