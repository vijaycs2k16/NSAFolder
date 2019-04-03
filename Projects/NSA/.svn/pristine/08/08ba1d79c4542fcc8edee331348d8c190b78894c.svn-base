package nexrise.publication.in.nexrise.Gallery;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.FrameLayout;
import android.widget.GridView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.AlbumDetails;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.ViewNotesGridAdapter;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link VideoFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link VideoFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VideoFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public VideoFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment VideoFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static VideoFragment newInstance(String param1, String param2) {
        VideoFragment fragment = new VideoFragment();
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
        View view = inflater.inflate(R.layout.fragment_photo, container, false);
        ArrayList<AlbumDetails> videosList = (ArrayList<AlbumDetails>) getArguments().getSerializable("Videos");

        FrameLayout frameLayout = (FrameLayout) view.findViewById(R.id.photo_frame_layout);
        RelativeLayout progressBarContainer = (RelativeLayout) view.findViewById(R.id.loading_bar_container);
        TextView noContent = (TextView) view.findViewById(R.id.no_content);

        if(videosList != null) {
            if(videosList.size()==0) {
                frameLayout.setVisibility(View.GONE);
                progressBarContainer.setVisibility(View.VISIBLE);
                noContent.setVisibility(View.VISIBLE);
            } else {
                GridView gridView = (GridView)view.findViewById(R.id.video_gridview);
                ViewNotesGridAdapter gridAdapter = new ViewNotesGridAdapter(getActivity(),R.layout.fragment_videos_grid_layout, videosList, "video");
                gridView.setAdapter(gridAdapter);
                gridviewClickListener(gridView);
            }
        } else {
            frameLayout.setVisibility(View.GONE);
            progressBarContainer.setVisibility(View.VISIBLE);
            noContent.setVisibility(View.VISIBLE);
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

    private void gridviewClickListener(final GridView gridView) {
        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                AlbumDetails albumDetails = (AlbumDetails) gridView.getItemAtPosition(i);
                Intent intent = new Intent(getActivity(), ImagesActivity.class);
                intent.putExtra("Album", albumDetails);
                intent.putExtra(ACTIONBAR_TITLE, "Videos");
                startActivity(intent);
            }
        });
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
