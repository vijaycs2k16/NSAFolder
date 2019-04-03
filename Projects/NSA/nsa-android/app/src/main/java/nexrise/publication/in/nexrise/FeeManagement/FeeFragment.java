package nexrise.publication.in.nexrise.FeeManagement;


import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;

import com.michael.easydialog.EasyDialog;

import org.json.JSONException;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.FeeManagement;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.JsonParser.FeesManagementJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

import static nexrise.publication.in.nexrise.Constants.API_VERSION_ONE;
import static nexrise.publication.in.nexrise.Constants.ASSIGN;
import static nexrise.publication.in.nexrise.Constants.BASE_URL;
import static nexrise.publication.in.nexrise.Constants.FEE;
import static nexrise.publication.in.nexrise.Constants.USERS;


/**
 * A simple {@link Fragment} subclass.
 */
public class FeeFragment extends Fragment {
    View view;
    ArrayList<FeeManagement> dueFeeList;
    ListView listView;

    public FeeFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view =  inflater.inflate(R.layout.fragment_fee, container, false);
        final Spinner spinner = (Spinner) view.findViewById(R.id.classspin);
        final Spinner spinner1 = (Spinner) view.findViewById(R.id.section_spin);
        String feecrendential = BASE_URL + API_VERSION_ONE + FEE + ASSIGN + USERS ;
        GETUrlConnection GETUrlConnection = new GETUrlConnection(getActivity(), feecrendential,null) {
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                try {
                    new StringUtils().checkSession(response);
                    Log.v("TeacherFee",""+ response);
                    FeesManagementJsonParser feesManagementJsonParser = new FeesManagementJsonParser();
                    feesManagementJsonParser.getFeeDetails(response);
                    listView = (ListView) view.findViewById(R.id.fee_defaulters_listview);
                    dueFeeList = FeesManagementJsonParser.dueFeeList;
                    FeeDefaultersArrayAdapter arrayAdapter = new FeeDefaultersArrayAdapter(getActivity(), dueFeeList);
                    listView.setAdapter(arrayAdapter);
                    listviewClick(listView);
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        GETUrlConnection.execute();
        ArrayAdapter<String> spinnerCategoryArrayAdapter = new ArrayAdapter<String>(getActivity(), android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.Class));
        spinner.setAdapter(spinnerCategoryArrayAdapter);
        ArrayAdapter<String> spinnerCategoryArrayAdapter1 = new ArrayAdapter<String>(getActivity(), android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.Section));
        spinner1.setAdapter(spinnerCategoryArrayAdapter1);
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            public void onItemSelected(AdapterView<?> parent, View view, int pos, long id) {
                String selectedclass = parent.getItemAtPosition(pos).toString();
                Log.v("selectedclass",""+selectedclass);
            }
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        spinner1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            public void onItemSelected(AdapterView<?> parent, View view, int pos, long id) {
                String selectedsection = parent.getItemAtPosition(pos).toString();
                Log.v("selectedsection",""+selectedsection);
            }
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        customTooltip(listView);
        return view;
    }
    public void customTooltip(ListView listView){
        final ImageView help = (ImageView) view.findViewById(R.id.help);
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
    public void listviewClick(final ListView listView){
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
}



