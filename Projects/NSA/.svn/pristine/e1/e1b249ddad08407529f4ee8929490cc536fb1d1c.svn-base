package nexrise.publication.in.nexrise.Gallery;

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
import android.widget.FrameLayout;
import android.widget.GridView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Album;
import nexrise.publication.in.nexrise.BeanClass.AlbumDetails;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.TimetableFeature.ViewNotesGridAdapter;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link PhotoFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link PhotoFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class PhotoFragment extends Fragment implements Constants {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    ArrayList<AlbumDetails> albumDetailsList;
    SharedPreferences preferences;

    private OnFragmentInteractionListener mListener;

    public PhotoFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment PhotoFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static PhotoFragment newInstance(String param1, String param2) {
        PhotoFragment fragment = new PhotoFragment();
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
     //   renderData(view);
        ArrayList<AlbumDetails> photosList = (ArrayList<AlbumDetails>) getArguments().getSerializable("Photos");
        FrameLayout frameLayout = (FrameLayout) view.findViewById(R.id.photo_frame_layout);
        RelativeLayout progressBarContainer = (RelativeLayout) view.findViewById(R.id.loading_bar_container);
        TextView noContent = (TextView) view.findViewById(R.id.no_content);

        if(photosList != null) {
            if(photosList.size()==0) {
                frameLayout.setVisibility(View.GONE);
                progressBarContainer.setVisibility(View.VISIBLE);
                noContent.setVisibility(View.VISIBLE);
            } else {
                GridView gridView = (GridView)view.findViewById(R.id.video_gridview);
                ViewNotesGridAdapter gridAdapter = new ViewNotesGridAdapter(getActivity(),R.layout.fragment_videos_grid_layout, photosList, "image");
                gridView.setAdapter(gridAdapter);
                gridviewClick(gridView);
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

    private void renderData(final View view) {
        preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String galleryUrl = BASE_URL + API_VERSION_ONE + GALLERY ;
        GETUrlConnection galleryCredential = new GETUrlConnection(getActivity(), galleryUrl,null){
            RelativeLayout progressBarLayout = (RelativeLayout)view.findViewById(R.id.progress_bar);
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.loading_bar);
            TextView noContent = (TextView)view.findViewById(R.id.no_content);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                if(progressBarLayout.getVisibility() == View.GONE)
                    progressBarLayout.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
            }
            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                Log.v("Album","response"+response);
                progressBar.setVisibility(View.INVISIBLE);
                progressBarLayout.setVisibility(View.GONE);
                try {
                    new StringUtils().checkSession(response);
                    albumDetailsList = albumParser(response);
                    GridView gridView = (GridView)view.findViewById(R.id.video_gridview);
                    ViewNotesGridAdapter gridAdapter = new ViewNotesGridAdapter(getActivity(),R.layout.fragment_videos_grid_layout, albumDetailsList, "image");
                    gridView.setAdapter(gridAdapter);
                    gridviewClick(gridView);
                } catch (NullPointerException | JSONException e) {
                    e.printStackTrace();
                    if(progressBarLayout.getVisibility() == View.GONE )
                        progressBarLayout.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.INVISIBLE);
                    noContent.setVisibility(View.VISIBLE);
                } catch (SessionExpiredException e) {
                    e.handleException(getActivity());
                }
            }
        };
        galleryCredential.execute();
    }

    public ArrayList<AlbumDetails> albumParser(String response) throws JSONException{
        ArrayList<AlbumDetails> albumList = new ArrayList<>();
        JSONObject mainObject = new JSONObject(response);
        String schoolId = preferences.getString(SCHOOL_ID,null);
        JSONArray dataArray = mainObject.getJSONArray(DATA);
        if(dataArray.length() == 0 )
            throw new JSONException("Empty Data");
        for (int i = 0; i < dataArray.length(); i++) {
            AlbumDetails albumDetails = new AlbumDetails();
            JSONObject dataObject = dataArray.getJSONObject(i);
            String album_id = dataObject.getString("album_id");
            String name = dataObject.getString("name");
            albumDetails.setAlbum_id(album_id);
            albumDetails.setName(name);

            JSONArray albumDetailsArray = dataObject.getJSONArray("albumDetails");
            ArrayList<Album> galleryFiles = new ArrayList<>();
            for(int j=0;j < albumDetailsArray.length();j++){
                JSONObject albumDetailsObject = albumDetailsArray.getJSONObject(j);
                Album album = new Album();
                String fileType = albumDetailsObject.getString("file_type");
                String mimeType = albumDetailsObject.getString("mimetype");
                String fileName = albumDetailsObject.getString("file_name");
                String file_url = "";
                if(fileType.equals("video"))
                    file_url = VIDEO_BASE_URL + albumDetailsObject.getString("file_url");
                else if(fileType.equals("image"))
                    file_url = AWS_BASE_URL  + schoolId + "/" +albumDetailsObject.getString("file_url");

                album.setFileFormat(fileType);
                album.setMimeType(mimeType);
                album.setFileName(fileName);
                album.setFileUrl(file_url);

                galleryFiles.add(album);
            }
            albumDetails.setAlbums(galleryFiles);
            albumList.add(albumDetails);
        }

        return albumList;
    }
    public void gridviewClick(final GridView gridView){
        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                AlbumDetails albumDetails = (AlbumDetails) gridView.getItemAtPosition(position);
                String albumId = albumDetails.getAlbum_id();
                Log.v("Album","Id"+albumId);
                Intent intent = new Intent(getActivity(), ImagesActivity.class);
                intent.putExtra("AlbumId",albumId);
                intent.putExtra("Album",albumDetails);
                intent.putExtra(ACTIONBAR_TITLE, "Photos");
                startActivity(intent);
            }
        });
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
}
