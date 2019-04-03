package nexrise.publication.in.nexrise.Fragments;

import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import nexrise.publication.in.nexrise.BeanClass.LoginObject;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.TabsPagerAdapter;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Activities.AlbumSelectFragment;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Activities.VideoAlbumSelectFragment;
import nexrise.publication.in.nexrise.Gallery.CustomGallery.Util.Constants;
import nexrise.publication.in.nexrise.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link GalleryViewFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link GalleryViewFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class GalleryViewFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    View view;
    LoginObject userObject;

    private OnFragmentInteractionListener mListener;

    public GalleryViewFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment GalleryViewFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static GalleryViewFragment newInstance(String param1, String param2) {
        GalleryViewFragment fragment = new GalleryViewFragment();
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
        view = inflater.inflate(R.layout.activity_gallery_view, container, false);
        Bundle args = getArguments();
        //userObject = (LoginObject) getArguments().getSerializable("userObject");
        /*ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setElevation(0);
            actionBar.setTitle("Gallery");
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }*/

        ViewPager viewPager = (ViewPager)view.findViewById(R.id.pager);
        setUpViewPager(viewPager);

        TabLayout tabLayout = (TabLayout)view.findViewById(R.id.tablayout);
        tabLayout.setupWithViewPager(viewPager);

        String[] tabTitle = {(String) getResources().getText(R.string.photos), (String) getResources().getText(R.string.videos)};
        for (int i = 0; i < tabTitle.length; i++) {
            tabLayout.getTabAt(i).setText(tabTitle[i]);
        }
        return view;
    }

    private void setUpViewPager(ViewPager viewPager) {
        TabsPagerAdapter pagerAdapter = new TabsPagerAdapter(getActivity().getSupportFragmentManager());
        AlbumSelectFragment albumSelectFragment = new AlbumSelectFragment();

        Bundle bundle = new Bundle();
        bundle.putInt(Constants.INTENT_EXTRA_LIMIT, 5);
        bundle.putSerializable("userObject",userObject);
        albumSelectFragment.setArguments(bundle);

        VideoAlbumSelectFragment videoAlbumSelectFragment = new VideoAlbumSelectFragment();
        videoAlbumSelectFragment.setArguments(bundle);

        pagerAdapter.addFragment(albumSelectFragment, "Photo");
        pagerAdapter.addFragment(videoAlbumSelectFragment, "Video");
        viewPager.setAdapter(pagerAdapter);
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
