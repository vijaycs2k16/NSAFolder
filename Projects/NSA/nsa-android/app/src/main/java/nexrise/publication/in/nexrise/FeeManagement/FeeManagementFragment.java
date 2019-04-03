package nexrise.publication.in.nexrise.FeeManagement;


import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;

import org.json.JSONException;

import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.TabsPagerAdapter;
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
/*Created by praga3*/
public class FeeManagementFragment extends Fragment {
View view;

    public FeeManagementFragment() {
        // Required empty public constructor
    }
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.fragment_fee_management, container, false);

        String feecrendential = BASE_URL + API_VERSION_ONE + FEE + ASSIGN + USERS ;
        GETUrlConnection GETUrlConnection = new GETUrlConnection(getActivity(), feecrendential,null) {
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.notification_loading);

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                progressBar.setVisibility(View.GONE);
                try {
                    new StringUtils().checkSession(response);
                    Log.v("feeresponse","FeeManagement"+ response);

                    FeesManagementJsonParser feesManagementJsonParser = new FeesManagementJsonParser();
                                feesManagementJsonParser.getFeeDetails(response);
                    ViewPager vpPager = (ViewPager) view.findViewById(R.id.pager);
                    setUpViewPager(vpPager);

                    TabLayout tabLayout = (TabLayout) view.findViewById(R.id.tablayout);
                    tabLayout.setupWithViewPager(vpPager);

                    String[] tabTitle = {(String) getResources().getText(R.string.pending_fee),(String) getResources().getText(R.string.fee_history)};
                    for(int i=0; i<tabTitle.length; i++){
                        tabLayout.getTabAt(i).setText(tabTitle[i]);
                    }
                } catch (JSONException | NullPointerException e) {
                    e.printStackTrace();
                }catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        GETUrlConnection.execute();

    return view;
    }
    public void setUpViewPager(ViewPager viewPager){
        TabsPagerAdapter pagerAdapter = new TabsPagerAdapter(getChildFragmentManager());
        pagerAdapter.addFragment(new PendingFeesFragment(), "Pending Fees");
        pagerAdapter.addFragment(new FeeHistoryFragment(), "Fee History");
        viewPager.setAdapter(pagerAdapter);
    }
}
