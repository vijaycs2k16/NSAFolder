package nexrise.publication.in.nexrise.HallOfFame;

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
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.HallOfFame;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link HallOfFameFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link HallOfFameFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class HallOfFameFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    ArrayList<HallOfFame> hallOfFameList;
    ListView listView;
    String userRole;
    HallOfFameArrayAdapter arrayAdapter;
    StringUtils stringUtils = new StringUtils();

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public HallOfFameFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment HallOfFameFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static HallOfFameFragment newInstance(String param1, String param2) {
        HallOfFameFragment fragment = new HallOfFameFragment();
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
        final View view = inflater.inflate(R.layout.activity_hall_of_fame, container, false);
        userRole = PreferenceManager.getDefaultSharedPreferences(getActivity()).getString(USER_ROLE,null);
        if (userRole.equalsIgnoreCase(EMPLOYEE))
            renderData(view);
        else
            parentData(view);
        //hallOfFameActivity(view);
        return view;
    }

    private void parentData(final View view) {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String username = preferences.getString(CURRENT_USERNAME,null);
        final String parentHallOfFame = BASE_URL + API_VERSION_ONE + HALL_OF_FAME + "/" +PARENT + "/" + username;
        GETUrlConnection getUrlConnection = new GETUrlConnection(getActivity(),parentHallOfFame,null) {
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("hallOfFame","parent"+response);
                try {
                    stringUtils.checkSession(response);
                    hallOfFameList = hallOfFameParse(response);
                    listView = (ListView)view.findViewById(R.id.hallOfFame_list_view);
                    arrayAdapter = new HallOfFameArrayAdapter(getActivity(),R.layout.hall_of_fame_layout,hallOfFameList);
                    listView.setAdapter(arrayAdapter);
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getUrlConnection.execute();
    }

    private void renderData(final View view) {
        final String hallOfFame = BASE_URL + API_VERSION_ONE + HALL_OF_FAME;
        GETUrlConnection getUrlConnection = new GETUrlConnection(getActivity(),hallOfFame,null) {
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute(){
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
                if (noContent.getVisibility() == View.VISIBLE)
                    noContent.setVisibility(View.INVISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("HallOf","Fame"+response);
                progressBar.setVisibility(View.GONE);
                try {
                    stringUtils.checkSession(response);
                    hallOfFameList = hallOfFameParse(response);
                    listView = (ListView)view.findViewById(R.id.hallOfFame_list_view);
                    arrayAdapter = new HallOfFameArrayAdapter(getActivity(),R.layout.hall_of_fame_layout,hallOfFameList);
                    listView.setAdapter(arrayAdapter);
                    listViewClick(listView);
                } catch (JSONException | NullPointerException e) {
                    noContent.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        getUrlConnection.execute();
    }

    private void listViewClick(final ListView listView) {
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                HallOfFame hallOfFameData = (HallOfFame)listView.getItemAtPosition(position);

                Intent intent = new Intent(getActivity(), HallOfFameDetailsActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable(NOTIFICATION_OBJECT, hallOfFameData);
                intent.putExtra(BUNDLE, bundle);
                startActivity(intent);

            }
        });
    }

    public ArrayList<HallOfFame> hallOfFameParse(String response)throws JSONException, NullPointerException{
        ArrayList<HallOfFame> hallOfFameData = new ArrayList<HallOfFame>();
        JSONObject jsonObject = new JSONObject(response);
        JSONArray data = jsonObject.getJSONArray(DATA);
        for (int i= 0;i<data.length();i++){
            JSONObject object = data.getJSONObject(i);
            String id = "";
            if(object.has("id"))
                id = object.getString("id");
            else if(object.has("hall_of_fame_id"))
                id = object.getString("hall_of_fame_id");

            String awardName = object.getString("award_name");
            String dateOfIssue = object.getString("date_of_issue");
            int students = object.getInt("number_of_students");
            String description = object.getString("description");

            HallOfFame hallOfFame = new HallOfFame();
            hallOfFame.setId(id);
            hallOfFame.setAward_name(awardName);
            hallOfFame.setDate_of_issue(dateOfIssue);
            hallOfFame.setNumber_of_students(students);
            if (!description.isEmpty() && description != null && !description.equalsIgnoreCase("null"))
                hallOfFame.setDescription(description);
            else
                hallOfFame.setDescription("-");
            hallOfFameData.add(hallOfFame);
        }
        return hallOfFameData;
    }

    /*private void hallOfFameActivity(View view) {
        LinearLayout student = (LinearLayout)view.findViewById(R.id.hall_of_fame);
        student.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent hallOfFame = new Intent(getActivity(), HallOfFameActivity.class);
                getActivity().startActivity(hallOfFame);
            }
        });
    }*/

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
