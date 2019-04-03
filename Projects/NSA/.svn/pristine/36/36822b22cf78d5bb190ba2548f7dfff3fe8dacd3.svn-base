package nexrise.publication.in.nexrise.TimetableFeature;

import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import nexrise.publication.in.nexrise.FragmentPagerAdapter.ClassTabbedFragmentAdapter;
import nexrise.publication.in.nexrise.R;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ClassTabbedFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ClassTabbedFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ClassTabbedFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public ClassTabbedFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ClassTabbedFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ClassTabbedFragment newInstance(String param1, String param2) {
        ClassTabbedFragment fragment = new ClassTabbedFragment();
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
        super.onSaveInstanceState(savedInstanceState);
        View view = inflater.inflate(R.layout.fragment_class_tabbed, container, false);

        ViewPager viewPager = (ViewPager)view.findViewById(R.id.class_fragment_pager);
        setUpViewPager(viewPager);

        TabLayout tabLayout = (TabLayout)view.findViewById(R.id.class_fragment_tablayout);
        tabLayout.setupWithViewPager(viewPager);

        ActionBar actionBar = ((AppCompatActivity)getActivity()).getSupportActionBar();

        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        String titles[] = {(String) getResources().getText(R.string.today), (String) getResources().getText(R.string.tomorrow), (String) getResources().getText(R.string.week)};

        int[] icon = {R.drawable.ic_today, R.drawable.ic_tomorrow, R.drawable.ic_week};
        for (int i=0 ; i<titles.length; i++){
            tabLayout.getTabAt(i).setText(titles[i]);
            tabLayout.getTabAt(i).setIcon(icon[i]);
        }

        return view;
    }


    @Override
    public void onViewStateRestored(@Nullable Bundle savedInstanceState) {
        super.onViewStateRestored(savedInstanceState);
    }

    @Override
    public void onResume() {
        super.onResume();
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

    public void setUpViewPager(ViewPager viewPager){

        WeeklyTimeTableFragment weeklyTimeTableFragment = new WeeklyTimeTableFragment();
        weeklyTimeTableFragment.setArguments(this.getArguments());

        TodayTimeTable todayTimeTable = new TodayTimeTable();
        todayTimeTable.setArguments(getArguments());

        TomorrowTimeTableFragment tomorrowTimeTableFragment = new TomorrowTimeTableFragment();
        tomorrowTimeTableFragment.setArguments(getArguments());

        ClassTabbedFragmentAdapter pagerAdapter = new ClassTabbedFragmentAdapter(getChildFragmentManager());
        pagerAdapter.addFragment(todayTimeTable, "Today");
        pagerAdapter.addFragment(tomorrowTimeTableFragment, "Tomorrow");
        pagerAdapter.addFragment(weeklyTimeTableFragment, "Week");

        viewPager.setAdapter(pagerAdapter);
    }
}

