package nexrise.publication.in.nexrise.Common;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.support.v4.app.Fragment;

/**
 * Created by karthik on 8/23/17.
 */

public class BaseFragment extends Fragment {

    public boolean isConnected() {
        boolean status = true;
        try {
            ConnectivityManager connectivityManager = (ConnectivityManager) getActivity().getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
            if (networkInfo == null)
                status = false;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return status;
    }
}
