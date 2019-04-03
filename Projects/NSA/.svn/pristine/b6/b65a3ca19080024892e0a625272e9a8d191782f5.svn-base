package nexrise.publication.in.nexrise.CustomHashMap;

import android.util.Log;

import java.util.ArrayList;

/**
 * Created by Karthik on 7/11/17.
 */

public class Initiater {

    private static Initiater initiater = new Initiater();
    private ArrayList<OnUpdateListener> listeners = new ArrayList<>();

    private Initiater() {

    }

    public static Initiater getInstance() {
        return initiater;
    }

    public void setOnUpdateListener(OnUpdateListener onUpdateListener) {
        listeners.add(onUpdateListener);
    }

    public void updated(String classId, String sectionId, String schoolId, String userId, String featureId, int count) {
        Log.v("Counter","Count"+count);
        for (OnUpdateListener listener: listeners) {
            listener.onUpdate(classId, sectionId, schoolId, userId, featureId, count);
        }
    }

    public void clearListener() {
        listeners.clear();
    }

    public void remove(OnUpdateListener updateListener) {
        try {
            if (listeners.contains(updateListener))
                listeners.remove(updateListener);
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
    }
}
