package nexrise.publication.in.nexrise.URLConnection;

import android.os.AsyncTask;

import org.jsoup.Jsoup;

import java.io.IOException;

/**
 * Created by Karthik on 6/27/2017.
 */

public class VersionCodeUrlConnection extends AsyncTask<Void, String, String> {
    private String packageName;

    protected VersionCodeUrlConnection(String packageName) {
        this.packageName = packageName;
    }

    @Override
    protected String doInBackground(Void... params) {
        String newVersion = null;
        try {
            newVersion = Jsoup.connect("https://play.google.com/store/apps/details?id=" + packageName)
                    .timeout(10000)
                    .userAgent("Mozilla/5.0 (Windows; U; WindowsNT 5.1; en-US; rv1.8.1.6) Gecko/20070725 Firefox/2.0.0.6")
                    .referrer("http://www.google.com")
                    .get()
                    .select("div[itemprop=softwareVersion]")
                    .first()
                    .ownText();
            return newVersion;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
