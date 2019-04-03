package nexrise.publication.in.nexrise.Common;

import android.support.multidex.MultiDexApplication;

import com.google.android.gms.analytics.GoogleAnalytics;
import com.google.android.gms.analytics.Tracker;

import nexrise.publication.in.nexrise.Constants;

/**
 * Created by karthik on 26-11-2016.
 */

public class ApplicationAnalytics extends MultiDexApplication implements Constants{
    Tracker tracker;

    synchronized public Tracker getDefaultTracker(){
        if(tracker == null){
            GoogleAnalytics googleAnalytics = GoogleAnalytics.getInstance(this);
            tracker = googleAnalytics.newTracker("UA-88089660-1");
        }
        return tracker;
    }
}
